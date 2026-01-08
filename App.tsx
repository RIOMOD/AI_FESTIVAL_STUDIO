import React, { useState, useCallback, useMemo } from 'react';
import { CONCEPTS } from './constants';
import { CONCEPT_DETAILS } from './conceptDetails';
import type { UploadedFile } from './types';
import FileUpload from './components/FileUpload';
import ToggleSwitch from './components/ToggleSwitch';
import ResultDisplay from './components/ResultDisplay';
import { CogIcon, SparklesIcon, PhotoIcon, AdjustmentsIcon } from './components/icons';
import { generateImage } from './services/geminiService';

export default function App(): React.ReactElement {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [analyzeFace, setAnalyzeFace] = useState(true);
  const [removeBg, setRemoveBg] = useState(false);
  
  const [concepts] = useState<string[]>(CONCEPTS);
  const [selectedConcept, setSelectedConcept] = useState<string>(concepts[0]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [numberOfImages, setNumberOfImages] = useState<number>(2);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile({
        file: file,
        base64: (reader.result as string).split(',')[1],
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedFile || !selectedConcept) return;

    setIsLoading(true);
    setGeneratedImages(null);
    setError(null);

    const basePrompt = `Professional high-end photography for festival: "${selectedConcept}". 
      Artistic style: Cinematic, magazine quality, sharp focus, vibrant colors.
      Details: ${additionalDetails || 'Natural beauty'}.
      ${removeBg ? 'Studio background, isolated subject, clean environment.' : 'Authentic festival atmosphere.'}
      ${analyzeFace ? 'Preserve facial features and identity accurately.' : ''}
      Aspect Ratio: ${aspectRatio}. 8k resolution, photorealistic.`;
    
    try {
      const results: string[] = [];
      for (let i = 0; i < numberOfImages; i++) {
        const specificPrompt = i % 2 === 0 
          ? `${basePrompt} Close-up portrait focus.` 
          : `${basePrompt} Medium shot with environmental details.`;
        
        const imageB64 = await generateImage(uploadedFile.base64, uploadedFile.mimeType, specificPrompt);
        results.push(`data:image/png;base64,${imageB64}`);
      }
      setGeneratedImages(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, selectedConcept, analyzeFace, removeBg, additionalDetails, numberOfImages, aspectRatio]);

  const conceptDetail = useMemo(() => CONCEPT_DETAILS[selectedConcept], [selectedConcept]);

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="brand-title text-4xl md:text-5xl font-bold mb-2">AI FESTIVAL STUDIO</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-sky-400" />
            Biến khoảnh khắc thành kiệt tác nghệ thuật
          </p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <a href="https://9R.Com.Vn" target="_blank" className="px-4 py-2 glass-card rounded-full hover:bg-white/5 transition">9R.Com.Vn</a>
          <div className="px-4 py-2 glass-card rounded-full text-sky-400 border-sky-500/30">Hotline: 0909.357.553</div>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Workflow Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Step 1: Upload */}
          <section className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">1</span>
              <h2 className="font-bold text-lg uppercase tracking-wider text-slate-200">Ảnh Gốc</h2>
            </div>
            <FileUpload
              file={uploadedFile}
              onFileSelect={handleFileChange}
              onFileRemove={() => setUploadedFile(null)}
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <ToggleSwitch label="Giữ Nét Mặt" enabled={analyzeFace} setEnabled={setAnalyzeFace} />
              <ToggleSwitch label="Tách Nền" enabled={removeBg} setEnabled={setRemoveBg} />
            </div>
          </section>

          {/* Step 2: Theme */}
          <section className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">2</span>
              <h2 className="font-bold text-lg uppercase tracking-wider text-slate-200">Chủ Đề</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {concepts.map((concept) => (
                <button
                  key={concept}
                  onClick={() => setSelectedConcept(concept)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    selectedConcept === concept
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </div>
          </section>

          {/* Step 3: Refine */}
          <section className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">3</span>
              <h2 className="font-bold text-lg uppercase tracking-wider text-slate-200">Tùy Chỉnh</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Chi tiết bổ sung</label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder={conceptDetail?.placeholder || "Mô tả thêm trang phục, bối cảnh..."}
                  className="w-full h-24 bg-black/30 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Số lượng</label>
                  <div className="flex gap-2">
                    {[2, 4].map(n => (
                      <button 
                        key={n} 
                        onClick={() => setNumberOfImages(n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold ${numberOfImages === n ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {n} Ảnh
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tỷ lệ</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-slate-800 border-none rounded-lg py-2 text-sm font-bold"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="3:4">3:4 Classic</option>
                    <option value="9:16">9:16 Story</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={!uploadedFile || isLoading}
            className="w-full py-5 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xl shadow-2xl shadow-sky-500/30 hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-6 h-6"></span> ĐANG SÁNG TẠO...</>
            ) : (
              <><SparklesIcon className="w-6 h-6" /> TẠO ẢNH NGAY</>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="xl:col-span-8">
          <ResultDisplay isLoading={isLoading} generatedImages={generatedImages} error={error} />
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2025 AI Festival Studio by 9R. Cung cấp bởi Google Gemini Vision Engine.</p>
      </footer>
    </div>
  );
}

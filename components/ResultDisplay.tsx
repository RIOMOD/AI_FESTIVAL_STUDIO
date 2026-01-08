import React, { useState } from 'react';
import { PhotoIcon, DownloadIcon, EyeIcon, CloseIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImages: string[] | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImages, error }) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[600px] glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-sky-400 animate-pulse" />
            </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Đang vẽ lại kỷ niệm của bạn...</h3>
        <p className="text-slate-400 max-w-sm">Trí tuệ nhân tạo đang phân tích ánh sáng và phong cách lễ hội để tạo ra kết quả tốt nhất.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[600px] glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-red-400">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <CloseIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-800 rounded-full text-white font-bold hover:bg-slate-700 transition">Thử lại</button>
      </div>
    );
  }

  if (!generatedImages) {
    return (
      <div className="w-full h-full min-h-[600px] glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group">
        <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
            <PhotoIcon className="w-16 h-16 text-slate-600 group-hover:text-sky-500 transition-colors" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-slate-300">Sẵn sàng sáng tác</h3>
        <p className="text-slate-500 max-w-md">Sau khi bạn nhấn "Tạo ảnh", các tác phẩm nghệ thuật sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {generatedImages.map((img, idx) => (
          <div key={idx} className="group relative glass-card p-2 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500">
            <img 
              src={img} 
              alt={`AI Gen ${idx}`} 
              className="w-full aspect-square md:aspect-auto object-cover rounded-[1.8rem] cursor-pointer"
              onClick={() => setSelectedImg(img)}
            />
            <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
              <button 
                onClick={() => setSelectedImg(img)}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <EyeIcon className="w-6 h-6" />
              </button>
              <a 
                href={img} 
                download={`ai-studio-${idx}.png`}
                className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-400 transition shadow-lg"
              >
                <DownloadIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition">
            <CloseIcon className="w-10 h-10" />
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl scale-in" 
            onClick={e => e.stopPropagation()} 
          />
          <div className="absolute bottom-10 flex gap-4">
             <a 
              href={selectedImg} 
              download="ai-festival-artwork.png"
              className="px-8 py-3 bg-sky-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-sky-400 transition"
            >
              <DownloadIcon className="w-5 h-5" /> TẢI ẢNH CHẤT LƯỢNG CAO
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;

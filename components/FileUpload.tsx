import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import type { UploadedFile } from '../types';

interface FileUploadProps {
  file: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileSelect, onFileRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selectedFile: File | null) => {
    if (selectedFile && ['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type) && selectedFile.size <= 15 * 1024 * 1024) {
      onFileSelect(selectedFile);
    } else {
        alert('Vui lòng chọn file ảnh JPG, PNG, WebP và dung lượng dưới 15MB.');
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    // Avoid triggering click if there's a file already
    if (!file) {
      document.getElementById('file-input')?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <div className="relative w-full">
        <div className="w-full max-h-[400px] flex justify-center items-center bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-600 p-1">
          <img
            src={`data:${file.mimeType};base64,${file.base64}`}
            alt="Preview ảnh gốc"
            className="block w-full h-full max-h-[390px] object-contain rounded-lg"
          />
        </div>
        <button
          onClick={onFileRemove}
          className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-sky-400 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold hover:bg-slate-900 hover:text-sky-300 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Xóa ảnh"
          title="Xóa ảnh"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-300 cursor-pointer
        ${isDragging ? 'border-sky-400 bg-slate-700/50' : 'border-slate-600 bg-slate-800'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
      />
      <div className="flex flex-col items-center justify-center space-y-2 text-sky-400">
        <UploadIcon className="w-10 h-10 text-sky-400" />
        <p className="font-semibold">Kéo thả hoặc chọn ảnh</p>
        <p className="text-xs text-sky-500">JPG, PNG, WebP (tối đa 15MB)</p>
        <p className="text-xs text-sky-500">Khuyến nghị ảnh rõ mặt, đủ sáng</p>
      </div>
    </div>
  );
};

export default FileUpload;
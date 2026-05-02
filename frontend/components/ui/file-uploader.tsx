"use client";
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Video, Music, Archive, Moon, Sun } from 'lucide-react';
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
  uploadedAt: Date;
}

const FileUploader = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext!)) return <Image className="w-4 h-4" />;
    if (['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(ext!)) return <Video className="w-4 h-4" />;
    if (['mp3', 'wav', 'flac', 'ogg', 'aac'].includes(ext!)) return <Music className="w-4 h-4" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext!)) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const clearAllFiles = () => setUploadedFiles([]);

  const downloadFile = (file: UploadedFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalSize = () => uploadedFiles.reduce((total, file) => total + file.size, 0);

  const themeClasses = {
    background: isDarkMode ? 'bg-[#020617]' : 'bg-gray-50', // Vivarily Laciverti
    cardBg: isDarkMode ? 'bg-slate-900/40 backdrop-blur-xl' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-slate-400' : 'text-gray-600',
    border: isDarkMode ? 'border-white/10' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100',
    uploadArea: isDragOver 
      ? (isDarkMode ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-400')
      : (isDarkMode ? 'bg-slate-800/30 border-white/5' : 'bg-gray-50 border-gray-300'),
    fileBg: isDarkMode ? 'bg-white/5' : 'bg-gray-50'
  };

  return (
    <div className={cn("w-full transition-colors duration-300", themeClasses.background)}>
      <div className="max-w-4xl mx-auto p-6">
        <div className={cn("rounded-[32px] shadow-2xl border transition-all duration-500", themeClasses.cardBg, themeClasses.border)}>
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={cn("text-2xl font-black tracking-tight", themeClasses.text)}>File Uploader</h1>
                  <p className={cn("text-xs font-bold uppercase tracking-widest opacity-60", themeClasses.textSecondary)}>Secure Analysis Hub</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn("p-3 rounded-xl border transition-all hover:scale-105", themeClasses.border, themeClasses.inputBg, themeClasses.text)}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Statistics */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={cn("p-4 rounded-2xl border", themeClasses.fileBg, themeClasses.border)}>
                  <div className={cn("text-xl font-bold", themeClasses.text)}>{uploadedFiles.length}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Files</div>
                </div>
                <div className={cn("p-4 rounded-2xl border", themeClasses.fileBg, themeClasses.border)}>
                  <div className={cn("text-xl font-bold", themeClasses.text)}>{formatFileSize(getTotalSize())}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Total Size</div>
                </div>
                <button onClick={clearAllFiles} className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  Clear All
                </button>
              </div>
            )}

            {/* Drag and Drop Area */}
            <div
              className={cn("relative border-2 border-dashed rounded-[32px] p-12 text-center transition-all duration-300", themeClasses.uploadArea)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} multiple className="hidden" />
              <div className="relative z-10 flex flex-col items-center">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-xl", isDragOver ? 'bg-blue-600 scale-110' : 'bg-slate-700')}>
                  <Upload className="text-white" size={28} />
                </div>
                <h3 className={cn("text-xl font-bold mb-2", themeClasses.text)}>
                  {isDragOver ? 'Dosyayı buraya bırakın' : 'Kanıt Yükle (Fatura, Fiş veya Görsel)'}
                </h3>
              <p className={cn("text-sm text-center max-w-xs", themeClasses.secondary)}>
                 Sürükleyip bırakın veya seçmek için tıklayın
              </p>
              
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8 space-y-3">
                {uploadedFiles.map(file => (
                  <div key={file.id} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all hover:bg-white/5", themeClasses.border, themeClasses.fileBg)}>
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-bold truncate text-sm", themeClasses.text)}>{file.name}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-tighter">{formatFileSize(file.size)} • {file.type || 'Unknown'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadFile(file)} className="p-2 hover:text-blue-500 transition-colors"><Upload size={14} className="rotate-180" /></button>
                      <button onClick={() => removeFile(file.id)} className="p-2 hover:text-red-500 transition-colors"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
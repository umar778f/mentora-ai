import React, { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileText, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeUpload({ onAnalyze }: { onAnalyze: (file: File) => void }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    await onAnalyze(file);
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="analyze">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight mb-2">Upload Your Profile</h2>
          <p className="text-slate-400 text-sm">PDF or DOCX for instant AI feedback.</p>
        </div>

        {!file ? (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center bg-white/5 hover:border-purple-500/50 cursor-pointer transition-all group",
              isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10"
            )}
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.txt,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
              <UploadCloud className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Click or drag and drop</p>
            <p className="text-xs text-slate-500">PDF, TXT, DOC up to 5MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full p-6 border border-white/10 rounded-xl bg-white/5 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-white px-3 py-1 text-sm transition-colors"
                disabled={isAnalyzing}
              >
                Change
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full font-medium flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Run AI Analysis</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

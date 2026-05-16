import React from 'react';
import { motion } from 'motion/react';
import { Target, AlertCircle, Lightbulb, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalysisData {
  atsScore: number;
  summary: string;
  missingSkills: string[];
  tips: string[];
  improvements: string[];
}

export function AnalysisResults({ data }: { data: AnalysisData }) {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* ATS Score Card */}
      <div className="glass-card p-6 flex items-center gap-6 lg:col-span-1">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
            <motion.circle
              initial={{ strokeDasharray: "0, 300" }}
              animate={{ strokeDasharray: `${(data.atsScore / 100) * 283}, 300` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              className="text-purple-500"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-white">{data.atsScore}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Score</span>
           </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {data.atsScore >= 80 ? 'Excellent Match' : 
             data.atsScore >= 60 ? 'Good Fit' : 'Needs Work'}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {data.atsScore >= 80 ? 'Your resume is highly compatible with the target position.' : 
             'We found some areas for improvement to pass ATS filters.'}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {/* Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Summary</h3>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">{data.summary}</p>
        </div>

        {/* Missing Skills */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Missing Keywords / Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div className="glass-card p-6 lg:col-span-3">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Roadmap to Improvement</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Resume Tips</h4>
            {data.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{tip}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Structural Fixes</h4>
            {data.improvements.map((imp, i) => (
              <div key={i} className="flex gap-3 items-start">
                <ChevronRight className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{imp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

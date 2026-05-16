import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-6 leading-tight max-w-4xl"
        >
          Your Personal  AI Career Mentor
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-slate-400 mb-10 max-w-2xl"
        >
          Optimize your resume and navigate your career path with industry-leading AI analysis. Upload your resume for instant insights.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a href="#analyze" className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 text-lg">
            Scan My Resume <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#roadmap" className="px-8 py-4 rounded-full glass-card text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-lg">
            View Career Roadmaps
          </a>
        </motion.div>
      </div>
    </div>
  );
}

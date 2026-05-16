import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="h-16 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md border-b border-white/5 shrink-0 fixed top-0 w-full z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            Mentora AI
          </span>
        </div>
        
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm font-medium text-slate-400">
          <a href="#analyze" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Roadmaps</a>
          <a href="#interview" className="hover:text-white transition-colors">Interviews</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 hidden sm:block"></div>
        </div>
      </div>
    </nav>
  );
}

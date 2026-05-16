import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Route, CheckCircle2, ChevronDown, Map, Server, Code, Palette, Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLES = [
  { id: 'Frontend Developer', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'Backend Developer', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'AI Engineer', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'UI/UX Designer', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-400/10' },
];

export function CareerRoadmap() {
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRoadmap = async (role: string) => {
    setIsLoading(true);
    setSelectedRole(role);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      setRoadmap(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6" id="roadmap">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight mb-2">Career Roadmap</h2>
        <p className="text-slate-400 text-sm">Select a path to generate a personalized timeline of required skills, projects, and interview tips.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 relative z-10">
        {ROLES.map(({ id, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => generateRoadmap(id)}
            className={cn(
              "p-4 rounded-xl flex items-center gap-3 transition-all",
              selectedRole === id 
                ? "bg-purple-500/20 border border-purple-500/40" 
                : "bg-white/5 border border-white/5 hover:border-white/20 opacity-60 hover:opacity-100"
            )}
          >
            <Icon className={cn("w-5 h-5 hidden sm:block", selectedRole === id ? "text-purple-400" : "text-slate-400")} />
            <span className={cn("text-sm font-medium", selectedRole === id ? "text-white" : "text-slate-300")}>{id}</span>
            {selectedRole === id && <div className="w-2 h-2 rounded-full bg-purple-400 ml-auto hidden sm:block"></div>}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-slate-400 text-sm">Generating your personalized roadmap...</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isLoading && roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Essential Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.requiredSkills.map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/10">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 opacity-80">Interview Prep</h3>
                <ul className="space-y-4">
                  {roadmap.interviewQuestions.map((q: string, i: number) => (
                    <li key={i} className="text-xs text-slate-400 leading-relaxed border-l-2 border-purple-500/50 pl-3">
                      "{q}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Your Career Roadmap</h3>
                
                <div className="relative">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-800"></div>
                  <div className="space-y-6">
                    {roadmap.learningSteps.map((step: any, i: number) => (
                      <div key={i} className="relative pl-8">
                        <div className={cn("absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-[#050508]", i === 0 ? "bg-purple-500" : "bg-slate-700")}></div>
                        <h4 className={cn("text-sm font-bold text-white", i !== 0 && "opacity-80")}>{step.title}</h4>
                        <p className={cn("text-xs text-slate-400 mt-1", i !== 0 && "opacity-80")}>{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-6">Portfolio Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roadmap.projectIdeas.map((proj: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                      <h4 className="font-medium text-purple-300 mb-2">{proj.title}</h4>
                      <p className="text-sm text-slate-400">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

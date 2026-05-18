import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResumeUpload } from './components/ResumeUpload';
import { AnalysisResults, type AnalysisData } from './components/AnalysisResults';
import { CareerRoadmap } from './components/CareerRoadmap';
import { MockInterview } from './components/MockInterview';

export default function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      setAnalysisData(data);
    } catch (e) {
      console.error(e);
      alert('Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] font-sans text-slate-200 relative overflow-x-hidden flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />
      
      <main className="mt-16">
        <Hero />
        
        <div className="px-6 py-20 relative z-10">
          <ResumeUpload onAnalyze={handleAnalyze} />
          {analysisData && (
            <div className="mt-12">
              <AnalysisResults data={analysisData} />
            </div>
          )}
        </div>

        <div className="border-t border-white/5 bg-transparent">
          <CareerRoadmap />
        </div>

        <div className="border-t border-white/5 bg-transparent">
          <MockInterview />
        </div>
      </main>

      <footer className="border-t border-white/5 px-8 h-10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 bg-black/20 shrink-0">
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
        <div>
          <div>
  © {new Date().getFullYear()} AI Career & Resume Mentor. All rights reserved.
</div>
        </div>
      </footer>
    </div>
  );
}


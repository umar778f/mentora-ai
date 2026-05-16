import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

export function MockInterview() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Hi! I'm your AI Interviewer. I'll be asking you technical questions for your upcoming interview. Shall we begin?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6" id="interview">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Mock Interview</h2>
        <p className="text-slate-400 text-lg">Practice your responses with an AI recruiter.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Interview Simulation</h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
              )}
              
              <div className={`p-4 max-w-[85%] text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 rounded-2xl rounded-tr-none text-white' 
                  : 'bg-white/10 rounded-2xl rounded-tl-none text-slate-200'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
              <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '75ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 mt-auto">
          <form onSubmit={sendMessage} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-white disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

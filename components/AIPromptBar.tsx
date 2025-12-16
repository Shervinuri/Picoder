import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

interface AIPromptBarProps {
  onGenerate: (prompt: string) => void;
  isProcessing: boolean;
}

const AIPromptBar: React.FC<AIPromptBarProps> = ({ onGenerate, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500">
      <label className="block text-xs font-mono text-emerald-500/80 uppercase tracking-widest pl-2">
        Ai PICoder editing by prompt:
      </label>
      
      <div className="bg-zinc-900/40 border border-emerald-500/20 rounded-[1.5rem] p-1.5 backdrop-blur-xl shadow-lg relative overflow-hidden group">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 relative z-10">
          <div className="pl-4 pr-2 text-emerald-400">
            <Wand2 size={20} className={isProcessing ? "animate-spin" : ""} />
          </div>
          
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe changes (e.g., 'Make it cyberpunk', 'Remove background')..."
            className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-500 text-sm focus:ring-0 focus:outline-none py-3 font-mono"
            disabled={isProcessing}
          />

          <button 
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className={`w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center font-bold text-xl
              ${!prompt.trim() || isProcessing 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95'}`}
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <span>☬</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPromptBar;
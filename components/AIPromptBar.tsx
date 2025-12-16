import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

interface AIPromptBarProps {
  onGenerate: (prompt: string) => void;
  isProcessing: boolean;
  hasImage: boolean;
}

const AIPromptBar: React.FC<AIPromptBarProps> = ({ onGenerate, isProcessing, hasImage }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && hasImage) {
      onGenerate(prompt);
    }
  };

  return (
    <div className={`space-y-2 animate-in slide-in-from-bottom-4 duration-500 transition-opacity ${hasImage ? 'opacity-100' : 'opacity-60 grayscale'}`}>
      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest pl-2">
        Ai PICoder editing by prompt:
      </label>
      
      <form onSubmit={handleSubmit} className="flex items-stretch gap-3">
        {/* Input Container */}
        <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-[1.5rem] p-1.5 backdrop-blur-xl shadow-lg relative overflow-hidden group focus-within:border-zinc-500/30 transition-colors">
          <div className="flex items-center gap-2 relative z-10">
            <div className="pl-4 pr-2 text-zinc-500 group-focus-within:text-zinc-200 transition-colors">
              <Wand2 size={20} className={isProcessing ? "animate-spin" : ""} />
            </div>
            
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={hasImage ? "Describe changes (e.g., 'Make it cyberpunk')..." : "Please upload an image first..."}
              className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 text-sm focus:ring-0 focus:outline-none py-3 font-mono"
              disabled={isProcessing || !hasImage}
            />
          </div>
        </div>

        {/* External Send Button - Right Side */}
        <button 
          type="submit"
          disabled={!prompt.trim() || isProcessing || !hasImage}
          className={`w-14 rounded-[1.5rem] transition-all duration-300 flex items-center justify-center font-bold text-xl border border-white/5
            ${!prompt.trim() || isProcessing || !hasImage
              ? 'bg-zinc-900/40 text-zinc-700 cursor-not-allowed' 
              : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 shadow-lg active:scale-95'}`}
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <span className="pb-1">☬</span>}
        </button>
      </form>
    </div>
  );
};

export default AIPromptBar;
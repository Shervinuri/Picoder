import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

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
    <div className={`space-y-2 animate-in slide-in-from-bottom-4 duration-500 transition-opacity ${hasImage ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
      <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest pl-2 mb-2">
        <Sparkles size={12} /> AI Magic Editor
      </label>
      
      <form onSubmit={handleSubmit} className="flex items-stretch gap-3">
        {/* Send Button - High Contrast Gradient */}
        <button 
          type="submit"
          disabled={!prompt.trim() || isProcessing || !hasImage}
          className={`w-16 flex-shrink-0 rounded-2xl transition-all duration-300 flex items-center justify-center border
            ${!prompt.trim() || isProcessing
              ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed' 
              : 'bg-gradient-to-br from-emerald-500 to-cyan-600 border-emerald-400/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95'}`}
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Wand2 size={24} />}
        </button>

        {/* Input Container - Deep Dark Inset */}
        <div className="flex-1 bg-[#050505] border border-zinc-800 rounded-2xl p-1 shadow-inner group focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={hasImage ? "Ex: Remove background, make it cyberpunk..." : "Upload an image to start AI..."}
            className="w-full h-full bg-transparent border-none text-zinc-200 placeholder-zinc-600 px-4 text-sm focus:ring-0 focus:outline-none font-medium"
            disabled={isProcessing || !hasImage}
          />
        </div>
      </form>
    </div>
  );
};

export default AIPromptBar;
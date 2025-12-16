import React from 'react';
import { Settings2, RotateCcw, RotateCw, ArrowLeftRight, ArrowUpDown, Square, Circle, LayoutTemplate } from 'lucide-react';
import { ImageSettings, MaskType } from '../types';

interface SettingsPanelProps {
  settings: ImageSettings;
  onChange: (newSettings: Partial<ImageSettings>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative Shine */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32"></div>

      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5 relative z-10">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Settings2 size={18} className="text-zinc-300" />
        </div>
        <h3 className="font-bold text-zinc-200 tracking-wide">Configuration</h3>
      </div>
      
      <div className="space-y-8 relative z-10">
        
        {/* Transform & Masking Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Transformation Controls */}
          <div className="space-y-3">
             <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Transform</label>
             <div className="grid grid-cols-4 gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                {/* Rotate Left */}
                <button
                  onClick={() => onChange({ rotation: settings.rotation - 90 })}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-1"
                  title="Rotate Left 90°"
                >
                  <RotateCcw size={16} />
                  <span className="text-[10px] hidden xl:block">Left</span>
                </button>

                {/* Rotate Right */}
                <button
                  onClick={() => onChange({ rotation: settings.rotation + 90 })}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-1"
                  title="Rotate Right 90°"
                >
                  <RotateCw size={16} />
                  <span className="text-[10px] hidden xl:block">Right</span>
                </button>

                {/* Flip Horizontal */}
                <button
                  onClick={() => onChange({ flipH: !settings.flipH })}
                  className={`p-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1
                    ${settings.flipH ? 'bg-zinc-700 text-emerald-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                  title="Mirror Horizontal"
                >
                  <ArrowLeftRight size={16} />
                  <span className="text-[10px] hidden xl:block">Flip H</span>
                </button>

                {/* Flip Vertical */}
                <button
                  onClick={() => onChange({ flipV: !settings.flipV })}
                  className={`p-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1
                    ${settings.flipV ? 'bg-zinc-700 text-emerald-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                  title="Mirror Vertical"
                >
                  <ArrowUpDown size={16} />
                  <span className="text-[10px] hidden xl:block">Flip V</span>
                </button>
             </div>
          </div>

          {/* Masking */}
          <div className="space-y-3">
             <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Shape / Crop</label>
             <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 h-[58px] items-center">
                {[
                  { id: 'none', icon: Square, label: 'Full' },
                  { id: 'circle', icon: Circle, label: 'Circle' },
                  { id: 'rounded', icon: LayoutTemplate, label: 'Round' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onChange({ mask: m.id as MaskType })}
                    className={`flex-1 py-3 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2
                      ${settings.mask === m.id 
                        ? 'bg-zinc-700 text-white shadow-lg' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                  >
                    <m.icon size={14} />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Rounded Radius Slider (Only if rounded) */}
        {settings.mask === 'rounded' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex justify-between text-xs text-zinc-400 font-mono">
               <span>Corner Radius</span>
               <span>{settings.borderRadius}%</span>
             </div>
             <input 
               type="range" min="0" max="100" 
               value={settings.borderRadius} 
               onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) })}
               className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200 hover:accent-white"
             />
          </div>
        )}

        {/* Quality & Width */}
        <div className="space-y-6 pt-4 border-t border-white/5">
          <div className="group">
            <label className="flex justify-between text-xs text-zinc-500 mb-3 font-mono uppercase tracking-widest">
              <span>Compression (Quality)</span>
              <span className="text-zinc-300">{Math.round(settings.quality * 100)}%</span>
            </label>
            <input 
              type="range" min="0.1" max="1" step="0.05" 
              value={settings.quality} 
              onChange={(e) => onChange({ quality: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200 hover:accent-white transition-all"
            />
          </div>

          <div className="group">
            <label className="flex justify-between text-xs text-zinc-500 mb-3 font-mono uppercase tracking-widest">
              <span>Max Width</span>
              <span className="text-zinc-300">{settings.maxWidth}px</span>
            </label>
            <input 
              type="range" min="100" max="1920" step="50" 
              value={settings.maxWidth} 
              onChange={(e) => onChange({ maxWidth: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200 hover:accent-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
import React from 'react';
import { Settings2, RotateCcw, RotateCw, ArrowLeftRight, ArrowUpDown, Square, Circle, LayoutTemplate, Undo2, Redo2, MousePointer2 } from 'lucide-react';
import { ImageSettings, MaskType } from '../types';

interface SettingsPanelProps {
  settings: ImageSettings;
  onChange: (newSettings: Partial<ImageSettings>, commit?: boolean) => void;
  onCommit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onChange, 
  onCommit, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}) => {
  
  const handleChange = (newSettings: Partial<ImageSettings>, commit = false) => {
    onChange(newSettings, commit);
  };

  return (
    <div className="bg-[#0f0f12] border border-zinc-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-inner">
              <Settings2 size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">Studio Controls</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Fine Tune</p>
            </div>
        </div>
        
        {/* Undo / Redo - Explicitly labeled for clarity */}
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-2.5 rounded-lg transition-all flex items-center justify-center relative group
                    ${canUndo 
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:border-zinc-600 border border-transparent shadow-lg' 
                        : 'text-zinc-600 cursor-not-allowed opacity-50'}`}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 size={18} />
                {canUndo && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>}
            </button>
            
            <div className="w-px h-6 bg-zinc-800"></div>

            <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-2.5 rounded-lg transition-all flex items-center justify-center relative group
                    ${canRedo 
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:border-zinc-600 border border-transparent shadow-lg' 
                        : 'text-zinc-600 cursor-not-allowed opacity-50'}`}
                title="Redo (Ctrl+Y)"
            >
                <Redo2 size={18} />
                {canRedo && <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>}
            </button>
        </div>
      </div>
      
      <div className="space-y-8">
        
        {/* Transform & Shape Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Transform */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
               <RotateCw size={12} /> Transform
             </label>
             <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleChange({ rotation: settings.rotation - 90 }, true)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white p-3 rounded-xl transition-all flex justify-center"
                  title="Rotate Left"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => handleChange({ rotation: settings.rotation + 90 }, true)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white p-3 rounded-xl transition-all flex justify-center"
                  title="Rotate Right"
                >
                  <RotateCw size={18} />
                </button>
                <button
                  onClick={() => handleChange({ flipH: !settings.flipH }, true)}
                  className={`border p-3 rounded-xl transition-all flex justify-center
                    ${settings.flipH ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="Flip H"
                >
                  <ArrowLeftRight size={18} />
                </button>
                <button
                  onClick={() => handleChange({ flipV: !settings.flipV }, true)}
                  className={`border p-3 rounded-xl transition-all flex justify-center
                    ${settings.flipV ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="Flip V"
                >
                  <ArrowUpDown size={18} />
                </button>
             </div>
          </div>

          {/* Mask Shape */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
               <LayoutTemplate size={12} /> Crop Shape
             </label>
             <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                {[
                  { id: 'none', icon: Square, label: 'Full' },
                  { id: 'circle', icon: Circle, label: 'Circle' },
                  { id: 'rounded', icon: LayoutTemplate, label: 'Box' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleChange({ mask: m.id as MaskType }, true)}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                      ${settings.mask === m.id 
                        ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' 
                        : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <m.icon size={14} />
                    <span>{m.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Controls */}
        {settings.mask !== 'none' && (
           <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800/50 space-y-4 animate-in fade-in slide-in-from-top-2">
              
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                 <MousePointer2 size={16} className="animate-bounce" />
                 <span className="text-xs font-bold tracking-wide">INTERACTIVE MODE ACTIVE</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                 Drag the box on the image to move. Drag the corner handle to resize.
              </p>

              {settings.mask === 'rounded' && (
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-xs font-bold text-zinc-300">
                     <span>Corner Radius</span>
                     <span>{settings.borderRadius}%</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={settings.borderRadius} 
                     onChange={(e) => handleChange({ borderRadius: parseInt(e.target.value) })}
                     onMouseUp={onCommit}
                     onTouchEnd={onCommit}
                     className="w-full h-2 bg-black rounded-full appearance-none cursor-pointer accent-emerald-500"
                   />
                </div>
              )}
           </div>
        )}

        {/* Global Settings */}
        <div className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="space-y-3">
            <label className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Quality / Compression</span>
              <span className="text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">{Math.round(settings.quality * 100)}%</span>
            </label>
            <input 
              type="range" min="0.1" max="1" step="0.05" 
              value={settings.quality} 
              onChange={(e) => handleChange({ quality: parseFloat(e.target.value) })}
              onMouseUp={onCommit}
              onTouchEnd={onCommit}
              className="w-full h-2 bg-black rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-colors"
            />
          </div>

          <div className="space-y-3">
            <label className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Max Width</span>
              <span className="text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">{settings.maxWidth}px</span>
            </label>
            <input 
              type="range" min="100" max="1920" step="50" 
              value={settings.maxWidth} 
              onChange={(e) => handleChange({ maxWidth: parseInt(e.target.value) })}
              onMouseUp={onCommit}
              onTouchEnd={onCommit}
              className="w-full h-2 bg-black rounded-full appearance-none cursor-pointer accent-white hover:accent-cyan-400 transition-colors"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;
import React, { useRef } from 'react';
import { Upload, Scan, Trash2, ImagePlus } from 'lucide-react';
import { ProcessedImage } from '../types';

interface DropZoneProps {
  file: ProcessedImage | null;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ file, isLoading, onFileSelect, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className={`relative overflow-hidden rounded-[2rem] h-72 transition-all duration-500 group border
        ${file 
          ? 'border-zinc-700/50 bg-black/40' 
          : 'border-zinc-800/80 hover:border-zinc-500/50 bg-zinc-900/30 hover:bg-zinc-900/50 cursor-pointer shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]'}`}
      onClick={() => !file && fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]);
      }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} 
      />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-black/50 z-20">
           <div className="relative w-16 h-16 mb-4">
             <div className="absolute inset-0 border-4 border-zinc-700 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-t-white border-transparent rounded-full animate-spin"></div>
           </div>
           <p className="text-zinc-300 font-mono text-sm tracking-widest uppercase animate-pulse">Processing...</p>
        </div>
      ) : file ? (
        <div className="w-full h-full relative group/preview">
          <img 
            src={file.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain p-6 transition-all duration-500 group-hover/preview:scale-[1.02] drop-shadow-2xl" 
          />
          
          {/* Floating Controls */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover/preview:translate-y-0">
             <button 
               onClick={(e) => { e.stopPropagation(); onClear(); }}
               className="bg-black/60 hover:bg-red-500/90 text-white p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-90"
             >
               <Trash2 size={18} />
             </button>
          </div>
          
          {/* Info Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 text-xs text-zinc-300 font-mono shadow-xl opacity-0 group-hover/preview:opacity-100 transition-all duration-500 delay-100">
            {file.name}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-3xl flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-t border-white/10 group-hover:scale-110 transition-transform duration-500">
            <Upload className="text-zinc-300" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-zinc-200 mb-2">Upload Image</h3>
          <p className="text-zinc-500 text-sm font-medium">Drag & Drop or Click to Browse</p>
        </div>
      )}
    </div>
  );
};

export default DropZone;
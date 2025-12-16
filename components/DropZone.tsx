import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, Move, Maximize, ScanLine } from 'lucide-react';
import { ProcessedImage, ImageSettings } from '../types';

interface DropZoneProps {
  file: ProcessedImage | null;
  isLoading: boolean;
  settings: ImageSettings;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onUpdateSettings: (newSettings: Partial<ImageSettings>) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ file, isLoading, settings, onFileSelect, onClear, onUpdateSettings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Crop State
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialSettings, setInitialSettings] = useState({ x: 0, y: 0, zoom: 1 });

  // Handle Dragging the Crop Box (Panning)
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, type: 'move' | 'resize') => {
    if (settings.mask === 'none') return;
    
    e.stopPropagation();
    e.preventDefault(); // Prevent scrolling on touch

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setStartPos({ x: clientX, y: clientY });
    setInitialSettings({ 
      x: settings.maskX || 0, 
      y: settings.maskY || 0,
      zoom: settings.maskZoom || 1
    });

    if (type === 'move') setIsDragging(true);
    if (type === 'resize') setIsResizing(true);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging && !isResizing) return;
      if (!imageRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;

      // Calculate scale factor between rendered image and actual internal canvas logic
      // In processImage, we translate center. 
      // Here we just map pixel movement directly to offset for simplicity, 
      // but ideally this depends on the render scale.
      // Let's amplify the movement slightly for better feel or keep 1:1
      
      if (isDragging) {
        onUpdateSettings({
          maskX: initialSettings.x + deltaX,
          maskY: initialSettings.y + deltaY
        });
      }

      if (isResizing) {
        // Dragging right/down increases zoom (scale)
        // Sensitivity factor
        const zoomDelta = (deltaX + deltaY) / 300; 
        const newZoom = Math.max(0.2, Math.min(3.0, initialSettings.zoom + zoomDelta));
        onUpdateSettings({ maskZoom: newZoom });
      }
    };

    const handleUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, isResizing, startPos, initialSettings, onUpdateSettings]);


  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-[2rem] h-[400px] transition-all duration-300 group select-none
        ${file 
          ? 'bg-black border-2 border-zinc-800' 
          : 'bg-[#0f0f12] border-2 border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-[#15151a] cursor-pointer shadow-inner'}`}
      onClick={() => !file && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} 
      />
      
      {/* Background Grid Pattern (High Contrast) */}
      {!file && (
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>
      )}

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
           <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
           <p className="text-emerald-400 font-bold tracking-widest uppercase animate-pulse">Processing...</p>
        </div>
      ) : file ? (
        <div className="w-full h-full relative flex items-center justify-center p-4 bg-[#050505]">
          
          {/* Main Image */}
          <img 
            ref={imageRef}
            src={file.previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain pointer-events-none"
            style={{
               // Apply visual transforms to match output roughly (masking handles the cut, but rotation mirrors shown here)
               transform: `rotate(${settings.rotation}deg) scaleX(${settings.flipH ? -1 : 1}) scaleY(${settings.flipV ? -1 : 1})`,
               transition: isDragging || isResizing ? 'none' : 'transform 0.3s ease'
            }}
          />

          {/* INTERACTIVE CROP OVERLAY */}
          {settings.mask !== 'none' && (
             <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                {/* Visual Guide Box */}
                <div 
                  className={`border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-auto cursor-move relative
                    ${settings.mask === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                  style={{
                    width: `${Math.min(300, 300 * (settings.maskZoom || 1))}px`,
                    height: `${Math.min(300, 300 * (settings.maskZoom || 1))}px`,
                    transform: `translate(${settings.maskX}px, ${settings.maskY}px)`,
                    borderRadius: settings.mask === 'rounded' ? `${settings.borderRadius}%` : undefined
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                  onTouchStart={(e) => handleMouseDown(e, 'move')}
                >
                    {/* Grid Lines inside crop */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none flex flex-col">
                        <div className="flex-1 border-b border-white"></div>
                        <div className="flex-1 border-b border-white"></div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="absolute inset-0 opacity-30 pointer-events-none flex">
                        <div className="flex-1 border-r border-white"></div>
                        <div className="flex-1 border-r border-white"></div>
                        <div className="flex-1"></div>
                    </div>

                    {/* Resize Handle (Bottom Right) */}
                    <div 
                      className="absolute -bottom-4 -right-4 w-8 h-8 bg-emerald-500 rounded-full border-4 border-black cursor-nwse-resize flex items-center justify-center shadow-lg z-30 hover:scale-110 transition-transform"
                      onMouseDown={(e) => handleMouseDown(e, 'resize')}
                      onTouchStart={(e) => handleMouseDown(e, 'resize')}
                    >
                      <Maximize size={12} className="text-black" />
                    </div>

                    {/* Move Indicator (Center) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Move size={32} className="text-white drop-shadow-md" />
                    </div>
                </div>
             </div>
          )}
          
          {/* Reset/Clear Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl border border-red-500/50 backdrop-blur-md transition-all shadow-lg z-40 group/btn"
            title="Remove Image"
          >
            <Trash2 size={20} />
          </button>

          {/* Overlay Hint if mask is none */}
          {settings.mask === 'none' && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur border border-white/10 rounded-full text-xs text-zinc-400 pointer-events-none">
                Preview Mode
             </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full relative z-10 p-6 space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-[#1c1c22] to-[#0c0c0e] rounded-[2rem] border border-zinc-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-300">
               <Upload className="text-zinc-200" size={36} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">Upload Image</h3>
            <p className="text-zinc-500 font-medium">JPG, PNG, WebP supported</p>
          </div>
          
          <div className="flex gap-4 opacity-50">
             <ScanLine size={20} className="text-zinc-600" />
             <div className="w-px h-5 bg-zinc-700"></div>
             <span className="text-xs font-mono text-zinc-500 tracking-wider">DROP ZONE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
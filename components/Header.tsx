import React from 'react';
import { Aperture } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative w-full py-8 mb-6 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all duration-500"></div>
              <div className="relative p-3 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-inner">
                <Aperture className="text-zinc-200 w-8 h-8 group-hover:rotate-180 transition-transform duration-700 ease-out" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tighter drop-shadow-sm">
                PICoder
                <span className="align-top text-xs font-normal text-zinc-500 ml-1 tracking-widest">PRO</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono tracking-[0.2em] uppercase">First Creative Serverless Image Uploader</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-3">
             <div className="h-2 w-2 rounded-full bg-zinc-800 animate-pulse"></div>
             <div className="h-2 w-2 rounded-full bg-zinc-700 animate-pulse delay-75"></div>
             <div className="h-2 w-2 rounded-full bg-zinc-600 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-gradient-to-r from-white/5 to-transparent transform rotate-12 blur-3xl"></div>
      </div>
    </header>
  );
};

export default Header;
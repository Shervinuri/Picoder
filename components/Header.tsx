import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative w-full py-10 mb-6">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          
          <div className="flex flex-col items-center gap-6 group cursor-default">
            {/* Logo Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-[40px] rounded-full group-hover:bg-emerald-500/50 transition-all duration-700"></div>
              <div className="relative w-20 h-20 bg-[#050505] rounded-[2rem] border border-zinc-800 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-5xl text-zinc-100 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] pb-2 select-none">☬</span>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl flex items-start gap-2">
                PICoder
                <span className="text-[12px] font-bold text-black bg-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider mt-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">PRO</span>
              </h1>
              
              <div className="flex items-center gap-3 opacity-60">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-500"></div>
                <p className="text-[10px] md:text-xs text-zinc-400 font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                  Serverless Image Engine
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-500"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
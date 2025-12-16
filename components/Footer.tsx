import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center mt-12 border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <a 
        href="https://T.me/shervini" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group inline-block decoration-0"
      >
        <span className="font-arimo text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 bg-[length:200%_auto] animate-[gradient_8s_ease_infinite] font-bold text-sm tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
          Exclusive SHΞN™ made
        </span>
      </a>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
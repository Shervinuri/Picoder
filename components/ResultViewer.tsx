import React, { useState } from 'react';
import { Copy, Check, Download, Code, FileCode, Layers, Share2, Maximize2, X } from 'lucide-react';
import { ProcessedImage, TabType } from '../types';
import { formatSize } from '../utils/imageUtils';

interface ResultViewerProps {
  processedImage: ProcessedImage | null;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ processedImage }) => {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getCopyContent = () => {
    if (!processedImage) return '';
    switch (activeTab) {
      case 'html': return `<img src="${processedImage.base64}" alt="${processedImage.name}" />`;
      case 'css': return `background-image: url('${processedImage.base64}');`;
      case 'raw': return processedImage.base64;
      default: return '';
    }
  };

  const copyToClipboard = () => {
    const text = getCopyContent();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!processedImage) return;
    
    // Check if share API is supported
    if (navigator.share) {
      try {
        // We can't share Base64 directly usually, but we can share the text of it
        // Or better, convert to file. Let's try sharing the code text first as requested "share direct code".
        const content = getCopyContent();
        
        await navigator.share({
          title: 'PICoder Output',
          text: content.substring(0, 100000), // Limits apply
        });
      } catch (error) {
        console.log('Error sharing', error);
        // If sharing text fails (too long), try just the notification
        alert("متن برای اشتراک‌گذاری مستقیم بسیار طولانی است. لطفا از کپی استفاده کنید.");
      }
    } else {
      alert("مرورگر شما از قابلیت اشتراک‌گذاری پشتیبانی نمی‌کند.");
    }
  };

  const downloadContent = () => {
    const content = getCopyContent();
    if (!content) return;
    
    // Create Blob and download
    let filename = `picoder-${Date.now()}`;
    let mimeType = 'text/plain';

    switch (activeTab) {
      case 'html': filename += '.html'; mimeType = 'text/html'; break;
      case 'css': filename += '.css'; mimeType = 'text/css'; break;
      case 'raw': filename += '.txt'; break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!processedImage) {
    return (
      <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 h-full min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-zinc-600 space-y-4 backdrop-blur-sm">
        <div className="p-6 md:p-8 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-inner">
           <Code className="w-8 h-8 md:w-10 md:h-10 opacity-40" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60">Awaiting Input Signal...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900/60 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 h-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
        
        {/* Full Screen Toggle */}
        <button 
            onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5 z-10"
            title="Full Screen Preview"
        >
            <Maximize2 size={16} />
        </button>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-4 md:mb-6 bg-black/40 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Payload Size</span>
              <span className="text-zinc-200 font-mono text-sm">{formatSize(processedImage.processedSize)}</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
             {processedImage.width} x {processedImage.height}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-xl mb-4 border border-white/5">
          {[
            { id: 'html', icon: Code, label: 'HTML' },
            { id: 'css', icon: FileCode, label: 'CSS' },
            { id: 'raw', icon: Layers, label: 'RAW' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide
                ${activeTab === tab.id ? 'bg-zinc-800 text-white shadow-lg border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="relative flex-1 bg-[#0c0c0e] rounded-xl border border-white/5 p-4 overflow-hidden group shadow-inner min-h-[200px]">
          <textarea 
            className="w-full h-full bg-transparent text-zinc-400 font-mono text-[10px] resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-zinc-700"
            readOnly
            value={getCopyContent()}
            spellCheck={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0c0c0e] to-transparent pointer-events-none"></div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
          <button 
            onClick={downloadContent}
            className="col-span-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 active:scale-95"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Share Button (Primary on mobile if clipboard slow) */}
          <button 
            onClick={handleShare}
            className="col-span-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 active:scale-95"
          >
             <Share2 size={16} />
             <span className="hidden sm:inline">Share</span>
          </button>
          
          <button 
            onClick={copyToClipboard}
            className={`col-span-2 sm:col-span-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95
                ${copied 
                    ? 'bg-emerald-600 text-white shadow-emerald-900/50' 
                    : 'bg-zinc-100 hover:bg-white text-black shadow-white/10'}`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
           <button 
             onClick={() => setIsFullScreen(false)}
             className="absolute top-4 right-4 p-3 bg-zinc-800/50 rounded-full text-white hover:bg-zinc-700"
           >
             <X size={24} />
           </button>
           <div className="max-w-full max-h-full overflow-auto">
             <img src={processedImage.previewUrl} alt="Full Screen" className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl" />
           </div>
        </div>
      )}
    </>
  );
};

export default ResultViewer;
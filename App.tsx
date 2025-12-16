import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import DropZone from './components/DropZone';
import SettingsPanel from './components/SettingsPanel';
import ResultViewer from './components/ResultViewer';
import AIPromptBar from './components/AIPromptBar';
import { ImageSettings, ProcessedImage, HistoryItem } from './types';
import { processImage, calculateBase64Size } from './utils/imageUtils';
import { editImageWithGemini } from './utils/geminiService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const savePending = useRef(false);
  const isRestoringHistory = useRef(false);

  const [settings, setSettings] = useState<ImageSettings>({
    quality: 0.8,
    maxWidth: 800,
    outputFormat: 'image/webp',
    rotation: 0,
    flipH: false,
    flipV: false,
    mask: 'none',
    borderRadius: 20,
    maskZoom: 1,
    maskX: 0,
    maskY: 0
  });

  // Save to history logic
  const saveToHistory = useCallback(() => {
    if (isRestoringHistory.current) return;
    
    setHistory(prev => {
      const currentHistory = prev.slice(0, historyIndex + 1);
      const newState: HistoryItem = {
        processedImage: processedImage,
        settings: { ...settings },
        file: file
      };

      if (currentHistory.length > 0) {
        const lastState = currentHistory[currentHistory.length - 1];
        if (
          lastState.processedImage?.base64 === newState.processedImage?.base64 &&
          JSON.stringify(lastState.settings) === JSON.stringify(newState.settings) &&
          lastState.file === newState.file
        ) {
          return prev;
        }
      }

      const newHistory = [...currentHistory, newState];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });

    setHistoryIndex(prev => {
      return prev < 19 ? prev + 1 : 19;
    });
  }, [processedImage, settings, file, historyIndex]);

  useEffect(() => {
    if (savePending.current && processedImage && !isLoading) {
      saveToHistory();
      savePending.current = false;
    }
  }, [processedImage, isLoading, saveToHistory]);

  const undo = () => {
    if (historyIndex > 0) {
      isRestoringHistory.current = true;
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      
      setFile(prevState.file);
      setSettings(prevState.settings);
      setProcessedImage(prevState.processedImage);
      setHistoryIndex(prevIndex);
      setTimeout(() => { isRestoringHistory.current = false; }, 50);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isRestoringHistory.current = true;
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      
      setFile(nextState.file);
      setSettings(nextState.settings);
      setProcessedImage(nextState.processedImage);
      setHistoryIndex(nextIndex);
      setTimeout(() => { isRestoringHistory.current = false; }, 50);
    }
  };

  const updateProcessedImageState = async (base64: string, filename: string, originalSize: number) => {
      const img = new Image();
      img.src = base64;
      await new Promise((resolve) => { img.onload = resolve; });

      setProcessedImage({
        name: filename,
        previewUrl: base64,
        base64: base64,
        originalSize: originalSize,
        processedSize: calculateBase64Size(base64),
        width: img.width,
        height: img.height
      });
  };

  const handleProcessing = async (inputFile: File, currentSettings: ImageSettings) => {
    setIsLoading(true);
    try {
      const base64 = await processImage(inputFile, currentSettings);
      await updateProcessedImageState(base64, inputFile.name || 'image', inputFile.size);
    } catch (error) {
      console.error("Processing error:", error);
      alert("Error processing image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiEdit = async (prompt: string) => {
    if (!processedImage) return;
    setIsAiProcessing(true);
    try {
      const newBase64 = await editImageWithGemini(processedImage.base64, prompt);
      await updateProcessedImageState(newBase64, `ai-edited-${Date.now()}.png`, processedImage.originalSize);
      setTimeout(() => { savePending.current = true; }, 0);
    } catch (error) {
      alert("AI Processing Failed: " + (error as Error).message);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const onFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setHistory([]);
    setHistoryIndex(-1);
    const resetSettings = { ...settings, maskX: 0, maskY: 0, maskZoom: 1 };
    setSettings(resetSettings);
    
    handleProcessing(selectedFile, resetSettings).then(() => {
       savePending.current = true;
    });
  };

  const onSettingsChange = (newSettings: Partial<ImageSettings>, commit = false) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (commit) {
        savePending.current = true;
    }
    
    // Debounce processing slightly if dragging continuously, but for now direct call
    if (file) {
      handleProcessing(file, updatedSettings); 
    }
  };
  
  const onSettingsCommit = () => {
      savePending.current = true;
      if (!isLoading && processedImage) {
          saveToHistory();
          savePending.current = false;
      }
  };

  const handleUrlInput = async () => {
    const url = prompt("Please enter the direct image URL:");
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const filename = url.split('/').pop() || 'downloaded-image';
      const fileObj = new File([blob], filename, { type: blob.type });
      onFileSelect(fileObj);
    } catch (error) {
      alert("Failed to fetch image. CORS might be blocking this request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden selection:bg-emerald-500/30" dir="rtl">
      
      {/* Dynamic Background Image Effect */}
      {processedImage && (
        <div className="fixed inset-0 z-0">
           <img src={processedImage.previewUrl} className="w-full h-full object-cover opacity-5 blur-[120px] scale-110" />
           <div className="absolute inset-0 bg-[#050505]/90 mix-blend-multiply"></div>
        </div>
      )}

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <Header />

        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            <DropZone 
              file={processedImage} 
              isLoading={isLoading} 
              settings={settings}
              onFileSelect={onFileSelect} 
              onClear={() => { setFile(null); setProcessedImage(null); setHistory([]); setHistoryIndex(-1); }}
              onUpdateSettings={onSettingsChange}
            />

            <AIPromptBar 
              onGenerate={handleAiEdit} 
              isProcessing={isAiProcessing} 
              hasImage={!!processedImage} 
            />

            {!processedImage && (
              <button 
                onClick={handleUrlInput}
                className="w-full py-4 bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl flex items-center justify-center gap-3 transition-all border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white group backdrop-blur-sm"
              >
                <Link size={18} className="group-hover:rotate-45 transition-transform" />
                <span className="font-bold text-sm">Import from URL</span>
              </button>
            )}

            <SettingsPanel 
                settings={settings} 
                onChange={onSettingsChange}
                onCommit={onSettingsCommit}
                onUndo={undo}
                onRedo={redo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
            />
          </div>

          {/* Right Column: Result (7 cols) */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <ResultViewer processedImage={processedImage} />
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
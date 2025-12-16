import React, { useState } from 'react';
import { Link } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import DropZone from './components/DropZone';
import SettingsPanel from './components/SettingsPanel';
import ResultViewer from './components/ResultViewer';
import AIPromptBar from './components/AIPromptBar';
import { ImageSettings, ProcessedImage } from './types';
import { processImage, calculateBase64Size } from './utils/imageUtils';
import { editImageWithGemini } from './utils/geminiService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>({
    quality: 0.8,
    maxWidth: 800,
    outputFormat: 'image/webp',
    rotation: 0,
    flipH: false,
    flipV: false,
    mask: 'none',
    borderRadius: 20
  });

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
      // Use the current processed image as the base for the edit
      const newBase64 = await editImageWithGemini(processedImage.base64, prompt);
      
      // Update state with the new AI generated image
      // Note: We keep original size metric as the very first file size for reference, 
      // or we could treat the previous step as original. Let's keep the initial file size.
      await updateProcessedImageState(newBase64, `ai-edited-${Date.now()}.png`, processedImage.originalSize);
      
    } catch (error) {
      alert("AI Processing Failed: " + (error as Error).message);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const onFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    handleProcessing(selectedFile, settings);
  };

  const onSettingsChange = (newSettings: Partial<ImageSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    if (file) {
      handleProcessing(file, updatedSettings); 
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
      setFile(fileObj);
      handleProcessing(fileObj, settings);
    } catch (error) {
      alert("Failed to fetch image. CORS might be blocking this request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden selection:bg-white/20" dir="rtl">
      
      {/* Dynamic Background Image Effect */}
      {processedImage && (
        <div className="fixed inset-0 z-0">
           <img src={processedImage.previewUrl} className="w-full h-full object-cover opacity-10 blur-[100px] scale-110 transform transition-all duration-1000" />
           <div className="absolute inset-0 bg-zinc-950/80"></div>
        </div>
      )}

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <Header />

        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            <DropZone 
              file={processedImage} 
              isLoading={isLoading} 
              onFileSelect={onFileSelect} 
              onClear={() => { setFile(null); setProcessedImage(null); }} 
            />

            {/* AI Prompt Bar - Only shows if image is loaded */}
            {processedImage && (
              <AIPromptBar onGenerate={handleAiEdit} isProcessing={isAiProcessing} />
            )}

            {!processedImage && (
              <button 
                onClick={handleUrlInput}
                className="w-full py-4 bg-zinc-900/40 hover:bg-zinc-800/60 rounded-2xl flex items-center justify-center gap-3 transition-all border border-zinc-800 text-zinc-400 hover:text-white group backdrop-blur-sm shadow-lg"
              >
                <Link size={18} className="group-hover:rotate-45 transition-transform" />
                <span className="font-medium text-sm">Import from URL</span>
              </button>
            )}

            <SettingsPanel settings={settings} onChange={onSettingsChange} />
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
export type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';
export type MaskType = 'none' | 'circle' | 'rounded';

export interface ImageSettings {
  quality: number;
  maxWidth: number;
  outputFormat: OutputFormat;
  rotation: number; // Cumulative degrees
  flipH: boolean;   // Horizontal Mirror
  flipV: boolean;   // Vertical Mirror
  mask: MaskType;
  borderRadius: number; // 0-100 (percentage relative to size)
  maskZoom: number; // 0.1 - 2.0 (Scale of the mask hole)
  maskX: number; // Horizontal offset of the mask
  maskY: number; // Vertical offset of the mask
}

export type TabType = 'html' | 'css' | 'raw';

export interface ProcessedImage {
  name: string;
  previewUrl: string;
  base64: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

export interface HistoryItem {
  processedImage: ProcessedImage | null;
  settings: ImageSettings;
  file: File | null;
}
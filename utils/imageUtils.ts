import { ImageSettings } from '../types';

export const processImage = (file: Blob, settings: ImageSettings): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 1. Calculate Logical Dimensions based on Rotation
        // Normalize rotation to 0-360 positive
        const normalizedRotation = ((settings.rotation % 360) + 360) % 360;
        const isRotated90or270 = normalizedRotation === 90 || normalizedRotation === 270;
        
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // Logical dimensions (bounding box)
        let logicalWidth = isRotated90or270 ? originalHeight : originalWidth;
        let logicalHeight = isRotated90or270 ? originalWidth : originalHeight;

        // 2. Resize Logic (Maintain Aspect Ratio)
        let finalWidth = logicalWidth;
        let finalHeight = logicalHeight;

        if (finalWidth > settings.maxWidth) {
          finalHeight = Math.round((finalHeight * settings.maxWidth) / finalWidth);
          finalWidth = settings.maxWidth;
        }

        // 3. Set Canvas Size
        canvas.width = finalWidth;
        canvas.height = finalHeight;

        // 4. Transform Context
        ctx.save();
        
        // Move origin to center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply Rotation
        ctx.rotate((settings.rotation * Math.PI) / 180);
        
        // Apply Flip (Scale)
        // Note: Scale happens *before* drawing the image, but relative to the rotated axes?
        // To behave intuitively (flip relative to screen), we might need to adjust based on rotation.
        // However, standard image editors usually apply transformations in order.
        // Let's stick to Local Transform: Flip applies to the image content itself.
        ctx.scale(settings.flipH ? -1 : 1, settings.flipV ? -1 : 1);
        
        // Calculate draw dimensions (inverse of scale factor)
        const scale = finalWidth / logicalWidth;
        const drawWidth = originalWidth * scale;
        const drawHeight = originalHeight * scale;

        // Draw centered
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        // 5. Apply Masking (Crop)
        if (settings.mask !== 'none') {
          ctx.globalCompositeOperation = 'destination-in';
          ctx.beginPath();
          
          if (settings.mask === 'circle') {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) / 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          } else if (settings.mask === 'rounded') {
            const radius = (Math.min(canvas.width, canvas.height) * settings.borderRadius) / 200; // 0-50%
            ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
          }
          
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }

        // 6. Export
        const dataUrl = canvas.toDataURL(settings.outputFormat, settings.quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateBase64Size = (base64String: string): number => {
  return base64String.length; 
};
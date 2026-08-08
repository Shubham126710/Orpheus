import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export function useColorExtraction(imageUrl: string | null) {
  const { setColors, resetColors } = useThemeStore();

  useEffect(() => {
    if (!imageUrl || imageUrl === '/placeholder-art.jpg') {
      resetColors();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resetColors();

        // Scale down for faster processing and a "dominant" average effect
        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);

        const data = ctx.getImageData(0, 0, 10, 10).data;
        
        let r = 0, g = 0, b = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        // Average colors
        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);

        // Make secondary color slightly darker/different
        const sr = Math.max(0, r - 30);
        const sg = Math.max(0, g - 30);
        const sb = Math.max(0, b - 30);

        setColors(`rgb(${r}, ${g}, ${b})`, `rgb(${sr}, ${sg}, ${sb})`);
      } catch (error) {
        console.error('Failed to extract colors:', error);
        resetColors();
      }
    };

    img.onerror = () => {
      resetColors();
    };
  }, [imageUrl, setColors, resetColors]);
}

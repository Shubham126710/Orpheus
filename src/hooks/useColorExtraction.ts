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

        // We want to find the dominant color, not an average of all colors (which turns into gray/brown).
        // We'll bucket colors and pick the most populated bucket, ignoring very dark and very bright pixels.
        canvas.width = 64; // Use slightly more pixels for better bucketing
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);

        const data = ctx.getImageData(0, 0, 64, 64).data;
        const colorCounts: Record<string, { r: number, g: number, b: number, count: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue; // ignore transparent

          // Calculate luminance to filter out near-black and near-white
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luminance < 15 || luminance > 240) continue; 
          
          // Also filter out completely desaturated pixels (pure grays)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          if (saturation < 0.05) continue;

          // Bucket by dividing by 24 (reduces color space to group similar colors)
          const rBucket = Math.floor(r / 24) * 24;
          const gBucket = Math.floor(g / 24) * 24;
          const bBucket = Math.floor(b / 24) * 24;
          const key = `${rBucket}-${gBucket}-${bBucket}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: 0, g: 0, b: 0, count: 0 };
          }
          colorCounts[key].r += r;
          colorCounts[key].g += g;
          colorCounts[key].b += b;
          colorCounts[key].count++;
        }

        let dominantBucket = null;
        let maxCount = 0;

        for (const key in colorCounts) {
          if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            dominantBucket = colorCounts[key];
          }
        }

        let finalR = 30, finalG = 30, finalB = 30; // default fallback if no valid color
        if (dominantBucket) {
          finalR = Math.floor(dominantBucket.r / dominantBucket.count);
          finalG = Math.floor(dominantBucket.g / dominantBucket.count);
          finalB = Math.floor(dominantBucket.b / dominantBucket.count);
        }

        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        const hex = `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;

        // Make secondary slightly darker
        const sR = Math.max(0, finalR - 30);
        const sG = Math.max(0, finalG - 30);
        const sB = Math.max(0, finalB - 30);
        const secHex = `#${toHex(sR)}${toHex(sG)}${toHex(sB)}`;

        setColors(hex, secHex);
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

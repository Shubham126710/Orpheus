import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RetroFilmBackgroundProps {
  dominantColor: string;
}

/**
 * Converts a hex color to HSL and returns a muted, desaturated, softer version 
 * suitable for the analog film aesthetic.
 */
function getMutedFilmColor(hex: string) {
  if (!hex || hex === 'transparent') return 'hsl(0, 0%, 15%)';
  
  // Parse hex
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  
  // Mute logic: Desaturate heavily, adjust lightness to be a soft mid-tone
  // We add a bit of warmth by shifting hue slightly towards yellow/red if it's cool
  s = Math.max(10, Math.min(40, s * 100 * 0.5)); // 10-40% saturation
  l = Math.max(25, Math.min(45, l * 100));       // 25-45% lightness (dark, but not pitch black)

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default function RetroFilmBackground({ dominantColor }: RetroFilmBackgroundProps) {
  const mutedColor = useMemo(() => getMutedFilmColor(dominantColor), [dominantColor]);
  const lighterVariant = useMemo(() => {
    // A slightly lighter, less saturated variant for radial gradients
    return mutedColor.replace(/hsl\((.*?),\s*(.*?)%,\s*(.*?)%\)/, (m, h, s, l) => {
      return `hsl(${h}, ${Math.max(5, parseInt(s) - 10)}%, ${Math.min(60, parseInt(l) + 15)}%)`;
    });
  }, [mutedColor]);

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{ backgroundColor: mutedColor }}
    >
      {/* Soft variations / clouds (Photographic imperfections) */}
      <div 
        className="absolute inset-0 opacity-40 transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${lighterVariant} 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${lighterVariant} 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, ${lighterVariant} 0%, transparent 60%)
          `
        }}
      />

      {/* Procedural Film Grain (SVG feTurbulence) */}
      {/* We use mix-blend-overlay and low opacity to make it look like photographic grain, not digital static */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          // Very subtle animation respecting reduced motion
          animation: 'grain-shift 8s steps(4) infinite alternate'
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @media (prefers-reduced-motion: no-preference) {
          @keyframes grain-shift {
            0% { background-position: 0% 0%; }
            50% { background-position: 2% 2%; }
            100% { background-position: -2% -1%; }
          }
        }
      `}} />

      {/* Soft Vignette (Darker corners for cinematic print feel) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_120%)]" />

      {/* Subtle Texture Overlay for Paper/Print Feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-color-burn" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22 viewBox=%220 0 4 4%22%3E%3Cpath fill=%22%23000%22 fill-opacity=%221%22 d=%22M1 3h1v1H1V3zm2-2h1v1H3V1z%22%3E%3C/path%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
}

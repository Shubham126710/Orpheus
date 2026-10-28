"use client";

import React, { useEffect, useRef, useMemo } from "react";

interface RetroFilmBackgroundProps {
  dominantColor?: string;
}

/**
 * High-Precision 35mm Analog Cine Film Grain & Emulsion Engine
 * Inspired by Kodak Vision3 500T and 16mm/35mm archival print simulation.
 * Uses a multi-octave silver-halide grain canvas running at authentic 18 FPS shutter gate
 * with organic micro-flicker, optical vignette falloff, and latent keycode metadata markings.
 */
export default function RetroFilmBackground({ dominantColor = "#000000" }: RetroFilmBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parse dominant color into a deep, velvety, atmospheric glow
  const glowColor = useMemo(() => {
    if (!dominantColor || dominantColor === "transparent" || dominantColor === "#000000") {
      return "rgba(250, 255, 0, 0.08)"; // Orpheus electric yellow default underglow
    }
    // If it's rgb(...) convert to rgba with soft atmospheric opacity
    if (dominantColor.startsWith("rgb")) {
      return dominantColor.replace("rgb", "rgba").replace(")", ", 0.18)");
    }
    // If it's hex, extract and return rich rgba
    let hex = dominantColor.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, 0.22)`;
  }, [dominantColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 18; // 18 FPS authentic analog projector shutter rate

    // Generate pre-rendered grain patterns for top performance without heavy runtime math
    const GRAIN_SIZE = 256;
    const grainCanvas1 = document.createElement("canvas");
    const grainCanvas2 = document.createElement("canvas");
    const grainCanvas3 = document.createElement("canvas");
    const grainCanvas4 = document.createElement("canvas");
    const grainCanvases = [grainCanvas1, grainCanvas2, grainCanvas3, grainCanvas4];

    grainCanvases.forEach((c) => {
      c.width = GRAIN_SIZE;
      c.height = GRAIN_SIZE;
      const cCtx = c.getContext("2d");
      if (!cCtx) return;
      const imgData = cCtx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Multi-octave silver halide Gaussian distribution
        const r1 = Math.random();
        const r2 = Math.random();
        // Box-Muller transform for true Gaussian noise
        const gaussian = Math.sqrt(-2.0 * Math.log(r1 || 0.0001)) * Math.cos(2.0 * Math.PI * r2);
        
        // Fine grain with subtle warm silver tint
        const lum = Math.max(0, Math.min(255, 128 + gaussian * 38));
        data[i] = lum;       // Red
        data[i + 1] = lum;   // Green
        data[i + 2] = lum;   // Blue
        // Alpha modulation: natural density variation
        data[i + 3] = Math.random() < 0.25 ? 55 : Math.random() < 0.6 ? 32 : 18;
      }
      cCtx.putImageData(imgData, 0, 0);
    });

    let currentPatternIdx = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      if (now - lastTime >= FRAME_INTERVAL) {
        lastTime = now;
        currentPatternIdx = (currentPatternIdx + 1) % grainCanvases.length;
        const currentPatternCanvas = grainCanvases[currentPatternIdx];

        const w = window.innerWidth;
        const h = window.innerHeight;

        ctx.clearRect(0, 0, w, h);

        // 1. Base photographic exposure
        ctx.fillStyle = "#060608";
        ctx.fillRect(0, 0, w, h);

        // 2. Atmospheric center bloom from dominant color
        const bloom = ctx.createRadialGradient(w / 2, h * 0.42, 50, w / 2, h * 0.42, Math.max(w, h) * 0.7);
        bloom.addColorStop(0, glowColor);
        bloom.addColorStop(0.5, "rgba(10, 10, 14, 0.4)");
        bloom.addColorStop(1, "rgba(5, 5, 7, 0.95)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);

        // 3. Tile the silver-halide grain pattern with subtle micro-jitter
        const pattern = ctx.createPattern(currentPatternCanvas, "repeat");
        if (pattern) {
          ctx.save();
          // Subtle organic gate weave jitter (0.5 to 1.5px)
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 4;
          ctx.translate(jitterX, jitterY);

          // Subtle analog projector flicker (+-2% opacity fluctuation)
          const flicker = 0.88 + Math.random() * 0.14;
          ctx.globalAlpha = 0.28 * flicker;
          ctx.globalCompositeOperation = "screen";
          ctx.fillStyle = pattern;
          ctx.fillRect(-10, -10, w + 20, h + 20);
          ctx.restore();
        }

        // 4. Heavy analog lens optical vignette (falloff to pitch black corners)
        const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(0.65, "rgba(2, 2, 4, 0.45)");
        vignette.addColorStop(1, "rgba(2, 2, 4, 0.94)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [glowColor]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 35mm Silver Halide Grain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Latent Image Keycode & 35mm Film Edge Markings */}
      <div className="absolute top-4 inset-x-6 flex items-center justify-between text-[9px] font-mono text-white/20 tracking-[0.25em] uppercase pointer-events-none z-10 hidden sm:flex">
        <div className="flex items-center gap-3">
          <span className="text-[#FAFF00]/40 font-bold">▸ KODAK VISION3 500T</span>
          <span>SAFETY FILM</span>
          <span>EMULSION 8421</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ORPHEUS MASTER OPTICAL SOUNDTRACK</span>
          <span className="text-[#FAFF00]/40">24 FPS</span>
        </div>
      </div>

      <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-[9px] font-mono text-white/15 tracking-[0.25em] uppercase pointer-events-none z-10 hidden sm:flex">
        <span>LATENT KEYCODE 48 1029 4910</span>
        <span>ARCHIVAL REPRODUCTION · 35mm GAUGE</span>
      </div>
    </div>
  );
}

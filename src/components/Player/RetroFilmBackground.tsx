"use client";

import React, { useEffect, useRef } from "react";

/**
 * Pure Monochrome Analog Film Grain Background
 * Deep pitch-black base (#050505) with organic, tactile silver-halide grain.
 * Completely free of color blooms, glow effects, or edge text overlays.
 */
export default function RetroFilmBackground({ dominantColor }: { dominantColor?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 16; // 16 FPS gentle analog film shutter

    // Generate 4 pre-rendered monochrome grain tiles
    const TILE_SIZE = 256;
    const tiles: HTMLCanvasElement[] = [];

    for (let t = 0; t < 4; t++) {
      const tc = document.createElement("canvas");
      tc.width = TILE_SIZE;
      tc.height = TILE_SIZE;
      const tCtx = tc.getContext("2d");
      if (tCtx) {
        const imgData = tCtx.createImageData(TILE_SIZE, TILE_SIZE);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Fine Gaussian monochrome noise
          const r1 = Math.random() || 0.001;
          const r2 = Math.random();
          const gaussian = Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI * r2);
          const val = Math.max(0, Math.min(255, 128 + gaussian * 42));

          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          // Clean subtle grain density
          data[i + 3] = Math.random() < 0.2 ? 38 : Math.random() < 0.5 ? 20 : 10;
        }
        tCtx.putImageData(imgData, 0, 0);
      }
      tiles.push(tc);
    }

    let tileIdx = 0;

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
        tileIdx = (tileIdx + 1) % tiles.length;

        const w = window.innerWidth;
        const h = window.innerHeight;

        // 1. Pure solid black canvas
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);

        // 2. Tile subtle monochrome film grain with micro-jitter
        const currentTile = tiles[tileIdx];
        if (currentTile) {
          const pattern = ctx.createPattern(currentTile, "repeat");
          if (pattern) {
            ctx.save();
            const jitterX = (Math.random() - 0.5) * 3;
            const jitterY = (Math.random() - 0.5) * 3;
            ctx.translate(jitterX, jitterY);
            ctx.globalAlpha = 0.22;
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle = pattern;
            ctx.fillRect(-10, -10, w + 20, h + 20);
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

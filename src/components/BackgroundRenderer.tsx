"use client";

import React, { useEffect, useRef } from "react";

/**
 * Clean Monochrome Fine Grain Background Canvas
 * Crisp pitch-black ground (#050505) with subtle physical matte grain texture.
 * Completely free of color pools, blurry blooms, or artificial glow spots.
 */
export default function BackgroundRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 14; // 14 FPS gentle organic film flicker

    const TILE_SIZE = 256;
    const tiles: HTMLCanvasElement[] = [];

    for (let t = 0; t < 3; t++) {
      const tc = document.createElement("canvas");
      tc.width = TILE_SIZE;
      tc.height = TILE_SIZE;
      const tCtx = tc.getContext("2d");
      if (tCtx) {
        const imgData = tCtx.createImageData(TILE_SIZE, TILE_SIZE);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const val = Math.floor(Math.random() * 255);
          d[i] = val;
          d[i + 1] = val;
          d[i + 2] = val;
          d[i + 3] = Math.random() < 0.25 ? 18 : 8;
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

        // Clean solid dark obsidian ground
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);

        // Tile fine silver grain
        const currentTile = tiles[tileIdx];
        if (currentTile) {
          const pattern = ctx.createPattern(currentTile, "repeat");
          if (pattern) {
            ctx.save();
            ctx.globalAlpha = 0.22;
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, w, h);
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
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

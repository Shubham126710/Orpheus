"use client";

import React, { useEffect, useRef } from "react";

/**
 * Global Cinematic Ambient Canvas
 * Provides subtle 35mm archival grain, atmospheric optical vignetting,
 * and slow-breathing ambient light pools so the background never feels like a flat digital void.
 */
export default function BackgroundRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 14; // 14 FPS gentle organic film flicker

    // Generate 3 static grain tiles for ultra-low CPU performance
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
          // Very gentle alpha (3-8%) so it feels like archival matte paper texture, not digital noise
          d[i + 3] = Math.random() < 0.3 ? 16 : 8;
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

        ctx.clearRect(0, 0, w, h);

        // 1. Deep Obsidian Base
        ctx.fillStyle = "#050507";
        ctx.fillRect(0, 0, w, h);

        // 2. Slow subtle ambient pools
        const time = now / 4000;
        const p1X = w * 0.2 + Math.sin(time) * 50;
        const p1Y = h * 0.15 + Math.cos(time * 0.8) * 40;
        const g1 = ctx.createRadialGradient(p1X, p1Y, 10, p1X, p1Y, Math.max(w, h) * 0.6);
        g1.addColorStop(0, "rgba(250, 255, 0, 0.025)"); // electric yellow hint
        g1.addColorStop(1, "rgba(5, 5, 7, 0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        const p2X = w * 0.85 + Math.cos(time * 0.7) * 40;
        const p2Y = h * 0.6 + Math.sin(time * 0.9) * 50;
        const g2 = ctx.createRadialGradient(p2X, p2Y, 10, p2X, p2Y, Math.max(w, h) * 0.5);
        g2.addColorStop(0, "rgba(255, 255, 255, 0.015)");
        g2.addColorStop(1, "rgba(5, 5, 7, 0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);

        // 3. Tile the fine silver grain
        const currentTile = tiles[tileIdx];
        if (currentTile) {
          const pattern = ctx.createPattern(currentTile, "repeat");
          if (pattern) {
            ctx.save();
            ctx.globalAlpha = 0.65;
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
          }
        }

        // 4. Subtle lens optical vignette
        const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.8);
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(2, 2, 4, 0.75)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
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
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

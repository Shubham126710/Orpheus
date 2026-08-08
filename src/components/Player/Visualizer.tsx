"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface VisualizerProps {
  position: "left" | "right";
}

export default function Visualizer({ position }: VisualizerProps) {
  const { isPlaying } = usePlayerStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      // Draw horizontal glowing line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      
      // Add a subtle wave effect if playing
      const amplitude = isPlaying ? 4 : 0.5;
      
      for (let x = 0; x < width; x++) {
        // Create an envelope so the wave is only in the middle
        const normalizedX = x / width;
        const envelope = Math.sin(normalizedX * Math.PI); // 0 at edges, 1 in middle
        
        // Combine a few sine waves
        const y = centerY + 
                 Math.sin(x * 0.05 + phase) * amplitude * envelope +
                 Math.cos(x * 0.1 + phase * 1.5) * (amplitude / 2) * envelope;
                 
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"; // Whiteish glow
      ctx.lineWidth = 2;
      
      // Add glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 200, 200, 0.8)";
      
      ctx.stroke();

      phase += 0.05;

      setTimeout(() => {
        animationFrameId = requestAnimationFrame(render);
      }, 30); // ~30fps for smooth but calm feel
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div 
      className={`w-32 h-16 opacity-80 transition-opacity duration-1000 ${
        position === "left" ? "rotate-180" : ""
      }`}
    >
      <canvas 
        ref={canvasRef} 
        width={128} 
        height={64} 
        className="w-full h-full"
      />
    </div>
  );
}

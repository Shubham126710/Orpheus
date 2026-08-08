"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, SkipForward } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function MiniPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, isExpanded, setIsExpanded } = usePlayerStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const audio = document.getElementById('global-audio-element') as HTMLAudioElement;
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack || isExpanded) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 md:bottom-28 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[100] md:w-[600px] max-w-[90vw] bg-white/10 backdrop-blur-3xl border border-white/20 p-3 md:p-4 rounded-[1.5rem] md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col gap-3 md:gap-4 cursor-pointer group hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-all duration-500"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          setIsExpanded(true);
        }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* Rotating Vinyl/Cover */}
          <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 rounded-full border border-white/10 bg-black/40 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className={`w-full h-full ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                {currentTrack?.thumbnail && (
                  <Image
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    fill
                    className="object-cover opacity-80"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              {/* Vinyl inner hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-black rounded-full border border-white/10" />
            </div>
          </div>

          {/* Track Info */}
          <div className="flex flex-col min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-2">
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 shrink-0">
                  <div className="w-[2px] bg-[#00FF55] animate-[bounce_1s_ease-in-out_infinite]" />
                  <div className="w-[2px] bg-[#00FF55] animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
                  <div className="w-[2px] bg-[#00FF55] animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
                </div>
              )}
              <span className="font-geist font-black text-sm md:text-base text-white truncate uppercase tracking-tight">{currentTrack?.title}</span>
            </div>
            <span className="font-geist text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest truncate mt-0.5">{currentTrack?.artist}</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 pr-1 md:pr-0">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? (
                <Pause size={14} className="md:w-4 md:h-4" strokeWidth={2.5} fill="currentColor" />
              ) : (
                <Play size={14} className="md:w-4 md:h-4 ml-1" strokeWidth={2.5} fill="currentColor" />
              )}
            </button>
            <button onClick={playNext} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors hidden md:flex">
              <SkipForward size={18} strokeWidth={2} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/50 to-white relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

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
        const audio = document.getElementById("global-audio-element") as HTMLAudioElement;
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack || isExpanded) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="fixed bottom-22 md:bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[80] md:w-[620px] max-w-[92vw] bg-[#0A0A0E]/95 backdrop-blur-2xl border border-white/15 p-3 md:p-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-2.5 cursor-pointer group hover:border-[#FAFF00]/40 hover:shadow-[0_25px_60px_rgba(250,255,0,0.12)] transition-all duration-300"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          setIsExpanded(true);
        }}
      >
        <div className="flex items-center gap-3.5 md:gap-4">
          {/* Rotating Vinyl Disc with Micro-grooves */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 rounded-full border border-white/15 bg-[#0C0C10] overflow-hidden shadow-lg flex items-center justify-center">
              <div 
                className={`w-full h-full relative ${isPlaying ? "animate-[spin_6s_linear_infinite]" : ""}`}
                style={{
                  backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(255,255,255,0.035) 2px, rgba(255,255,255,0.035) 3.5px)`
                }}
              >
                {currentTrack?.thumbnail && (
                  <Image
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    fill
                    className="object-cover opacity-85"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              {/* Gold Spindle Center Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1A1A1E] border-2 border-[#FAFF00]/80 shadow-md" />
            </div>
          </div>

          {/* Track Info with Editorial Flair */}
          <div className="flex flex-col min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-2">
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 shrink-0">
                  <div className="w-[2px] bg-[#FAFF00] animate-[bounce_0.8s_ease-in-out_infinite]" />
                  <div className="w-[2px] bg-[#FAFF00] animate-[bounce_0.8s_ease-in-out_infinite_0.2s]" />
                  <div className="w-[2px] bg-[#FAFF00] animate-[bounce_0.8s_ease-in-out_infinite_0.4s]" />
                </div>
              )}
              <span className="font-geist font-black text-xs md:text-sm text-white group-hover:text-[#FAFF00] transition-colors truncate uppercase tracking-tight">
                {currentTrack?.title}
              </span>
            </div>
            <span className="font-geist font-medium text-xs md:text-sm text-white/60 truncate tracking-normal mt-0.5">
              {currentTrack?.artist}
            </span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0 pr-1">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#FAFF00] text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(250,255,0,0.35)] cursor-pointer"
            >
              {isPlaying ? (
                <Pause size={14} className="md:w-4 md:h-4" strokeWidth={2.5} fill="currentColor" />
              ) : (
                <Play size={14} className="md:w-4 md:h-4 ml-0.5" strokeWidth={2.5} fill="currentColor" />
              )}
            </button>
            <button 
              onClick={playNext} 
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer hidden sm:flex"
            >
              <SkipForward size={17} strokeWidth={2} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#FAFF00] relative rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#FAFF00]" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

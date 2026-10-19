"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Check, Sparkles, Loader2, Music2 } from "lucide-react";

interface StepPersonalizeProps {
  selectedGenres: string[];
  selectedArtists: string[];
  onBack: () => void;
  onFinish: () => Promise<void>;
}

export const StepPersonalize: React.FC<StepPersonalizeProps> = ({
  selectedGenres,
  selectedArtists,
  onBack,
  onFinish,
}) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleBuild = async () => {
    setIsSynthesizing(true);
    await onFinish();
  };

  return (
    <motion.div
      key="step-personalize"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full h-full flex flex-col justify-between overflow-y-auto px-4 sm:px-8 py-8 z-20 select-none"
    >
      {/* 1. TOP HEADER */}
      <div className="relative text-center shrink-0 z-30 pt-2">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#FAFF00] font-bold">
            03
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            /
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            03
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-geist font-black tracking-tight uppercase text-white leading-tight">
          YOUR SOUND. YOUR RULES.
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-white/50 font-geist tracking-wide">
          Your musical world is taking shape.
        </p>
      </div>

      {/* 2. VISUAL SUMMARY & FREQUENCY ORBIT */}
      <div className="relative flex-1 w-full max-w-3xl mx-auto my-6 flex flex-col items-center justify-center">
        {/* Animated Radar Frequency Disc (Recreating Beats Reference Screen 6) */}
        <div className="relative w-36 h-36 md:w-48 md:h-48 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.05, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#FAFF00]/40"
          />
          <motion.div
            animate={{ scale: [1, 1.7, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.4 }}
            className="absolute inset-0 rounded-full border border-white/20"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            className="absolute inset-[-15px] pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FAFF00] shadow-[0_0_12px_#FAFF00]" />
            <div className="absolute bottom-2 right-4 w-2.5 h-2.5 rounded-full bg-white/70" />
            <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-zinc-600" />
          </motion.div>

          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-zinc-950 border-2 border-[#FAFF00] p-4 flex items-center justify-center shadow-[0_0_35px_rgba(250,255,0,0.4)] z-10">
            {isSynthesizing ? (
              <Loader2 className="animate-spin text-[#FAFF00]" size={36} />
            ) : (
              <Image
                src="/logo-trimmed.png"
                alt="Orpheus"
                width={48}
                height={48}
                className="object-contain brightness-0 invert"
              />
            )}
          </div>
        </div>

        {/* Selected Genres Badges */}
        <div className="w-full text-center mb-6">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FAFF00] block mb-2">
            Selected Sonic Frequencies ({selectedGenres.length})
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="px-3.5 py-1.5 rounded-full bg-[#FAFF00] text-black font-geist font-black text-xs uppercase tracking-wider shadow-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Artists Badges */}
        <div className="w-full text-center mb-4">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 block mb-2">
            Anchor Artists ({selectedArtists.length})
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {selectedArtists.map((artist) => (
              <span
                key={artist}
                className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-geist font-bold text-xs uppercase tracking-wider"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTIONS */}
      <div className="relative pb-6 pt-4 px-6 max-w-xl mx-auto w-full z-30 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSynthesizing}
            className="flex items-center gap-2 text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            <span>Artists</span>
          </button>

          <motion.button
            type="button"
            onClick={handleBuild}
            disabled={isSynthesizing}
            whileHover={!isSynthesizing ? { scale: 1.05 } : {}}
            whileTap={!isSynthesizing ? { scale: 0.95 } : {}}
            className="flex-1 max-w-xs flex items-center justify-center gap-2.5 bg-[#FAFF00] text-black px-8 py-4 rounded-full font-geist font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_35px_rgba(250,255,0,0.45)] hover:bg-white cursor-pointer disabled:cursor-wait"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <span>BUILD MY EXPERIENCE</span>
                <Check size={18} strokeWidth={3} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

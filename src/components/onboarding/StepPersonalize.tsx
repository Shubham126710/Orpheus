"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

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
      className="relative w-full h-full flex flex-col justify-between overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 z-20 select-none bg-[#050505]"
    >
      {/* 1. TOP HEADER & PROGRESS */}
      <div className="relative text-center shrink-0 z-30 pt-2 sm:pt-4">
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

      {/* 2. REBALANCED SUMMARY CONTENT (Spacious, intentional, orbital graphic removed) */}
      <div className="relative flex-1 w-full max-w-2xl mx-auto my-auto flex flex-col items-center justify-center gap-8 sm:gap-10 py-6">
        {/* Selected Genres Section */}
        <div className="w-full text-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#FAFF00] block mb-3">
            Selected Sonic Frequencies ({selectedGenres.length})
          </span>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="px-4 py-1.5 rounded-full bg-[#FAFF00] text-black font-geist font-black text-xs uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Artists Section */}
        <div className="w-full text-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-white/50 block mb-3">
            Anchor Artists ({selectedArtists.length})
          </span>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
            {selectedArtists.map((artist) => (
              <span
                key={artist}
                className="px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-geist font-bold text-xs uppercase tracking-wider transition-colors hover:border-white/30"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM ACTIONS */}
      <div className="relative pb-4 sm:pb-6 pt-4 px-4 sm:px-6 max-w-xl mx-auto w-full z-30 shrink-0">
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
            whileHover={!isSynthesizing ? { scale: 1.04 } : {}}
            whileTap={!isSynthesizing ? { scale: 0.96 } : {}}
            className="flex-1 max-w-xs flex items-center justify-center gap-2.5 bg-[#FAFF00] text-black px-8 py-3.5 sm:py-4 rounded-full font-geist font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_35px_rgba(250,255,0,0.45)] hover:bg-white cursor-pointer disabled:cursor-wait"
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

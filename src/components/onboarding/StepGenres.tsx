"use client";

import React from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ONBOARDING_GENRES } from "./genresData";
import { GenreBubble } from "./GenreBubble";

interface StepGenresProps {
  selectedGenres: string[];
  onToggleGenre: (genreId: string) => void;
  onReset: () => void;
  onNext: () => void;
}

export const StepGenres: React.FC<StepGenresProps> = ({
  selectedGenres,
  onToggleGenre,
  onReset,
  onNext,
}) => {
  const count = selectedGenres.length;
  const isSatisfied = count >= 3;
  const remaining = 3 - count;

  return (
    <motion.div
      key="step-genres"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-[#050505]"
    >
      {/* 1. FIXED TOP HEADER & PROGRESS */}
      <div className="relative pt-4 sm:pt-6 pb-2 px-4 text-center z-40 shrink-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent">
        <div className="inline-flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#FAFF00] font-bold">
            01
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            /
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            03
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-geist font-black tracking-tight uppercase text-white leading-tight">
          TAP THE GENRES YOU LOVE
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm text-white/50 font-geist tracking-wide">
          Pick the sounds that feel like you.
        </p>
      </div>

      {/* 2. THE HERO BUBBLE FIELD (Scrollable Container) */}
      <div className="flex-1 min-h-0 relative w-full overflow-hidden">
        {/* DESKTOP BEHAVIOR: Vertically scrollable bubble canvas */}
        <div className="hidden md:block w-full h-full overflow-y-auto overflow-x-hidden relative touch-pan-y">
          {/* Subtle top & bottom edge fades */}
          <div className="pointer-events-none sticky top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#050505] to-transparent z-20" />

          <div className="relative w-full max-w-6xl mx-auto h-[1400px]">
            {ONBOARDING_GENRES.map((genre, idx) => (
              <GenreBubble
                key={genre.id}
                genre={genre}
                isSelected={selectedGenres.includes(genre.id)}
                onClick={() => onToggleGenre(genre.id)}
                isMobile={false}
                index={idx}
              />
            ))}
          </div>

          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#050505] to-transparent z-20" />
        </div>

        {/* MOBILE BEHAVIOR: Horizontally scrollable bubble canvas */}
        <div className="block md:hidden w-full h-full overflow-x-auto overflow-y-hidden relative touch-pan-x">
          {/* Subtle left & right edge fades */}
          <div className="pointer-events-none fixed left-0 top-24 bottom-24 w-8 bg-gradient-to-r from-[#050505] to-transparent z-20" />

          <div className="relative w-[2400px] h-full min-h-[460px]">
            {ONBOARDING_GENRES.map((genre, idx) => (
              <GenreBubble
                key={genre.id}
                genre={genre}
                isSelected={selectedGenres.includes(genre.id)}
                onClick={() => onToggleGenre(genre.id)}
                isMobile={true}
                index={idx}
              />
            ))}
          </div>

          <div className="pointer-events-none fixed right-0 top-24 bottom-24 w-10 bg-gradient-to-l from-[#050505] to-transparent z-20" />
        </div>
      </div>

      {/* 3. FIXED PERSISTENT BOTTOM ACTION BAR */}
      <div className="relative z-40 shrink-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pt-3 pb-5 sm:pb-6 px-4 sm:px-8 border-t border-white/5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Counter & Reset */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isSatisfied ? "bg-[#FAFF00] shadow-[0_0_10px_#FAFF00]" : "bg-white/30"
                }`}
              />
              <span className="text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/90">
                {count === 0
                  ? "Select at least 3 genres"
                  : isSatisfied
                  ? `${count} Genres Selected`
                  : `Select ${remaining} more genre${remaining > 1 ? "s" : ""}`}
              </span>
            </div>

            {count > 0 && (
              <button
                type="button"
                onClick={onReset}
                title="Reset selections"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-[#FAFF00] transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Primary Next Button (Fixed & Always Visible) */}
          <motion.button
            type="button"
            onClick={onNext}
            disabled={!isSatisfied}
            whileHover={isSatisfied ? { scale: 1.04 } : {}}
            whileTap={isSatisfied ? { scale: 0.96 } : {}}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-geist font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 select-none ${
              isSatisfied
                ? "bg-[#FAFF00] text-black shadow-[0_0_35px_rgba(250,255,0,0.5)] hover:bg-white cursor-pointer"
                : "bg-white/10 text-white/30 border border-white/5 cursor-not-allowed"
            }`}
          >
            <span>NEXT: ARTISTS →</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

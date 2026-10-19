"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const count = selectedGenres.length;
  const isSatisfied = count >= 3;
  const remaining = 3 - count;

  return (
    <motion.div
      key="step-genres"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 1. TOP HEADER & PROGRESS */}
      <div className="relative pt-6 md:pt-8 px-4 sm:px-8 text-center z-30 shrink-0">
        <div className="inline-flex items-center gap-2 mb-2">
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

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-geist font-black tracking-tight uppercase text-white leading-tight">
          TAP THE GENRES YOU LOVE
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-white/50 font-geist tracking-wide">
          Pick the sounds that feel like you.
        </p>
      </div>

      {/* 2. THE HERO BUBBLE FIELD */}
      <div className="relative flex-1 w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px] my-2 overflow-x-hidden overflow-y-visible flex items-center justify-center">
        {/* Ambient Dark Gradient Vignette for Depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-[#050505] pointer-events-none z-10" />

        {/* The Organic Cluster Canvas */}
        <div className="relative w-full max-w-7xl h-full mx-auto">
          {ONBOARDING_GENRES.map((genre, idx) => (
            <GenreBubble
              key={genre.id}
              genre={genre}
              isSelected={selectedGenres.includes(genre.id)}
              onClick={() => onToggleGenre(genre.id)}
              isMobile={isMobile}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR (Accessible, Fixed Placement) */}
      <div className="relative pb-6 md:pb-8 pt-4 px-6 md:px-12 bg-gradient-to-t from-black via-black/90 to-transparent z-30 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Counter & Reset */}
          <div className="flex items-center gap-4">
            {count > 0 && (
              <button
                type="button"
                onClick={onReset}
                title="Reset selections"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-[#FAFF00] transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isSatisfied ? "bg-[#FAFF00] shadow-[0_0_8px_#FAFF00]" : "bg-white/30"
                }`}
              />
              <span className="text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/80">
                {count === 0
                  ? "Select at least 3 genres"
                  : isSatisfied
                  ? `${count} Genres Selected`
                  : `Select ${remaining} more genre${remaining > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Right: Primary Next Button */}
          <motion.button
            type="button"
            onClick={onNext}
            disabled={!isSatisfied}
            whileHover={isSatisfied ? { scale: 1.05 } : {}}
            whileTap={isSatisfied ? { scale: 0.95 } : {}}
            className={`flex items-center gap-2.5 px-7 sm:px-10 py-3.5 sm:py-4 rounded-full font-geist font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 select-none ${
              isSatisfied
                ? "bg-[#FAFF00] text-black shadow-[0_0_30px_rgba(250,255,0,0.45)] hover:bg-white cursor-pointer"
                : "bg-white/10 text-white/30 border border-white/5 cursor-not-allowed"
            }`}
          >
            <span>NEXT: ARTISTS</span>
            <ArrowRight size={16} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { ONBOARDING_ARTISTS } from "./artistsData";
import { ArtistBubble } from "./ArtistBubble";
import { ArtistItem } from "./types";

interface StepArtistsProps {
  selectedGenres: string[];
  selectedArtists: string[];
  onToggleArtist: (artistName: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepArtists: React.FC<StepArtistsProps> = ({
  selectedGenres,
  selectedArtists,
  onToggleArtist,
  onBack,
  onNext,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [extraBatchCount, setExtraBatchCount] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sort and filter artists so those matching selected genres appear in prime focal slots
  const displayedArtists = useMemo(() => {
    const matching: ArtistItem[] = [];
    const others: ArtistItem[] = [];

    ONBOARDING_ARTISTS.forEach((artist) => {
      if (selectedGenres.includes(artist.genre)) {
        matching.push(artist);
      } else {
        others.push(artist);
      }
    });

    // Combine prioritized artists with others
    const combined = [...matching, ...others];
    // Return based on batch count (default all base + can load more)
    return combined;
  }, [selectedGenres]);

  const count = selectedArtists.length;
  const isSatisfied = count >= 3;
  const remaining = 3 - count;

  return (
    <motion.div
      key="step-artists"
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
            02
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            /
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            03
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-geist font-black tracking-tight uppercase text-white leading-tight">
          WHO&apos;S ON YOUR ROTATION?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-white/50 font-geist tracking-wide">
          Pick the artists you&apos;d never skip.
        </p>
      </div>

      {/* 2. THE ARTIST BUBBLE FIELD */}
      <div className="relative flex-1 w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px] my-2 overflow-x-hidden overflow-y-visible flex items-center justify-center">
        {/* Ambient Dark Gradient Vignette for Depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-[#050505] pointer-events-none z-10" />

        {/* The Organic Cluster Canvas */}
        <div className="relative w-full max-w-7xl h-full mx-auto">
          {displayedArtists.map((artist, idx) => (
            <ArtistBubble
              key={artist.id}
              artist={artist}
              isSelected={selectedArtists.includes(artist.name)}
              onClick={() => onToggleArtist(artist.name)}
              isMobile={isMobile}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR */}
      <div className="relative pb-6 md:pb-8 pt-4 px-6 md:px-12 bg-gradient-to-t from-black via-black/90 to-transparent z-30 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back to Genres */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Genres</span>
          </button>

          {/* Center: Live Counter */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isSatisfied ? "bg-[#FAFF00] shadow-[0_0_8px_#FAFF00]" : "bg-white/30"
              }`}
            />
            <span className="text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/80">
              {count === 0
                ? "Select at least 3 artists"
                : isSatisfied
                ? `${count} Artists Selected`
                : `Select ${remaining} more artist${remaining > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Right: Next Step Button */}
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
            <span>NEXT: PERSONALIZE</span>
            <ArrowRight size={16} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

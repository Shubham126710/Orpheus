"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  // Pre-extracted slot positions from curated layout to guarantee 0 collisions
  const slots = useMemo(() => {
    return ONBOARDING_ARTISTS.map((item) => ({
      desktop: item.desktop,
      mobile: item.mobile,
    }));
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

    const ordered = [...matching, ...others];

    // Assign slot positions to ordered artists so matching genres take the top hero positions
    return ordered.map((artist, idx) => {
      const slot = slots[idx] || { desktop: artist.desktop, mobile: artist.mobile };
      return {
        ...artist,
        desktop: {
          ...artist.desktop,
          size: slot.desktop.size,
          x: slot.desktop.x,
          y: slot.desktop.y,
        },
        mobile: {
          ...artist.mobile,
          size: slot.mobile.size,
          x: slot.mobile.x,
          y: slot.mobile.y,
        },
      };
    });
  }, [selectedGenres, slots]);

  const count = selectedArtists.length;
  const isSatisfied = count >= 3;
  const remaining = 3 - count;

  return (
    <motion.div
      key="step-artists"
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
            02
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            /
          </span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/40">
            03
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-geist font-black tracking-tight uppercase text-white leading-tight">
          WHO&apos;S ON YOUR ROTATION?
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm text-white/50 font-geist tracking-wide">
          Pick the artists you&apos;d never skip.
        </p>
      </div>

      {/* 2. THE ARTIST BUBBLE FIELD (Scrollable Container) */}
      <div className="flex-1 min-h-0 relative w-full overflow-hidden">
        {/* DESKTOP BEHAVIOR: Vertically scrollable canvas */}
        <div className="hidden md:block w-full h-full overflow-y-auto overflow-x-hidden relative touch-pan-y">
          <div className="pointer-events-none sticky top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#050505] to-transparent z-20" />

          <div className="relative w-full max-w-6xl mx-auto h-[1850px]">
            {displayedArtists.map((artist, idx) => (
              <ArtistBubble
                key={artist.id}
                artist={artist}
                isSelected={selectedArtists.includes(artist.name)}
                onClick={() => onToggleArtist(artist.name)}
                isMobile={false}
                index={idx}
              />
            ))}
          </div>

          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#050505] to-transparent z-20" />
        </div>

        {/* MOBILE BEHAVIOR: Horizontally scrollable canvas */}
        <div className="block md:hidden w-full h-full overflow-x-auto overflow-y-hidden relative touch-pan-x">
          <div className="pointer-events-none fixed left-0 top-24 bottom-24 w-8 bg-gradient-to-r from-[#050505] to-transparent z-20" />

          <div className="relative w-[3200px] h-full min-h-[460px]">
            {displayedArtists.map((artist, idx) => (
              <ArtistBubble
                key={artist.id}
                artist={artist}
                isSelected={selectedArtists.includes(artist.name)}
                onClick={() => onToggleArtist(artist.name)}
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
          {/* Left: Back & Counter */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-geist font-black tracking-wider uppercase text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Genres</span>
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isSatisfied ? "bg-[#FAFF00] shadow-[0_0_10px_#FAFF00]" : "bg-white/30"
                }`}
              />
              <span className="text-xs sm:text-sm font-geist font-black tracking-wider uppercase text-white/90">
                {count === 0
                  ? "Select at least 3 artists"
                  : isSatisfied
                  ? `${count} Artists Selected`
                  : `Select ${remaining} more artist${remaining > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Right: Next Step Button */}
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
            <span>NEXT: PERSONALIZE →</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

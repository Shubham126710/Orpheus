"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArtistItem } from "./types";

interface ArtistBubbleProps {
  artist: ArtistItem;
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
  index: number;
}

export const ArtistBubble: React.FC<ArtistBubbleProps> = ({
  artist,
  isSelected,
  onClick,
  isMobile,
  index,
}) => {
  const [imgError, setImgError] = useState(false);
  const coords = isMobile ? artist.mobile : artist.desktop;
  const size = coords.size;

  const floatDuration = 4.2 + (index % 4) * 0.7;
  const floatDelay = (index % 5) * 0.25;

  const fontSizeClass =
    size >= 185
      ? "text-xs md:text-sm tracking-[0.18em]"
      : size >= 140
      ? "text-[11px] md:text-xs tracking-[0.14em]"
      : "text-[9px] md:text-[10px] tracking-[0.1em]";

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Artist: ${artist.name}`}
      onClick={onClick}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.08 : 1,
        opacity: 1,
        y: [0, -3, 0],
      }}
      transition={{
        scale: { type: "spring", stiffness: 450, damping: 25 },
        opacity: { duration: 0.4, delay: Math.min(index * 0.02, 0.4) },
        y: {
          repeat: Infinity,
          duration: floatDuration,
          delay: floatDelay,
          ease: "easeInOut",
        },
      }}
      whileHover={{ scale: isSelected ? 1.12 : 1.05 }}
      whileTap={{ scale: 0.94 }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${coords.x}%`,
        top: `${coords.y}%`,
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden select-none cursor-pointer transition-all duration-300 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFF00] ${
        isSelected
          ? "border-4 border-[#FAFF00] shadow-[0_0_40px_rgba(250,255,0,0.55)] z-20"
          : "border border-white/20 hover:border-white/50 hover:shadow-lg"
      }`}
    >
      {/* Background Image / Texture */}
      {!imgError && artist.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artist.imageUrl}
          alt={artist.name}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
            isSelected ? "scale-110 filter brightness-105" : "scale-100 filter brightness-90 grayscale-[25%]"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
      )}

      {/* Dark Vignette Overlay for Text Readability */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isSelected
            ? "bg-gradient-to-t from-black/85 via-black/30 to-black/20"
            : "bg-gradient-to-t from-black/90 via-black/50 to-black/30"
        }`}
      />

      {/* Yellow Tint Overlay on Selection */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#FAFF00]/10 mix-blend-color pointer-events-none" />
      )}

      {/* Content Container */}
      <div className="relative h-full w-full flex flex-col items-center justify-end pb-3 sm:pb-4 px-2 z-10">
        <span
          className={`font-geist font-black uppercase text-center leading-tight transition-colors drop-shadow-md ${fontSizeClass} ${
            isSelected ? "text-[#FAFF00]" : "text-white"
          }`}
        >
          {artist.name}
        </span>
      </div>

      {/* Checkmark Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FAFF00] text-black flex items-center justify-center shadow-lg z-20"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

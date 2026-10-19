"use client";

import React from "react";
import { motion } from "framer-motion";
import { GenreItem } from "./types";
import { GenreIcon } from "./GenreIcons";

interface GenreBubbleProps {
  genre: GenreItem;
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
  index: number;
}

export const GenreBubble: React.FC<GenreBubbleProps> = ({
  genre,
  isSelected,
  onClick,
  isMobile,
  index,
}) => {
  const coords = isMobile ? genre.mobile : genre.desktop;
  const size = coords.size;

  // Staggered gentle ambient float
  const floatDuration = 4 + (index % 4) * 0.8;
  const floatDelay = (index % 5) * 0.3;

  // Dynamic font sizing based on bubble diameter
  const fontSizeClass =
    size >= 190
      ? "text-sm md:text-base tracking-[0.2em]"
      : size >= 145
      ? "text-xs md:text-sm tracking-[0.16em]"
      : "text-[10px] md:text-xs tracking-[0.12em]";

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Genre: ${genre.name}`}
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
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center p-3 select-none cursor-pointer transition-colors duration-300 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFF00] ${
        isSelected
          ? "bg-[#FAFF00] text-black shadow-[0_0_40px_rgba(250,255,0,0.45)] z-20 border-2 border-black/40"
          : "bg-[#141414] text-white/90 border border-white/10 hover:border-white/30 hover:bg-[#1a1a1a]"
      }`}
    >
      {/* Musical illustration for hero / medium bubbles */}
      <GenreIcon name={genre.iconName} isSelected={isSelected} />

      {/* Genre Title */}
      <span
        className={`font-geist font-black uppercase text-center leading-tight transition-colors ${fontSizeClass} ${
          isSelected ? "text-black drop-shadow-none" : "text-white"
        }`}
      >
        {genre.name}
      </span>

      {/* Selected Indicator Pill */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black text-[#FAFF00] flex items-center justify-center shadow-md border border-black/20"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

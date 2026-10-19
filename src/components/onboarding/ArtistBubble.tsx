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

/**
 * Returns balanced, sensible line breaks for artist display names
 * to avoid awkward single-word wrapping on circular bounds.
 */
function formatArtistLines(name: string): string[] {
  const customBreaks: Record<string, string[]> = {
    "NUSRAT FATEH ALI KHAN": ["NUSRAT FATEH", "ALI KHAN"],
    "SIDHU MOOSE WALA": ["SIDHU MOOSE", "WALA"],
    "SHANKAR-EHSAAN-LOY": ["SHANKAR-EHSAAN", "LOY"],
    "VISHAL-SHEKHAR": ["VISHAL", "SHEKHAR"],
    "A.R. RAHMAN": ["A.R. RAHMAN"],
    "MOHAMMED RAFI": ["MOHAMMED", "RAFI"],
    "LATA MANGESHKAR": ["LATA", "MANGESHKAR"],
    "KISHORE KUMAR": ["KISHORE", "KUMAR"],
    "SHREYA GHOSHAL": ["SHREYA", "GHOSHAL"],
    "DILJIT DOSANJH": ["DILJIT", "DOSANJH"],
    "ARCTIC MONKEYS": ["ARCTIC", "MONKEYS"],
    "MICHAEL JACKSON": ["MICHAEL", "JACKSON"],
    "KENDRICK LAMAR": ["KENDRICK", "LAMAR"],
    "TRAVIS SCOTT": ["TRAVIS", "SCOTT"],
    "THE BEATLES": ["THE", "BEATLES"],
    "THE WEEKND": ["THE", "WEEKND"],
    "DAFT PUNK": ["DAFT", "PUNK"],
    "PINK FLOYD": ["PINK", "FLOYD"],
    "LED ZEPPELIN": ["LED", "ZEPPELIN"],
    "TAME IMPALA": ["TAME", "IMPALA"],
    "BILLIE EILISH": ["BILLIE", "EILISH"],
    "MILES DAVIS": ["MILES", "DAVIS"],
    "FRANK OCEAN": ["FRANK", "OCEAN"],
    "FRED AGAIN..": ["FRED", "AGAIN.."],
    "SUNIDHI CHAUHAN": ["SUNIDHI", "CHAUHAN"],
    "UDIT NARAYAN": ["UDIT", "NARAYAN"],
    "KARAN AUJLA": ["KARAN", "AUJLA"],
    "ANUV JAIN": ["ANUV", "JAIN"],
    "PRATEEK KUHAD": ["PRATEEK", "KUHAD"],
    "JAGJIT SINGH": ["JAGJIT", "SINGH"],
    "ZAKIR HUSSAIN": ["ZAKIR", "HUSSAIN"],
  };

  const upper = name.toUpperCase().trim();
  if (customBreaks[upper]) {
    return customBreaks[upper];
  }

  // Fallback: split two-word names that are long
  const words = upper.split(" ");
  if (words.length === 2 && upper.length > 11) {
    return words;
  }
  return [upper];
}

/**
 * Returns clean initials for the typographic fallback monogram
 */
function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
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

  const nameLines = formatArtistLines(artist.name);
  const initials = getInitials(artist.name);

  // Responsive font sizing based on diameter
  const fontSizeClass =
    size >= 190
      ? "text-xs sm:text-sm tracking-[0.16em]"
      : size >= 145
      ? "text-[10.5px] sm:text-xs tracking-[0.13em]"
      : "text-[9px] sm:text-[10px] tracking-[0.1em]";

  const hasPhoto = !imgError && Boolean(artist.imageUrl);

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
      {/* 1. VISUAL LAYER: Verified Portrait OR Typographic Bubble */}
      {hasPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artist.imageUrl}
          alt={artist.name}
          onError={() => setImgError(true)}
          style={{ objectPosition: artist.objectPosition || "center 20%" }}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
            isSelected
              ? "scale-110 filter brightness-105"
              : "scale-100 filter brightness-95 grayscale-[15%] group-hover:grayscale-0"
          }`}
        />
      ) : (
        /* Typographic Bubble Fallback (Intentional Dark Vinyl Aesthetic) */
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c20] via-[#121215] to-[#08080a] flex flex-col items-center justify-center p-3">
          {/* Subtle Concentric Vinyl Groove Rings */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="45" stroke="#FAFF00" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" opacity="0.4" />
            <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="0.5" opacity="0.2" />
          </svg>

          {/* Monogram Pill / Badge */}
          <div className="relative mb-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-widest text-[#FAFF00] font-black">
              {initials}
            </span>
          </div>
        </div>
      )}

      {/* 2. GRADIENT VIGNETTE: Keeps faces unobstructed while names stay 100% legible */}
      {hasPhoto ? (
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            isSelected
              ? "bg-gradient-to-t from-black/95 via-black/45 to-transparent"
              : "bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      )}

      {/* 3. ELECTRIC YELLOW TINT ON SELECTION */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#FAFF00]/10 mix-blend-color pointer-events-none" />
      )}

      {/* 4. ARTIST LABEL (Lower Edge Placement) */}
      <div
        className={`relative h-full w-full flex flex-col items-center justify-end px-2 z-10 ${
          hasPhoto ? "pb-3 sm:pb-4" : "pb-4 sm:pb-5"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-0.5">
          {nameLines.map((line, idx) => (
            <span
              key={idx}
              className={`font-geist font-black uppercase text-center leading-[1.15] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${fontSizeClass} ${
                isSelected ? "text-[#FAFF00]" : "text-white"
              }`}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Subtle Yellow Accent Dot for Typographic Fallback */}
        {!hasPhoto && (
          <div
            className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-colors ${
              isSelected ? "bg-[#FAFF00] shadow-[0_0_8px_#FAFF00]" : "bg-white/30"
            }`}
          />
        )}
      </div>

      {/* 5. SELECTION CHECKMARK BADGE */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FAFF00] text-black flex items-center justify-center shadow-lg z-20"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

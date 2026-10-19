import React from "react";

export function GenreIcon({ name, isSelected }: { name?: string; isSelected: boolean }) {
  if (!name) return null;

  const colorClass = isSelected ? "text-black fill-current stroke-black" : "text-white/60 fill-current stroke-white/60";

  switch (name) {
    case "guitar":
      // Iconic rock electric guitar
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-11 md:h-11 mb-1 transition-transform ${colorClass}`}>
          <path
            d="M48 6l10 10-6 6-4-4-12 12c-1 3-3 5-6 6l-3 3c-1 1-3 1-4 0l-7-7c-1-1-1-3 0-4l3-3c1-3 3-5 6-6l12-12-4-4 6-6zM22 36l6 6M18 46c-6 2-12 8-12 12 0 1 1 2 2 2 4 0 10-6 12-12l-2-2z"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="20" cy="44" r="3" fill="currentColor" />
        </svg>
      );

    case "waveform":
      // Undulating electronic synth waveform (like in Beats reference)
      return (
        <svg viewBox="0 0 64 32" className={`w-10 h-5 md:w-14 md:h-7 mb-1 transition-transform ${colorClass}`}>
          <path
            d="M2 16 Q 8 2, 14 16 T 26 16 T 38 16 T 50 16 T 62 16"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 16 Q 12 28, 18 16 T 30 16 T 42 16 T 54 16"
            strokeWidth="2.5"
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      );

    case "trumpet":
      // Vintage jazz trumpet
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <path
            d="M8 26h28l16-12v36l-16-12H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4zM24 20v6M28 20v6M32 20v6"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <ellipse cx="52" cy="32" rx="4" ry="14" strokeWidth="3" fill="none" />
        </svg>
      );

    case "turntable":
      // Turntable vinyl & tonearm
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <circle cx="30" cy="32" r="22" strokeWidth="3.5" fill="none" />
          <circle cx="30" cy="32" r="14" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <circle cx="30" cy="32" r="5" fill="currentColor" />
          <path d="M48 14l-6 18-6 2" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="14" r="3.5" fill="currentColor" />
        </svg>
      );

    case "lyre":
      // Classical Greek Lyre (Orpheus symbol)
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <path
            d="M16 12c-4 12-4 28 8 36 4 3 6 4 8 4s4-1 8-4c12-8 12-24 8-36"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M12 12h40M26 12v38M32 12v40M38 12v38" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="24" y="52" width="16" height="4" rx="2" fill="currentColor" />
        </svg>
      );

    case "mic":
      // R&B / Soul vintage vocal mic
      return (
        <svg viewBox="0 0 64 64" className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-transform ${colorClass}`}>
          <rect x="24" y="10" width="16" height="24" rx="8" strokeWidth="3.5" fill="none" />
          <path d="M16 26c0 10 7 16 16 16s16-6 16-16M32 42v12M22 54h20" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case "lightning":
      // Metal lightning
      return (
        <svg viewBox="0 0 64 64" className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-transform ${colorClass}`}>
          <path d="M36 6L16 34h14l-4 24 24-32H34z" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case "cassette":
      // Indie cassette
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <rect x="10" y="16" width="44" height="32" rx="4" strokeWidth="3" fill="none" />
          <circle cx="22" cy="30" r="5" strokeWidth="2.5" fill="none" />
          <circle cx="42" cy="30" r="5" strokeWidth="2.5" fill="none" />
          <path d="M18 42h28l-3-6H21z" strokeWidth="2" fill="none" />
        </svg>
      );

    case "equalizer":
      // Dance / Techno equalizer bars
      return (
        <svg viewBox="0 0 64 64" className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-transform ${colorClass}`}>
          <path d="M14 46V24M23 46V14M32 46V18M41 46V10M50 46V28" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case "concentric":
      // Ambient atmospheric concentric rings
      return (
        <svg viewBox="0 0 64 64" className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-transform ${colorClass}`}>
          <circle cx="32" cy="32" r="6" fill="currentColor" />
          <circle cx="32" cy="32" r="14" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
          <circle cx="32" cy="32" r="22" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
        </svg>
      );

    case "sparkles":
      // Pop / Disco sparkles
      return (
        <svg viewBox="0 0 64 64" className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-transform ${colorClass}`}>
          <path d="M32 10l4 14 14 4-14 4-4 14-4-14-14-4 14-4zM48 42l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" />
        </svg>
      );

    case "film":
      // Bollywood cinema reel / clapper
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <rect x="10" y="16" width="44" height="34" rx="4" strokeWidth="3.5" fill="none" />
          <path d="M10 26h44M18 16l-4 10M28 16l-4 10M38 16l-4 10M48 16l-4 10" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="38" r="4" fill="currentColor" />
          <circle cx="40" cy="38" r="4" fill="currentColor" />
        </svg>
      );

    case "sitar":
      // Indian classical sitar
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <path d="M46 8l10 10-24 24c-3-2-6-3-10-3-8 0-14 6-14 14 0 2 1 3 3 3 8 0 14-6 14-14 0-4-1-7-3-10z" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="19" cy="45" r="4" fill="currentColor" />
          <path d="M38 16l8 8M32 22l6 6M26 28l4 4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "dhol":
      // Punjabi dhol / bhangra drum
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <ellipse cx="32" cy="18" rx="20" ry="7" strokeWidth="3.5" fill="none" />
          <path d="M12 18v28c0 3.87 8.95 7 20 7s20-3.13 20-7V18" strokeWidth="3.5" fill="none" />
          <path d="M14 22l18 31 18-31M32 18v35" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "harmonium":
      // Ghazal / Sufi harmonium keys
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <rect x="8" y="20" width="48" height="26" rx="4" strokeWidth="3.5" fill="none" />
          <path d="M14 20v26M20 20v26M26 20v26M32 20v26M38 20v26M44 20v26M50 20v26" strokeWidth="2" />
          <rect x="17" y="20" width="4" height="15" fill="currentColor" />
          <rect x="29" y="20" width="4" height="15" fill="currentColor" />
          <rect x="41" y="20" width="4" height="15" fill="currentColor" />
        </svg>
      );

    case "lotus":
      // Devotional sacred lotus
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <path d="M32 14c-4 8-4 18 0 26 4-8 4-18 0-26z" strokeWidth="3" fill="none" />
          <path d="M32 40c-10-2-18-10-20-20 6 4 14 10 20 20zM32 40c10-2 18-10 20-20-6 4-14 10-20 20z" strokeWidth="3" fill="none" />
          <path d="M12 48c12 4 28 4 40 0" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case "flute":
      // Indian bansuri folk flute
      return (
        <svg viewBox="0 0 64 64" className={`w-8 h-8 md:w-10 md:h-10 mb-1 transition-transform ${colorClass}`}>
          <path d="M10 54L54 10" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="26" cy="38" r="2" fill={isSelected ? "black" : "white"} />
          <circle cx="32" cy="32" r="2" fill={isSelected ? "black" : "white"} />
          <circle cx="38" cy="26" r="2" fill={isSelected ? "black" : "white"} />
          <circle cx="44" cy="20" r="2" fill={isSelected ? "black" : "white"} />
        </svg>
      );

    default:
      return null;
  }
}

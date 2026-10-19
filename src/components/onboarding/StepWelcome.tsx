"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface StepWelcomeProps {
  userName?: string;
  onStart: () => void;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({ userName, onStart }) => {
  const firstName = userName ? userName.split(" ")[0] : "";

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center px-6 py-12 z-20"
    >
      {/* Central Ambient Aura Rings */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 mb-8 flex items-center justify-center">
        {/* Outer Pulsing Aura */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-[#FAFF00]/40"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.6 }}
          className="absolute inset-0 rounded-full border border-white/20"
        />

        {/* Orbiting Satellite Dots (Beats-style) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute inset-[-18px] pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FAFF00] shadow-[0_0_12px_#FAFF00]" />
          <div className="absolute bottom-2 right-4 w-2.5 h-2.5 rounded-full bg-white/60" />
          <div className="absolute top-1/3 left-0 w-2 h-2 rounded-full bg-zinc-600" />
        </motion.div>

        {/* Center Brand Disc */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-zinc-950 border-2 border-[#FAFF00] p-4 flex items-center justify-center shadow-[0_0_35px_rgba(250,255,0,0.35)] z-10">
          <Image
            src="/logo-trimmed.png"
            alt="Orpheus"
            width={48}
            height={48}
            className="object-contain brightness-0 invert"
          />
        </div>
      </div>

      {/* Progress badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
        <Sparkles size={12} className="text-[#FAFF00]" />
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/70">
          Taste Calibration
        </span>
      </div>

      {/* Confident Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-geist font-black tracking-tight uppercase text-white leading-tight">
        {firstName ? `WELCOME, ${firstName}.` : "LET THE MUSIC FIND YOU."}
      </h1>

      {/* Supporting Text */}
      <p className="mt-4 text-base md:text-lg text-white/60 font-geist max-w-md mx-auto leading-relaxed">
        Tell us what you love. We&apos;ll take it from there.
      </p>

      {/* Primary Action Button */}
      <motion.button
        type="button"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 inline-flex items-center gap-3 bg-[#FAFF00] text-black px-12 py-4.5 rounded-full font-geist font-black text-xs md:text-sm tracking-[0.25em] uppercase transition-all shadow-[0_0_35px_rgba(250,255,0,0.4)] hover:bg-white cursor-pointer"
      >
        <span>LET&apos;S GO</span>
        <ArrowRight size={16} strokeWidth={3} />
      </motion.button>
    </motion.div>
  );
};

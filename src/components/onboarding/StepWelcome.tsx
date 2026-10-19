"use client";

import React from "react";
import { motion } from "framer-motion";
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
      className="relative w-full max-w-xl mx-auto my-auto flex flex-col items-center justify-center text-center px-6 py-12 z-20"
    >

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

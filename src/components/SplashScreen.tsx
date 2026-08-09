"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = [
  "TUNING IN",
  "FINDING YOUR SOUND",
  "SETTING THE STAGE",
  "ALMOST THERE"
];

export default function SplashScreen() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E9C052] text-black overflow-hidden">
      
      {/* Subtle Analog Grain - Keeps the warm Orpheus feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay motion-reduce:hidden" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center z-10 w-full"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-28 h-28 mb-8"
        >
          <img 
            src="/logo.png" 
            alt="Orpheus Logo"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-3xl font-geist font-black uppercase tracking-[0.4em] mb-12 ml-2"
        >
          Orpheus
        </motion.h1>

        {/* Elegant Breathing Waveform */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-[140px] h-12 flex items-center justify-center mb-8 opacity-80"
        >
          <svg width="140" height="48" viewBox="0 0 140 48" className="overflow-visible fill-none stroke-black stroke-[1.5] stroke-linecap-round">
            {/* Background static line */}
            <path d="M 0,24 Q 35,24 70,24 T 140,24" className="opacity-[0.08]" />
            
            {/* Animating waveforms */}
            <motion.path 
              d="M 0,24 Q 35,24 70,24 T 140,24"
              animate={{
                d: [
                  "M 0,24 Q 35,24 70,24 T 140,24",
                  "M 0,24 Q 35,4 70,24 T 140,24",
                  "M 0,24 Q 35,44 70,24 T 140,24",
                  "M 0,24 Q 35,24 70,24 T 140,24"
                ]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="opacity-70"
            />
            <motion.path 
              d="M 0,24 Q 35,24 70,24 T 140,24"
              animate={{
                d: [
                  "M 0,24 Q 35,24 70,24 T 140,24",
                  "M 0,24 Q 35,44 70,24 T 140,24",
                  "M 0,24 Q 35,4 70,24 T 140,24",
                  "M 0,24 Q 35,24 70,24 T 140,24"
                ]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="opacity-40"
            />
            <motion.path 
              d="M 0,24 Q 35,24 70,24 T 140,24"
              animate={{
                d: [
                  "M 0,24 Q 35,24 70,24 T 140,24",
                  "M 0,24 Q 35,14 70,24 T 140,24",
                  "M 0,24 Q 35,34 70,24 T 140,24",
                  "M 0,24 Q 35,24 70,24 T 140,24"
                ]
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="opacity-30"
            />
          </svg>
        </motion.div>

        {/* Animated Loading Text */}
        <div className="h-4 relative flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.6, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute flex"
            >
              <p className="text-[10px] font-geist font-bold tracking-[0.35em] uppercase text-center">
                {phrases[phraseIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

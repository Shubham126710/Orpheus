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

        {/* Elegant Minimal Audio Pulse */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative h-8 flex items-center justify-center gap-[5px] mb-8 mt-2"
        >
          {[
            { id: 0, delay: 0.45, maxH: "35%" },
            { id: 1, delay: 0.30, maxH: "65%" },
            { id: 2, delay: 0.15, maxH: "85%" },
            { id: 3, delay: 0.00, maxH: "100%" },
            { id: 4, delay: 0.15, maxH: "85%" },
            { id: 5, delay: 0.30, maxH: "65%" },
            { id: 6, delay: 0.45, maxH: "35%" },
          ].map((bar) => (
            <motion.div
              key={bar.id}
              className="w-1 bg-black/80 rounded-full origin-center"
              animate={{ height: ["20%", bar.maxH, "20%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bar.delay
              }}
            />
          ))}
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

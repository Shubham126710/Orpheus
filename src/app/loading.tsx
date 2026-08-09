"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = ["TUNING IN", "SETTING THE STAGE", "ALMOST THERE"];

export default function Loading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E9C052] text-black overflow-hidden">
      
      {/* Subtle Analog Grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay motion-reduce:hidden" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center justify-center z-10"
      >
        <div className="w-28 h-28 mb-8">
          <img 
            src="/logo.png" 
            alt="Orpheus Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-geist font-black uppercase tracking-[0.4em] opacity-90 mb-8 ml-2">
          Orpheus
        </h1>

        {/* Organic Waveform Loader */}
        <div className="relative w-[120px] h-8 flex items-center justify-start overflow-hidden mb-6 opacity-80">
           {/* Faded track */}
           <svg width="120" height="24" viewBox="0 0 120 24" className="absolute left-0 opacity-10 fill-none stroke-black stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
             <path d="M 0,12 C 10,12 12,8 15,12 C 18,16 22,6 25,12 C 28,18 32,10 35,12 C 40,12 45,12 50,12 C 55,7 60,17 65,12 C 70,5 75,19 80,12 C 85,12 90,12 95,12 C 100,8 105,16 110,12 C 115,12 120,12 120,12" />
           </svg>
           
           {/* Active filling waveform */}
           <motion.div 
             className="absolute left-0 h-full overflow-hidden flex items-center"
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 3.5, ease: "linear" }}
           >
             <motion.svg 
               width="120" height="24" viewBox="0 0 120 24" 
               className="fill-none stroke-black stroke-[1.5] stroke-linecap-round stroke-linejoin-round"
               animate={{ scaleY: [1, 1.1, 0.9, 1] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               <path d="M 0,12 C 10,12 12,8 15,12 C 18,16 22,6 25,12 C 28,18 32,10 35,12 C 40,12 45,12 50,12 C 55,7 60,17 65,12 C 70,5 75,19 80,12 C 85,12 90,12 95,12 C 100,8 105,16 110,12 C 115,12 120,12 120,12" />
             </motion.svg>
           </motion.div>
        </div>

        {/* Cycling Microcopy */}
        <div className="h-4 relative flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.p 
              key={msgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-[10px] font-geist font-bold tracking-[0.35em] uppercase text-center"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

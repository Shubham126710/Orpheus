"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E9C052] text-black">
      <div className="relative flex flex-col items-center justify-center">
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

        {/* Simple Loading Bar */}
        <div className="w-48 h-1 bg-black/10 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-black/80 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <p className="text-[10px] font-geist font-black opacity-50 tracking-[0.3em] uppercase">
          BY SHUBHAM
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useContextMenuStore } from "@/store/useContextMenuStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, ListPlus, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContextMenu() {
  const { isOpen, position, track, closeContextMenu } = useContextMenuStore();
  const { playTrack, addToQueue, playNext } = usePlayerStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeContextMenu]);

  if (!isOpen || !track) return null;

  const handlePlayNow = () => {
    playTrack(track);
    closeContextMenu();
  };

  const handlePlayNext = () => {
    // We will implement playNext for specific track later, for now we will just use addToQueue
    // Wait, let's implement insert Next
    usePlayerStore.setState((state) => ({
      queue: [track, ...state.queue]
    }));
    closeContextMenu();
  };

  const handleAddToQueue = () => {
    addToQueue(track);
    closeContextMenu();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ top: position.y, left: position.x }}
        className="fixed z-[9999] w-48 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
        onContextMenu={(e) => e.preventDefault()} // Prevent native right-click inside the menu
      >
        <button 
          onClick={handlePlayNow}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-geist font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Play size={16} fill="currentColor" /> Play Now
        </button>
        <button 
          onClick={handlePlayNext}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-geist font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
        >
          <SkipForward size={16} /> Play Next
        </button>
        <button 
          onClick={handleAddToQueue}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-geist font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ListPlus size={16} /> Add to Queue
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

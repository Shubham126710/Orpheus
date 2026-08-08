"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import BottomNav from "./BottomNav";
import { AnimatePresence, motion } from "framer-motion";

export default function ClientBottomNavWrapper() {
  const { isExpanded } = usePlayerStore();

  return (
    <AnimatePresence>
      {!isExpanded && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <BottomNav />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

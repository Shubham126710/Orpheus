"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { useAuth } from "@/lib/AuthContext";
import BottomNav from "./BottomNav";
import { AnimatePresence, motion } from "framer-motion";

export default function ClientBottomNavWrapper() {
  const { isExpanded } = usePlayerStore();
  const { user, loading } = useAuth();

  // Hide the navigation dock completely for unauthenticated guests (e.g. on Landing Page)
  if (!user || loading) {
    return null;
  }

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

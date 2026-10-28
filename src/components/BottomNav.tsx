"use client";

import Link from "next/link";
import { Home, Search, Library, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@/store/useSearchStore";

export default function BottomNav() {
  const pathname = usePathname();
  const { query, setQuery } = useSearchStore();
  const isSearch = pathname === "/search";

  const links = [
    { name: "HOME", href: "/", icon: Home },
    { name: "SEARCH", href: "/search", icon: Search },
    { name: "LIBRARY", href: "/library", icon: Library },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-max max-w-[95vw] pointer-events-auto">
      <motion.nav 
        layout
        className="flex items-center p-1.5 md:p-2 rounded-full bg-[#09090B]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        {/* Accent Brand Button */}
        <Link 
          href="/" 
          suppressHydrationWarning
          title="Orpheus Home"
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#FAFF00] text-black rounded-full shadow-[0_0_20px_rgba(250,255,0,0.45)] mr-1 md:mr-2 shrink-0 hover:scale-105 transition-transform overflow-hidden cursor-pointer"
        >
          <div className="relative w-full h-full flex items-center justify-center p-2.5">
            <Image 
              src="/logo-trimmed.png" 
              alt="Orpheus" 
              width={24} 
              height={24} 
              className="object-contain brightness-0" 
            />
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 px-1 overflow-x-auto hide-scrollbar">
          {links.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors duration-300 whitespace-nowrap cursor-pointer ${
                  isActive ? "text-black font-black" : "text-white/60 hover:text-white font-bold"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-active"
                    className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="font-geist text-[10px] md:text-xs tracking-[0.15em] uppercase z-10 relative">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Expandable Search Input within Navbar */}
        <AnimatePresence>
          {isSearch && (
            <motion.div
              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
              animate={{ width: typeof window !== 'undefined' && window.innerWidth < 400 ? 120 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 250), opacity: 1, marginLeft: 8 }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative flex items-center overflow-hidden h-9 md:h-11 shrink-0 max-w-[40vw] md:max-w-none"
            >
              <div className="absolute left-2.5 md:left-3 text-white/40 pointer-events-none">
                <Search size={15} className="md:w-4 md:h-4" suppressHydrationWarning />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search artists, tracks..."
                autoFocus
                className="w-full h-full pl-8 pr-8 md:pl-9 md:pr-9 bg-white/5 border border-white/10 rounded-full text-white text-xs md:text-sm font-geist placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-colors"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-2 md:right-3 text-white/50 hover:text-white cursor-pointer"
                >
                  <X size={14} className="md:w-4 md:h-4" suppressHydrationWarning />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

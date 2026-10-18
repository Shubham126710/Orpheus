"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GrainGradient } from "@paper-design/shaders-react";
import { 
  Play, 
  Disc3, 
  Sparkles, 
  Sliders, 
  Zap, 
  Volume2, 
  ChevronDown, 
  ArrowUpRight, 
  Check 
} from "lucide-react";
import ScrollIndex from "@/components/kokonutui/scroll-index";

interface LandingPageProps {
  onJoinClick: () => void;
}

// Authentic SVG vector logos for major record labels
const LABEL_LOGOS = [
  {
    name: "UNIVERSAL MUSIC GROUP",
    sub: "UMG",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-[#FAFF00]" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="5" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="5" />
      </svg>
    )
  },
  {
    name: "SONY MUSIC",
    sub: "ENTERTAINMENT",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-white" aria-hidden="true">
        <path d="M20 75 C 35 25, 65 25, 80 75 C 65 55, 35 55, 20 75 Z" fill="#FAFF00" />
        <circle cx="50" cy="30" r="12" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "WARNER MUSIC GROUP",
    sub: "WMG",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-[#FAFF00]" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M25 35 L 35 68 L 50 45 L 65 68 L 75 35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "COLUMBIA RECORDS",
    sub: "EST. 1887",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-white" aria-hidden="true">
        <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="14" fill="#FAFF00" />
        <circle cx="50" cy="50" r="6" fill="black" />
      </svg>
    )
  },
  {
    name: "DEF JAM RECORDINGS",
    sub: "NYC 1984",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-[#FAFF00]" aria-hidden="true">
        <rect x="18" y="25" width="28" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
        <path d="M60 25 L 82 25 L 82 60 C 82 72, 70 75, 60 75 C 50 75, 48 68, 48 68" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "ATLANTIC RECORDS",
    sub: "WARNER",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-white" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#FAFF00" strokeWidth="6" />
        <path d="M30 72 L 50 25 L 70 72 M 36 58 L 64 58" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "INTERSCOPE GEFFEN A&M",
    sub: "UNIVERSAL",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-[#FAFF00]" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="50" cy="50" r="12" fill="#FAFF00" />
      </svg>
    )
  },
  {
    name: "REPUBLIC RECORDS",
    sub: "UNIVERSAL",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-white" aria-hidden="true">
        <rect x="15" y="15" width="70" height="70" rx="14" fill="none" stroke="#FAFF00" strokeWidth="6" />
        <path d="M35 70 L 35 30 L 55 30 C 65 30, 68 38, 68 45 C 68 52, 62 56, 52 56 L 35 56 M 52 56 L 68 70" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const FAQS = [
  {
    q: "What makes Orpheus fundamentally different from standard streaming apps?",
    a: "Orpheus was built for listeners who appreciate aesthetic restraint and pure sonic focus. By pairing an ultra-fast Web Audio pipeline with a nostalgic analog visual identity — featuring real-time vinyl playback physics, audio visualizer analysis, and zero commercial interruptions — it transforms listening into an intentional cinematic experience."
  },
  {
    q: "How does the Floating Bubble onboarding and curation algorithm work?",
    a: "When you join, you interact with fluid, physics-based bubbles representing musical genres and pioneer artists. Orpheus translates your selections into a personalized harmonic vector. Our engine continuously adapts your home feed with Daily Mixes, artist radio continuity, and ambient atmosphere shelves."
  },
  {
    q: "Where does the music catalog come from?",
    a: "Orpheus streams directly from high-bitrate audio endpoints powered by the world's largest catalog (including Universal, Sony, and Warner catalogs) enriched with metadata from MusicBrainz and Wikipedia. This includes official studio albums, rare b-sides, live performances, and unreleased gems."
  },
  {
    q: "Does background playback work on mobile and iOS Safari?",
    a: "Yes. Orpheus connects directly to the native MediaSession API with background playback anchors, ensuring your audio streams uninterrupted when your device locks or when multitasking between apps."
  },
  {
    q: "Is Orpheus really free? Are there audio advertisements?",
    a: "Orpheus is 100% free with absolutely zero commercial audio interruptions. You can create an account, save unlimited favorites, curate custom playlists, and stream without paywalls."
  }
];

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white relative selection:bg-[#FAFF00] selection:text-black font-geist">

      {/* 
        PERSISTENT CURVED FLOATING NAVBAR 
        Fixed with rounded-full pill geometry that persists across all scroll depths
      */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] px-5 md:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
        
        {/* Authentic Golden Yellow Circular Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-9 h-9 rounded-full bg-[#FAFF00] flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(250,255,0,0.5)] group-hover:scale-105 transition-transform">
            <Image 
              src="/logo-trimmed.png" 
              alt="Orpheus Lyre Emblem" 
              width={22} 
              height={22} 
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-[0.25em] uppercase text-white leading-none">
              Orpheus
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-white/40 mt-0.5">
              Audio Client
            </span>
          </div>
        </div>

        {/* Clean Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#labels" className="hover:text-white transition-colors">Catalog</a>
          <a href="#palette" className="hover:text-white transition-colors">Aesthetic</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onJoinClick}
            className="text-xs font-bold tracking-widest uppercase text-white/80 hover:text-white px-4 py-2 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onJoinClick}
            className="text-xs font-black tracking-[0.2em] uppercase bg-[#FAFF00] text-black px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(250,255,0,0.3)] hover:scale-105"
          >
            Join Free
          </button>
        </div>

      </header>

      {/* Kokonut UI ScrollIndex Rail (Window Scroller) */}
      <ScrollIndex selector="h2" scroller="window">
        
        {/* SECTION 1: HERO WITH GRAIN GRADIENT SHADER & MUSIC CHARACTER */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-36 pb-20 max-w-6xl mx-auto text-center overflow-hidden">
          
          {/* Paper Design Grain Shader Background (Warm & Analog) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden">
            <GrainGradient
              speed={0.6}
              scale={1.3}
              rotation={30}
              offsetX={0}
              offsetY={0}
              softness={0.7}
              intensity={0.45}
              noise={0.35}
              shape="corners"
              frame={1200}
              colors={["#FAFF00", "#FF6B00", "#111111", "#000000"]}
              colorBack="#00000000"
              className="w-full h-full"
            />
          </div>

          {/* Subtle Concentric Vinyl Groove Lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.04] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.02] pointer-events-none" />

          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#FAFF00] shadow-[0_0_8px_#FAFF00]" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/90">
              The Next Era of Audio • Cinematic Streaming
            </span>
          </motion.div>

          {/* Hero Editorial Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-10 text-5xl sm:text-7xl md:text-9xl font-instrument font-normal tracking-tight leading-[1.05] text-white max-w-5xl mb-8"
          >
            Experience music, <br/>
            <span className="italic text-[#FAFF00] font-instrument drop-shadow-[0_0_35px_rgba(250,255,0,0.2)]">
              cinematically.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-base sm:text-lg md:text-xl text-white/60 font-geist max-w-2xl mb-12 leading-relaxed font-normal"
          >
            A high-performance streaming client bridging modern liquid interfaces, intelligent taste curation, and nostalgic analog warmth.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <button 
              onClick={onJoinClick}
              className="group relative flex items-center justify-center gap-4 bg-[#FAFF00] text-black px-10 py-5 rounded-full overflow-hidden hover:bg-white transition-all duration-300 shadow-[0_0_35px_rgba(250,255,0,0.35)] hover:scale-105"
            >
              <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase">Start Listening</span>
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white">
                <Play size={13} fill="currentColor" className="ml-0.5" />
              </div>
            </button>

            <a 
              href="#features"
              className="px-8 py-5 rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              Explore Architecture
            </a>
          </motion.div>

          {/* Clean Analog Player Mockup Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative z-10 w-full max-w-4xl p-6 md:p-8 rounded-3xl bg-zinc-950/90 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Spinning Vinyl Element */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black border border-white/5">
                <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center shadow-xl shrink-0 animate-spin-slow">
                  <div className="w-6 h-6 rounded-full bg-[#FAFF00] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>
                </div>
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-bold text-[#FAFF00] uppercase tracking-widest block">Analog Engine</span>
                  <h4 className="text-sm font-black text-white uppercase truncate">Daft Punk</h4>
                  <p className="text-xs text-white/50 truncate">Random Access Memories</p>
                </div>
              </div>

              {/* Web Audio Spectrum Equalizer */}
              <div className="flex flex-col justify-center items-center p-4 rounded-2xl bg-black border border-white/5 h-full">
                <div className="flex items-end gap-1.5 h-10 mb-2">
                  {[40, 80, 50, 100, 70, 90, 60, 85, 45, 95, 65, 80, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h * 0.35}%`, `${h}%`, `${h * 0.4}%`] }}
                      transition={{ repeat: Infinity, duration: 1.1 + (i % 4) * 0.25, ease: "easeInOut" }}
                      className="w-1.5 rounded-full bg-[#FAFF00]"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
                  Web Audio FFT Spectrum
                </span>
              </div>

              {/* Response Time & Architecture */}
              <div className="flex flex-col justify-center p-4 rounded-2xl bg-black border border-white/5 text-left h-full">
                <span className="text-[10px] font-bold text-[#FAFF00] uppercase tracking-widest block">Response Time</span>
                <h4 className="text-2xl font-black text-white uppercase">0ms Ready</h4>
                <p className="text-xs text-white/50 mt-1">Stale-While-Revalidate Cache</p>
              </div>

            </div>
          </motion.div>

        </section>

        {/* SECTION 2: RECORD LABELS (MARQUEE WITH ACTUAL SVG LOGOS) */}
        <section id="labels" className="w-full py-16 border-y border-white/[0.08] bg-black relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 flex items-center gap-2">
              <Disc3 size={15} className="text-[#FAFF00]" />
              Master Catalog & Major Labels
            </h2>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/40">
              Universal Music Group • Sony Music • Warner Music Group
            </span>
          </div>

          {/* Marquee with Graphical SVG Logos */}
          <div className="flex overflow-hidden select-none py-2">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
              className="flex items-center gap-8 md:gap-12 shrink-0"
            >
              {[...LABEL_LOGOS, ...LABEL_LOGOS].map((label, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 px-7 py-4 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#FAFF00]/50 transition-colors cursor-default"
                >
                  <div className="shrink-0">
                    {label.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-white">
                      {label.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      {label.sub}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: BENTO FEATURES */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-36">
          
          <div className="mb-16 text-left">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-3">
              Engineered For Immersion
            </span>
            <h2 className="text-4xl md:text-6xl font-instrument font-normal tracking-tight text-white">
              Tactile by design. <br/>
              <span className="italic text-[#FAFF00] font-instrument">
                Engineered for sound purity.
              </span>
            </h2>
          </div>

          {/* Clean Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Floating Bubble Curation (Span 2) */}
            <div className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-[#FAFF00] text-black flex items-center justify-center font-black mb-8 shadow-md">
                  <Sparkles size={22} />
                </span>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                  Physics-Driven Bubble Onboarding
                </h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl mb-8">
                  No impersonal checkboxes. Orpheus uses interactive floating bubbles representing musical frequencies and iconic artists to establish your unique taste profile from day one.
                </p>
              </div>

              {/* Minimal Genre Bubble Pills */}
              <div className="flex flex-wrap gap-2.5">
                {["Hip-Hop", "Electronic", "Indie", "Alternative", "R&B", "Rock", "Jazz", "Classical"].map((genre, i) => (
                  <span 
                    key={genre}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                      i < 3 
                        ? "bg-[#FAFF00] text-black font-black shadow-sm" 
                        : "bg-white/5 text-white/70 border border-white/10"
                    }`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: 24-bit Lossless Web Audio Pipeline (Span 1) */}
            <div className="p-8 md:p-10 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black mb-8 border border-white/10">
                  <Sliders size={22} />
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3">
                  Lossless Web Audio Pipeline
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Hardware-accelerated Web Audio DSP with low-latency buffer scheduling, stereo imaging, and high-resolution output.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/50 uppercase tracking-widest">
                <span>24-bit / 48kHz</span>
                <Volume2 size={18} className="text-[#FAFF00]" />
              </div>
            </div>

            {/* Card 3: 0ms Client Cache (Span 1) */}
            <div className="p-8 md:p-10 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black mb-8 border border-white/10">
                  <Zap size={22} />
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3">
                  0ms Client Cache
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Stale-While-Revalidate persistence reverse-engineered from Spotify's client model. Your library and home feed render instantly with zero layout shifts.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-[#FAFF00] uppercase tracking-wider">
                <Check size={16} />
                Zero Latency Hydration
              </div>
            </div>

            {/* Card 4: Tactile Vinyl Player (Span 2) */}
            <div className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="max-w-md">
                <span className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black mb-8 border border-white/10">
                  <Disc3 size={22} />
                </span>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                  Tactile Vinyl & Focus Mode
                </h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed">
                  Enter full-screen Focus Mode for a serene, analog listening ritual: realistic 33⅓ RPM vinyl rotation physics, subtle film-grain texture, and dynamic color extraction from artwork.
                </p>
              </div>

              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-black border-2 border-white/20 flex items-center justify-center shrink-0 shadow-2xl animate-spin-slow">
                <div className="absolute inset-3 rounded-full border border-white/10" />
                <div className="absolute inset-7 rounded-full border border-white/10" />
                <div className="w-14 h-14 rounded-full bg-[#FAFF00] flex items-center justify-center shadow-lg">
                  <div className="w-3.5 h-3.5 rounded-full bg-black" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: THE BRUTALIST SONIC PALETTE */}
        <section id="palette" className="w-full py-28 border-y border-white/[0.08] bg-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-left mb-16">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-3">
                Color In Pure Focus
              </span>
              <h2 className="text-4xl md:text-6xl font-instrument font-normal tracking-tight text-white">
                One color per section. Uncompromising identity.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { bg: "bg-[#FAFF00]", text: "text-black", name: "Electric Yellow", role: "Primary Accent & Heavy Rotation", hex: "#FAFF00" },
                { bg: "bg-[#00FF55]", text: "text-black", name: "Acid Green", role: "High-Voltage Workout Shelf", hex: "#00FF55" },
                { bg: "bg-[#FF0055]", text: "text-white", name: "Neon Velvet", role: "Curated Daily Mixes", hex: "#FF0055" },
                { bg: "bg-[#0055FF]", text: "text-white", name: "Deep Cobalt", role: "Ambient & Late Night Chill", hex: "#0055FF" },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`${item.bg} ${item.text} p-8 rounded-3xl h-72 flex flex-col justify-between shadow-xl transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-geist font-black">0{idx + 1}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-black/15">
                      {item.hex}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{item.name}</h4>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80 mt-1">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="w-full max-w-4xl mx-auto px-6 py-28 md:py-36">
          <div className="text-left mb-16">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-3">
              Answers & Architecture
            </span>
            <h2 className="text-4xl md:text-6xl font-instrument font-normal tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02]"
                  >
                    <span className="text-base md:text-lg font-bold text-white uppercase tracking-wide">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-white/60 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#FAFF00]" : ""}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 text-sm text-white/60 leading-relaxed font-normal"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: FINAL CALL TO ACTION */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
          <div className="p-12 md:p-24 rounded-3xl bg-zinc-950 border border-white/10 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-4">
                Step Into The Flow
              </span>
              <h2 className="text-5xl md:text-7xl font-instrument font-normal tracking-tight text-white mb-6">
                The needle drops now.
              </h2>
              <p className="text-white/60 text-sm md:text-base mb-10 leading-relaxed">
                Free forever, zero audio ads, and unmatched fidelity for listeners who care about the craft.
              </p>

              <button 
                onClick={onJoinClick}
                className="inline-flex items-center gap-4 bg-[#FAFF00] text-black px-12 py-5 rounded-full font-black text-xs md:text-sm tracking-[0.25em] uppercase hover:bg-white transition-all duration-300 shadow-[0_0_35px_rgba(250,255,0,0.3)] hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Minimal Landing Page Footer */}
        <footer className="w-full border-t border-white/[0.08] py-10 px-6 text-xs text-white/40 uppercase tracking-widest font-bold">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FAFF00] flex items-center justify-center p-1">
                <Image src="/logo-trimmed.png" alt="Orpheus Logo" width={16} height={16} className="object-contain" />
              </div>
              <span>© 2026 Orpheus Audio Inc.</span>
            </div>
            <span>Crafted with pure aesthetic intention.</span>
          </div>
        </footer>

      </ScrollIndex>

    </div>
  );
}

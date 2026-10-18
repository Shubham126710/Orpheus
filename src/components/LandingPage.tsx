"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Disc3, 
  Sparkles, 
  Headphones, 
  Zap, 
  Radio, 
  Volume2, 
  Layers, 
  ChevronDown, 
  ArrowUpRight, 
  Sliders, 
  Flame, 
  Music, 
  Infinity as InfinityIcon,
  ShieldCheck,
  Check
} from "lucide-react";

interface LandingPageProps {
  onJoinClick: () => void;
}

const RECORD_LABELS = [
  { name: "DEF JAM RECORDINGS", code: "NYC • 1984", color: "#FAFF00" },
  { name: "INTERSCOPE RECORDS", code: "LA • 1990", color: "#FF0055" },
  { name: "COLUMBIA RECORDS", code: "EST. 1887", color: "#00FF55" },
  { name: "WARP RECORDS", code: "SHEFFIELD • 1989", color: "#0055FF" },
  { name: "XL RECORDINGS", code: "LDN • 1989", color: "#FF5500" },
  { name: "SUB POP", code: "SEATTLE • 1986", color: "#B900FF" },
  { name: "MOTOWN", code: "DETROIT • 1959", color: "#FAFF00" },
  { name: "BLUE NOTE RECORDS", code: "NYC • 1939", color: "#00FF55" },
  { name: "ATLANTIC RECORDS", code: "NYC • 1947", color: "#FF0055" },
  { name: "REPUBLIC RECORDS", code: "NYC • 1995", color: "#0055FF" },
  { name: "OVO SOUND", code: "TORONTO • 2012", color: "#FF5500" },
  { name: "ROC NATION", code: "NYC • 2008", color: "#B900FF" },
  { name: "4AD", code: "LDN • 1980", color: "#FAFF00" },
  { name: "FACTORY RECORDS", code: "MCR • 1978", color: "#00FF55" }
];

const FAQS = [
  {
    q: "What makes Orpheus fundamentally different from Spotify or Apple Music?",
    a: "Orpheus was engineered for music purists who value aesthetic intentionality and distraction-free audio. We pair modern zero-latency web streaming with a tactile, brutalist analog visual identity — featuring interactive vinyl playback, live audio visualizer physics, real-time color extraction, and zero commercial interruptions."
  },
  {
    q: "How does the Floating Bubble onboarding & curation algorithm work?",
    a: "When you join, you interact with fluid, physics-based bubbles representing sonic genres and pioneer artists. Orpheus translates your selections into a multi-dimensional harmonic vector. Our engine continuously harmonizes your queue with personalized Daily Mixes, artist radio continuity, and ambient atmosphere shelves."
  },
  {
    q: "Where does the music catalog come from?",
    a: "Orpheus leverages high-bitrate YouTube Music and InnerTube streams coupled with MusicBrainz and Wikipedia metadata. This delivers an expansive library spanning hundreds of millions of official tracks, rare live sessions, underground bootlegs, and global remixes."
  },
  {
    q: "Does background playback work on mobile and iOS Safari?",
    a: "Yes. Orpheus implements native MediaSession API hooks and resilient background audio engines designed to keep playback uninterrupted when your screen locks or when switching apps on iOS Safari and Android Chrome."
  },
  {
    q: "Is Orpheus really free? Will there be intrusive audio ads?",
    a: "Orpheus is 100% free with absolutely zero commercial audio interruptions. You can create an account, build custom playlists, bookmark favorites, and stream endlessly without paywalls."
  }
];

const SECTIONS = [
  { id: "hero", label: "Intro", color: "#FAFF00" },
  { id: "marquee", label: "Labels", color: "#FF0055" },
  { id: "bento", label: "Bento Features", color: "#00FF55" },
  { id: "aesthetic", label: "Sonic Palette", color: "#0055FF" },
  { id: "experience", label: "The Flow", color: "#FF5500" },
  { id: "faq", label: "FAQ", color: "#B900FF" },
  { id: "join", label: "Launch", color: "#FAFF00" }
];

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white relative selection:bg-[#FAFF00] selection:text-black font-geist overflow-x-hidden">

      {/* Ambient Radial Gradient Meshes (Vibrant & Atmospheric) */}
      <div className="fixed top-[-10%] left-[-15%] w-[50vw] h-[50vw] bg-[#B900FF]/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="fixed top-[30%] right-[-15%] w-[55vw] h-[55vw] bg-[#0055FF]/15 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#FF0055]/12 rounded-full blur-[170px] pointer-events-none mix-blend-screen" />
      <div className="fixed top-[60%] left-[-10%] w-[45vw] h-[45vw] bg-[#FAFF00]/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Sleek Right-Side Floating Navigation Dock */}
      <nav 
        aria-label="Landing Page Section Navigation"
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-2.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300"
              title={sec.label}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-12 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/15 text-xs font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                {sec.label}
              </span>

              {/* Dot indicator */}
              <span 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "scale-150 shadow-[0_0_12px_currentColor]" 
                    : "bg-white/30 group-hover:bg-white group-hover:scale-125"
                }`}
                style={{ backgroundColor: isActive ? sec.color : undefined, color: sec.color }}
              />
            </button>
          );
        })}
      </nav>

      {/* Top Header */}
      <header className="w-full flex justify-between items-center px-6 md:px-16 py-6 md:py-8 relative z-40 border-b border-white/5 backdrop-blur-md sticky top-0 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAFF00] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(250,255,0,0.5)]">
            <Disc3 size={20} className="animate-spin-slow" />
          </div>
          <span className="text-xl md:text-2xl tracking-[0.25em] font-black uppercase text-white">
            Orpheus
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-white/70">
          <button onClick={() => scrollTo("features")} className="hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollTo("marquee")} className="hover:text-white transition-colors">Labels</button>
          <button onClick={() => scrollTo("aesthetic")} className="hover:text-white transition-colors">Aesthetic</button>
          <button onClick={() => scrollTo("faq")} className="hover:text-white transition-colors">FAQ</button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onJoinClick}
            className="text-xs md:text-sm font-bold tracking-widest uppercase border border-white/20 px-5 md:px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Sign In
          </button>
          <button 
            onClick={onJoinClick}
            className="hidden sm:flex text-xs md:text-sm font-black tracking-widest uppercase bg-[#FAFF00] text-black px-5 md:px-6 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(250,255,0,0.3)]"
          >
            Join Free
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section id="hero" className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center px-6 pt-12 md:pt-20 pb-20 max-w-7xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF55] animate-ping" />
          <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/90">
            The Next Era of Audio • Cinematic Streaming
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-9xl font-instrument font-medium tracking-tight leading-[1.05] max-w-5xl mb-6"
        >
          Experience music, <br/>
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FAFF00] via-[#00FF55] to-[#0055FF]">
            cinematically.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-2xl text-white/60 font-geist max-w-2xl mb-10 leading-relaxed font-normal"
        >
          A high-performance streaming client bridging modern liquid interfaces, intelligent taste curation, and nostalgic analog warmth.
        </motion.p>

        {/* Primary Action Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button 
            onClick={onJoinClick}
            className="group relative flex items-center justify-center gap-4 bg-white text-black px-10 py-5 rounded-full overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFF00] via-white to-[#00FF55] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-xs md:text-sm font-black tracking-[0.2em] uppercase">Start Listening</span>
            <div className="relative z-10 w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={14} fill="currentColor" className="text-white ml-0.5" />
            </div>
          </button>

          <button 
            onClick={() => scrollTo("bento")}
            className="px-8 py-5 rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Interactive Floating Hero Preview Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full max-w-4xl p-4 md:p-6 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative"
        >
          {/* Decorative vinyl art & audio spectrum */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Spinning Vinyl Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="relative w-16 h-16 rounded-full bg-zinc-900 border-2 border-white/20 flex items-center justify-center shadow-2xl shrink-0 animate-spin-slow">
                <div className="w-6 h-6 rounded-full bg-[#FF0055] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-bold text-[#FF0055] uppercase tracking-widest block">33⅓ RPM Hi-Fi</span>
                <h4 className="text-sm font-black text-white uppercase truncate">Daft Punk</h4>
                <p className="text-xs text-white/50 truncate">Random Access Memories</p>
              </div>
            </div>

            {/* Live Audio Spectrum Equalizer */}
            <div className="flex flex-col justify-center items-center p-4 rounded-2xl bg-black/40 border border-white/5 h-full">
              <div className="flex items-end gap-1.5 h-10 mb-2">
                {[60, 90, 40, 100, 75, 45, 95, 30, 85, 70, 50, 95, 60, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] }}
                    transition={{ repeat: Infinity, duration: 1.2 + (i % 5) * 0.2, ease: "easeInOut" }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#FAFF00] via-[#00FF55] to-white"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">
                Web Audio DSP Engine
              </span>
            </div>

            {/* Live Vector Curation Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 text-left">
              <div>
                <span className="text-[10px] font-bold text-[#00FF55] uppercase tracking-widest block">Continuous Radio</span>
                <h4 className="text-sm font-black text-white uppercase truncate">Zero Latency Cache</h4>
                <p className="text-xs text-white/50 truncate">Harmonic Taste Vector</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0055FF]/20 border border-[#0055FF] flex items-center justify-center text-[#0055FF]">
                <InfinityIcon size={18} />
              </div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* SECTION 2: RECORD LABEL MARQUEE STRIP */}
      <section id="marquee" className="w-full py-12 border-y border-white/10 bg-zinc-950/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/40 flex items-center gap-2">
            <Disc3 size={14} className="text-[#FAFF00]" />
            Catalog Powered by Historic Music Imprints & Masters
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 hidden sm:inline">
            Over 100M+ Master Releases
          </span>
        </div>

        {/* Marquee Strip Animation */}
        <div className="flex overflow-hidden select-none py-3">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex items-center gap-6 md:gap-10 shrink-0"
          >
            {[...RECORD_LABELS, ...RECORD_LABELS].map((label, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all cursor-default"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-white/90">
                  {label.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 px-2 py-0.5 rounded bg-white/5">
                  {label.code}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: BENTO GRID FEATURE SHOWCASE */}
      <section id="bento" className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
        
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#00FF55] block mb-3">
            Core Architecture
          </span>
          <h2 className="text-4xl md:text-6xl font-instrument font-medium tracking-tight">
            Built for sound. <br/>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              Designed with character.
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 (Span 2): Bespoke Taste Engine */}
          <div className="md:col-span-2 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#FF0055]/20 via-zinc-900/60 to-black border border-[#FF0055]/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF0055]/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="mb-8">
                <span className="w-12 h-12 rounded-2xl bg-[#FF0055] text-white flex items-center justify-center font-black mb-6 shadow-[0_0_30px_rgba(255,0,85,0.4)]">
                  <Sparkles size={24} />
                </span>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                  Beats-Style Floating Bubble Onboarding
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl">
                  Forget static checkboxes. Orpheus uses interactive physics-driven floating bubbles to map your emotional genre taste and favorite artists into dynamic curation vectors.
                </p>
              </div>

              {/* Mini Interactive Bubble Preview */}
              <div className="flex flex-wrap gap-2.5 pt-4">
                {["Hip-Hop", "Electronic", "Indie", "Alternative", "R&B", "Rock", "Jazz", "Classical"].map((genre, i) => (
                  <span 
                    key={genre}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      i < 4 
                        ? "bg-[#FF0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)] scale-105" 
                        : "bg-white/10 text-white/60 border border-white/10"
                    }`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 (Span 1): Analog Web Audio DSP */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#FAFF00] text-black relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -bottom-10 -right-10 text-black/10 font-black text-9xl select-none pointer-events-none">
              DSP
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-black text-[#FAFF00] flex items-center justify-center font-black mb-6 shadow-xl">
                <Sliders size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                Lossless Web Audio Pipeline
              </h3>
              <p className="text-black/80 text-sm font-medium leading-relaxed">
                Direct Web Audio API integration with fast FFT frequency analysis, hardware acceleration, and dynamic stereo soundstaging.
              </p>
            </div>

            <div className="relative z-10 pt-8 flex items-center justify-between border-t border-black/10 mt-6">
              <span className="text-xs font-black uppercase tracking-widest">24-bit 48kHz</span>
              <Volume2 size={20} />
            </div>
          </div>

          {/* Card 3 (Span 1): Stale-While-Revalidate Instant Cache */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-[#00FF55]/20 via-zinc-900/60 to-black border border-[#00FF55]/30 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF55]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#00FF55] text-black flex items-center justify-center font-black mb-6 shadow-[0_0_30px_rgba(0,255,85,0.3)]">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3">
                0ms Instant Client Cache
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Reverse-engineered from Spotify’s client-side cache model. Reopens with zero layout flash, instant playback state resumption, and seamless background revalidation.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex items-center gap-2 text-xs font-bold text-[#00FF55] uppercase tracking-wider">
              <Check size={16} />
              Stale-While-Revalidate Ready
            </div>
          </div>

          {/* Card 4 (Span 2): Tactile Vinyl & Cinematic Focus Mode */}
          <div className="md:col-span-2 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#FF5500]/20 via-zinc-900/60 to-black border border-[#FF5500]/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5500]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="max-w-md">
                <span className="w-12 h-12 rounded-2xl bg-[#FF5500] text-black flex items-center justify-center font-black mb-6 shadow-[0_0_30px_rgba(255,85,0,0.4)]">
                  <Disc3 size={24} />
                </span>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                  Tactile Vinyl & Film Grain
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  Enter Focus Mode for a full-screen cinematic player featuring authentic 33⅓ RPM vinyl rotation physics, analog film grain shaders, and real-time color extraction from album sleeves.
                </p>
              </div>

              {/* Vinyl Preview Mockup */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-zinc-950 border-4 border-white/20 shadow-2xl relative flex items-center justify-center animate-spin-slow">
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-4 rounded-full border border-white/10" />
                  <div className="absolute inset-8 rounded-full border border-white/10" />
                  <div className="absolute inset-12 rounded-full border border-white/10" />
                  <div className="w-16 h-16 rounded-full bg-[#FF5500] flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: THE BRUTALIST SONIC PALETTE */}
      <section id="aesthetic" className="w-full py-24 border-y border-white/10 bg-zinc-950/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-3">
              Color Meets Frequency
            </span>
            <h2 className="text-4xl md:text-6xl font-instrument font-medium tracking-tight">
              A vibrant palette for every vibration.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { color: "bg-[#FAFF00]", name: "Electric Yellow", mood: "Heavy Rotation", code: "#FAFF00", text: "text-black" },
              { color: "bg-[#00FF55]", name: "Acid Green", mood: "High Voltage Gym", code: "#00FF55", text: "text-black" },
              { color: "bg-[#FF0055]", name: "Neon Velvet", mood: "Curated Mixes", code: "#FF0055", text: "text-white" },
              { color: "bg-[#0055FF]", name: "Deep Cobalt", mood: "Atmospheric Chill", code: "#0055FF", text: "text-white" },
            ].map((swatch, i) => (
              <div 
                key={i} 
                className={`${swatch.color} ${swatch.text} p-8 rounded-[2rem] h-72 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-3 shadow-2xl relative overflow-hidden`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-geist font-black text-2xl">0{i + 1}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/10">
                    {swatch.code}
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black uppercase tracking-tight mb-1">{swatch.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">{swatch.mood}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: THE LISTENING EXPERIENCE (3-STEP TIMELINE) */}
      <section id="experience" className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FF0055] block mb-3">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-instrument font-medium tracking-tight">
            From first tap to continuous flow.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              num: "01",
              title: "Tune Your Spectrum",
              desc: "Select your baseline genres and 3 favorite artists with our tactile bubble onboarding flow. No lengthy surveys.",
              color: "text-[#FAFF00]"
            },
            {
              num: "02",
              title: "Algorithmic Synthesis",
              desc: "Orpheus provisions your personal Firestore taste vector, assembling Quick Picks and bespoke Daily Mix shelves instantly.",
              color: "text-[#00FF55]"
            },
            {
              num: "03",
              title: "Infinite Immersion",
              desc: "Queue seamlessly or sit back as our contextual radio pipeline autoplays harmonic extensions with zero dead air.",
              color: "text-[#0055FF]"
            }
          ].map((step, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className={`text-5xl font-geist font-black ${step.color} block mb-6`}>
                  {step.num}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="w-full max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B900FF] block mb-3">
            Clarifications
          </span>
          <h2 className="text-4xl md:text-6xl font-instrument font-medium tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02]"
                >
                  <span className="text-base md:text-lg font-bold text-white uppercase tracking-wide">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-white/60 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-white" : ""}`} 
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
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

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section id="join" className="w-full max-w-7xl mx-auto px-6 py-24 mb-16 relative">
        <div className="p-12 md:p-24 rounded-[3.5rem] bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-white/15 text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          {/* Ambient Burst */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FAFF00]/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-4">
              Step Into The Sound
            </span>
            <h2 className="text-5xl md:text-7xl font-instrument font-medium tracking-tight mb-6">
              The needle drops now.
            </h2>
            <p className="text-white/60 text-sm md:text-lg mb-10 leading-relaxed font-normal">
              Join Orpheus today. Free forever, no intrusive audio ads, and complete fidelity for the modern listener.
            </p>

            <button 
              onClick={onJoinClick}
              className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black text-xs md:text-sm tracking-[0.25em] uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              <span>Get Started Now</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Simple Landing Page Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-6 text-center text-xs text-white/40 uppercase tracking-widest font-bold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 Orpheus Audio Inc.</span>
          <span>Crafted with pure aesthetic obsession.</span>
        </div>
      </footer>

    </div>
  );
}

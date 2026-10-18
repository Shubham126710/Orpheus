"use client";

import React from "react";
import Image from "next/image";
import { 
  Play, 
  Disc3, 
  Sparkles, 
  Sliders, 
  Zap, 
  Volume2, 
  ArrowUpRight 
} from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import PrismaHero from "@/components/ui/prisma-hero";

interface LandingPageProps {
  onJoinClick: () => void;
}

// Major record labels SVG logos
const LABEL_LOGOS = [
  {
    name: "Universal Music Group",
    sub: "UMG",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="5" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="5" />
      </svg>
    )
  },
  {
    name: "Sony Music",
    sub: "Entertainment",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <path d="M20 75 C 35 25, 65 25, 80 75 C 65 55, 35 55, 20 75 Z" fill="currentColor" />
        <circle cx="50" cy="30" r="12" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Warner Music Group",
    sub: "WMG",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M25 35 L 35 68 L 50 45 L 65 68 L 75 35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "Columbia Records",
    sub: "Est. 1887",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="14" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Def Jam Recordings",
    sub: "NYC 1984",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <rect x="18" y="25" width="28" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
        <path d="M60 25 L 82 25 L 82 60 C 82 72, 70 75, 60 75 C 50 75, 48 68, 48 68" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Atlantic Records",
    sub: "Warner",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M30 72 L 50 25 L 70 72 M 36 58 L 64 58" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Capitol Records",
    sub: "Hollywood",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <path d="M50 15 L50 85 M20 50 L80 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Interscope Records",
    sub: "Universal",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <rect x="25" y="20" width="12" height="60" fill="currentColor" />
        <circle cx="65" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="65" cy="50" r="8" fill="currentColor" />
      </svg>
    )
  }
];

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  return (
    <div className="relative w-full bg-black text-white font-geist selection:bg-[#FAFF00] selection:text-black">

      {/* 
        PERSISTENT CURVED NOTCH NAVBAR
        Persists gracefully when scrolling, rounded corners, branded logo badge & quick actions
      */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl">
        <nav className="flex items-center justify-between rounded-full bg-zinc-950/85 border border-white/10 px-4 sm:px-7 py-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          {/* Brand Logo with exact yellow circular badge */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#FAFF00] flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(250,255,0,0.4)] group-hover:scale-105 transition-transform shrink-0">
              <Image src="/logo-trimmed.png" alt="Orpheus Logo" width={20} height={20} className="object-contain" />
            </div>
            <span className="text-sm font-black tracking-[0.22em] uppercase text-white font-geist">
              Orpheus
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#FAFF00] transition-colors">Architecture</a>
            <a href="#curation" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#FAFF00] transition-colors">Curation</a>
            <a href="#catalog" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#FAFF00] transition-colors">Catalog</a>
            <a href="#join" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#FAFF00] transition-colors">Launch</a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onJoinClick}
              className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onJoinClick}
              className="text-xs font-black uppercase tracking-wider bg-[#FAFF00] text-black px-4 sm:px-5 py-2 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(250,255,0,0.35)] hover:scale-105 cursor-pointer shrink-0"
            >
              Join Free
            </button>
          </div>
        </nav>
      </header>

      {/* 
        1. HERO SECTION: PRISMA HERO
        Fullscreen cinematic video background with noise, gradient, and WordsPullUp
      */}
      <div id="hero">
        <PrismaHero onJoinClick={onJoinClick} />
      </div>

      {/* 
        2. RECORD LABELS MARQUEE STRIP
        Smooth infinite horizontal ribbon featuring UMG, SME, WMG & iconic imprints
      */}
      <div className="w-full relative overflow-hidden bg-zinc-950/90 border-y border-white/10 py-5 z-20">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

        <div className="animate-marquee flex items-center gap-10 sm:gap-14">
          {[...LABEL_LOGOS, ...LABEL_LOGOS].map((label, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors cursor-default select-none shrink-0"
            >
              <div className="w-6 h-6 text-[#FAFF00] opacity-80 shrink-0">
                {label.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider uppercase text-white/90 whitespace-nowrap">
                  {label.name}
                </span>
                <span className="text-[9px] font-medium tracking-widest uppercase text-white/40 whitespace-nowrap">
                  {label.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        3. STORY SCROLL FLOW PRESENTATION
        GSAP pinned card transitions with natural title-case typography
      */}
      <FlowArt aria-label="Orpheus Story Presentation">

        {/* 
          CHAPTER 01: THE ARCHITECTURE
          Pitch Black (#000000) with Yellow & White Typography
        */}
        <FlowSection id="features" aria-label="The Architecture" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FAFF00]">01 — The Architecture</p>
            <span className="text-[10px] font-bold tracking-widest uppercase border border-white/20 px-3 py-1 rounded-full text-white/70">
              Web Audio DSP
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="my-auto py-2">
            <h2 className="text-[clamp(3.5rem,8.5vw,11rem)] font-normal leading-[0.92] tracking-tight font-instrument text-white">
              Analog soul, <br />
              <span className="italic text-[#FAFF00]">digital speed.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <p className="max-w-[50ch] text-[clamp(1rem,1.8vw,1.5rem)] font-normal leading-relaxed text-white/70 font-geist">
            Built for listeners who care about fidelity. Zero commercial ads, zero algorithmic bloat — just pristine sound and tactile design.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2.5vw] pt-2">
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-[#FAFF00]">24-Bit Audio Pipeline</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-white/60">
                Hardware-accelerated Web Audio engine with low-latency buffer scheduling and live stereo visualizer physics.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-[#FAFF00]">0ms Client Cache</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-white/60">
                Stale-While-Revalidate persistence reverse-engineered from Spotify. Reopens with instant playback and zero layout shifts.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-[#FAFF00]">Tactile Vinyl Mode</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-white/60">
                Real-time 33⅓ RPM rotation physics, analog film grain shaders, and dynamic color extraction from album sleeves.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* 
          CHAPTER 02: THE CURATION FLOW
          Warm Ivory (#F5F0E8) with Black Typography
        */}
        <FlowSection id="curation" aria-label="The Curation Flow" style={{ backgroundColor: "#F5F0E8", color: "#000000" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-black/60">02 — The Curation Flow</p>
            <span className="text-[10px] font-bold tracking-widest uppercase border border-black/20 px-3 py-1 rounded-full text-black/70">
              Interactive Vectors
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div className="my-auto py-2">
            <h2 className="text-[clamp(3.5rem,8.5vw,11rem)] font-normal leading-[0.92] tracking-tight font-instrument text-black">
              Tune in, <br />
              <span className="italic">stay lost.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <p className="max-w-[50ch] text-[clamp(1rem,1.8vw,1.5rem)] font-normal leading-relaxed text-black/75 font-geist">
            Three steps. Zero complexity. Your personal sonic frequency is calibrated the moment you join.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2.5vw] pt-2">
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-black">01 — Bubble Calibration</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-black/70">
                Tap the genres and 3 artists you love using our interactive floating-bubble physics. No sterile questionnaires.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-black">02 — Harmonic Synthesis</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-black/70">
                Orpheus generates bespoke Daily Mixes, Quick Picks, and atmosphere shelves tailored to your exact taste vector.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold tracking-wider text-black">03 — Infinite Radio</p>
              <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-black/70">
                When your queue finishes, our autonomous recommendation pipeline autoplays matching tracks with zero dead air.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* 
          CHAPTER 03: THE CATALOG & MAJOR LABELS
          Deep Cobalt Blue (#1A3DE8) with White Text & SVG Label Logos
        */}
        <FlowSection id="catalog" aria-label="The Catalog" style={{ backgroundColor: "#1A3DE8", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FAFF00]">03 — Global Master Catalog</p>
            <span className="text-[10px] font-bold tracking-widest uppercase border border-white/20 px-3 py-1 rounded-full text-white/80">
              100M+ Releases
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <div className="my-auto py-2">
            <h2 className="text-[clamp(3.5rem,8.5vw,11rem)] font-normal leading-[0.92] tracking-tight font-instrument text-white">
              The giants, <br />
              <span className="italic text-[#FAFF00]">every master.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <p className="max-w-[50ch] text-[clamp(1rem,1.8vw,1.5rem)] font-normal leading-relaxed text-white/80 font-geist">
            Powered by the Big Three music conglomerates and historic recording imprints worldwide.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          {/* Graphical SVG Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-3">
            {LABEL_LOGOS.map((label, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center group hover:bg-white hover:text-black transition-colors"
              >
                <div className="mb-2 shrink-0">
                  {label.icon}
                </div>
                <span className="text-[11px] font-bold tracking-wider leading-tight">
                  {label.name}
                </span>
                <span className="text-[8px] font-medium tracking-widest opacity-60 mt-0.5">
                  {label.sub}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(0.9rem,1.3vw,1.15rem)] font-normal text-white/70">
            From iconic analog vinyl pressings to high-bitrate digital masters — streamed with zero compromises.
          </p>
        </FlowSection>

        {/* 
          CHAPTER 04: JOIN ORPHEUS
          Pure Pitch Black (#000000) with Electric Yellow Accent & CTA
        */}
        <FlowSection id="join" aria-label="Join Orpheus" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FAFF00]">04 — Launch</p>
            <span className="text-[10px] font-bold tracking-widest uppercase border border-white/20 px-3 py-1 rounded-full text-white/70">
              100% Free
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="my-auto py-6">
            <h2 className="text-[clamp(3.5rem,9.5vw,12rem)] font-normal leading-[0.88] tracking-tight font-instrument text-white">
              The needle <br />
              <span className="italic text-[#FAFF00]">drops now.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-8">
            <p className="max-w-[45ch] text-[clamp(1rem,1.8vw,1.5rem)] font-normal leading-relaxed text-white/70 font-geist">
              Take back your listening ritual. Join Orpheus today — completely free, zero audio ads, and complete fidelity for the modern listener.
            </p>

            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex items-center gap-4 bg-[#FAFF00] text-black px-12 py-5 rounded-full font-black text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(250,255,0,0.4)] cursor-pointer shrink-0"
            >
              <span>Get Started Free</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </FlowSection>

      </FlowArt>

    </div>
  );
}

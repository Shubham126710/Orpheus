"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Play, 
  Disc3, 
  Sparkles, 
  Sliders, 
  Zap, 
  Volume2, 
  ChevronDown, 
  ArrowUpRight, 
  Radio, 
  Check 
} from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";

interface LandingPageProps {
  onJoinClick: () => void;
}

// Major record labels SVG logos
const LABEL_LOGOS = [
  {
    name: "UNIVERSAL MUSIC GROUP",
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
    name: "SONY MUSIC",
    sub: "ENTERTAINMENT",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <path d="M20 75 C 35 25, 65 25, 80 75 C 65 55, 35 55, 20 75 Z" fill="currentColor" />
        <circle cx="50" cy="30" r="12" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "WARNER MUSIC GROUP",
    sub: "WMG",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M25 35 L 35 68 L 50 45 L 65 68 L 75 35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "COLUMBIA RECORDS",
    sub: "EST. 1887",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="14" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "DEF JAM RECORDINGS",
    sub: "NYC 1984",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <rect x="18" y="25" width="28" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
        <path d="M60 25 L 82 25 L 82 60 C 82 72, 70 75, 60 75 C 50 75, 48 68, 48 68" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "ATLANTIC RECORDS",
    sub: "WARNER",
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M30 72 L 50 25 L 70 72 M 36 58 L 64 58" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  return (
    <div className="relative w-full bg-black text-white font-geist selection:bg-[#FAFF00] selection:text-black">

      {/* 
        PERSISTENT CURVED FLOATING NAVBAR 
        Fixed on screen with authentic yellow logo, persisting across all scroll chapters
      */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] px-5 md:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
        
        {/* Authentic Golden Yellow Circular Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-9 h-9 rounded-full bg-[#FAFF00] flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(250,255,0,0.5)] group-hover:scale-105 transition-transform shrink-0">
            <Image 
              src="/logo-trimmed.png" 
              alt="Orpheus Lyre Logo" 
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

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onJoinClick}
            className="text-xs font-bold tracking-widest uppercase text-white/80 hover:text-white px-4 py-2 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={onJoinClick}
            className="text-xs font-black tracking-[0.2em] uppercase bg-[#FAFF00] text-black px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(250,255,0,0.35)] hover:scale-105 cursor-pointer"
          >
            Join Free
          </button>
        </div>

      </header>

      {/* GSAP Story Scroll Flow Presentation */}
      <FlowArt aria-label="Orpheus Story Presentation">

        {/* 
          CHAPTER 01: THE SOUND
          Orpheus Electric Yellow (#FAFF00) with Pitch Black Typography
        */}
        <FlowSection aria-label="The Sound" style={{ backgroundColor: "#FAFF00", color: "#000" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.3em]">01 — The Sound</p>
            <span className="text-[10px] font-black uppercase tracking-widest border border-black/20 px-3 py-1 rounded-full">
              33⅓ RPM Hi-Fi
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div className="my-auto py-4">
            <h1 className="text-[clamp(3.5rem,10.5vw,13rem)] font-normal leading-[0.88] uppercase tracking-tight font-instrument">
              Experience
              <br />
              <span className="italic font-normal">Music,</span>
              <br />
              Cinematically.
            </h1>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <p className="max-w-[48ch] text-[clamp(1rem,2vw,1.75rem)] font-normal leading-relaxed text-black/80 font-geist">
              A high-performance streaming client bridging modern liquid interfaces, intelligent taste curation, and nostalgic analog warmth.
            </p>

            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-black text-xs md:text-sm tracking-[0.25em] uppercase hover:scale-105 transition-transform shadow-2xl cursor-pointer"
            >
              <span>Start Listening</span>
              <Play size={14} fill="currentColor" className="ml-1" />
            </button>
          </div>
        </FlowSection>

        {/* 
          CHAPTER 02: THE MISSION
          Pitch Black (#000000) with White & Yellow Accents
        */}
        <FlowSection aria-label="The Architecture" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00]">02 — The Architecture</p>
            <span className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-white/70">
              Web Audio DSP
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div>
            <h2 className="text-[clamp(3.5rem,10vw,12rem)] font-normal leading-[0.88] uppercase tracking-tight font-instrument">
              Analog Soul.
              <br />
              <span className="italic text-[#FAFF00]">Digital Speed.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <p className="max-w-[50ch] text-[clamp(1rem,2vw,1.6rem)] font-normal leading-relaxed text-white/70 font-geist">
            Built for listeners who care about fidelity. Zero ads, zero algorithmic bloat — just pristine sound and tactile design.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2.5vw] pt-2">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider text-[#FAFF00]">24-Bit Audio Pipeline</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/60">
                Hardware-accelerated Web Audio engine with low-latency buffer scheduling and live stereo visualizer physics.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider text-[#FAFF00]">0ms Client Cache</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/60">
                Stale-While-Revalidate persistence reverse-engineered from Spotify. Reopens with instant playback and zero layout shifts.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider text-[#FAFF00]">Tactile Vinyl Mode</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/60">
                Real-time 33⅓ RPM rotation physics, analog film grain shaders, and dynamic color extraction from artwork.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* 
          CHAPTER 03: HOW IT WORKS
          Clean Off-White / Ivory (#F5F0E8) with Black Typography
        */}
        <FlowSection aria-label="How It Works" style={{ backgroundColor: "#F5F0E8", color: "#000000" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.3em]">03 — The Curation Flow</p>
            <span className="text-[10px] font-black uppercase tracking-widest border border-black/20 px-3 py-1 rounded-full">
              Beats-Style Vectors
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div>
            <h2 className="text-[clamp(3.5rem,10vw,12rem)] font-normal leading-[0.88] uppercase tracking-tight font-instrument">
              Tune In.
              <br />
              <span className="italic">Stay Lost.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <p className="max-w-[50ch] text-[clamp(1rem,2vw,1.6rem)] font-normal leading-relaxed text-black/75 font-geist">
            Three steps. Zero complexity. Your personal sonic frequency is calibrated the moment you join.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-black/20" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2.5vw] pt-2">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider">01 — Bubble Calibration</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-black/70">
                Tap the genres and 3 artists you love using our interactive floating-bubble physics. No sterile questionnaires.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider">02 — Harmonic Synthesis</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-black/70">
                Orpheus generates bespoke Daily Mixes, Quick Picks, and atmosphere shelves tailored to your exact taste vector.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wider">03 — Infinite Radio</p>
              <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-black/70">
                When your queue finishes, our autonomous recommendation pipeline autoplays matching tracks with zero dead air.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* 
          CHAPTER 04: THE CATALOG & MAJOR LABELS
          Deep Cobalt Blue (#1A3DE8) with White Text & SVG Label Logos
        */}
        <FlowSection aria-label="The Catalog" style={{ backgroundColor: "#1A3DE8", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00]">04 — Global Master Catalog</p>
            <span className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-white/80">
              100M+ Releases
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <div>
            <h2 className="text-[clamp(3.5rem,10vw,12rem)] font-normal leading-[0.88] uppercase tracking-tight font-instrument">
              The Giants.
              <br />
              <span className="italic text-[#FAFF00]">Every Master.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <p className="max-w-[50ch] text-[clamp(1rem,2vw,1.6rem)] font-normal leading-relaxed text-white/80 font-geist">
            Powered by the Big Three music conglomerates and historic recording imprints worldwide.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          {/* Graphical SVG Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-4">
            {LABEL_LOGOS.map((label, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center group hover:bg-white hover:text-black transition-colors"
              >
                <div className="mb-2 shrink-0">
                  {label.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider leading-tight">
                  {label.name}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 mt-0.5">
                  {label.sub}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(0.9rem,1.5vw,1.25rem)] font-normal text-white/70">
            From iconic analog vinyl pressings to high-bitrate digital masters — streamed with zero compromises.
          </p>
        </FlowSection>

        {/* 
          CHAPTER 05: JOIN ORPHEUS
          Pure Pitch Black (#000000) with Giant Electric Yellow CTA
        */}
        <FlowSection aria-label="Join Orpheus" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00]">05 — Launch</p>
            <span className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-white/70">
              100% Free
            </span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="my-auto py-6">
            <h2 className="text-[clamp(3.5rem,10.5vw,13rem)] font-normal leading-[0.85] uppercase tracking-tight font-instrument">
              The Needle
              <br />
              <span className="italic text-[#FAFF00]">Drops Now.</span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/15" />

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-8">
            <p className="max-w-[45ch] text-[clamp(1rem,2vw,1.75rem)] font-normal leading-relaxed text-white/70 font-geist">
              Take back your listening ritual. Join Orpheus today — completely free, zero audio ads, and complete fidelity for the modern listener.
            </p>

            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex items-center gap-4 bg-[#FAFF00] text-black px-12 py-6 rounded-full font-black text-xs md:text-sm tracking-[0.25em] uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(250,255,0,0.4)] cursor-pointer shrink-0"
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

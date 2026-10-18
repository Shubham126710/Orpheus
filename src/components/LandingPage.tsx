"use client";

import React, { useState, useEffect, useMemo } from "react";
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

// Authentic Record Label Vector Logos
const OFFICIAL_LABELS = [
  { name: "Universal Music Group", file: "/labels/umg.svg" },
  { name: "Sony Music", file: "/labels/sony.svg" },
  { name: "Warner Music Group", file: "/labels/wmg.svg" },
  { name: "Columbia Records", file: "/labels/columbia.svg" },
  { name: "Def Jam Recordings", file: "/labels/defjam.svg" },
  { name: "Atlantic Records", file: "/labels/atlantic.svg" },
  { name: "Interscope Records", file: "/labels/interscope.svg" },
  { name: "RCA Records", file: "/labels/rca.svg" },
  { name: "Republic Records", file: "/labels/republic.svg" },
];

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "features" | "curation" | "catalog" | "footer">("hero");

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // In a stacked GSAP pinned presentation, higher sections layer on top with higher zIndex.
      // We check sections in top-to-bottom visual stacking order: footer -> catalog -> curation -> features.
      const sections: Array<"footer" | "catalog" | "curation" | "features"> = [
        "footer",
        "catalog",
        "curation",
        "features",
      ];

      const navY = 100; // Directly beneath the floating navbar

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section top has reached or passed the navbar level and bottom is still below
          if (rect.top <= navY && rect.bottom > navY) {
            setActiveSection(id);
            return;
          }
        }
      }

      // Default to hero if none of the pinned cards are currently beneath the navbar
      setActiveSection("hero");
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  // Adaptive theme values based on the active section background
  const navTheme = useMemo(() => {
    switch (activeSection) {
      case "curation":
        // Warm Ivory Section (Monochromatic black badge with white inverted lyre)
        return {
          container: "bg-[#F5F0E8]/90 border-black/10 text-black shadow-lg shadow-black/5",
          brandText: "text-black",
          logoBadge: "bg-black shadow-sm",
          logoInvert: true,
          link: "text-black/60 hover:text-black",
          activeLink: "text-black font-black",
          cta: "bg-black text-[#FAFF00] hover:bg-zinc-800 shadow-sm",
        };
      case "catalog":
        // Deep Cobalt Blue Section
        return {
          container: "bg-[#1027a3]/90 border-white/20 text-white shadow-xl shadow-blue-950/40",
          brandText: "text-white",
          logoBadge: "bg-[#FAFF00] shadow-sm",
          logoInvert: false,
          link: "text-white/70 hover:text-[#FAFF00]",
          activeLink: "text-[#FAFF00] font-black",
          cta: "bg-[#FAFF00] text-black hover:bg-white shadow-sm",
        };
      case "footer":
        // Electric Yellow Section
        return {
          container: "bg-[#e5eb00]/95 border-black/15 text-black shadow-lg shadow-black/5",
          brandText: "text-black",
          logoBadge: "bg-black border border-black/20 shadow-sm",
          logoInvert: true,
          link: "text-black/70 hover:text-black",
          activeLink: "text-black font-black",
          cta: "bg-black text-[#FAFF00] hover:bg-zinc-800 shadow-sm",
        };
      case "hero":
      case "features":
      default:
        // Dark/Obsidian Sections
        return {
          container: "bg-zinc-950/85 border-white/10 text-white shadow-2xl shadow-black/80",
          brandText: "text-white",
          logoBadge: "bg-[#FAFF00] shadow-sm",
          logoInvert: false,
          link: "text-white/60 hover:text-[#FAFF00]",
          activeLink: "text-[#FAFF00] font-black",
          cta: "bg-[#FAFF00] text-black hover:bg-white shadow-sm",
        };
    }
  }, [activeSection]);

  return (
    <div className="relative w-full bg-black text-white font-geist selection:bg-[#FAFF00] selection:text-black">

      {/* 
        ADAPTIVE COLLAPSING CURVED NOTCH NAVBAR
        - Collapses into a sleek compact pill when scrolled
        - Adapts color palette to match the section in view (White on Ivory, Blue on Blue, Yellow on Yellow, Dark on Black)
        - Only displays "Join Free" (no sign in button)
        - Overflow hidden & proper inset padding so button never bleeds outside the pill
      */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isScrolled ? "w-auto max-w-[92vw]" : "w-[94%] max-w-4xl"
      }`}>
        <nav className={`flex items-center justify-between rounded-full border backdrop-blur-xl transition-all duration-300 ease-out ${
          navTheme.container
        } ${
          isScrolled ? "py-1.5 pl-3.5 sm:pl-4 pr-3.5 sm:pr-4 gap-3 sm:gap-6" : "py-2 pl-4 sm:pl-6 pr-4 sm:pr-5 gap-6"
        }`}>
          {/* Brand Logo with dynamic badge */}
          <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 shrink-0 ${navTheme.logoBadge}`}>
              <Image 
                src="/logo-trimmed.png" 
                alt="Orpheus Logo" 
                width={18} 
                height={18} 
                className={`object-contain ${navTheme.logoInvert ? "brightness-0 invert" : ""}`} 
              />
            </div>
            <span className={`text-xs sm:text-sm font-black tracking-[0.22em] uppercase font-geist transition-colors ${navTheme.brandText} ${isScrolled ? "hidden sm:inline-block" : ""}`}>
              Orpheus
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-4 md:gap-7">
            <a href="#features" className={`text-xs uppercase tracking-widest transition-colors ${activeSection === "features" ? navTheme.activeLink : navTheme.link}`}>Architecture</a>
            <a href="#curation" className={`text-xs uppercase tracking-widest transition-colors ${activeSection === "curation" ? navTheme.activeLink : navTheme.link}`}>Curation</a>
            <a href="#catalog" className={`text-xs uppercase tracking-widest transition-colors ${activeSection === "catalog" ? navTheme.activeLink : navTheme.link}`}>Catalog</a>
            <a href="#footer" className={`text-xs uppercase tracking-widest transition-colors ${activeSection === "footer" ? navTheme.activeLink : navTheme.link}`}>Colophon</a>
          </div>

          {/* Right Action Button: ONLY Join Free */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onJoinClick}
              className={`font-black uppercase tracking-wider rounded-full transition-all hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap ${navTheme.cta} ${
                isScrolled ? "px-3.5 py-1.5 text-[11px]" : "px-4 sm:px-5 py-1.5 text-xs"
              }`}
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
        Smooth infinite horizontal ribbon featuring authentic logos ONLY (no text)
      */}
      <div className="w-full relative overflow-hidden bg-black/95 border-y border-white/10 py-6 z-20">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10" />

        <div className="animate-marquee flex items-center gap-14 sm:gap-20 md:gap-28">
          {[...OFFICIAL_LABELS, ...OFFICIAL_LABELS, ...OFFICIAL_LABELS].map((label, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center shrink-0 cursor-default select-none"
              title={label.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={label.file}
                alt={label.name}
                className="h-7 sm:h-9 md:h-10 w-auto max-w-[140px] max-h-10 object-contain brightness-0 invert opacity-50 hover:opacity-100 transition-opacity duration-300"
              />
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

          {/* Authentic Vector Logos Grid - Logos Only, No Text */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-4">
            {OFFICIAL_LABELS.slice(0, 6).map((label, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-center h-24 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 group hover:bg-white transition-all cursor-default"
                title={label.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={label.file} 
                  alt={label.name} 
                  className="h-8 md:h-9 max-h-9 w-auto max-w-[110px] object-contain brightness-0 invert group-hover:invert-0 transition-all opacity-80 group-hover:opacity-100" 
                />
              </div>
            ))}
          </div>

          <hr className="my-[1.5vw] border-none border-t border-white/20" />

          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(0.9rem,1.3vw,1.15rem)] font-normal text-white/70">
            From iconic analog vinyl pressings to high-bitrate digital masters — streamed with zero compromises.
          </p>
        </FlowSection>

        {/* 
          CHAPTER 04: THE FOOTER / COLOPHON CARD (ELECTRIC YELLOW)
          Site Primary Yellow (#FAFF00) with Black Typography, Creator Dossier & Full Navigation
        */}
        <FlowSection id="footer" aria-label="Orpheus Colophon and Footer" style={{ backgroundColor: "#FAFF00", color: "#000000" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-black/80">04 — The Colophon</p>
            <span className="text-[10px] font-bold tracking-widest uppercase border border-black/25 px-3 py-1 rounded-full text-black/80">
              Audio Client & Architecture
            </span>
          </div>

          <hr className="my-[1.2vw] border-none border-t border-black/20" />

          <div className="my-auto py-2">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 shadow-xl shrink-0">
                <Image src="/logo-trimmed.png" alt="Orpheus Logo" width={22} height={22} className="object-contain brightness-0 invert" />
              </div>
              <span className="text-xl font-black uppercase tracking-[0.25em] text-black">
                Orpheus
              </span>
            </div>
            <h2 className="text-[clamp(2.8rem,6.8vw,8.5rem)] font-normal leading-[0.92] tracking-tight font-instrument text-black">
              Music without noise. <br />
              <span className="italic text-black/75">Design without compromise.</span>
            </h2>
          </div>

          <hr className="my-[1.2vw] border-none border-t border-black/20" />

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
            
            {/* Col 1: Project Specs */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-2">The Mission</p>
                <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-black/75 font-geist">
                  A high-fidelity streaming sanctuary created to dismantle algorithmic clutter and commercial noise. Built for listeners who cherish album experiences and analog nuance.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                <span className="px-2.5 py-1 bg-black/10 border border-black/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">Next.js 16</span>
                <span className="px-2.5 py-1 bg-black/10 border border-black/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">Tailwind CSS</span>
                <span className="px-2.5 py-1 bg-black/10 border border-black/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">Web Audio API</span>
                <span className="px-2.5 py-1 bg-black text-[#FAFF00] rounded-full text-[10px] font-bold uppercase tracking-wider">Lossless DSP</span>
              </div>
            </div>

            {/* Col 2: Creator Dossier & Links */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-3">Connect with the Creator</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-black text-[#FAFF00] font-black flex items-center justify-center text-xs shadow-md shrink-0">
                    SU
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black leading-none">Shubham Upadhyay</p>
                    <p className="text-[11px] text-black/60 mt-1">Creator & Full-Stack Architect</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-3">
                  <a 
                    href="https://github.com/Shubham126710" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="GitHub"
                    aria-label="GitHub"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black text-black hover:text-[#FAFF00] border border-black/15 transition-all hover:scale-110 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/upadhyay-shubham/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black text-black hover:text-[#FAFF00] border border-black/15 transition-all hover:scale-110 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com/iamshubham_15" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black text-black hover:text-[#FAFF00] border border-black/15 transition-all hover:scale-110 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="mailto:shubham360upadhyay@gmail.com" 
                    title="Email"
                    aria-label="Email"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black text-black hover:text-[#FAFF00] border border-black/15 transition-all hover:scale-110 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3: CTA & Navigation */}
            <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-1 md:text-right">Get Started</p>
                <p className="text-xs text-black/60 mb-3 md:text-right">No subscription required.</p>
              </div>

              <div className="flex flex-col gap-2.5 w-full sm:w-auto items-stretch md:items-end">
                <button
                  type="button"
                  onClick={onJoinClick}
                  className="inline-flex items-center justify-center gap-3 bg-black text-[#FAFF00] hover:bg-zinc-900 px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 cursor-pointer"
                >
                  <span>Launch Player</span>
                  <ArrowUpRight size={16} />
                </button>
                <a
                  href="#hero"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-black/60 hover:text-black py-1.5 transition-colors"
                >
                  <span>Return to Top ↑</span>
                </a>
              </div>
            </div>

          </div>

          <hr className="my-[1.2vw] border-none border-t border-black/20" />

          {/* Legal / Copyright Bottom Line */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-black/60">
            <p>© {new Date().getFullYear()} Orpheus. Built with precision for the obsessive listener.</p>
            <p>Non-commercial audio streaming client powered by Web Audio API.</p>
          </div>
        </FlowSection>

      </FlowArt>

    </div>
  );
}

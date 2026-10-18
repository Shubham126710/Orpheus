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
        <nav className={`flex items-center justify-between rounded-full border backdrop-blur-xl transition-all duration-300 ease-out overflow-hidden ${
          navTheme.container
        } ${
          isScrolled ? "py-1.5 pl-3.5 sm:pl-4 pr-2 gap-3 sm:gap-6" : "py-2 pl-4 sm:pl-6 pr-2.5 gap-6"
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
              className={`font-black uppercase tracking-wider rounded-full transition-all hover:scale-105 cursor-pointer shrink-0 ${navTheme.cta} ${
                isScrolled ? "px-3.5 py-1 text-[11px]" : "px-4 sm:px-5 py-1.5 text-xs"
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

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a 
                    href="https://github.com/Shubham126710" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-black hover:text-[#FAFF00] transition-colors p-2 rounded-xl bg-black/10 hover:bg-black border border-black/15"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight size={13} className="ml-auto opacity-50" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/upadhyay-shubham/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-black hover:text-[#FAFF00] transition-colors p-2 rounded-xl bg-black/10 hover:bg-black border border-black/15"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={13} className="ml-auto opacity-50" />
                  </a>
                  <a 
                    href="https://instagram.com/iamshubham_15" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-black hover:text-[#FAFF00] transition-colors p-2 rounded-xl bg-black/10 hover:bg-black border border-black/15"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight size={13} className="ml-auto opacity-50" />
                  </a>
                  <a 
                    href="mailto:shubham360upadhyay@gmail.com" 
                    className="flex items-center gap-2 text-xs font-medium text-black hover:text-[#FAFF00] transition-colors p-2 rounded-xl bg-black/10 hover:bg-black border border-black/15"
                  >
                    <span>Email</span>
                    <ArrowUpRight size={13} className="ml-auto opacity-50" />
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

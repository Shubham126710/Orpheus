"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] text-[#FAFF00]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
interface PrismaHeroProps {
  onJoinClick?: () => void;
}

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Curation", href: "#curation" },
  { label: "Catalog", href: "#catalog" },
];

export const PrismaHero = ({ onJoinClick }: PrismaHeroProps) => {
  return (
    <section className="relative h-screen w-full p-2 sm:p-4 bg-black">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-2xl">
        
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* Ambient Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay" />

        {/* Cinematic Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-10 md:px-14 lg:pb-12 z-20">
          <div className="grid grid-cols-12 items-end gap-6">
            
            {/* Giant Title */}
            <div className="col-span-12 lg:col-span-8">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FAFF00] block mb-2 font-geist">
                The Next Era of Audio • Cinematic Streaming
              </span>
              <h1
                className="font-medium leading-[0.85] tracking-[-0.06em] text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[15vw] font-instrument"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="Orpheus" showAsterisk />
              </h1>
            </div>

            {/* Subhead & CTA */}
            <div className="col-span-12 flex flex-col gap-5 pb-2 lg:col-span-4 lg:pb-6">
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm md:text-base text-white/75 font-geist font-normal leading-relaxed"
              >
                A high-performance streaming client bridging modern liquid interfaces, intelligent taste curation, and nostalgic analog warmth.
              </motion.p>

              <motion.button
                type="button"
                onClick={onJoinClick}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-3 self-start rounded-full bg-[#FAFF00] py-1.5 pl-6 pr-1.5 text-xs md:text-sm font-black tracking-wider uppercase text-black transition-all hover:gap-4 shadow-[0_0_30px_rgba(250,255,0,0.35)] cursor-pointer"
              >
                Start Listening
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[#FAFF00] transition-transform group-hover:scale-110">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </span>
              </motion.button>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PrismaHero;

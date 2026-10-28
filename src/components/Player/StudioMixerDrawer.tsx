"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Volume2, VolumeX, SlidersHorizontal, Sparkles } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useAudioMeterSource } from "@/hooks/use-audio-meter-source";
import { LevelMeter } from "@/components/ui/level-meter";
import { Fader, FaderTrack, FaderRange, FaderThumb } from "@/components/ui/fader";
import { Knob, KnobDial, KnobTrack, KnobRange, KnobPointer, KnobLabel, KnobValue } from "@/components/ui/knob";
import { DbScale } from "@/components/ui/db-scale";
import { dbToGain, formatDb, gainToDb, SILENCE_DB } from "@/lib/audio/decibels";

interface StudioMixerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudioMixerDrawer({ isOpen, onClose }: StudioMixerDrawerProps) {
  const {
    volume,
    setVolume,
    bass,
    setBass,
    mid,
    setMid,
    treble,
    setTreble,
    pan,
    setPan,
    resetEq,
    applyEqPreset,
    isPlaying,
  } = usePlayerStore();

  const { meterSource } = useAudioMeterSource();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const volumeDb = volume <= 0 ? SILENCE_DB : gainToDb(volume);

  const formatEqDb = (val: number) => {
    if (Math.abs(val) < 0.1) return "0.0 dB";
    return val > 0 ? `+${val.toFixed(1)} dB` : `${val.toFixed(1)} dB`;
  };

  const formatPan = (val: number) => {
    if (Math.abs(val) < 0.05) return "CENTER";
    if (val < 0) return `L ${Math.round(Math.abs(val) * 100)}%`;
    return `R ${Math.round(val * 100)}%`;
  };

  const activePreset =
    bass === 0 && mid === 0 && treble === 0 && pan === 0
      ? "flat"
      : bass === 6 && mid === -1 && treble === 2
      ? "bass"
      : bass === -2 && mid === 4.5 && treble === 3
      ? "vocal"
      : bass === 3.5 && mid === 1.5 && treble === -2
      ? "warm"
      : "custom";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Console Chassis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl bg-[#09090C]/95 border border-white/15 rounded-3xl p-5 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white select-none overflow-hidden my-auto"
          >
            {/* Corner Rack Screws */}
            <div className="absolute top-3 left-3 text-white/20 font-mono text-[10px] pointer-events-none">[+]</div>
            <div className="absolute top-3 right-3 text-white/20 font-mono text-[10px] pointer-events-none">[+]</div>
            <div className="absolute bottom-3 left-3 text-white/20 font-mono text-[10px] pointer-events-none">[+]</div>
            <div className="absolute bottom-3 right-3 text-white/20 font-mono text-[10px] pointer-events-none">[+]</div>

            {/* Subtle Brushed Metal Accent Lines */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FAFF00]/40 to-transparent" />

            {/* Console Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? "bg-[#FAFF00] shadow-[0_0_12px_#FAFF00]" : "bg-white/20"} transition-all`} />
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full bg-[#FAFF00] animate-ping opacity-40" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-geist font-black text-lg md:text-xl tracking-wider uppercase text-white flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-[#FAFF00]" />
                      Studio Console
                    </h2>
                    <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-[#FAFF00]/10 text-[#FAFF00] border border-[#FAFF00]/30 font-semibold">
                      STEREO BUS
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-white/50 tracking-wide mt-0.5">
                    ORPHEUS ANALOG DSP · 4-BAND EQ & MASTER FADER
                  </p>
                </div>
              </div>

              {/* Presets & Close */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => applyEqPreset("flat")}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-colors ${
                      activePreset === "flat"
                        ? "bg-[#FAFF00] text-black shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Flat
                  </button>
                  <button
                    onClick={() => applyEqPreset("bass")}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-colors ${
                      activePreset === "bass"
                        ? "bg-[#FAFF00] text-black shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Bass
                  </button>
                  <button
                    onClick={() => applyEqPreset("vocal")}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-colors ${
                      activePreset === "vocal"
                        ? "bg-[#FAFF00] text-black shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Vocal
                  </button>
                  <button
                    onClick={() => applyEqPreset("warm")}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-colors ${
                      activePreset === "warm"
                        ? "bg-[#FAFF00] text-black shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Warm
                  </button>
                </div>

                <button
                  onClick={resetEq}
                  title="Reset EQ to Flat"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-white transition-colors border border-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Console Channel Strips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              
              {/* SECTION 1: 4 Tactile Rotary EQ Knobs (Bass, Mid, Treble, Pan) */}
              <div className="md:col-span-6 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/70 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#FAFF00]" />
                    Parametric EQ & Field
                  </span>
                  <span className="font-mono text-[10px] text-white/40 tracking-wider">
                    ±12 dB / ROTARY
                  </span>
                </div>

                {/* Knobs Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                  
                  {/* BASS KNOB */}
                  <div className="flex flex-col items-center">
                    <Knob
                      value={bass}
                      onValueChange={setBass}
                      min={-12}
                      max={12}
                      step={0.5}
                      origin={0}
                      format={formatEqDb}
                      className="w-full flex flex-col items-center gap-2"
                    >
                      <KnobLabel className="font-mono text-[10px] tracking-widest uppercase font-semibold text-white/70">
                        Bass
                      </KnobLabel>
                      <KnobDial className="size-16 group hover:cursor-grab active:cursor-grabbing">
                        <KnobTrack className="stroke-white/15" />
                        <KnobRange className="stroke-[#FAFF00]" />
                        <KnobPointer className="fill-[#FAFF00]" />
                      </KnobDial>
                      <KnobValue className="font-mono text-[11px] font-bold text-[#FAFF00] tabular-nums mt-0.5" />
                    </Knob>
                    <span className="font-mono text-[9px] text-white/40 tracking-tight mt-1">
                      100 Hz
                    </span>
                  </div>

                  {/* MID KNOB */}
                  <div className="flex flex-col items-center">
                    <Knob
                      value={mid}
                      onValueChange={setMid}
                      min={-12}
                      max={12}
                      step={0.5}
                      origin={0}
                      format={formatEqDb}
                      className="w-full flex flex-col items-center gap-2"
                    >
                      <KnobLabel className="font-mono text-[10px] tracking-widest uppercase font-semibold text-white/70">
                        Mid
                      </KnobLabel>
                      <KnobDial className="size-16 group hover:cursor-grab active:cursor-grabbing">
                        <KnobTrack className="stroke-white/15" />
                        <KnobRange className="stroke-[#FAFF00]" />
                        <KnobPointer className="fill-[#FAFF00]" />
                      </KnobDial>
                      <KnobValue className="font-mono text-[11px] font-bold text-[#FAFF00] tabular-nums mt-0.5" />
                    </Knob>
                    <span className="font-mono text-[9px] text-white/40 tracking-tight mt-1">
                      1.0 kHz
                    </span>
                  </div>

                  {/* TREBLE KNOB */}
                  <div className="flex flex-col items-center">
                    <Knob
                      value={treble}
                      onValueChange={setTreble}
                      min={-12}
                      max={12}
                      step={0.5}
                      origin={0}
                      format={formatEqDb}
                      className="w-full flex flex-col items-center gap-2"
                    >
                      <KnobLabel className="font-mono text-[10px] tracking-widest uppercase font-semibold text-white/70">
                        Treble
                      </KnobLabel>
                      <KnobDial className="size-16 group hover:cursor-grab active:cursor-grabbing">
                        <KnobTrack className="stroke-white/15" />
                        <KnobRange className="stroke-[#FAFF00]" />
                        <KnobPointer className="fill-[#FAFF00]" />
                      </KnobDial>
                      <KnobValue className="font-mono text-[11px] font-bold text-[#FAFF00] tabular-nums mt-0.5" />
                    </Knob>
                    <span className="font-mono text-[9px] text-white/40 tracking-tight mt-1">
                      10 kHz
                    </span>
                  </div>

                  {/* PAN KNOB */}
                  <div className="flex flex-col items-center">
                    <Knob
                      value={pan}
                      onValueChange={setPan}
                      min={-1}
                      max={1}
                      step={0.05}
                      origin={0}
                      format={formatPan}
                      className="w-full flex flex-col items-center gap-2"
                    >
                      <KnobLabel className="font-mono text-[10px] tracking-widest uppercase font-semibold text-white/70">
                        Pan
                      </KnobLabel>
                      <KnobDial className="size-16 group hover:cursor-grab active:cursor-grabbing">
                        <KnobTrack className="stroke-white/15" />
                        <KnobRange className="stroke-[#FAFF00]" />
                        <KnobPointer className="fill-[#FAFF00]" />
                      </KnobDial>
                      <KnobValue className="font-mono text-[11px] font-bold text-[#FAFF00] tabular-nums mt-0.5" />
                    </Knob>
                    <span className="font-mono text-[9px] text-white/40 tracking-tight mt-1">
                      L / R
                    </span>
                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>DOUBLE CLICK: RESET TO 0</span>
                  <span className="text-[#FAFF00]/80">ANALOG TAPE SATURATION</span>
                </div>
              </div>

              {/* SECTION 2: Stereo Master Bus Level Meters (L & R Peak/RMS) */}
              <div className="md:col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/70">
                    Bus Level
                  </span>
                  <span className="font-mono text-[10px] text-white/40 tracking-wider">
                    PEAK / RMS
                  </span>
                </div>

                {/* Level Meter Body with DbScale */}
                <div className="flex items-center justify-center gap-3 my-auto py-2">
                  <DbScale
                    orientation="vertical"
                    minDb={-48}
                    maxDb={3}
                    ticks={[3, 0, -6, -12, -24, -36, -48]}
                    className="h-44 text-[10px] font-mono text-white/40"
                  />

                  <div className="flex flex-col items-center gap-1.5">
                    <LevelMeter
                      source={meterSource}
                      orientation="vertical"
                      variant="segmented"
                      segments={24}
                      minDb={-48}
                      maxDb={3}
                      channelCount={2}
                      className="h-44 w-12 rounded bg-black/60 border border-white/10 p-1"
                    />
                    <div className="flex items-center justify-between w-12 px-1 text-[9px] font-mono font-bold text-white/60">
                      <span>L</span>
                      <span>R</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>STEREO PEAK</span>
                  <span className="text-[#FAFF00] font-semibold">TRUE PEAK FS</span>
                </div>
              </div>

              {/* SECTION 3: Master Volume Console Fader */}
              <div className="md:col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/70">
                    Master Bus
                  </span>
                  <span className="font-mono text-[10px] text-[#FAFF00] tracking-wider font-semibold">
                    {volume <= 0 ? "−∞ dB" : formatDb(volumeDb, { decimals: 1 })}
                  </span>
                </div>

                {/* Vertical Console Fader */}
                <div className="flex items-center justify-center gap-3 my-auto py-2">
                  <DbScale
                    orientation="vertical"
                    minDb={-60}
                    maxDb={0}
                    ticks={[0, -6, -12, -24, -36, -60]}
                    className="h-44 text-[10px] font-mono text-white/40"
                  />

                  <div className="h-44 flex items-center py-2">
                    <Fader
                      value={volumeDb}
                      onValueChange={(db) => {
                        const nextGain = db === SILENCE_DB || db <= -60 ? 0 : dbToGain(db);
                        setVolume(nextGain);
                      }}
                      min={-60}
                      max={0}
                      step={0.5}
                      silenceAtMin={true}
                      orientation="vertical"
                      variant="console"
                      className="h-full"
                    >
                      <FaderTrack className="w-3 rounded-full bg-black/60 border border-white/15">
                        <FaderRange className="bg-[#FAFF00] rounded-full" />
                        <FaderThumb className="w-7 h-5 bg-[#18181B] border border-[#FAFF00]/80 rounded shadow-lg hover:border-[#FAFF00]" />
                      </FaderTrack>
                    </Fader>
                  </div>
                </div>

                {/* Mute Button & Status */}
                <div className="w-full mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-colors ${
                      volume === 0
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                    }`}
                  >
                    {volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    {volume === 0 ? "Muted" : "Mute"}
                  </button>
                  <span className="font-mono text-[9px] text-white/40">
                    UNITY: 0 dB
                  </span>
                </div>
              </div>

            </div>

            {/* Console Footer Telemetry */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-white/40">
              <div className="flex items-center gap-4">
                <span>SYSTEM: 48 kHz / 32-bit FLOAT</span>
                <span>DSP ENGINE: LOW-LATENCY FIR</span>
              </div>
              <div className="flex items-center gap-2 text-[#FAFF00]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FAFF00] animate-pulse" />
                <span>ANALOG SUMMING ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

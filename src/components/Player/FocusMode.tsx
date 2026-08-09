import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Pause, X, RotateCcw, SkipForward } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useThemeStore } from '@/store/useThemeStore';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FocusMode({ isOpen, onClose }: FocusModeProps) {
  const { currentTrack, isPlaying, togglePlay, playNext } = usePlayerStore();
  const { dominantColor, secondaryColor } = useThemeStore();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Auto switch
      const newMode = mode === 'focus' ? 'break' : 'focus';
      setMode(newMode);
      setTimeLeft(newMode === 'focus' ? focusDuration : breakDuration);
      setIsTimerRunning(true); // keep running
      
      // Play a subtle ding sound here if possible
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch(e) {}
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, mode, focusDuration, breakDuration]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration : breakDuration);
  };

  const applyPreset = (focusMins: number, breakMins: number) => {
    setFocusDuration(focusMins * 60);
    setBreakDuration(breakMins * 60);
    setMode('focus');
    setTimeLeft(focusMins * 60);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const highResThumbnail = currentTrack?.thumbnail
    ? currentTrack.thumbnail.includes("lh3.googleusercontent.com")
      ? currentTrack.thumbnail.replace(/=w\d+-h\d+.*/, '=w1200-h1200-l90-rj')
      : currentTrack.thumbnail.replace("hqdefault.jpg", "maxresdefault.jpg")
    : "/placeholder-art.jpg";

  if (!isOpen) return null;

  // Deep, atmospheric evolving color cycles.
  // PURPLE → BLUE → CYAN → TEAL → GREEN → YELLOW → ORANGE → PINK → MAGENTA → PURPLE.
  const palettes = {
    focus: { 
      // Layer 1: Massive slow base. Very deep to maintain dark atmosphere.
      l1: ['#3b0764', '#1e3a8a', '#083344', '#115e59', '#064e3b', '#713f12', '#7c2d12', '#831843', '#701a75', '#3b0764'],
      // Layer 2: Core fluid. Slightly brighter but rich.
      l2: ['#7c3aed', '#2563eb', '#0891b2', '#0d9488', '#16a34a', '#ca8a04', '#ea580c', '#db2777', '#c026d3', '#7c3aed'],
      // Layer 3: Accent. Rich jewel tones.
      l3: ['#8b5cf6', '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e', '#eab308', '#f97316', '#ec4899', '#d946ef', '#8b5cf6'],
      // Layer 4: Highlight. Soft, but muted to prevent blinding the timer.
      l4: ['#a78bfa', '#60a5fa', '#22d3ee', '#2dd4bf', '#4ade80', '#fde047', '#fb923c', '#f472b6', '#e879f9', '#a78bfa']
    },
    break: { 
      // Coral → Pink → Orange → Magenta → Warm Purple → Coral
      l1: ['#881337', '#831843', '#7c2d12', '#701a75', '#4a044e', '#881337'],
      l2: ['#e11d48', '#be185d', '#ea580c', '#c026d3', '#7e22ce', '#e11d48'],
      l3: ['#f43f5e', '#db2777', '#f97316', '#d946ef', '#9333ea', '#f43f5e'],
      l4: ['#fb7185', '#f472b6', '#fb923c', '#e879f9', '#a855f7', '#fb7185']
    },
  };
  
  const currentPalette = palettes[mode];

  // Common organic morphing animation properties
  const blobAnimationProps = {
    borderRadius: [
      "40% 60% 70% 30% / 40% 50% 60% 50%",
      "60% 40% 30% 70% / 60% 30% 70% 40%",
      "50% 50% 60% 40% / 30% 60% 40% 60%",
      "40% 60% 70% 30% / 40% 50% 60% 50%"
    ],
  };

  const cycleDuration = 120; // 2 minutes for a full cycle

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-[300] bg-[#050508] text-white flex flex-col items-center justify-between overflow-hidden h-[100dvh]"
      >
        {/* Organic Liquid Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000">
          
          {/* Layer 1: Massive Deep Violet/Purple Base - Very Slow */}
          <motion.div 
            animate={shouldReduceMotion ? { backgroundColor: currentPalette.l1[0] } : {
              ...blobAnimationProps,
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.6, 0.8, 0.6],
              backgroundColor: currentPalette.l1
            }}
            transition={{ 
              duration: 45, repeat: Infinity, ease: "linear",
              backgroundColor: { duration: cycleDuration, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] blur-[120px] md:blur-[160px]"
          />
          
          {/* Layer 2: Core Purple/Magenta Fluid - Medium Slow */}
          <motion.div 
            animate={shouldReduceMotion ? { backgroundColor: currentPalette.l2[0] } : {
              ...blobAnimationProps,
              rotate: [360, 270, 180, 90, 0],
              x: ['-5%', '10%', '-5%'],
              y: ['5%', '-10%', '5%'],
              opacity: [0.5, 0.75, 0.5],
              backgroundColor: currentPalette.l2
            }}
            transition={{ 
              duration: 35, repeat: Infinity, ease: "easeInOut",
              backgroundColor: { duration: cycleDuration, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-[10%] right-[-10%] w-[70%] h-[80%] blur-[100px] md:blur-[140px]"
          />
          
          {/* Layer 3: Cyan/Orange Accent - Drifting across */}
          <motion.div 
            animate={shouldReduceMotion ? { backgroundColor: currentPalette.l3[0] } : {
              ...blobAnimationProps,
              rotate: [0, -180, -360],
              x: ['10%', '-15%', '10%'],
              y: ['10%', '15%', '10%'],
              opacity: [0.3, 0.5, 0.3],
              backgroundColor: currentPalette.l3
            }}
            transition={{ 
              duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2,
              backgroundColor: { duration: cycleDuration, repeat: Infinity, ease: "linear" }
            }}
            className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] blur-[90px] md:blur-[120px]"
          />

          {/* Layer 4: Lavender/Coral Highlight - Breathing in and out of periphery */}
          <motion.div 
            animate={shouldReduceMotion ? { backgroundColor: currentPalette.l4[0] } : {
              ...blobAnimationProps,
              rotate: [0, 180, 360],
              x: ['-10%', '5%', '-10%'],
              y: ['-5%', '10%', '-5%'],
              opacity: [0.15, 0.4, 0.15],
              scale: [0.9, 1.1, 0.9],
              backgroundColor: currentPalette.l4
            }}
            transition={{ 
              duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5,
              backgroundColor: { duration: cycleDuration, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-[-5%] left-[20%] w-[45%] h-[45%] blur-[80px] md:blur-[100px]"
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 p-3 hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X size={32} />
        </button>

        {/* Content Container - Flex-1 to push footer to bottom */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full flex-1 max-w-2xl px-4 mt-8 md:mt-12 mb-4 md:mb-8 min-h-0">
          
          <div className="flex bg-white/5 rounded-full p-1 mb-6 md:mb-8 backdrop-blur-md border border-white/10 shadow-2xl shrink-0">
            <button
              onClick={() => { setMode('focus'); setTimeLeft(focusDuration); setIsTimerRunning(false); }}
              className={`px-8 py-2.5 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-all duration-300 ${mode === 'focus' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              Focus
            </button>
            <button
              onClick={() => { setMode('break'); setTimeLeft(breakDuration); setIsTimerRunning(false); }}
              className={`px-8 py-2.5 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-all duration-300 ${mode === 'break' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              Break
            </button>
          </div>

          <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 shrink-0">
            <button onClick={() => applyPreset(25, 5)} className={`text-[10px] md:text-xs font-geist font-bold uppercase tracking-widest px-4 md:px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 25*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>25m</button>
            <button onClick={() => applyPreset(60, 15)} className={`text-[10px] md:text-xs font-geist font-bold uppercase tracking-widest px-4 md:px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 60*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>1h</button>
            <button onClick={() => applyPreset(120, 30)} className={`text-[10px] md:text-xs font-geist font-bold uppercase tracking-widest px-4 md:px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 120*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>2h</button>
            <button onClick={() => applyPreset(180, 45)} className={`text-[10px] md:text-xs font-geist font-bold uppercase tracking-widest px-4 md:px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 180*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>3h</button>
          </div>

          {/* Huge Timer */}
          <div className="flex-1 flex items-center justify-center min-h-[150px]">
            <div className="text-[25vw] md:text-[14rem] font-geist font-black tabular-nums leading-none tracking-tighter text-white/95">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex items-center gap-8 mt-8 md:mt-12 shrink-0">
            <button 
              onClick={toggleTimer}
              className="w-20 h-20 md:w-24 md:h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-[1.03] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              {isTimerRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-14 h-14 md:w-16 md:h-16 bg-white/5 text-white/80 rounded-full flex items-center justify-center hover:bg-white/15 hover:text-white border border-white/10 transition-all"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Bottom Music Card - Fixed at bottom within flow */}
        {currentTrack && (
          <div className="relative z-20 w-[90%] max-w-lg flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-3xl backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl mb-8 md:mb-12 shrink-0">
            <div className="flex items-center gap-4 relative z-10 min-w-0">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-black/50 shrink-0">
                <img src={highResThumbnail} alt={currentTrack.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex gap-1 items-end h-4">
                      {[1,2,3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: ["20%", "100%", "20%"] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-1 bg-white rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-geist font-bold text-base md:text-lg truncate text-white">{currentTrack.title}</span>
                <span className="font-geist font-medium text-xs md:text-sm text-white/60 tracking-wide truncate">{currentTrack.artist}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2 relative z-10 shrink-0 mr-1 md:mr-2">
              <button onClick={togglePlay} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/90 hover:text-white">
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={playNext} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/90 hover:text-white">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

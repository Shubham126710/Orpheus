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

  // Decoupled vivid color palettes
  const palettes = {
    focus: { orb1: '#4f46e5', orb2: '#8b5cf6', orb3: '#c084fc' }, // Indigo, Violet, Lavender
    break: { orb1: '#fb7185', orb2: '#f43f5e', orb3: '#fb923c' }, // Rose, Pink, Orange
  };
  
  const currentPalette = palettes[mode];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-[300] bg-[#050508] text-white flex flex-col items-center justify-between overflow-hidden h-[100dvh]"
      >
        {/* Liquid Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 transition-opacity duration-1000">
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '5%', '-5%', '0%'],
              y: ['0%', '-5%', '5%', '0%'],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full blur-[140px] transition-colors duration-[2000ms]"
            style={{ backgroundColor: currentPalette.orb1 }}
          />
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '-8%', '8%', '0%'],
              y: ['0%', '8%', '-8%', '0%'],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[140px] transition-colors duration-[2000ms]"
            style={{ backgroundColor: currentPalette.orb2 }}
          />
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '10%', '-10%', '0%'],
              y: ['0%', '-10%', '10%', '0%'],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[25%] left-[25%] w-[45%] h-[45%] rounded-full blur-[140px] transition-colors duration-[2000ms] opacity-70"
            style={{ backgroundColor: currentPalette.orb3 }}
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

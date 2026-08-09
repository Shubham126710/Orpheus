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

  // Liquid color fields
  const orb1 = dominantColor;
  const orb2 = secondaryColor;
  const orb3 = `color-mix(in oklch, ${dominantColor} 60%, white 40%)`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-[300] bg-[#0a0a0c] text-white flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Liquid Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.85] mix-blend-screen transition-colors duration-1000">
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '8%', '-4%', '0%'],
              y: ['0%', '-8%', '6%', '0%'],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full blur-[100px] md:blur-[140px]"
            style={{ backgroundColor: orb1 }}
          />
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '-12%', '8%', '0%'],
              y: ['0%', '12%', '-6%', '0%'],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[100px] md:blur-[140px]"
            style={{ backgroundColor: orb2 }}
          />
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              x: ['0%', '15%', '-15%', '0%'],
              y: ['0%', '-5%', '10%', '0%'],
              scale: [1, 1.15, 0.85, 1],
            }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[25%] left-[25%] w-[45%] h-[45%] rounded-full blur-[100px] md:blur-[140px]"
            style={{ backgroundColor: orb3, opacity: 0.6 }}
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X size={32} />
        </button>

        <div className="relative z-20 flex flex-col items-center w-full max-w-2xl px-6 mt-12">
          
          <div className="flex bg-white/5 rounded-full p-1 mb-10 backdrop-blur-md border border-white/10 shadow-2xl">
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

          <div className="flex gap-4 mb-16">
            <button onClick={() => applyPreset(25, 5)} className={`text-xs font-geist font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 25*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>25m</button>
            <button onClick={() => applyPreset(60, 15)} className={`text-xs font-geist font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 60*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>1h</button>
            <button onClick={() => applyPreset(120, 30)} className={`text-xs font-geist font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 120*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>2h</button>
            <button onClick={() => applyPreset(180, 45)} className={`text-xs font-geist font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-300 ${focusDuration === 180*60 ? 'border-white/80 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white/90 hover:border-white/40 hover:bg-white/5'}`}>3h</button>
          </div>

          <div className="text-[22vw] md:text-[13rem] font-geist font-black tabular-nums leading-none tracking-tighter mb-16 text-white/95">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-8 mb-24">
            <button 
              onClick={toggleTimer}
              className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-[1.03] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              {isTimerRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-16 h-16 bg-white/5 text-white/80 rounded-full flex items-center justify-center hover:bg-white/15 hover:text-white border border-white/10 transition-all"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          {currentTrack && (
            <div className="w-full max-w-lg flex items-center justify-between p-4 bg-white/5 rounded-[2rem] backdrop-blur-2xl border border-white/10 overflow-hidden relative shadow-2xl">
              <div className="flex items-center gap-5 relative z-10">
                <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden bg-black/50 shrink-0">
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
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="font-geist font-bold text-lg truncate text-white">{currentTrack.title}</span>
                  <span className="font-geist font-medium text-sm text-white/60 tracking-wide truncate">{currentTrack.artist}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10 shrink-0 mr-2">
                <button onClick={togglePlay} className="p-3.5 hover:bg-white/10 rounded-full transition-colors text-white/90 hover:text-white">
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                </button>
                <button onClick={playNext} className="p-3.5 hover:bg-white/10 rounded-full transition-colors text-white/90 hover:text-white">
                  <SkipForward size={22} fill="currentColor" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

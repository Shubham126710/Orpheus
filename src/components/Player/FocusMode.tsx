import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, RotateCcw, SkipForward } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useThemeStore } from '@/store/useThemeStore';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FocusMode({ isOpen, onClose }: FocusModeProps) {
  const { currentTrack, isPlaying, togglePlay, playNext } = usePlayerStore();
  const { dominantColor } = useThemeStore();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-[300] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Gradient Background */}
        <div 
          className="absolute inset-0 opacity-40 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${dominantColor} 0%, transparent 70%)`,
            animation: 'pulse-glow 8s infinite alternate'
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-glow {
            0% { transform: scale(1) translate(0, 0); opacity: 0.3; }
            33% { transform: scale(1.1) translate(2%, 2%); opacity: 0.5; }
            66% { transform: scale(1.05) translate(-2%, -1%); opacity: 0.4; }
            100% { transform: scale(1.15) translate(1%, -2%); opacity: 0.6; }
          }
        `}} />

        {/* Film grain noise overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X size={32} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col items-center w-full max-w-2xl px-6">
          
          <div className="flex bg-white/10 rounded-full p-1 mb-8 backdrop-blur-md">
            <button
              onClick={() => { setMode('focus'); setTimeLeft(focusDuration); setIsTimerRunning(false); }}
              className={`px-6 py-2 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-colors ${mode === 'focus' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              Focus
            </button>
            <button
              onClick={() => { setMode('break'); setTimeLeft(breakDuration); setIsTimerRunning(false); }}
              className={`px-6 py-2 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-colors ${mode === 'break' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              Break
            </button>
          </div>

          <div className="flex gap-4 mb-12">
            <button onClick={() => applyPreset(25, 5)} className={`text-xs font-geist font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-colors ${focusDuration === 25*60 ? 'border-white text-white' : 'border-white/20 text-white/50 hover:text-white/80 hover:border-white/50'}`}>25m</button>
            <button onClick={() => applyPreset(60, 15)} className={`text-xs font-geist font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-colors ${focusDuration === 60*60 ? 'border-white text-white' : 'border-white/20 text-white/50 hover:text-white/80 hover:border-white/50'}`}>1h</button>
            <button onClick={() => applyPreset(120, 30)} className={`text-xs font-geist font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-colors ${focusDuration === 120*60 ? 'border-white text-white' : 'border-white/20 text-white/50 hover:text-white/80 hover:border-white/50'}`}>2h</button>
            <button onClick={() => applyPreset(180, 45)} className={`text-xs font-geist font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-colors ${focusDuration === 180*60 ? 'border-white text-white' : 'border-white/20 text-white/50 hover:text-white/80 hover:border-white/50'}`}>3h</button>
          </div>

          <div className="text-[20vw] md:text-[12rem] font-geist font-black tabular-nums leading-none tracking-tighter mb-12 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-6 mb-20">
            <button 
              onClick={toggleTimer}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          {currentTrack && (
            <div className="w-full flex items-center justify-between p-4 md:p-6 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg shrink-0 bg-black">
                  <img src={highResThumbnail} alt={currentTrack.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
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
                  <span className="font-geist font-black text-base md:text-lg truncate uppercase text-white drop-shadow-md">{currentTrack.title}</span>
                  <span className="font-geist font-bold text-xs md:text-sm text-white/70 tracking-widest uppercase truncate">{currentTrack.artist}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10 shrink-0">
                <button onClick={togglePlay} className="p-3 hover:bg-white/20 rounded-full transition-colors bg-white/5">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
                <button onClick={playNext} className="p-3 hover:bg-white/20 rounded-full transition-colors bg-white/5">
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

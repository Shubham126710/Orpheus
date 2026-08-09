import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, RotateCcw, SkipForward } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FocusMode({ isOpen, onClose }: FocusModeProps) {
  const { currentTrack, isPlaying, togglePlay, playNext } = usePlayerStore();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const newMode = mode === 'focus' ? 'break' : 'focus';
      setMode(newMode);
      setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
      setIsTimerRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, mode]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-[300] bg-black bg-noise text-white flex flex-col items-center justify-center overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={32} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
          
          <div className="flex bg-white/10 rounded-full p-1 mb-12 backdrop-blur-md">
            <button
              onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsTimerRunning(false); }}
              className={`px-6 py-2 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-colors ${mode === 'focus' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              Focus
            </button>
            <button
              onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsTimerRunning(false); }}
              className={`px-6 py-2 rounded-full font-geist font-bold text-sm tracking-widest uppercase transition-colors ${mode === 'break' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              Break
            </button>
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
            <div className="w-full flex items-center justify-between p-6 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                  <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
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
                <div className="flex flex-col">
                  <span className="font-geist font-black text-lg truncate w-48 md:w-64 uppercase">{currentTrack.title}</span>
                  <span className="font-geist font-bold text-xs text-white/50 tracking-widest uppercase truncate w-48">{currentTrack.artist}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={playNext} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

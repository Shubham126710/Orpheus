"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Heart, ChevronDown, Repeat, Mic2, ListMusic, Music, PlusSquare } from "lucide-react";
import Image from "next/image";
import { useThemeStore } from "@/store/useThemeStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useEffect, useState, useRef } from "react";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import PlaylistModal from "@/components/PlaylistModal";

export default function FullScreenPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious, playTrack, queue, progress, setProgress, isExpanded, setIsExpanded, currentTime, duration, setSeekTo, repeatMode, toggleRepeat, isShuffled, toggleShuffle, showLyrics, setShowLyrics } = usePlayerStore();
  const { toggleLike, isLiked: checkIsLiked } = useLibraryStore();
  const { dominantColor } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const isLightMode = dominantColor ? (() => {
    const match = dominantColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return false;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  })() : false;

  const textColor = isLightMode ? "text-black" : "text-white";
  const textMuted = isLightMode ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white";
  const bgMuted = isLightMode ? "bg-black/10 hover:bg-black/20" : "bg-white/10 hover:bg-white/20";
  const bgControls = isLightMode ? "bg-black/20" : "bg-white/20";
  const bgControlsActive = isLightMode ? "bg-black/80" : "bg-white/80";

  useEffect(() => setMounted(true), []);
  
  const VisualizerLine = ({ flip = false }: { flip?: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyser } = usePlayerStore();

    useEffect(() => {
      let animationFrameId: number;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const numPoints = 100;
      const currentPoints = new Float32Array(numPoints).fill(0);
      let time = 0;
      
      const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

      const renderFrame = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.beginPath();
        
        const centerY = rect.height / 2;
        ctx.moveTo(0, centerY);

        time += 0.05;

        if (analyser && dataArray && isPlaying) {
          analyser.getByteFrequencyData(dataArray);
          // Calculate an overall energy value for beating
          let energy = 0;
          for (let i = 0; i < dataArray.length; i++) {
             energy += dataArray[i];
          }
          
          if (energy === 0) {
             // Fallback Math visualization (CORS blocked the audio data)
             for (let i = 0; i < numPoints; i++) {
                let targetY = 0;
                const normalized = i / numPoints;
                const w1 = Math.sin(normalized * 15.3 + time * 1.7) * 0.4;
                const w2 = Math.sin(normalized * 27.8 - time * 2.3) * 0.3;
                const w3 = Math.sin(normalized * 7.1 + time * 0.8) * 0.2;
                const w4 = Math.sin(normalized * 43.5 - time * 3.1) * 0.15;
                const w5 = Math.sin(normalized * 3.14 + time * 1.1) * 0.3;
                const b1 = Math.pow(Math.sin(time * 0.8), 8) * 0.8;
                const b2 = Math.pow(Math.sin(time * 1.4 + 1), 6) * 0.6;
                const activeBeat = 1.0 + b1 + b2;
                const fizz = Math.sin(normalized * 100 + time * 10) * 0.05;
                const v = (w1 + w2 + w3 + w4 + w5 + fizz) * activeBeat;
                const dist = Math.abs(i - numPoints/2) / (numPoints/2);
                const windowMultiplier = Math.pow(Math.cos(dist * Math.PI / 2), 3);
                targetY = v * (rect.height / 2) * windowMultiplier * 1.5; 
                
                currentPoints[i] += (targetY - currentPoints[i]) * 0.2;
                const x = (i / (numPoints - 1)) * rect.width;
                const y = centerY + currentPoints[i];
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
             }
          } else {
             const averageEnergy = energy / dataArray.length;
             const activeBeat = 1.0 + (averageEnergy / 255) * 1.5;

             for (let i = 0; i < numPoints; i++) {
               // Map the 100 visual points to the frequency bins (use lower 70% of frequencies)
            const binIndex = Math.floor((i / numPoints) * dataArray.length * 0.7);
            const freqVal = dataArray[binIndex] / 255.0; // 0 to 1
            
            // Add some base fizz to make it look alive even in quiet parts
            const fizz = Math.sin(i * 100 + time * 10) * 0.02;
            const v = (freqVal + fizz) * activeBeat;

            // Window function
            const dist = Math.abs(i - numPoints/2) / (numPoints/2);
            const windowMultiplier = Math.pow(Math.cos(dist * Math.PI / 2), 3);
            
            let targetY = v * (rect.height / 2) * windowMultiplier * 1.5;
            
            // Mirror logic since frequency data doesn't naturally have negative values
            if (i % 2 === 0) targetY = -targetY;

            currentPoints[i] += (targetY - currentPoints[i]) * 0.2;
            
            const x = (i / (numPoints - 1)) * rect.width;
            const y = centerY + currentPoints[i];
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
      } else {
        // Fallback Math visualization
        for (let i = 0; i < numPoints; i++) {
          let targetY = 0;

            if (isPlaying) {
              const normalized = i / numPoints;
              const w1 = Math.sin(normalized * 15.3 + time * 1.7) * 0.4;
              const w2 = Math.sin(normalized * 27.8 - time * 2.3) * 0.3;
              const w3 = Math.sin(normalized * 7.1 + time * 0.8) * 0.2;
              const w4 = Math.sin(normalized * 43.5 - time * 3.1) * 0.15;
              const w5 = Math.sin(normalized * 3.14 + time * 1.1) * 0.3;
              
              const b1 = Math.pow(Math.sin(time * 0.8), 8) * 0.8;
              const b2 = Math.pow(Math.sin(time * 1.4 + 1), 6) * 0.6;
              const activeBeat = 1.0 + b1 + b2;

              const fizz = Math.sin(normalized * 100 + time * 10) * 0.05;
              
              const v = (w1 + w2 + w3 + w4 + w5 + fizz) * activeBeat;

              const dist = Math.abs(i - numPoints/2) / (numPoints/2);
              const windowMultiplier = Math.pow(Math.cos(dist * Math.PI / 2), 3);
              
              targetY = v * (rect.height / 2) * windowMultiplier * 1.5; 
            }

            currentPoints[i] += (targetY - currentPoints[i]) * 0.2;
            
            const x = (i / (numPoints - 1)) * rect.width;
            const y = centerY + currentPoints[i];
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        }

        ctx.strokeStyle = isLightMode ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2.0;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        ctx.shadowBlur = 6;
        ctx.shadowColor = isLightMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.6)";
        
        ctx.stroke();

        animationFrameId = requestAnimationFrame(renderFrame);
      };

      renderFrame();

      return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, isLightMode, analyser]);

    return (
      <div className={`w-28 md:w-36 h-16 flex items-center justify-center ${flip ? 'scale-x-[-1]' : ''}`}>
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };

  const track = currentTrack || {
    id: "placeholder",
    title: "No track playing",
    artist: "Select a song",
    album: "",
    thumbnail: "/placeholder-art.jpg", 
    duration: 0
  };

  const isLiked = checkIsLiked(track.id);

  // Upgrade to max-res thumbnail
  const highResThumbnail = track.thumbnail
    ? track.thumbnail.includes("lh3.googleusercontent.com")
      ? track.thumbnail.replace(/=w\d+-h\d+.*/, '=w1200-h1200-l90-rj')
      : track.thumbnail.replace("hqdefault.jpg", "maxresdefault.jpg")
    : "/placeholder-art.jpg";

  const [showQueue, setShowQueue] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useColorExtraction(highResThumbnail);

  const [lyrics, setLyrics] = useState<string | null>(null);
  const [syncedLyrics, setSyncedLyrics] = useState<{time: number, text: string}[] | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showLyrics && track.title && track.title !== "No track playing") {
      setLyricsLoading(true);
      const artist = encodeURIComponent(track.artist.replace(/ - Topic/g, ""));
      const title = encodeURIComponent(track.title);
      
      // Use lrclib.net for better multi-language coverage (Hindi etc.) and synchronized LRC
      fetch(`https://lrclib.net/api/get?artist_name=${artist}&track_name=${title}`)
        .then(res => res.json())
        .then(data => {
          if (data.syncedLyrics) {
            const lines = data.syncedLyrics.split('\n');
            const parsed = lines.map((line: string) => {
               const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
               if (match) {
                 const min = parseInt(match[1]);
                 const sec = parseFloat(match[2]);
                 return { time: min * 60 + sec, text: match[3].trim() };
               }
               return null;
            }).filter((l: any) => l !== null);
            setSyncedLyrics(parsed);
            setLyrics(null);
          } else if (data.plainLyrics) {
            setLyrics(data.plainLyrics);
            setSyncedLyrics(null);
          } else {
            setLyrics("No lyrics found for this track.");
            setSyncedLyrics(null);
          }
          setLyricsLoading(false);
        })
        .catch(() => {
          setLyrics("Failed to load lyrics. They might not be available for this song.");
          setSyncedLyrics(null);
          setLyricsLoading(false);
        });
    }
  }, [showLyrics, track.title, track.artist]);

  const activeLineIndex = syncedLyrics ? syncedLyrics.findIndex((line, i) => {
    const nextLine = syncedLyrics[i + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  }) : -1;

  useEffect(() => {
    if (syncedLyrics && activeLineIndex !== -1 && lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLineIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLineIndex, syncedLyrics]);

  // Dynamically update Safari's theme-color to match the player background
  // This prevents the jarring black rectangle at the bottom of the screen on mobile Safari
  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    if (isExpanded) {
      metaThemeColor.setAttribute('content', dominantColor || '#2A201A');
    } else {
      metaThemeColor.setAttribute('content', '#121212'); // Default app background
    }

    return () => {
      metaThemeColor?.setAttribute('content', '#121212');
    };
  }, [isExpanded, dominantColor]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !track) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const boundedPercent = Math.max(0, Math.min(100, percent));
    
    // Optimistic UI update
    setProgress(boundedPercent);
    
    // Seek the actual audio engine safely
    const totalTime = duration || track.duration || 0;
    if (totalTime) {
      setSeekTo((boundedPercent / 100) * totalTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] flex flex-col overflow-y-auto overflow-x-hidden"
          style={{ backgroundColor: dominantColor ? dominantColor : '#2A201A' }}
        >
          {/* Noise Overlay for retro feel */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          <div className="relative z-10 flex flex-col h-[100dvh] px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto w-full justify-between">
            {/* Top Area (Header & Title) */}
            <div className="w-full flex flex-col items-center shrink-0">
              <button 
                onClick={() => setIsExpanded(false)}
                className={`absolute top-6 left-4 md:top-10 md:left-8 w-10 h-10 flex items-center justify-center transition-colors ${textMuted}`}
              >
                <ChevronDown size={28} strokeWidth={1.5} />
              </button>
              
              <div className="w-full max-w-xl text-center px-12 mt-2">
                <h2 className={`font-geist font-black text-2xl md:text-3xl tracking-widest uppercase ${textColor}`}>
                  {track.title}
                </h2>
                <p className={`font-geist text-sm md:text-base font-medium tracking-[0.2em] uppercase mt-2 ${isLightMode ? 'text-black/60' : 'text-white/60'}`}>
                  {track.artist}
                </p>
              </div>
            </div>

            {/* Center Art Area with Vertical Visualizers or Lyrics */}
            <div className="flex-1 flex items-start md:items-center justify-center w-full relative min-h-0 pt-2 pb-6 md:py-10">
              <div className="relative flex items-center justify-center w-full h-full max-w-5xl">
                
                {/* Left Visualizer */}
                <motion.div 
                  className="hidden md:block z-10"
                  animate={{
                    opacity: (showLyrics || showQueue) ? 0.6 : 1,
                    x: (showLyrics || showQueue) ? "-25vw" : 0
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <VisualizerLine />
                </motion.div>

                {/* Background Layer (Art only, gets blurred on lyrics or queue) */}
                <motion.div 
                  className="relative w-[85vw] h-[85vw] max-w-[380px] max-h-[380px] md:w-auto md:h-full md:aspect-square bg-white p-2 md:p-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex-shrink-0 mx-6 md:mx-12 z-0"
                  animate={{ 
                    scale: (showLyrics || showQueue) ? 0.8 : isPlaying ? 1 : 0.97,
                    opacity: (showLyrics || showQueue) ? 0.15 : 1,
                    filter: (showLyrics || showQueue) ? "blur(20px)" : "blur(0px)",
                    marginTop: (showLyrics || showQueue) ? "0px" : "2vh" // Add a tiny bit of top margin on mobile when playing
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="relative w-full h-full overflow-hidden bg-black">
                    <Image
                      src={highResThumbnail}
                      alt={track.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </motion.div>

                {/* Right Visualizer */}
                <motion.div 
                  className="hidden md:block z-10"
                  animate={{
                    opacity: (showLyrics || showQueue) ? 0.6 : 1,
                    x: (showLyrics || showQueue) ? "25vw" : 0
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <VisualizerLine flip={true} />
                </motion.div>

                {/* Foreground Layer (Lyrics) */}
                <AnimatePresence>
                  {showLyrics && (
                    <motion.div 
                      key="lyrics"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-0 z-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-start py-[35vh] px-4 md:px-12 mx-auto max-w-4xl">
                        {lyricsLoading ? (
                          <div className={`${isLightMode ? 'text-black/50' : 'text-white/50'} animate-pulse font-geist text-lg tracking-widest uppercase mt-[20vh]`}>
                            Searching for lyrics...
                          </div>
                        ) : syncedLyrics ? (
                          <div ref={lyricsContainerRef} className="flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full">
                            {syncedLyrics.map((line, i) => {
                              const isActive = i === activeLineIndex;
                              const isPassed = i < activeLineIndex;
                              
                              return (
                                <motion.div
                                  key={i}
                                  animate={{
                                    scale: isActive ? 1.05 : 1,
                                    opacity: isActive ? 1 : isPassed ? 0.3 : 0.5,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className={`text-center w-full px-4 ${isActive ? 'font-black' : 'font-bold'}`}
                                >
                                  <p className={`font-geist transition-colors duration-300 ${
                                    isActive ? `text-3xl md:text-5xl ${textColor} ${isLightMode ? 'drop-shadow-[0_0_20px_rgba(0,0,0,0.2)]' : 'drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]'}` : `text-2xl md:text-3xl ${isLightMode ? 'text-black/70' : 'text-white/70'}`
                                  }`}>
                                    {line.text || "♪"}
                                  </p>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={`${textColor} text-center whitespace-pre-wrap font-geist leading-relaxed text-xl md:text-2xl py-4 mt-[10vh]`}>
                            {lyrics || (
                              <>
                                <p className={`text-2xl md:text-3xl font-bold mb-2 ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>No Lyrics Found</p>
                                <p className={`text-sm tracking-widest uppercase ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>Instrumental or not available</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Context Queue Overlay */}
                <AnimatePresence>
                  {showQueue && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className={`absolute inset-x-4 bottom-24 md:inset-x-8 md:bottom-32 top-32 md:top-40 rounded-3xl backdrop-blur-2xl border flex flex-col overflow-hidden shadow-2xl ${isLightMode ? 'bg-white/40 border-black/10' : 'bg-black/40 border-white/10'}`}
                    >
                      <div className={`p-6 md:p-8 flex items-center gap-3 border-b ${isLightMode ? 'border-black/10' : 'border-white/10'} shrink-0`}>
                        <ListMusic className={textColor} />
                        <h3 className={`font-geist font-black text-xl tracking-widest uppercase ${textColor}`}>Up Next</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
                        {queue.map((t, index) => {
                          const isPlayingTrack = t.id === currentTrack?.id;
                          return (
                            <div 
                              key={`${t.id}-${index}`}
                              onClick={() => playTrack(t, queue)}
                              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors ${isPlayingTrack ? (isLightMode ? 'bg-black/10' : 'bg-white/10') : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                            >
                              {isPlayingTrack ? (
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${textColor}`} />
                                </div>
                              ) : (
                                <span className={`font-geist text-xs font-bold w-4 text-center ${isLightMode ? 'text-black/30' : 'text-white/30'} shrink-0`}>
                                  {index + 1}
                                </span>
                              )}
                              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0">
                                <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className={`font-geist font-bold text-sm md:text-base truncate ${textColor}`}>
                                  {t.title}
                                </span>
                                <span className={`font-geist text-xs md:text-sm truncate ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>
                                  {t.artist}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Bottom Controls Area */}
            <div className="w-full max-w-xl mx-auto flex flex-col gap-6 md:gap-8 shrink-0 pb-4 md:pb-8">
              
              {/* Progress Bar */}
              <div className="flex items-center gap-4 w-full">
                <span className={`font-geist text-xs font-medium tabular-nums w-10 text-right ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>
                  {formatTime(currentTime)}
                </span>
                
                <div className="flex-1 group cursor-pointer py-2" ref={progressRef} onClick={handleSeek}>
                  <div className={`w-full h-1.5 md:h-2 rounded-full overflow-hidden relative ${bgControls}`}>
                    <div 
                      className={`absolute top-0 left-0 bottom-0 rounded-full ${bgControlsActive}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <span className={`font-geist text-xs font-medium tabular-nums w-10 ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>
                  {formatTime(duration || track.duration || 0)}
                </span>
              </div>

              {/* Media Controls (All in one row) */}
              <div className="flex items-center justify-between w-full mt-2">
                
                {/* Playlist & Like Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                  <button 
                    onClick={() => setShowPlaylistModal(true)} 
                    className={`transition-transform hover:scale-110 p-2 ${textMuted}`}
                  >
                    <PlusSquare size={22} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => toggleLike(track)} 
                    className={`transition-transform hover:scale-110 p-2 ${isLiked ? 'text-red-500' : textMuted}`}
                  >
                    <Heart size={22} strokeWidth={2} className={isLiked ? "fill-current" : ""} />
                  </button>
                </div>
                <PlaylistModal track={track} isOpen={showPlaylistModal} onClose={() => setShowPlaylistModal(false)} />
                
                {/* Shuffle Button */}
                <button 
                  onClick={toggleShuffle} 
                  className={`transition-colors p-2 hidden sm:block ${isShuffled ? textColor : textMuted}`}
                >
                  <Shuffle size={20} strokeWidth={2} />
                </button>
                
                {/* Main Playback Area */}
                <div className="flex items-center gap-6 md:gap-10 mx-auto">
                  <button onClick={playPrevious} className={`transition-transform hover:scale-110 p-2 ${textColor}`}>
                    <SkipBack size={28} fill="currentColor" />
                  </button>

                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] ${isLightMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {isPlaying ? (
                      <Pause size={28} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                    )}
                  </button>

                  <button onClick={playNext} className={`transition-transform hover:scale-110 p-2 ${textColor}`}>
                    <SkipForward size={28} fill="currentColor" />
                  </button>
                </div>

                {/* Repeat Button */}
                <button 
                  onClick={toggleRepeat} 
                  className={`transition-colors p-2 hidden sm:block ${repeatMode !== 'off' ? textColor : textMuted}`}
                >
                  <Repeat size={20} strokeWidth={2} />
                  {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-white text-black rounded-full w-4 h-4 flex items-center justify-center">1</span>}
                </button>

                {/* Lyrics Button */}
                <button 
                  onClick={() => {
                    setShowQueue(false);
                    setShowLyrics(!showLyrics);
                  }}
                  className={`transition-colors hover:scale-110 p-2 ${showLyrics ? textColor : textMuted}`}
                >
                  <Mic2 size={22} strokeWidth={2} />
                </button>
                
                {/* Queue Button */}
                <button 
                  onClick={() => {
                    setShowLyrics(false);
                    setShowQueue(!showQueue);
                  }}
                  className={`transition-colors hover:scale-110 p-2 ${showQueue ? textColor : textMuted}`}
                >
                  <ListMusic size={22} strokeWidth={2} />
                </button>
                
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import YouTube, { YouTubePlayer } from "react-youtube";

export default function AudioEngine() {
  const { currentTrack, isPlaying, setIsPlaying, setProgress, setCurrentTime, setDuration, seekTo, setSeekTo, playNext, isUsingNative } = usePlayerStore();
  
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const isScrubbing = useRef(false);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
    }
  }, []);

  const handleReady = (event: any) => {
    setPlayer(event.target);
    // Expose to Zustand for synchronous triggering on user clicks
    usePlayerStore.getState().setYtPlayer(event.target);
  };

  const handleStateChange = (event: any) => {
    // PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    const state = event.data;
    const storeState = usePlayerStore.getState();
    
    // Ignore YouTube state changes if we are using native audio
    if (storeState.isUsingNative && state !== 1) {
       return;
    }
    
    if (state === 1) { // PLAYING
      setIsPlaying(true);
      if (player) {
        setDuration(player.getDuration());
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    } else if (state === 2) { // PAUSED
      // If YouTube internally paused the video (due to screen lock / visibility change)
      // but the user didn't explicitly pause it, force it back to playing immediately!
      if (storeState.isPlaying) {
        console.log("YouTube auto-paused, forcing play!");
        event.target.playVideo();
      } else {
        setIsPlaying(false);
      }
    } else if (state === 0) { // ENDED
      playNext();
    }
  };

  const handleError = () => {
    console.warn("YouTube Player error encountered. Skipping to next track.");
    playNext();
  };

  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Expose silent audio to global store on mount
  useEffect(() => {
    if (silentAudioRef.current) {
      const audioEl = silentAudioRef.current;
      audioEl.addEventListener('ended', () => {
        if (!audioEl.src.startsWith('data:')) {
          usePlayerStore.getState().playNext();
        }
      });
      usePlayerStore.getState().setSilentAudio(audioEl);
      
      try {
        // Detect iOS (including iPadOS) - iOS aggressively suspends Web Audio API in the background,
        // which completely silences the <audio> element if it's routed through MediaElementSource.
        const isIOS = typeof window !== 'undefined' && 
          (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
          
        if (!isIOS) {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          const source = audioCtx.createMediaElementSource(audioEl);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          usePlayerStore.getState().setAnalyser(analyser);
          
          // Add a play listener to resume context
          audioEl.addEventListener('play', () => {
            if (audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
          });
        } else {
          console.log("iOS detected: Bypassing Web Audio API to preserve background playback.");
        }
      } catch (e) {
        console.warn("Web Audio API setup failed:", e);
      }
    }
  }, []);

  // The isPlaying state is now synced synchronously in the Zustand store (usePlayerStore.ts)
  // to comply with strict iOS Safari autoplay policies. Do not add async playVideo calls here.

  // Global time polling interval independent of YouTube state
  useEffect(() => {
    const interval = setInterval(() => {
      const state = usePlayerStore.getState();
      if (!state.isPlaying || isScrubbing.current) return;
      
      if (state.isUsingNative && state.silentAudio) {
         const time = state.silentAudio.currentTime;
         const dur = state.silentAudio.duration;
         if (dur > 0) {
            setCurrentTime(time);
            setProgress((time / dur) * 100);
         }
      } else if (player && player.getCurrentTime) {
         // YouTube polling
         const time = player.getCurrentTime();
         const dur = player.getDuration();
         if (dur > 0) {
            setCurrentTime(time);
            setProgress((time / dur) * 100);
         }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [player, setCurrentTime, setProgress]);

  // Handle seeking from UI
  useEffect(() => {
    if (seekTo !== null && player) {
      isScrubbing.current = true;
      const state = usePlayerStore.getState();
      
      if (state.isUsingNative && state.silentAudio) {
        state.silentAudio.currentTime = seekTo;
        setCurrentTime(seekTo);
        if (state.silentAudio.duration > 0) {
           setProgress((seekTo / state.silentAudio.duration) * 100);
        }
      } else {
        player.seekTo(seekTo, true);
        setCurrentTime(seekTo);
        if (player.getDuration() > 0) {
           setProgress((seekTo / player.getDuration()) * 100);
        }
      }
      
      // Brief delay to prevent jitter
      setTimeout(() => {
        isScrubbing.current = false;
      }, 500);
      setSeekTo(null);
    }
  }, [seekTo, setSeekTo, player, setCurrentTime, setProgress]);

  // Media Session Handlers
  useEffect(() => {
    if ('mediaSession' in navigator) {
      // Let iOS natively handle Play/Pause for the underlying video tag so the Lock Screen workaround functions.
      // We only intercept next/previous tracks.
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        usePlayerStore.getState().playPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        usePlayerStore.getState().playNext();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        if (player) {
          const newTime = Math.max(player.getCurrentTime() - skipTime, 0);
          player.seekTo(newTime, true);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        if (player) {
          const newTime = Math.min(player.getCurrentTime() + skipTime, player.getDuration());
          player.seekTo(newTime, true);
        }
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null && player) {
          player.seekTo(details.seekTime, true);
        }
      });
    }
  }, [player, setIsPlaying]);

  // Update Media Session Metadata
  useEffect(() => {
    if (currentTrack && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || 'Orpheus',
        artwork: [
          { src: currentTrack.thumbnail, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.thumbnail, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.thumbnail, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.thumbnail, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.thumbnail, sizes: '384x384', type: 'image/jpeg' },
          { src: currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    } else if (!currentTrack && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
    }
  }, [currentTrack]);

  return (
    <div className="fixed top-0 left-0 w-8 h-8 z-[9999] opacity-[0.01] overflow-hidden pointer-events-none">
      {/* 
        Safari rigorously blocks playback for iframes it considers hidden (opacity: 0, display: none, w/h 0, or deeply negative z-index).
        We place it fixed at the top left, tiny, and almost completely transparent.
        This fools Safari into thinking it's a visible element on screen, allowing synchronous playback.
      */}
      {!isUsingNative && (
        <YouTube
          videoId="dQw4w9WgXcQ" // Dummy ID. We strictly control playback via the global ytPlayer API synchronously.
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
              playsinline: 1, // CRITICAL for iOS Safari to play without forcing fullscreen video
              origin: typeof window !== 'undefined' ? window.location.origin : ''
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
        />
      )}
      {/* Silent Audio Hack to keep Safari awake in the background, also plays real track on iOS */}
      <audio 
        ref={silentAudioRef}
        crossOrigin="anonymous"
        loop
        playsInline
        src="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEyLjEwMAAAAAAAAAAAAAAA//OEXAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" 
      />
    </div>
  );
}

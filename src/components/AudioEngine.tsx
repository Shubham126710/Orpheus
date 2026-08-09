"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import YouTube from "react-youtube";
import { YouTubePlaybackProvider } from "@/lib/playback/YouTubePlaybackProvider";
import { DirectAudioPlaybackProvider } from "@/lib/playback/DirectAudioPlaybackProvider";

export default function AudioEngine() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    setProgress, 
    setCurrentTime, 
    setDuration, 
    seekTo, 
    setSeekTo, 
    playNext, 
    registerProvider, 
    getActiveProvider 
  } = usePlayerStore();
  
  const [isIOS, setIsIOS] = useState(false);
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
    const ytProvider = new YouTubePlaybackProvider(event.target);
    registerProvider(ytProvider);
  };

  const handleStateChange = (event: any) => {
    // PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    const state = event.data;
    const storeState = usePlayerStore.getState();
    const activeProvider = storeState.getActiveProvider();
    
    // Ignore YouTube state changes if we are using the direct audio provider
    if (activeProvider?.id === 'direct' && state !== 1) {
       return;
    }
    
    if (state === 1) { // PLAYING
      setIsPlaying(true);
      if (activeProvider) {
        setDuration(activeProvider.getDuration());
      }
      if ('mediaSession' in navigator && activeProvider?.capabilities.supportsMediaSession) {
        navigator.mediaSession.playbackState = 'playing';
      }
    } else if (state === 2) { // PAUSED
      // If YouTube internally paused the video (due to screen lock / visibility change)
      // but the user didn't explicitly pause it, force it back to playing immediately!
      if (storeState.isPlaying && activeProvider?.id === 'youtube') {
        console.log("YouTube auto-paused, forcing play!");
        activeProvider.play();
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

  // Initialize Direct Audio Provider and Web Audio API
  useEffect(() => {
    if (silentAudioRef.current) {
      const audioEl = silentAudioRef.current;
      
      const directProvider = new DirectAudioPlaybackProvider(audioEl);
      usePlayerStore.getState().registerProvider(directProvider);
      
      audioEl.addEventListener('ended', () => {
        if (!audioEl.src.startsWith('data:')) {
          usePlayerStore.getState().playNext();
        }
      });
      
      try {
        // Detect iOS (including iPadOS) - iOS aggressively suspends Web Audio API in the background
        const isIOSDevice = typeof window !== 'undefined' && 
          (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
        setIsIOS(isIOSDevice);
        
        if (!isIOSDevice) {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          const source = audioCtx.createMediaElementSource(audioEl);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          usePlayerStore.getState().setAnalyser(analyser);
          
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

  // Global time polling interval decoupled from specific implementations
  useEffect(() => {
    const interval = setInterval(() => {
      const storeState = usePlayerStore.getState();
      const activeProvider = storeState.getActiveProvider();
      
      if (!storeState.isPlaying || isScrubbing.current || !activeProvider) return;
      
      if (activeProvider.capabilities.supportsProgress) {
        const time = activeProvider.getCurrentTime();
        const dur = activeProvider.getDuration();
        if (dur > 0) {
          setCurrentTime(time);
          setProgress((time / dur) * 100);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setCurrentTime, setProgress]);

  // Handle seeking from UI
  useEffect(() => {
    if (seekTo !== null) {
      isScrubbing.current = true;
      const storeState = usePlayerStore.getState();
      const activeProvider = storeState.getActiveProvider();
      
      if (activeProvider && activeProvider.capabilities.supportsSeeking) {
        activeProvider.seekTo(seekTo);
        setCurrentTime(seekTo);
        const dur = activeProvider.getDuration();
        if (dur > 0) {
           setProgress((seekTo / dur) * 100);
        }
      }
      
      setTimeout(() => {
        isScrubbing.current = false;
      }, 500);
      setSeekTo(null);
    }
  }, [seekTo, setSeekTo, setCurrentTime, setProgress]);

  // Media Session Handlers
  useEffect(() => {
    const storeState = usePlayerStore.getState();
    const activeProvider = storeState.getActiveProvider();

    if ('mediaSession' in navigator) {
      // If the current provider explicitly states it does NOT support media session (e.g. YouTube on mobile lockscreen)
      // we do NOT bind the handlers so we don't present fake controls to the OS.
      if (!activeProvider || !activeProvider.capabilities.supportsMediaSession) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('seekto', null);
        return;
      }

      navigator.mediaSession.setActionHandler('play', () => {
        const store = usePlayerStore.getState();
        if (!store.isPlaying) store.togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        const store = usePlayerStore.getState();
        if (store.isPlaying) store.togglePlay();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        usePlayerStore.getState().playPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        usePlayerStore.getState().playNext();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        const p = usePlayerStore.getState().getActiveProvider();
        if (p && p.capabilities.supportsSeeking) {
          const newTime = Math.max(p.getCurrentTime() - skipTime, 0);
          p.seekTo(newTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        const p = usePlayerStore.getState().getActiveProvider();
        if (p && p.capabilities.supportsSeeking) {
          const newTime = Math.min(p.getCurrentTime() + skipTime, p.getDuration());
          p.seekTo(newTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        const p = usePlayerStore.getState().getActiveProvider();
        if (details.seekTime !== undefined && details.seekTime !== null && p && p.capabilities.supportsSeeking) {
          p.seekTo(details.seekTime);
        }
      });
    }
  }, [setIsPlaying, getActiveProvider]);

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
      <YouTube
        videoId="dQw4w9WgXcQ" // Dummy ID. We strictly control playback via the global API synchronously.
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
      
      {/* 
        Silent Audio Hack to keep Safari awake in the background if possible.
        Also acts as the mount point for the DirectAudioPlaybackProvider future-proofing.
      */}
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

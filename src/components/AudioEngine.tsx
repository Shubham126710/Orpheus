"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function AudioEngine() {
  const { currentTrack, isPlaying, setIsPlaying, setProgress, setCurrentTime, setDuration, seekTo, setSeekTo, playNext } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
    }
  }, []);

  // Initialize audio element and Web Audio API
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048; // High resolution for time-domain waveform

        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        // Expose globally for the visualizer component to read without React state overhead
        (window as any).audioAnalyser = analyser;
        (window as any).audioContext = audioCtx;
      } catch (err) {
        console.warn("Web Audio API could not be initialized", err);
      }
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      // Progress as percentage
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      console.warn("Audio playback error encountered. Skipping to next track.");
      playNext();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Register Media Session Action Handlers
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play().catch(console.error);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        usePlayerStore.getState().playPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        usePlayerStore.getState().playNext();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          audio.currentTime = details.seekTime;
        }
      });
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [setProgress, setIsPlaying, playNext]);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // Fetch via proxy stream
      audioRef.current.src = `/api/stream?id=${currentTrack.id}`;
      
      // Update Media Session metadata
      if ('mediaSession' in navigator) {
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
      }

      if (isPlaying) {
        audioRef.current.play().then(() => {
          // Resume AudioContext after a user gesture allows playback
          const audioCtx = (window as any).audioContext;
          if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
        }).catch(e => console.error("Audio playback failed", e));
      }
    } else if (!currentTrack && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
      }
    }
  }, [currentTrack]); // We omit isPlaying to avoid restarting track on pause/play

  // Handle play/pause state from UI
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().then(() => {
        const audioCtx = (window as any).audioContext;
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }).catch(e => console.error("Playback error:", e));
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle seeking from UI
  useEffect(() => {
    if (seekTo !== null && audioRef.current) {
      audioRef.current.currentTime = seekTo;
      setSeekTo(null);
    }
  }, [seekTo, setSeekTo]);

  return null; // Invisible component
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import YouTube, { YouTubePlayer } from "react-youtube";

export default function AudioEngine() {
  const { currentTrack, isPlaying, setIsPlaying, setProgress, setCurrentTime, setDuration, seekTo, setSeekTo, playNext } = usePlayerStore();
  
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
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
    
    if (state === 1) { // PLAYING
      setIsPlaying(true);
      if (player) {
        setDuration(player.getDuration());
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
      
      // Start time polling
      if (!timeUpdateInterval.current) {
        timeUpdateInterval.current = setInterval(() => {
          if (player && player.getCurrentTime && !isScrubbing.current) {
            const time = player.getCurrentTime();
            const dur = player.getDuration();
            if (dur > 0) {
              setCurrentTime(time);
              setProgress((time / dur) * 100);
            }
          }
        }, 500);
      }
    } else if (state === 2) { // PAUSED
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
      // Stop time polling
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
        timeUpdateInterval.current = null;
      }
    } else if (state === 0) { // ENDED
      // Stop time polling
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
        timeUpdateInterval.current = null;
      }
      playNext();
    }
  };

  const handleError = () => {
    console.warn("YouTube Player error encountered. Skipping to next track.");
    playNext();
  };

  // Sync isPlaying state down to player for programmatic triggers outside of store actions
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player]);

  // Handle seeking from UI
  useEffect(() => {
    if (seekTo !== null && player) {
      isScrubbing.current = true;
      player.seekTo(seekTo, true);
      setCurrentTime(seekTo);
      if (player.getDuration() > 0) {
         setProgress((seekTo / player.getDuration()) * 100);
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
      navigator.mediaSession.setActionHandler('play', () => {
        if (player) player.playVideo();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (player) player.pauseVideo();
        setIsPlaying(false);
      });
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

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
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
    <div className="fixed inset-0 pointer-events-none opacity-0 z-[-1]">
      {/* 
        Safari blocks playback for 0x0 or display:none iframes. 
        We use a full-size iframe that is visually hidden and non-interactive.
        We render it unconditionally so the IFrame API is loaded before user click.
      */}
      <YouTube
        videoId={currentTrack?.id || 'dQw4w9WgXcQ'} // Dummy ID to initialize player
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
    </div>
  );
}

import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  duration: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  seekTo: number | null;
  // UI States
  volume: number;
  isExpanded: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  showLyrics: boolean;

  // Actions
  playTrack: (track: Track, contextQueue?: Track[]) => void;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setSeekTo: (time: number | null) => void;
  setVolume: (volume: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setShowLyrics: (show: boolean) => void;
  playPlaylistShuffled: (tracks: Track[]) => void;
  ytPlayer: any | null;
  setYtPlayer: (player: any) => void;
  silentAudio: HTMLAudioElement | null;
  setSilentAudio: (audio: HTMLAudioElement) => void;
  isUsingNative: boolean;
  setIsUsingNative: (val: boolean) => void;
  analyser: AnalyserNode | null;
  setAnalyser: (analyser: AnalyserNode) => void;
  fetchStreamUrl: (videoId: string) => Promise<void>;
}

import { useLibraryStore } from './useLibraryStore';

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  seekTo: null,
  volume: 1,
  isExpanded: false,
  repeatMode: 'off',
  isShuffled: false,
  showLyrics: false,
  ytPlayer: null,
  setYtPlayer: (player) => set({ ytPlayer: player }),
  silentAudio: null,
  setSilentAudio: (audio) => set({ silentAudio: audio }),
  
  isUsingNative: false,
  setIsUsingNative: (val) => set({ isUsingNative: val }),
  
  analyser: null,
  setAnalyser: (analyser) => set({ analyser }),

  playTrack: (track, contextQueue) => {
    // Add to recently played automatically
    useLibraryStore.getState().addToRecent(track);
    
    // Reset native flag on new track
    set({ isUsingNative: false });
    
    // Synchronously trigger YouTube player for strict mobile Safari autoplay policies
    const { ytPlayer, silentAudio } = get();
    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(track.id);
      if (ytPlayer.playVideo) ytPlayer.playVideo();
    }
    
    // Play silent audio immediately to keep the audio session alive
    if (silentAudio) {
      silentAudio.loop = true;
      silentAudio.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEyLjEwMAAAAAAAAAAAAAAA//OEXAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
      silentAudio.play().catch(e => console.log("Silent audio blocked:", e));
    }
    
    // Fetch real stream for background
    get().fetchStreamUrl(track.id);
    
    set((state) => {
      let newQueue = state.queue;
      if (contextQueue) {
        const idx = contextQueue.findIndex(t => t.id === track.id);
        if (idx !== -1) {
          newQueue = contextQueue.slice(idx + 1);
        } else {
          newQueue = contextQueue;
        }
      }
      return { 
        currentTrack: track, 
        queue: newQueue, 
        isPlaying: true, 
        progress: 0, 
        currentTime: 0, 
        duration: track.duration || 0, 
        isExpanded: true 
      };
    });
  },

  fetchStreamUrl: async (videoId: string) => {
    try {
      const { silentAudio } = get();
      if (!silentAudio) return;

      // 4-Stage Failover Pipeline
      const failovers = [
        async () => {
          const res = await fetch(`/api/stream?id=${videoId}`);
          if (!res.ok) throw new Error("Vercel API failed");
          const data = await res.json();
          if (!data.url) throw new Error("No URL from Vercel");
          return data.url;
        },
        async () => {
          const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
          if (!res.ok) throw new Error("Piped 1 failed");
          const data = await res.json();
          const audio = data.audioStreams.find((s: any) => s.mimeType.startsWith('audio/mp4') || s.mimeType.startsWith('audio/webm'));
          if (!audio) throw new Error("No audio from Piped 1");
          return audio.url;
        },
        async () => {
          const res = await fetch(`https://pipedapi.syncpundit.io/streams/${videoId}`);
          if (!res.ok) throw new Error("Piped 2 failed");
          const data = await res.json();
          const audio = data.audioStreams.find((s: any) => s.mimeType.startsWith('audio/mp4') || s.mimeType.startsWith('audio/webm'));
          if (!audio) throw new Error("No audio from Piped 2");
          return audio.url;
        },
        async () => {
          const res = await fetch(`https://api.piped.projectsegfau.lt/streams/${videoId}`);
          if (!res.ok) throw new Error("Piped 3 failed");
          const data = await res.json();
          const audio = data.audioStreams.find((s: any) => s.mimeType.startsWith('audio/mp4') || s.mimeType.startsWith('audio/webm'));
          if (!audio) throw new Error("No audio from Piped 3");
          return audio.url;
        }
      ];

      // Try to get a URL using the failovers
      let streamUrl = null;
      for (const failover of failovers) {
        try {
          streamUrl = await failover();
          if (streamUrl) break; // Found a working URL!
        } catch (err) {
          console.warn("Failover skipped due to error:", err);
        }
      }

      if (streamUrl) {
        silentAudio.loop = false;
        silentAudio.src = streamUrl;
        
        // CRITICAL: Do NOT unmount or pause the YouTube iframe immediately!
        // iOS PWA standalone mode will instantly suspend the background process if there is a gap in audio output.
        // We must wait for the native audio to fully buffer and actually start playing before handing off.
        const onPlaying = () => {
          set({ isUsingNative: true });
          silentAudio.removeEventListener('playing', onPlaying);
        };
        silentAudio.addEventListener('playing', onPlaying);
        
        // Also handle errors so we don't get stuck
        silentAudio.addEventListener('error', () => {
          silentAudio.removeEventListener('playing', onPlaying);
          console.error("Native audio failed to load (IP block or 403 Forbidden). Gracefully degrading to YouTube iframe only.");
        }, { once: true });

        // Synchronize time with YouTube before playing
        const { ytPlayer } = get();
        if (ytPlayer && ytPlayer.getCurrentTime) {
          silentAudio.currentTime = ytPlayer.getCurrentTime();
        }

        silentAudio.play().catch(e => {
          console.error("Native audio play blocked:", e);
          silentAudio.removeEventListener('playing', onPlaying);
        });
      } else {
        console.warn("ALL failovers failed. Gracefully degrading to pure YouTube iframe playback.");
      }
    } catch (e) {
      console.error("Failed to fetch direct stream for iOS:", e);
    }
  },
  
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  setQueue: (tracks) => set({ queue: tracks }),
  
  playNext: () => {
    const { queue, repeatMode, currentTrack, ytPlayer, silentAudio } = get();
    
    if (repeatMode === 'one' && currentTrack) {
      if (ytPlayer && ytPlayer.seekTo) ytPlayer.seekTo(0, true);
      if (silentAudio) silentAudio.play().catch(() => {});
      set({ progress: 0, currentTime: 0, seekTo: 0, isPlaying: true });
      return;
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(nextTrack.id);
        if (ytPlayer.playVideo) ytPlayer.playVideo();
      }
      if (silentAudio) silentAudio.play().catch(() => {});
      
      set({ 
        currentTrack: nextTrack, 
        queue: queue.slice(1),
        isPlaying: true,
        progress: 0,
        currentTime: 0,
        seekTo: 0
      });
    } else {
      if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
      set({ currentTrack: null, isPlaying: false, progress: 0 });
    }
  },
  
  playPrevious: () => {
    const { ytPlayer } = get();
    if (ytPlayer && ytPlayer.seekTo) ytPlayer.seekTo(0, true);
    set({ progress: 0, currentTime: 0, seekTo: 0 }); 
  },
  
  setIsPlaying: (playing) => {
    const { ytPlayer, silentAudio, isUsingNative } = get();
    if (ytPlayer && !isUsingNative) {
      if (playing && ytPlayer.playVideo) ytPlayer.playVideo();
      if (!playing && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    }
    if (silentAudio) {
      if (playing) silentAudio.play().catch(() => {});
      else silentAudio.pause();
    }
    set({ isPlaying: playing });
  },
  
  togglePlay: () => set((state) => {
    if (state.ytPlayer || state.silentAudio) {
      if (state.isPlaying) {
        if (!state.isUsingNative && state.ytPlayer) state.ytPlayer.pauseVideo();
        if (state.silentAudio) state.silentAudio.pause();
      } else {
        if (!state.isUsingNative && state.ytPlayer) state.ytPlayer.playVideo();
        if (state.silentAudio) state.silentAudio.play().catch(e => console.log("Silent audio blocked:", e));
      }
    }
    return { isPlaying: !state.isPlaying };
  }),
  
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setSeekTo: (seekTo) => set({ seekTo }),
  setVolume: (volume) => set({ volume }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
  
  toggleRepeat: () => set((state) => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const idx = modes.indexOf(state.repeatMode);
    return { repeatMode: modes[(idx + 1) % modes.length] };
  }),
  
  toggleShuffle: () => set((state) => {
    if (!state.isShuffled && state.queue.length > 0) {
      // Shuffle remaining queue
      const shuffled = [...state.queue].sort(() => Math.random() - 0.5);
      return { isShuffled: true, queue: shuffled };
    }
    return { isShuffled: !state.isShuffled };
  }),
  
  setShowLyrics: (show) => set({ showLyrics: show }),

  playPlaylistShuffled: (tracks) => {
    if (!tracks || tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    const firstTrack = shuffled[0];
    const remaining = shuffled.slice(1);
    
    const { ytPlayer, silentAudio } = get();
    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(firstTrack.id);
      if (ytPlayer.playVideo) ytPlayer.playVideo();
    }
    if (silentAudio) silentAudio.play().catch(() => {});
    
    set({
      currentTrack: firstTrack,
      queue: remaining,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      seekTo: 0,
      isShuffled: true,
      isExpanded: true
    });
  }
}));

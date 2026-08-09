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
  history: Track[];
  originalQueue: Track[];
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
  playNext: () => Promise<void>;
  playPrevious: () => void;
  togglePlay: () => void;
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
}

import { useLibraryStore } from './useLibraryStore';

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  history: [],
  originalQueue: [],
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
    
    // Reset native flag on new track to ensure iframe remounts instantly
    set({ isUsingNative: false });
    
    // Synchronously trigger YouTube player for strict mobile Safari autoplay policies
    const { ytPlayer, silentAudio, currentTrack, history } = get();
    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(track.id);
    }
    
    // CRITICAL iOS FIX: The src MUST be set and play() MUST be called synchronously inside the user gesture event.
    // If we swap the src asynchronously later, iOS revokes the "user-gesture blessing" and kills background playback.
    if (silentAudio) {
      silentAudio.loop = false;
      // We point it directly to our Vercel streaming proxy. The browser will wait while Vercel extracts and pipes the stream.
      silentAudio.src = `/api/stream?id=${track.id}`;
      
      const onPlaying = () => {
        set({ isUsingNative: true });
        silentAudio.removeEventListener('playing', onPlaying);
      };
      silentAudio.addEventListener('playing', onPlaying);
      
      silentAudio.addEventListener('error', () => {
        silentAudio.removeEventListener('playing', onPlaying);
        console.error("Native audio failed to load proxy stream. Gracefully degrading to YouTube iframe.");
      }, { once: true });

      // Synchronously call play!
      silentAudio.play().catch(e => console.log("Initial proxy stream play blocked:", e));
    }
    
    set((state) => {
      let newQueue = [];
      let newOriginalQueue = [];
      if (contextQueue) {
        const idx = contextQueue.findIndex(t => t.id === track.id);
        if (idx !== -1) {
          newQueue = contextQueue.slice(idx + 1);
          newOriginalQueue = contextQueue.slice(idx + 1);
        } else {
          newQueue = contextQueue;
          newOriginalQueue = contextQueue;
        }
      } else {
        newQueue = state.queue; // Keep existing queue if no context provided
        newOriginalQueue = state.originalQueue;
      }
      
      const newHistory = currentTrack ? [...state.history, currentTrack] : state.history;
      
      return { 
        currentTrack: track, 
        queue: newQueue, 
        originalQueue: newOriginalQueue,
        history: newHistory,
        isPlaying: true, 
        progress: 0, 
        currentTime: 0, 
        duration: track.duration || 0, 
        isExpanded: true 
      };
    });
  },

  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track],
    originalQueue: [...state.originalQueue, track]
  })),
  
  setQueue: (tracks) => set({ queue: tracks, originalQueue: tracks }),
  
  playNext: async () => {
    const { queue, repeatMode, currentTrack, history, ytPlayer, silentAudio, isShuffled } = get();
    
    if (repeatMode === 'one' && currentTrack) {
      if (ytPlayer && ytPlayer.seekTo) ytPlayer.seekTo(0, true);
      if (silentAudio) {
        silentAudio.currentTime = 0;
        silentAudio.play().catch(() => {});
      }
      set({ progress: 0, currentTime: 0, seekTo: 0, isPlaying: true });
      return;
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      set({ isUsingNative: false });
      
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(nextTrack.id);
        if (ytPlayer.playVideo) ytPlayer.playVideo();
      }
      
      if (silentAudio) {
        silentAudio.loop = false;
        silentAudio.src = `/api/stream?id=${nextTrack.id}`;
        silentAudio.play().catch(() => {});
      }
      
      set({ 
        currentTrack: nextTrack, 
        queue: queue.slice(1),
        history: currentTrack ? [...history, currentTrack] : history,
        isPlaying: true,
        progress: 0,
        currentTime: 0,
        seekTo: 0
      });
    } else if (currentTrack) {
      // Autoplay: Fetch a similar song using our backend
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(currentTrack.artist + ' songs')}`);
        const data = await res.json();
        // Pick a random song from results that isn't the current track
        const songs = data.results.filter((t: any) => t.id !== currentTrack.id && t.type === 'SONG');
        if (songs.length > 0) {
          const randomSong = songs[Math.floor(Math.random() * songs.length)];
          get().playTrack(randomSong);
          return;
        }
      } catch (e) {
        console.error("Autoplay failed:", e);
      }
      
      if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
      if (silentAudio) silentAudio.pause();
      set({ currentTrack: null, isPlaying: false, progress: 0 });
    }
  },
  
  playPrevious: () => {
    const { ytPlayer, silentAudio, currentTime, history, currentTrack } = get();
    
    if (currentTime > 3 || history.length === 0) {
      // Seek to 0 if playing for more than 3 seconds or no history
      if (ytPlayer && ytPlayer.seekTo) ytPlayer.seekTo(0, true);
      if (silentAudio) {
        silentAudio.currentTime = 0;
        silentAudio.play().catch(() => {});
      }
      set({ progress: 0, currentTime: 0, seekTo: 0 }); 
    } else {
      // Go to previous track
      const prevTrack = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      
      set({ isUsingNative: false });
      
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(prevTrack.id);
        if (ytPlayer.playVideo) ytPlayer.playVideo();
      }
      
      if (silentAudio) {
        silentAudio.loop = false;
        silentAudio.src = `/api/stream?id=${prevTrack.id}`;
        silentAudio.play().catch(() => {});
      }
      
      set((state) => ({ 
        currentTrack: prevTrack, 
        queue: currentTrack ? [currentTrack, ...state.queue] : state.queue,
        history: newHistory,
        isPlaying: true,
        progress: 0,
        currentTime: 0,
        seekTo: 0
      }));
    }
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
    } else if (state.isShuffled) {
      // Restore original queue order, keeping only items that are still in the queue
      const remainingIds = new Set(state.queue.map(t => t.id));
      const restored = state.originalQueue.filter(t => remainingIds.has(t.id));
      // Any items manually added to queue that weren't in originalQueue should be appended
      const originalIds = new Set(state.originalQueue.map(t => t.id));
      const newlyAdded = state.queue.filter(t => !originalIds.has(t.id));
      
      return { isShuffled: false, queue: [...restored, ...newlyAdded] };
    }
    return { isShuffled: false };
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

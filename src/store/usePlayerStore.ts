import { create } from 'zustand';
import { useLibraryStore } from './useLibraryStore';
import { PlaybackProvider } from '@/lib/playback/PlaybackProvider';

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
  volume: number;
  isExpanded: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  showLyrics: boolean;

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
  
  // Architecture
  providers: Record<string, PlaybackProvider>;
  activeProviderId: 'youtube' | 'direct';
  registerProvider: (provider: PlaybackProvider) => void;
  setActiveProviderId: (id: 'youtube' | 'direct') => void;
  getActiveProvider: () => PlaybackProvider | null;
  
  analyser: AnalyserNode | null;
  setAnalyser: (analyser: AnalyserNode) => void;
}

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
  
  providers: {},
  activeProviderId: 'youtube', // Default to YouTube for now
  
  registerProvider: (provider) => set((state) => ({
    providers: { ...state.providers, [provider.id]: provider }
  })),
  
  setActiveProviderId: (id) => set({ activeProviderId: id }),
  
  getActiveProvider: () => {
    const { providers, activeProviderId } = get();
    return providers[activeProviderId] || null;
  },
  
  analyser: null,
  setAnalyser: (analyser) => set({ analyser }),

  playTrack: (track, contextQueue) => {
    useLibraryStore.getState().addToRecent(track);
    
    // Default to YouTube provider for all currently resolved tracks until direct audio backend is ready
    set({ activeProviderId: 'youtube' });
    
    const activeProvider = get().getActiveProvider();
    const currentTrack = get().currentTrack;
    
    if (activeProvider) {
      activeProvider.load(track);
      activeProvider.play();
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
        newQueue = state.queue;
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
    const { queue, repeatMode, currentTrack, history } = get();
    const activeProvider = get().getActiveProvider();
    
    if (repeatMode === 'one' && currentTrack) {
      if (activeProvider) {
        activeProvider.seekTo(0);
        activeProvider.play();
      }
      set({ progress: 0, currentTime: 0, seekTo: 0, isPlaying: true });
      return;
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      set({ activeProviderId: 'youtube' });
      const newProvider = get().getActiveProvider();
      
      if (newProvider) {
        newProvider.load(nextTrack);
        newProvider.play();
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
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(currentTrack.artist + ' songs')}`);
        const data = await res.json();
        const songs = data.results.filter((t: any) => t.id !== currentTrack.id && t.type === 'SONG');
        if (songs.length > 0) {
          const randomSong = songs[Math.floor(Math.random() * songs.length)];
          get().playTrack(randomSong);
          return;
        }
      } catch (e) {
        console.error("Autoplay failed:", e);
      }
      
      if (activeProvider) {
        activeProvider.pause();
      }
      set({ currentTrack: null, isPlaying: false, progress: 0 });
    }
  },
  
  playPrevious: () => {
    const { currentTime, history, currentTrack } = get();
    const activeProvider = get().getActiveProvider();
    
    if (currentTime > 3 || history.length === 0) {
      if (activeProvider) {
        activeProvider.seekTo(0);
        activeProvider.play();
      }
      set({ progress: 0, currentTime: 0, seekTo: 0 }); 
    } else {
      const prevTrack = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      
      set({ activeProviderId: 'youtube' });
      const newProvider = get().getActiveProvider();
      
      if (newProvider) {
        newProvider.load(prevTrack);
        newProvider.play();
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
    const activeProvider = get().getActiveProvider();
    if (activeProvider) {
      if (playing) activeProvider.play();
      else activeProvider.pause();
    }
    set({ isPlaying: playing });
  },
  
  togglePlay: () => set((state) => {
    const activeProvider = get().getActiveProvider();
    if (activeProvider) {
      if (state.isPlaying) {
        activeProvider.pause();
      } else {
        activeProvider.play();
      }
    }
    return { isPlaying: !state.isPlaying };
  }),
  
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setSeekTo: (seekTo) => set({ seekTo }),
  setVolume: (volume) => {
    const activeProvider = get().getActiveProvider();
    if (activeProvider) {
      activeProvider.setVolume(volume);
    }
    set({ volume });
  },
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
  
  toggleRepeat: () => set((state) => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const idx = modes.indexOf(state.repeatMode);
    return { repeatMode: modes[(idx + 1) % modes.length] };
  }),
  
  toggleShuffle: () => set((state) => {
    if (!state.isShuffled && state.queue.length > 0) {
      const shuffled = [...state.queue].sort(() => Math.random() - 0.5);
      return { isShuffled: true, queue: shuffled };
    } else if (state.isShuffled) {
      const remainingIds = new Set(state.queue.map(t => t.id));
      const restored = state.originalQueue.filter(t => remainingIds.has(t.id));
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
    
    set({ activeProviderId: 'youtube' });
    const activeProvider = get().getActiveProvider();
    
    if (activeProvider) {
      activeProvider.load(firstTrack);
      activeProvider.play();
    }
    
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

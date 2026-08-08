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

  playTrack: (track, contextQueue) => {
    // Add to recently played automatically
    useLibraryStore.getState().addToRecent(track);
    
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
  
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  setQueue: (tracks) => set({ queue: tracks }),
  
  playNext: () => {
    const { queue, repeatMode, currentTrack } = get();
    
    if (repeatMode === 'one' && currentTrack) {
      // Just restart current track
      set({ progress: 0, currentTime: 0, seekTo: 0, isPlaying: true });
      return;
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      set({ 
        currentTrack: nextTrack, 
        queue: queue.slice(1),
        isPlaying: true,
        progress: 0,
        currentTime: 0,
        seekTo: 0
      });
    } else {
      // If repeatMode === 'all', we would loop here if we kept history. For now, stop.
      set({ currentTrack: null, isPlaying: false, progress: 0 });
    }
  },
  
  playPrevious: () => {
    set({ progress: 0, currentTime: 0 }); 
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
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

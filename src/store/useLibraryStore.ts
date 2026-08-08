import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track } from './usePlayerStore';

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

interface LibraryState {
  likedSongs: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  
  // Actions
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  addToRecent: (track: Track) => void;
  createPlaylist: (name: string, initialTracks?: Track[]) => string;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      recentlyPlayed: [],
      playlists: [],

      toggleLike: (track) => set((state) => {
        const exists = state.likedSongs.some(t => t.id === track.id);
        if (exists) {
          return { likedSongs: state.likedSongs.filter(t => t.id !== track.id) };
        } else {
          return { likedSongs: [track, ...state.likedSongs] };
        }
      }),

      isLiked: (trackId) => get().likedSongs.some(t => t.id === trackId),

      addToRecent: (track) => set((state) => {
        const filtered = state.recentlyPlayed.filter(t => t.id !== track.id);
        const updated = [track, ...filtered].slice(0, 50); // Keep max 50 recent tracks
        return { recentlyPlayed: updated };
      }),

      createPlaylist: (name, initialTracks = []) => {
        const id = `playlist_${Date.now()}`;
        const newPlaylist: Playlist = {
          id,
          name,
          tracks: initialTracks,
          createdAt: Date.now(),
        };
        set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
        return id;
      },

      addTrackToPlaylist: (playlistId, track) => set((state) => ({
        playlists: state.playlists.map(p => {
          if (p.id === playlistId) {
            if (p.tracks.some(t => t.id === track.id)) return p; // prevent dupes
            return { ...p, tracks: [...p.tracks, track] };
          }
          return p;
        })
      })),

      removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
        playlists: state.playlists.map(p => {
          if (p.id === playlistId) {
            return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
          }
          return p;
        })
      }))
    }),
    {
      name: 'orpheus-library',
    }
  )
);

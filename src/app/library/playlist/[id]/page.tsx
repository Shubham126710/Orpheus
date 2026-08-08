"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, ArrowLeft, Shuffle, ListMusic, Trash2 } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useContextMenuStore } from "@/store/useContextMenuStore";

export default function CustomPlaylistView() {
  const { id } = useParams();
  const router = useRouter();
  const { playlists, removeTrackFromPlaylist } = useLibraryStore();
  const { playTrack, setQueue, playPlaylistShuffled } = usePlayerStore();
  const { openContextMenu } = useContextMenuStore();
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white/50 font-geist">
        <p>Playlist not found</p>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks);
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-40 md:pb-48 text-white relative">
      <div className="relative z-10 px-4 md:px-12 pt-8 md:pt-12 flex flex-col max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full mb-8 hover:bg-white/20 transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Vibrant Header Card */}
        <div 
          className="w-full bg-[#0055FF] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 shadow-[0_0_100px_20px_rgba(0,85,255,0.2)]"
        >
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl shrink-0 group bg-white/10 flex items-center justify-center backdrop-blur-sm">
            {playlist.tracks[0]?.thumbnail ? (
              <img src={playlist.tracks[0].thumbnail} className="w-full h-full object-cover" alt="" />
            ) : (
              <ListMusic size={80} className="text-white/30 drop-shadow-lg" strokeWidth={2} />
            )}
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer" onClick={handlePlayAll}>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                <Play size={28} strokeWidth={2.5} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left z-10 flex-1 min-w-0">
            <span className="font-geist text-xs font-bold tracking-[0.3em] text-white/70 uppercase mb-2">Playlist</span>
            <h1 className="font-geist font-black text-3xl md:text-5xl lg:text-6xl tracking-tight mb-4 uppercase leading-none line-clamp-3 text-white drop-shadow-md">
              {playlist.name}
            </h1>
            <p className="font-geist text-sm md:text-base text-white/80 max-w-2xl mb-8">
              Created {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4 mt-auto justify-center md:justify-start">
              <button 
                onClick={handlePlayAll}
                disabled={playlist.tracks.length === 0}
                className="flex items-center gap-2 bg-[#FAFF00] text-black px-6 py-3 rounded-full font-geist font-black tracking-widest text-sm hover:scale-105 transition-transform disabled:opacity-50"
              >
                <Play size={16} fill="currentColor" />
                PLAY ALL
              </button>
              
              <button 
                onClick={() => playPlaylistShuffled(playlist.tracks)}
                disabled={playlist.tracks.length === 0}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors shrink-0 disabled:opacity-50"
              >
                <Shuffle size={20} />
              </button>

              <span className="font-geist text-xs tracking-widest text-white/60 ml-2 hidden sm:block">
                {playlist.tracks.length} TRACKS
              </span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col gap-2">
          {playlist.tracks.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-geist">
              <p className="text-lg uppercase tracking-widest font-bold">Playlist is empty</p>
              <p className="text-sm">Add some tracks from the player!</p>
            </div>
          ) : (
            playlist.tracks.map((track: Track, index: number) => (
              <div 
                key={`${track.id}-${index}`}
                className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors"
              >
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => playTrack(track, playlist.tracks)}
                  onContextMenu={(e) => openContextMenu(e, track)}
                >
                  <span className="font-geist font-bold text-white/30 w-6 text-right">{index + 1}</span>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} fill="white" />
                    </div>
                  </div>
                  <div className="flex flex-col max-w-[200px] md:max-w-md">
                    <span className="font-geist font-bold text-white truncate">{track.title}</span>
                    <span className="font-geist text-sm text-white/50 truncate">{track.artist}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTrackFromPlaylist(playlist.id, track.id);
                  }}
                  className="p-2 text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Disc3, ArrowLeft, MoreHorizontal, Shuffle } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useContextMenuStore } from "@/store/useContextMenuStore";

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, setQueue } = usePlayerStore();
  const { openContextMenu } = useContextMenuStore();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`/api/playlist?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setPlaylist(data);
        }
      } catch (err) {
        console.error("Failed to load playlist", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist?.tracks?.length > 0) {
      // Set first track to play, and the rest to queue
      setQueue(playlist.tracks);
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white/50 font-geist tracking-widest uppercase">
        Loading Playlist...
      </div>
    );
  }

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

        {/* Vibrant Squircle Header Card */}
        <div 
          className="w-full bg-[#0055FF] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-[#0055FF]/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12"
          style={{ boxShadow: "0 0 100px 20px rgba(0, 85, 255, 0.5)" }}
        >
          {/* Background Glow */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl shrink-0 group">
            <Image
              src={playlist.thumbnail}
              alt={playlist.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer" onClick={handlePlayAll}>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                <Play size={28} strokeWidth={2.5} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left z-10 flex-1 min-w-0">
            <span className="font-geist text-xs font-bold tracking-[0.3em] text-white/70 uppercase mb-2">Playlist</span>
            <h1 className="font-geist font-black text-3xl md:text-5xl lg:text-6xl tracking-tight mb-4 uppercase leading-none line-clamp-3 text-white drop-shadow-md">
              {playlist.title}
            </h1>
            <p className="font-geist text-sm md:text-base text-white/80 max-w-2xl mb-8 line-clamp-2">
              {playlist.description}
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <button 
                onClick={handlePlayAll}
                className="flex items-center gap-2 bg-[#FAFF00] text-black px-6 py-3 rounded-full font-geist font-black tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(250,255,0,0.3)]"
              >
                <Play size={16} fill="currentColor" />
                PLAY ALL
              </button>
              
              <button 
                onClick={() => usePlayerStore.getState().playPlaylistShuffled(playlist.tracks)}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors shrink-0 backdrop-blur-md border border-white/10"
              >
                <Shuffle size={20} />
              </button>

              <span className="font-geist text-xs tracking-widest text-white/60 ml-2 hidden sm:block">
                {playlist.tracks?.length || 0} TRACKS
              </span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col gap-2">
          {playlist.tracks?.map((track: Track, index: number) => (
            <div 
              key={`${track.id}-${index}`}
              onClick={() => playTrack(track, playlist.tracks)}
              onContextMenu={(e) => openContextMenu(e, track)}
              className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-geist font-bold text-white/30 w-6 text-right">{index + 1}</span>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={track.thumbnail}
                    alt={track.title}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} fill="white" />
                  </div>
                </div>
                <div className="flex flex-col max-w-[200px] md:max-w-md lg:max-w-xl">
                  <span className="font-geist font-bold text-white truncate text-sm md:text-base">{track.title}</span>
                  <span className="font-geist text-xs text-white/50 uppercase tracking-wider truncate">{track.artist}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

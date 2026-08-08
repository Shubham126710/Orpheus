"use client";

import { useState, useEffect } from "react";
import { Play, Heart, MoreHorizontal, Clock } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import Image from "next/image";

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { playTrack } = usePlayerStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock album data for aesthetic display
  const mockAlbum = {
    title: "Cinematic Echoes",
    artist: "Unknown Artist",
    thumbnail: "/placeholder-art.jpg",
    year: "2024",
    trackCount: 8
  };

  useEffect(() => {
    // In a real app, we would fetch the playlist/album by ID
    // We will do a generic search here to populate some songs
    const fetchAlbumTracks = async () => {
      try {
        const res = await fetch(`/api/search?q=ambient+music`);
        if (res.ok) {
          const data = await res.json();
          setTracks(data.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to fetch album tracks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbumTracks();
  }, [params.id]);

  return (
    <div className="flex flex-col w-full h-full text-white">
      {/* Header */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-end p-8 md:p-12 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D181C] to-transparent z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-8 w-full max-w-5xl mx-auto">
          <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl relative shrink-0 rounded-sm overflow-hidden">
            <Image
              src={mockAlbum.thumbnail}
              alt={mockAlbum.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <span className="font-geist text-xs uppercase tracking-widest text-white/70">Album</span>
            <h1 className="text-5xl md:text-7xl font-instrument font-bold tracking-tight">{mockAlbum.title}</h1>
            <div className="flex items-center gap-2 mt-4 font-geist text-sm text-white/80">
              <span className="font-bold">{mockAlbum.artist}</span>
              <span>•</span>
              <span>{mockAlbum.year}</span>
              <span>•</span>
              <span>{mockAlbum.trackCount} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-8 md:px-12 py-6 w-full max-w-5xl mx-auto flex items-center gap-6">
        <button 
          onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform shadow-xl"
        >
          <Play size={24} strokeWidth={2.5} fill="currentColor" className="ml-1" />
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <Heart size={32} strokeWidth={1.5} />
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <MoreHorizontal size={32} strokeWidth={1.5} />
        </button>
      </div>

      {/* Tracklist */}
      <div className="px-8 md:px-12 pb-32 w-full max-w-5xl mx-auto">
        <div className="flex items-center text-white/50 font-geist text-xs uppercase tracking-wider border-b border-white/10 pb-2 mb-4 px-4">
          <div className="w-8 text-right mr-4">#</div>
          <div className="flex-1">Title</div>
          <div className="hidden md:block w-32">Plays</div>
          <div className="w-16 flex justify-end"><Clock size={16} /></div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-md w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {tracks.map((track, index) => (
              <div 
                key={track.id}
                className="flex items-center group px-4 py-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => playTrack(track, tracks)}
              >
                <div className="w-8 text-right mr-4 text-white/50 font-geist text-sm group-hover:hidden">
                  {index + 1}
                </div>
                <div className="w-8 mr-4 hidden group-hover:flex justify-end text-white">
                  <Play size={16} fill="currentColor" />
                </div>
                
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="font-geist text-base text-white truncate">{track.title}</span>
                  <span className="font-geist text-xs text-white/50 uppercase tracking-wide truncate">{track.artist}</span>
                </div>
                
                <div className="hidden md:block w-32 text-white/50 font-geist text-sm">
                  {Math.floor(Math.random() * 900 + 100)}K
                </div>
                
                <div className="w-16 text-right text-white/50 font-geist text-sm">
                  3:45
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

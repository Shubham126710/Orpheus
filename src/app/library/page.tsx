"use client";

import { Heart, Clock, ListMusic, Play } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const { likedSongs, recentlyPlayed, playlists } = useLibraryStore();
  const { playTrack, playPlaylistShuffled } = usePlayerStore();
  const router = useRouter();

  const librarySections = [
    { title: "Liked Songs", id: "liked", icon: Heart, count: likedSongs.length, color: "bg-[#FF0055]" },
    { title: "Recently Played", id: "recent", icon: Clock, count: recentlyPlayed.length, color: "bg-[#00FF55]" },
  ];

  return (
    <div className="flex flex-col w-full h-full min-h-screen pt-12 pb-48 px-6 md:px-12 text-white items-center relative">
      <header className="mb-12 w-full text-center">
        <h1 className="text-3xl tracking-[0.2em] font-geist font-black uppercase text-white/90">Library</h1>
      </header>

      <section className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {librarySections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div 
                key={i}
                onClick={() => router.push(`/library/${section.id}`)}
                className={`group flex flex-col justify-between cursor-pointer p-8 h-64 rounded-[2rem] transition-transform duration-500 hover:scale-[1.02] shadow-2xl relative overflow-hidden ${section.color}`}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Icon size={28} className="text-black" strokeWidth={2.5} suppressHydrationWarning />
                </div>

                <div className="text-left relative z-10 w-full mt-auto">
                  <h3 className="font-geist font-black text-3xl tracking-tight text-black uppercase leading-none mb-2">{section.title}</h3>
                  <p className="font-geist text-sm font-bold text-black/70 tracking-widest uppercase truncate">{section.count} Tracks</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full max-w-7xl mt-16">
        <h2 className="text-xl font-geist font-bold text-white mb-6 uppercase tracking-widest text-center md:text-left">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {playlists.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/40 font-geist">
              <ListMusic size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No playlists yet</p>
              <p className="text-sm">Create one from the player</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                onClick={() => router.push(`/library/playlist/${playlist.id}`)}
                className="group flex flex-col gap-4 cursor-pointer"
              >
                <div className="w-full aspect-square bg-white/5 rounded-3xl overflow-hidden relative shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  {playlist.tracks[0]?.thumbnail ? (
                    <img src={playlist.tracks[0].thumbnail} alt={playlist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ListMusic size={48} className="text-white/20" />
                  )}
                  {playlist.tracks.length > 0 && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(playlist.tracks[0], playlist.tracks);
                        }}
                        className="w-12 h-12 rounded-full bg-[#FAFF00] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                      >
                        <Play size={20} className="text-black ml-1" fill="currentColor" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-geist font-bold text-white text-lg truncate w-full group-hover:text-[#FAFF00] transition-colors">{playlist.name}</h3>
                  <p className="font-geist text-xs font-bold text-white/50 tracking-widest uppercase">{playlist.tracks.length} Tracks</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

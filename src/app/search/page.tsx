"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, Play, Disc3, User } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useSearchStore } from "@/store/useSearchStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { genresData } from "@/lib/genres";

import { useContextMenuStore } from "@/store/useContextMenuStore";

interface SearchResult extends Track {
  type: 'SONG' | 'VIDEO' | 'PLAYLIST' | 'ALBUM' | 'ARTIST';
}

export default function SearchPage() {
  const router = useRouter();
  const { query, setQuery } = useSearchStore();
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<string>(""); // empty for all
  const { playTrack } = usePlayerStore();
  const { openContextMenu } = useContextMenuStore();

  const cardColors = [
    "bg-[#FAFF00]", "bg-[#00FF55]", "bg-[#FF0055]", "bg-[#0055FF]", "bg-[#FF5500]", "bg-[#B900FF]"
  ];

  const recentSearches = [
    { title: "Taylor Swift", type: "Artist" },
    { title: "Top Hits 2026", type: "Playlist" },
    { title: "Ed Sheeran", type: "Artist" },
    { title: "Bollywood Romance", type: "Playlist" },
  ];

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Search API call
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}${filter ? `&filter=${filter}` : ''}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, filter]);

  const handleResultClick = (item: SearchResult) => {
    if (item.type === 'SONG' || item.type === 'VIDEO') {
      playTrack(item, results.filter(r => r.type === 'SONG' || r.type === 'VIDEO'));
    } else if (item.type === 'PLAYLIST' || item.type === 'ALBUM') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'ARTIST') {
      router.push(`/artist/${item.id}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: SearchResult) => {
    if (item.type === 'SONG' || item.type === 'VIDEO') {
      openContextMenu(e, item);
    }
  };

  const filters = [
    { id: "", label: "ALL" },
    { id: "SONG", label: "SONGS" },
    { id: "PLAYLIST", label: "PLAYLISTS" },
    { id: "ARTIST", label: "ARTISTS" },
  ];

  return (
    <div className="flex flex-col w-full h-full min-h-screen pt-8 md:pt-12 pb-40 md:pb-48 px-4 md:px-12 text-white items-center relative">
      <header className="mb-6 md:mb-8 w-full text-center">
        <h1 className="text-2xl md:text-3xl tracking-[0.2em] font-geist font-black uppercase text-white/90">Search</h1>
      </header>

      {query.trim() !== "" && (
        <div className="w-full max-w-7xl flex items-center justify-start md:justify-center gap-2 md:gap-4 mb-8 md:mb-10 overflow-x-auto pb-4 hide-scrollbar px-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-full font-geist font-bold text-[10px] md:text-xs tracking-widest uppercase transition-colors shrink-0 ${
                filter === f.id ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {query.trim() === "" ? (
        <>
          <section className="w-full max-w-7xl">
            <h2 className="text-lg md:text-xl font-geist font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Recent Searches</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {recentSearches.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setQuery(item.title)}
                  className="group flex flex-col justify-end cursor-pointer p-4 md:p-6 h-32 md:h-48 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden bg-white/10"
                >
                  <div className="text-left relative z-10 w-full">
                    <h3 className="font-geist font-black text-sm md:text-xl tracking-tight text-white truncate uppercase">{item.title}</h3>
                    <p className="font-geist text-[10px] md:text-xs font-bold text-white/60 tracking-widest uppercase mt-1 truncate">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full max-w-7xl mt-8 md:mt-12">
            <h2 className="text-lg md:text-xl font-geist font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Browse Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {genresData.map((genre, i) => (
                <div 
                  key={i} 
                  onClick={() => router.push(`/genre/${encodeURIComponent(genre.title)}`)}
                  className={`group flex flex-col justify-end cursor-pointer p-4 md:p-6 h-32 md:h-48 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${genre.color}`}
                >
                  <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="text-left relative z-10 w-full">
                    <h3 className="font-geist font-black text-lg md:text-2xl tracking-tight text-black uppercase">{genre.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="w-full max-w-7xl">
          <h2 className="text-lg md:text-xl font-geist font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">
            {isSearching ? "Searching..." : "Top Results"}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {results.map((item, i) => (
              <div 
                key={`${item.id}-${i}`} 
                className={`group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${cardColors[i % cardColors.length]}`}
                onClick={() => handleResultClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <div className={`relative w-full aspect-square ${item.type === 'ARTIST' ? 'rounded-full' : 'rounded-[1.25rem] md:rounded-3xl'} overflow-hidden shadow-xl mb-4 md:mb-6`}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      {item.type === 'SONG' || item.type === 'VIDEO' ? (
                        <Play size={18} fill="currentColor" className="ml-1" />
                      ) : item.type === 'ARTIST' ? (
                        <User size={18} fill="currentColor" />
                      ) : (
                        <Disc3 size={18} fill="currentColor" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-geist font-black text-sm md:text-lg text-black truncate uppercase">{item.title}</h3>
                  <p className="font-geist text-[10px] md:text-xs font-bold text-black/70 uppercase mt-1 truncate">
                    {item.type === 'ARTIST' ? 'Artist' : `${item.type === 'SONG' ? 'Song • ' : item.type === 'PLAYLIST' ? 'Playlist • ' : ''}${item.artist}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {!isSearching && results.length === 0 && (
            <div className="w-full text-center text-white/50 py-10 md:py-20 font-geist text-sm md:text-base">
              No results found for "{query}"
            </div>
          )}
        </section>
      )}
    </div>
  );
}

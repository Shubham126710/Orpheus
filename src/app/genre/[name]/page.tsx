"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Disc3, ArrowLeft, User } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { genresData } from "@/lib/genres";

interface SearchResult extends Track {
  type: 'SONG' | 'VIDEO' | 'PLAYLIST' | 'ALBUM' | 'ARTIST';
}

export default function GenrePage() {
  const params = useParams();
  const router = useRouter();
  const { playTrack } = usePlayerStore();
  const name = decodeURIComponent((params.name as string) || "");

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cardColors = [
    "bg-[#FAFF00]", "bg-[#00FF55]", "bg-[#FF0055]", "bg-[#0055FF]", "bg-[#FF5500]", "bg-[#B900FF]"
  ];

  const getGenreTheme = (genreName: string) => {
    const themes = [
      { bg: "bg-[#FF3366]", text: "text-white" },
      { bg: "bg-[#00FF55]", text: "text-black" },
      { bg: "bg-[#7000FF]", text: "text-white" },
      { bg: "bg-[#FF9900]", text: "text-black" },
      { bg: "bg-[#00E5FF]", text: "text-black" },
      { bg: "bg-[#FF0055]", text: "text-white" },
      { bg: "bg-[#FFE600]", text: "text-black" }
    ];
    let hash = 0;
    for (let i = 0; i < genreName.length; i++) {
      hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return themes[Math.abs(hash) % themes.length];
  };

  useEffect(() => {
    if (!name) return;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(name + ' genre hits')}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Genre search failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [name]);

  const handleResultClick = (item: SearchResult) => {
    if (item.type === 'SONG' || item.type === 'VIDEO') {
      playTrack(item);
    } else if (item.type === 'PLAYLIST' || item.type === 'ALBUM') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'ARTIST') {
      router.push(`/artist/${item.id}`);
    }
  };

  const theme = getGenreTheme(name);
  const genreInfo = genresData.find(g => g.title.toLowerCase() === name.toLowerCase());

  return (
    <div className="flex flex-col w-full min-h-screen pb-40 md:pb-48 text-white bg-[#0a0a0a]">
      {/* Vivid Header Block */}
      <div className={`relative w-full pt-8 md:pt-12 pb-16 md:pb-24 px-4 md:px-12 flex flex-col items-center rounded-b-[3rem] md:rounded-b-[4rem] shadow-2xl transition-colors duration-500 ${theme.bg} ${theme.text}`}>
        
        {/* Back Button */}
        <div className="w-full max-w-7xl mx-auto flex justify-start mb-4 md:mb-8">
          <button 
            onClick={() => router.back()}
            className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${theme.text === 'text-white' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'}`}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Genre Info */}
        <div className="flex flex-col items-center text-center w-full max-w-3xl">
          <span className={`font-geist text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 ${theme.text === 'text-white' ? 'text-white/80' : 'text-black/60'}`}>Genre</span>
          <h1 className="font-geist font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-4 md:mb-6 uppercase leading-none break-words px-2">{name}</h1>
          {genreInfo && (
            <p className={`font-geist text-sm md:text-base leading-relaxed mt-4 md:mt-6 px-4 ${theme.text === 'text-white' ? 'text-white/90' : 'text-black/80'}`}>
              {genreInfo.description}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-12 pt-12 md:pt-16 flex flex-col max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-white/50 font-geist tracking-widest uppercase animate-pulse">
            Loading {name}...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {results.map((item, i) => (
              <div 
                key={item.id} 
                className={`group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${cardColors[i % cardColors.length]}`}
                onClick={() => handleResultClick(item)}
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
                    {item.type === 'SONG' ? 'Song • ' : item.type === 'PLAYLIST' ? 'Playlist • ' : item.type === 'ARTIST' ? 'Artist' : ''}{item.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

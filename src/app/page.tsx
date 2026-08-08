"use client";

import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { Play, Disc3 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const router = useRouter();
  const { playTrack } = usePlayerStore();
  const [topHits, setTopHits] = useState<any[]>([]);
  const [gymHits, setGymHits] = useState<any[]>([]);
  const [chillHits, setChillHits] = useState<any[]>([]);
  const [hindiHits, setHindiHits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const [top, gym, chill, hindi] = await Promise.all([
          fetch('/api/search?q=top+hits+2026+playlist&filter=PLAYLIST', { signal: controller.signal }).then(res => res.json()),
          fetch('/api/search?q=gym+workout+music+playlist&filter=PLAYLIST', { signal: controller.signal }).then(res => res.json()),
          fetch('/api/search?q=lofi+chill+beats+playlist&filter=PLAYLIST', { signal: controller.signal }).then(res => res.json()),
          fetch('/api/search?q=top+hindi+songs+playlist&filter=PLAYLIST', { signal: controller.signal }).then(res => res.json())
        ]);
        
        clearTimeout(timeoutId);
        
        setTopHits(Array.isArray(top) ? top.slice(0, 2) : []); // Top 2 giant cards
        setGymHits(Array.isArray(gym) ? gym.slice(0, 4) : []);
        setChillHits(Array.isArray(chill) ? chill.slice(0, 4) : []);
        setHindiHits(Array.isArray(hindi) ? hindi.slice(0, 4) : []);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSections();
  }, []);

  const cardColors = [
    "bg-[#FAFF00]", "bg-[#00FF55]", "bg-[#FF0055]", "bg-[#0055FF]", "bg-[#FF5500]", "bg-[#B900FF]"
  ];

  if (isLoading) {
    return <SplashScreen />;
  }

  const handleItemClick = (item: any) => {
    if (item.type === 'PLAYLIST' || item.type === 'ALBUM') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'ARTIST') {
      router.push(`/artist/${item.id}`);
    } else {
      playTrack(item);
    }
  };

  const renderGridSection = (title: string, items: any[], colorOffset: number = 0) => (
    <section className="w-full max-w-7xl mt-10 md:mt-16">
      <h2 className="text-lg md:text-xl font-geist font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
        {items.map((item, i) => (
          <div 
            key={item.id} 
            className={`group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${cardColors[(i + colorOffset) % cardColors.length]}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-xl mb-4 md:mb-6">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                  {item.type === 'PLAYLIST' ? (
                    <Disc3 size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" className="ml-1" />
                  )}
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-geist font-black text-sm md:text-lg text-black truncate uppercase">{item.title}</h3>
              <p className="font-geist text-[10px] md:text-xs font-bold text-black/70 uppercase mt-1 truncate">{item.type === 'PLAYLIST' ? 'Playlist' : item.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col w-full h-full min-h-screen pt-8 md:pt-12 pb-40 md:pb-48 px-4 md:px-12 text-white items-center relative">
      <header className="mb-8 md:mb-12 w-full text-center">
        <h1 className="text-2xl md:text-3xl tracking-[0.2em] font-geist font-black uppercase text-white/90">Orpheus</h1>
      </header>

      <section className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {topHits.map((item, i) => (
            <div 
              key={item.id} 
              className={`group flex flex-col items-center justify-center cursor-pointer p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-transform duration-500 hover:scale-[1.02] shadow-2xl relative overflow-hidden ${cardColors[i % cardColors.length]}`}
              onClick={() => handleItemClick(item)}
            >
                <div className="absolute top-0 right-0 p-8 text-black/10 font-geist font-black text-9xl tracking-tighter leading-none pointer-events-none select-none">
                  {i + 1}
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-[280px] aspect-square rounded-full overflow-hidden shadow-2xl mb-8 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <Disc3 size={32} strokeWidth={2.5} fill="currentColor" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center relative z-10 w-full px-4">
                  <h3 className="font-geist font-black text-2xl md:text-3xl tracking-tight text-black truncate uppercase">
                    {item.title}
                  </h3>
                  <p className="font-geist text-sm md:text-base font-bold text-black/70 tracking-widest uppercase mt-3 truncate flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                    Curated Playlist
                  </p>
                </div>
              </div>
          ))}
        </div>
      </section>

      {renderGridSection("For You", gymHits, 2)}
      {renderGridSection("Chilling", chillHits, 4)}
      {renderGridSection("Hindi Hits", hindiHits, 1)}
      {renderGridSection("For Gym", gymHits, 3)}
    </div>
  );
}

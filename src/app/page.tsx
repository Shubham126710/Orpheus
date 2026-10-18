"use client";

import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Play, Disc3, LogOut, Sparkles, Clock, Compass, Flame, Zap, Headphones, Radio } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";

import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";
import Onboarding from "@/components/Onboarding";

interface HomeFeedData {
  quickPicks: any[];
  curatedHits: any[];
  topHits: any[];
  gymHits: any[];
  chillHits: any[];
  hindiHits: any[];
  artistHits: any[];
  favoriteArtistName: string;
}

const CACHE_KEY = "orpheus_home_feed_cache_v2";
const CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours

export default function Home() {
  const router = useRouter();
  const { playTrack } = usePlayerStore();
  const { recentlyPlayed } = useLibraryStore();
  const { user, userProfile, loading } = useAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [feed, setFeed] = useState<HomeFeedData>({
    quickPicks: [],
    curatedHits: [],
    topHits: [],
    gymHits: [],
    chillHits: [],
    hindiHits: [],
    artistHits: [],
    favoriteArtistName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedFromCache = useRef(false);

  // Time-of-day greeting (Reverse Engineered from Spotify / YouTube Music)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Late night listening";
  }, []);

  // Filter pills based on user preferences and universal listening moods
  const filterPills = useMemo(() => {
    const defaultPills = ["All", "For You", "Chill", "Focus", "Energize", "Workout"];
    if (userProfile?.preferences && userProfile.preferences.length > 0) {
      const topPrefs = userProfile.preferences.slice(0, 3);
      return ["All", "For You", ...topPrefs, "Chill", "Energize", "Focus"];
    }
    return defaultPills;
  }, [userProfile]);

  // Read client-side cache immediately on mount (zero-latency layout paint)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data && (Date.now() - parsed.timestamp < CACHE_TTL)) {
          setFeed(parsed.data);
          setIsLoading(false);
          hasLoadedFromCache.current = true;
        }
      }
    } catch (e) {
      console.warn("Failed to read home feed cache", e);
    }
  }, []);

  // Fetch / revalidate home feed from InnerTube/API
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchHomeFeed = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const userPrefs = userProfile?.preferences?.length > 0 
          ? userProfile.preferences.join(" ") + " playlist"
          : "trending global music playlist";

        const favArtist = userProfile?.preferences?.find((p: string) => 
          !["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Indie", "Alternative", "Classical", "Jazz", "Metal", "Country", "Dance"].includes(p)
        ) || (userProfile?.preferences?.[0] || "Daft Punk");

        // Concurrent multi-shelf dispatch
        const [curated, top, gym, chill, hindi, quick, artistMix] = await Promise.all([
          fetch(`/api/search?q=${encodeURIComponent(userPrefs)}&filter=PLAYLIST`, { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch('/api/search?q=top+hits+2026+playlist&filter=PLAYLIST', { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch('/api/search?q=gym+workout+music+playlist&filter=PLAYLIST', { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch('/api/search?q=lofi+chill+beats+playlist&filter=PLAYLIST', { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch('/api/search?q=top+hindi+songs+playlist&filter=PLAYLIST', { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch(`/api/search?q=${encodeURIComponent(userPrefs + " songs")}&filter=SONG`, { signal: controller.signal })
            .then(res => res.json()).catch(() => []),
          fetch(`/api/search?q=${encodeURIComponent(favArtist + " mix")}&filter=PLAYLIST`, { signal: controller.signal })
            .then(res => res.json()).catch(() => [])
        ]);
        
        clearTimeout(timeoutId);

        const newFeedData: HomeFeedData = {
          curatedHits: Array.isArray(curated) ? curated.slice(0, 6) : [],
          topHits: Array.isArray(top) ? top.slice(0, 2) : [],
          gymHits: Array.isArray(gym) ? gym.slice(0, 6) : [],
          chillHits: Array.isArray(chill) ? chill.slice(0, 6) : [],
          hindiHits: Array.isArray(hindi) ? hindi.slice(0, 6) : [],
          quickPicks: Array.isArray(quick) ? quick.slice(0, 6) : [],
          artistHits: Array.isArray(artistMix) ? artistMix.slice(0, 6) : [],
          favoriteArtistName: favArtist,
        };

        setFeed(newFeedData);

        // Store to local client cache (Spotify/YT Music style persistence)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: newFeedData
          }));
        } catch (e) {
          // ignore storage quota error
        }
      } catch (err) {
        console.error("Failed to revalidate home feed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeFeed();
  }, [user, userProfile]);

  const cardColors = [
    "bg-[#FAFF00]", "bg-[#00FF55]", "bg-[#FF0055]", "bg-[#0055FF]", "bg-[#FF5500]", "bg-[#B900FF]"
  ];

  if ((isLoading || loading) && !hasLoadedFromCache.current) {
    return <SplashScreen />;
  }

  if (!user || showAuthModal) {
    return (
      <>
        <LandingPage onJoinClick={() => setShowAuthModal(true)} />
        {showAuthModal && <Onboarding onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  const handleItemClick = (item: any, contextQueue?: any[]) => {
    if (item.type === 'PLAYLIST' || item.type === 'ALBUM') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'ARTIST') {
      router.push(`/artist/${item.id}`);
    } else {
      playTrack(item, contextQueue);
    }
  };

  // Quick picks items: priority to recentlyPlayed, fallback to feed.quickPicks
  const quickPicksList = recentlyPlayed.length >= 4 
    ? recentlyPlayed.slice(0, 6) 
    : (feed.quickPicks.length > 0 ? feed.quickPicks : recentlyPlayed.slice(0, 6));

  const renderGridSection = (title: string, subtitle: string | null, items: any[], colorOffset: number = 0) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="w-full max-w-7xl mt-12 md:mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-geist font-black text-white tracking-widest uppercase">{title}</h2>
            {subtitle && (
              <p className="text-xs md:text-sm font-geist text-white/50 tracking-wider uppercase mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {items.map((item, i) => (
            <div 
              key={item.id + "-" + i} 
              className={`group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden ${cardColors[(i + colorOffset) % cardColors.length]}`}
              onClick={() => handleItemClick(item, items)}
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
                    {item.type === 'PLAYLIST' || item.type === 'ALBUM' ? (
                      <Disc3 size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" className="ml-1" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-geist font-black text-sm md:text-lg text-black truncate uppercase">{item.title}</h3>
                <p className="font-geist text-[10px] md:text-xs font-bold text-black/70 uppercase mt-1 truncate">
                  {item.type === 'PLAYLIST' ? 'Playlist' : (item.type === 'ALBUM' ? 'Album' : item.artist)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen pt-8 md:pt-12 pb-40 md:pb-48 px-4 md:px-12 text-white items-center relative">
      
      {/* 1. Header & Identity Bar (YouTube Music / Spotify spclient architecture) */}
      <header className="mb-6 md:mb-8 w-full flex justify-between items-center max-w-7xl">
        <div>
          <span className="text-[10px] md:text-xs font-geist font-bold tracking-[0.25em] text-white/50 uppercase block">
            {greeting}
          </span>
          <h1 className="text-2xl md:text-4xl tracking-[0.15em] font-geist font-black uppercase text-white/90">
            {userProfile?.displayName ? `${userProfile.displayName}` : "Orpheus"}
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00FF55] animate-pulse" />
              <span className="text-xs font-geist font-medium text-white/70">
                {userProfile?.preferences?.length ? `${userProfile.preferences.length} Tuned Mixes` : "Curated Flow"}
              </span>
            </div>

            <button 
              onClick={() => auth && auth.signOut()}
              title="Sign Out"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </header>

      {/* 2. Mood & Genre Filter Pills (Spotify/YT Music dynamic chips) */}
      <div className="w-full max-w-7xl mb-8 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 md:gap-3 w-max">
          {filterPills.map((pill) => {
            const isSelected = activeFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-geist font-bold uppercase tracking-wider transition-all duration-300 ${
                  isSelected 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Picks / Jump Back In Shelf (Fast-access 6-item Grid) */}
      {quickPicksList.length > 0 && (activeFilter === "All" || activeFilter === "For You") && (
        <section className="w-full max-w-7xl mb-10 md:mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-geist font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#FAFF00]" />
              Quick Picks & Jump Back In
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {quickPicksList.map((track: any, i: number) => (
              <div
                key={track.id + "-quick-" + i}
                onClick={() => handleItemClick(track, quickPicksList)}
                className="group flex items-center justify-between p-2.5 md:p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <Image
                      src={track.thumbnail}
                      alt={track.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs md:text-sm font-geist font-bold text-white truncate uppercase">
                      {track.title}
                    </h4>
                    <p className="text-[10px] md:text-xs font-geist text-white/50 truncate uppercase tracking-wider mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(track, quickPicksList);
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center shrink-0 transition-all duration-300 shadow-md group-hover:scale-105"
                >
                  <Play size={15} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Heavy Rotation / Featured 2-Card Hero (Orpheus Signature Aesthetic) */}
      {(activeFilter === "All" || activeFilter === "For You" || activeFilter === "Energize") && (
        <section className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {feed.topHits.map((item, i) => (
              <div 
                key={item.id} 
                className={`group flex flex-col items-center justify-center cursor-pointer p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-transform duration-500 hover:scale-[1.02] shadow-2xl relative overflow-hidden ${cardColors[i % cardColors.length]}`}
                onClick={() => handleItemClick(item, feed.topHits)}
              >
                <div className="absolute top-0 right-0 p-8 text-black/10 font-geist font-black text-9xl tracking-tighter leading-none pointer-events-none select-none">
                  {i + 1}
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-[260px] md:max-w-[280px] aspect-square rounded-full overflow-hidden shadow-2xl mb-8 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <Disc3 size={32} strokeWidth={2.5} fill="currentColor" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center relative z-10 w-full px-4">
                  <h3 className="font-geist font-black text-2xl md:text-3xl tracking-tight text-black truncate uppercase">
                    {item.title}
                  </h3>
                  <p className="font-geist text-xs md:text-sm font-bold text-black/70 tracking-widest uppercase mt-3 truncate flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                    Heavy Rotation & Global Top Mix
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Personalized "Made For You" Daily Mixes Shelf */}
      {(activeFilter === "All" || activeFilter === "For You") && (
        renderGridSection(
          "Curated For You",
          userProfile?.preferences?.length ? `Algorithmic blend based on ${userProfile.preferences.slice(0, 3).join(", ")}` : "Personalized daily recommendations",
          feed.curatedHits,
          5
        )
      )}

      {/* 6. "Because You Listen To [Favorite Artist]" Shelf */}
      {(activeFilter === "All" || activeFilter === "For You" || activeFilter === feed.favoriteArtistName) && feed.artistHits.length > 0 && (
        renderGridSection(
          `Because You Like ${feed.favoriteArtistName}`,
          `Deep cuts and similar frequencies from ${feed.favoriteArtistName}`,
          feed.artistHits,
          1
        )
      )}

      {/* 7. Atmosphere: Deep Focus & Flow */}
      {(activeFilter === "All" || activeFilter === "Focus" || activeFilter === "Chill") && (
        renderGridSection("Focus & Flow", "Ambient rhythms and lofi beats designed for pure focus", feed.chillHits, 4)
      )}

      {/* 8. Atmosphere: Gym & High Voltage Energy */}
      {(activeFilter === "All" || activeFilter === "Workout" || activeFilter === "Energize") && (
        renderGridSection("High Voltage", "Peak tempo, bass heavy playlists for workout and movement", feed.gymHits, 2)
      )}

      {/* 9. Atmosphere: Regional & Global Viral Hits */}
      {(activeFilter === "All" || activeFilter === "For You") && (
        renderGridSection("Trending Worldwide", "Chart leaders and viral momentum", feed.hindiHits, 3)
      )}

    </div>
  );
}


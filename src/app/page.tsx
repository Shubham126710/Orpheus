"use client";

import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Play, Disc3, LogOut, Sparkles, Radio, Music, Volume2, AudioLines } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

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

/**
 * Compact Studio Audio Level Meter
 * Reacts to live Web Audio Analyser when playing, or provides subtle ambient studio feedback.
 */
function HeaderAudioMeter() {
  const { isPlaying, analyser } = usePlayerStore();
  const [levels, setLevels] = useState([35, 60, 45, 80]);

  useEffect(() => {
    let animId: number;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const tick = () => {
      if (isPlaying && analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const b1 = Math.min(100, Math.max(15, (dataArray[2] / 255) * 100));
        const b2 = Math.min(100, Math.max(25, (dataArray[6] / 255) * 100));
        const b3 = Math.min(100, Math.max(20, (dataArray[12] / 255) * 100));
        const b4 = Math.min(100, Math.max(15, (dataArray[20] / 255) * 100));
        setLevels([b1, b2, b3, b4]);
      } else if (isPlaying) {
        const t = Date.now() / 140;
        setLevels([
          40 + Math.sin(t) * 30,
          65 + Math.cos(t * 1.3) * 25,
          50 + Math.sin(t * 0.8) * 35,
          70 + Math.cos(t * 1.7) * 20,
        ]);
      } else {
        setLevels([18, 18, 18, 18]);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, analyser]);

  return (
    <div className="flex items-end gap-1 h-4 w-5 px-0.5">
      {levels.map((lvl, idx) => (
        <span
          key={idx}
          className={`w-0.5 sm:w-1 rounded-full transition-all duration-75 ${
            isPlaying ? "bg-[#FAFF00] shadow-[0_0_8px_#FAFF00]" : "bg-white/20"
          }`}
          style={{ height: `${lvl}%` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { playTrack } = usePlayerStore();
  const { recentlyPlayed } = useLibraryStore();
  const { user, userProfile, loading, logout } = useAuth();
  
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

  // Time-of-day greeting with editorial refinement
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

  /**
   * Refined Music Shelf Renderer
   * Implements true album art presentation with glassmorphism hover and clean typography
   */
  const renderGridSection = (title: string, subtitle: string | null, items: any[]) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="w-full max-w-7xl mt-12 md:mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-geist font-black text-white tracking-widest uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm font-geist text-white/50 tracking-wider uppercase mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {items.map((item, i) => (
            <div 
              key={item.id + "-" + i} 
              className="group flex flex-col cursor-pointer transition-all duration-300"
              onClick={() => handleItemClick(item, items)}
            >
              {/* Artwork Container with Vinyl Edge & Elevation */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-lg group-hover:shadow-[0_16px_35px_rgba(0,0,0,0.85)] group-hover:border-[#FAFF00]/40 transition-all duration-500 mb-3">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  crossOrigin="anonymous"
                />
                
                {/* Subtle Inner Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Floating Play Trigger on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-[#FAFF00] text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    {item.type === 'PLAYLIST' || item.type === 'ALBUM' ? (
                      <Disc3 size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Content Type Pill */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider font-bold text-white/80 uppercase">
                  {item.type === 'PLAYLIST' ? 'Playlist' : (item.type === 'ALBUM' ? 'Album' : 'Track')}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0 px-0.5">
                <h3 className="font-geist font-bold text-xs sm:text-sm text-white group-hover:text-[#FAFF00] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="font-geist text-[11px] text-white/50 truncate mt-0.5">
                  {item.type === 'PLAYLIST' ? 'Curated Mix' : (item.type === 'ALBUM' ? 'Official Release' : item.artist)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen pt-8 md:pt-12 pb-44 md:pb-52 px-4 md:px-12 text-white items-center relative bg-[#050505]">
      
      {/* 1. Header & Identity Bar */}
      <header className="mb-6 md:mb-8 w-full flex justify-between items-center max-w-7xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FAFF00] animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.25em] text-[#FAFF00] uppercase">
              {greeting}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl tracking-tight font-geist font-black uppercase text-white">
            {userProfile?.displayName ? `${userProfile.displayName}` : "Orpheus"}
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Studio Status Pill with Audio Meter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-sm">
              <HeaderAudioMeter />
              <span className="text-xs font-geist font-bold tracking-wider uppercase text-white/80 hidden sm:inline">
                {userProfile?.preferences?.length ? `${userProfile.preferences.length} Tuned Mixes` : "Studio Active"}
              </span>
            </div>

            {user?.isGuest && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full hidden sm:inline">
                Guest Mode
              </span>
            )}

            <button 
              onClick={() => logout()}
              title="Sign Out / Reset Session"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </header>

      {/* 2. Mood & Genre Filter Pills */}
      <div className="w-full max-w-7xl mb-8 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 md:gap-3 w-max">
          {filterPills.map((pill) => {
            const isSelected = activeFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-geist font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? "bg-[#FAFF00] text-black shadow-[0_0_20px_rgba(250,255,0,0.4)] scale-105" 
                    : "bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Picks / Jump Back In Shelf */}
      {quickPicksList.length > 0 && (activeFilter === "All" || activeFilter === "For You") && (
        <section className="w-full max-w-7xl mb-10 md:mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-geist font-black text-white/90 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#FAFF00]" />
              Quick Picks & Jump Back In
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {quickPicksList.map((track: any, i: number) => (
              <div
                key={track.id + "-quick-" + i}
                onClick={() => handleItemClick(track, quickPicksList)}
                className="group flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900/90 border border-white/[0.08] hover:border-[#FAFF00]/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/5 group-hover:scale-105 transition-transform">
                    <Image
                      src={track.thumbnail}
                      alt={track.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs sm:text-sm font-geist font-bold text-white group-hover:text-[#FAFF00] transition-colors truncate">
                      {track.title}
                    </h4>
                    <p className="text-[11px] font-geist text-white/50 truncate tracking-wide mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(track, quickPicksList);
                  }}
                  title="Play track"
                  className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#FAFF00] text-white group-hover:text-black flex items-center justify-center shrink-0 transition-all duration-300 shadow-md group-hover:scale-105 cursor-pointer border border-white/10 group-hover:border-[#FAFF00]"
                >
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Heavy Rotation / Editorial Vinyl Releases (Signature Audio Experience) */}
      {(activeFilter === "All" || activeFilter === "For You" || activeFilter === "Energize") && (
        <section className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {feed.topHits.map((item, i) => (
              <div 
                key={item.id} 
                className="group relative flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-[#0B0B0E] to-black border border-white/10 hover:border-[#FAFF00]/40 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden cursor-pointer"
                onClick={() => handleItemClick(item, feed.topHits)}
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#FAFF00]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Left/Center: Vinyl Sleeve Showcase with peeking LP disc */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 mb-6 sm:mb-0 sm:mr-6 flex items-center justify-center">
                  {/* Vinyl LP Disc sticking out on hover */}
                  <div className="absolute top-1/2 left-3 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-zinc-950 border-4 border-zinc-800/80 shadow-2xl group-hover:translate-x-8 sm:group-hover:translate-x-12 transition-transform duration-700 ease-out flex items-center justify-center z-0 pointer-events-none">
                    <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full border border-white/5 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10 flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAFF00] text-black font-geist font-black text-[7px] sm:text-[8px] flex items-center justify-center uppercase tracking-tighter text-center shadow-inner">
                          ORPHEUS
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Album Cover Sleeve */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10 bg-zinc-900">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Disc Icon Badge */}
                    <div className="absolute bottom-2.5 left-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#FAFF00]">
                      <Disc3 size={16} className="animate-[spin_6s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                {/* Right: Curated Metadata & Primary Action */}
                <div className="flex-1 flex flex-col justify-center min-w-0 z-10 w-full text-center sm:text-left">
                  <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#FAFF00] uppercase">
                      HEAVY ROTATION · MIX 0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-geist font-black text-xl sm:text-2xl md:text-3xl tracking-tight text-white group-hover:text-[#FAFF00] transition-colors truncate uppercase">
                    {item.title}
                  </h3>

                  <p className="font-geist text-xs sm:text-sm text-white/50 tracking-wide mt-2 line-clamp-2">
                    Algorithmic deep frequency flow based on top charts and your acoustic profile.
                  </p>

                  <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
                    <button 
                      type="button"
                      className="inline-flex items-center gap-2 bg-[#FAFF00] hover:bg-white text-black px-6 py-2.5 rounded-full font-geist font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(250,255,0,0.35)] cursor-pointer"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Play Mix</span>
                    </button>
                    <span className="text-[11px] font-mono text-white/40 tracking-wider uppercase">
                      Curated Master
                    </span>
                  </div>
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
          feed.curatedHits
        )
      )}

      {/* 6. "Because You Listen To [Favorite Artist]" Shelf */}
      {(activeFilter === "All" || activeFilter === "For You" || activeFilter === feed.favoriteArtistName) && feed.artistHits.length > 0 && (
        renderGridSection(
          `Because You Like ${feed.favoriteArtistName}`,
          `Deep cuts and similar frequencies from ${feed.favoriteArtistName}`,
          feed.artistHits
        )
      )}

      {/* 7. Atmosphere: Deep Focus & Flow */}
      {(activeFilter === "All" || activeFilter === "Focus" || activeFilter === "Chill") && (
        renderGridSection(
          "Focus & Flow", 
          "Ambient rhythms and lofi beats designed for pure focus", 
          feed.chillHits
        )
      )}

      {/* 8. Atmosphere: Gym & High Voltage Energy */}
      {(activeFilter === "All" || activeFilter === "Workout" || activeFilter === "Energize") && (
        renderGridSection(
          "High Voltage", 
          "Peak tempo, bass heavy playlists for workout and movement", 
          feed.gymHits
        )
      )}

      {/* 9. Atmosphere: Regional & Global Viral Hits */}
      {(activeFilter === "All" || activeFilter === "For You") && (
        renderGridSection(
          "Trending Worldwide", 
          "Chart leaders and viral momentum", 
          feed.hindiHits
        )
      )}

    </div>
  );
}

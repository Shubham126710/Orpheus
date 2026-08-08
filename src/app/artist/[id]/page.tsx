"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Play, ArrowLeft, Disc3 } from "lucide-react";
import { usePlayerStore, Track } from "@/store/usePlayerStore";
import { useContextMenuStore } from "@/store/useContextMenuStore";

export default function ArtistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, setQueue } = usePlayerStore();
  const { openContextMenu } = useContextMenuStore();
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [showAllSingles, setShowAllSingles] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/artist?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setArtist(data);
        }
      } catch (err) {
        console.error("Failed to load artist", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchArtist();
  }, [id]);

  const handlePlayAll = () => {
    if (artist?.tracks?.length > 0) {
      setQueue(artist.tracks);
      playTrack(artist.tracks[0], artist.tracks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white/50 font-geist tracking-widest uppercase">
        Loading Artist...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white/50 font-geist">
        <p>Artist not found</p>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const getArtistTheme = (name: string) => {
    const themes = [
      { bg: "bg-[#FF3366]", text: "text-white", accent: "text-white/90", btn: "bg-white text-[#FF3366]", border: "border-white/30", highlight: "text-[#FF3366]" },
      { bg: "bg-[#00FF55]", text: "text-black", accent: "text-black/60", btn: "bg-black text-[#00FF55]", border: "border-black/20", highlight: "text-[#00FF55]" },
      { bg: "bg-[#7000FF]", text: "text-white", accent: "text-[#00FF55]", btn: "bg-[#00FF55] text-black", border: "border-white/20", highlight: "text-[#7000FF]" },
      { bg: "bg-[#FF9900]", text: "text-black", accent: "text-black/60", btn: "bg-black text-[#FF9900]", border: "border-black/20", highlight: "text-[#FF9900]" },
      { bg: "bg-[#00E5FF]", text: "text-black", accent: "text-black/60", btn: "bg-black text-[#00E5FF]", border: "border-black/20", highlight: "text-[#00E5FF]" },
      { bg: "bg-[#FF0055]", text: "text-white", accent: "text-white/90", btn: "bg-white text-[#FF0055]", border: "border-white/30", highlight: "text-[#FF0055]" },
      { bg: "bg-[#FFE600]", text: "text-black", accent: "text-black/60", btn: "bg-black text-[#FFE600]", border: "border-black/20", highlight: "text-[#FFE600]" }
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return themes[Math.abs(hash) % themes.length];
  };

  const theme = getArtistTheme(artist.name);

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

        {/* Artist Info */}
        <div className="flex flex-col items-center text-center w-full">
          <div className={`relative w-40 h-40 md:w-64 md:h-64 shadow-2xl rounded-full overflow-hidden mb-6 md:mb-8 border-4 ${theme.border}`}>
            <Image
              src={artist.thumbnail}
              alt={artist.name}
              fill
              className="object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <span className={`font-geist text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 ${theme.accent}`}>Verified Artist</span>
          <h1 className="font-geist font-black text-4xl md:text-7xl lg:text-9xl tracking-tighter mb-6 md:mb-8 uppercase leading-none break-words max-w-5xl px-2">{artist.name}</h1>
          
          <button 
            onClick={handlePlayAll}
            className={`w-40 h-14 md:w-48 md:h-16 rounded-full flex items-center justify-center gap-2 md:gap-3 font-geist font-black tracking-widest uppercase hover:scale-105 transition-transform shadow-xl ${theme.btn}`}
          >
            <Play size={20} fill="currentColor" /> Play
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-12 pt-12 md:pt-16 flex flex-col max-w-7xl mx-auto w-full">
        {/* About Artist Section */}
        {(artist.metadata || artist.description) && (
          <div className="flex flex-col items-center justify-center border-b border-white/5 pb-12 mb-12">
            {artist.metadata && (
              <div className="flex flex-wrap gap-2 md:gap-4 mb-8 justify-center">
                {artist.metadata.begin && (
                  <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 font-geist text-xs md:text-sm text-white/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={theme.highlight}>Started:</span> {artist.metadata.begin.split('-')[0]}
                  </div>
                )}
                {artist.metadata.country && (
                  <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 font-geist text-xs md:text-sm text-white/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={theme.highlight}>Origin:</span> {artist.metadata.country}
                  </div>
                )}
                {artist.metadata.genres && artist.metadata.genres.length > 0 && (
                  <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 font-geist text-xs md:text-sm text-white/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={theme.highlight}>Genre:</span> {artist.metadata.genres.join(', ')}
                  </div>
                )}
                <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 font-geist text-xs md:text-sm text-white/80 uppercase tracking-widest flex items-center gap-2">
                  <span className={theme.highlight}>Status:</span> {artist.metadata.ended ? 'Inactive' : 'Active'}
                </div>
              </div>
            )}
            
            {artist.description && (
              <p className="max-w-4xl text-center font-geist text-sm md:text-base leading-relaxed text-white/70 px-4">
                {artist.description}
              </p>
            )}
          </div>
        )}

        {/* Top Tracks */}
        {artist.tracks?.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-geist font-bold text-white uppercase tracking-widest">Popular Songs</h2>
              {artist.tracks.length > 5 && (
                <button 
                  onClick={() => setShowAllTracks(!showAllTracks)}
                  className="font-geist text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {showAllTracks ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {(showAllTracks ? artist.tracks : artist.tracks.slice(0, 5)).map((track: Track, index: number) => (
                <div 
                  key={track.id} 
                  onClick={() => playTrack(track, artist.tracks)}
                  onContextMenu={(e) => openContextMenu(e, track)}
                  className="group flex items-center justify-between p-3 md:p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4 w-full">
                    <span className="font-geist font-bold text-white/30 w-4 md:w-6 text-right shrink-0">{index + 1}</span>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0">
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
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-geist font-bold text-white truncate text-sm md:text-base">{track.title}</span>
                      <span className="font-geist text-[10px] md:text-xs text-white/50 uppercase tracking-wider truncate">{track.artist}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums (If available) */}
        {artist.albums?.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-geist font-bold text-white uppercase tracking-widest">Popular Albums</h2>
              {artist.albums.length > 4 && (
                <button 
                  onClick={() => setShowAllAlbums(!showAllAlbums)}
                  className="font-geist text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {showAllAlbums ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {(showAllAlbums ? artist.albums : artist.albums.slice(0, 4)).map((album: any) => (
                <div 
                  key={album.playlistId} 
                  onClick={() => router.push(`/playlist/${album.playlistId}`)}
                  className="group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden bg-white/5"
                >
                  <div className="relative w-full aspect-square rounded-[1.25rem] md:rounded-3xl overflow-hidden shadow-xl mb-4 md:mb-6">
                    <Image
                      src={album.thumbnails?.[album.thumbnails.length - 1]?.url || '/placeholder-art.jpg'}
                      alt={album.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#00FF55] text-black flex items-center justify-center shadow-lg">
                        <Disc3 size={18} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-geist font-black text-sm md:text-lg text-white truncate uppercase">{album.name}</h3>
                    <p className="font-geist text-[10px] md:text-xs font-bold text-white/50 uppercase mt-1 truncate">{album.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Singles (If available) */}
        {artist.singles?.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-geist font-bold text-white uppercase tracking-widest">Latest Singles</h2>
              {artist.singles.length > 4 && (
                <button 
                  onClick={() => setShowAllSingles(!showAllSingles)}
                  className="font-geist text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {showAllSingles ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {(showAllSingles ? artist.singles : artist.singles.slice(0, 4)).map((single: any) => (
                <div 
                  key={single.playlistId} 
                  onClick={() => router.push(`/playlist/${single.playlistId}`)}
                  className="group flex flex-col cursor-pointer p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden bg-white/5"
                >
                  <div className="relative w-full aspect-square rounded-[1.25rem] md:rounded-3xl overflow-hidden shadow-xl mb-4 md:mb-6">
                    <Image
                      src={single.thumbnails?.[single.thumbnails.length - 1]?.url || '/placeholder-art.jpg'}
                      alt={single.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#00FF55] text-black flex items-center justify-center shadow-lg">
                        <Disc3 size={18} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-geist font-black text-sm md:text-lg text-white truncate uppercase">{single.name}</h3>
                    <p className="font-geist text-[10px] md:text-xs font-bold text-white/50 uppercase mt-1 truncate">{single.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

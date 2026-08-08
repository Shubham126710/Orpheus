import { useState } from "react";
import { X, Plus, ListMusic } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import type { Track } from "@/store/usePlayerStore";

interface PlaylistModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaylistModal({ track, isOpen, onClose }: PlaylistModalProps) {
  const { playlists, createPlaylist, addTrackToPlaylist } = useLibraryStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), [track]);
      setNewPlaylistName("");
      setIsCreating(false);
      onClose();
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1A1A1A] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-geist font-bold text-white tracking-widest uppercase">
            Save to Playlist
          </h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {isCreating ? (
          <form onSubmit={handleCreate} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FAFF00] font-geist"
            />
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-xl font-geist font-bold uppercase tracking-widest text-xs text-white/70 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-3 rounded-xl font-geist font-bold uppercase tracking-widest text-xs bg-[#FAFF00] text-black disabled:opacity-50 transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto hide-scrollbar">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/20 text-white/70 hover:text-[#FAFF00] hover:border-[#FAFF00] hover:bg-[#FAFF00]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FAFF00]/10 transition-colors">
                <Plus size={20} />
              </div>
              <span className="font-geist font-bold tracking-wider text-sm">New Playlist</span>
            </button>

            {playlists.map((playlist) => {
              const hasTrack = playlist.tracks.some(t => t.id === track.id);
              return (
                <button
                  key={playlist.id}
                  onClick={() => !hasTrack && handleAddToPlaylist(playlist.id)}
                  disabled={hasTrack}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {playlist.tracks[0]?.thumbnail ? (
                      <img src={playlist.tracks[0].thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ListMusic size={18} className="text-white/50" />
                    )}
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-geist font-bold text-white text-sm truncate w-full text-left">
                      {playlist.name}
                    </span>
                    <span className="text-xs text-white/50">
                      {playlist.tracks.length} tracks {hasTrack && "• Already added"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

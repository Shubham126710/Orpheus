import { create } from 'zustand';
import { Track } from './usePlayerStore';

interface Position {
  x: number;
  y: number;
}

interface ContextMenuState {
  isOpen: boolean;
  position: Position;
  track: Track | null;
  openContextMenu: (e: React.MouseEvent, track: Track) => void;
  closeContextMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  track: null,
  openContextMenu: (e, track) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent menu from overflowing screen bounds
    const menuWidth = 200;
    const menuHeight = 150;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);
    
    set({
      isOpen: true,
      position: { x, y },
      track
    });
  },
  closeContextMenu: () => set({ isOpen: false, track: null })
}));

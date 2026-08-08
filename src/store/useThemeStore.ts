import { create } from 'zustand';

interface ThemeState {
  dominantColor: string;
  secondaryColor: string;
  setColors: (dominant: string, secondary?: string) => void;
  resetColors: () => void;
}

const defaultDominant = '#1D181C';
const defaultSecondary = '#2A2428';

export const useThemeStore = create<ThemeState>((set) => ({
  dominantColor: defaultDominant,
  secondaryColor: defaultSecondary,
  setColors: (dominant, secondary) => set({ 
    dominantColor: dominant, 
    secondaryColor: secondary || defaultSecondary 
  }),
  resetColors: () => set({ 
    dominantColor: defaultDominant, 
    secondaryColor: defaultSecondary 
  }),
}));

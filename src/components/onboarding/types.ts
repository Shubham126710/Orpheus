export type OnboardingStep = "auth" | "welcome" | "genres" | "artists" | "personalize" | "synthesis";

export interface GenreItem {
  id: string;
  name: string;
  tier: "hero" | "medium" | "small";
  iconName?: "guitar" | "waveform" | "trumpet" | "turntable" | "lyre" | "mic" | "cassette" | "lightning" | "equalizer" | "concentric" | "sparkles";
  // Responsive desktop dimensions & relative offsets (percentage based or rem)
  desktop: {
    size: number; // in pixels
    x: number; // percentage (0 - 100)
    y: number; // percentage (0 - 100)
  };
  // Responsive mobile dimensions & offsets
  mobile: {
    size: number;
    x: number;
    y: number;
  };
}

export interface ArtistItem {
  id: string;
  name: string;
  genre: string;
  tier: "hero" | "medium" | "small";
  imageUrl: string;
  desktop: {
    size: number;
    x: number;
    y: number;
  };
  mobile: {
    size: number;
    x: number;
    y: number;
  };
}

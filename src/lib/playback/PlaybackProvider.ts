import { Track } from "@/store/usePlayerStore";

export interface ProviderCapabilities {
  supportsBackgroundAudio: boolean;
  supportsMediaSession: boolean;
  supportsSeeking: boolean;
  supportsProgress: boolean;
}

export interface PlaybackProvider {
  readonly id: 'youtube' | 'direct';
  readonly capabilities: ProviderCapabilities;
  
  load(track: Track): void;
  play(): void;
  pause(): void;
  seekTo(time: number): void;
  setVolume(volume: number): void;
  
  getCurrentTime(): number;
  getDuration(): number;
  
  destroy(): void;
}

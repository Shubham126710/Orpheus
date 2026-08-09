import { Track } from "@/store/usePlayerStore";
import { PlaybackProvider, ProviderCapabilities } from "./PlaybackProvider";

export class DirectAudioPlaybackProvider implements PlaybackProvider {
  public readonly id = 'direct';
  
  public readonly capabilities: ProviderCapabilities = {
    // HTMLAudioElement legitimately supports background audio and media session integration
    supportsBackgroundAudio: true,
    supportsMediaSession: true,
    supportsSeeking: true,
    supportsProgress: true,
  };

  constructor(private audio: HTMLAudioElement) {}

  load(track: Track): void {
    // In a future direct provider, this would be `this.audio.src = getDirectStreamUrl(track.id);`
    // We keep the API surface ready for this.
    console.log(`Direct provider loading track: ${track.title}`);
  }

  play(): void {
    if (this.audio) {
      this.audio.play().catch(e => console.log('Direct audio play failed:', e));
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  seekTo(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}

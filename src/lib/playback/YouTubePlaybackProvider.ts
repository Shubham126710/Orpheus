import { Track } from "@/store/usePlayerStore";
import { PlaybackProvider, ProviderCapabilities } from "./PlaybackProvider";

export class YouTubePlaybackProvider implements PlaybackProvider {
  public readonly id = 'youtube';
  
  public readonly capabilities: ProviderCapabilities = {
    // YouTube IFrame API strictly cannot play in the background on mobile OS. 
    // We accurately report false so the UI doesn't lie to the user or attempt to bind Media Session.
    supportsBackgroundAudio: false,
    supportsMediaSession: false,
    supportsSeeking: true,
    supportsProgress: true,
  };

  constructor(private player: any) {}

  load(track: Track): void {
    if (this.player && typeof this.player.loadVideoById === 'function') {
      this.player.loadVideoById(track.id);
    }
  }

  play(): void {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
    }
  }

  pause(): void {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
  }

  seekTo(time: number): void {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(time, true);
    }
  }

  setVolume(volume: number): void {
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(volume * 100);
    }
  }

  getCurrentTime(): number {
    if (this.player && typeof this.player.getCurrentTime === 'function') {
      return this.player.getCurrentTime() || 0;
    }
    return 0;
  }

  getDuration(): number {
    if (this.player && typeof this.player.getDuration === 'function') {
      return this.player.getDuration() || 0;
    }
    return 0;
  }

  destroy(): void {
    // React-Youtube manages iframe unmounting internally.
  }
}

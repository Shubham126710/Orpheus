import { NextRequest, NextResponse } from 'next/server';
const YTMusic = require('ytmusic-api');

const ytm = new YTMusic();
let initialized = false;

async function getYTMusic() {
  if (!initialized) {
    await ytm.initialize();
    initialized = true;
  }
  return ytm;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Playlist/Album ID parameter "id" is required' }, { status: 400 });
  }

  try {
    const api = await getYTMusic();
    
    // Normalize ID by stripping VL if present to start fresh
    const normalizedId = id.startsWith('VL') ? id.substring(2) : id;

    let playlistInfo = {
      id: normalizedId,
      title: 'Playlist',
      description: 'A curated music collection.',
      thumbnail: '/placeholder-art.jpg',
    };
    let tracks: any[] = [];
    let isAlbum = false;

    // 1. Try to get Playlist Metadata first
    try {
      const playlist = await api.getPlaylist(normalizedId);
      if (playlist && playlist.name) {
        playlistInfo.title = playlist.name;
        playlistInfo.description = playlist.description || playlistInfo.description;
        playlistInfo.thumbnail = playlist.thumbnails?.[playlist.thumbnails.length - 1]?.url || playlistInfo.thumbnail;
      }
    } catch (err) {
      console.log(`[API] Failed to fetch playlist metadata for ${normalizedId}, using generic metadata`);
    }

    // 2. Try to get Playlist Videos
    try {
      // ytmusic-api requires VL prefix for RD mixes, but auto-adds it for PL
      let videoFetchId = normalizedId;
      if (videoFetchId.startsWith('RD')) {
        videoFetchId = 'VL' + videoFetchId;
      }
      const videos = await api.getPlaylistVideos(videoFetchId);
      if (videos && videos.length > 0) {
        tracks = videos;
      } else {
        throw new Error('No videos returned');
      }
    } catch (videoErr) {
      console.log(`[API] Failed to fetch playlist videos for ${normalizedId}, trying as Album...`);
      // 3. Fallback to Album
      try {
        const album = await api.getAlbum(normalizedId);
        if (album) {
          playlistInfo.title = album.name || playlistInfo.title;
          playlistInfo.description = `Album by ${album.artist?.name || 'Unknown Artist'} • ${album.year || ''}`;
          playlistInfo.thumbnail = album.thumbnails?.[album.thumbnails.length - 1]?.url || playlistInfo.thumbnail;
          tracks = album.songs || [];
          isAlbum = true;
        }
      } catch (albumErr) {
        console.error(`[API] Failed to fetch as album as well for ${normalizedId}`);
        throw new Error('Failed to fetch as both playlist and album');
      }
    }

    // If metadata was broken but we got tracks, extract thumbnail from first track if possible
    if (playlistInfo.title === 'Playlist' && tracks.length > 0) {
      const firstTrack = tracks[0] as any;
      if (firstTrack.thumbnails && firstTrack.thumbnails.length > 0) {
        playlistInfo.thumbnail = firstTrack.thumbnails[firstTrack.thumbnails.length - 1].url;
      }
    }

    // Format tracks
    const formattedTracks = tracks.map((item: any) => ({
      id: item.videoId,
      title: item.name || item.title || 'Unknown Title',
      artist: item.artist?.name || item.artists?.[0]?.name || 'Unknown Artist',
      thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || playlistInfo.thumbnail || '/placeholder-art.jpg',
      duration: item.duration || 0,
      type: 'SONG'
    }));

    return NextResponse.json({
      ...playlistInfo,
      tracks: formattedTracks,
    });
  } catch (error) {
    console.error('Playlist/Album route final error:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist or album' }, { status: 500 });
  }
}

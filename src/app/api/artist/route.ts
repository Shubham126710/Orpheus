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

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Artist ID parameter "id" is required' }, { status: 400 });
  }

  try {
    const api = await getYTMusic();
    const artist = await api.getArtist(id);

    // Format top tracks
    const formattedTracks = (artist.topSongs || []).map((item: any) => ({
      id: item.videoId,
      title: item.name,
      artist: artist.name, // The top songs usually belong to this artist
      thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || '/placeholder-art.jpg',
      duration: item.duration || 0,
      type: 'SONG'
    }));

    // Fetch rich metadata from MusicBrainz API
    let mbData = null;
    try {
      const mbRes = await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artist.name)}&fmt=json`, {
        headers: {
          'User-Agent': 'OrpheusMusic/1.0.0'
        }
      });
      if (mbRes.ok) {
        const mbJson = await mbRes.json();
        if (mbJson.artists && mbJson.artists.length > 0) {
          const mbArtist = mbJson.artists[0];
          mbData = {
            begin: mbArtist['life-span']?.begin,
            end: mbArtist['life-span']?.end,
            ended: mbArtist['life-span']?.ended,
            country: mbArtist.country,
            genres: mbArtist.tags ? mbArtist.tags.map((t: any) => t.name).slice(0, 3) : []
          };
        }
      }
    } catch (e) {
      console.warn("Failed to fetch MusicBrainz data", e);
    }

    return NextResponse.json({
      id: artist.artistId,
      name: artist.name,
      description: artist.description || '',
      thumbnail: artist.thumbnails?.[artist.thumbnails.length - 1]?.url || '/placeholder-art.jpg',
      tracks: formattedTracks,
      albums: artist.topAlbums || artist.albums || [],
      singles: artist.topSingles || artist.singles || [],
      metadata: mbData
    });
  } catch (error) {
    console.error('Artist error:', error);
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}

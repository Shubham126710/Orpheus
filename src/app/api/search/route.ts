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
  const query = searchParams.get('q');
  const filter = searchParams.get('filter'); // 'SONG', 'VIDEO', 'ALBUM', 'ARTIST', 'PLAYLIST'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const api = await getYTMusic();
    
    // Fetch general search and artist-specific search in parallel
    const [rawResults, artistResults] = await Promise.all([
      api.search(query),
      api.searchArtists(query).catch(() => []) // Fallback in case artist search fails
    ]);

    let results = rawResults;

    // Prioritize the top authentic artist from searchArtists
    if (artistResults && artistResults.length > 0) {
      const topArtist = artistResults[0];
      // Remove any inferior artist results to prevent duplicates or fake accounts
      const filtered = results.filter((r: any) => r.type !== 'ARTIST');
      // Inject the verified top artist at the very beginning
      filtered.unshift(topArtist);
      results = filtered;
    }

    let filteredResults = results;
    if (filter) {
      filteredResults = results.filter((item: any) => item.type === filter);
    }

    const formattedResults = filteredResults.slice(0, 20).map((item: any) => {
      // Map based on type
      if (item.type === 'SONG' || item.type === 'VIDEO') {
        return {
          id: item.videoId,
          title: item.name,
          artist: item.artist?.name || 'Unknown Artist',
          thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || '/placeholder-art.jpg',
          duration: item.duration || 0,
          type: item.type
        };
      } else if (item.type === 'PLAYLIST' || item.type === 'ALBUM') {
        return {
          id: item.playlistId,
          title: item.name,
          artist: item.artist?.name || 'Various Artists',
          thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || '/placeholder-art.jpg',
          type: item.type
        };
      } else if (item.type === 'ARTIST') {
        return {
          id: item.artistId,
          title: item.name,
          artist: 'Artist',
          thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || '/placeholder-art.jpg',
          type: item.type
        };
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search YouTube Music' }, { status: 500 });
  }
}

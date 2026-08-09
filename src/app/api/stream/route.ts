import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Use youtube-dl-exec (which downloads and runs the latest yt-dlp standalone binary)
    // This perfectly bypasses Node 20+ undici HTTP bugs AND YouTube's cipher changes!
    const output: any = await youtubedl(videoUrl, {
      dumpJson: true,
      noWarnings: true,
      callHome: false,
      noCheckCertificates: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: 'https://www.youtube.com/'
    });

    // Extract the best audio-only format
    const formats = output.formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none');
    const bestAudio = formats.sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0))[0];

    if (!bestAudio || !bestAudio.url) {
      throw new Error('No valid audio stream found');
    }

    // Proxy the audio stream through our Vercel server to bypass IP-binding restrictions!
    // Since yt-dlp gets the URL using Vercel's IP, we MUST download it from Vercel's IP.
    const audioResponse = await fetch(bestAudio.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Range': request.headers.get('range') || 'bytes=0-',
      },
    });

    // Pipe the audio stream directly to the client
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
    headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/webm');
    
    if (audioResponse.status === 206) {
      headers.set('Content-Range', audioResponse.headers.get('Content-Range') || '');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', audioResponse.headers.get('Content-Length') || '');
    }

    return new Response(audioResponse.body, {
      status: audioResponse.status,
      headers,
    });
  } catch (error: any) {
    console.error("Stream extraction error:", error);
    return NextResponse.json(
      { error: 'Failed to extract audio stream', details: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

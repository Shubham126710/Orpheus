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

    // Set CORS headers for the client and Web Audio API
    return NextResponse.json({ url: bestAudio.url }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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

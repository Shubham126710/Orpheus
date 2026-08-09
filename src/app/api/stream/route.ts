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
    // Use youtube-dl-exec (which downloads and runs the latest yt-dlp standalone binary)
    // This perfectly bypasses Node 20+ undici HTTP bugs AND YouTube's cipher changes!
    const output: any = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      // CRITICAL FOR iOS: We MUST force m4a (aac). iOS WebKit cannot decode WebM/Opus.
      format: 'bestaudio[ext=m4a]/bestaudio[vcodec=none]/best',
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
      },
    });

    // Pipe the audio stream directly to the client
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mp4');
    
    // We explicitly DO NOT set Accept-Ranges: bytes.
    // This forces iOS Safari to download the entire audio file in a single connection.

    return new Response(audioResponse.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.warn("Primary yt-dlp extraction failed. Triggering server-side failovers...", error);
    
    const pipedInstances = [
      `https://pipedapi.kavin.rocks/streams/${videoId}`,
      `https://pipedapi.syncpundit.io/streams/${videoId}`,
      `https://api.piped.projectsegfau.lt/streams/${videoId}`
    ];

    for (const instance of pipedInstances) {
      try {
        const res = await fetch(instance);
        if (!res.ok) continue;
        const data = await res.json();
        const audio = data.audioStreams.find((s: any) => s.mimeType.startsWith('audio/mp4') || s.mimeType.startsWith('audio/webm'));
        if (audio && audio.url) {
          console.log(`Successfully failed over to Piped instance: ${instance}`);
          
          const audioResponse = await fetch(audio.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });

          const headers = new Headers();
          headers.set('Access-Control-Allow-Origin', '*');
          headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mp4');
          
          // We explicitly DO NOT set Accept-Ranges: bytes.
          // This forces iOS Safari to download the entire 3MB audio file in a single connection,
          // preventing it from making hundreds of chunked Range requests which would spin up hundreds of serverless lambdas.

          return new Response(audioResponse.body, { status: 200, headers });
        }
      } catch (failoverError) {
        console.warn(`Failover instance ${instance} failed. Trying next...`);
      }
    }

    console.error("All stream extraction failovers failed.");
    return NextResponse.json(
      { error: "Failed to extract stream URL" },
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

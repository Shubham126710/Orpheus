import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';

// Global cache to store extracted YouTube URLs so we don't re-run yt-dlp on every Range request chunk!
const urlCache = new Map<string, { url: string, expires: number }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    let streamUrl = '';
    const now = Date.now();
    
    // Check if we already extracted this URL recently (within the last 1 hour)
    if (urlCache.has(videoId) && urlCache.get(videoId)!.expires > now) {
      streamUrl = urlCache.get(videoId)!.url;
      console.log(`Using cached stream URL for ${videoId}`);
    } else {
      console.log(`Extracting fresh stream URL for ${videoId}...`);
      // Use youtube-dl-exec (which downloads and runs the latest yt-dlp standalone binary)
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

      const formats = output.formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none');
      const bestAudio = formats.sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0))[0];

      if (!bestAudio || !bestAudio.url) {
        throw new Error('No valid audio stream found');
      }
      
      streamUrl = bestAudio.url;
      // YouTube URLs are typically valid for 6 hours. Cache it for 1 hour to be safe.
      urlCache.set(videoId, { url: streamUrl, expires: now + 3600 * 1000 });
    }

    // Proxy the audio stream through our Vercel server to bypass IP-binding restrictions!
    const audioResponse = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Range': request.headers.get('range') || 'bytes=0-',
      },
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
    headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mp4');
    
    // CRITICAL FOR iOS: We MUST support Range requests and return 206 Partial Content!
    // iOS Safari strictly refuses to play media files that respond with a flat 200 OK.
    if (audioResponse.status === 206) {
      headers.set('Content-Range', audioResponse.headers.get('Content-Range') || '');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', audioResponse.headers.get('Content-Length') || '');
    } else {
      // If YouTube returned 200, we must pass the Content-Length so iOS knows the file size
      headers.set('Content-Length', audioResponse.headers.get('Content-Length') || '');
      headers.set('Accept-Ranges', 'bytes');
    }

    return new Response(audioResponse.body, {
      status: audioResponse.status,
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

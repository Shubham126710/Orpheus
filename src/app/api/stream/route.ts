import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';

// Safely resolve the yt-dlp binary path to prevent ENOENT errors in Next.js Server environments
const yt = create(path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp'));

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // Get the direct media URL from yt-dlp
    // By redirecting to the direct googlevideo URL, we allow the browser to natively handle
    // byte-range requests (seeking), buffering, and Content-Length seamlessly!
    const info = await yt(`https://www.youtube.com/watch?v=${id}`, {
      dumpSingleJson: true,
      noWarnings: true,
      format: '140/bestaudio[ext=m4a]/bestaudio/best', // Priority: m4a > any audio > best video
    }) as any;

    if (!info || !info.url) {
      throw new Error("No URL found in yt-dlp output");
    }

    // Proxy the request through our server to hide the IP mismatch from YouTube.
    // We pass the browser's Range header directly to YouTube's CDN so seeking works natively!
    const rangeHeader = request.headers.get('range');
    const fetchHeaders: Record<string, string> = {};
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const mediaResponse = await fetch(info.url, {
      headers: fetchHeaders
    });

    const responseHeaders = new Headers(mediaResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(mediaResponse.body, {
      status: mediaResponse.status,
      statusText: mediaResponse.statusText,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('Stream API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stream' }, { status: 500 });
  }
}

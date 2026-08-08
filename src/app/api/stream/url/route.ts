import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs';

// Use the standalone linux binary on Vercel, otherwise use the default
const binaryName = process.env.VERCEL ? 'yt-dlp_linux' : 'yt-dlp';
const binaryPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binaryName);

try {
  // Ensure the binary has execution permissions in the Vercel serverless environment
  if (fs.existsSync(binaryPath)) {
    fs.chmodSync(binaryPath, 0o755);
  }
} catch (e) {
  console.warn("Failed to chmod yt-dlp binary:", e);
}

const yt = create(binaryPath);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const info = await yt(`https://www.youtube.com/watch?v=${id}`, {
      dumpSingleJson: true,
      noWarnings: true,
      format: '140/bestaudio[ext=m4a]/bestaudio/best',
      forceIpv6: true, // Bypass Vercel AWS IPv4 bans
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      ]
    }) as any;

    if (!info || !info.url) {
      throw new Error("No URL found in yt-dlp output");
    }

    return NextResponse.json({ url: info.url });
  } catch (error) {
    console.error('URL extraction error:', error);
    return NextResponse.json({ error: 'Failed to extract URL' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';

// Use the standalone linux binary on Vercel, otherwise use the default
const binaryName = process.env.VERCEL ? 'yt-dlp_linux' : 'yt-dlp';
const yt = create(path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binaryName));

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

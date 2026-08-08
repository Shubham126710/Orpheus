import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs';

// Find the binary in node_modules, accommodating for possible different filenames across OS
let binaryPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp');
if (!fs.existsSync(binaryPath) && fs.existsSync(binaryPath + '_linux')) {
  binaryPath += '_linux';
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
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      ]
    }) as any;

    if (!info || !info.url) {
      throw new Error("Could not extract URL");
    }

    return NextResponse.json({ url: info.url });

  } catch (error) {
    console.error('Error extracting stream URL:', error);
    return NextResponse.json({ error: 'Failed to extract audio stream' }, { status: 500 });
  }
}

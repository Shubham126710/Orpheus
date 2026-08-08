import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto-js';

// JioSaavn uses DES in ECB mode with this public key
const KEY = crypto.enc.Utf8.parse('38346591');

function decryptUrl(encryptedUrl: string) {
  const decrypted = crypto.DES.decrypt(
    { ciphertext: crypto.enc.Base64.parse(encryptedUrl) } as any,
    KEY,
    {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    }
  );
  
  const url = decrypted.toString(crypto.enc.Utf8);
  // JioSaavn provides various qualities. We upgrade to 320kbps for best experience.
  return url.replace('_96.mp4', '_320.mp4').replace('_160.mp4', '_320.mp4');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // 1. Search for the exact song on JioSaavn
    const searchRes = await fetch(`https://www.jiosaavn.com/api.php?__call=autocomplete.get&query=${encodeURIComponent(query)}&_format=json&_marker=0&ctx=web6dot0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    
    if (!searchRes.ok) throw new Error('Failed to fetch from JioSaavn');
    const searchData = await searchRes.json();
    
    if (!searchData.songs || !searchData.songs.data || searchData.songs.data.length === 0) {
      return NextResponse.json({ error: 'Song not found on JioSaavn' }, { status: 404 });
    }
    
    const songId = searchData.songs.data[0].id;

    // 2. Fetch the song details to get the encrypted media URL
    const detailsRes = await fetch(`https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${songId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    
    if (!detailsRes.ok) throw new Error('Failed to fetch details from JioSaavn');
    const detailsData = await detailsRes.json();
    
    const songDetails = detailsData[songId];
    if (!songDetails || !songDetails.encrypted_media_url) {
      return NextResponse.json({ error: 'Failed to extract media URL' }, { status: 500 });
    }

    // 3. Decrypt the URL
    const streamUrl = decryptUrl(songDetails.encrypted_media_url);

    return NextResponse.json({ url: streamUrl });

  } catch (error) {
    console.error('Error fetching Saavn stream:', error);
    return NextResponse.json({ error: 'Failed to extract audio stream' }, { status: 500 });
  }
}

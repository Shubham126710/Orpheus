import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Stream URL is required' }, { status: 400 });
  }

  try {
    const rangeHeader = request.headers.get('range');
    const fetchHeaders: Record<string, string> = {};
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const mediaResponse = await fetch(url, {
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
    console.error('Proxy API error:', error);
    return NextResponse.json({ error: 'Failed to proxy stream' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const remote = searchParams.get('url');
  if (!remote) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  // 1. Fetch the remote image
  const r = await fetch(remote, { method: 'GET' });
  if (!r.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 2. Create the response with the same bytes
  const blob = await r.blob();

  // 3. Force download & mobile-friendly filename
  const headers = new Headers();
  headers.set('Content-Type', blob.type);
  headers.set(
    'Content-Disposition',
    'attachment; filename="voxastudio-transformed-image.png"'
  );

  return new Response(blob, { headers });
}
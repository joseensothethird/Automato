import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID;

  if (!clientId) {
    console.error('Missing NEXT_PUBLIC_TIKTOK_CLIENT_ID');
    return NextResponse.json({ error: 'Missing client ID' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/auth/callback`;

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize');
  authUrl.searchParams.append('client_key', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', [
    'user.info.basic',
    'video.upload',
    'video.publish',
  ].join(','));
  authUrl.searchParams.append('state', 'tiktok');

  return NextResponse.json({ url: authUrl.toString() });
}
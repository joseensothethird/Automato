import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
  
  const redirectUri = 'http://localhost:3000/auth/callback';
  
  if (!clientId) {
    console.error('Missing YouTube Client ID');
    return NextResponse.json({ error: 'Missing client ID' }, { status: 500 });
  }
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.upload');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  authUrl.searchParams.append('state', 'youtube');
  
  return NextResponse.json({ url: authUrl.toString() });
}
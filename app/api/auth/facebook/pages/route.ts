// app/api/facebook/pages/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 400 });
  }
  
  const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
  const pages = await response.json();
  
  return NextResponse.json(pages);
}
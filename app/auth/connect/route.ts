import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { platform } = await request.json();
    
    if (platform === 'youtube') {
      // Use the correct environment variable name
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      
      if (!clientId) {
        console.error('Missing GOOGLE_CLIENT_ID in environment variables');
        return NextResponse.json({ 
          error: 'YouTube OAuth is not configured. Missing client ID.' 
        }, { status: 500 });
      }
      
      // Determine the correct redirect URI based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const redirectUri = isProduction
        ? process.env.YOUTUBE_REDIRECT_URI_PROD || 'https://automatoes.vercel.app/api/auth/youtube/callback'
        : process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/auth/youtube/callback';
      
      // Build the OAuth URL with proper encoding
      const scope = encodeURIComponent('https://www.googleapis.com/auth/youtube.upload');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent`;
      
      console.log('Generated YouTube OAuth URL:', authUrl);
      
      return NextResponse.json({ authUrl });
    }
    
    if (platform === 'facebook') {
      const clientId = process.env.FACEBOOK_APP_ID;
      
      if (!clientId) {
        console.error('Missing FACEBOOK_APP_ID in environment variables');
        return NextResponse.json({ 
          error: 'Facebook OAuth is not configured. Missing app ID.' 
        }, { status: 500 });
      }
      
      const isProduction = process.env.NODE_ENV === 'production';
      const redirectUri = isProduction
        ? process.env.FACEBOOK_REDIRECT_URI_PROD || 'https://automatoes.vercel.app/api/auth/callback/facebook'
        : process.env.FACEBOOK_REDIRECT_URI_LOCAL || 'http://localhost:3000/api/auth/callback/facebook';
      
      const scope = encodeURIComponent('pages_manage_posts,pages_read_engagement,pages_show_list,public_profile');
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scope}` +
        `&response_type=code`;
      
      return NextResponse.json({ authUrl });
    }
    
    if (platform === 'tiktok') {
      const clientId = process.env.TIKTOK_CLIENT_ID;
      
      if (!clientId) {
        console.error('Missing TIKTOK_CLIENT_ID in environment variables');
        return NextResponse.json({ 
          error: 'TikTok OAuth is not configured. Missing client ID.' 
        }, { status: 500 });
      }
      
      const isProduction = process.env.NODE_ENV === 'production';
      const redirectUri = isProduction
        ? process.env.TIKTOK_REDIRECT_URI_PROD || 'https://automatoes.vercel.app/api/auth/tiktok/callback'
        : process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/auth/tiktok/callback';
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
        `?client_key=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=user.info.basic,video.upload`;
      
      return NextResponse.json({ authUrl });
    }
    
    return NextResponse.json({ 
      error: `Unsupported platform: ${platform}` 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Social connect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Server error', 
      details: errorMessage 
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getStoredToken(platform: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(`${platform}_access_token`)?.value;
    return token || null;
  } catch (error) {
    console.error(`Error getting ${platform} token:`, error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }
    
    const accessToken = await getStoredToken('youtube');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with YouTube. Please connect your account first.' },
        { status: 401 }
      );
    }
    
    // Return mock stats for now
    return NextResponse.json({ 
      success: true, 
      stats: {
        videoId: videoId,
        title: 'Sample Video',
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 100),
        publishedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('YouTube stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
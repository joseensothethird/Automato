import { NextResponse } from 'next/server';
import { getStoredToken } from '@/lib/token-storage';

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
    
    // Get stored access token
    const accessToken = await getStoredToken('youtube');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with YouTube. Please connect your account first.' },
        { status: 401 }
      );
    }
    
    // YouTube API call to get video stats
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    const data = await statsResponse.json();
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: statsResponse.status }
      );
    }
    
    const video = data.items?.[0];
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    const stats = {
      videoId: video.id,
      title: video.snippet?.title,
      views: video.statistics?.viewCount || 0,
      likes: video.statistics?.likeCount || 0,
      comments: video.statistics?.commentCount || 0,
      shares: video.statistics?.shareCount || 0,
      publishedAt: video.snippet?.publishedAt,
    };
    
    return NextResponse.json({ success: true, stats });
    
  } catch (error) {
    console.error('YouTube stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
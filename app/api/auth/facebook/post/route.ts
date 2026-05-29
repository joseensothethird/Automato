// app/api/auth/facebook/post/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { pageId, accessToken, videoUrl, caption } = await request.json();
  
  try {
    // For video posts
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        description: caption,
        file_url: videoUrl, // Or use actual file upload
        title: caption.substring(0, 100)
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return NextResponse.json({ success: true, postId: result.id });
    
  } catch (error) {
    console.error('Facebook post error:', error);
    // Fix: Handle error safely without accessing .message directly
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
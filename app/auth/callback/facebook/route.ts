import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error'); // Renamed to avoid confusion with catch error
  
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = isProduction 
    ? 'https://automatoes.vercel.app' 
    : 'http://localhost:3000';
  
  const redirectUri = isProduction
    ? process.env.FACEBOOK_REDIRECT_URI_PROD
    : process.env.FACEBOOK_REDIRECT_URI_LOCAL;
  
  if (errorParam) {
    console.error('Facebook OAuth error:', errorParam);
    return NextResponse.redirect(`${origin}?error=facebook_auth_failed&details=${errorParam}`);
  }
  
  if (!code) {
    console.error('No code received from Facebook');
    return NextResponse.redirect(`${origin}?error=facebook_no_code`);
  }
  
  try {
    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;
    
    const tokenResponse = await fetch(tokenUrl);
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error.message);
    }
    
    // Get user's pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokens.access_token}`);
    const pagesData = await pagesResponse.json();
    
    const firstPage = pagesData.data?.[0];
    const pageAccessToken = firstPage?.access_token;
    const pageId = firstPage?.id;
    const pageName = firstPage?.name;
    
    // Return HTML that sends message back to your app
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facebook Connected</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h3 { color: #1877F2; margin-bottom: 10px; }
          p { color: #666; margin-bottom: 20px; }
          .success { color: #4caf50; font-size: 48px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✓</div>
          <h3>Successfully Connected to Facebook!</h3>
          <p>Page: ${pageName || 'Your Facebook Page'}</p>
          <p>You can close this window and return to AutoPost.</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: true,
              accessToken: '${pageAccessToken}',
              pageId: '${pageId}',
              pageName: '${pageName}',
              userAccessToken: '${tokens.access_token}'
            }, '${origin}');
          }
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
    
  } catch (err) { // Changed from 'error' to 'err' to avoid confusion
    console.error('Facebook token exchange error:', err);
    
    // Safely get error message
    let errorMessage = 'An unknown error occurred';
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facebook Connection Failed</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h3 { color: #dc2626; margin-bottom: 10px; }
          p { color: #666; margin-bottom: 20px; }
          .error { color: #ef4444; font-size: 48px; margin-bottom: 20px; }
          button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">✗</div>
          <h3>Connection Failed</h3>
          <p>${errorMessage}</p>
          <button onclick="window.close()">Close Window</button>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: false,
              error: '${errorMessage.replace(/'/g, "\\'")}'
            }, '${origin}');
          }
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  // Determine the app URL
  const isProduction = process.env.NODE_ENV === 'production';
  const appUrl = isProduction 
    ? 'https://automatoes.vercel.app'
    : 'http://localhost:3000';
  
  if (error) {
    console.error('Facebook OAuth error:', error);
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
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-width: 400px;
          }
          .error { color: #ef4444; font-size: 3rem; margin-bottom: 1rem; }
          h3 { color: #dc2626; margin-bottom: 0.5rem; }
          p { color: #666; margin-bottom: 1rem; }
          button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
          }
          button:hover { background: #2563eb; }
        </style>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: false,
              error: '${error.replace(/'/g, "\\'")}'
            }, '${appUrl}');
          }
        </script>
      </head>
      <body>
        <div class="container">
          <div class="error">✗</div>
          <h3>Connection Failed</h3>
          <p>Error: ${error}</p>
          <button onclick="window.close()">Close Window</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  if (!code) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>No Authorization Code</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .error { color: #ef4444; font-size: 3rem; margin-bottom: 1rem; }
        </style>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: false,
              error: 'No authorization code received'
            }, '${appUrl}');
          }
          setTimeout(() => window.close(), 2000);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="error">✗</div>
          <h3>No Authorization Code</h3>
          <p>Please try again.</p>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  try {
    // Determine which redirect URI to use
    const redirectUri = isProduction
      ? process.env.FACEBOOK_REDIRECT_URI_PROD || 'https://automatoes.vercel.app/api/auth/callback/facebook'
      : process.env.FACEBOOK_REDIRECT_URI_LOCAL || 'http://localhost:3000/api/auth/callback/facebook';
    
    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;
    
    console.log('Token exchange URL:', tokenUrl);
    
    const tokenResponse = await fetch(tokenUrl);
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error.message);
    }
    
    // Get user's pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokens.access_token}`);
    const pagesData = await pagesResponse.json();
    
    if (pagesData.error) {
      throw new Error(pagesData.error.message);
    }
    
    const firstPage = pagesData.data?.[0];
    const pageAccessToken = firstPage?.access_token;
    const pageId = firstPage?.id;
    const pageName = firstPage?.name;
    
    // Return success HTML page
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
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .success { color: #10b981; font-size: 3rem; margin-bottom: 1rem; }
          h3 { color: #1877F2; margin-bottom: 0.5rem; }
          p { color: #666; margin-bottom: 0.5rem; }
        </style>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: true,
              accessToken: '${pageAccessToken}',
              pageId: '${pageId}',
              pageName: '${pageName?.replace(/'/g, "\\'") || ''}'
            }, '${appUrl}');
          }
          setTimeout(() => window.close(), 1500);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="success">✓</div>
          <h3>Connected to Facebook!</h3>
          <p>Page: <strong>${pageName || 'Your Facebook Page'}</strong></p>
          <p>You can close this window and return to AutoPost.</p>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (err) {
    console.error('Facebook token exchange error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    
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
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .error { color: #ef4444; font-size: 3rem; margin-bottom: 1rem; }
        </style>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              platform: 'facebook',
              success: false,
              error: '${errorMessage.replace(/'/g, "\\'")}'
            }, '${appUrl}');
          }
        </script>
      </head>
      <body>
        <div class="container">
          <div class="error">✗</div>
          <h3>Connection Failed</h3>
          <p>${errorMessage}</p>
          <button onclick="window.close()">Close Window</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
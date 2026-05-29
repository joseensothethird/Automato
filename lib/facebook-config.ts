// lib/facebook-config.ts

export const getFacebookConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: isProduction 
      ? process.env.FACEBOOK_REDIRECT_URI_PROD || 'https://automatoes.vercel.app/api/auth/callback/facebook'
      : process.env.FACEBOOK_REDIRECT_URI_LOCAL || 'http://localhost:3000/api/auth/callback/facebook',
    isProduction
  };
};
import { cookies } from 'next/headers';

export async function getStoredToken(platform: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(`${platform}_access_token`)?.value;
    return token || null;
  } catch (error) {
    console.error(`Error getting ${platform} token:`, error);
    return null;
  }
}

export async function setStoredToken(platform: string, token: string, expiresIn?: number) {
  const cookieStore = await cookies();
  cookieStore.set(`${platform}_access_token`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresIn || 3600,
  });
}

export async function removeStoredToken(platform: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`${platform}_access_token`);
}
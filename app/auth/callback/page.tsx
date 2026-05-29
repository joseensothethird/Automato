'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code  = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (!window.opener) return;

    window.opener.postMessage(
      {
        type:     'oauth-callback',
        platform: state || 'unknown',
        success:  !!code && !error,
        code:     code  ?? undefined,
        error:    error ?? undefined,
      },
      window.location.origin
    );

    setTimeout(() => window.close(), 800);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-muted">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
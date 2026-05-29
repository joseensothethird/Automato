'use client';

import { useState, ReactNode } from 'react';

// Type definitions
interface PlatformItemProps {
  platform: string;
  label: string;
  connected: boolean;
  onConnect: (platform: string, accessToken?: string | null, isDisconnect?: boolean) => Promise<void> | void;
  selected?: boolean;
  onToggle?: (platform: string) => void;
  showCheckbox?: boolean;
  color?: string;
  bgColor?: string;
}

interface BrandColor {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  hoverBorder: string;
}

// SVG logos for each platform
const PlatformLogos: Record<string, ReactNode> = {
  youtube: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  facebook: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v3.03c-1.49-.05-2.97-.36-4.36-1.09v5.99c-.03 4.63-3.9 8.37-8.54 8.23-2.22-.07-4.31-.96-5.85-2.41-1.88-1.76-2.93-4.21-2.86-6.78.17-4.72 4.07-8.46 8.8-8.31.12 1.15.37 2.28.78 3.35-1.87.12-3.66.71-5.06 1.75-.97.72-1.69 1.65-2.16 2.72-.47 1.07-.71 2.22-.69 3.38.04 2.26 1.31 4.28 3.31 5.38 1.17.65 2.5.97 3.84.94 1.09-.03 2.17-.24 3.17-.66 1.24-.52 2.27-1.32 3.1-2.3.5-.59.9-1.27 1.16-2 .26-.73.38-1.5.35-2.28V.02h.01z"/>
    </svg>
  ),
};

// Platform-specific brand colors
const brandColors: Record<string, BrandColor> = {
  youtube: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500',
  },
  facebook: {
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-600/10',
    text: 'text-blue-600',
    border: 'border-blue-600/30',
    hoverBorder: 'hover:border-blue-600',
  },
  tiktok: {
    bg: 'bg-black',
    bgLight: 'bg-gray-800/10',
    text: 'text-gray-800',
    border: 'border-gray-800/30',
    hoverBorder: 'hover:border-gray-800',
  },
};

export default function PlatformItem({ 
  platform, 
  label, 
  connected, 
  onConnect,
  selected = false,
  onToggle,
  showCheckbox = false
}: PlatformItemProps) {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const colors: BrandColor = brandColors[platform] || brandColors.youtube;

  const handleConnect = async (): Promise<void> => {
    setShowAuthModal(true);
  };

  const startOAuth = async (): Promise<void> => {
    setIsConnecting(true);
    
    try {
      const response = await fetch(`/api/auth/${platform}`);
      const data = await response.json();
      
      if (!data.url) {
        throw new Error('No OAuth URL received');
      }
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        data.url,
        `${platform}-auth`,
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        alert('Popup was blocked. The authentication will open in a new tab.\n\nPlease complete the authentication and then return to this page.');
        window.open(data.url, '_blank');
        
        const messageHandler = async (event: MessageEvent): Promise<void> => {
          if (event.data.type === 'oauth-callback' && event.data.platform === platform) {
            if (event.data.success) {
              await onConnect(platform, event.data.accessToken);
              setShowAuthModal(false);
            } else {
              alert(`Failed to connect ${label}. Please try again.`);
            }
            setIsConnecting(false);
            window.removeEventListener('message', messageHandler);
          }
        };
        
        window.addEventListener('message', messageHandler);
        setIsConnecting(false);
        setShowAuthModal(false);
        return;
      }
      
      const messageHandler = async (event: MessageEvent): Promise<void> => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'oauth-callback' && event.data.platform === platform) {
          popup?.close();
          
          if (event.data.success) {
            await onConnect(platform, event.data.accessToken);
            setShowAuthModal(false);
          } else {
            alert(`Failed to connect ${label}. Please try again.\n\nError: ${event.data.error || 'Unknown error'}`);
          }
          setIsConnecting(false);
          window.removeEventListener('message', messageHandler);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      setTimeout((): void => {
        if (isConnecting) {
          setIsConnecting(false);
          setShowAuthModal(false);
          alert('Connection timeout. Please try again.');
          window.removeEventListener('message', messageHandler);
        }
      }, 300000);
      
    } catch (error) {
      console.error('OAuth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to start authentication: ${errorMessage}`);
      setIsConnecting(false);
      setShowAuthModal(false);
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    if (confirm(`Are you sure you want to disconnect ${label}?`)) {
      await onConnect(platform, null, true);
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300
        ${connected 
          ? `${colors.border} bg-gradient-to-r ${colors.bgLight}` 
          : 'border-border bg-card-bg hover:shadow-lg hover:scale-[1.02]'
        }
        ${showCheckbox && selected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all
            ${connected ? colors.bg : 'bg-gray-100 dark:bg-gray-800'}
          `}>
            <div className={`w-8 h-8 ${connected ? 'text-white' : colors.text}`}>
              {PlatformLogos[platform]}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">{label}</h3>
              {connected && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Connected
                </span>
              )}
              {showCheckbox && selected && connected && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  ✓ Selected
                </span>
              )}
            </div>
            <p className={`text-sm ${connected ? 'text-green-500' : 'text-muted'} mt-1`}>
              {connected 
                ? '✓ Connected and ready to post' 
                : 'Click Connect to authenticate with your account'
              }
            </p>
          </div>
        </div>

        {!connected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300
              bg-gradient-to-r ${colors.bg} to-${colors.bg}/80
              hover:shadow-lg hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Connecting...
              </div>
            ) : (
              'Connect'
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {showCheckbox && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle && onToggle(platform)}
                className="w-5 h-5 rounded border-border bg-card-bg text-primary focus:ring-primary cursor-pointer"
              />
            )}
            <button
              onClick={handleDisconnect}
              className="px-6 py-2.5 rounded-xl font-semibold border-2 border-red-500/30 text-red-500
                hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-2xl p-6 max-w-md w-full mx-4 border border-border">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                <div className="w-8 h-8 text-white">
                  {PlatformLogos[platform]}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect {label}</h3>
              <p className="text-muted text-sm">
                You'll be redirected to {label} to authorize AutoPost to post on your behalf.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startOAuth}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${colors.bg} to-${colors.bg}/80 hover:shadow-lg transition-all`}
              >
                Continue to {label}
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-3 rounded-xl font-semibold border border-border hover:bg-card-bg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
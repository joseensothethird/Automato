'use client';

import { useState } from 'react';

// Add TypeScript interface
interface PlatformItemProps {
  platform: string;
  label: string;
  connected: boolean;
  onConnect: (platform: string) => Promise<void>;
  selected?: boolean;
  onToggle?: (platform: string) => void;
  showCheckbox?: boolean;
}

// SVG logos for each platform
const PlatformLogos = {
  youtube: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  facebook: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v3.03c-1.49-.05-2.97-.36-4.36-1.09v5.99c-.03 4.63-3.9 8.37-8.54 8.23-2.22-.07-4.31-.96-5.85-2.41-1.88-1.76-2.93-4.21-2.86-6.78.17-4.72 4.07-8.46 8.8-8.31.12 1.15.37 2.28.78 3.35-1.87.12-3.66.71-5.06 1.75-.97.72-1.69 1.65-2.16 2.72-.47 1.07-.71 2.22-.69 3.38.04 2.26 1.31 4.28 3.31 5.38 1.17.65 2.5.97 3.84.94 1.09-.03 2.17-.24 3.17-.66 1.24-.52 2.27-1.32 3.1-2.3.5-.59.9-1.27 1.16-2 .26-.73.38-1.5.35-2.28V.02h.01z"/>
    </svg>
  ),
};

// Platform-specific brand colors
const brandColors: Record<string, any> = {
  youtube: {
    bg: 'bg-red-500/10',
    border: 'hover:border-red-500/50',
    text: 'text-red-500',
    gradient: 'from-red-500 to-red-600',
    iconColor: 'text-red-500',
    buttonGradient: 'from-red-500 to-red-600'
  },
  facebook: {
    bg: 'bg-blue-600/10',
    border: 'hover:border-blue-500/50',
    text: 'text-blue-500',
    gradient: 'from-blue-600 to-blue-700',
    iconColor: 'text-blue-600',
    buttonGradient: 'from-blue-600 to-blue-700'
  },
  tiktok: {
    bg: 'bg-black/10',
    border: 'hover:border-gray-500/50',
    text: 'text-gray-400',
    gradient: 'from-gray-900 to-gray-800',
    iconColor: 'text-gray-300',
    buttonGradient: 'from-gray-900 to-gray-800'
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(platform);
    } finally {
      setIsConnecting(false);
    }
  };

  // Get colors for this platform, with fallback
  const colors = brandColors[platform] || {
    bg: 'bg-primary/10',
    border: 'hover:border-primary/50',
    text: 'text-primary',
    gradient: 'from-primary to-accent',
    iconColor: 'text-primary',
    buttonGradient: 'from-primary to-accent'
  };

  return (
    <div 
      className={`relative group bg-card-bg border border-border rounded-2xl transition-all duration-300 overflow-hidden
        ${!connected && colors.border} 
        ${connected ? 'hover:border-primary/30' : 'hover:shadow-lg hover:-translate-y-0.5'}
        ${showCheckbox && selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-card-bg' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Platform-specific background gradient on hover */}
      {!connected && isHovered && (
        <div className={`absolute inset-0 ${colors.bg} opacity-50 transition-opacity duration-300`} />
      )}
      
      {/* Connection status badge */}
      {connected && (
        <div className="absolute top-3 right-3">
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75"></span>
            <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Checkbox for selection */}
      {showCheckbox && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle && onToggle(platform)}
            className="w-5 h-5 rounded border-border bg-card-bg text-primary focus:ring-primary focus:ring-2 cursor-pointer"
            disabled={!connected}
          />
        </div>
      )}

      <div className={`relative p-4 flex items-center justify-between ${showCheckbox ? 'pl-12' : ''}`}>
        {/* Left side - Platform info */}
        <div className="flex items-center gap-4 flex-1">
          <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
            ${connected ? colors.bg : 'bg-card-bg border border-border'}
            ${!connected && isHovered ? 'scale-110 rotate-6' : ''}
          `}>
            <div className={`w-6 h-6 ${colors.iconColor}`}>
              {PlatformLogos[platform as keyof typeof PlatformLogos] || PlatformLogos.youtube}
            </div>
            {connected && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/20 to-transparent animate-pulse" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{label}</h3>
              {connected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  <span className="w-1 h-1 rounded-full bg-green-400"></span>
                  Active
                </span>
              )}
              {showCheckbox && selected && connected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  ✓ Selected
                </span>
              )}
            </div>
            
            <p className={`text-sm transition-colors duration-300
              ${connected ? 'text-green-400' : 'text-muted'}
            `}>
              {connected ? 'Connected and ready' : 'Not connected'}
            </p>

            {connected && (
              <p className="text-xs text-muted mt-1">
                ✓ Full access granted
              </p>
            )}
          </div>
        </div>

        {/* Right side - Action button */}
        {!connected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden
              bg-gradient-to-r ${colors.buttonGradient} text-white shadow-lg
              hover:shadow-xl hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <span>+</span>
                  Connect
                </>
              )}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card-bg transition-all"
              aria-label="Settings"
            >
              ⚙️
            </button>
            <button 
              className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
              aria-label="Disconnect"
            >
              🔌
            </button>
          </div>
        )}
      </div>

      {/* Progress bar for connecting state */}
      {isConnecting && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent animate-pulse">
          <div className="h-full bg-white/20 animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}
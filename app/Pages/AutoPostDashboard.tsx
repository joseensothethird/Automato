'use client';

import { useState } from 'react';
import UploadSection from '../Components/UploadSection';
import RecentUploads from '../Components/RecentUploads';

// Define the platform type
type Platform = 'youtube' | 'facebook' | 'tiktok';

interface PlatformStatus {
  connected: boolean;
  selected: boolean;
}

interface Platforms {
  youtube: PlatformStatus;
  facebook: PlatformStatus;
  tiktok: PlatformStatus;
}

const INITIAL_PLATFORMS: Platforms = {
  youtube: { connected: false, selected: false },
  facebook: { connected: false, selected: false },
  tiktok: { connected: false, selected: false },
};

export default function AutoPostDashboard() {
  const [platforms, setPlatforms] = useState<Platforms>(INITIAL_PLATFORMS);

  const handleConnect = (platform: string) => {
    // Type guard to ensure platform is valid
    if (platform === 'youtube' || platform === 'facebook' || platform === 'tiktok') {
      setPlatforms((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], connected: true, selected: true },
      }));
    }
  };

  const handleCheckboxChange = (platform: string) => {
    // Type guard to ensure platform is valid
    if (platform === 'youtube' || platform === 'facebook' || platform === 'tiktok') {
      if (!platforms[platform].connected) return;
      setPlatforms((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], selected: !prev[platform].selected },
      }));
    }
  };

  const handlePublish = (configs: unknown[]) => {
    console.log('Publishing with configs:', configs);
  };

  const connectedCount = Object.values(platforms).filter(p => p.connected).length;
  const selectedCount = Object.values(platforms).filter(p => p.selected && p.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Full Width Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="w-full px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Logo & Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎬</span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AutoPost Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload once. Publish everywhere. Reach all audiences.
                </p>
              </div>
            </div>
            
            {/* Stats Badges */}
            <div className="flex gap-4">
              <div className="group relative px-5 py-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔗</span>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Connected</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {connectedCount}/{Object.keys(platforms).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group relative px-5 py-2.5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Selected</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{selectedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="w-full px-8 lg:px-16 py-12 lg:py-16">
        {/* Upload Section - Full Width */}
        <div className="mb-16">
          <UploadSection
            platforms={platforms}
            onConnect={handleConnect}
            onCheckboxChange={handleCheckboxChange}
            onPublish={handlePublish}
          />
        </div>

        {/* Recent Uploads Section */}
        <div>
          {/* Section Header with Decoration */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Recent Uploads
                </h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 ml-4">
                Track your recently published content and their performance
              </p>
            </div>
            
            <button className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                View All
              </span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Recent Uploads Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
            <RecentUploads />
          </div>
        </div>
      </main>

      {/* Optional: Footer Stats Bar */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="w-full px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                System Online
              </span>
              <span>⚡ Ready to publish</span>
            </div>
            <div className="flex items-center gap-4">
              <span>📊 Total Uploads: 0</span>
              <span>🎯 Success Rate: 100%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
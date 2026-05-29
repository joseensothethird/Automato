'use client';

import { useState, useCallback } from 'react';
import PlatformItem from './item';
import PublishModal from './Modal/PublishModal';

// Add TypeScript interfaces
interface Platform {
  connected: boolean;
  selected: boolean;
}

interface Platforms {
  youtube: Platform;
  facebook: Platform;
  tiktok: Platform;
}

interface UploadSectionProps {
  platforms: Platforms;
  onConnect: (platform: string) => void;
  onCheckboxChange: (platform: string) => void;
  onPublish: (configs: any[]) => void;
}

const PLATFORM_META = {
  youtube:  { label: 'YouTube',  emoji: '▶️', color: '#FF0000', bgColor: 'rgba(255, 0, 0, 0.1)' },
  facebook: { label: 'Facebook', emoji: '📘', color: '#1877F2', bgColor: 'rgba(24, 119, 242, 0.1)' },
  tiktok:   { label: 'TikTok',   emoji: '🎵', color: '#000000', bgColor: 'rgba(0, 0, 0, 0.1)' },
};

export default function UploadSection({ platforms, onConnect, onCheckboxChange, onPublish }: UploadSectionProps) {
  const [caption, setCaption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleConnect = async (platform: string, accessToken: string | null = null, isDisconnect: boolean = false) => {
    if (isDisconnect) {
      onConnect(platform);
    } else {
      console.log(`Connected to ${platform} with token:`, accessToken);
      onConnect(platform);
    }
  };

  const handlePublishClick = () => {
    const hasSelected = Object.values(platforms).some((d) => d.connected && d.selected);
    if (!hasSelected) {
      alert('Please connect and select at least one platform to publish');
      return;
    }
    if (!selectedFile) {
      alert('Please select a video file to upload');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = (configs: any[]) => {
    setShowModal(false);
    onPublish(configs);
  };

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm)$/i))) {
      if (file.size <= 100 * 1024 * 1024) {
        setSelectedFile(file);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) clearInterval(interval);
        }, 200);
      } else {
        alert('File size exceeds 100MB limit');
      }
    } else {
      alert('Please select a valid video file (MP4, MOV, WEBM)');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleBrowseClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/quicktime,video/webm';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    };
    input.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const connectedCount = Object.values(platforms).filter(p => p.connected).length;
  const selectedCount = Object.values(platforms).filter(p => p.selected && p.connected).length;

  return (
    <>
      <div className="w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Publishing</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            AutoPost
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload once. Auto publish everywhere. Reach every audience with zero extra effort.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Connected Platforms</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{connectedCount}/{Object.keys(platforms).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">🔗</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Selected for Publishing</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{selectedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">✓</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Published</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">📊</div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
          {/* Upload Area */}
          <div className="p-8 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-3 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer min-h-[320px] flex flex-col items-center justify-center
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[0.98]' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <div className="text-6xl mb-4 transition-transform group-hover:scale-110">
                  {selectedFile ? '📹' : '🎬'}
                </div>
                
                {!selectedFile ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">Drop your video here</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">MP4, MOV, WEBM up to 100MB</p>
                    <button 
                      onClick={handleBrowseClick}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
                    >
                      Browse Files
                    </button>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between text-left w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setUploadProgress(0);
                        }}
                        className="text-red-500 hover:text-red-600 text-sm ml-3 px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    {uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                    {uploadProgress === 100 && (
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                        <span className="text-2xl">✓</span>
                        <span className="font-medium">Ready to publish!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption Area */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Caption / Description
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                  rows={8}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all text-sm"
                  placeholder="Write an engaging caption for your video... What's it about? Why should people watch?"
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    {caption.length === 0 ? '💡 Tip: Add a compelling caption to boost engagement' : `${caption.length}/2200 characters used`}
                  </p>
                  {caption.length > 2000 && (
                    <p className="text-xs text-yellow-600 flex items-center gap-1">
                      <span>⚠️</span> Approaching limit
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Platforms Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Select Platforms
                  </label>
                  <p className="text-xs text-gray-500">Choose where to publish your content</p>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedCount} platform{selectedCount !== 1 ? 's' : ''} selected
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(platforms).map(([key, data]) => {
                  const meta = PLATFORM_META[key as keyof typeof PLATFORM_META];
                  if (!meta) return null;
                  return (
                    <PlatformItem
                      key={key}
                      platform={key}
                      label={meta.label}
                      connected={data.connected}
                      selected={data.selected}
                      showCheckbox={true}
                      onConnect={handleConnect}
                      onToggle={onCheckboxChange}
                      color={meta.color}
                      bgColor={meta.bgColor}
                    />
                  );
                })}
              </div>
            </div>

            {/* Publish Button */}
            <div className="mt-12">
              <button
                onClick={handlePublishClick}
                disabled={!selectedFile || uploadProgress < 100}
                className={`w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-3 text-lg
                  ${(!selectedFile || uploadProgress < 100)
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                <span className="text-2xl">🚀</span>
                {!selectedFile ? 'Select a video to continue' : uploadProgress < 100 ? `Uploading video... ${uploadProgress}%` : 'Publish Content Now'}
              </button>
              {!selectedFile && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Supported formats: MP4, MOV, WEBM (Max 100MB)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <PublishModal
          platforms={platforms}
          caption={caption}
          videoFile={selectedFile}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
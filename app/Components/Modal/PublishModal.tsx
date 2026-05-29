'use client';

import { useState } from 'react';

type Platform = 'youtube' | 'facebook' | 'tiktok';

type FormatOption = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

type PublishConfig = {
  platform: Platform;
  format: string;
  scheduleType: 'now' | 'later';
  scheduledDate: string;
  scheduledTime: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
};

// Define the platform type explicitly
type PlatformStatus = {
  connected: boolean;
  selected: boolean;
};

type Platforms = {
  youtube: PlatformStatus;
  facebook: PlatformStatus;
  tiktok: PlatformStatus;
};

type Props = {
  platforms: Platforms;
  caption: string;
  videoFile?: File | null;
  uploadedFileUrl?: string | null;
  onClose: () => void;
  onConfirm: (configs: PublishConfig[]) => void;
};

const PLATFORM_FORMATS: Record<Platform, FormatOption[]> = {
  youtube: [
    { id: 'short', label: 'YouTube Short', description: 'Vertical · up to 60s · #Shorts', icon: '⚡' },
    { id: 'long',  label: 'Long-form Video', description: 'Standard · any length', icon: '🎬' },
  ],
  facebook: [
    { id: 'reel', label: 'Facebook Reel',   description: 'Vertical short-form video', icon: '🎞️' },
    { id: 'long', label: 'Long-form Video', description: 'Standard video post',       icon: '📹' },
    { id: 'post', label: 'Page Post',       description: 'Video on your timeline',    icon: '📝' },
  ],
  tiktok: [
    { id: 'video', label: 'TikTok Video',     description: 'Standard vertical video',     icon: '🎵' },
    { id: 'photo', label: 'Photo Slideshow',  description: 'Images with audio',           icon: '🖼️' },
  ],
};

const PLATFORM_META: Record<Platform, { label: string; logo: string; accent: string; light: string }> = {
  youtube:  { label: 'YouTube',  logo: '▶', accent: '#FF0000', light: 'rgba(255,0,0,0.08)' },
  facebook: { label: 'Facebook', logo: 'f', accent: '#1877F2', light: 'rgba(24,119,242,0.08)' },
  tiktok:   { label: 'TikTok',   logo: '♪', accent: '#010101', light: 'rgba(0,0,0,0.06)' },
};

// Helper to convert Platforms to Record
const platformsToRecord = (platforms: Platforms): Record<string, PlatformStatus> => {
  return {
    youtube: platforms.youtube,
    facebook: platforms.facebook,
    tiktok: platforms.tiktok,
  };
};

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '0' }} />;
}

function SchedulePicker({
  scheduleType, scheduledDate, scheduledTime, repeat, onChange,
}: {
  scheduleType: 'now' | 'later';
  scheduledDate: string;
  scheduledTime: string;
  repeat: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', background: 'var(--background)', borderRadius: 8, padding: 3, gap: 3, border: '1px solid var(--border)' }}>
        {(['now', 'later'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onChange('scheduleType', t)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all .15s',
              background: scheduleType === t ? 'var(--card-bg)' : 'transparent',
              color: scheduleType === t ? 'var(--foreground)' : 'var(--muted)',
              boxShadow: scheduleType === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
            }}
          >
            {t === 'now' ? '⚡ Publish Now' : '🗓 Schedule'}
          </button>
        ))}
      </div>

      {scheduleType === 'later' && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4, fontWeight: 500 }}>Date</label>
              <input
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => onChange('scheduledDate', e.target.value)}
                style={{ width: '100%', fontSize: 13, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4, fontWeight: 500 }}>Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => onChange('scheduledTime', e.target.value)}
                style={{ width: '100%', fontSize: 13, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4, fontWeight: 500 }}>Repeat</label>
            <select
              value={repeat}
              onChange={(e) => onChange('repeat', e.target.value)}
              style={{ width: '100%', fontSize: 13, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
            >
              <option value="none">Don't repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformPanel({
  platform, config, onChange,
}: {
  platform: Platform;
  config: PublishConfig;
  onChange: (platform: Platform, key: string, value: string) => void;
}) {
  const formats = PLATFORM_FORMATS[platform];
  const meta = PLATFORM_META[platform];

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        Post format
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {formats.map((fmt) => {
          const active = config.format === fmt.id;
          return (
            <button
              key={fmt.id}
              onClick={() => onChange(platform, 'format', fmt.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                border: active ? `2px solid ${meta.accent}` : '1.5px solid var(--border)',
                background: active ? meta.light : 'var(--background)',
                cursor: 'pointer', transition: 'all .15s', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{fmt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{fmt.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{fmt.description}</p>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                border: active ? `5px solid ${meta.accent}` : '2px solid var(--border)',
                background: 'var(--card-bg)', transition: 'all .15s',
              }} />
            </button>
          );
        })}
      </div>

      <Divider />

      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        When to post
      </p>
      <SchedulePicker
        scheduleType={config.scheduleType}
        scheduledDate={config.scheduledDate}
        scheduledTime={config.scheduledTime}
        repeat={config.repeat}
        onChange={(key, value) => onChange(platform, key, value)}
      />
    </div>
  );
}

export default function PublishModal({ platforms, caption, onClose, onConfirm }: Props) {
  // Convert platforms to array of selected platforms
  const selectedPlatforms = (Object.keys(platforms) as Platform[]).filter(
    (key) => platforms[key].connected && platforms[key].selected
  );

  const [activeTab, setActiveTab] = useState<Platform>(selectedPlatforms[0]);

  const [configs, setConfigs] = useState<Record<Platform, PublishConfig>>(
    () => Object.fromEntries(
      selectedPlatforms.map((p) => [p, {
        platform: p,
        format: PLATFORM_FORMATS[p][0].id,
        scheduleType: 'now',
        scheduledDate: '',
        scheduledTime: '',
        repeat: 'none',
      }])
    ) as Record<Platform, PublishConfig>
  );

  const handleChange = (platform: Platform, key: string, value: string) => {
    setConfigs((prev) => ({ ...prev, [platform]: { ...prev[platform], [key]: value } }));
  };

  const handleConfirm = () => onConfirm(selectedPlatforms.map((p) => configs[p]));
  const allNow = selectedPlatforms.every((p) => configs[p]?.scheduleType === 'now');

  if (selectedPlatforms.length === 0) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 16 }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 28, maxWidth: 380, width: '100%', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>⚠️</p>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No platforms selected</p>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Connect and select at least one platform before publishing.</p>
          <button onClick={onClose} style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--foreground)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const activeMeta = PLATFORM_META[activeTab];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 16 }}>
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, width: '100%', maxWidth: 500, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.22)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Publish Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--border)', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
        </div>
        <Divider />

        {caption && (
          <>
            <div style={{ padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✍️</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 3 }}>Caption</p>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--foreground)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{caption}</p>
              </div>
            </div>
            <Divider />
          </>
        )}

        <div style={{ display: 'flex', padding: '0 20px', gap: 2, background: 'var(--card-bg)' }}>
          {selectedPlatforms.map((p) => {
            const m = PLATFORM_META[p];
            const isActive = activeTab === p;
            return (
              <button key={p} onClick={() => setActiveTab(p)} style={{ flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? m.accent : 'var(--muted)', borderBottom: isActive ? `3px solid ${m.accent}` : '3px solid transparent', transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'serif', color: isActive ? m.accent : 'var(--muted)' }}>{m.logo}</span>
                {m.label}
                {configs[p]?.scheduleType === 'later' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
        <Divider />

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <PlatformPanel platform={activeTab} config={configs[activeTab]} onChange={handleChange} />
        </div>

        <Divider />

        <div style={{ padding: '12px 20px', display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--foreground)', fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'all .15s' }}>Cancel</button>
          <button onClick={handleConfirm} style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: activeMeta.accent, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'all .15s' }}>{allNow ? '🚀 Publish Now' : '🗓 Schedule Post'}</button>
        </div>
      </div>
    </div>
  );
}
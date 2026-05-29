'use client';

// Add TypeScript interface
interface Upload {
  id: string;
  filename: string;
  description: string;
  status: 'success' | 'processing' | 'failed';
}

/**
 * STATUS_STYLES
 * Maps a status string → tailwind colour class + label.
 */
const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  success:    { color: 'text-green-400',  label: 'Success'    },
  processing: { color: 'text-yellow-400 animate-pulse', label: 'Processing' },
  failed:     { color: 'text-red-400',    label: 'Failed'     },
};

/**
 * RecentUploads
 * -------------
 * Right-sidebar card showing a log of recent upload attempts.
 * Displays empty state when no data is available.
 */
export default function RecentUploads() {
  // For now, no data - just show empty state
  const hasData = false;
  const uploads: Upload[] = [];

  if (!hasData || uploads.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Recent Uploads</h2>
        
        <div className="bg-card-bg border border-border rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4 opacity-50">📭</div>
          <p className="font-semibold text-foreground mb-2">No posted content yet</p>
          <p className="text-muted text-sm">
            Your recent uploads will appear here once you start publishing content.
          </p>
        </div>
      </div>
    );
  }

  // When data exists in the future, this will render
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Recent Uploads</h2>

      <div className="space-y-4">
        {uploads.map((upload) => {
          const style = STATUS_STYLES[upload.status] ?? STATUS_STYLES.success;
          return (
            <div
              key={upload.id}
              className="bg-card-bg border border-border rounded-2xl p-4 flex items-center justify-between transition-all hover:border-primary/50"
            >
              <div>
                <p className="font-semibold">{upload.filename}</p>
                <p className="text-muted text-sm">{upload.description}</p>
              </div>
              <span className={`font-medium ${style.color}`}>{style.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
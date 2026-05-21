'use client';

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="status" aria-label="Loading metrics data">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand-surface" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-primary" />
      </div>
      <p className="mt-4 text-sm text-brand-text/70">Loading metrics data…</p>
    </div>
  );
}

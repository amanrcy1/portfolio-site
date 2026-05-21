'use client';

import { useState } from 'react';

interface VideoCardProps {
  videoId: string;
  title: string;
  duration: string;
}

export default function VideoCard({ videoId, title, duration }: VideoCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <article className="rounded-lg border border-brand-surface bg-brand-surface/50 overflow-hidden flex flex-col">
      {/* Video embed or fallback */}
      <div className="relative w-full aspect-video bg-brand-background">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-brand-text/70 text-sm font-body text-center px-4">
              Video temporarily unavailable
            </p>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Title and duration */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">
          {title}
        </h2>
        <span className="inline-flex items-center gap-1 text-sm text-brand-text/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
              clipRule="evenodd"
            />
          </svg>
          {duration}
        </span>
      </div>
    </article>
  );
}

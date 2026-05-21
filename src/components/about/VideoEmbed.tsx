'use client';

import { useState } from 'react';

interface VideoEmbedProps {
  videoId: string;
  title?: string;
}

export default function VideoEmbed({ videoId, title = 'Video' }: VideoEmbedProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="relative w-full aspect-video bg-brand-surface rounded-lg flex items-center justify-center">
          <p className="text-brand-text/70 text-lg font-body">
            Video temporarily unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
}

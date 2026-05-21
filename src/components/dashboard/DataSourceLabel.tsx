'use client';

interface DataSourceLabelProps {
  name: string;
  repoUrl: string;
  isReachable: boolean;
  lastSuccessfulFetch: string;
}

export default function DataSourceLabel({ name, repoUrl, isReachable, lastSuccessfulFetch }: DataSourceLabelProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${isReachable ? 'bg-brand-accent' : 'bg-yellow-500'}`}
        aria-hidden="true"
      />
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary hover:text-brand-primary/80 underline underline-offset-2 transition-colors"
      >
        {name}
      </a>
      {!isReachable && (
        <span className="text-yellow-400 text-[10px]">
          (last synced {new Date(lastSuccessfulFetch).toLocaleDateString()})
        </span>
      )}
    </span>
  );
}

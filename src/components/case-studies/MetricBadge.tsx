interface MetricBadgeProps {
  label: string;
  before: string;
  after: string;
  unit: string;
}

export default function MetricBadge({ label, before, after, unit }: MetricBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5">
      <span className="text-xs font-medium text-brand-primary">{label}</span>
      <span className="text-xs text-brand-text/60 line-through">{before}</span>
      <svg
        className="h-3 w-3 text-brand-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <span className="text-xs font-semibold text-brand-accent">{after}</span>
      <span className="text-xs text-brand-text/40">{unit}</span>
    </div>
  );
}

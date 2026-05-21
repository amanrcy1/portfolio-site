'use client';

import Link from 'next/link';
import MetricBadge from './MetricBadge';
import { MotionCard } from '@/components/animations';

interface CaseStudyCardProps {
  slug: string;
  title: string;
  summary: string;
  primaryMetric: {
    label: string;
    before: string;
    after: string;
    unit: string;
  };
}

export default function CaseStudyCard({
  slug,
  title,
  summary,
  primaryMetric,
}: CaseStudyCardProps) {
  // Enforce max 200 characters on summary display
  const truncatedSummary =
    summary.length > 200 ? summary.slice(0, 197) + '...' : summary;

  return (
    <MotionCard className="rounded-xl border border-brand-surface bg-brand-surface/50">
      <Link
        href={`/case-studies/${slug}`}
        className="group block p-6"
      >
        <h3 className="text-xl font-heading font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-sm text-brand-text/70 leading-relaxed">
          {truncatedSummary}
        </p>
        <div className="mt-4">
          <MetricBadge
            label={primaryMetric.label}
            before={primaryMetric.before}
            after={primaryMetric.after}
            unit={primaryMetric.unit}
          />
        </div>
      </Link>
    </MotionCard>
  );
}

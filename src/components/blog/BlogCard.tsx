'use client';

import Link from 'next/link';
import { BlogCategory } from '@/types/blog';
import { MotionCard } from '@/components/animations';

interface BlogCardProps {
  slug: string;
  title: string;
  publishedDate: string;
  readingTimeMinutes: number;
  category: BlogCategory;
}

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'tool-comparisons': 'Tool Comparisons',
  'lessons-learned': 'Lessons Learned',
  'war-stories': 'War Stories',
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  'tool-comparisons': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  'lessons-learned': 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  'war-stories': 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
};

export default function BlogCard({
  slug,
  title,
  publishedDate,
  readingTimeMinutes,
  category,
}: BlogCardProps) {
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MotionCard className="rounded-xl border border-brand-surface bg-brand-surface/50">
      <Link
        href={`/blog/${slug}`}
        className="group block p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
          >
            {CATEGORY_LABELS[category]}
          </span>
        </div>
        <h3 className="text-xl font-heading font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <div className="mt-3 flex items-center gap-4 text-sm text-brand-text/60">
          <time dateTime={publishedDate}>{formattedDate}</time>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readingTimeMinutes} min read
          </span>
        </div>
      </Link>
    </MotionCard>
  );
}

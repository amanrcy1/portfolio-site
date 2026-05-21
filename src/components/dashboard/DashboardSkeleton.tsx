'use client';

import { LoadingSkeleton } from '@/components/animations';

/**
 * Skeleton placeholder for the MetricsChart component.
 * Matches: rounded-lg card with header (~40px), chart area (h-72 = 288px), and data labels.
 */
function MetricsChartSkeleton() {
  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      {/* Title */}
      <LoadingSkeleton width="160px" height="1.5rem" className="mb-1" />
      {/* Subtitle */}
      <LoadingSkeleton width="220px" height="0.75rem" className="mb-4" />
      {/* Chart area (h-64 sm:h-72 ~ 256-288px) */}
      <LoadingSkeleton width="100%" height="260px" rounded="rounded-md" />
      {/* Data source labels */}
      <div className="mt-4 flex flex-wrap gap-3">
        <LoadingSkeleton width="120px" height="1.25rem" rounded="rounded-full" />
        <LoadingSkeleton width="140px" height="1.25rem" rounded="rounded-full" />
        <LoadingSkeleton width="100px" height="1.25rem" rounded="rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for the PipelineStatus table component.
 * Matches: rounded-lg card with header, table header row, and ~4 data rows.
 */
function PipelineStatusSkeleton() {
  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      {/* Title */}
      <LoadingSkeleton width="170px" height="1.5rem" className="mb-1" />
      {/* Subtitle */}
      <LoadingSkeleton width="200px" height="0.75rem" className="mb-4" />
      {/* Table header */}
      <div className="flex gap-4 border-b border-brand-surface pb-2 mb-2">
        <LoadingSkeleton width="30%" height="0.875rem" />
        <LoadingSkeleton width="12%" height="0.875rem" />
        <LoadingSkeleton width="12%" height="0.875rem" />
        <LoadingSkeleton width="12%" height="0.875rem" />
        <LoadingSkeleton width="14%" height="0.875rem" />
        <LoadingSkeleton width="12%" height="0.875rem" />
      </div>
      {/* Table rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2.5 border-b border-brand-surface/50">
          <LoadingSkeleton width="30%" height="0.875rem" />
          <LoadingSkeleton width="12%" height="0.875rem" />
          <LoadingSkeleton width="12%" height="0.875rem" />
          <LoadingSkeleton width="12%" height="0.875rem" />
          <LoadingSkeleton width="14%" height="0.875rem" />
          <LoadingSkeleton width="12%" height="0.875rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton placeholder for the PassRateGauge component.
 * Matches: rounded-lg card with header + 192px (h-48) circular gauge area.
 */
function PassRateGaugeSkeleton() {
  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      {/* Title */}
      <LoadingSkeleton width="150px" height="1.5rem" className="mb-1" />
      {/* Subtitle */}
      <LoadingSkeleton width="190px" height="0.75rem" className="mb-4" />
      {/* Gauge area (h-48 w-48 = 192px) */}
      <div className="relative mx-auto h-48 w-48 flex items-center justify-center">
        <LoadingSkeleton width="192px" height="192px" rounded="rounded-full" />
      </div>
      {/* Bottom label */}
      <div className="mt-4 text-center">
        <LoadingSkeleton width="100px" height="0.75rem" className="mx-auto" />
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for the ExecutionTimeChart component.
 * Matches: rounded-lg card with header + chart area (h-72 = 288px) + data labels.
 */
function ExecutionTimeChartSkeleton() {
  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      {/* Title */}
      <LoadingSkeleton width="140px" height="1.5rem" className="mb-1" />
      {/* Subtitle */}
      <LoadingSkeleton width="260px" height="0.75rem" className="mb-4" />
      {/* Chart area (h-64 sm:h-72 ~ 256-288px) */}
      <LoadingSkeleton width="100%" height="260px" rounded="rounded-md" />
      {/* Data source labels */}
      <div className="mt-4 flex flex-wrap gap-3">
        <LoadingSkeleton width="130px" height="1.25rem" rounded="rounded-full" />
        <LoadingSkeleton width="110px" height="1.25rem" rounded="rounded-full" />
        <LoadingSkeleton width="100px" height="1.25rem" rounded="rounded-full" />
      </div>
    </div>
  );
}

/**
 * Full dashboard skeleton that mirrors the complete dashboard layout.
 * Used by SkeletonGroup to provide placeholder content while data loads.
 */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* MetricsChart skeleton */}
      <MetricsChartSkeleton />

      {/* PipelineStatus skeleton */}
      <PipelineStatusSkeleton />

      {/* Gauge + Execution Time side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        <PassRateGaugeSkeleton />
        <ExecutionTimeChartSkeleton />
      </div>
    </div>
  );
}

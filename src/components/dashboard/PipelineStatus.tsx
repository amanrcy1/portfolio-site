'use client';

import { PipelineData } from '@/types/metrics';
import { useCounterAnimation } from '@/components/animations';
import DataSourceLabel from './DataSourceLabel';

interface PipelineStatusProps {
  pipelines: PipelineData[];
}

/** Animated metric cell for integer values */
function AnimatedMetricCell({ value, className }: { value: number; className?: string }) {
  const { ref, displayValue } = useCounterAnimation({
    target: value,
    duration: 2000,
  });

  return (
    <td className={className}>
      <span ref={ref}>{displayValue}</span>
    </td>
  );
}

/** Animated metric cell for percentage values */
function AnimatedPercentageCell({ value, className }: { value: number; className?: string }) {
  const { ref, displayValue } = useCounterAnimation({
    target: value,
    isPercentage: true,
    duration: 2000,
  });

  return (
    <td className={className}>
      <span ref={ref}>{displayValue}</span>
    </td>
  );
}

export default function PipelineStatus({ pipelines }: PipelineStatusProps) {
  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-brand-text">Pipeline Summary</h3>
      <p className="mb-4 text-xs text-brand-text/60">Latest status per repository</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-brand-surface text-brand-text/70">
              <th className="pb-2 pr-4 font-medium">Pipeline</th>
              <th className="pb-2 pr-4 font-medium text-right">Tests</th>
              <th className="pb-2 pr-4 font-medium text-right">Passed</th>
              <th className="pb-2 pr-4 font-medium text-right">Failed</th>
              <th className="pb-2 pr-4 font-medium text-right">Pass Rate</th>
              <th className="pb-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {pipelines.map((pipeline) => {
              const latestRun = pipeline.runs[pipeline.runs.length - 1];
              if (!latestRun) return null;

              const statusColor = !pipeline.isReachable
                ? 'text-yellow-400'
                : latestRun.passRate === 100
                  ? 'text-brand-accent'
                  : latestRun.passRate >= 90
                    ? 'text-yellow-400'
                    : 'text-red-400';

              const statusLabel = !pipeline.isReachable
                ? 'Unreachable'
                : latestRun.passRate === 100
                  ? 'Passing'
                  : latestRun.passRate >= 90
                    ? 'Degraded'
                    : 'Failing';

              return (
                <tr key={pipeline.name} className="border-b border-brand-surface/50">
                  <td className="py-2.5 pr-4">
                    <DataSourceLabel
                      name={pipeline.name}
                      repoUrl={pipeline.repoUrl}
                      isReachable={pipeline.isReachable}
                      lastSuccessfulFetch={pipeline.lastSuccessfulFetch}
                    />
                  </td>
                  <AnimatedMetricCell value={latestRun.totalTests} className="py-2.5 pr-4 text-right text-brand-text" />
                  <AnimatedMetricCell value={latestRun.passed} className="py-2.5 pr-4 text-right text-brand-accent" />
                  <AnimatedMetricCell value={latestRun.failed} className="py-2.5 pr-4 text-right text-red-400" />
                  <AnimatedPercentageCell value={latestRun.passRate} className="py-2.5 pr-4 text-right text-brand-text" />
                  <td className={`py-2.5 text-right font-medium ${statusColor}`}>{statusLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

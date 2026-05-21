'use client';

import { useEffect, useState, useCallback } from 'react';
import { MetricsData } from '@/types/metrics';
import MetricsChart from '@/components/dashboard/MetricsChart';
import PipelineStatus from '@/components/dashboard/PipelineStatus';
import PassRateGauge from '@/components/dashboard/PassRateGauge';
import ExecutionTimeChart from '@/components/dashboard/ExecutionTimeChart';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import RepoLink from '@/components/shared/RepoLink';
import { BRAND } from '@/lib/constants';
import { ScrollReveal, StaggerContainer, SkeletonGroup } from '@/components/animations';

const PORTFOLIO_REPOS = [
  {
    name: 'test-automation-framework',
    url: BRAND.repos.testAutomation,
    description: 'Playwright + TypeScript E2E testing with POM pattern and Allure reporting.',
  },
  {
    name: 'api-contract-testing',
    url: BRAND.repos.apiContract,
    description: 'REST Assured API tests and Pact consumer-driven contract testing.',
  },
  {
    name: 'ai-quality-lab',
    url: BRAND.repos.aiQualityLab,
    description: 'LLM evaluation, self-healing locators, and prompt regression testing.',
  },
  {
    name: 'chaos-resilience-tests',
    url: BRAND.repos.chaosResilience,
    description: 'Chaos engineering with Docker Compose and Toxiproxy failure injection.',
  },
  {
    name: 'open-source-bug-reports',
    url: BRAND.repos.bugReports,
    description: 'Curated collection of exemplary bug reports on real open-source projects.',
  },
  {
    name: 'test-strategy-docs',
    url: BRAND.repos.testStrategy,
    description: 'Complete test strategy documentation for a fictional fintech application.',
  },
  {
    name: 'quality-metrics-dashboard',
    url: BRAND.repos.qualityMetricsDashboard,
    description: 'This dashboard — live quality metrics from portfolio CI pipelines.',
  },
];

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/metrics.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      const data: MetricsData = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleTimeout = useCallback(() => {
    setError('Loading timed out. Please try again.');
    setLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade" threshold={0.2}>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
            Quality Metrics Dashboard
          </h1>
          <p className="mt-2 text-lg text-brand-text/70">
            Live quality metrics from portfolio project CI pipelines.
          </p>
          {metrics && (
            <p className="mt-1 text-xs text-brand-text/50">
              Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </ScrollReveal>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center" role="alert">
          <p className="text-red-400 font-medium">Data unavailable</p>
          <p className="mt-1 text-sm text-brand-text/60">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!error && (
        <SkeletonGroup
          isLoading={loading}
          skeleton={<DashboardSkeleton />}
          onTimeout={handleTimeout}
        >
          {metrics && metrics.pipelines.length > 0 ? (
            <div className="space-y-6">
              {/* Unreachable pipeline warnings */}
              {metrics.pipelines.some((p) => !p.isReachable) && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4" role="alert">
                  <p className="text-sm text-yellow-400">
                    Some data sources are unreachable. Showing last known data.
                  </p>
                  <ul className="mt-2 space-y-1">
                    {metrics.pipelines
                      .filter((p) => !p.isReachable)
                      .map((p) => (
                        <li key={p.name} className="text-xs text-brand-text/60">
                          {p.name} — last synced{' '}
                          {new Date(p.lastSuccessfulFetch).toLocaleString()}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Pass/Fail Trend Line Chart */}
              <MetricsChart pipelines={metrics.pipelines} />

              {/* Pipeline Summary Table */}
              <PipelineStatus pipelines={metrics.pipelines} />

              {/* Gauge + Execution Time side by side */}
              <div className="grid gap-6 md:grid-cols-2">
                <PassRateGauge pipelines={metrics.pipelines} />
                <ExecutionTimeChart pipelines={metrics.pipelines} />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-6 text-center">
              <p className="text-brand-text/70">No pipeline data available yet.</p>
              <p className="mt-1 text-sm text-brand-text/50">
                Metrics will appear once CI pipelines report data.
              </p>
            </div>
          )}
        </SkeletonGroup>
      )}

      {/* Connected Repositories Section */}
      <ScrollReveal variant="slide-up" threshold={0.2}>
        <section className="mt-12 border-t border-brand-surface pt-8">
          <h2 className="text-2xl font-heading font-bold text-brand-text mb-2">
            Connected Repositories
          </h2>
          <p className="text-sm text-brand-text/60 mb-6">
            All portfolio repositories contributing to this quality ecosystem.
          </p>
          <StaggerContainer staggerDelay={0.1} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_REPOS.map((repo) => (
              <ScrollReveal key={repo.name} variant="slide-up" threshold={0.2}>
                <div
                  className="rounded-lg border border-brand-surface bg-brand-surface/30 p-4 flex flex-col gap-2"
                >
                  <h3 className="text-sm font-semibold text-brand-text">{repo.name}</h3>
                  <p className="text-xs text-brand-text/60 flex-1">{repo.description}</p>
                  <RepoLink url={repo.url} label={repo.name} />
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </section>
      </ScrollReveal>
    </div>
  );
}

'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PipelineData } from '@/types/metrics';
import DataSourceLabel from './DataSourceLabel';
import { useChartInView } from '@/components/animations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LINE_COLORS = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'];

interface MetricsChartProps {
  pipelines: PipelineData[];
}

export default function MetricsChart({ pipelines }: MetricsChartProps) {
  const { ref, shouldAnimate } = useChartInView();

  // Use up to the last 30 runs from the first pipeline for labels
  const maxRuns = Math.max(...pipelines.map((p) => p.runs.length));
  const labels = Array.from({ length: maxRuns }, (_, i) => `Run ${i + 1}`);

  const datasets = pipelines.map((pipeline, idx) => ({
    label: pipeline.name,
    data: pipeline.runs.map((run) => run.passRate),
    borderColor: LINE_COLORS[idx % LINE_COLORS.length],
    backgroundColor: `${LINE_COLORS[idx % LINE_COLORS.length]}20`,
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 5,
    tension: 0.3,
    fill: false,
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94A3B8', maxTicksLimit: 10 },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: '#334155' },
        ticks: {
          color: '#94A3B8',
          callback: (value: number | string) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-brand-text">Pass/Fail Trend</h3>
      <p className="mb-4 text-xs text-brand-text/60">Pass rate (%) over the last 30 runs</p>
      <div ref={ref} className="h-64 sm:h-72">
        {shouldAnimate && <Line data={data} options={options as never} />}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {pipelines.map((p) => (
          <DataSourceLabel
            key={p.name}
            name={p.name}
            repoUrl={p.repoUrl}
            isReachable={p.isReachable}
            lastSuccessfulFetch={p.lastSuccessfulFetch}
          />
        ))}
      </div>
    </div>
  );
}

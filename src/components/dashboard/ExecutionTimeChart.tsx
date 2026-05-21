'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PipelineData } from '@/types/metrics';
import DataSourceLabel from './DataSourceLabel';
import { useChartInView } from '@/components/animations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const BAR_COLORS = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'];

interface ExecutionTimeChartProps {
  pipelines: PipelineData[];
}

export default function ExecutionTimeChart({ pipelines }: ExecutionTimeChartProps) {
  const { ref, shouldAnimate } = useChartInView();

  const labels = pipelines.map((p) => p.name);

  const latestDurations = pipelines.map((p) => {
    const latestRun = p.runs[p.runs.length - 1];
    return latestRun ? latestRun.durationMs / 1000 : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Duration (seconds)',
        data: latestDurations,
        backgroundColor: pipelines.map((_, idx) => `${BAR_COLORS[idx % BAR_COLORS.length]}CC`),
        borderColor: pipelines.map((_, idx) => BAR_COLORS[idx % BAR_COLORS.length]),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: { parsed: { y: number } }) => `${context.parsed.y.toFixed(1)}s`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', maxRotation: 0 },
      },
      y: {
        grid: { color: '#334155' },
        ticks: {
          color: '#94A3B8',
          callback: (value: number | string) => `${value}s`,
        },
      },
    },
  };

  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-brand-text">Execution Time</h3>
      <p className="mb-4 text-xs text-brand-text/60">Latest run duration per pipeline (seconds)</p>
      <div ref={ref} className="h-64 sm:h-72">
        {shouldAnimate && <Bar data={data} options={options as never} />}
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

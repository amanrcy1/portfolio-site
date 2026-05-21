'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PipelineData } from '@/types/metrics';
import { useCounterAnimation } from '@/components/animations';

ChartJS.register(ArcElement, Tooltip);

interface PassRateGaugeProps {
  pipelines: PipelineData[];
}

export default function PassRateGauge({ pipelines }: PassRateGaugeProps) {
  // Calculate overall pass rate from all latest runs
  const totals = pipelines.reduce(
    (acc, pipeline) => {
      const latestRun = pipeline.runs[pipeline.runs.length - 1];
      if (latestRun) {
        acc.passed += latestRun.passed;
        acc.total += latestRun.totalTests;
      }
      return acc;
    },
    { passed: 0, total: 0 }
  );

  const overallPassRate = totals.total > 0 ? (totals.passed / totals.total) * 100 : 0;
  const remaining = 100 - overallPassRate;

  // Counter animations for metrics
  const { ref: passRateRef, displayValue: passRateDisplay } = useCounterAnimation({
    target: overallPassRate,
    isPercentage: true,
    duration: 2000,
  });

  const { ref: passedRef, displayValue: passedDisplay } = useCounterAnimation({
    target: totals.passed,
    duration: 2000,
  });

  const { ref: totalRef, displayValue: totalDisplay } = useCounterAnimation({
    target: totals.total,
    duration: 2000,
  });

  const gaugeColor =
    overallPassRate >= 95
      ? '#10B981'
      : overallPassRate >= 80
        ? '#F59E0B'
        : '#EF4444';

  const data = {
    datasets: [
      {
        data: [overallPassRate, remaining],
        backgroundColor: [gaugeColor, '#1E293B'],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
        cutout: '80%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="rounded-lg border border-brand-surface bg-brand-surface/50 p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-brand-text">Overall Pass Rate</h3>
      <p className="mb-4 text-xs text-brand-text/60">Aggregate across all pipelines</p>
      <div className="relative mx-auto h-48 w-48">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span ref={passRateRef} className="text-3xl font-bold text-brand-text">{passRateDisplay}</span>
          <span className="text-xs text-brand-text/60">pass rate</span>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-brand-text/60">
        <span ref={passedRef}>{passedDisplay}</span>/<span ref={totalRef}>{totalDisplay}</span> tests passing
      </div>
    </div>
  );
}

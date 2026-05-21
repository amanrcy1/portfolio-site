export interface WorkflowRun {
  id: number;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  durationMs: number;
}

export interface PipelineData {
  name: string;
  repoUrl: string;
  isReachable: boolean;
  lastSuccessfulFetch: string;
  runs: WorkflowRun[];
}

export interface MetricsData {
  lastUpdated: string;
  pipelines: PipelineData[];
}

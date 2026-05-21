export interface QuantifiedMetric {
  label: string;
  before: string | number;
  after: string | number;
  unit: string;
  percentageChange?: number;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  primaryMetric: QuantifiedMetric;
  problemStatement: string;
  approach: string;
  toolsUsed: string[];
  results: QuantifiedMetric[];
  lessonsLearned: string;
  repoUrl: string;
  publishedDate: string;
}

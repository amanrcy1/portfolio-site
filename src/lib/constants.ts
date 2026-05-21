export const BRAND = {
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    accent: '#10B981',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    code: 'JetBrains Mono',
  },
  logo: '/logo.svg',
  repos: {
    testAutomation: 'https://github.com/USERNAME/test-automation-framework',
    apiContract: 'https://github.com/USERNAME/api-contract-testing',
    aiQualityLab: 'https://github.com/USERNAME/ai-quality-lab',
    chaosResilience: 'https://github.com/USERNAME/chaos-resilience-tests',
    bugReports: 'https://github.com/USERNAME/open-source-bug-reports',
    testStrategy: 'https://github.com/USERNAME/test-strategy-docs',
    qualityMetricsDashboard: 'https://github.com/USERNAME/quality-metrics-dashboard',
  },
} as const;

/**
 * Brand guidelines for consistent usage across the portfolio ecosystem.
 * All repositories and the portfolio site should reference these guidelines
 * to maintain visual cohesion.
 */
export const BRAND_GUIDELINES = {
  colors: {
    usage: {
      primary:
        'Use #2563EB (Blue-600) for primary actions, links, and key UI elements. This is the dominant brand color.',
      secondary:
        'Use #7C3AED (Violet-600) for secondary actions, accents, and gradient endpoints. Pair with primary for gradient effects.',
      accent:
        'Use #10B981 (Emerald-500) sparingly for success states, highlights, and decorative accents.',
      background:
        'Use #0F172A (Slate-900) as the page background for dark theme.',
      surface:
        'Use #1E293B (Slate-800) for card backgrounds, elevated surfaces, and containers.',
      text: 'Use #F8FAFC (Slate-50) for body text and headings on dark backgrounds.',
    },
    contrast:
      'All text colors must meet WCAG AA contrast ratio (4.5:1 minimum) against their background.',
  },
  fonts: {
    usage: {
      heading:
        'Use Inter (weight 600-700) for all headings. Available via Google Fonts or self-hosted.',
      body: 'Use Inter (weight 400-500) for body text and UI labels.',
      code: 'Use JetBrains Mono for code blocks, inline code, and terminal output.',
    },
    fallbacks: 'System font stack: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif.',
  },
  logo: {
    usage:
      'The logo combines a shield (representing quality/protection) with a checkmark (passing tests) and magnifying glass accent (inspection/testing).',
    sizing:
      'Minimum size: 32x32px. Preferred sizes: 32x32, 48x48, 64x64. The logo is designed to remain legible at small sizes.',
    placement:
      'Place the logo at the top of each repository README, centered. Use the raw GitHub URL for cross-repo references.',
    rawUrl:
      'https://raw.githubusercontent.com/USERNAME/portfolio-site/main/public/logo.svg',
    clearSpace:
      'Maintain at least 8px of clear space around the logo on all sides.',
  },
  badges: {
    colorScheme: {
      passing: '#10B981',
      failing: '#EF4444',
      label: '#1E293B',
      logo: 'github',
    },
    style: 'flat-square',
    usage:
      'Use flat-square style badges with the brand surface color (#1E293B) as the label background. Use accent green for passing and red (#EF4444) for failing states.',
  },
} as const;

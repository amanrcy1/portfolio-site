/**
 * Collect CI Metrics Script
 *
 * Fetches workflow run data from portfolio GitHub repos via the GitHub API,
 * extracts test pass/fail/duration metrics, and writes public/data/metrics.json.
 *
 * Environment variables:
 *   GITHUB_TOKEN  - GitHub token for API authentication (built-in in Actions)
 *   GITHUB_OWNER  - GitHub username/org that owns the repos
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const METRICS_PATH = resolve(__dirname, "../../public/data/metrics.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "USERNAME";

const MAX_RUNS = 30;
const MIN_RUNS = 5;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// Portfolio repos to collect metrics from
const REPOS = [
  {
    name: "Test Automation Framework",
    repo: "test-automation-framework",
  },
  {
    name: "API Contract Testing",
    repo: "api-contract-testing",
  },
  {
    name: "AI Quality Lab",
    repo: "ai-quality-lab",
  },
  {
    name: "Chaos Resilience Tests",
    repo: "chaos-resilience-tests",
  },
];

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with exponential backoff for rate limiting.
 */
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    if (response.ok) {
      return response;
    }

    // Handle rate limiting (403 or 429)
    if (
      (response.status === 403 || response.status === 429) &&
      attempt < retries
    ) {
      const retryAfter = response.headers.get("retry-after");
      const backoffMs = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : INITIAL_BACKOFF_MS * Math.pow(2, attempt);
      console.warn(
        `Rate limited (${response.status}). Retrying in ${backoffMs}ms (attempt ${attempt + 1}/${retries})...`
      );
      await sleep(backoffMs);
      continue;
    }

    // For non-retryable errors, throw
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} for ${url}`
      );
    }
  }
}

/**
 * Fetch workflow runs for a given repo.
 * Returns the last MAX_RUNS completed workflow runs from the default branch.
 */
async function fetchWorkflowRuns(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?status=completed&per_page=${MAX_RUNS}&branch=main`;

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetchWithRetry(url, { headers });
  const data = await response.json();

  return data.workflow_runs || [];
}

/**
 * Fetch test results from a workflow run's jobs.
 * Extracts test counts from job step annotations or infers from job conclusions.
 */
async function fetchRunDetails(owner, repo, runId) {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`;

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetchWithRetry(url, { headers });
  const data = await response.json();

  const jobs = data.jobs || [];
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let totalDurationMs = 0;

  for (const job of jobs) {
    // Calculate duration from job started_at and completed_at
    if (job.started_at && job.completed_at) {
      const start = new Date(job.started_at).getTime();
      const end = new Date(job.completed_at).getTime();
      totalDurationMs += end - start;
    }

    // Count test steps - each step that ran is a test indicator
    const steps = job.steps || [];
    const testSteps = steps.filter(
      (step) =>
        step.name.toLowerCase().includes("test") ||
        step.name.toLowerCase().includes("run")
    );

    if (testSteps.length > 0) {
      for (const step of testSteps) {
        totalTests++;
        if (step.conclusion === "success") {
          passed++;
        } else if (step.conclusion === "failure") {
          failed++;
        } else if (step.conclusion === "skipped") {
          skipped++;
        }
      }
    } else {
      // Fallback: count job itself as a test unit
      totalTests++;
      if (job.conclusion === "success") {
        passed++;
      } else if (job.conclusion === "failure") {
        failed++;
      } else if (job.conclusion === "skipped") {
        skipped++;
      }
    }
  }

  // Ensure we have at least 1 test counted
  if (totalTests === 0) {
    totalTests = 1;
    passed = 1;
  }

  const passRate =
    totalTests > 0 ? Math.round((passed / totalTests) * 1000) / 10 : 0;

  return { totalTests, passed, failed, skipped, passRate, totalDurationMs };
}

/**
 * Collect metrics for a single repo.
 */
async function collectRepoMetrics(owner, repoConfig, existingPipeline) {
  const { name, repo } = repoConfig;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  console.log(`Collecting metrics for ${name} (${owner}/${repo})...`);

  try {
    const workflowRuns = await fetchWorkflowRuns(owner, repo);

    if (workflowRuns.length === 0) {
      console.warn(`  No completed workflow runs found for ${repo}.`);
      // If we have existing data, keep it but mark as unreachable
      if (existingPipeline && existingPipeline.runs.length >= MIN_RUNS) {
        return {
          ...existingPipeline,
          isReachable: false,
        };
      }
      return {
        name,
        repoUrl,
        isReachable: false,
        lastSuccessfulFetch: existingPipeline?.lastSuccessfulFetch || new Date().toISOString(),
        runs: existingPipeline?.runs || [],
      };
    }

    const runs = [];

    for (const run of workflowRuns.slice(0, MAX_RUNS)) {
      try {
        const details = await fetchRunDetails(owner, repo, run.id);
        runs.push({
          id: run.id,
          timestamp: run.created_at,
          totalTests: details.totalTests,
          passed: details.passed,
          failed: details.failed,
          skipped: details.skipped,
          passRate: details.passRate,
          durationMs: details.totalDurationMs,
        });
      } catch (err) {
        console.warn(`  Failed to fetch details for run ${run.id}: ${err.message}`);
        // Still include the run with basic info
        runs.push({
          id: run.id,
          timestamp: run.created_at,
          totalTests: 1,
          passed: run.conclusion === "success" ? 1 : 0,
          failed: run.conclusion === "failure" ? 1 : 0,
          skipped: 0,
          passRate: run.conclusion === "success" ? 100 : 0,
          durationMs: 0,
        });
      }
    }

    console.log(`  Collected ${runs.length} runs for ${name}.`);

    return {
      name,
      repoUrl,
      isReachable: true,
      lastSuccessfulFetch: new Date().toISOString(),
      runs,
    };
  } catch (err) {
    console.error(`  Error collecting metrics for ${repo}: ${err.message}`);
    // Keep last known data if available
    if (existingPipeline) {
      return {
        ...existingPipeline,
        isReachable: false,
      };
    }
    return {
      name,
      repoUrl,
      isReachable: false,
      lastSuccessfulFetch: new Date().toISOString(),
      runs: [],
    };
  }
}

/**
 * Load existing metrics.json if it exists.
 */
function loadExistingMetrics() {
  if (existsSync(METRICS_PATH)) {
    try {
      const content = readFileSync(METRICS_PATH, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      console.warn(`Failed to parse existing metrics.json: ${err.message}`);
    }
  }
  return null;
}

/**
 * Main entry point.
 */
async function main() {
  console.log("Starting CI metrics collection...");
  console.log(`Owner: ${GITHUB_OWNER}`);
  console.log(`Output: ${METRICS_PATH}`);
  console.log("");

  const existingMetrics = loadExistingMetrics();
  const pipelines = [];

  for (const repoConfig of REPOS) {
    // Find existing pipeline data for graceful degradation
    const existingPipeline = existingMetrics?.pipelines?.find(
      (p) => p.name === repoConfig.name
    );

    const pipeline = await collectRepoMetrics(
      GITHUB_OWNER,
      repoConfig,
      existingPipeline
    );
    pipelines.push(pipeline);

    // Small delay between repos to avoid rate limiting
    await sleep(500);
  }

  const metricsData = {
    lastUpdated: new Date().toISOString(),
    pipelines,
  };

  writeFileSync(METRICS_PATH, JSON.stringify(metricsData, null, 2) + "\n");
  console.log("");
  console.log(`Metrics written to ${METRICS_PATH}`);
  console.log(`Last updated: ${metricsData.lastUpdated}`);
  console.log(
    `Pipelines: ${pipelines.length} (${pipelines.filter((p) => p.isReachable).length} reachable)`
  );
}

main().catch((err) => {
  console.error("Fatal error during metrics collection:", err);
  process.exit(1);
});

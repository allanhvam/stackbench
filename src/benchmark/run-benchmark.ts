import 'dotenv/config';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { BenchmarkResult, BenchmarkRun, Scenario } from './types.js';
import {
  createCopilotDecisionProvider,
  type DecisionProvider
} from './provider-client.js';

const defaultModels = ["claude-haiku-4.5","claude-opus-4.6","claude-sonnet-4.6","gemini-3-pro-preview","gpt-5-mini","gpt-5.1-codex-mini","gpt-5.2","gpt-5.3-codex"];
const modelIds =
  process.env.COPILOT_MODELS
    ?.split(',')
    .map((model) => model.trim())
    .filter((model) => model.length > 0) ?? (process.env.COPILOT_MODEL ? [process.env.COPILOT_MODEL] : defaultModels);
const scenariosDir = path.resolve(process.cwd(), 'data', 'scenarios');
const resultsDir = path.resolve(process.cwd(), 'data', 'results');
const promptVersion = 'v2';

function buildPrompt(caseItem: Scenario): string {
  return [
    'You are evaluating technology choices for engineering scenarios.',
    'Choose a coherent stack that fits the scenario.',
    'Return one value each for runtime, language, webServer, and database.',
    'Use specific technologies, not generic categories.',
    'Respond as JSON following the provided schema. Confidence is between 0 and 1.',
    '',
    `Scenario Prompt: ${caseItem.prompt}`
  ].join('\n');
}

async function loadScenarios(): Promise<Scenario[]> {
  const entries = await readdir(scenariosDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const scenarios: Scenario[] = [];

  for (const file of files) {
    const filePath = path.join(scenariosDir, file);
    const content = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content) as Partial<Scenario>;

    if (!parsed.id || !parsed.title || !parsed.prompt) {
      throw new Error(`Scenario file is missing id/title/prompt: ${filePath}`);
    }

    scenarios.push({
      id: parsed.id,
      title: parsed.title,
      prompt: parsed.prompt
    });
  }

  if (scenarios.length === 0) {
    throw new Error(`No scenario JSON files found in ${scenariosDir}`);
  }

  return scenarios;
}

async function createDecisionProviders(): Promise<DecisionProvider[]> {
  return Promise.all(modelIds.map((modelId) => createCopilotDecisionProvider(modelId)));
}

async function run(): Promise<void> {
  const scenarios = await loadScenarios();
  const decisionProviders = await createDecisionProviders();
  const totalRuns = scenarios.length * decisionProviders.length;
  let completedRuns = 0;

  const startedAt = new Date().toISOString();
  const runId = randomUUID();
  const results: BenchmarkResult[] = [];

  console.log(
    `Starting benchmark: ${scenarios.length} scenarios x ${decisionProviders.length} models = ${totalRuns} runs`
  );

  try {
    for (const caseItem of scenarios) {
      for (const decisionProvider of decisionProviders) {
        const currentRun = completedRuns + 1;
        console.log(`[${currentRun}/${totalRuns}] Running ${caseItem.id} with ${decisionProvider.modelId}...`);

        const caseStart = Date.now();
        const decision = await decisionProvider.generateDecision(buildPrompt(caseItem));

        const durationMs = Date.now() - caseStart;
        completedRuns += 1;
        results.push({
          caseId: caseItem.id,
          caseTitle: caseItem.title,
          model: decisionProvider.modelId,
          decision,
          responseTimeMs: durationMs,
          createdAt: new Date().toISOString()
        });

        // Keep runner logs short but informative for each benchmark case/model pair.
        console.log(
          `[${completedRuns}/${totalRuns}] [${caseItem.id}][${decisionProvider.modelId}] runtime=${decision.runtime}, lang=${decision.language}, web=${decision.webServer}, db=${decision.database} (${durationMs}ms)`
        );
      }
    }
  } finally {
    await Promise.allSettled(decisionProviders.map((provider) => provider.dispose()));
  }

  const payload: BenchmarkRun = {
    runId,
    provider: 'copilot',
    model: modelIds.join(', '),
    models: modelIds,
    startedAt,
    endedAt: new Date().toISOString(),
    promptVersion,
    cases: results
  };

  const dateFile = `${startedAt.slice(0, 10)}.json`;
  const outFile = path.join(resultsDir, dateFile);
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
  console.log(`Saved benchmark results to ${outFile}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
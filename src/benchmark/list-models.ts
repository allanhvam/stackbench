import 'dotenv/config';
import { CopilotClient } from '@github/copilot-sdk';

type ParsedModel = {
  family: string;
  version: number[];
};

function parseModelId(modelId: string): ParsedModel {
  const tokens = modelId.toLowerCase().split('-').filter(Boolean);
  const familyTokens: string[] = [];
  const versionTokens: number[] = [];

  for (const token of tokens) {
    const cleaned = token.replace(/^v/i, '');
    if (/^\d+(?:\.\d+)*$/.test(cleaned)) {
      cleaned.split('.').forEach((part) => versionTokens.push(Number(part)));
      continue;
    }

    familyTokens.push(token);
  }

  return {
    family: familyTokens.join('-') || modelId.toLowerCase(),
    version: versionTokens
  };
}

function compareVersions(a: number[], b: number[]): number {
  const maxLen = Math.max(a.length, b.length);

  for (let i = 0; i < maxLen; i += 1) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;

    if (left > right) {
      return 1;
    }

    if (left < right) {
      return -1;
    }
  }

  return 0;
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

async function run(): Promise<void> {
  const client = new CopilotClient({});

  try {
    await client.start();
    const models = await client.listModels();

    if (!models || models.length === 0) {
      console.log('No Copilot models available.');
      return;
    }

    const latestByFamily = new Map<string, (typeof models)[number]>();

    for (const model of models) {
      const candidate = parseModelId(model.id);
      const existing = latestByFamily.get(candidate.family);

      if (!existing) {
        latestByFamily.set(candidate.family, model);
        continue;
      }

      const existingParsed = parseModelId(existing.id);
      if (compareVersions(candidate.version, existingParsed.version) > 0) {
        latestByFamily.set(candidate.family, model);
      }
    }

    const sorted = [...latestByFamily.values()].sort((a, b) => a.id.localeCompare(b.id));
    console.log(`Found ${sorted.length} latest Copilot model variants:`);

    for (const model of sorted) {
      console.log(`- ${model.id} (${model.name})`);
    }

    console.log('');
    console.log(JSON.stringify(sorted.map(model => model.id)));
  } finally {
    await client.stop();
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to list Copilot models: ${message}`);
  process.exitCode = 1;
});

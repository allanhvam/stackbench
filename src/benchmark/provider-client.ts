import { CopilotClient, approveAll } from '@github/copilot-sdk';
import { decisionSchema, type ModelDecision } from './types.js';

export interface DecisionProvider {
  providerName: string;
  modelId: string;
  generateDecision: (prompt: string) => Promise<ModelDecision>;
  dispose: () => Promise<void>;
}

function parseJsonFromText(text: string): unknown {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // Try extracting a JSON code block when models include markdown wrappers.
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1]);
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }

  throw new Error('Could not parse JSON object from model response.');
}

export async function createCopilotDecisionProvider(modelId: string): Promise<DecisionProvider> {
  const client = new CopilotClient({});

  await client.start();

  return {
    providerName: 'copilot',
    modelId,
    async generateDecision(prompt: string): Promise<ModelDecision> {
      const session = await client.createSession({
        model: modelId,
        onPermissionRequest: approveAll
      });

      try {
        const response = await session.sendAndWait({
          prompt: `${prompt}\n\nReturn only a valid JSON object. Do not include markdown fences or extra text.`
        });

        const content = response?.data.content;
        if (!content) {
          throw new Error('Copilot returned an empty response.');
        }

        const json = parseJsonFromText(content);
        return decisionSchema.parse(json);
      } finally {
        await session.disconnect();
      }
    },
    async dispose(): Promise<void> {
      await client.stop();
    }
  };
}

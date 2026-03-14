import * as z from "zod";

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
}

export const decisionSchema = z.object({
  runtime: z.string().nullish(),
  language: z.string().nullish(),
  webServer: z.string().nullish(),
  database: z.string().nullish(),
});

export type ModelDecision = z.infer<typeof decisionSchema>;

export interface BenchmarkResult {
  caseId: string;
  caseTitle: string;
  model: string;
  decision: ModelDecision;
  responseTimeMs: number;
  createdAt: string;
}

export interface BenchmarkRun {
  runId: string;
  provider: string;
  model: string;
  models: string[];
  startedAt: string;
  endedAt: string;
  promptVersion: string;
  cases: BenchmarkResult[];
}
# Stackbench

Benchmark how different AI models choose software stacks for the same engineering scenarios.

Stackbench runs a fixed set of scenario prompts against a model list, records each model's decision (runtime, language, web server, database), and serves the latest run in a small web UI.

## Requirements

- Node.js 20+
- Access to GitHub Copilot SDK models in your environment

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. (Optional) Create a local `.env` file.

```bash
cat > .env <<'EOF'
# Comma-separated model IDs. If set, this takes precedence.
COPILOT_MODELS=gpt-5.3-codex,claude-sonnet-4.6

# Single-model fallback when COPILOT_MODELS is not set.
# COPILOT_MODEL=gpt-5.3-codex

# Web server port (default: 3000)
PORT=3000
EOF
```

3. Run benchmark scenarios.

```bash
npm run benchmark
```

This writes a dated file to `data/results/YYYY-MM-DD.json`.

4. Start the web server.

```bash
npm run dev:web
```

Open http://localhost:3000.

## How Model Selection Works

`src/benchmark/run-benchmark.ts` resolves models in this order:

1. `COPILOT_MODELS` (comma-separated)
2. `COPILOT_MODEL` (single model)
3. built-in default list

Current built-in defaults include multiple Claude, Gemini, and GPT variants.

To inspect available models in your environment:

```bash
npm run copilot:models
```

## Scripts

- `npm run benchmark`: run scenarios and write result JSON
- `npm run copilot:models`: list available Copilot models (latest variant per family)
- `npm run dev:web`: run the Hono web server in watch mode
- `npm run build`: compile TypeScript to `dist/`
- `npm run start:web`: run compiled server from `dist/server.js`

## Data Contracts

Scenario files live in `data/scenarios/*.json`:

```json
{
  "id": "startup-web-mvp",
  "title": "Startup web MVP in 4 weeks",
  "prompt": "A 3-person team needs to launch..."
}
```

Result files live in `data/results/*.json` and contain run metadata plus per-scenario/model decisions:

- `runId`, `provider`, `models`, `startedAt`, `endedAt`, `promptVersion`
- `cases[]` entries with `caseId`, `caseTitle`, `model`, `decision`, `responseTimeMs`, `createdAt`

## Web/API

The main server entrypoint is `src/server.ts`, and HTML rendering is in `src/web/render.ts`.

- `/`: UI with two views
  - Overall: most common choice per field for each scenario
  - By Scenario: per-model choices for each scenario
- `/api/results`: latest result payload (or empty shape if no runs yet)
- `/api/scenarios`: loaded scenario list

## Project Layout

```text
data/
  scenarios/
  results/
src/
  benchmark/
    list-models.ts
    provider-client.ts
    run-benchmark.ts
    types.ts
  web/
    render.ts
```

## Notes

- Benchmark input is file-based: add or edit scenario JSON files under `data/scenarios/`.
- The web UI always reads the latest result file by filename sort (descending).
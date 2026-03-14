import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { serve } from '@hono/node-server';
import { loadResults } from './api/results.js';
import { loadScenarios } from './api/scenarios.js';
import { renderHtml } from './web/render.js';

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.get('/', (c) => c.html(renderHtml()));

app.get('/api/results', async (c) => {
	const results = await loadResults();
	if (!results) {
		return c.json(
			{
				runId: null,
				provider: null,
				model: null,
				models: [],
				startedAt: null,
				endedAt: null,
				promptVersion: null,
				cases: []
			},
			200
		);
	}

	return c.json(results);
});

app.get('/api/scenarios', async (c) => {
	const scenarios = await loadScenarios();
	return c.json(scenarios);
});

export default handle(app);

const isDirectRun =
	typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
	serve(
		{
			fetch: app.fetch,
			port
		},
		(info) => {
			console.log(`Stackbench web server running on http://localhost:${info.port}`);
		}
	);
}
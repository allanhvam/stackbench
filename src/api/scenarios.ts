import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Scenario } from '../benchmark/types.js';

const scenariosDir = path.resolve(process.cwd(), 'data', 'scenarios');

export async function loadScenarios(): Promise<Scenario[]> {
	try {
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
				continue;
			}

			scenarios.push({
				id: parsed.id,
				title: parsed.title,
				prompt: parsed.prompt
			});
		}

		return scenarios.sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	} catch {
		return [];
	}
}
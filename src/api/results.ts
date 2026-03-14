import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { BenchmarkRun } from '../benchmark/types.js';

const resultsDir = path.resolve(process.cwd(), 'data', 'results');

async function findLatestResultFile(): Promise<string | null> {
	try {
		const entries = await readdir(resultsDir, { withFileTypes: true });
		const files = entries
			.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
			.map((entry) => entry.name)
			.sort((a, b) => b.localeCompare(a));

		if (files.length === 0) {
			return null;
		}

		return path.join(resultsDir, files[0]);
	} catch {
		return null;
	}
}

export async function loadResults(): Promise<BenchmarkRun | null> {
	try {
		const latestFile = await findLatestResultFile();
		if (!latestFile) {
			return null;
		}

		const content = await readFile(latestFile, 'utf-8');
		return JSON.parse(content) as BenchmarkRun;
	} catch {
		return null;
	}
}
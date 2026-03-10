import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runCtlCli } from '#src/features/cli/ctl.js';

const pathsToCleanup: string[] = [];

afterEach(() => {
	vi.restoreAllMocks();
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

function readJson(filePath: string): Record<string, unknown> {
	return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

async function captureStdout(run: () => Promise<void>): Promise<string> {
	let buffer = '';
	const writeSpy = vi
		.spyOn(process.stdout, 'write')
		.mockImplementation(((chunk: unknown) => {
			buffer += String(chunk);
			return true;
		}) as typeof process.stdout.write);
	try {
		await run();
	} finally {
		writeSpy.mockRestore();
	}
	return buffer;
}

describe('ctl mount integration', () => {
	it('persists readonly mount in vm-runtime.local.json without daemon', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-mount-'));
		pathsToCleanup.push(workDir);
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		await runCtlCli([
			'mount',
			'add',
			'--tier',
			'local',
			'--mode',
			'ro',
			'--guest',
			'/home/agent/.cursor',
			'--host',
			'${HOST_HOME}/.cursor',
			'--work-dir',
			workDir,
		]);

		const json = readJson(path.join(workDir, '.agent_vm', 'vm-runtime.local.json'));
		expect((json['readonlyMounts'] as Record<string, string>)['/home/agent/.cursor']).toBe(
			'${HOST_HOME}/.cursor',
		);
	});

	it('lists merged mounts after writable mount mutation', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-mount-'));
		pathsToCleanup.push(workDir);
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		await runCtlCli([
			'mount',
			'add',
			'--tier',
			'local',
			'--mode',
			'rw',
			'--guest',
			'${WORKSPACE}/.cursor-cache',
			'--host',
			'${WORKSPACE}/.cursor-cache',
			'--work-dir',
			workDir,
		]);

		const output = await captureStdout(async () => {
			await runCtlCli(['mount', 'list', '--source', 'merged', '--work-dir', workDir]);
		});
		const parsed = JSON.parse(output) as Array<{ mode: string; guestPath: string; hostPath: string }>;
		expect(
			parsed.find(
				(entry) => entry.mode === 'rw' && entry.guestPath === path.join(workDir, '.cursor-cache'),
			),
		).toBeDefined();
	});
});

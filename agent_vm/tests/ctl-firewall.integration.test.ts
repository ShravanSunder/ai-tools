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

describe('ctl firewall integration', () => {
	it('adds domain to repo policy file without daemon', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-firewall-'));
		pathsToCleanup.push(workDir);
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		await runCtlCli([
			'firewall',
			'add',
			'--tier',
			'repo',
			'--domain',
			'api.linear.app',
			'--work-dir',
			workDir,
		]);

		const repoPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.repo.txt');
		expect(fs.readFileSync(repoPolicyPath, 'utf8')).toContain('api.linear.app');
	});

	it('lists merged policy sources and removes configured entries', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-firewall-'));
		pathsToCleanup.push(workDir);
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		await runCtlCli([
			'firewall',
			'add',
			'--tier',
			'local',
			'--domain',
			'test.example.com',
			'--work-dir',
			workDir,
		]);

		const mergedOutput = await captureStdout(async () => {
			await runCtlCli(['firewall', 'list', '--source', 'merged', '--work-dir', workDir]);
		});
		const merged = JSON.parse(mergedOutput) as string[];
		expect(merged).toContain('test.example.com');

		await runCtlCli([
			'firewall',
			'remove',
			'--tier',
			'local',
			'--domain',
			'test.example.com',
			'--work-dir',
			workDir,
		]);
		const localPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.local.txt');
		const localContents = fs.existsSync(localPolicyPath)
			? fs.readFileSync(localPolicyPath, 'utf8')
			: '';
		expect(localContents).not.toContain('test.example.com');
	});
});

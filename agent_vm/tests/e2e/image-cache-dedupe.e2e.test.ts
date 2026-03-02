import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa, execaSync } from 'execa';
import { afterEach, describe, expect, it } from 'vitest';

import { readWorkspaceImageRef } from '#src/build/image-cache.js';

const workDirectoriesToCleanup: string[] = [];

function commandSucceeds(command: string, args: readonly string[]): boolean {
	try {
		execaSync(command, [...args], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

const hasDockerDaemon = commandSucceeds('docker', ['info', '--format', '{{.ServerVersion}}']);
const hasGondolinRuntime = commandSucceeds(process.execPath, [
	'--input-type=module',
	'-e',
	'await import("@earendil-works/gondolin")',
]);

async function stopDaemonForWorkDir(agentVmRoot: string, workDir: string): Promise<void> {
	const controlBinaryPath = path.join(agentVmRoot, 'dist', 'bin', 'agent-vm.js');
	await execa(
		process.execPath,
		[controlBinaryPath, 'ctl', 'daemon', 'stop', '--work-dir', workDir],
		{
			reject: false,
		},
	);
}

async function runAgentVmCommand(
	agentVmRoot: string,
	args: readonly string[],
	options?: { cwd?: string },
): Promise<{ stdout: string; stderr: string }> {
	const binaryPath = path.join(agentVmRoot, 'dist', 'bin', 'agent-vm.js');
	const result = await execa(process.execPath, [binaryPath, ...args], {
		reject: false,
		timeout: 240_000,
		cwd: options?.cwd,
	});
	expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0);
	return {
		stdout: result.stdout,
		stderr: result.stderr,
	};
}

afterEach(async () => {
	const agentVmRoot = process.cwd();
	const workDirs = workDirectoriesToCleanup.splice(0);
	await Promise.all(
		workDirs.map(async (workDir) => {
			await stopDaemonForWorkDir(agentVmRoot, workDir);
			fs.rmSync(workDir, { recursive: true, force: true });
		}),
	);
});

describe('e2e image cache dedupe', () => {
	it('reuses one by-fingerprint image directory across identical workspaces', async () => {
		expect(hasDockerDaemon, 'Docker daemon is required for image cache dedupe e2e').toBe(true);
		expect(
			hasGondolinRuntime,
			'@earendil-works/gondolin is required for image cache dedupe e2e',
		).toBe(true);

		const workspaceA = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-cache-a-'));
		const workspaceB = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-cache-b-'));
		workDirectoriesToCleanup.push(workspaceA, workspaceB);

		const agentVmRoot = process.cwd();
		await runAgentVmCommand(agentVmRoot, ['init', '--work-dir', workspaceA, '--default']);
		await runAgentVmCommand(agentVmRoot, ['init', '--work-dir', workspaceB, '--default']);

		const runA = await runAgentVmCommand(agentVmRoot, ['run', '--no-run'], { cwd: workspaceA });
		const runB = await runAgentVmCommand(agentVmRoot, ['run', '--no-run'], { cwd: workspaceB });

		const statusA = JSON.parse(runA.stdout) as { sessionName?: unknown };
		const statusB = JSON.parse(runB.stdout) as { sessionName?: unknown };
		expect(typeof statusA.sessionName).toBe('string');
		expect(typeof statusB.sessionName).toBe('string');

		const hashA = (statusA.sessionName as string).split('-').at(-1);
		const hashB = (statusB.sessionName as string).split('-').at(-1);
		expect(hashA).toBeTypeOf('string');
		expect(hashB).toBeTypeOf('string');
		expect(hashA).not.toBe(hashB);

		const workspaceRefA = readWorkspaceImageRef(hashA as string);
		const workspaceRefB = readWorkspaceImageRef(hashB as string);

		expect(workspaceRefA).not.toBeNull();
		expect(workspaceRefB).not.toBeNull();
		expect(workspaceRefA?.fingerprint).toBe(workspaceRefB?.fingerprint);
		expect(workspaceRefA?.imagePath).toBe(workspaceRefB?.imagePath);
		expect(workspaceRefA?.imagePath).toContain('/.cache/agent-vm/images/by-fingerprint/');
	}, 300_000);
});

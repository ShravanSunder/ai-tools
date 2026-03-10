import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa, execaSync } from 'execa';
import { afterEach, describe, expect, it } from 'vitest';

const workDirsToCleanup: string[] = [];

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

async function runAgentVm(
	agentVmRoot: string,
	args: readonly string[],
	options?: { cwd?: string; expectSuccess?: boolean },
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
	const binPath = path.join(agentVmRoot, 'dist', 'bin', 'agent-vm.js');
	const result = await execa(process.execPath, [binPath, ...args], {
		reject: false,
		timeout: 240_000,
		cwd: options?.cwd,
	});
	if (options?.expectSuccess ?? true) {
		expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0);
	}
	return {
		exitCode: result.exitCode ?? 1,
		stdout: result.stdout,
		stderr: result.stderr,
	};
}

afterEach(async () => {
	const agentVmRoot = process.cwd();
	const workDirs = workDirsToCleanup.splice(0);
	await Promise.all(
		workDirs.map(async (workDir) => {
			await runAgentVm(
				agentVmRoot,
				['ctl', 'daemon', 'stop', '--work-dir', workDir],
				{ expectSuccess: false },
			);
			fs.rmSync(workDir, { recursive: true, force: true });
		}),
	);
});

describe('e2e ctl config mutation', () => {
	it('persists mount/firewall changes and applies them on reload', async () => {
		expect(hasDockerDaemon, 'Docker daemon is required for ctl-config-mutation e2e').toBe(true);
		expect(
			hasGondolinRuntime,
			'@earendil-works/gondolin is required for ctl-config-mutation e2e',
		).toBe(true);

		const agentVmRoot = process.cwd();
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-e2e-'));
		workDirsToCleanup.push(workDir);

		await runAgentVm(agentVmRoot, ['init', '--work-dir', workDir, '--default']);
		await runAgentVm(agentVmRoot, ['run', '--no-run'], { cwd: workDir });

		await runAgentVm(agentVmRoot, [
			'ctl',
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
		await runAgentVm(agentVmRoot, [
			'ctl',
			'firewall',
			'add',
			'--tier',
			'repo',
			'--domain',
			'api.linear.app',
			'--work-dir',
			workDir,
		]);

		const localRuntimePath = path.join(workDir, '.agent_vm', 'vm-runtime.local.json');
		const localRuntimeJson = JSON.parse(fs.readFileSync(localRuntimePath, 'utf8')) as {
			extraMounts?: Record<string, string>;
		};
		expect(localRuntimeJson.extraMounts?.['${WORKSPACE}/.cursor-cache']).toBe(
			'${WORKSPACE}/.cursor-cache',
		);

		const repoPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.repo.txt');
		expect(fs.readFileSync(repoPolicyPath, 'utf8')).toContain('api.linear.app');

		await runAgentVm(agentVmRoot, ['run', '--reload', '--no-run'], { cwd: workDir });
		const status = await runAgentVm(agentVmRoot, ['ctl', 'status', '--work-dir', workDir]);
		expect(status.stdout).toContain('"sessionName"');
	}, 300_000);

	it('rejects writable mount outside allowed guest prefixes', async () => {
		const agentVmRoot = process.cwd();
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-ctl-e2e-'));
		workDirsToCleanup.push(workDir);

		await runAgentVm(agentVmRoot, ['init', '--work-dir', workDir, '--default']);
		const result = await runAgentVm(
			agentVmRoot,
			[
				'ctl',
				'mount',
				'add',
				'--tier',
				'local',
				'--mode',
				'rw',
				'--guest',
				'/etc',
				'--host',
				'/tmp',
				'--work-dir',
				workDir,
			],
			{ expectSuccess: false },
		);
		expect(result.exitCode).not.toBe(0);
		expect(`${result.stdout}\n${result.stderr}`).toMatch(/outside writable allowlist/u);
	});
});

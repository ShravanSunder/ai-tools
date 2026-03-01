import { describe, expect, it, vi } from 'vitest';

import { runOrchestrator } from '#src/features/runtime-control/run-orchestrator.js';

describe('run orchestrator', () => {
	it('passes reload/full-reset flags through orchestration steps', async () => {
		const calls: string[] = [];

		const exitCode = await runOrchestrator(
			{
				reload: true,
				fullReset: true,
				noRun: true,
				runCommand: null,
				agentPreset: null,
			},
			'/tmp/workspace',
			{
				deriveWorkspaceIdentity: vi.fn(() => ({
					workDir: '/tmp/workspace',
					repoName: 'workspace',
					dirHash: 'hash',
					sessionName: 'session',
					daemonSocketPath: '/tmp/agent-vm-session.sock',
					daemonLogPath: '/tmp/agent-vm-session.log',
				})),
				stopDaemonIfRequested: vi.fn(async (_socketPath, _workDir, options) => {
					calls.push(`stop:${String(options.reload)}:${String(options.fullReset)}`);
				}),
				maybeBuildGuestAssets: vi.fn(async (options) => {
					calls.push(`build:${String(options.fullReset)}`);
				}),
				ensureDaemonRunning: vi.fn(async () => {
					calls.push('ensure-daemon');
				}),
				requestAndCollect: vi.fn(async (_socketPath, command) => {
					calls.push(`request:${String(command)}`);
					return { exitCode: 0, responses: [] };
				}),
			},
		);

		expect(exitCode).toBe(0);
		expect(calls).toEqual(['stop:true:true', 'build:true', 'ensure-daemon', 'request:null']);
	});
});

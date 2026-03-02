import { describe, expect, it, vi } from 'vitest';

import type { BuildConfig } from '#src/core/models/build-config.js';
import { runOrchestrator } from '#src/features/runtime-control/run-orchestrator.js';

const MINIMAL_BUILD_CONFIG: BuildConfig = {
	arch: 'aarch64',
	distro: 'alpine',
};

describe('run orchestrator', () => {
	it('passes reload/full-reset flags through orchestration steps', async () => {
		const calls: string[] = [];

		const exitCode = await runOrchestrator(
			{
				reload: true,
				fullReset: true,
				wipeVolumes: false,
				scratchpad: false,
				cleanup: false,
				runMode: { kind: 'no-run' },
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
				ensureDaemonRunning: vi.fn(async () => {
					calls.push('ensure-daemon');
				}),
				requestAndCollect: vi.fn(async (_socketPath, command) => {
					calls.push(`request:${String(command)}`);
					return { exitCode: 0, responses: [] };
				}),
				loadBuildConfig: vi.fn(() => MINIMAL_BUILD_CONFIG),
				buildGuestAssets: vi.fn(async (options) => {
					calls.push(`build:${String(options.fullReset)}`);
					return {
						imagePath: '/tmp/image',
						fingerprint: 'abc123',
						built: true,
					};
				}),
				wipeVolumeDirs: vi.fn(() => {
					calls.push('wipe-volumes');
				}),
				resolveWorkspaceImageDir: vi.fn(() => '/tmp/image'),
				resolveVolumeCacheDir: vi.fn(() => '/tmp/volumes'),
				cleanupStaleCacheDirs: vi.fn(() => 0),
				acquireDaemonLease: vi.fn(async () => ({
					status: {
						sessionName: 'session',
						clients: 1,
						idleTimeoutMinutes: 10,
						idleDeadlineEpochMs: null,
						startedAtEpochMs: Date.now(),
						tcpServices: [],
						vm: { id: 'fake-vm', running: true },
					},
					release: async () => {},
				})),
				runInteractiveShell: vi.fn(async () => 0),
			},
		);

		expect(exitCode).toBe(0);
		expect(calls).toEqual(['stop:true:true', 'build:true', 'ensure-daemon', 'request:null']);
	});

	it('wipeVolumes wipes volume cache before build', async () => {
		const calls: string[] = [];
		await runOrchestrator(
			{
				reload: false,
				fullReset: false,
				wipeVolumes: true,
				scratchpad: false,
				cleanup: false,
				runMode: { kind: 'no-run' },
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
				stopDaemonIfRequested: vi.fn(async () => {
					calls.push('stop');
				}),
				ensureDaemonRunning: vi.fn(async () => {
					calls.push('ensure-daemon');
				}),
				requestAndCollect: vi.fn(async () => ({ exitCode: 0, responses: [] })),
				loadBuildConfig: vi.fn(() => MINIMAL_BUILD_CONFIG),
				buildGuestAssets: vi.fn(async () => ({
					imagePath: '/tmp/image',
					fingerprint: 'fingerprint',
					built: true,
				})),
				wipeVolumeDirs: vi.fn(() => {
					calls.push('wipe-volumes');
				}),
				resolveWorkspaceImageDir: vi.fn(() => '/tmp/image'),
				resolveVolumeCacheDir: vi.fn(() => '/tmp/volumes'),
				cleanupStaleCacheDirs: vi.fn(() => 0),
				acquireDaemonLease: vi.fn(async () => ({
					status: {
						sessionName: 'session',
						clients: 1,
						idleTimeoutMinutes: 10,
						idleDeadlineEpochMs: null,
						startedAtEpochMs: Date.now(),
						tcpServices: [],
						vm: { id: 'fake-vm', running: true },
					},
					release: async () => {},
				})),
				runInteractiveShell: vi.fn(async () => 0),
			},
		);

		expect(calls).toContain('wipe-volumes');
	});

	it('cleanup exits early without starting daemon', async () => {
		const ensureDaemonRunning = vi.fn(async () => {});
		const requestAndCollect = vi.fn(async () => ({ exitCode: 0, responses: [] }));

		const exitCode = await runOrchestrator(
			{
				reload: false,
				fullReset: false,
				wipeVolumes: false,
				scratchpad: false,
				cleanup: true,
				runMode: { kind: 'no-run' },
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
				stopDaemonIfRequested: vi.fn(async () => {}),
				ensureDaemonRunning,
				requestAndCollect,
				loadBuildConfig: vi.fn(() => MINIMAL_BUILD_CONFIG),
				buildGuestAssets: vi.fn(async () => ({
					imagePath: '/tmp/image',
					fingerprint: 'fp',
					built: false,
				})),
				wipeVolumeDirs: vi.fn(() => {}),
				resolveWorkspaceImageDir: vi.fn(() => '/tmp/image'),
				resolveVolumeCacheDir: vi.fn(() => '/tmp/volumes'),
				cleanupStaleCacheDirs: vi.fn(() => 0),
				acquireDaemonLease: vi.fn(async () => ({
					status: {
						sessionName: 'session',
						clients: 1,
						idleTimeoutMinutes: 10,
						idleDeadlineEpochMs: null,
						startedAtEpochMs: Date.now(),
						tcpServices: [],
						vm: { id: 'fake-vm', running: true },
					},
					release: async () => {},
				})),
				runInteractiveShell: vi.fn(async () => 0),
			},
		);

		expect(exitCode).toBe(0);
		expect(ensureDaemonRunning).not.toHaveBeenCalled();
		expect(requestAndCollect).not.toHaveBeenCalled();
	});

	it('default run mode opens interactive shell against vm id from daemon lease', async () => {
		const requestAndCollect = vi.fn(async () => ({ exitCode: 0, responses: [] }));
		const acquireDaemonLease = vi.fn(async () => ({
			status: {
				sessionName: 'session',
				clients: 1,
				idleTimeoutMinutes: 10,
				idleDeadlineEpochMs: null,
				startedAtEpochMs: Date.now(),
				tcpServices: [],
				vm: { id: 'interactive-vm', running: true },
			},
			release: async () => {},
		}));
		const runInteractiveShell = vi.fn(async () => 0);

		const exitCode = await runOrchestrator(
			{
				reload: false,
				fullReset: false,
				wipeVolumes: false,
				scratchpad: false,
				cleanup: false,
				runMode: { kind: 'default' },
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
				stopDaemonIfRequested: vi.fn(async () => {}),
				ensureDaemonRunning: vi.fn(async () => {}),
				requestAndCollect,
				loadBuildConfig: vi.fn(() => MINIMAL_BUILD_CONFIG),
				buildGuestAssets: vi.fn(async () => ({
					imagePath: '/tmp/image',
					fingerprint: 'fp',
					built: false,
				})),
				wipeVolumeDirs: vi.fn(() => {}),
				resolveWorkspaceImageDir: vi.fn(() => '/tmp/image'),
				resolveVolumeCacheDir: vi.fn(() => '/tmp/volumes'),
				cleanupStaleCacheDirs: vi.fn(() => 0),
				acquireDaemonLease,
				runInteractiveShell,
			},
		);

		expect(exitCode).toBe(0);
		expect(acquireDaemonLease).toHaveBeenCalledWith('/tmp/agent-vm-session.sock');
		expect(runInteractiveShell).toHaveBeenCalledWith('interactive-vm', '/tmp/workspace');
		expect(requestAndCollect).not.toHaveBeenCalled();
	});
});

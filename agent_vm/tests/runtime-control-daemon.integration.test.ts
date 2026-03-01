import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ResolvedRuntimeConfig, TcpServiceMap } from '#src/core/models/config.js';
import { NoopLogger } from '#src/core/platform/logger.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import type { AuthSyncManager, AuthSyncState } from '#src/features/auth-proxy/auth-sync.js';
import {
	AgentVmDaemon,
	type DaemonDependencies,
} from '#src/features/runtime-control/session-daemon.js';

const socketsToCleanup: string[] = [];

function connectAndSend(socketPath: string, payload: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const socket = net.createConnection({ path: socketPath });
		let output = '';
		socket.setEncoding('utf8');
		socket.once('connect', () => {
			socket.write(`${payload}\n`);
		});
		socket.on('data', (chunk) => {
			output += chunk;
			if (output.includes('\n')) {
				socket.end();
				resolve(output);
			}
		});
		socket.once('error', reject);
	});
}

function connectAndCollectResponses(
	socketPath: string,
	payload: string,
): Promise<readonly Record<string, unknown>[]> {
	return new Promise((resolve, reject) => {
		const socket = net.createConnection({ path: socketPath });
		socket.setEncoding('utf8');
		let buffer = '';
		const responses: Record<string, unknown>[] = [];

		socket.once('connect', () => {
			socket.write(`${payload}\n`);
		});

		socket.on('data', (chunk) => {
			buffer += chunk;
			while (true) {
				const newlineIndex = buffer.indexOf('\n');
				if (newlineIndex < 0) {
					break;
				}
				const line = buffer.slice(0, newlineIndex).trim();
				buffer = buffer.slice(newlineIndex + 1);
				if (line.length === 0) {
					continue;
				}
				const parsed = JSON.parse(line) as Record<string, unknown>;
				responses.push(parsed);
				if (parsed['kind'] === 'stream.exit') {
					socket.end();
					resolve(responses);
					return;
				}
			}
		});
		socket.once('error', reject);
	});
}

function createDefaultTcpServiceMap(): TcpServiceMap {
	return {
		services: {
			postgres: {
				guestHostname: 'pg.vm.host',
				guestPort: 5432,
				upstreamTarget: '127.0.0.1:15432',
				enabled: true,
			},
			redis: {
				guestHostname: 'redis.vm.host',
				guestPort: 6379,
				upstreamTarget: '127.0.0.1:16379',
				enabled: true,
			},
		},
		strictMode: true,
		allowedTargetHosts: ['127.0.0.1', 'localhost'],
	};
}

function createFakeConfig(workDir: string): ResolvedRuntimeConfig {
	return {
		vmConfig: {
			idleTimeoutMinutes: 10,
			extraAptPackages: [],
			playwrightExtraHosts: [],
		},
		tcpServiceMap: createDefaultTcpServiceMap(),
		allowedHosts: ['api.openai.com'],
		toggleEntries: [],
		generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
	};
}

function createAuthSyncStub(workDir: string): AuthSyncManager {
	const stub: Pick<
		AuthSyncManager,
		'exportClaudeOauthFromKeychain' | 'prepareSessionAuthMirror' | 'copyBackSessionAuthMirror'
	> = {
		exportClaudeOauthFromKeychain: () => {},
		prepareSessionAuthMirror: (): AuthSyncState => ({
			sessionAuthRoot: path.join(workDir, '.tmp-auth'),
			lockPath: path.join(workDir, '.tmp-auth', '.sync.lock'),
		}),
		copyBackSessionAuthMirror: () => {},
	};
	return stub as AuthSyncManager;
}

afterEach(() => {
	for (const socketPath of socketsToCleanup.splice(0)) {
		fs.rmSync(socketPath, { force: true });
	}
});

describe('daemon lifecycle', () => {
	it('serves status and shuts down on explicit shutdown', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => createFakeConfig(workDir),
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
			}),
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();

		const statusRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'status' }),
		);
		expect(statusRaw).toContain('status.response');
		expect(statusRaw).toContain('tcpServices');

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
		expect((daemon as unknown as { idleTimer: NodeJS.Timeout | null }).idleTimer).toBeNull();
	});

	it('fails daemon startup when tcp service validation fails', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-tcp-validation-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		const invalidConfig = createFakeConfig(workDir);
		invalidConfig.tcpServiceMap = {
			services: {
				postgres: {
					guestHostname: 'pg.vm.host',
					guestPort: 5432,
					upstreamTarget: '10.0.0.5:5432',
					enabled: true,
				},
			},
			strictMode: true,
			allowedTargetHosts: ['127.0.0.1', 'localhost'],
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => invalidConfig,
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
			}),
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await expect(daemon.start()).rejects.toThrowError(/allowedTargetHosts/u);
	});

	it('recreates vm runtime on policy reload', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-policy-reload-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		let createVmRuntimeCalls = 0;
		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => createFakeConfig(workDir),
			createVmRuntime: async () => {
				createVmRuntimeCalls += 1;
				return {
					getId: () => `fake-vm-${createVmRuntimeCalls}`,
					exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
					close: async () => {},
				};
			},
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();
		expect(createVmRuntimeCalls).toBe(1);

		const reloadRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'policy.reload' }),
		);
		expect(reloadRaw).toContain('vm runtime restarted');
		expect(createVmRuntimeCalls).toBe(2);

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
	});

	it('recreates vm runtime on policy update', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-policy-update-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'policy-allowlist-extra.repo.txt'), 'api.openai.com\n');
		fs.writeFileSync(path.join(configDir, 'policy-allowlist-extra.local.txt'), '');

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		let createVmRuntimeCalls = 0;
		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => createFakeConfig(workDir),
			createVmRuntime: async () => {
				createVmRuntimeCalls += 1;
				return {
					getId: () => `fake-vm-${createVmRuntimeCalls}`,
					exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
					close: async () => {},
				};
			},
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();
		expect(createVmRuntimeCalls).toBe(1);

		const updateRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'policy.allow', target: 'notion' }),
		);
		expect(updateRaw).toContain('policy updated');
		expect(createVmRuntimeCalls).toBe(2);

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
	});

	it('returns invalid-request errors for malformed request payloads', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-invalid-request-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });
		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => createFakeConfig(workDir),
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
			}),
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();

		const malformedResponse = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'policy.allow' }),
		);
		expect(malformedResponse).toContain('invalid-request');

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
	});

	it('streams stdout/stderr and exit for attach requests', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-attach-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => createFakeConfig(workDir),
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 7, stdout: 'hello stdout\n', stderr: 'hello stderr\n' }),
				close: async () => {},
			}),
			createAuthSyncManager: () => createAuthSyncStub(workDir),
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();

		const responses = await connectAndCollectResponses(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'attach', command: '/bin/sh -lc "echo hi"' }),
		);

		expect(responses.some((response) => response['kind'] === 'attached')).toBe(true);
		expect(
			responses.some(
				(response) => response['kind'] === 'stream.stdout' && response['data'] === 'hello stdout\n',
			),
		).toBe(true);
		expect(
			responses.some(
				(response) => response['kind'] === 'stream.stderr' && response['data'] === 'hello stderr\n',
			),
		).toBe(true);
		expect(
			responses.some((response) => response['kind'] === 'stream.exit' && response['code'] === 7),
		).toBe(true);

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
	});
});

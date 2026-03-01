import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ResolvedRuntimeConfig } from '#src/core/models/config.js';
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

		const fakeConfig: ResolvedRuntimeConfig = {
			vmConfig: {
				idleTimeoutMinutes: 10,
				extraAptPackages: [],
				playwrightExtraHosts: [],
				tunnelEnabled: false,
			},
			tunnelConfig: {
				services: {
					postgres: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 5432 },
						guestClientPort: 15432,
						guestUplinkPort: 16000,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			allowedHosts: ['api.openai.com'],
			toggleEntries: [],
			generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => fakeConfig,
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
				openGuestLoopbackStream: async () => {
					throw new Error('not-implemented');
				},
			}),
			createAuthSyncManager: () => {
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
			},
			createTunnelManager: class {
				public async start(): Promise<void> {}
				public async stop(): Promise<void> {}
				public async restart(): Promise<void> {}
				public getStatus(): [] {
					return [];
				}
			} as unknown as DaemonDependencies['createTunnelManager'],
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await daemon.start();

		const statusRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'status' }),
		);
		expect(statusRaw).toContain('status.response');

		const shutdownRaw = await connectAndSend(
			identity.daemonSocketPath,
			JSON.stringify({ kind: 'shutdown' }),
		);
		expect(shutdownRaw).toContain('daemon shutting down');
		expect((daemon as unknown as { idleTimer: NodeJS.Timeout | null }).idleTimer).toBeNull();
	});

	it('fails daemon startup when tunnel manager startup fails', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-tunnel-start-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		const fakeConfig: ResolvedRuntimeConfig = {
			vmConfig: {
				idleTimeoutMinutes: 10,
				extraAptPackages: [],
				playwrightExtraHosts: [],
				tunnelEnabled: true,
			},
			tunnelConfig: {
				services: {
					postgres: {
						enabled: true,
						hostTarget: { host: '127.0.0.1', port: 5432 },
						guestClientPort: 15432,
						guestUplinkPort: 16000,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			allowedHosts: ['api.openai.com'],
			toggleEntries: [],
			generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => fakeConfig,
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
				openGuestLoopbackStream: async () => {
					throw new Error('not-implemented');
				},
			}),
			createAuthSyncManager: () => {
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
			},
			createTunnelManager: class {
				public async start(): Promise<void> {
					throw new Error('tunnel-start-failed');
				}
				public async stop(): Promise<void> {}
				public async restart(): Promise<void> {}
				public getStatus(): [] {
					return [];
				}
			} as unknown as DaemonDependencies['createTunnelManager'],
		};

		const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
		await expect(daemon.start()).rejects.toThrowError(/tunnel-start-failed/u);
	});

	it('recreates vm runtime on policy reload', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-policy-reload-'));
		fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

		const identity = deriveWorkspaceIdentity(workDir);
		socketsToCleanup.push(identity.daemonSocketPath);

		let createVmRuntimeCalls = 0;
		const fakeConfig: ResolvedRuntimeConfig = {
			vmConfig: {
				idleTimeoutMinutes: 10,
				extraAptPackages: [],
				playwrightExtraHosts: [],
				tunnelEnabled: false,
			},
			tunnelConfig: {
				services: {
					postgres: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 5432 },
						guestClientPort: 15432,
						guestUplinkPort: 16000,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			allowedHosts: ['api.openai.com'],
			toggleEntries: [],
			generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => fakeConfig,
			createVmRuntime: async () => {
				createVmRuntimeCalls += 1;
				return {
					getId: () => `fake-vm-${createVmRuntimeCalls}`,
					exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
					close: async () => {},
					openGuestLoopbackStream: async () => {
						throw new Error('not-implemented');
					},
				};
			},
			createAuthSyncManager: () => {
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
			},
			createTunnelManager: class {
				public async start(): Promise<void> {}
				public async stop(): Promise<void> {}
				public async restart(): Promise<void> {}
				public getStatus(): [] {
					return [];
				}
			} as unknown as DaemonDependencies['createTunnelManager'],
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
		const fakeConfig: ResolvedRuntimeConfig = {
			vmConfig: {
				idleTimeoutMinutes: 10,
				extraAptPackages: [],
				playwrightExtraHosts: [],
				tunnelEnabled: false,
			},
			tunnelConfig: {
				services: {
					postgres: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 5432 },
						guestClientPort: 15432,
						guestUplinkPort: 16000,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			allowedHosts: ['api.openai.com'],
			toggleEntries: [],
			generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => fakeConfig,
			createVmRuntime: async () => {
				createVmRuntimeCalls += 1;
				return {
					getId: () => `fake-vm-${createVmRuntimeCalls}`,
					exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
					close: async () => {},
					openGuestLoopbackStream: async () => {
						throw new Error('not-implemented');
					},
				};
			},
			createAuthSyncManager: () => {
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
			},
			createTunnelManager: class {
				public async start(): Promise<void> {}
				public async stop(): Promise<void> {}
				public async restart(): Promise<void> {}
				public getStatus(): [] {
					return [];
				}
			} as unknown as DaemonDependencies['createTunnelManager'],
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

		const fakeConfig: ResolvedRuntimeConfig = {
			vmConfig: {
				idleTimeoutMinutes: 10,
				extraAptPackages: [],
				playwrightExtraHosts: [],
				tunnelEnabled: false,
			},
			tunnelConfig: {
				services: {
					postgres: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 5432 },
						guestClientPort: 15432,
						guestUplinkPort: 16000,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			allowedHosts: ['api.openai.com'],
			toggleEntries: [],
			generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
		};

		const fakeDependencies: DaemonDependencies = {
			createRuntimeConfig: () => fakeConfig,
			createVmRuntime: async () => ({
				getId: () => 'fake-vm',
				exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
				close: async () => {},
				openGuestLoopbackStream: async () => {
					throw new Error('not-implemented');
				},
			}),
			createAuthSyncManager: () => {
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
			},
			createTunnelManager: class {
				public async start(): Promise<void> {}
				public async stop(): Promise<void> {}
				public async restart(): Promise<void> {}
				public getStatus(): [] {
					return [];
				}
			} as unknown as DaemonDependencies['createTunnelManager'],
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
});

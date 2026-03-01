import { once } from 'node:events';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { createVmRuntime, type VmRuntime } from '#src/core/infrastructure/vm-adapter.js';
import type {
	DaemonStatus,
	ResolvedRuntimeConfig,
	WorkspaceIdentity,
} from '#src/core/models/config.js';
import {
	parseDaemonRequestValue,
	type DaemonRequest,
	type DaemonResponse,
} from '#src/core/models/ipc.js';
import type { Logger } from '#src/core/platform/logger.js';
import { AuthSyncManager, type AuthSyncState } from '#src/features/auth-proxy/auth-sync.js';
import { resolveRuntimeConfig } from '#src/features/runtime-control/config-resolver.js';
import {
	applyPolicyMutation,
	compileAndPersistPolicy,
	readPolicyState,
	writePolicyState,
} from '#src/features/runtime-control/policy-manager.js';
import {
	buildTcpHostsRecord,
	buildTcpServiceEnvVars,
	validateTcpServiceTargets,
} from '#src/features/runtime-control/tcp-service-config.js';

export interface DaemonDependencies {
	createRuntimeConfig: (workDir: string) => ResolvedRuntimeConfig;
	createVmRuntime: typeof createVmRuntime;
	createAuthSyncManager: (logger: Logger) => AuthSyncManager;
}

const DEFAULT_DEPENDENCIES: DaemonDependencies = {
	createRuntimeConfig: resolveRuntimeConfig,
	createVmRuntime,
	createAuthSyncManager: (logger) => new AuthSyncManager(logger),
};

interface ClientContext {
	socket: net.Socket;
}

export class AgentVmDaemon {
	private server: net.Server | null = null;
	private readonly clients = new Set<ClientContext>();
	private idleTimer: NodeJS.Timeout | null = null;
	private idleDeadlineEpochMs: number | null = null;
	private readonly startedAtEpochMs = Date.now();
	private vmRuntime: VmRuntime | null = null;
	private runtimeConfig: ResolvedRuntimeConfig | null = null;
	private authSyncState: AuthSyncState | null = null;
	private runtimeRecreatePromise: Promise<void> | null = null;
	private stopping = false;

	public constructor(
		private readonly identity: WorkspaceIdentity,
		private readonly logger: Logger,
		private readonly dependencies: DaemonDependencies = DEFAULT_DEPENDENCIES,
	) {}

	public async start(): Promise<void> {
		this.stopping = false;
		this.runtimeConfig = this.dependencies.createRuntimeConfig(this.identity.workDir);

		const authSync = this.dependencies.createAuthSyncManager(this.logger);
		authSync.exportClaudeOauthFromKeychain();
		this.authSyncState = authSync.prepareSessionAuthMirror(this.identity.sessionName);
		const tcpRuntimeInputs = this.buildTcpRuntimeInputs(this.runtimeConfig);

		this.vmRuntime = await this.dependencies.createVmRuntime({
			workDir: this.identity.workDir,
			allowedHosts: this.runtimeConfig.allowedHosts,
			tcpHosts: tcpRuntimeInputs.tcpHosts,
			tcpServiceEnvVars: tcpRuntimeInputs.tcpServiceEnvVars,
			sessionLabel: this.identity.sessionName,
			logger: this.logger,
			sessionAuthRoot: this.authSyncState.sessionAuthRoot,
		});

		await this.listen();

		this.logger.log('info', 'daemon', 'daemon started', {
			socketPath: this.identity.daemonSocketPath,
		});
	}

	public async stop(): Promise<void> {
		if (this.stopping) {
			return;
		}
		this.stopping = true;
		this.clearIdleTimer();

		for (const client of this.clients) {
			client.socket.end();
		}
		this.clients.clear();

		if (this.server) {
			await new Promise<void>((resolve) => {
				this.server?.close(() => resolve());
			});
			this.server = null;
		}

		await this.stopRuntime();

		if (this.authSyncState) {
			const authSync = this.dependencies.createAuthSyncManager(this.logger);
			authSync.copyBackSessionAuthMirror(this.authSyncState);
			this.authSyncState = null;
		}

		fs.rmSync(this.identity.daemonSocketPath, { force: true });
		this.clearIdleTimer();

		this.logger.log('info', 'daemon', 'daemon stopped');
	}

	private async stopRuntime(): Promise<void> {
		if (this.vmRuntime) {
			await this.vmRuntime.close();
			this.vmRuntime = null;
		}
	}

	private buildTcpRuntimeInputs(runtimeConfig: ResolvedRuntimeConfig): {
		tcpHosts: Record<string, string>;
		tcpServiceEnvVars: Record<string, string>;
	} {
		validateTcpServiceTargets(runtimeConfig.tcpServiceMap);
		return {
			tcpHosts: buildTcpHostsRecord(runtimeConfig.tcpServiceMap),
			tcpServiceEnvVars: buildTcpServiceEnvVars(runtimeConfig.tcpServiceMap),
		};
	}

	private async recreateRuntime(reason: string): Promise<void> {
		if (this.runtimeRecreatePromise) {
			await this.runtimeRecreatePromise;
			return;
		}

		this.runtimeRecreatePromise = (async () => {
			if (!this.runtimeConfig || !this.authSyncState) {
				throw new Error('runtime-config-unavailable');
			}

			this.logger.log('info', 'daemon', 'recreating vm runtime', { reason });
			await this.stopRuntime();
			const tcpRuntimeInputs = this.buildTcpRuntimeInputs(this.runtimeConfig);

			this.vmRuntime = await this.dependencies.createVmRuntime({
				workDir: this.identity.workDir,
				allowedHosts: this.runtimeConfig.allowedHosts,
				tcpHosts: tcpRuntimeInputs.tcpHosts,
				tcpServiceEnvVars: tcpRuntimeInputs.tcpServiceEnvVars,
				sessionLabel: this.identity.sessionName,
				logger: this.logger,
				sessionAuthRoot: this.authSyncState.sessionAuthRoot,
			});
		})();

		try {
			await this.runtimeRecreatePromise;
		} finally {
			this.runtimeRecreatePromise = null;
		}
	}

	private async listen(): Promise<void> {
		fs.mkdirSync(path.dirname(this.identity.daemonSocketPath), { recursive: true });
		fs.rmSync(this.identity.daemonSocketPath, { force: true });

		this.server = net.createServer((socket) => {
			this.onClientConnected(socket);
		});

		await new Promise<void>((resolve, reject) => {
			this.server?.once('error', reject);
			this.server?.listen(this.identity.daemonSocketPath, resolve);
		});
	}

	private onClientConnected(socket: net.Socket): void {
		const clientContext: ClientContext = { socket };
		this.clients.add(clientContext);
		this.clearIdleTimer();

		socket.setEncoding('utf8');

		let buffer = '';
		socket.on('data', (chunk: string) => {
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

				let parsedLine: unknown;
				try {
					parsedLine = JSON.parse(line);
				} catch (error: unknown) {
					void this.sendResponse(socket, { kind: 'error', message: 'invalid-json' }).catch(() => {
						this.logger.log('warn', 'daemon', 'failed to write invalid-json response', {
							error: String(error),
						});
					});
					continue;
				}

				let request: DaemonRequest;
				try {
					request = parseDaemonRequestValue(parsedLine);
				} catch (error: unknown) {
					void this.sendResponse(socket, {
						kind: 'error',
						message: `invalid-request:${String(error)}`,
					}).catch((writeError: unknown) => {
						this.logger.log('warn', 'daemon', 'failed to write invalid-request response', {
							error: String(writeError),
						});
					});
					continue;
				}

				void this.handleRequest(socket, request).catch((error: unknown) => {
					this.logger.log('warn', 'daemon', 'request handling failed', {
						error: String(error),
					});
					void this.sendResponse(socket, { kind: 'error', message: 'request-failed' }).catch(() => {
						this.logger.log('warn', 'daemon', 'failed to write request-failed response', {
							error: String(error),
						});
					});
				});
			}
		});

		const onClose = (): void => {
			this.clients.delete(clientContext);
			this.maybeStartIdleTimer();
		};

		socket.on('close', onClose);
		socket.on('error', (error: unknown) => {
			this.logger.log('warn', 'daemon', 'client socket error', {
				error: String(error),
			});
			onClose();
		});
	}

	private async sendResponse(socket: net.Socket, response: DaemonResponse): Promise<void> {
		if (socket.destroyed || !socket.writable) {
			throw new Error('socket-not-writable');
		}
		const payload = `${JSON.stringify(response)}\n`;
		const accepted = socket.write(payload, 'utf8');
		if (!accepted) {
			await once(socket, 'drain');
		}
	}

	private async handleRequest(socket: net.Socket, request: DaemonRequest): Promise<void> {
		if (request.kind === 'status') {
			await this.sendResponse(socket, {
				kind: 'status.response',
				status: this.getStatus(),
			});
			return;
		}

		if (!this.vmRuntime || !this.runtimeConfig) {
			await this.sendResponse(socket, { kind: 'error', message: 'vm-not-ready' });
			return;
		}

		switch (request.kind) {
			case 'attach': {
				const sessionId = `${Date.now()}`;
				await this.sendResponse(socket, { kind: 'attached', sessionId });

				const command = request.command ?? `/bin/sh -lc 'cd "$WORKSPACE" && pwd'`;
				const result = await this.vmRuntime.exec(command);
				if (result.stdout.length > 0) {
					await this.sendResponse(socket, { kind: 'stream.stdout', data: result.stdout });
				}
				if (result.stderr.length > 0) {
					await this.sendResponse(socket, { kind: 'stream.stderr', data: result.stderr });
				}
				await this.sendResponse(socket, { kind: 'stream.exit', code: result.exitCode });
				return;
			}
			case 'policy.reload': {
				const compiled = compileAndPersistPolicy(this.identity.workDir);
				this.runtimeConfig = {
					...this.runtimeConfig,
					allowedHosts: compiled,
				};
				await this.recreateRuntime('policy.reload');
				await this.sendResponse(socket, {
					kind: 'ack',
					message: `policy reloaded (${compiled.length} entries); vm runtime restarted`,
				});
				return;
			}
			case 'policy.allow':
			case 'policy.block': {
				const existing = readPolicyState(this.identity.workDir).entries;
				const action = request.kind === 'policy.allow' ? 'allow' : 'block';
				const nextEntries = applyPolicyMutation(existing, action, request.target);
				writePolicyState(this.identity.workDir, { entries: nextEntries });
				const compiled = compileAndPersistPolicy(this.identity.workDir);
				this.runtimeConfig = {
					...this.runtimeConfig,
					allowedHosts: compiled,
				};
				await this.recreateRuntime('policy.update');
				await this.sendResponse(socket, {
					kind: 'ack',
					message: `policy updated (${nextEntries.length} toggle entries); vm runtime restarted`,
				});
				return;
			}
			case 'policy.clear': {
				const nextEntries = applyPolicyMutation(
					readPolicyState(this.identity.workDir).entries,
					'clear',
				);
				writePolicyState(this.identity.workDir, { entries: nextEntries });
				const compiled = compileAndPersistPolicy(this.identity.workDir);
				this.runtimeConfig = {
					...this.runtimeConfig,
					allowedHosts: compiled,
				};
				await this.recreateRuntime('policy.update');
				await this.sendResponse(socket, {
					kind: 'ack',
					message: `policy updated (${nextEntries.length} toggle entries); vm runtime restarted`,
				});
				return;
			}
			case 'shutdown': {
				await this.sendResponse(socket, { kind: 'ack', message: 'daemon shutting down' });
				await this.stop();
				return;
			}
		}
	}

	private maybeStartIdleTimer(): void {
		if (this.stopping) {
			return;
		}
		if (!this.runtimeConfig) {
			return;
		}
		if (this.clients.size > 0) {
			return;
		}

		const timeoutMs = this.runtimeConfig.vmConfig.idleTimeoutMinutes * 60 * 1000;
		this.idleDeadlineEpochMs = Date.now() + timeoutMs;

		this.idleTimer = setTimeout(() => {
			void this.stop();
		}, timeoutMs);

		this.logger.log('info', 'daemon', 'idle timer started', {
			timeoutMinutes: this.runtimeConfig.vmConfig.idleTimeoutMinutes,
		});
	}

	private clearIdleTimer(): void {
		if (this.idleTimer) {
			clearTimeout(this.idleTimer);
			this.idleTimer = null;
		}
		this.idleDeadlineEpochMs = null;
	}

	public getStatus(): DaemonStatus {
		const tcpServices = this.runtimeConfig
			? Object.entries(this.runtimeConfig.tcpServiceMap.services).map(([name, entry]) => ({
					name,
					guestHostname: entry.guestHostname,
					guestPort: entry.guestPort,
					upstreamTarget: entry.upstreamTarget,
					enabled: entry.enabled,
				}))
			: [];

		return {
			sessionName: this.identity.sessionName,
			clients: this.clients.size,
			idleTimeoutMinutes: this.runtimeConfig?.vmConfig.idleTimeoutMinutes ?? 10,
			idleDeadlineEpochMs: this.idleDeadlineEpochMs,
			startedAtEpochMs: this.startedAtEpochMs,
			tcpServices,
			vm: {
				id: this.vmRuntime?.getId() ?? 'none',
				running: this.vmRuntime !== null,
			},
		};
	}
}

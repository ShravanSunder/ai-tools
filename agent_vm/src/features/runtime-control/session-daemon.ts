import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { TunnelManager } from '#src/core/infrastructure/tunnel-manager.js';
import { createVmRuntime, type VmRuntime } from '#src/core/infrastructure/vm-adapter.js';
import type {
	DaemonStatus,
	ResolvedRuntimeConfig,
	WorkspaceIdentity,
} from '#src/core/models/config.js';
import type { DaemonRequest, DaemonResponse } from '#src/core/models/ipc.js';
import type { Logger } from '#src/core/platform/logger.js';
import { AuthSyncManager, type AuthSyncState } from '#src/features/auth-proxy/auth-sync.js';
import { resolveRuntimeConfig } from '#src/features/runtime-control/config-resolver.js';
import {
	applyPolicyMutation,
	compileAndPersistPolicy,
	readPolicyState,
	writePolicyState,
} from '#src/features/runtime-control/policy-manager.js';

export interface DaemonDependencies {
	createRuntimeConfig: (workDir: string) => ResolvedRuntimeConfig;
	createVmRuntime: typeof createVmRuntime;
	createAuthSyncManager: (logger: Logger) => AuthSyncManager;
	createTunnelManager: typeof TunnelManager;
}

const DEFAULT_DEPENDENCIES: DaemonDependencies = {
	createRuntimeConfig: resolveRuntimeConfig,
	createVmRuntime,
	createAuthSyncManager: (logger) => new AuthSyncManager(logger),
	createTunnelManager: TunnelManager,
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
	private tunnelManager: TunnelManager | null = null;
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

		this.vmRuntime = await this.dependencies.createVmRuntime({
			workDir: this.identity.workDir,
			allowedHosts: this.runtimeConfig.allowedHosts,
			sessionLabel: this.identity.sessionName,
			logger: this.logger,
			sessionAuthRoot: this.authSyncState.sessionAuthRoot,
		});

		await this.listen();
		this.ensureTunnelManagerRunning();

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

	private ensureTunnelManagerRunning(): void {
		if (!this.runtimeConfig?.vmConfig.tunnelEnabled || !this.vmRuntime) {
			return;
		}

		this.tunnelManager = new this.dependencies.createTunnelManager(
			this.vmRuntime,
			this.runtimeConfig.tunnelConfig,
			() => {
				this.logger.log('debug', 'daemon', 'tunnel state changed');
			},
		);

		void this.tunnelManager.start().catch((error: unknown) => {
			this.logger.log('warn', 'daemon', 'tunnel manager start failed', {
				error: String(error),
			});
		});
	}

	private async stopRuntime(): Promise<void> {
		if (this.tunnelManager) {
			await this.tunnelManager.stop();
			this.tunnelManager = null;
		}

		if (this.vmRuntime) {
			await this.vmRuntime.close();
			this.vmRuntime = null;
		}
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

			this.vmRuntime = await this.dependencies.createVmRuntime({
				workDir: this.identity.workDir,
				allowedHosts: this.runtimeConfig.allowedHosts,
				sessionLabel: this.identity.sessionName,
				logger: this.logger,
				sessionAuthRoot: this.authSyncState.sessionAuthRoot,
			});
			this.ensureTunnelManagerRunning();
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

				let request: DaemonRequest;
				try {
					request = JSON.parse(line) as DaemonRequest;
				} catch {
					this.sendResponse(socket, { type: 'error', message: 'invalid-json' });
					continue;
				}

				void this.handleRequest(socket, request).catch((error: unknown) => {
					this.logger.log('warn', 'daemon', 'request handling failed', {
						error: String(error),
					});
					this.sendResponse(socket, { type: 'error', message: 'request-failed' });
				});
			}
		});

		const onClose = (): void => {
			this.clients.delete(clientContext);
			this.maybeStartIdleTimer();
		};

		socket.on('close', onClose);
		socket.on('error', onClose);
	}

	private sendResponse(socket: net.Socket, response: DaemonResponse): void {
		socket.write(`${JSON.stringify(response)}\n`);
	}

	private async handleRequest(socket: net.Socket, request: DaemonRequest): Promise<void> {
		if (request.type === 'status') {
			this.sendResponse(socket, {
				type: 'status.response',
				status: this.getStatus(),
			});
			return;
		}

		if (!this.vmRuntime || !this.runtimeConfig) {
			this.sendResponse(socket, { type: 'error', message: 'vm-not-ready' });
			return;
		}

		switch (request.type) {
			case 'attach': {
				const sessionId = `${Date.now()}`;
				this.sendResponse(socket, { type: 'attached', sessionId });

				const command = request.command ?? '/bin/sh -lc "pwd"';
				const result = await this.vmRuntime.exec(command);
				if (result.stdout.length > 0) {
					this.sendResponse(socket, { type: 'stream.stdout', data: result.stdout });
				}
				if (result.stderr.length > 0) {
					this.sendResponse(socket, { type: 'stream.stderr', data: result.stderr });
				}
				this.sendResponse(socket, { type: 'stream.exit', code: result.exitCode });
				break;
			}
			case 'policy.reload': {
				const compiled = compileAndPersistPolicy(this.identity.workDir);
				this.runtimeConfig.allowedHosts = compiled;
				await this.recreateRuntime('policy.reload');
				this.sendResponse(socket, {
					type: 'ack',
					message: `policy reloaded (${compiled.length} entries); vm runtime restarted`,
				});
				break;
			}
			case 'policy.update': {
				const existing = readPolicyState(this.identity.workDir).entries;
				const nextEntries = applyPolicyMutation(existing, request.action, request.target);
				writePolicyState(this.identity.workDir, { entries: nextEntries });
				const compiled = compileAndPersistPolicy(this.identity.workDir);
				this.runtimeConfig.allowedHosts = compiled;
				await this.recreateRuntime('policy.update');
				this.sendResponse(socket, {
					type: 'ack',
					message: `policy updated (${nextEntries.length} toggle entries); vm runtime restarted`,
				});
				break;
			}
			case 'tunnel.restart': {
				if (!this.tunnelManager) {
					this.sendResponse(socket, { type: 'error', message: 'tunnels-disabled' });
					break;
				}
				await this.tunnelManager.restart(request.service);
				this.sendResponse(socket, {
					type: 'ack',
					message: request.service
						? `restarted tunnel ${request.service}`
						: 'restarted all tunnels',
				});
				break;
			}
			case 'shutdown': {
				this.sendResponse(socket, { type: 'ack', message: 'daemon shutting down' });
				await this.stop();
				break;
			}
			default: {
				this.sendResponse(socket, { type: 'error', message: 'unsupported-request' });
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
		const tunnelStatus = this.tunnelManager?.getStatus() ?? [];

		return {
			sessionName: this.identity.sessionName,
			clients: this.clients.size,
			idleTimeoutMinutes: this.runtimeConfig?.vmConfig.idleTimeoutMinutes ?? 10,
			idleDeadlineEpochMs: this.idleDeadlineEpochMs,
			startedAtEpochMs: this.startedAtEpochMs,
			tunnels: tunnelStatus,
			vm: {
				id: this.vmRuntime?.getId() ?? 'none',
				running: this.vmRuntime !== null,
			},
		};
	}
}

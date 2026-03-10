import { once } from 'node:events';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { resolveVolumeCacheDir } from '#src/build/build-assets.js';
import { createVmRuntime, type VmRuntime } from '#src/core/infrastructure/vm-adapter.js';
import {
	resolveVolumeDirs,
	type ResolvedVolume,
	type VolumeConfigEntry,
} from '#src/core/infrastructure/volume-manager.js';
import type { ResolvedRuntimeConfig, WorkspaceIdentity } from '#src/core/models/config.js';
import {
	type DaemonStatus,
	parseDaemonRequestValue,
	type DaemonRequest,
	type DaemonResponse,
} from '#src/core/models/ipc.js';
import {
	buildRuntimeTcpHostsRecord,
	buildRuntimeTcpServiceEnvVars,
	validateRuntimeTcpTargets,
} from '#src/core/models/vm-runtime-config.js';
import type { Logger } from '#src/core/platform/logger.js';
import { shellEscape } from '#src/core/platform/shell-escape.js';
import { AuthSyncManager } from '#src/features/auth-proxy/auth-sync.js';
import { resolveRuntimeConfig } from '#src/features/runtime-control/config-resolver.js';
import {
	discoverNodeModulesPaths,
	volumeNameForNodeModulesPath,
} from '#src/features/runtime-control/monorepo-discovery.js';
import {
	compileAndPersistPolicy,
	mutateAndCompilePolicy,
} from '#src/features/runtime-control/policy-manager.js';
import { wrapCommandForInteractiveShell } from '#src/features/runtime-control/shell-command.js';
import { ensureAtuinImportedOnFirstRun } from '#src/features/runtime-control/shell-setup.js';

export interface DaemonRuntimeOptions {
	readonly imagePath: string;
	readonly scratchpad: boolean;
}

export interface DaemonDependencies {
	readonly createRuntimeConfig: (workDir: string) => ResolvedRuntimeConfig;
	readonly createVmRuntime: typeof createVmRuntime;
	readonly createAuthSyncManager: (logger: Logger) => AuthSyncManager;
	readonly resolveVolumeDirs: typeof resolveVolumeDirs;
	readonly resolveVolumeCacheDir: typeof resolveVolumeCacheDir;
	readonly discoverNodeModulesPaths: typeof discoverNodeModulesPaths;
	readonly volumeNameForNodeModulesPath: typeof volumeNameForNodeModulesPath;
	readonly ensureAtuinImportedOnFirstRun: typeof ensureAtuinImportedOnFirstRun;
}

const DEFAULT_DEPENDENCIES: DaemonDependencies = {
	createRuntimeConfig: resolveRuntimeConfig,
	createVmRuntime,
	createAuthSyncManager: (logger) => new AuthSyncManager(logger),
	resolveVolumeDirs,
	resolveVolumeCacheDir,
	discoverNodeModulesPaths,
	volumeNameForNodeModulesPath,
	ensureAtuinImportedOnFirstRun,
};

interface ClientContext {
	readonly socket: net.Socket;
}

export class AgentVmDaemon {
	private server: net.Server | null = null;
	private readonly clients = new Set<ClientContext>();
	private idleTimer: NodeJS.Timeout | null = null;
	private idleDeadlineEpochMs: number | null = null;
	private readonly startedAtEpochMs = Date.now();
	private vmRuntime: VmRuntime | null = null;
	private runtimeConfig: ResolvedRuntimeConfig | null = null;
	private authReadonlyMounts: Readonly<Record<string, string>> = {};
	private runtimeRecreatePromise: Promise<void> | null = null;
	private stopping = false;
	private resolvedVolumes: Record<string, ResolvedVolume> = {};

	public constructor(
		private readonly identity: WorkspaceIdentity,
		private readonly logger: Logger,
		private readonly runtimeOptions: DaemonRuntimeOptions,
		private readonly dependencies: DaemonDependencies = DEFAULT_DEPENDENCIES,
	) {}

	public async start(): Promise<void> {
		this.stopping = false;
		this.runtimeConfig = this.dependencies.createRuntimeConfig(this.identity.workDir);

		const authSync = this.dependencies.createAuthSyncManager(this.logger);
		authSync.exportClaudeOauthFromKeychain();
		authSync.cleanupLegacyAuthCache();
		this.authReadonlyMounts = authSync.getReadonlyAuthMounts();

		this.resolvedVolumes = this.resolveConfiguredVolumes(this.runtimeConfig);
		this.maybeInitializeShellHistoryVolume(this.runtimeConfig, this.resolvedVolumes);

		await this.createVmRuntimeFromCurrentConfig('startup');
		await this.runInitPipeline();
		await this.listen();

		this.logger.log('info', 'daemon', 'daemon started', {
			socketPath: this.identity.daemonSocketPath,
			imagePath: this.runtimeOptions.imagePath,
			scratchpad: this.runtimeOptions.scratchpad,
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
		this.authReadonlyMounts = {};

		fs.rmSync(this.identity.daemonSocketPath, { force: true });
		this.clearIdleTimer();

		this.logger.log('info', 'daemon', 'daemon stopped');
	}

	private resolveConfiguredVolumes(config: ResolvedRuntimeConfig): Record<string, ResolvedVolume> {
		const volumeDefinitions: Record<string, VolumeConfigEntry> = {
			...config.runtimeConfig.volumes,
		};
		if (config.runtimeConfig.monorepoDiscovery) {
			for (const nodeModulesPath of this.dependencies.discoverNodeModulesPaths(
				this.identity.workDir,
			)) {
				if (Object.values(volumeDefinitions).some((entry) => entry.guestPath === nodeModulesPath)) {
					continue;
				}
				const volumeName = this.dependencies.volumeNameForNodeModulesPath(nodeModulesPath);
				volumeDefinitions[volumeName] = { guestPath: nodeModulesPath };
			}
		}

		return this.dependencies.resolveVolumeDirs(
			this.dependencies.resolveVolumeCacheDir(),
			this.identity.dirHash,
			volumeDefinitions,
		);
	}

	private maybeInitializeShellHistoryVolume(
		config: ResolvedRuntimeConfig,
		volumes: Record<string, ResolvedVolume>,
	): void {
		if (!config.runtimeConfig.shell.atuin.importOnFirstRun) {
			return;
		}
		const shellHistoryVolume = volumes.shellHistory;
		if (!shellHistoryVolume) {
			return;
		}
		this.dependencies.ensureAtuinImportedOnFirstRun(shellHistoryVolume.hostDir);
	}

	private async createVmRuntimeFromCurrentConfig(reason: string): Promise<void> {
		if (!this.runtimeConfig) {
			throw new Error('runtime-config-unavailable');
		}

		const tcpRuntimeInputs = this.buildTcpRuntimeInputs(this.runtimeConfig);
		this.logger.log('info', 'daemon', 'creating vm runtime', {
			reason,
			imagePath: this.runtimeOptions.imagePath,
			scratchpad: this.runtimeOptions.scratchpad,
		});
		this.vmRuntime = await this.dependencies.createVmRuntime({
			workDir: this.identity.workDir,
			imagePath: this.runtimeOptions.imagePath,
			runtimeConfig: this.runtimeConfig.runtimeConfig,
			buildConfig: this.runtimeConfig.buildConfig,
			allowedHosts: this.runtimeConfig.allowedHosts,
			tcpHosts: tcpRuntimeInputs.tcpHosts,
			tcpServiceEnvVars: tcpRuntimeInputs.tcpServiceEnvVars,
			resolvedVolumes: this.resolvedVolumes,
			sessionLabel: this.identity.sessionName,
			logger: this.logger,
			authReadonlyMounts: this.authReadonlyMounts,
			scratchpad: this.runtimeOptions.scratchpad,
		});
	}

	private async runInitPipeline(): Promise<void> {
		if (!this.vmRuntime || !this.runtimeConfig) {
			return;
		}

		const ensureHomeDirectoryResult = await this.vmRuntime.exec(
			"/bin/sh -lc 'mkdir -p /home/agent'",
		);
		if (ensureHomeDirectoryResult.exitCode !== 0) {
			throw new Error(`failed to ensure /home/agent exists: ${ensureHomeDirectoryResult.stderr}`);
		}

		const backgroundScriptPath = this.runtimeConfig.runtimeConfig.initScripts.background;
		if (backgroundScriptPath) {
			void this.vmRuntime
				.exec(`/bin/sh -lc ${shellEscape(backgroundScriptPath)}`)
				.then((backgroundResult) => {
					if (backgroundResult.exitCode !== 0) {
						this.logger.log('warn', 'daemon', 'background init script failed', {
							scriptPath: backgroundScriptPath,
							stderr: backgroundResult.stderr,
						});
					}
				})
				.catch((error: unknown) => {
					this.logger.log('warn', 'daemon', 'background init script crashed', {
						scriptPath: backgroundScriptPath,
						error: String(error),
					});
				});
		}

		const foregroundScriptPath = this.runtimeConfig.runtimeConfig.initScripts.foreground;
		if (foregroundScriptPath) {
			const foregroundResult = await this.vmRuntime.exec(
				`/bin/sh -lc ${shellEscape(foregroundScriptPath)}`,
			);
			if (foregroundResult.exitCode !== 0) {
				throw new Error(
					`foreground init script failed (${foregroundScriptPath}): ${foregroundResult.stderr}`,
				);
			}
		}
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
		validateRuntimeTcpTargets(runtimeConfig.runtimeConfig.tcp);
		return {
			tcpHosts: buildRuntimeTcpHostsRecord(runtimeConfig.runtimeConfig.tcp),
			tcpServiceEnvVars: buildRuntimeTcpServiceEnvVars(runtimeConfig.runtimeConfig.tcp),
		};
	}

	private async recreateRuntime(reason: string): Promise<void> {
		if (this.runtimeRecreatePromise) {
			await this.runtimeRecreatePromise;
			return;
		}

		this.runtimeRecreatePromise = (async () => {
			this.logger.log('info', 'daemon', 'recreating vm runtime', { reason });
			await this.stopRuntime();
			await this.createVmRuntimeFromCurrentConfig(reason);
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
		let readBuffer = '';
		socket.on('data', (chunk: string) => {
			readBuffer += chunk;

			while (true) {
				const newlineIndex = readBuffer.indexOf('\n');
				if (newlineIndex < 0) {
					break;
				}
				const line = readBuffer.slice(0, newlineIndex).trim();
				readBuffer = readBuffer.slice(newlineIndex + 1);
				if (line.length === 0) {
					continue;
				}

				let parsedRequestPayload: unknown;
				try {
					parsedRequestPayload = JSON.parse(line) as unknown;
				} catch (error: unknown) {
					void this.sendResponse(socket, { kind: 'error', message: 'invalid-json' }).catch(
						(writeError: unknown) => {
							this.logger.log('warn', 'daemon', 'failed to write invalid-json response', {
								error: String(writeError),
								parseError: String(error),
							});
						},
					);
					continue;
				}

				let request: DaemonRequest;
				try {
					request = parseDaemonRequestValue(parsedRequestPayload);
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
					void this.sendResponse(socket, { kind: 'error', message: 'request-failed' }).catch(
						(writeError: unknown) => {
							this.logger.log('warn', 'daemon', 'failed to write request-failed response', {
								error: String(writeError),
							});
						},
					);
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
			await Promise.race([
				once(socket, 'drain'),
				once(socket, 'close').then(() => {
					throw new Error('socket-closed-before-drain');
				}),
				once(socket, 'error').then(([error]) => {
					throw new Error(`socket-error-before-drain:${String(error)}`);
				}),
			]);
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

				const command = request.command ?? 'cd "$WORKSPACE" && pwd';
				const wrappedCommand = wrapCommandForInteractiveShell(command);
				const result = await this.vmRuntime.exec(wrappedCommand);
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
				const action = request.kind === 'policy.allow' ? 'allow' : 'block';
				const { entries: nextEntries, compiled } = mutateAndCompilePolicy(
					this.identity.workDir,
					action,
					request.target,
				);
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
				const { entries: nextEntries, compiled } = mutateAndCompilePolicy(
					this.identity.workDir,
					'clear',
				);
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
		if (this.stopping || !this.runtimeConfig || this.clients.size > 0) {
			return;
		}

		const timeoutMilliseconds = this.runtimeConfig.runtimeConfig.idleTimeoutMinutes * 60 * 1000;
		this.idleDeadlineEpochMs = Date.now() + timeoutMilliseconds;
		this.idleTimer = setTimeout(() => {
			this.stop().catch((error: unknown) => {
				this.logger.log('error', 'daemon', 'idle shutdown failed', {
					error: String(error),
				});
				process.exit(1);
			});
		}, timeoutMilliseconds);

		this.logger.log('info', 'daemon', 'idle timer started', {
			timeoutMinutes: this.runtimeConfig.runtimeConfig.idleTimeoutMinutes,
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
			? Object.entries(this.runtimeConfig.runtimeConfig.tcp.services).map(([name, entry]) => ({
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
			idleTimeoutMinutes: this.runtimeConfig?.runtimeConfig.idleTimeoutMinutes ?? 10,
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

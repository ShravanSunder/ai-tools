import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { execa } from 'execa';

import {
	buildGuestAssets,
	resolveVolumeCacheDir,
	resolveWorkspaceImageDir,
} from '#src/build/build-assets.js';
import { DaemonClient, waitForSocket } from '#src/core/infrastructure/daemon-client.js';
import { wipeVolumeDirs } from '#src/core/infrastructure/volume-manager.js';
import type { RunAgentVmOptions } from '#src/core/models/config.js';
import type { DaemonResponse } from '#src/core/models/ipc.js';
import { withFileLockAsync } from '#src/core/platform/file-lock.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import { resolveAgentPresetCommand } from '#src/features/runtime-control/agent-launcher.js';
import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';

interface EnsureDaemonOptions {
	readonly socketPath: string;
	readonly daemonLogPath: string;
	readonly workDir: string;
	readonly imagePath: string;
	readonly scratchpad: boolean;
}

const DAEMON_SOCKET_START_TIMEOUT_MS = 120_000;
const DAEMON_START_LOCK_TIMEOUT_MS = DAEMON_SOCKET_START_TIMEOUT_MS + 5_000;

function assertNever(value: never): never {
	throw new Error(`Unhandled daemon response variant: ${JSON.stringify(value)}`);
}

function daemonScriptPath(): string {
	return path.join(getAgentVmRoot(), 'dist', 'bin', 'agent-vm-daemon.js');
}

async function probeSocketState(
	socketPath: string,
): Promise<'connected' | 'missing' | 'refused' | 'error'> {
	return await new Promise((resolve) => {
		const socket = net.createConnection({ path: socketPath });
		let settled = false;

		const finish = (state: 'connected' | 'missing' | 'refused' | 'error'): void => {
			if (settled) {
				return;
			}
			settled = true;
			socket.destroy();
			resolve(state);
		};

		socket.once('connect', () => finish('connected'));
		socket.once('error', (error: NodeJS.ErrnoException) => {
			if (error.code === 'ENOENT') {
				finish('missing');
				return;
			}
			if (error.code === 'ECONNREFUSED') {
				finish('refused');
				return;
			}
			finish('error');
		});

		setTimeout(() => finish('error'), 300);
	});
}

async function waitForSocketRemoved(socketPath: string, timeoutMs: number): Promise<void> {
	const startedAt = Date.now();
	while (true) {
		if (!fs.existsSync(socketPath)) {
			return;
		}
		if (Date.now() - startedAt >= timeoutMs) {
			throw new Error(`Timed out waiting for daemon shutdown: ${socketPath}`);
		}
		// oxlint-disable-next-line eslint/no-await-in-loop
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}

async function requestAck(socketPath: string, request: { kind: 'shutdown' }): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		let settled = false;
		const finishOk = (): void => {
			if (settled) {
				return;
			}
			settled = true;
			resolve();
		};
		const finishErr = (error: Error): void => {
			if (settled) {
				return;
			}
			settled = true;
			reject(error);
		};

		const client = new DaemonClient(socketPath, {
			onResponse: (response) => {
				switch (response.kind) {
					case 'ack': {
						finishOk();
						client.close();
						return;
					}
					case 'error': {
						client.close();
						finishErr(new Error(response.message));
						return;
					}
					case 'attached':
					case 'status.response':
					case 'stream.stdout':
					case 'stream.stderr':
					case 'stream.exit':
						return;
					default:
						assertNever(response);
				}
			},
			onError: (error) => finishErr(error),
			onClose: () => finishErr(new Error('daemon closed before acknowledging request')),
		});

		client.send(request);
	});
}

async function stopDaemonIfRequested(
	socketPath: string,
	workDir: string,
	options: Pick<RunAgentVmOptions, 'reload' | 'fullReset' | 'wipeVolumes' | 'scratchpad'>,
): Promise<void> {
	if (!options.reload && !options.fullReset && !options.wipeVolumes && !options.scratchpad) {
		return;
	}

	if (!fs.existsSync(socketPath)) {
		return;
	}

	const state = await probeSocketState(socketPath);
	if (state === 'connected') {
		await requestAck(socketPath, { kind: 'shutdown' });
		await waitForSocketRemoved(socketPath, 5_000);
		return;
	}

	if (state === 'refused' || state === 'missing') {
		fs.rmSync(socketPath, { force: true });
		return;
	}

	throw new Error(
		`Refusing to reuse uncertain daemon socket state at ${socketPath}; run 'agent-vm-ctl daemon stop --work-dir ${workDir}'`,
	);
}

function readDaemonLogTail(daemonLogPath: string, maxLines: number = 20): string {
	if (!fs.existsSync(daemonLogPath)) {
		return '';
	}

	const lines = fs.readFileSync(daemonLogPath, 'utf8').trim().split(/\r?\n/u);
	return lines.slice(Math.max(lines.length - maxLines, 0)).join('\n');
}

function daemonLaunchArgs(workDir: string, imagePath: string, scratchpad: boolean): string[] {
	const args = ['--work-dir', workDir, '--image-path', imagePath];
	if (scratchpad) {
		args.push('--scratchpad');
	}
	return args;
}

async function ensureDaemonRunning(options: EnsureDaemonOptions): Promise<void> {
	if (fs.existsSync(options.socketPath)) {
		try {
			await waitForSocket(options.socketPath, 750);
			return;
		} catch (error: unknown) {
			throw new Error(
				`Daemon socket exists but is not reachable: ${options.socketPath}. Run 'run-agent-vm --reload' to recover. ${String(error)}`,
				{ cause: error },
			);
		}
	}

	const daemonEntry = daemonScriptPath();
	if (!fs.existsSync(daemonEntry)) {
		throw new Error(
			`Daemon binary not found at ${daemonEntry}. Run 'pnpm --dir agent_vm build' first.`,
		);
	}

	const startupLockPath = `${options.socketPath}.startup.lock`;
	await withFileLockAsync(
		startupLockPath,
		async () => {
			if (fs.existsSync(options.socketPath)) {
				await waitForSocket(options.socketPath, DAEMON_SOCKET_START_TIMEOUT_MS);
				return;
			}

			const subprocess = execa(
				process.execPath,
				[daemonEntry, ...daemonLaunchArgs(options.workDir, options.imagePath, options.scratchpad)],
				{
					detached: true,
					stdio: 'ignore',
				},
			);
			subprocess.unref();

			try {
				await waitForSocket(options.socketPath, DAEMON_SOCKET_START_TIMEOUT_MS);
			} catch (error: unknown) {
				const daemonLogTail = readDaemonLogTail(options.daemonLogPath);
				const logTailSuffix =
					daemonLogTail.length > 0
						? `\nDaemon log tail (${options.daemonLogPath}):\n${daemonLogTail}`
						: `\nDaemon log path: ${options.daemonLogPath}`;
				throw new Error(
					`Timed out waiting for daemon socket '${options.socketPath}'.${logTailSuffix}`,
					{
						cause: error,
					},
				);
			}
		},
		{ timeoutMs: DAEMON_START_LOCK_TIMEOUT_MS, retryDelayMs: 100 },
	);
}

function resolveRequestedCommand(options: RunAgentVmOptions): string | null {
	switch (options.runMode.kind) {
		case 'command': {
			return options.runMode.command;
		}
		case 'preset': {
			return resolveAgentPresetCommand(options.runMode.preset);
		}
		case 'no-run': {
			return null;
		}
		case 'default': {
			return '/bin/sh -lc "pwd"';
		}
	}
}

async function requestAndCollect(
	socketPath: string,
	command: string | null,
): Promise<{ exitCode: number; responses: DaemonResponse[] }> {
	const responses: DaemonResponse[] = [];

	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (result: { exitCode: number; responses: DaemonResponse[] }): void => {
			if (settled) {
				return;
			}
			settled = true;
			resolve(result);
		};
		const fail = (error: Error): void => {
			if (settled) {
				return;
			}
			settled = true;
			reject(error);
		};

		const client = new DaemonClient(socketPath, {
			onResponse: (response) => {
				responses.push(response);

				switch (response.kind) {
					case 'stream.stdout': {
						process.stdout.write(response.data);
						return;
					}
					case 'stream.stderr': {
						process.stderr.write(response.data);
						return;
					}
					case 'stream.exit': {
						finish({ exitCode: response.code, responses });
						client.close();
						return;
					}
					case 'status.response': {
						if (command === null) {
							process.stdout.write(`${JSON.stringify(response.status, null, 2)}\n`);
							finish({ exitCode: 0, responses });
							client.close();
						}
						return;
					}
					case 'error': {
						fail(new Error(response.message));
						client.close();
						return;
					}
					case 'attached':
					case 'ack':
						return;
					default:
						assertNever(response);
				}
			},
			onError: (error) => fail(error),
			onClose: () => {
				if (!settled) {
					fail(new Error('daemon connection closed before response completion'));
				}
			},
		});

		if (command === null) {
			client.send({ kind: 'status' });
		} else {
			client.send({ kind: 'attach', command });
		}
	});
}

function cleanupStaleCacheDirs(cacheDirectoryPath: string, olderThanDays: number): number {
	if (!fs.existsSync(cacheDirectoryPath)) {
		return 0;
	}
	let removedCount = 0;
	const thresholdEpochMilliseconds = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
	for (const entry of fs.readdirSync(cacheDirectoryPath, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
			continue;
		}
		const targetPath = path.join(cacheDirectoryPath, entry.name);
		const stat = fs.statSync(targetPath);
		if (stat.mtimeMs >= thresholdEpochMilliseconds) {
			continue;
		}
		fs.rmSync(targetPath, { recursive: true, force: true });
		removedCount += 1;
	}
	return removedCount;
}

interface RunOrchestratorDependencies {
	readonly deriveWorkspaceIdentity: typeof deriveWorkspaceIdentity;
	readonly stopDaemonIfRequested: typeof stopDaemonIfRequested;
	readonly ensureDaemonRunning: typeof ensureDaemonRunning;
	readonly requestAndCollect: typeof requestAndCollect;
	readonly loadBuildConfig: typeof loadBuildConfig;
	readonly buildGuestAssets: typeof buildGuestAssets;
	readonly wipeVolumeDirs: typeof wipeVolumeDirs;
	readonly resolveWorkspaceImageDir: typeof resolveWorkspaceImageDir;
	readonly resolveVolumeCacheDir: typeof resolveVolumeCacheDir;
	readonly cleanupStaleCacheDirs: typeof cleanupStaleCacheDirs;
}

const DEFAULT_DEPENDENCIES: RunOrchestratorDependencies = {
	deriveWorkspaceIdentity,
	stopDaemonIfRequested,
	ensureDaemonRunning,
	requestAndCollect,
	loadBuildConfig,
	buildGuestAssets,
	wipeVolumeDirs,
	resolveWorkspaceImageDir,
	resolveVolumeCacheDir,
	cleanupStaleCacheDirs,
};

export async function runOrchestrator(
	options: RunAgentVmOptions,
	workDir: string = process.cwd(),
	dependencies: RunOrchestratorDependencies = DEFAULT_DEPENDENCIES,
): Promise<number> {
	const identity = dependencies.deriveWorkspaceIdentity(workDir);

	if (options.cleanup) {
		const imagesDir = path.join(
			path.dirname(dependencies.resolveWorkspaceImageDir(identity.dirHash)),
		);
		const volumeCacheDir = dependencies.resolveVolumeCacheDir();
		const removedImages = dependencies.cleanupStaleCacheDirs(imagesDir, 30);
		const removedVolumes = dependencies.cleanupStaleCacheDirs(volumeCacheDir, 30);
		process.stdout.write(
			`cleanup complete: removed ${String(removedImages)} image cache dirs and ${String(removedVolumes)} volume cache dirs\n`,
		);
		return 0;
	}

	await dependencies.stopDaemonIfRequested(identity.daemonSocketPath, identity.workDir, options);
	if (options.wipeVolumes) {
		dependencies.wipeVolumeDirs(dependencies.resolveVolumeCacheDir(), identity.dirHash);
	}

	const buildConfig = dependencies.loadBuildConfig(identity.workDir);
	const imageOutputDir = dependencies.resolveWorkspaceImageDir(identity.dirHash);
	const buildResult = await dependencies.buildGuestAssets({
		buildConfig,
		outputDir: imageOutputDir,
		fullReset: options.fullReset || options.wipeVolumes,
	});

	await dependencies.ensureDaemonRunning({
		socketPath: identity.daemonSocketPath,
		daemonLogPath: identity.daemonLogPath,
		workDir: identity.workDir,
		imagePath: buildResult.imagePath,
		scratchpad: options.scratchpad,
	});

	const command = resolveRequestedCommand(options);
	const result = await dependencies.requestAndCollect(identity.daemonSocketPath, command);
	return result.exitCode;
}

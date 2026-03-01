import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';

import { buildDebianGuestAssets } from '#src/build/build-assets.js';
import { DaemonClient, waitForSocket } from '#src/core/infrastructure/daemon-client.js';
import type { RunAgentVmOptions } from '#src/core/models/config.js';
import type { DaemonResponse } from '#src/core/models/ipc.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import { resolveAgentPresetCommand } from '#src/features/runtime-control/agent-launcher.js';

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
	const started = Date.now();
	while (true) {
		if (!fs.existsSync(socketPath)) {
			return;
		}
		if (Date.now() - started >= timeoutMs) {
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
	options: Pick<RunAgentVmOptions, 'reload' | 'fullReset'>,
): Promise<void> {
	if (!options.reload && !options.fullReset) {
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

async function maybeBuildGuestAssets(options: Pick<RunAgentVmOptions, 'fullReset'>): Promise<void> {
	if (!options.fullReset) {
		return;
	}

	const outputDir = path.join(os.homedir(), '.cache', 'agent-vm', 'images', 'default');
	await buildDebianGuestAssets({
		outputDir,
		fullReset: true,
	});
}

async function ensureDaemonRunning(socketPath: string, workDir: string): Promise<void> {
	if (fs.existsSync(socketPath)) {
		try {
			await waitForSocket(socketPath, 750);
			return;
		} catch (error: unknown) {
			throw new Error(
				`Daemon socket exists but is not reachable: ${socketPath}. Run 'run-agent-vm --reload' to recover. ${String(error)}`,
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

	const subprocess = execa(process.execPath, [daemonEntry, '--work-dir', workDir], {
		detached: true,
		stdio: 'ignore',
	});
	subprocess.unref();

	await waitForSocket(socketPath, 5_000);
}

function resolveRequestedCommand(options: RunAgentVmOptions): string | null {
	if (options.runCommand) {
		return options.runCommand;
	}
	if (options.agentPreset) {
		return resolveAgentPresetCommand(options.agentPreset);
	}
	if (options.noRun) {
		return null;
	}

	return '/bin/sh -lc "pwd"';
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

interface RunOrchestratorDependencies {
	deriveWorkspaceIdentity: typeof deriveWorkspaceIdentity;
	stopDaemonIfRequested: typeof stopDaemonIfRequested;
	maybeBuildGuestAssets: typeof maybeBuildGuestAssets;
	ensureDaemonRunning: typeof ensureDaemonRunning;
	requestAndCollect: typeof requestAndCollect;
}

const DEFAULT_DEPENDENCIES: RunOrchestratorDependencies = {
	deriveWorkspaceIdentity,
	stopDaemonIfRequested,
	maybeBuildGuestAssets,
	ensureDaemonRunning,
	requestAndCollect,
};

export async function runOrchestrator(
	options: RunAgentVmOptions,
	workDir: string = process.cwd(),
	dependencies: RunOrchestratorDependencies = DEFAULT_DEPENDENCIES,
): Promise<number> {
	const identity = dependencies.deriveWorkspaceIdentity(workDir);
	await dependencies.stopDaemonIfRequested(identity.daemonSocketPath, identity.workDir, options);
	await dependencies.maybeBuildGuestAssets(options);
	await dependencies.ensureDaemonRunning(identity.daemonSocketPath, identity.workDir);

	const command = resolveRequestedCommand(options);
	const result = await dependencies.requestAndCollect(identity.daemonSocketPath, command);
	return result.exitCode;
}

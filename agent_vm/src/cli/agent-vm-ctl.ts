import { command, option, optional, run, string, subcommands } from 'cmd-ts';

import { DaemonClient, waitForSocket } from '../core/daemon-client.js';
import { deriveWorkspaceIdentity } from '../core/workspace.js';
import type { DaemonRequest, DaemonResponse } from '../types/ipc.js';

async function connectAndCollect(
	request: DaemonRequest,
	workDir: string,
): Promise<DaemonResponse[]> {
	const identity = deriveWorkspaceIdentity(workDir);
	await waitForSocket(identity.daemonSocketPath, 3_000);

	return new Promise((resolve, reject) => {
		const responses: DaemonResponse[] = [];
		let settled = false;
		const finish = (value: DaemonResponse[]): void => {
			if (settled) {
				return;
			}
			settled = true;
			resolve(value);
		};
		const fail = (error: Error): void => {
			if (settled) {
				return;
			}
			settled = true;
			reject(error);
		};

		const client = new DaemonClient(identity.daemonSocketPath, {
			onResponse: (response) => {
				responses.push(response);

				if (response.type === 'status.response') {
					process.stdout.write(`${JSON.stringify(response.status, null, 2)}\n`);
					finish(responses);
					client.close();
					return;
				}

				if (response.type === 'ack') {
					process.stdout.write(`${response.message}\n`);
					finish(responses);
					client.close();
					return;
				}

				if (response.type === 'error') {
					fail(new Error(response.message));
					client.close();
				}
			},
			onError: (error) => fail(error),
			onClose: () => {
				if (!settled) {
					fail(new Error('daemon connection closed before receiving response'));
				}
			},
		});

		client.send(request);
	});
}

function resolveWorkDir(workDir: string | undefined): string {
	return workDir ?? process.cwd();
}

const workDirOption = option({
	long: 'work-dir',
	type: optional(string),
	defaultValue: () => process.cwd(),
	defaultValueIsSerializable: true,
});

const statusCommand = command({
	name: 'status',
	args: {
		workDir: workDirOption,
	},
	handler: async (args) => {
		await connectAndCollect({ type: 'status' }, resolveWorkDir(args.workDir));
	},
});

const policyCommand = subcommands({
	name: 'policy',
	cmds: {
		reload: command({
			name: 'reload',
			args: {
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect({ type: 'policy.reload' }, resolveWorkDir(args.workDir));
			},
		}),
		allow: command({
			name: 'allow',
			args: {
				target: option({ long: 'target', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect(
					{ type: 'policy.update', action: 'allow', target: args.target },
					resolveWorkDir(args.workDir),
				);
			},
		}),
		block: command({
			name: 'block',
			args: {
				target: option({ long: 'target', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect(
					{ type: 'policy.update', action: 'block', target: args.target },
					resolveWorkDir(args.workDir),
				);
			},
		}),
		clear: command({
			name: 'clear',
			args: {
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect(
					{ type: 'policy.update', action: 'clear' },
					resolveWorkDir(args.workDir),
				);
			},
		}),
		presets: command({
			name: 'presets',
			args: {},
			handler: async () => {
				process.stdout.write('github-write\nnotion\nlinear\n');
			},
		}),
	},
});

const tunnelsCommand = subcommands({
	name: 'tunnels',
	cmds: {
		status: command({
			name: 'status',
			args: {
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect({ type: 'status' }, resolveWorkDir(args.workDir));
			},
		}),
		restart: command({
			name: 'restart',
			args: {
				service: option({
					long: 'service',
					type: optional(string),
					defaultValue: () => undefined,
					defaultValueIsSerializable: true,
				}),
				workDir: workDirOption,
			},
			handler: async (args) => {
				if (args.service) {
					if (args.service !== 'postgres' && args.service !== 'redis') {
						throw new Error(`Invalid --service '${args.service}'. Expected postgres or redis.`);
					}

					const service = args.service;
					await connectAndCollect(
						{ type: 'tunnel.restart', service },
						resolveWorkDir(args.workDir),
					);
					return;
				}

				await connectAndCollect({ type: 'tunnel.restart' }, resolveWorkDir(args.workDir));
			},
		}),
	},
});

const daemonCommand = subcommands({
	name: 'daemon',
	cmds: {
		stop: command({
			name: 'stop',
			args: {
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect({ type: 'shutdown' }, resolveWorkDir(args.workDir));
			},
		}),
	},
});

export const agentVmCtlCommand = subcommands({
	name: 'agent-vm-ctl',
	cmds: {
		status: statusCommand,
		policy: policyCommand,
		tunnels: tunnelsCommand,
		daemon: daemonCommand,
	},
});

export async function runAgentVmCtlCli(argv: readonly string[]): Promise<void> {
	await run(agentVmCtlCommand, [...argv]);
}

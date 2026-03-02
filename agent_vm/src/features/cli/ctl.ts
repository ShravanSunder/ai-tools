import { command, option, optional, run, string, subcommands } from 'cmd-ts';

import { DaemonClient, waitForSocket } from '#src/core/infrastructure/daemon-client.js';
import type { DaemonRequest, DaemonResponse } from '#src/core/models/ipc.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';

function assertNever(value: never): never {
	throw new Error(`Unhandled daemon response variant: ${JSON.stringify(value)}`);
}

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

				switch (response.kind) {
					case 'status.response': {
						process.stdout.write(`${JSON.stringify(response.status, null, 2)}\n`);
						finish(responses);
						client.close();
						return;
					}
					case 'ack': {
						process.stdout.write(`${response.message}\n`);
						finish(responses);
						client.close();
						return;
					}
					case 'error': {
						fail(new Error(response.message));
						client.close();
						return;
					}
					case 'attached':
					case 'stream.stdout':
					case 'stream.stderr':
					case 'stream.exit':
						return;
					default:
						assertNever(response);
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
		await connectAndCollect({ kind: 'status' }, resolveWorkDir(args.workDir));
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
				await connectAndCollect({ kind: 'policy.reload' }, resolveWorkDir(args.workDir));
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
					{ kind: 'policy.allow', target: args.target },
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
					{ kind: 'policy.block', target: args.target },
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
				await connectAndCollect({ kind: 'policy.clear' }, resolveWorkDir(args.workDir));
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

const daemonCommand = subcommands({
	name: 'daemon',
	cmds: {
		stop: command({
			name: 'stop',
			args: {
				workDir: workDirOption,
			},
			handler: async (args) => {
				await connectAndCollect({ kind: 'shutdown' }, resolveWorkDir(args.workDir));
			},
		}),
	},
});

export const ctlCommand = subcommands({
	name: 'ctl',
	cmds: {
		status: statusCommand,
		policy: policyCommand,
		daemon: daemonCommand,
	},
});

export async function runCtlCli(argv: readonly string[]): Promise<void> {
	await run(ctlCommand, [...argv]);
}

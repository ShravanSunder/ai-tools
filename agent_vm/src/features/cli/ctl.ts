import { command, option, optional, run, string, subcommands } from 'cmd-ts';

import { DaemonClient, waitForSocket } from '#src/core/infrastructure/daemon-client.js';
import type { DaemonRequest, DaemonResponse } from '#src/core/models/ipc.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import {
	type MountConfigTier,
	type MountListSource,
	type MountMode,
	listMountEntries,
	removeMountEntry,
	upsertMountEntry,
} from '#src/features/runtime-control/runtime-config-editor.js';
import {
	addPolicyDomain,
	type FirewallConfigTier,
	type FirewallListSource,
	listPolicyDomains,
	removePolicyDomain,
} from '#src/features/runtime-control/policy-config-editor.js';

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

function parseMountTier(rawTier: string): MountConfigTier {
	if (rawTier === 'repo' || rawTier === 'local') {
		return rawTier;
	}
	throw new Error(`Invalid --tier '${rawTier}'. Expected 'repo' or 'local'.`);
}

function parseMountMode(rawMode: string): MountMode {
	if (rawMode === 'ro' || rawMode === 'rw') {
		return rawMode;
	}
	throw new Error(`Invalid --mode '${rawMode}'. Expected 'ro' or 'rw'.`);
}

function parseMountListSource(rawSource: string): MountListSource {
	if (rawSource === 'repo' || rawSource === 'local' || rawSource === 'merged') {
		return rawSource;
	}
	throw new Error(`Invalid --source '${rawSource}'. Expected 'repo', 'local', or 'merged'.`);
}

function parseFirewallTier(rawTier: string): FirewallConfigTier {
	if (rawTier === 'repo' || rawTier === 'local') {
		return rawTier;
	}
	throw new Error(`Invalid --tier '${rawTier}'. Expected 'repo' or 'local'.`);
}

function parseFirewallListSource(rawSource: string): FirewallListSource {
	if (
		rawSource === 'base' ||
		rawSource === 'repo' ||
		rawSource === 'local' ||
		rawSource === 'toggles' ||
		rawSource === 'merged'
	) {
		return rawSource;
	}
	throw new Error(
		`Invalid --source '${rawSource}'. Expected 'base', 'repo', 'local', 'toggles', or 'merged'.`,
	);
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

const mountCommand = subcommands({
	name: 'mount',
	cmds: {
		add: command({
			name: 'add',
			args: {
				tier: option({ long: 'tier', type: string }),
				mode: option({ long: 'mode', type: string }),
				guest: option({ long: 'guest', type: string }),
				host: option({ long: 'host', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				const workDir = resolveWorkDir(args.workDir);
				const tier = parseMountTier(args.tier);
				const mode = parseMountMode(args.mode);
				await upsertMountEntry({
					workDir,
					tier,
					mode,
					guestPath: args.guest,
					hostPath: args.host,
				});
				process.stdout.write(`mount updated (${mode}): ${args.guest} -> ${args.host}\n`);
			},
		}),
		remove: command({
			name: 'remove',
			args: {
				tier: option({ long: 'tier', type: string }),
				guest: option({ long: 'guest', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				await removeMountEntry({
					workDir: resolveWorkDir(args.workDir),
					tier: parseMountTier(args.tier),
					guestPath: args.guest,
				});
				process.stdout.write(`mount removed: ${args.guest}\n`);
			},
		}),
		list: command({
			name: 'list',
			args: {
				source: option({
					long: 'source',
					type: optional(string),
					defaultValue: () => 'merged',
					defaultValueIsSerializable: true,
				}),
				workDir: workDirOption,
			},
			handler: async (args) => {
				const source = parseMountListSource(args.source ?? 'merged');
				const entries = listMountEntries(resolveWorkDir(args.workDir), source);
				process.stdout.write(`${JSON.stringify(entries, null, 2)}\n`);
			},
		}),
	},
});

const firewallCommand = subcommands({
	name: 'firewall',
	cmds: {
		add: command({
			name: 'add',
			args: {
				tier: option({ long: 'tier', type: string }),
				domain: option({ long: 'domain', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				await addPolicyDomain({
					workDir: resolveWorkDir(args.workDir),
					tier: parseFirewallTier(args.tier),
					domain: args.domain,
				});
				process.stdout.write(`firewall domain added: ${args.domain}\n`);
			},
		}),
		remove: command({
			name: 'remove',
			args: {
				tier: option({ long: 'tier', type: string }),
				domain: option({ long: 'domain', type: string }),
				workDir: workDirOption,
			},
			handler: async (args) => {
				await removePolicyDomain({
					workDir: resolveWorkDir(args.workDir),
					tier: parseFirewallTier(args.tier),
					domain: args.domain,
				});
				process.stdout.write(`firewall domain removed: ${args.domain}\n`);
			},
		}),
		list: command({
			name: 'list',
			args: {
				source: option({
					long: 'source',
					type: optional(string),
					defaultValue: () => 'merged',
					defaultValueIsSerializable: true,
				}),
				workDir: workDirOption,
			},
			handler: async (args) => {
				const entries = listPolicyDomains(
					resolveWorkDir(args.workDir),
					parseFirewallListSource(args.source ?? 'merged'),
				);
				process.stdout.write(`${JSON.stringify(entries, null, 2)}\n`);
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
		mount: mountCommand,
		firewall: firewallCommand,
		daemon: daemonCommand,
	},
});

export async function runCtlCli(argv: readonly string[]): Promise<void> {
	await run(ctlCommand, [...argv]);
}

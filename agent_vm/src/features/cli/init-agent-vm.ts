import { command, flag, option, optional, run, string } from 'cmd-ts';

import { initializeAgentVm, type InitMode } from '#src/features/repo-init/init-agent-vm.js';

interface InitModeFlags {
	readonly defaultMode: boolean;
	readonly repoOnly: boolean;
	readonly localOnly: boolean;
	readonly syncDocs: boolean;
}

function resolveInitMode(flags: InitModeFlags): InitMode {
	const selected: InitMode[] = [];
	if (flags.defaultMode) {
		selected.push('default');
	}
	if (flags.repoOnly) {
		selected.push('repo-only');
	}
	if (flags.localOnly) {
		selected.push('local-only');
	}
	if (flags.syncDocs) {
		selected.push('sync-docs');
	}

	if (selected.length > 1) {
		throw new Error('Choose only one mode flag: --default, --repo-only, --local-only, --sync-docs');
	}

	return selected[0] ?? 'default';
}

export const initAgentVmCommand = command({
	name: 'init',
	description: 'Initialize .agent_vm templates in repository root',
	args: {
		defaultMode: flag({ long: 'default', description: 'Initialize both repo + local templates' }),
		repoOnly: flag({ long: 'repo-only', description: 'Initialize only repo-scoped templates' }),
		localOnly: flag({ long: 'local-only', description: 'Initialize only local-scoped templates' }),
		syncDocs: flag({ long: 'sync-docs', description: 'Only sync INSTRUCTIONS.md into .agent_vm/' }),
		override: flag({ long: 'override', description: 'Overwrite existing files' }),
		workDir: option({
			long: 'work-dir',
			type: optional(string),
			description: 'Directory used to detect repository root',
			defaultValue: () => process.cwd(),
			defaultValueIsSerializable: true,
		}),
	},
	handler: async (args) => {
		initializeAgentVm({
			workDir: args.workDir ?? process.cwd(),
			mode: resolveInitMode(args),
			override: args.override,
		});
	},
});

export async function runInitAgentVmCli(argv: readonly string[]): Promise<void> {
	await run(initAgentVmCommand, [...argv]);
}

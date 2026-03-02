import { command, flag, option, optional, run, string } from 'cmd-ts';

import type { AgentPreset, RunAgentVmOptions } from '#src/core/models/config.js';
import { runOrchestrator } from '#src/features/runtime-control/run-orchestrator.js';

function buildOptionsFromFlags(input: {
	reload: boolean;
	fullReset: boolean;
	wipeVolumes: boolean;
	scratchpad: boolean;
	cleanup: boolean;
	noRun: boolean;
	run: string | undefined;
	runClaude: boolean;
	runCodex: boolean;
	runGemini: boolean;
	runOpencode: boolean;
	runCursor: boolean;
}): RunAgentVmOptions {
	const agentPreset: AgentPreset | null = input.runClaude
		? 'claude'
		: input.runCodex
			? 'codex'
			: input.runGemini
				? 'gemini'
				: input.runOpencode
					? 'opencode'
					: input.runCursor
						? 'cursor'
						: null;

	const runMode = input.noRun
		? ({ kind: 'no-run' } as const)
		: input.run
			? ({
					kind: 'command',
					command: input.run,
				} as const)
			: agentPreset
				? ({
						kind: 'preset',
						preset: agentPreset,
					} as const)
				: ({ kind: 'default' } as const);

	return {
		reload: input.reload,
		fullReset: input.fullReset,
		wipeVolumes: input.wipeVolumes,
		scratchpad: input.scratchpad,
		cleanup: input.cleanup,
		runMode,
	};
}

export const runCommand = command({
	name: 'run',
	description: 'Start/reuse agent_vm daemon and run an agent command inside VM',
	args: {
		reload: flag({ long: 'reload', description: 'Recreate VM session from current config' }),
		fullReset: flag({
			long: 'full-reset',
			description: 'Rebuild guest assets and recycle daemon session',
		}),
		wipeVolumes: flag({
			long: 'wipe-volumes',
			description: 'Wipe persistent volume cache before rebuilding image',
		}),
		scratchpad: flag({
			long: 'scratchpad',
			description: 'Use in-memory workspace mount instead of host workspace',
		}),
		cleanup: flag({
			long: 'cleanup',
			description: 'Prune stale image and volume cache directories',
		}),
		noRun: flag({ long: 'no-run', description: 'Start daemon/session without running command' }),
		run: option({
			long: 'run',
			type: optional(string),
			description: 'Run custom command in VM',
			defaultValue: () => undefined,
			defaultValueIsSerializable: true,
		}),
		runClaude: flag({ long: 'run-claude', description: 'Launch Claude Code preset' }),
		runCodex: flag({ long: 'run-codex', description: 'Launch Codex preset' }),
		runGemini: flag({ long: 'run-gemini', description: 'Launch Gemini preset' }),
		runOpencode: flag({ long: 'run-opencode', description: 'Launch OpenCode preset' }),
		runCursor: flag({ long: 'run-cursor', description: 'Launch Cursor preset' }),
	},
	handler: async (args) => {
		const options = buildOptionsFromFlags(args);
		const exitCode = await runOrchestrator(options);
		if (exitCode !== 0) {
			process.exitCode = exitCode;
		}
	},
});

export async function runRunCli(argv: readonly string[]): Promise<void> {
	await run(runCommand, [...argv]);
}

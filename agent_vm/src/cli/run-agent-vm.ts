import { command, flag, option, optional, run, string } from 'cmd-ts';

import { runOrchestrator } from '../core/run-orchestrator.js';
import type { RunAgentVmOptions } from '../types/config.js';

function buildOptionsFromFlags(input: {
	reload: boolean;
	fullReset: boolean;
	noRun: boolean;
	run: string | undefined;
	runClaude: boolean;
	runCodex: boolean;
	runGemini: boolean;
	runOpencode: boolean;
	runCursor: boolean;
}): RunAgentVmOptions {
	const agentPreset = input.runClaude
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

	return {
		reload: input.reload,
		fullReset: input.fullReset,
		noRun: input.noRun,
		runCommand: input.run ?? null,
		agentPreset,
	};
}

export const runAgentVmCommand = command({
	name: 'run-agent-vm',
	description: 'Start/reuse agent_vm daemon and run an agent command inside VM',
	args: {
		reload: flag({ long: 'reload', description: 'Recreate VM session from current config' }),
		fullReset: flag({
			long: 'full-reset',
			description: 'Rebuild guest assets and recycle daemon session',
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

export async function runRunAgentVmCli(argv: readonly string[]): Promise<void> {
	await run(runAgentVmCommand, [...argv]);
}

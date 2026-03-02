import { run, subcommands } from 'cmd-ts';

import { ctlCommand } from '#src/features/cli/ctl.js';
import { initAgentVmCommand } from '#src/features/cli/init-agent-vm.js';
import { runCommand } from '#src/features/cli/run.js';

export const agentVmCommand = subcommands({
	name: 'agent-vm',
	cmds: {
		init: initAgentVmCommand,
		run: runCommand,
		ctl: ctlCommand,
	},
});

export async function runAgentVmCli(argv: readonly string[]): Promise<void> {
	await run(agentVmCommand, [...argv]);
}

#!/usr/bin/env node

import { runAgentVmCli } from '#src/features/cli/agent-vm.js';

function renderErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

void runAgentVmCli(process.argv.slice(2)).catch((error: unknown) => {
	process.stderr.write(`${renderErrorMessage(error)}\n`);
	process.exitCode = 1;
});

#!/usr/bin/env node

import path from 'node:path';

import { JsonLineLogger } from '#src/core/platform/logger.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import { AgentVmDaemon } from '#src/features/runtime-control/session-daemon.js';

function parseWorkDir(argv: readonly string[]): string {
	const index = argv.indexOf('--work-dir');
	const nextValue = index >= 0 ? argv[index + 1] : undefined;
	if (nextValue) {
		return path.resolve(nextValue);
	}
	return process.cwd();
}

async function main(): Promise<void> {
	const workDir = parseWorkDir(process.argv.slice(2));
	const identity = deriveWorkspaceIdentity(workDir);
	const logger = new JsonLineLogger(identity.daemonLogPath);

	const daemon = new AgentVmDaemon(identity, logger);
	await daemon.start();

	const shutdown = async (): Promise<void> => {
		await daemon.stop();
		process.exit(0);
	};

	process.on('SIGTERM', () => {
		void shutdown();
	});
	process.on('SIGINT', () => {
		void shutdown();
	});
}

void main();

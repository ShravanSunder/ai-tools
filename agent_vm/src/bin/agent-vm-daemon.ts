#!/usr/bin/env node

import path from 'node:path';

import { JsonLineLogger } from '#src/core/platform/logger.js';
import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';
import { AgentVmDaemon } from '#src/features/runtime-control/session-daemon.js';

interface ParsedArgs {
	readonly workDir: string;
	readonly imagePath: string;
	readonly scratchpad: boolean;
}

function parseWorkDir(argv: readonly string[]): string {
	const index = argv.indexOf('--work-dir');
	const nextValue = index >= 0 ? argv[index + 1] : undefined;
	if (nextValue) {
		return path.resolve(nextValue);
	}
	return process.cwd();
}

function parseImagePath(argv: readonly string[]): string {
	const index = argv.indexOf('--image-path');
	const nextValue = index >= 0 ? argv[index + 1] : undefined;
	if (!nextValue) {
		throw new Error('--image-path is required');
	}
	return path.resolve(nextValue);
}

function parseArgs(argv: readonly string[]): ParsedArgs {
	return {
		workDir: parseWorkDir(argv),
		imagePath: parseImagePath(argv),
		scratchpad: argv.includes('--scratchpad'),
	};
}

async function main(): Promise<void> {
	const parsedArgs = parseArgs(process.argv.slice(2));
	const workDir = parsedArgs.workDir;
	const identity = deriveWorkspaceIdentity(workDir);
	const logger = new JsonLineLogger(identity.daemonLogPath);

	const daemon = new AgentVmDaemon(identity, logger, {
		imagePath: parsedArgs.imagePath,
		scratchpad: parsedArgs.scratchpad,
	});
	await daemon.start();

	let shuttingDown = false;
	const shutdown = async (): Promise<void> => {
		if (shuttingDown) {
			return;
		}
		shuttingDown = true;
		await daemon.stop();
		process.exit(0);
	};

	process.on('SIGTERM', () => {
		shutdown().catch((error: unknown) => {
			logger.log('error', 'daemon', 'SIGTERM shutdown failed', { error: String(error) });
			process.exit(1);
		});
	});
	process.on('SIGINT', () => {
		shutdown().catch((error: unknown) => {
			logger.log('error', 'daemon', 'SIGINT shutdown failed', { error: String(error) });
			process.exit(1);
		});
	});
}

void main().catch((error: unknown) => {
	process.stderr.write(`agent-vm-daemon startup failed: ${String(error)}\n`);
	process.exit(1);
});

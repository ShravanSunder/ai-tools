import fs from 'node:fs';
import path from 'node:path';

import type { ResolvedRuntimeConfig } from '#src/core/models/config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';
import { getGeneratedStateDir } from '#src/core/platform/paths.js';
import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';
import {
	compileAndPersistPolicy,
	readPolicyState,
} from '#src/features/runtime-control/policy-manager.js';
import { loadVmRuntimeConfig } from '#src/features/runtime-control/vm-runtime-loader.js';

function assertNoRemovedTcpConfigFiles(workDir: string): void {
	const removedConfigPaths = [
		path.join(workDir, '.agent_vm', 'tcp-services.repo.json'),
		path.join(workDir, '.agent_vm', 'tcp-services.local.json'),
	];

	if (removedConfigPaths.some((removedPath) => fs.existsSync(removedPath))) {
		throw new Error(
			'Hard cutover: tcp-services.*.json is unsupported. Move tcp config into vm-runtime.*.json under tcp before running agent_vm.',
		);
	}
}

export function resolveRuntimeConfig(workDir: string): ResolvedRuntimeConfig {
	assertNoRemovedTcpConfigFiles(workDir);

	const runtimeConfig = loadVmRuntimeConfig(workDir);
	const buildConfig = loadBuildConfig(workDir);
	const allowedHosts = compileAndPersistPolicy(workDir);

	const generatedStateDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedStateDir, { recursive: true });
	const toggleEntries = readPolicyState(workDir).entries;

	return {
		runtimeConfig,
		buildConfig,
		allowedHosts,
		toggleEntries,
		generatedStateDir,
	};
}

export function resolveVmConfig(workDir: string): VmRuntimeConfig {
	assertNoRemovedTcpConfigFiles(workDir);
	return loadVmRuntimeConfig(workDir);
}

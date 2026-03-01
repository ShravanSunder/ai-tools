import fs from 'node:fs';

import type { ResolvedRuntimeConfig } from '#src/core/models/config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';
import { getGeneratedStateDir } from '#src/core/platform/paths.js';
import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';
import {
	compileAndPersistPolicy,
	readPolicyState,
} from '#src/features/runtime-control/policy-manager.js';
import { loadTcpServiceConfig } from '#src/features/runtime-control/tcp-service-config.js';
import { loadVmRuntimeConfig } from '#src/features/runtime-control/vm-runtime-loader.js';

export function resolveRuntimeConfig(workDir: string): ResolvedRuntimeConfig {
	const runtimeConfig = loadVmRuntimeConfig(workDir);
	const buildConfig = loadBuildConfig(workDir);
	const tcpServiceMap = loadTcpServiceConfig(workDir);
	const allowedHosts = compileAndPersistPolicy(workDir);

	const generatedStateDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedStateDir, { recursive: true });
	const toggleEntries = readPolicyState(workDir).entries;

	return {
		runtimeConfig,
		buildConfig,
		tcpServiceMap,
		allowedHosts,
		toggleEntries,
		generatedStateDir,
	};
}

export function resolveVmConfig(workDir: string): VmRuntimeConfig {
	return loadVmRuntimeConfig(workDir);
}

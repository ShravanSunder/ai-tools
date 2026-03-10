import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
	type VmRuntimeConfig,
	type VmRuntimeConfigInput,
	mergeVmRuntimeConfigs,
	parseVmRuntimeConfig,
	parseVmRuntimeConfigInput,
} from '#src/core/models/vm-runtime-config.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';
import {
	interpolateConfigValue,
	type InterpolationContext,
	resolveScriptPath,
} from '#src/features/runtime-control/config-interpolation.js';
import { validateRuntimeMountPolicy } from '#src/features/runtime-control/mount-policy.js';

interface RuntimeLayer {
	readonly configPath: string;
	readonly values: VmRuntimeConfigInput;
}

function parseJsonFile(filePath: string): unknown {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
	} catch (error: unknown) {
		throw new Error(`Invalid JSON in ${filePath}: ${String(error)}`, { cause: error });
	}
}

function maybeLoadLayer(filePath: string): RuntimeLayer {
	if (!fs.existsSync(filePath)) {
		return {
			configPath: filePath,
			values: {},
		};
	}

	try {
		return {
			configPath: filePath,
			values: parseVmRuntimeConfigInput(parseJsonFile(filePath)),
		};
	} catch (error: unknown) {
		throw new Error(`Invalid runtime config file '${filePath}': ${String(error)}`, {
			cause: error,
		});
	}
}

function applyScriptResolution(layer: RuntimeLayer): VmRuntimeConfigInput {
	const initScripts = layer.values.initScripts;
	const shellConfig = layer.values.shell;
	if (!initScripts && !shellConfig) {
		return layer.values;
	}

	const configDirectory = path.dirname(layer.configPath);
	return {
		...layer.values,
		initScripts: initScripts
			? {
					background: initScripts.background
						? resolveScriptPath(initScripts.background, configDirectory)
						: initScripts.background,
					foreground: initScripts.foreground
						? resolveScriptPath(initScripts.foreground, configDirectory)
						: initScripts.foreground,
				}
			: undefined,
		shell: shellConfig
			? {
					...shellConfig,
					zshrcExtra: shellConfig.zshrcExtra
						? resolveScriptPath(shellConfig.zshrcExtra, configDirectory)
						: shellConfig.zshrcExtra,
				}
			: undefined,
	};
}

function applyInterpolation(
	config: VmRuntimeConfig,
	interpolationContext: InterpolationContext,
): VmRuntimeConfig {
	const interpolatedEnv: Record<string, string> = {};
	for (const [environmentKey, environmentValue] of Object.entries(config.env)) {
		interpolatedEnv[environmentKey] = interpolateConfigValue(
			environmentValue,
			interpolationContext,
		);
	}

	const interpolatedVolumes: Record<string, { guestPath: string }> = {};
	for (const [volumeName, volumeConfig] of Object.entries(config.volumes)) {
		interpolatedVolumes[volumeName] = {
			guestPath: interpolateConfigValue(volumeConfig.guestPath, interpolationContext),
		};
	}

	const interpolatedReadonlyMounts: Record<string, string> = {};
	for (const [mountName, mountPath] of Object.entries(config.readonlyMounts)) {
		interpolatedReadonlyMounts[interpolateConfigValue(mountName, interpolationContext)] =
			interpolateConfigValue(mountPath, interpolationContext);
	}

	const interpolatedExtraMounts: Record<string, string> = {};
	for (const [mountName, mountPath] of Object.entries(config.extraMounts)) {
		interpolatedExtraMounts[interpolateConfigValue(mountName, interpolationContext)] =
			interpolateConfigValue(mountPath, interpolationContext);
	}

	const interpolatedMountControls = {
		...config.mountControls,
		writableAllowedGuestPrefixes: config.mountControls.writableAllowedGuestPrefixes.map(
			(guestPrefix) => interpolateConfigValue(guestPrefix, interpolationContext),
		),
	};

	return {
		...config,
		env: interpolatedEnv,
		volumes: interpolatedVolumes,
		readonlyMounts: interpolatedReadonlyMounts,
		extraMounts: interpolatedExtraMounts,
		mountControls: interpolatedMountControls,
	};
}

export function loadVmRuntimeConfig(workDir: string): VmRuntimeConfig {
	const agentVmRoot = getAgentVmRoot();
	const baseConfigPath = path.join(agentVmRoot, 'config', 'vm-runtime.base.json');
	if (!fs.existsSync(baseConfigPath)) {
		throw new Error(`Missing base runtime config: ${baseConfigPath}`);
	}

	const repoConfigPath = path.join(workDir, '.agent_vm', 'vm-runtime.repo.json');
	const localConfigPath = path.join(workDir, '.agent_vm', 'vm-runtime.local.json');

	const baseLayer = applyScriptResolution(maybeLoadLayer(baseConfigPath));
	const repoLayer = applyScriptResolution(maybeLoadLayer(repoConfigPath));
	const localLayer = applyScriptResolution(maybeLoadLayer(localConfigPath));

	const mergedInput = mergeVmRuntimeConfigs(baseLayer, repoLayer, localLayer);
	const resolvedConfig = parseVmRuntimeConfig(mergedInput);
	const hostHome = os.homedir();
	const interpolatedConfig = applyInterpolation(resolvedConfig, {
		WORKSPACE: path.resolve(workDir),
		HOST_HOME: hostHome,
	});
	validateRuntimeMountPolicy(interpolatedConfig, {
		workDir: path.resolve(workDir),
		hostHome,
	});
	return interpolatedConfig;
}

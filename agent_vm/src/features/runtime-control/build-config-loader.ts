import fs from 'node:fs';
import path from 'node:path';

import {
	type BuildConfig,
	type BuildConfigInput,
	mergeBuildConfigs,
	parseBuildConfig,
	parseBuildConfigInput,
} from '#src/core/models/build-config.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';
import { resolveScriptPath } from '#src/features/runtime-control/config-interpolation.js';

function parseJsonFile(filePath: string): unknown {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
	} catch (error: unknown) {
		throw new Error(`Invalid JSON in ${filePath}: ${String(error)}`, { cause: error });
	}
}

function maybeLoadBuildConfigLayer(configPath: string): BuildConfigInput {
	if (!fs.existsSync(configPath)) {
		return {};
	}

	try {
		return parseBuildConfigInput(parseJsonFile(configPath));
	} catch (error: unknown) {
		throw new Error(`Invalid build config file '${configPath}': ${String(error)}`, {
			cause: error,
		});
	}
}

function applyRelativeScriptResolution(
	configLayer: BuildConfigInput,
	configPath: string,
): BuildConfigInput {
	const initConfig = configLayer.init;
	if (!initConfig) {
		return configLayer;
	}

	const configDirectory = path.dirname(configPath);

	return {
		...configLayer,
		init: initConfig
			? {
					...initConfig,
					rootfsInit: initConfig.rootfsInit
						? resolveScriptPath(initConfig.rootfsInit, configDirectory)
						: initConfig.rootfsInit,
					initramfsInit: initConfig.initramfsInit
						? resolveScriptPath(initConfig.initramfsInit, configDirectory)
						: initConfig.initramfsInit,
					rootfsInitExtra: initConfig.rootfsInitExtra
						? resolveScriptPath(initConfig.rootfsInitExtra, configDirectory)
						: initConfig.rootfsInitExtra,
				}
			: undefined,
	};
}

function resolveWorkspaceLocalPath(
	rawPath: string,
	workspaceRoot: string,
	options: { allowWorkspaceRoot: boolean },
): string {
	if (path.isAbsolute(rawPath)) {
		throw new Error(`Path must be relative to workspace root: '${rawPath}'`);
	}

	const normalizedWorkspaceRoot = path.resolve(workspaceRoot);
	const resolvedPath = path.resolve(normalizedWorkspaceRoot, rawPath);
	const relativePath = path.relative(normalizedWorkspaceRoot, resolvedPath);
	const resolvedToWorkspaceRoot = relativePath === '';
	if (
		relativePath.startsWith('..') ||
		path.isAbsolute(relativePath) ||
		(resolvedToWorkspaceRoot && !options.allowWorkspaceRoot)
	) {
		throw new Error(
			`Path traversal detected for '${rawPath}'. Path must stay within '${normalizedWorkspaceRoot}'`,
		);
	}

	if (!fs.existsSync(resolvedPath)) {
		throw new Error(
			`Resolved path '${rawPath}' does not exist. Path must exist within '${normalizedWorkspaceRoot}'`,
		);
	}

	const workspaceRealPath = fs.realpathSync(normalizedWorkspaceRoot);
	const resolvedRealPath = fs.realpathSync(resolvedPath);
	const realRelativePath = path.relative(workspaceRealPath, resolvedRealPath);
	const resolvedToRealWorkspaceRoot = realRelativePath === '';
	if (
		realRelativePath.startsWith('..') ||
		path.isAbsolute(realRelativePath) ||
		(resolvedToRealWorkspaceRoot && !options.allowWorkspaceRoot)
	) {
		throw new Error(
			`Path traversal detected for '${rawPath}'. Resolved path '${resolvedPath}' escapes '${normalizedWorkspaceRoot}' via symlink`,
		);
	}

	return resolvedRealPath;
}

function applyOverlayPathResolution(
	configLayer: BuildConfigInput,
	resolutionRoot: string,
): BuildConfigInput {
	const ociOverlayConfig = configLayer.ociOverlay;
	if (!ociOverlayConfig) {
		return configLayer;
	}

	const resolvedOverlay: BuildConfigInput['ociOverlay'] = {
		...ociOverlayConfig,
	};
	if (ociOverlayConfig.dockerfile !== undefined) {
		resolvedOverlay.dockerfile = resolveWorkspaceLocalPath(
			ociOverlayConfig.dockerfile,
			resolutionRoot,
			{
				allowWorkspaceRoot: false,
			},
		);
	}
	if (ociOverlayConfig.contextDir !== undefined) {
		resolvedOverlay.contextDir = resolveWorkspaceLocalPath(
			ociOverlayConfig.contextDir,
			resolutionRoot,
			{
				allowWorkspaceRoot: true,
			},
		);
	}

	return {
		...configLayer,
		ociOverlay: resolvedOverlay,
	};
}

function hasCommandInPath(commandName: string): boolean {
	const pathValue = process.env.PATH ?? '';
	const pathSegments = pathValue.split(path.delimiter).filter((segment) => segment.length > 0);
	for (const pathSegment of pathSegments) {
		const commandPath = path.join(pathSegment, commandName);
		try {
			fs.accessSync(commandPath, fs.constants.X_OK);
			return true;
		} catch {
			// continue
		}
	}
	return false;
}

function validatePlatformConstraints(config: BuildConfig): void {
	const hasOci = config.oci !== undefined;
	const hasPostBuildCommands = (config.postBuild?.commands?.length ?? 0) > 0;
	if (process.platform === 'darwin' && hasOci && hasPostBuildCommands) {
		throw new Error(
			'postBuild.commands is not supported with OCI builds on macOS. Use a pre-built custom OCI image instead - see agent_vm/docs/plans/2026-03-01-agent-vm-config-surface-design.md#macos--oci-package-customization-strategy',
		);
	}

	if (config.ociOverlay !== undefined && !hasCommandInPath('docker')) {
		throw new Error(
			'build config uses ociOverlay but docker CLI is unavailable on PATH. Install Docker/OrbStack or remove ociOverlay.',
		);
	}
}

export function loadBuildConfig(workDir: string): BuildConfig {
	const agentVmRoot = getAgentVmRoot();
	const baseConfigPath = path.join(agentVmRoot, 'config', 'build.base.json');
	const projectConfigPath = path.join(workDir, '.agent_vm', 'build.project.json');

	if (!fs.existsSync(baseConfigPath)) {
		throw new Error(`Missing base build config: ${baseConfigPath}`);
	}

	const baseLayer = applyOverlayPathResolution(
		applyRelativeScriptResolution(maybeLoadBuildConfigLayer(baseConfigPath), baseConfigPath),
		agentVmRoot,
	);
	const projectLayer = applyOverlayPathResolution(
		applyRelativeScriptResolution(maybeLoadBuildConfigLayer(projectConfigPath), projectConfigPath),
		workDir,
	);

	const mergedInput = mergeBuildConfigs(baseLayer, projectLayer);
	let parsedConfig: BuildConfig;
	try {
		parsedConfig = parseBuildConfig(mergedInput);
	} catch (error: unknown) {
		throw new Error(`Merged build config is invalid for workspace '${workDir}': ${String(error)}`, {
			cause: error,
		});
	}
	validatePlatformConstraints(parsedConfig);
	return parsedConfig;
}

import fs from 'node:fs';
import path from 'node:path';

import type { ResolvedRuntimeConfig, VmConfig } from '#src/core/models/config.js';
import { getAgentVmRoot, getGeneratedStateDir } from '#src/core/platform/paths.js';
import { compileAndPersistPolicy } from '#src/features/runtime-control/policy-manager.js';
import { loadTunnelConfig } from '#src/features/runtime-control/tunnel-config.js';

function parseBoolean(value: string, defaultValue: boolean): boolean {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return defaultValue;
	}
	const normalized = trimmed.toLowerCase();
	if (['1', 'true', 'yes', 'on'].includes(normalized)) {
		return true;
	}
	if (['0', 'false', 'no', 'off'].includes(normalized)) {
		return false;
	}
	throw new Error(`Invalid boolean value '${value}'`);
}

function parseList(value: string): string[] {
	return value
		.split(/[\s,]+/u)
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);
}

function parseConf(content: string, filePath: string): Record<string, string> {
	const result: Record<string, string> = {};
	const lines = content.split(/\r?\n/u);
	for (const [index, line] of lines.entries()) {
		const trimmed = line.trim();
		if (trimmed.length === 0 || trimmed.startsWith('#')) {
			continue;
		}
		const withoutExport = trimmed.startsWith('export ')
			? trimmed.slice('export '.length).trim()
			: trimmed;
		const match = withoutExport.match(/^([A-Z0-9_]+)=(.*)$/u);
		if (!match) {
			throw new Error(`Invalid config line ${index + 1} in ${filePath}: '${line}'`);
		}
		const key = match[1];
		const value = match[2] ?? '';
		if (!key) {
			throw new Error(`Invalid empty key at line ${index + 1} in ${filePath}`);
		}
		result[key] = value;
	}
	return result;
}

function loadConf(filePath: string): Record<string, string> {
	if (!fs.existsSync(filePath)) {
		return {};
	}
	const content = fs.readFileSync(filePath, 'utf8');
	return parseConf(content, filePath);
}

function resolveVmConfigMap(workDir: string): Record<string, string> {
	const root = getAgentVmRoot();
	const basePath = path.join(root, 'config', 'vm.base.conf');
	const repoPath = path.join(workDir, '.agent_vm', 'vm.repo.conf');
	const localPath = path.join(workDir, '.agent_vm', 'vm.local.conf');

	return {
		...loadConf(basePath),
		...loadConf(repoPath),
		...loadConf(localPath),
	};
}

export function resolveVmConfig(workDir: string): VmConfig {
	const merged = resolveVmConfigMap(workDir);
	const idleTimeoutRaw = merged['IDLE_TIMEOUT_MINUTES'] ?? '10';
	const idleTimeoutMinutes = Number.parseInt(idleTimeoutRaw, 10);
	if (!Number.isFinite(idleTimeoutMinutes) || idleTimeoutMinutes <= 0) {
		throw new Error(`Invalid IDLE_TIMEOUT_MINUTES value '${idleTimeoutRaw}'`);
	}

	return {
		idleTimeoutMinutes,
		extraAptPackages: parseList(merged['EXTRA_APT_PACKAGES'] ?? ''),
		playwrightExtraHosts: parseList(merged['PLAYWRIGHT_EXTRA_HOSTS'] ?? ''),
		tunnelEnabled: parseBoolean(merged['TUNNEL_ENABLED'] ?? 'true', true),
	};
}

export function resolveRuntimeConfig(workDir: string): ResolvedRuntimeConfig {
	const vmConfig = resolveVmConfig(workDir);
	const tunnelConfig = loadTunnelConfig(workDir);
	const allowedHosts = compileAndPersistPolicy(workDir);

	const generatedStateDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedStateDir, { recursive: true });

	const togglePath = path.join(generatedStateDir, 'policy-toggle.entries.txt');
	const toggleEntries = fs.existsSync(togglePath)
		? fs
				.readFileSync(togglePath, 'utf8')
				.split(/\r?\n/u)
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
		: [];

	return {
		vmConfig,
		tunnelConfig,
		allowedHosts,
		toggleEntries,
		generatedStateDir,
	};
}

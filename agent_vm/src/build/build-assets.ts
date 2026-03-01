import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';

import type { BuildConfig } from '#src/core/models/build-config.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';

const BUILD_SCHEMA_VERSION = '2026-03-01-config-surface-v1';

export interface BuildAssetsOptions {
	readonly buildConfig: BuildConfig;
	readonly outputDir: string;
	readonly fullReset: boolean;
}

export interface BuildAssetsResult {
	readonly imagePath: string;
	readonly fingerprint: string;
	readonly built: boolean;
}

function resolveGondolinBinPath(agentVmRoot: string): string {
	const localBinPath = path.join(agentVmRoot, 'node_modules', '.bin', 'gondolin');
	if (fs.existsSync(localBinPath)) {
		return localBinPath;
	}

	const hoistedBinPath = path.resolve(agentVmRoot, '..', 'node_modules', '.bin', 'gondolin');
	if (fs.existsSync(hoistedBinPath)) {
		return hoistedBinPath;
	}

	throw new Error('gondolin CLI not found. Install @earendil-works/gondolin and run pnpm install.');
}

function resolveGondolinVersion(agentVmRoot: string): string {
	const gondolinPackageJsonPath = path.join(
		agentVmRoot,
		'node_modules',
		'@earendil-works',
		'gondolin',
		'package.json',
	);
	if (fs.existsSync(gondolinPackageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(gondolinPackageJsonPath, 'utf8')) as {
			version?: unknown;
		};
		if (typeof packageJson.version === 'string' && packageJson.version.length > 0) {
			return packageJson.version;
		}
	}

	const agentVmPackageJsonPath = path.join(agentVmRoot, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(agentVmPackageJsonPath, 'utf8')) as {
		optionalDependencies?: Record<string, string>;
		dependencies?: Record<string, string>;
	};
	const pinnedVersion =
		packageJson.optionalDependencies?.['@earendil-works/gondolin'] ??
		packageJson.dependencies?.['@earendil-works/gondolin'];
	if (pinnedVersion) {
		return pinnedVersion;
	}

	return 'unknown';
}

function stableSerialize(value: unknown): string {
	if (Array.isArray(value)) {
		return `[${value.map((entry) => stableSerialize(entry)).join(',')}]`;
	}
	if (typeof value === 'object' && value !== null) {
		const entries = Object.entries(value as Record<string, unknown>)
			.filter(([, entryValue]) => entryValue !== undefined)
			.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
		return `{${entries
			.map(([entryKey, entryValue]) => `${JSON.stringify(entryKey)}:${stableSerialize(entryValue)}`)
			.join(',')}}`;
	}
	return JSON.stringify(value);
}

export function computeBuildFingerprint(
	mergedConfig: BuildConfig,
	gondolinVersion: string,
	schemaVersion: string = BUILD_SCHEMA_VERSION,
): string {
	const stableConfig = stableSerialize(mergedConfig);
	const fingerprintInput = `${stableConfig}|${gondolinVersion}|${schemaVersion}`;
	return crypto.createHash('sha256').update(fingerprintInput).digest('hex').slice(0, 16);
}

function hasBuiltAssets(outputDirectoryPath: string): boolean {
	return (
		fs.existsSync(path.join(outputDirectoryPath, 'manifest.json')) &&
		fs.existsSync(path.join(outputDirectoryPath, 'rootfs.ext4')) &&
		fs.existsSync(path.join(outputDirectoryPath, 'initramfs.cpio.lz4')) &&
		fs.existsSync(path.join(outputDirectoryPath, 'vmlinuz-virt'))
	);
}

function readFingerprint(outputDirectoryPath: string): string | null {
	const fingerprintPath = path.join(outputDirectoryPath, '.build-fingerprint');
	if (!fs.existsSync(fingerprintPath)) {
		return null;
	}
	return fs.readFileSync(fingerprintPath, 'utf8').trim();
}

function writeFingerprint(outputDirectoryPath: string, fingerprint: string): void {
	fs.writeFileSync(path.join(outputDirectoryPath, '.build-fingerprint'), `${fingerprint}\n`, 'utf8');
}

function writeTempBuildConfig(config: BuildConfig): { path: string; cleanup: () => void } {
	const tempDirectoryPath = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-config-'));
	const tempConfigPath = path.join(tempDirectoryPath, 'build.config.json');
	fs.writeFileSync(tempConfigPath, `${JSON.stringify(config, null, '\t')}\n`, 'utf8');
	return {
		path: tempConfigPath,
		cleanup: () => {
			fs.rmSync(tempDirectoryPath, { recursive: true, force: true });
		},
	};
}

export async function buildGuestAssets(options: BuildAssetsOptions): Promise<BuildAssetsResult> {
	const agentVmRoot = getAgentVmRoot();
	const gondolinVersion = resolveGondolinVersion(agentVmRoot);
	const fingerprint = computeBuildFingerprint(options.buildConfig, gondolinVersion);

	if (
		!options.fullReset &&
		hasBuiltAssets(options.outputDir) &&
		readFingerprint(options.outputDir) === fingerprint
	) {
		return {
			imagePath: options.outputDir,
			fingerprint,
			built: false,
		};
	}

	if (options.fullReset && fs.existsSync(options.outputDir)) {
		fs.rmSync(options.outputDir, { recursive: true, force: true });
	}
	fs.mkdirSync(options.outputDir, { recursive: true });

	const gondolinBinPath = resolveGondolinBinPath(agentVmRoot);
	const tempBuildConfig = writeTempBuildConfig(options.buildConfig);
	try {
		await execa(
			gondolinBinPath,
			['build', '--config', tempBuildConfig.path, '--output', options.outputDir],
			{
				stdio: 'inherit',
			},
		);
	} finally {
		tempBuildConfig.cleanup();
	}

	writeFingerprint(options.outputDir, fingerprint);
	return {
		imagePath: options.outputDir,
		fingerprint,
		built: true,
	};
}

export function resolveWorkspaceImageDir(workspaceHash: string): string {
	return path.join(os.homedir(), '.cache', 'agent-vm', 'images', workspaceHash);
}

export function resolveVolumeCacheDir(): string {
	return path.join(os.homedir(), '.cache', 'agent-vm', 'volumes');
}

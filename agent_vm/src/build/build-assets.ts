import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';

import {
	resolveFingerprintBuildLockPath,
	resolveFingerprintImageDir,
	resolveVolumeCacheDir,
	writeWorkspaceImageRef,
} from '#src/build/image-cache.js';
import {
	buildOverlayImageAndResolveDigest,
	type OverlayBuildResult,
} from '#src/build/oci-overlay-builder.js';
import type { BuildConfig } from '#src/core/models/build-config.js';
import { withFileLockAsync } from '#src/core/platform/file-lock.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';

const BUILD_SCHEMA_VERSION = '2026-03-02-c-plus-v1';

export interface BuildAssetsOptions {
	readonly buildConfig: BuildConfig;
	readonly workspaceHash: string;
	readonly fullReset: boolean;
}

export interface BuildAssetsResult {
	readonly imagePath: string;
	readonly fingerprint: string;
	readonly built: boolean;
}

interface BuildAssetsDependencies {
	buildOverlayImageAndResolveDigest: typeof buildOverlayImageAndResolveDigest;
	buildAssetsIntoDir: (outputDir: string, config: BuildConfig) => Promise<void>;
}

const DEFAULT_DEPENDENCIES: BuildAssetsDependencies = {
	buildOverlayImageAndResolveDigest,
	buildAssetsIntoDir: async (outputDir: string, config: BuildConfig): Promise<void> => {
		await buildAssetsIntoDir(outputDir, config);
	},
};

export function resolveGondolinBinPath(agentVmRoot: string): string {
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

function isGondolinGuestDirectory(candidatePath: string): boolean {
	return fs.existsSync(path.join(candidatePath, 'build.zig'));
}

function resolveKnownGuestDirectoryCandidates(agentVmRoot: string): readonly string[] {
	return [
		...(process.env.GONDOLIN_GUEST_SRC ? [process.env.GONDOLIN_GUEST_SRC] : []),
		path.join(agentVmRoot, 'vendor', 'gondolin', 'guest'),
		path.resolve(agentVmRoot, '..', 'gondolin', 'guest'),
		path.resolve(agentVmRoot, '..', '..', 'gondolin', 'guest'),
		path.join(os.homedir(), '.cache', 'agent-vm', 'gondolin-source', 'guest'),
	];
}

async function ensureGondolinGuestDirectory(agentVmRoot: string): Promise<string> {
	for (const candidatePath of resolveKnownGuestDirectoryCandidates(agentVmRoot)) {
		if (isGondolinGuestDirectory(candidatePath)) {
			return candidatePath;
		}
	}

	const checkoutPath = path.join(os.homedir(), '.cache', 'agent-vm', 'gondolin-source');
	const guestPath = path.join(checkoutPath, 'guest');
	if (isGondolinGuestDirectory(guestPath)) {
		return guestPath;
	}

	if (fs.existsSync(checkoutPath)) {
		fs.rmSync(checkoutPath, { recursive: true, force: true });
	}
	fs.mkdirSync(path.dirname(checkoutPath), { recursive: true });

	await execa('git', ['clone', '--depth', '1', 'https://github.com/earendil-works/gondolin.git', checkoutPath], {
		stdio: 'inherit',
	});

	if (!isGondolinGuestDirectory(guestPath)) {
		throw new Error(
			`Failed to prepare Gondolin guest source at ${guestPath}. Expected to find build.zig after cloning.`,
		);
	}
	return guestPath;
}

function resolveBuildPathEnvironment(currentEnvironment: NodeJS.ProcessEnv): string {
	const pathSegments = (currentEnvironment.PATH ?? '')
		.split(path.delimiter)
		.filter((segment) => segment.length > 0);
	const toolPathSegments = [
		'/opt/homebrew/opt/e2fsprogs/sbin',
		'/opt/homebrew/opt/e2fsprogs/bin',
		'/usr/local/opt/e2fsprogs/sbin',
		'/usr/local/opt/e2fsprogs/bin',
	].filter((segment) => fs.existsSync(segment));

	const mergedPathSegments = [...toolPathSegments, ...pathSegments];
	const dedupedPathSegments = [...new Set(mergedPathSegments)];
	return dedupedPathSegments.join(path.delimiter);
}

function hasCommandInPath(commandName: string, pathValue: string): boolean {
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

async function ensureHostBuildPrerequisites(agentVmRoot: string): Promise<string> {
	let resolvedPath = resolveBuildPathEnvironment(process.env);
	if (hasCommandInPath('mke2fs', resolvedPath)) {
		return resolvedPath;
	}

	const brewfilePath = path.join(agentVmRoot, 'Brewfile');
	if (!fs.existsSync(brewfilePath)) {
		throw new Error(`Missing required host tool 'mke2fs' and no Brewfile found at ${brewfilePath}.`);
	}

	await execa('brew', ['bundle', '--file', brewfilePath], { stdio: 'inherit' });
	resolvedPath = resolveBuildPathEnvironment(process.env);
	if (!hasCommandInPath('mke2fs', resolvedPath)) {
		throw new Error(
			"Required host tool 'mke2fs' is still unavailable after brew bundle. Ensure e2fsprogs is installed and accessible.",
		);
	}
	return resolvedPath;
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
	mergedConfig: unknown,
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

function writeFingerprint(outputDirectoryPath: string, fingerprint: string): void {
	fs.writeFileSync(path.join(outputDirectoryPath, '.build-fingerprint'), `${fingerprint}\n`, 'utf8');
}

function toGondolinBuildConfig(config: BuildConfig): Record<string, unknown> {
	const { ociOverlay: _unusedOverlay, ...gondolinConfig } = config;
	return gondolinConfig;
}

function writeTempBuildConfig(config: BuildConfig): { path: string; cleanup: () => void } {
	const tempDirectoryPath = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-config-'));
	const tempConfigPath = path.join(tempDirectoryPath, 'build.config.json');
	fs.writeFileSync(
		tempConfigPath,
		`${JSON.stringify(toGondolinBuildConfig(config), null, '\t')}\n`,
		'utf8',
	);
	return {
		path: tempConfigPath,
		cleanup: () => {
			fs.rmSync(tempDirectoryPath, { recursive: true, force: true });
		},
	};
}

async function resolveEffectiveBuildConfig(
	baseConfig: BuildConfig,
	fingerprintSeed: string,
	dependencies: BuildAssetsDependencies,
): Promise<{ effectiveConfig: BuildConfig; overlay: OverlayBuildResult | null }> {
	if (!baseConfig.ociOverlay) {
		return { effectiveConfig: baseConfig, overlay: null };
	}

	const overlay = await dependencies.buildOverlayImageAndResolveDigest({
		overlayConfig: baseConfig.ociOverlay,
		fingerprintSeed,
	});
	const effectiveConfig: BuildConfig = {
		...baseConfig,
		oci: {
			...baseConfig.oci,
			image: overlay.imageRef,
		},
	};
	return { effectiveConfig, overlay };
}

async function buildAssetsIntoDir(
	outputDir: string,
	config: BuildConfig,
): Promise<void> {
	const agentVmRoot = getAgentVmRoot();
	const gondolinBinPath = resolveGondolinBinPath(agentVmRoot);
	const gondolinGuestDirectoryPath = await ensureGondolinGuestDirectory(agentVmRoot);
	const buildPathEnvironment = await ensureHostBuildPrerequisites(agentVmRoot);
	const tempBuildConfig = writeTempBuildConfig(config);
	try {
		await execa(gondolinBinPath, ['build', '--config', tempBuildConfig.path, '--output', outputDir], {
			stdio: 'inherit',
			env: {
				...process.env,
				PATH: buildPathEnvironment,
				GONDOLIN_GUEST_SRC: gondolinGuestDirectoryPath,
			},
		});
	} finally {
		tempBuildConfig.cleanup();
	}
}

export async function buildGuestAssets(
	options: BuildAssetsOptions,
	dependencies: BuildAssetsDependencies = DEFAULT_DEPENDENCIES,
): Promise<BuildAssetsResult> {
	const agentVmRoot = getAgentVmRoot();
	const gondolinVersion = resolveGondolinVersion(agentVmRoot);

	const overlayFingerprintSeed = computeBuildFingerprint(
		options.buildConfig,
		gondolinVersion,
		`${BUILD_SCHEMA_VERSION}-overlay`,
	);
	const effectiveBuild = await resolveEffectiveBuildConfig(
		options.buildConfig,
		overlayFingerprintSeed,
		dependencies,
	);

	const fingerprintPayload = {
		...toGondolinBuildConfig(effectiveBuild.effectiveConfig),
		overlayDigest: effectiveBuild.overlay?.digest ?? null,
	};
	const finalFingerprint = computeBuildFingerprint(fingerprintPayload, gondolinVersion);
	const outputDir = resolveFingerprintImageDir(finalFingerprint);

	const lockPath = resolveFingerprintBuildLockPath(finalFingerprint);
	let built = false;
	await withFileLockAsync(lockPath, async () => {
		const shouldRebuild = options.fullReset || !hasBuiltAssets(outputDir);
		if (!shouldRebuild) {
			return;
		}

		if (fs.existsSync(outputDir)) {
			fs.rmSync(outputDir, { recursive: true, force: true });
		}
		fs.mkdirSync(outputDir, { recursive: true });

		await dependencies.buildAssetsIntoDir(outputDir, effectiveBuild.effectiveConfig);
		writeFingerprint(outputDir, finalFingerprint);
		built = true;
	});

	writeWorkspaceImageRef(options.workspaceHash, {
		fingerprint: finalFingerprint,
		imagePath: outputDir,
	});

	return {
		imagePath: outputDir,
		fingerprint: finalFingerprint,
		built,
	};
}

export { resolveVolumeCacheDir };

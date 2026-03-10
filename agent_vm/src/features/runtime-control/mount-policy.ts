import fs from 'node:fs';
import path from 'node:path';

import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';

const AUTH_GUEST_PATH_PREFIXES = [
	'/home/agent/.aws',
	'/home/agent/.claude',
	'/home/agent/.codex',
	'/home/agent/.gemini',
] as const;

export interface WritableMountPolicy {
	readonly allowAuthWrite: boolean;
	readonly writableAllowedGuestPrefixes: readonly string[];
}

function resolveAuthHostPrefixes(hostHome: string): readonly string[] {
	return [
		path.join(hostHome, '.aws'),
		path.join(hostHome, '.claude'),
		path.join(hostHome, '.codex'),
		path.join(hostHome, '.gemini'),
	];
}

export function resolveGuestMountPath(guestPath: string, workDir: string): string {
	if (path.isAbsolute(guestPath)) {
		return path.resolve(guestPath);
	}
	return path.resolve(workDir, guestPath);
}

function isPathWithinPrefix(candidatePath: string, prefixPath: string): boolean {
	const relativePath = path.relative(prefixPath, candidatePath);
	return (
		relativePath === '' ||
		(!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
	);
}

function normalizeHostPath(hostPath: string): string {
	const resolvedPath = path.resolve(hostPath);
	try {
		return fs.realpathSync(resolvedPath);
	} catch {
		return resolvedPath;
	}
}

function pathsOverlap(candidatePath: string, protectedPath: string): boolean {
	return (
		isPathWithinPrefix(candidatePath, protectedPath) ||
		isPathWithinPrefix(protectedPath, candidatePath)
	);
}

export function validateWritableMount(
	guestPath: string,
	policy: WritableMountPolicy,
	options: { workDir: string },
): void {
	const resolvedGuestPath = resolveGuestMountPath(guestPath, options.workDir);
	const resolvedAllowedPrefixes = policy.writableAllowedGuestPrefixes.map((guestPrefix) =>
		resolveGuestMountPath(guestPrefix, options.workDir),
	);

	const isWithinAllowedPrefix = resolvedAllowedPrefixes.some((guestPrefix) =>
		isPathWithinPrefix(resolvedGuestPath, guestPrefix),
	);
	if (!isWithinAllowedPrefix) {
		throw new Error(
			`Writable mount guest path '${resolvedGuestPath}' is outside writable allowlist [${resolvedAllowedPrefixes.join(', ')}].`,
		);
	}

	if (!policy.allowAuthWrite) {
		const hasAuthPathWrite = AUTH_GUEST_PATH_PREFIXES.some((authPrefix) =>
			isPathWithinPrefix(resolvedGuestPath, authPrefix),
		);
		if (hasAuthPathWrite) {
			throw new Error(
				`Writable mount guest path '${resolvedGuestPath}' targets an auth mount path. Set mountControls.allowAuthWrite=true to permit auth writes.`,
			);
		}
	}
}

export function validateRuntimeMountPolicy(
	config: Pick<VmRuntimeConfig, 'extraMounts' | 'mountControls'>,
	options: { workDir: string; hostHome: string },
): void {
	for (const [writableMountKey, writableHostPath] of Object.entries(config.extraMounts)) {
		validateWritableMount(writableMountKey, config.mountControls, options);
		if (!config.mountControls.allowAuthWrite && path.isAbsolute(writableHostPath)) {
			const resolvedWritableHostPath = normalizeHostPath(writableHostPath);
			const targetsAuthHostPath = resolveAuthHostPrefixes(options.hostHome)
				.map((authHostPrefix) => normalizeHostPath(authHostPrefix))
				.some((authHostPrefix) => pathsOverlap(resolvedWritableHostPath, authHostPrefix));
			if (targetsAuthHostPath) {
				throw new Error(
					`Writable host path '${resolvedWritableHostPath}' targets an auth host directory. Set mountControls.allowAuthWrite=true to permit auth writes.`,
				);
			}
		}
	}
}

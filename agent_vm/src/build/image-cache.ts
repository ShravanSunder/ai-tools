import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface WorkspaceImageReference {
	readonly fingerprint: string;
	readonly imagePath: string;
	readonly updatedAtEpochMs: number;
}

function resolveAgentVmCacheRootDir(): string {
	return path.join(os.homedir(), '.cache', 'agent-vm');
}

export function resolveImageCacheRootDir(): string {
	return path.join(resolveAgentVmCacheRootDir(), 'images');
}

export function resolveFingerprintImageCacheDir(): string {
	return path.join(resolveImageCacheRootDir(), 'by-fingerprint');
}

export function resolveFingerprintImageDir(fingerprint: string): string {
	return path.join(resolveFingerprintImageCacheDir(), fingerprint);
}

export function resolveWorkspaceImageRefDir(): string {
	return path.join(resolveImageCacheRootDir(), 'workspaces');
}

export function resolveWorkspaceImageRefPath(workspaceHash: string): string {
	return path.join(resolveWorkspaceImageRefDir(), `${workspaceHash}.json`);
}

export function resolveFingerprintBuildLockPath(fingerprint: string): string {
	return path.join(resolveImageCacheRootDir(), 'locks', `${fingerprint}.lock`);
}

export function readWorkspaceImageRef(
	workspaceHash: string,
): WorkspaceImageReference | null {
	const referencePath = resolveWorkspaceImageRefPath(workspaceHash);
	if (!fs.existsSync(referencePath)) {
		return null;
	}

	const parsed = JSON.parse(fs.readFileSync(referencePath, 'utf8')) as unknown;
	if (
		typeof parsed !== 'object' ||
		parsed === null ||
		!('fingerprint' in parsed) ||
		!('imagePath' in parsed) ||
		!('updatedAtEpochMs' in parsed)
	) {
		throw new Error(`Invalid workspace image reference payload: ${referencePath}`);
	}

	const fingerprint = (parsed as { fingerprint?: unknown }).fingerprint;
	const imagePath = (parsed as { imagePath?: unknown }).imagePath;
	const updatedAtEpochMs = (parsed as { updatedAtEpochMs?: unknown }).updatedAtEpochMs;
	if (
		typeof fingerprint !== 'string' ||
		fingerprint.length === 0 ||
		typeof imagePath !== 'string' ||
		imagePath.length === 0 ||
		typeof updatedAtEpochMs !== 'number' ||
		!Number.isFinite(updatedAtEpochMs)
	) {
		throw new Error(`Invalid workspace image reference payload: ${referencePath}`);
	}

	return {
		fingerprint,
		imagePath,
		updatedAtEpochMs,
	};
}

export function writeWorkspaceImageRef(
	workspaceHash: string,
	reference: Omit<WorkspaceImageReference, 'updatedAtEpochMs'>,
): void {
	const referenceDirectory = resolveWorkspaceImageRefDir();
	fs.mkdirSync(referenceDirectory, { recursive: true });
	const referencePath = resolveWorkspaceImageRefPath(workspaceHash);
	const payload: WorkspaceImageReference = {
		...reference,
		updatedAtEpochMs: Date.now(),
	};
	fs.writeFileSync(referencePath, `${JSON.stringify(payload, null, '\t')}\n`, 'utf8');
}

export function resolveVolumeCacheDir(): string {
	return path.join(resolveAgentVmCacheRootDir(), 'volumes');
}


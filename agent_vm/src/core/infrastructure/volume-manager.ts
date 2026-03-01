import fs from 'node:fs';
import path from 'node:path';

export interface VolumeConfigEntry {
	readonly guestPath: string;
}

export interface ResolvedVolume {
	readonly hostDir: string;
	readonly guestPath: string;
}

export function ensureVolumeDir(
	cacheBase: string,
	workspaceHash: string,
	volumeName: string,
): string {
	const volumeDir = path.join(cacheBase, workspaceHash, volumeName);
	fs.mkdirSync(volumeDir, { recursive: true });
	return volumeDir;
}

export function resolveVolumeDirs(
	cacheBase: string,
	workspaceHash: string,
	volumes: Readonly<Record<string, VolumeConfigEntry>>,
): Record<string, ResolvedVolume> {
	const resolvedVolumes: Record<string, ResolvedVolume> = {};
	for (const [volumeName, volumeConfig] of Object.entries(volumes)) {
		resolvedVolumes[volumeName] = {
			hostDir: ensureVolumeDir(cacheBase, workspaceHash, volumeName),
			guestPath: volumeConfig.guestPath,
		};
	}
	return resolvedVolumes;
}

export function wipeVolumeDirs(cacheBase: string, workspaceHash: string): void {
	const workspaceVolumeRoot = path.join(cacheBase, workspaceHash);
	fs.rmSync(workspaceVolumeRoot, { recursive: true, force: true });
}

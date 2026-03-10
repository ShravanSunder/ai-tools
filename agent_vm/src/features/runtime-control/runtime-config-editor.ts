import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { VmRuntimeConfigInput } from '#src/core/models/vm-runtime-config.js';
import { parseVmRuntimeConfigInput } from '#src/core/models/vm-runtime-config.js';
import { withFileLockAsync } from '#src/core/platform/file-lock.js';
import { interpolateConfigValue } from '#src/features/runtime-control/config-interpolation.js';
import { validateRuntimeMountPolicy } from '#src/features/runtime-control/mount-policy.js';
import { loadVmRuntimeConfig } from '#src/features/runtime-control/vm-runtime-loader.js';

const DEFAULT_RUNTIME_SCHEMA_PATH = '../../agent_vm/schemas/vm-runtime.schema.json';

export type MountConfigTier = 'repo' | 'local';
export type MountMode = 'ro' | 'rw';
export type MountListSource = MountConfigTier | 'merged';

export interface MountEntry {
	readonly mode: MountMode;
	readonly guestPath: string;
	readonly hostPath: string;
}

export interface UpsertMountEntryArgs {
	readonly workDir: string;
	readonly tier: MountConfigTier;
	readonly mode: MountMode;
	readonly guestPath: string;
	readonly hostPath: string;
}

export interface RemoveMountEntryArgs {
	readonly workDir: string;
	readonly tier: MountConfigTier;
	readonly guestPath: string;
}

interface RuntimeConfigLayerFile {
	readonly schemaPath: string | null;
	readonly values: VmRuntimeConfigInput;
}

function resolveRuntimeConfigPath(workDir: string, tier: MountConfigTier): string {
	return path.join(workDir, '.agent_vm', `vm-runtime.${tier}.json`);
}

function resolveRuntimeConfigEditLockPath(workDir: string): string {
	return path.join(workDir, '.agent_vm', 'vm-runtime.edit.lock');
}

function parseJsonObject(filePath: string): Record<string, unknown> {
	const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new Error(`Runtime config must be a JSON object: ${filePath}`);
	}
	return parsed as Record<string, unknown>;
}

function readRuntimeConfigLayer(configPath: string): RuntimeConfigLayerFile {
	if (!fs.existsSync(configPath)) {
		return { schemaPath: DEFAULT_RUNTIME_SCHEMA_PATH, values: {} };
	}

	const rawObject = parseJsonObject(configPath);
	const schemaCandidate = rawObject['$schema'];
	const schemaPath = typeof schemaCandidate === 'string' && schemaCandidate.length > 0 ? schemaCandidate : null;
	const values = parseVmRuntimeConfigInput(rawObject);
	return { schemaPath, values };
}

function writeRuntimeConfigLayer(configPath: string, layer: RuntimeConfigLayerFile): void {
	fs.mkdirSync(path.dirname(configPath), { recursive: true });
	const payload: Record<string, unknown> = layer.schemaPath
		? { $schema: layer.schemaPath, ...layer.values }
		: { ...layer.values };
	const tempPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
	fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, '\t')}\n`, 'utf8');
	fs.renameSync(tempPath, configPath);
}

function toSortedMountEntries(
	readonlyMounts: Record<string, string> | undefined,
	extraMounts: Record<string, string> | undefined,
): MountEntry[] {
	const entries: MountEntry[] = [];
	for (const [guestPath, hostPath] of Object.entries(readonlyMounts ?? {})) {
		entries.push({ mode: 'ro', guestPath, hostPath });
	}
	for (const [guestPath, hostPath] of Object.entries(extraMounts ?? {})) {
		entries.push({ mode: 'rw', guestPath, hostPath });
	}
	return entries.sort((left, right) => {
		const modeOrder = left.mode.localeCompare(right.mode);
		if (modeOrder !== 0) {
			return modeOrder;
		}
		return left.guestPath.localeCompare(right.guestPath);
	});
}

function assertWritableMountAllowed(workDir: string, guestPath: string, hostPath: string): void {
	const resolvedConfig = loadVmRuntimeConfig(workDir);
	const interpolationContext = {
		WORKSPACE: path.resolve(workDir),
		HOST_HOME: os.homedir(),
	};
	const interpolatedGuestPath = interpolateConfigValue(guestPath, interpolationContext);
	const interpolatedHostPath = interpolateConfigValue(hostPath, interpolationContext);
	validateRuntimeMountPolicy(
		{
			extraMounts: {
				...resolvedConfig.extraMounts,
				[interpolatedGuestPath]: interpolatedHostPath,
			},
			mountControls: resolvedConfig.mountControls,
		},
		{
			workDir: path.resolve(workDir),
			hostHome: os.homedir(),
		},
	);
}

export async function upsertMountEntry(args: UpsertMountEntryArgs): Promise<void> {
	const workDir = path.resolve(args.workDir);
	const configPath = resolveRuntimeConfigPath(workDir, args.tier);
	const lockPath = resolveRuntimeConfigEditLockPath(workDir);
	await withFileLockAsync(lockPath, async () => {
		if (args.mode === 'rw') {
			assertWritableMountAllowed(workDir, args.guestPath, args.hostPath);
		}
		const current = readRuntimeConfigLayer(configPath);
		const nextReadonlyMounts = { ...(current.values.readonlyMounts ?? {}) };
		const nextExtraMounts = { ...(current.values.extraMounts ?? {}) };

		if (args.mode === 'ro') {
			nextReadonlyMounts[args.guestPath] = args.hostPath;
			delete nextExtraMounts[args.guestPath];
		} else {
			nextExtraMounts[args.guestPath] = args.hostPath;
			delete nextReadonlyMounts[args.guestPath];
		}

		const nextValues: VmRuntimeConfigInput = {
			...current.values,
			readonlyMounts: nextReadonlyMounts,
			extraMounts: nextExtraMounts,
		};
		writeRuntimeConfigLayer(configPath, {
			schemaPath: current.schemaPath ?? DEFAULT_RUNTIME_SCHEMA_PATH,
			values: nextValues,
		});
	});
}

export async function removeMountEntry(args: RemoveMountEntryArgs): Promise<void> {
	const workDir = path.resolve(args.workDir);
	const configPath = resolveRuntimeConfigPath(workDir, args.tier);
	const lockPath = resolveRuntimeConfigEditLockPath(workDir);
	await withFileLockAsync(lockPath, async () => {
		const current = readRuntimeConfigLayer(configPath);
		const nextReadonlyMounts = { ...(current.values.readonlyMounts ?? {}) };
		const nextExtraMounts = { ...(current.values.extraMounts ?? {}) };
		delete nextReadonlyMounts[args.guestPath];
		delete nextExtraMounts[args.guestPath];

		const nextValues: VmRuntimeConfigInput = {
			...current.values,
			readonlyMounts: nextReadonlyMounts,
			extraMounts: nextExtraMounts,
		};
		writeRuntimeConfigLayer(configPath, {
			schemaPath: current.schemaPath ?? DEFAULT_RUNTIME_SCHEMA_PATH,
			values: nextValues,
		});
	});
}

export function listMountEntries(workDir: string, source: MountListSource): MountEntry[] {
	const normalizedWorkDir = path.resolve(workDir);
	if (source === 'merged') {
		const mergedConfig = loadVmRuntimeConfig(normalizedWorkDir);
		return toSortedMountEntries(mergedConfig.readonlyMounts, mergedConfig.extraMounts);
	}

	const layer = readRuntimeConfigLayer(resolveRuntimeConfigPath(normalizedWorkDir, source));
	return toSortedMountEntries(layer.values.readonlyMounts, layer.values.extraMounts);
}

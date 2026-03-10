import fs from 'node:fs';
import path from 'node:path';

import { withFileLockAsync } from '#src/core/platform/file-lock.js';
import { normalizeHostname } from '#src/core/platform/hostname.js';
import { getAgentVmRoot, getGeneratedStateDir } from '#src/core/platform/paths.js';
import {
	compilePolicy,
	loadPolicySources,
	readDomainLines,
} from '#src/features/runtime-control/policy-manager.js';

export type FirewallConfigTier = 'repo' | 'local';
export type FirewallListSource = 'base' | 'repo' | 'local' | 'toggles' | 'merged';

export interface AddPolicyDomainArgs {
	readonly workDir: string;
	readonly tier: FirewallConfigTier;
	readonly domain: string;
}

export interface RemovePolicyDomainArgs {
	readonly workDir: string;
	readonly tier: FirewallConfigTier;
	readonly domain: string;
}

function dedupePolicyEntries(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const value of values) {
		const normalized = normalizeHostname(value);
		if (normalized.length === 0 || normalized.startsWith('#')) {
			continue;
		}
		if (!seen.has(normalized)) {
			seen.add(normalized);
			result.push(normalized);
		}
	}
	return result;
}

function resolvePolicyConfigPath(workDir: string, tier: FirewallConfigTier): string {
	return path.join(workDir, '.agent_vm', `policy-allowlist-extra.${tier}.txt`);
}

function resolvePolicyConfigLockPath(workDir: string): string {
	return path.join(workDir, '.agent_vm', 'policy-config.edit.lock');
}

function writePolicyEntries(filePath: string, entries: readonly string[]): void {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
	const body = entries.length > 0 ? `${entries.join('\n')}\n` : '';
	fs.writeFileSync(tempPath, body, 'utf8');
	fs.renameSync(tempPath, filePath);
}

export async function addPolicyDomain(args: AddPolicyDomainArgs): Promise<void> {
	const workDir = path.resolve(args.workDir);
	const configPath = resolvePolicyConfigPath(workDir, args.tier);
	await withFileLockAsync(resolvePolicyConfigLockPath(workDir), async () => {
		const existing = readDomainLines(configPath);
		const nextEntries = dedupePolicyEntries([...existing, args.domain]);
		writePolicyEntries(configPath, nextEntries);
	});
}

export async function removePolicyDomain(args: RemovePolicyDomainArgs): Promise<void> {
	const workDir = path.resolve(args.workDir);
	const configPath = resolvePolicyConfigPath(workDir, args.tier);
	await withFileLockAsync(resolvePolicyConfigLockPath(workDir), async () => {
		const domainToRemove = normalizeHostname(args.domain);
		const nextEntries = readDomainLines(configPath).filter(
			(existingDomain) => normalizeHostname(existingDomain) !== domainToRemove,
		);
		writePolicyEntries(configPath, dedupePolicyEntries(nextEntries));
	});
}

export function listPolicyDomains(workDir: string, source: FirewallListSource): string[] {
	const normalizedWorkDir = path.resolve(workDir);
	const root = getAgentVmRoot();

	switch (source) {
		case 'base':
			return readDomainLines(path.join(root, 'config', 'policy-allowlist.base.txt'));
		case 'repo':
			return readDomainLines(resolvePolicyConfigPath(normalizedWorkDir, 'repo'));
		case 'local':
			return readDomainLines(resolvePolicyConfigPath(normalizedWorkDir, 'local'));
		case 'toggles':
			return readDomainLines(
				path.join(getGeneratedStateDir(normalizedWorkDir), 'policy-toggle.entries.txt'),
			);
		case 'merged': {
			const sources = loadPolicySources(normalizedWorkDir);
			return compilePolicy(sources);
		}
	}
}

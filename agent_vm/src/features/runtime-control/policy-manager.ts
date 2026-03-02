import fs from 'node:fs';
import path from 'node:path';

import { withFileLock } from '#src/core/platform/file-lock.js';
import { normalizeHostname } from '#src/core/platform/hostname.js';
import { getAgentVmRoot, getGeneratedStateDir } from '#src/core/platform/paths.js';

export interface CompilePolicyInput {
	base: readonly string[];
	repo: readonly string[];
	local: readonly string[];
	toggles: readonly string[];
}

export function dedupeStable(values: readonly string[]): string[] {
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

export function compilePolicy(input: CompilePolicyInput): string[] {
	return dedupeStable([...input.base, ...input.repo, ...input.local, ...input.toggles]);
}

export function readDomainLines(filePath: string): string[] {
	if (!fs.existsSync(filePath)) {
		return [];
	}

	return fs
		.readFileSync(filePath, 'utf8')
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith('#'));
}

export function loadPolicyPresetEntries(target: string): string[] {
	const root = getAgentVmRoot();
	const presetPath = path.join(root, 'policy-presets', `${target}.txt`);
	if (fs.existsSync(presetPath)) {
		return readDomainLines(presetPath);
	}
	return [target];
}

export interface PolicyState {
	entries: string[];
}

export function readPolicyState(workDir: string): PolicyState {
	const generatedDir = getGeneratedStateDir(workDir);
	const togglePath = path.join(generatedDir, 'policy-toggle.entries.txt');
	return {
		entries: readDomainLines(togglePath),
	};
}

export function writePolicyState(workDir: string, state: PolicyState): void {
	const generatedDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedDir, { recursive: true });
	const togglePath = path.join(generatedDir, 'policy-toggle.entries.txt');
	fs.writeFileSync(togglePath, `${state.entries.join('\n')}\n`, 'utf8');
}

export function applyPolicyMutation(
	existingEntries: readonly string[],
	action: 'allow' | 'block' | 'clear',
	target?: string,
): string[] {
	if (action === 'clear') {
		return [];
	}

	if (!target) {
		return [...existingEntries];
	}

	const targetEntries = loadPolicyPresetEntries(target);
	const existing = dedupeStable(existingEntries);

	if (action === 'allow') {
		return dedupeStable([...existing, ...targetEntries]);
	}

	const removeSet = new Set(targetEntries.map((entry) => normalizeHostname(entry)));
	return existing.filter((entry) => !removeSet.has(normalizeHostname(entry)));
}

export interface LoadedPolicySources {
	base: string[];
	repo: string[];
	local: string[];
	toggles: string[];
}

export function loadPolicySources(workDir: string): LoadedPolicySources {
	const root = getAgentVmRoot();
	const base = readDomainLines(path.join(root, 'config', 'policy-allowlist.base.txt'));
	const repo = readDomainLines(path.join(workDir, '.agent_vm', 'policy-allowlist-extra.repo.txt'));
	const local = readDomainLines(
		path.join(workDir, '.agent_vm', 'policy-allowlist-extra.local.txt'),
	);
	const toggles = readPolicyState(workDir).entries;

	return { base, repo, local, toggles };
}

export function compileAndPersistPolicy(workDir: string): string[] {
	const sources = loadPolicySources(workDir);
	const compiled = compilePolicy(sources);
	const generatedDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedDir, { recursive: true });
	const compiledPath = path.join(generatedDir, 'policy-allowlist.compiled.txt');
	fs.writeFileSync(compiledPath, `${compiled.join('\n')}\n`, 'utf8');
	return compiled;
}

export interface PolicyMutationResult {
	entries: string[];
	compiled: string[];
}

export function mutateAndCompilePolicy(
	workDir: string,
	action: 'allow' | 'block' | 'clear',
	target?: string,
): PolicyMutationResult {
	const generatedDir = getGeneratedStateDir(workDir);
	const lockPath = path.join(generatedDir, 'policy-toggle.lock');

	return withFileLock(lockPath, () => {
		const existingEntries = readPolicyState(workDir).entries;
		const nextEntries = applyPolicyMutation(existingEntries, action, target);
		writePolicyState(workDir, { entries: nextEntries });
		const compiled = compileAndPersistPolicy(workDir);
		return { entries: nextEntries, compiled };
	});
}

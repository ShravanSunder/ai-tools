import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const EXCLUDED_DIRECTORY_NAMES = new Set(['node_modules', '.git']);

function toPosixPath(value: string): string {
	return value.split(path.sep).join('/');
}

function patternToRegex(pattern: string): RegExp {
	const escapedPattern = pattern
		.replaceAll(/[.+^${}()|[\]\\]/gu, '\\$&')
		.replaceAll('**', '___DOUBLE_STAR___')
		.replaceAll('*', '[^/]+')
		.replaceAll('___DOUBLE_STAR___', '.*');
	return new RegExp(`^${escapedPattern}$`, 'u');
}

function readPnpmWorkspacePatterns(workDir: string): string[] {
	const workspaceFile = path.join(workDir, 'pnpm-workspace.yaml');
	if (!fs.existsSync(workspaceFile)) {
		return [];
	}

	const lines = fs.readFileSync(workspaceFile, 'utf8').split(/\r?\n/u);
	const patterns: string[] = [];
	let insidePackagesSection = false;
	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.length === 0 || trimmed.startsWith('#')) {
			continue;
		}
		if (trimmed === 'packages:') {
			insidePackagesSection = true;
			continue;
		}
		if (!insidePackagesSection) {
			continue;
		}
		if (!trimmed.startsWith('- ')) {
			if (!line.startsWith(' ') && !line.startsWith('\t')) {
				insidePackagesSection = false;
			}
			continue;
		}

		const pattern = trimmed.slice(2).replaceAll(/["']/gu, '').trim();
		if (pattern.length > 0 && !pattern.startsWith('!')) {
			patterns.push(pattern);
		}
	}
	return patterns;
}

function readPackageJsonWorkspacePatterns(workDir: string): string[] {
	const packageJsonPath = path.join(workDir, 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		return [];
	}

	try {
		const parsed = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as unknown;
		if (typeof parsed !== 'object' || parsed === null) {
			return [];
		}
		const workspaces = (parsed as { workspaces?: unknown }).workspaces;
		if (Array.isArray(workspaces)) {
			return workspaces.filter((entry): entry is string => typeof entry === 'string');
		}
		if (
			typeof workspaces === 'object' &&
			workspaces !== null &&
			Array.isArray((workspaces as { packages?: unknown }).packages)
		) {
			return (workspaces as { packages: unknown[] }).packages.filter(
				(entry): entry is string => typeof entry === 'string',
			);
		}
		return [];
	} catch {
		return [];
	}
}

function walkDirectories(rootDir: string): string[] {
	const discoveredDirectories: string[] = [];
	const queue = [rootDir];
	while (queue.length > 0) {
		const currentDirectory = queue.shift();
		if (!currentDirectory) {
			continue;
		}
		discoveredDirectories.push(currentDirectory);

		for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
			if (!entry.isDirectory()) {
				continue;
			}
			if (entry.name.startsWith('.') && entry.name !== '.agent_vm') {
				continue;
			}
			if (EXCLUDED_DIRECTORY_NAMES.has(entry.name)) {
				continue;
			}
			queue.push(path.join(currentDirectory, entry.name));
		}
	}
	return discoveredDirectories;
}

function matchWorkspaceDirectories(workDir: string, patterns: readonly string[]): string[] {
	if (patterns.length === 0) {
		return [];
	}

	const regexMatchers = patterns.map((pattern) => patternToRegex(toPosixPath(pattern)));
	const discoveredDirectories = walkDirectories(workDir);
	const matchedDirectories: string[] = [];
	for (const directoryPath of discoveredDirectories) {
		if (!fs.existsSync(path.join(directoryPath, 'package.json'))) {
			continue;
		}
		const relativeDirectoryPath = toPosixPath(path.relative(workDir, directoryPath));
		if (relativeDirectoryPath.length === 0) {
			continue;
		}
		if (regexMatchers.some((regexMatcher) => regexMatcher.test(relativeDirectoryPath))) {
			matchedDirectories.push(directoryPath);
		}
	}
	return matchedDirectories;
}

export function discoverNodeModulesPaths(workDir: string): string[] {
	const discoveredPaths = new Set<string>();
	discoveredPaths.add(path.join(workDir, 'node_modules'));

	const patterns = [
		...readPnpmWorkspacePatterns(workDir),
		...readPackageJsonWorkspacePatterns(workDir),
	];
	for (const workspaceDirectory of matchWorkspaceDirectories(workDir, patterns)) {
		discoveredPaths.add(path.join(workspaceDirectory, 'node_modules'));
	}

	return [...discoveredPaths];
}

export function volumeNameForNodeModulesPath(nodeModulesPath: string): string {
	const normalized = path.resolve(nodeModulesPath);
	const hashSeed = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
	return `nm-${hashSeed}`;
}

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	discoverNodeModulesPaths,
	volumeNameForNodeModulesPath,
} from '#src/features/runtime-control/monorepo-discovery.js';

function writePackageJson(directoryPath: string): void {
	fs.mkdirSync(directoryPath, { recursive: true });
	fs.writeFileSync(
		path.join(directoryPath, 'package.json'),
		JSON.stringify({ name: 'pkg' }),
		'utf8',
	);
}

describe('monorepo discovery', () => {
	it('always includes root node_modules path', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-monorepo-'));
		writePackageJson(workDir);
		const discovered = discoverNodeModulesPaths(workDir);
		expect(discovered).toContain(path.join(workDir, 'node_modules'));
	});

	it('discovers pnpm workspace package node_modules paths', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-monorepo-'));
		writePackageJson(workDir);
		writePackageJson(path.join(workDir, 'packages', 'api'));
		writePackageJson(path.join(workDir, 'packages', 'web'));
		fs.writeFileSync(
			path.join(workDir, 'pnpm-workspace.yaml'),
			'packages:\n  - "packages/*"\n',
			'utf8',
		);

		const discovered = discoverNodeModulesPaths(workDir);
		expect(discovered).toContain(path.join(workDir, 'packages', 'api', 'node_modules'));
		expect(discovered).toContain(path.join(workDir, 'packages', 'web', 'node_modules'));
	});

	it('discovers npm workspaces field (array)', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-monorepo-'));
		fs.writeFileSync(
			path.join(workDir, 'package.json'),
			JSON.stringify({ name: 'root', workspaces: ['apps/*'] }),
			'utf8',
		);
		writePackageJson(path.join(workDir, 'apps', 'dashboard'));

		const discovered = discoverNodeModulesPaths(workDir);
		expect(discovered).toContain(path.join(workDir, 'apps', 'dashboard', 'node_modules'));
	});

	it('creates deterministic volume names for node_modules paths', () => {
		const volumeA = volumeNameForNodeModulesPath('/tmp/repo/node_modules');
		const volumeB = volumeNameForNodeModulesPath('/tmp/repo/node_modules');
		const volumeC = volumeNameForNodeModulesPath('/tmp/repo/packages/api/node_modules');

		expect(volumeA).toBe(volumeB);
		expect(volumeA).not.toBe(volumeC);
		expect(volumeA.startsWith('nm-')).toBe(true);
	});
});

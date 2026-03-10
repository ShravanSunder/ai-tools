import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const pathsToCleanup: string[] = [];
const originalPath = process.env.PATH;

afterEach(() => {
	process.env.PATH = originalPath;
	vi.restoreAllMocks();
	vi.resetModules();
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

describe('loadBuildConfig base-layer overlay path semantics', () => {
	it('resolves base-layer dockerfile from agent_vm root while project contextDir resolves from workspace', async () => {
		const fakeAgentVmRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-root-'));
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-bin-'));
		pathsToCleanup.push(fakeAgentVmRoot, workDir, fakeBinDir);

		const baseConfigDir = path.join(fakeAgentVmRoot, 'config');
		const baseParityDir = path.join(baseConfigDir, 'parity');
		const workConfigDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(baseParityDir, { recursive: true });
		fs.mkdirSync(workConfigDir, { recursive: true });
		fs.writeFileSync(path.join(baseParityDir, 'agent-vm-parity.overlay.dockerfile'), 'FROM scratch\n', 'utf8');

		fs.writeFileSync(path.join(fakeBinDir, 'docker'), '#!/bin/sh\nexit 0\n', 'utf8');
		fs.chmodSync(path.join(fakeBinDir, 'docker'), 0o755);
		process.env.PATH = `${fakeBinDir}${path.delimiter}${originalPath ?? ''}`;

		fs.writeFileSync(
			path.join(baseConfigDir, 'build.base.json'),
			JSON.stringify(
				{
					arch: 'aarch64',
					distro: 'alpine',
					ociOverlay: {
						baseImage: 'agent-sidecar-base:node-py',
						dockerfile: 'config/parity/agent-vm-parity.overlay.dockerfile',
						contextDir: '.',
					},
				},
				null,
				'\t',
			),
			'utf8',
		);
		fs.writeFileSync(
			path.join(workConfigDir, 'build.project.json'),
			JSON.stringify({
				ociOverlay: {
					contextDir: '.',
				},
			}),
			'utf8',
		);

		vi.resetModules();
		const pathsModule = await import('#src/core/platform/paths.js');
		vi.spyOn(pathsModule, 'getAgentVmRoot').mockReturnValue(fakeAgentVmRoot);

		try {
			const { loadBuildConfig } = await import(
				'#src/features/runtime-control/build-config-loader.js'
			);
			const config = loadBuildConfig(workDir);

			expect(config.ociOverlay?.dockerfile).toBe(
				fs.realpathSync(
					path.join(fakeAgentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
				),
			);
			expect(config.ociOverlay?.contextDir).toBe(fs.realpathSync(workDir));
		} finally {
			vi.restoreAllMocks();
		}
	});
});

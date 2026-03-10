import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';

const pathsToCleanup: string[] = [];
const originalPath = process.env.PATH;

beforeEach(() => {
	const fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-bin-'));
	pathsToCleanup.push(fakeBinDir);
	fs.writeFileSync(path.join(fakeBinDir, 'docker'), '#!/bin/sh\nexit 0\n', 'utf8');
	fs.chmodSync(path.join(fakeBinDir, 'docker'), 0o755);
	process.env.PATH = `${fakeBinDir}${path.delimiter}${originalPath ?? ''}`;
});

afterEach(() => {
	process.env.PATH = originalPath;
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

describe('loadBuildConfig', () => {
	it('loads base config when no project config exists', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const config = loadBuildConfig(workDir);

		expect(config.arch).toBe('aarch64');
		expect(config.oci?.image).toContain('debian');
	});

	it('merges project config on top of base', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				oci: { image: 'docker.io/library/ubuntu:24.04' },
			}),
		);

		const config = loadBuildConfig(workDir);
		expect(config.oci?.image).toBe('docker.io/library/ubuntu:24.04');
	});

	it('throws with file context when JSON is malformed', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'build.project.json'), '{bad-json', 'utf8');

		expect(() => loadBuildConfig(workDir)).toThrowError(/build\.project\.json/u);
	});

	it('hard-fails when macOS + oci + non-empty postBuild.commands', () => {
		if (process.platform !== 'darwin') {
			return;
		}

		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				oci: { image: 'docker.io/library/ubuntu:24.04' },
				postBuild: { commands: ['apt-get install -y htop'] },
			}),
		);

		expect(() => loadBuildConfig(workDir)).toThrowError(/postBuild\.commands.*macOS/iu);
	});

	it('allows postBuild.commands + oci on Linux', () => {
		if (process.platform !== 'linux') {
			return;
		}

		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				oci: { image: 'docker.io/library/ubuntu:24.04' },
				postBuild: { commands: ['apt-get install -y htop'] },
			}),
		);

		const config = loadBuildConfig(workDir);
		expect(config.postBuild?.commands).toContain('apt-get install -y htop');
	});

	it('resolves init script paths relative to config file', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				init: {
					rootfsInitExtra: './init/rootfs-extra.sh',
				},
			}),
			'utf8',
		);

		const config = loadBuildConfig(workDir);
		expect(config.init?.rootfsInitExtra).toBe(path.join(configDir, 'init', 'rootfs-extra.sh'));
	});

	it('resolves ociOverlay paths relative to workspace root', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'overlay.repo.dockerfile'), 'FROM scratch\n', 'utf8');
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				ociOverlay: {
					baseImage: 'docker.io/library/debian:bookworm-slim',
					dockerfile: '.agent_vm/overlay.repo.dockerfile',
					contextDir: '.',
				},
			}),
			'utf8',
		);

		const config = loadBuildConfig(workDir);
		expect(config.ociOverlay?.dockerfile).toBe(
			fs.realpathSync(path.join(workDir, '.agent_vm', 'overlay.repo.dockerfile')),
		);
		expect(config.ociOverlay?.contextDir).toBe(fs.realpathSync(workDir));
	});

	it('rejects ociOverlay paths that escape workspace via symlink', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });

		const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-outside-'));
		pathsToCleanup.push(outsideDir);
		fs.writeFileSync(path.join(outsideDir, 'overlay.dockerfile'), 'FROM scratch\n', 'utf8');

		const escapeLink = path.join(workDir, 'escape-link');
		fs.symlinkSync(outsideDir, escapeLink, 'dir');
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				ociOverlay: {
					baseImage: 'docker.io/library/debian:bookworm-slim',
					dockerfile: 'escape-link/overlay.dockerfile',
					contextDir: '.',
				},
			}),
			'utf8',
		);

		expect(() => loadBuildConfig(workDir)).toThrowError(/escapes.*symlink/u);
	});
});

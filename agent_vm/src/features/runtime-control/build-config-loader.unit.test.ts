import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';

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
});

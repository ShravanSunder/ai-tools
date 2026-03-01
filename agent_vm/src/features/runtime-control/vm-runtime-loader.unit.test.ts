import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadVmRuntimeConfig } from '#src/features/runtime-control/vm-runtime-loader.js';

describe('loadVmRuntimeConfig', () => {
	it('loads base runtime config when no repo/local config exists', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-runtime-loader-'));
		const config = loadVmRuntimeConfig(workDir);

		expect(config.rootfsMode).toBe('memory');
		expect(config.idleTimeoutMinutes).toBe(10);
		expect(config.memory).toBe(2048);
	});

	it('merges base < repo < local with expected precedence', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-runtime-loader-'));
		const configDirectory = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDirectory, { recursive: true });

		fs.writeFileSync(
			path.join(configDirectory, 'vm-runtime.repo.json'),
			JSON.stringify({
				memory: 3072,
				env: {
					REPO_ONLY: 'yes',
				},
			}),
			'utf8',
		);
		fs.writeFileSync(
			path.join(configDirectory, 'vm-runtime.local.json'),
			JSON.stringify({
				memory: 4096,
				cpus: 4,
			}),
			'utf8',
		);

		const config = loadVmRuntimeConfig(workDir);
		expect(config.memory).toBe(4096);
		expect(config.cpus).toBe(4);
		expect(config.env.REPO_ONLY).toBe('yes');
	});

	it('throws with file path context when repo runtime config json is malformed', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-runtime-loader-'));
		const configDirectory = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDirectory, { recursive: true });
		fs.writeFileSync(path.join(configDirectory, 'vm-runtime.repo.json'), '{', 'utf8');

		expect(() => loadVmRuntimeConfig(workDir)).toThrowError(/vm-runtime\.repo\.json/u);
	});

	it('interpolates ${WORKSPACE} and ${HOST_HOME} tokens', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-runtime-loader-'));
		const configDirectory = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDirectory, { recursive: true });
		fs.writeFileSync(
			path.join(configDirectory, 'vm-runtime.repo.json'),
			JSON.stringify({
				volumes: {
					venv: {
						guestPath: '${WORKSPACE}/.venv',
					},
				},
				readonlyMounts: {
					aws: '${HOST_HOME}/.aws',
				},
			}),
			'utf8',
		);

		const config = loadVmRuntimeConfig(workDir);
		expect(config.volumes.venv?.guestPath).toBe(path.join(workDir, '.venv'));
		expect(config.readonlyMounts.aws).toBe(path.join(os.homedir(), '.aws'));
	});
});

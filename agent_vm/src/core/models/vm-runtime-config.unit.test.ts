import { describe, expect, it } from 'vitest';

import {
	mergeVmRuntimeConfigs,
	parseVmRuntimeConfig,
	type VmRuntimeConfigInput,
} from '#src/core/models/vm-runtime-config.js';

describe('vm runtime config schema', () => {
	it('parses empty input with all defaults', () => {
		const config = parseVmRuntimeConfig({});

		expect(config.rootfsMode).toBe('memory');
		expect(config.memory).toBe(2048);
		expect(config.cpus).toBe(2);
		expect(config.idleTimeoutMinutes).toBe(10);
		expect(config.monorepoDiscovery).toBe(true);
	});

	it('parses full config with volumes and shadows', () => {
		const config = parseVmRuntimeConfig({
			rootfsMode: 'cow',
			memory: 4096,
			cpus: 4,
			volumes: {
				venv: { guestPath: '${WORKSPACE}/.venv' },
			},
			shadows: {
				deny: ['.agent_vm', '.git'],
				tmpfs: [],
			},
		});

		expect(config.rootfsMode).toBe('cow');
		expect(config.memory).toBe(4096);
		expect(config.volumes.venv?.guestPath).toBe('${WORKSPACE}/.venv');
	});

	it('rejects invalid rootfsMode', () => {
		expect(() => parseVmRuntimeConfig({ rootfsMode: 'invalid' })).toThrow();
	});

	it('rejects negative memory', () => {
		expect(() => parseVmRuntimeConfig({ memory: -1 })).toThrow();
	});
});

describe('mergeVmRuntimeConfigs', () => {
	it('deep merges three tiers: base < repo < local', () => {
		const base: VmRuntimeConfigInput = {
			memory: 2048,
			cpus: 2,
			env: { HOME: '/home/agent' },
			volumes: {
				venv: { guestPath: '${WORKSPACE}/.venv' },
				pnpmStore: { guestPath: '/home/agent/.local/share/pnpm' },
			},
			shadows: { deny: ['.agent_vm', '.git'], tmpfs: [] },
		};
		const repo: VmRuntimeConfigInput = {
			memory: 4096,
			env: { CUSTOM: 'value' },
		};
		const local: VmRuntimeConfigInput = {
			cpus: 4,
		};

		const merged = mergeVmRuntimeConfigs(base, repo, local);

		expect(merged.memory).toBe(4096);
		expect(merged.cpus).toBe(4);
		expect(merged.env).toEqual({ HOME: '/home/agent', CUSTOM: 'value' });
		expect(merged.volumes?.venv?.guestPath).toBe('${WORKSPACE}/.venv');
	});
});

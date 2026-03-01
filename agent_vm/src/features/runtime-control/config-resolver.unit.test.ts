import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	resolveRuntimeConfig,
	resolveVmConfig,
} from '#src/features/runtime-control/config-resolver.js';

describe('config resolver', () => {
	it('resolves vm config with local overriding repo and base', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-config-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });

		fs.writeFileSync(
			path.join(configDir, 'vm-runtime.repo.json'),
			JSON.stringify({ memory: 3072 }),
		);
		fs.writeFileSync(
			path.join(configDir, 'vm-runtime.local.json'),
			JSON.stringify({ memory: 5120 }),
		);

		const resolved = resolveVmConfig(workDir);
		expect(resolved.memory).toBe(5120);
	});

	it('returns build, runtime, tcp and policy bundle from resolveRuntimeConfig', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-runtime-config-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });

		fs.writeFileSync(
			path.join(configDir, 'tcp-services.repo.json'),
			JSON.stringify({
				services: {
					postgres: { upstreamTarget: '127.0.0.1:25432' },
				},
			}),
			'utf8',
		);

		const resolved = resolveRuntimeConfig(workDir);
		expect(resolved.runtimeConfig.idleTimeoutMinutes).toBe(10);
		expect(resolved.buildConfig.arch).toBe('aarch64');
		expect(resolved.tcpServiceMap.services.postgres?.upstreamTarget).toBe('127.0.0.1:25432');
		expect(Array.isArray(resolved.allowedHosts)).toBe(true);
		expect(resolved.generatedStateDir).toContain(path.join('.agent_vm', '.generated'));
	});
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveVmConfig } from '#src/features/runtime-control/config-resolver.js';

describe('config resolver', () => {
	it('resolves vm config with local overriding repo and base', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-config-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });

		fs.writeFileSync(
			path.join(configDir, 'vm.repo.conf'),
			'IDLE_TIMEOUT_MINUTES=20\nTUNNEL_ENABLED=false\n',
		);
		fs.writeFileSync(path.join(configDir, 'vm.local.conf'), 'IDLE_TIMEOUT_MINUTES=7\n');

		const resolved = resolveVmConfig(workDir);

		expect(resolved.idleTimeoutMinutes).toBe(7);
		expect(resolved.tunnelEnabled).toBe(false);
	});
});

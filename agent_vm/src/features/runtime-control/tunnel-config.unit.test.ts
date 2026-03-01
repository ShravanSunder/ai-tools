import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	loadTunnelConfig,
	parseTunnelConfig,
} from '#src/features/runtime-control/tunnel-config.js';

describe('tunnel config', () => {
	it('validates default postgres/redis host tunnel targets', () => {
		const parsed = parseTunnelConfig({});
		expect(parsed.services.postgres.hostTarget).toEqual({ host: '127.0.0.1', port: 5432 });
		expect(parsed.services.redis.hostTarget).toEqual({ host: '127.0.0.1', port: 6379 });
	});

	it('throws with file context when local tunnel json is malformed', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tunnel-config-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'tunnels.local.json'), '{not-json');

		expect(() => loadTunnelConfig(workDir)).toThrowError(/tunnels\.local\.json/u);
	});
});

import { describe, expect, it } from 'vitest';

import { parseTunnelConfig } from '../../src/core/tunnel-config.js';

describe('tunnel config', () => {
	it('validates default postgres/redis host tunnel targets', () => {
		const parsed = parseTunnelConfig({});
		expect(parsed.services.postgres.hostTarget).toEqual({ host: '127.0.0.1', port: 5432 });
		expect(parsed.services.redis.hostTarget).toEqual({ host: '127.0.0.1', port: 6379 });
	});
});

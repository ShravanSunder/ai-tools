import { describe, expect, it } from 'vitest';

describe('agent_vm project smoke', () => {
	it('loads package entrypoint', async () => {
		const mod = await import('#src/index.js');
		expect(mod).toBeDefined();
	});
});

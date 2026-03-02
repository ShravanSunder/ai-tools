import { describe, expect, it } from 'vitest';

import { runCtlCli } from '#src/features/cli/ctl.js';

describe('ctl cli', () => {
	it('requires --target for policy allow', async () => {
		await expect(runCtlCli(['policy', 'allow'])).rejects.toThrow();
	});

	it('requires --target for policy block', async () => {
		await expect(runCtlCli(['policy', 'block'])).rejects.toThrow();
	});
});

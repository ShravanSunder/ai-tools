import { describe, expect, it } from 'vitest';

import { runAgentVmCtlCli } from '#src/features/cli/agent-vm-ctl.js';

describe('agent-vm-ctl cli', () => {
	it('requires --target for policy allow', async () => {
		await expect(runAgentVmCtlCli(['policy', 'allow'])).rejects.toThrow();
	});

	it('requires --target for policy block', async () => {
		await expect(runAgentVmCtlCli(['policy', 'block'])).rejects.toThrow();
	});
});

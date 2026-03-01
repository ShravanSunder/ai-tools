import { describe, expect, it } from 'vitest';

import { runAgentVmCtlCli } from '../../src/cli/agent-vm-ctl.js';

describe('agent-vm-ctl cli', () => {
	it('rejects unsupported tunnel service names', async () => {
		await expect(
			runAgentVmCtlCli(['tunnels', 'restart', '--service', 'not-a-service']),
		).rejects.toThrow("Invalid --service 'not-a-service'. Expected postgres or redis.");
	});
});

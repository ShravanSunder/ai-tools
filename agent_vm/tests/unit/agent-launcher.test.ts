import { describe, expect, it } from 'vitest';

import { resolveAgentPresetCommand } from '../../src/core/agent-launcher.js';

describe('agent launcher', () => {
	it('maps --run-codex to codex resume command in VM shell', () => {
		const command = resolveAgentPresetCommand('codex');
		expect(command).toBe('codex --dangerously-bypass-approvals-and-sandbox resume --last');
	});
});

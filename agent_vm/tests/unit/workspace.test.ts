import { describe, expect, it } from 'vitest';

import { deriveWorkspaceIdentity } from '../../src/core/workspace.js';

describe('workspace identity', () => {
	it('builds deterministic session name from workspace path', () => {
		const info = deriveWorkspaceIdentity('/Users/me/dev/ai-tools');
		expect(info.sessionName).toMatch(/^agent-vm-ai-tools-[a-f0-9]{8}$/u);
		expect(info.daemonSocketPath.endsWith('.sock')).toBe(true);
	});

	it('truncates session repo segment to avoid unix socket path overflow', () => {
		const info = deriveWorkspaceIdentity(
			'/Users/me/dev/this-is-a-very-long-workspace-name-for-sockets',
		);
		expect(info.sessionName).toMatch(/^agent-vm-[a-z0-9-]{1,24}-[a-f0-9]{8}$/u);
		expect(info.daemonSocketPath.length).toBeLessThanOrEqual(103);
	});
});

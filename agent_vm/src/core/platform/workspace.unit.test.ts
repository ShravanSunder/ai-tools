import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { deriveWorkspaceIdentity } from '#src/core/platform/workspace.js';

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

	it('canonicalizes symlinked workspace paths to one identity', () => {
		const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-workspace-identity-'));
		const realWorkspacePath = path.join(rootDir, 'real-workspace');
		const symlinkPath = path.join(rootDir, 'linked-workspace');
		fs.mkdirSync(realWorkspacePath);
		fs.symlinkSync(realWorkspacePath, symlinkPath);

		try {
			const real = deriveWorkspaceIdentity(realWorkspacePath);
			const linked = deriveWorkspaceIdentity(symlinkPath);
			expect(linked.workDir).toBe(real.workDir);
			expect(linked.dirHash).toBe(real.dirHash);
			expect(linked.daemonSocketPath).toBe(real.daemonSocketPath);
		} finally {
			fs.rmSync(rootDir, { recursive: true, force: true });
		}
	});
});

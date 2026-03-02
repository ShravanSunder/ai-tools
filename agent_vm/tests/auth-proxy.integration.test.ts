import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { NoopLogger } from '#src/core/platform/logger.js';
import { AuthSyncManager } from '#src/features/auth-proxy/auth-sync.js';

describe('auth sync manager', () => {
	it('returns readonly auth mounts only for host paths that exist', () => {
		const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-auth-'));
		const claudePath = path.join(fakeHome, '.claude');
		fs.mkdirSync(claudePath, { recursive: true });
		const codexPath = path.join(fakeHome, '.codex');
		fs.mkdirSync(codexPath, { recursive: true });

		const manager = new AuthSyncManager(new NoopLogger(), fakeHome);
		expect(manager.getReadonlyAuthMounts()).toEqual({
			'/home/agent/.claude': claudePath,
			'/home/agent/.codex': codexPath,
		});
	});

	it('cleans up obsolete per-session auth mirror cache directory', () => {
		const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-auth-cache-'));
		const legacyCachePath = path.join(
			fakeHome,
			'.cache',
			'agent-vm',
			'auth',
			'session-a',
			'.claude',
		);
		fs.mkdirSync(legacyCachePath, { recursive: true });
		fs.writeFileSync(path.join(legacyCachePath, 'token.txt'), 'token');
		const manager = new AuthSyncManager(new NoopLogger(), fakeHome);
		manager.cleanupLegacyAuthCache();

		expect(fs.existsSync(path.join(fakeHome, '.cache', 'agent-vm', 'auth'))).toBe(false);
	});
});

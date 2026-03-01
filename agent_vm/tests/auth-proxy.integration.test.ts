import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { NoopLogger } from '#src/core/platform/logger.js';
import { AuthSyncManager } from '#src/features/auth-proxy/auth-sync.js';

describe('auth sync manager', () => {
	it('copies host auth dirs into session mirror and back', () => {
		const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-auth-'));

		const claudePath = path.join(fakeHome, '.claude');
		fs.mkdirSync(claudePath, { recursive: true });
		fs.writeFileSync(path.join(claudePath, 'token.txt'), 'old-token');

		const manager = new AuthSyncManager(new NoopLogger(), fakeHome);
		const state = manager.prepareSessionAuthMirror('test-session');

		const mirrorTokenPath = path.join(state.sessionAuthRoot, '.claude', 'token.txt');
		expect(fs.existsSync(mirrorTokenPath)).toBe(true);

		fs.writeFileSync(mirrorTokenPath, 'new-token');
		manager.copyBackSessionAuthMirror(state);

		const updated = fs.readFileSync(path.join(claudePath, 'token.txt'), 'utf8');
		expect(updated).toBe('new-token');

		const backups = fs.readdirSync(fakeHome).filter((entry) => entry.startsWith('.claude.backup.'));
		expect(backups.length).toBeGreaterThan(0);
	});

	it('recovers from stale auth lock files', () => {
		const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-auth-lock-'));
		const sessionRoot = path.join(fakeHome, '.cache', 'agent-vm', 'auth', 'stale-lock-session');
		fs.mkdirSync(sessionRoot, { recursive: true });
		fs.writeFileSync(
			path.join(sessionRoot, '.sync.lock'),
			JSON.stringify({ pid: 999_999, createdAtEpochMs: Date.now() }),
		);

		const manager = new AuthSyncManager(new NoopLogger(), fakeHome);
		const state = manager.prepareSessionAuthMirror('stale-lock-session');

		expect(state.sessionAuthRoot).toBe(sessionRoot);
		expect(fs.existsSync(state.lockPath)).toBe(false);
	});
});

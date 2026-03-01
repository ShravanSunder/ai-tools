import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { AuthSyncManager } from '../../src/core/auth-sync.js';
import { NoopLogger } from '../../src/core/logger.js';

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
	});
});

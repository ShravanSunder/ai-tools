import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { ensureAtuinImportedOnFirstRun } from '#src/features/runtime-control/shell-setup.js';

describe('shell setup', () => {
	it('imports atuin directories once and writes marker', () => {
		const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-shell-home-'));
		const volumeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-shell-volume-'));
		const atuinConfigPath = path.join(fakeHome, '.config', 'atuin');
		const atuinDataPath = path.join(fakeHome, '.local', 'share', 'atuin');
		fs.mkdirSync(atuinConfigPath, { recursive: true });
		fs.mkdirSync(atuinDataPath, { recursive: true });
		fs.writeFileSync(path.join(atuinConfigPath, 'config.toml'), 'dialect = "sqlite"', 'utf8');
		fs.writeFileSync(path.join(atuinDataPath, 'history.db'), 'db', 'utf8');

		const homeSpy = vi.spyOn(os, 'homedir').mockReturnValue(fakeHome);
		try {
			ensureAtuinImportedOnFirstRun(volumeDir);
			ensureAtuinImportedOnFirstRun(volumeDir);
		} finally {
			homeSpy.mockRestore();
		}

		expect(fs.existsSync(path.join(volumeDir, '.initialized'))).toBe(true);
		expect(fs.existsSync(path.join(volumeDir, 'atuin-config', 'config.toml'))).toBe(true);
		expect(fs.existsSync(path.join(volumeDir, 'atuin-data', 'history.db'))).toBe(true);
	});
});

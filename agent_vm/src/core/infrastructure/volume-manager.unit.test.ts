import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	ensureVolumeDir,
	resolveVolumeDirs,
	wipeVolumeDirs,
} from '#src/core/infrastructure/volume-manager.js';

describe('volume manager', () => {
	it('creates volume directory if missing', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		const volumeDir = ensureVolumeDir(cacheBase, 'abc123', 'venv');

		expect(fs.existsSync(volumeDir)).toBe(true);
		expect(volumeDir).toContain(path.join('abc123', 'venv'));
	});

	it('resolves all volume dirs from runtime config', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		const volumes = {
			venv: { guestPath: '/workspace/.venv' },
			pnpmStore: { guestPath: '/home/agent/.local/share/pnpm' },
		};

		const resolved = resolveVolumeDirs(cacheBase, 'abc123', volumes);
		expect(Object.keys(resolved)).toEqual(['venv', 'pnpmStore']);
		expect(resolved.venv?.hostDir).toContain(path.join('abc123', 'venv'));
		expect(resolved.venv?.guestPath).toBe('/workspace/.venv');
	});

	it('wipes all volume dirs for a workspace', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		ensureVolumeDir(cacheBase, 'abc123', 'venv');
		ensureVolumeDir(cacheBase, 'abc123', 'pnpmStore');

		wipeVolumeDirs(cacheBase, 'abc123');
		expect(fs.existsSync(path.join(cacheBase, 'abc123'))).toBe(false);
	});
});

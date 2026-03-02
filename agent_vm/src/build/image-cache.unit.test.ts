import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
	readWorkspaceImageRef,
	resolveFingerprintBuildLockPath,
	resolveFingerprintImageDir,
	resolveImageCacheRootDir,
	resolveVolumeCacheDir,
	writeWorkspaceImageRef,
} from '#src/build/image-cache.js';

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

afterEach(() => {
	for (const tempHome of tempHomes.splice(0)) {
		fs.rmSync(tempHome, { recursive: true, force: true });
	}
	process.env.HOME = originalHome;
});

function setTempHome(): string {
	const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-home-'));
	tempHomes.push(tempHome);
	process.env.HOME = tempHome;
	return tempHome;
}

describe('image cache paths', () => {
	it('resolves fingerprint image and lock paths under global cache root', () => {
		const tempHome = setTempHome();
		const root = resolveImageCacheRootDir();

		expect(root).toBe(path.join(tempHome, '.cache', 'agent-vm', 'images'));
		expect(resolveFingerprintImageDir('abc123')).toBe(
			path.join(root, 'by-fingerprint', 'abc123'),
		);
		expect(resolveFingerprintBuildLockPath('abc123')).toBe(
			path.join(root, 'locks', 'abc123.lock'),
		);
		expect(resolveVolumeCacheDir()).toBe(path.join(tempHome, '.cache', 'agent-vm', 'volumes'));
	});

	it('writes and reads workspace image references', () => {
		setTempHome();
		writeWorkspaceImageRef('workspace-hash', {
			fingerprint: 'fp123',
			imagePath: '/tmp/agent-vm/image',
		});

		const reference = readWorkspaceImageRef('workspace-hash');
		expect(reference).not.toBeNull();
		expect(reference?.fingerprint).toBe('fp123');
		expect(reference?.imagePath).toBe('/tmp/agent-vm/image');
		expect(reference?.updatedAtEpochMs).toBeTypeOf('number');
	});
});


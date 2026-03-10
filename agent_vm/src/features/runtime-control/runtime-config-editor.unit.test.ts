import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
	listMountEntries,
	removeMountEntry,
	upsertMountEntry,
} from '#src/features/runtime-control/runtime-config-editor.js';

const pathsToCleanup: string[] = [];

afterEach(() => {
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

function readJsonFile(filePath: string): Record<string, unknown> {
	return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

describe('runtime-config-editor', () => {
	it('writes readonly mount entries to tier config without daemon', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await upsertMountEntry({
			workDir,
			tier: 'local',
			mode: 'ro',
			guestPath: '/home/agent/.cursor',
			hostPath: '${HOST_HOME}/.cursor',
		});

		const filePath = path.join(workDir, '.agent_vm', 'vm-runtime.local.json');
		const json = readJsonFile(filePath);
		expect((json['readonlyMounts'] as Record<string, string>)['/home/agent/.cursor']).toBe(
			'${HOST_HOME}/.cursor',
		);
	});

	it('rejects writable mount outside allowlist boundaries', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await expect(
			upsertMountEntry({
				workDir,
				tier: 'local',
				mode: 'rw',
				guestPath: '/etc',
				hostPath: '/tmp',
			}),
		).rejects.toThrowError(/outside writable allowlist/u);
	});

	it('rejects tokenized guest path that resolves outside writable allowlist', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await expect(
			upsertMountEntry({
				workDir,
				tier: 'local',
				mode: 'rw',
				guestPath: '${HOST_HOME}/.claude',
				hostPath: '${HOST_HOME}/.claude',
			}),
		).rejects.toThrowError(/outside writable allowlist|auth/u);
	});

	it('supports concurrent writes to the same tier file without clobbering entries', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await Promise.all([
			upsertMountEntry({
				workDir,
				tier: 'local',
				mode: 'ro',
				guestPath: '/home/agent/.a',
				hostPath: '${HOST_HOME}/.a',
			}),
			upsertMountEntry({
				workDir,
				tier: 'local',
				mode: 'ro',
				guestPath: '/home/agent/.b',
				hostPath: '${HOST_HOME}/.b',
			}),
		]);

		const filePath = path.join(workDir, '.agent_vm', 'vm-runtime.local.json');
		const json = readJsonFile(filePath);
		const readonlyMounts = json['readonlyMounts'] as Record<string, string>;
		expect(readonlyMounts['/home/agent/.a']).toBe('${HOST_HOME}/.a');
		expect(readonlyMounts['/home/agent/.b']).toBe('${HOST_HOME}/.b');
	});

	it('supports concurrent writes across repo/local tiers without JSON corruption', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await Promise.all([
			upsertMountEntry({
				workDir,
				tier: 'repo',
				mode: 'ro',
				guestPath: '/home/agent/.repo-a',
				hostPath: '${HOST_HOME}/.repo-a',
			}),
			upsertMountEntry({
				workDir,
				tier: 'local',
				mode: 'ro',
				guestPath: '/home/agent/.local-b',
				hostPath: '${HOST_HOME}/.local-b',
			}),
		]);

		const repoJson = readJsonFile(path.join(workDir, '.agent_vm', 'vm-runtime.repo.json'));
		const localJson = readJsonFile(path.join(workDir, '.agent_vm', 'vm-runtime.local.json'));
		expect((repoJson['readonlyMounts'] as Record<string, string>)['/home/agent/.repo-a']).toBe(
			'${HOST_HOME}/.repo-a',
		);
		expect((localJson['readonlyMounts'] as Record<string, string>)['/home/agent/.local-b']).toBe(
			'${HOST_HOME}/.local-b',
		);
	});

	it('removes mount entries from both readonly and writable maps', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-mount-editor-'));
		pathsToCleanup.push(workDir);

		await upsertMountEntry({
			workDir,
			tier: 'local',
			mode: 'ro',
			guestPath: '/home/agent/.remove-me',
			hostPath: '${HOST_HOME}/.remove-me',
		});
		await removeMountEntry({
			workDir,
			tier: 'local',
			guestPath: '/home/agent/.remove-me',
		});

		const entries = listMountEntries(workDir, 'local');
		expect(entries.find((entry) => entry.guestPath === '/home/agent/.remove-me')).toBeUndefined();
	});
});

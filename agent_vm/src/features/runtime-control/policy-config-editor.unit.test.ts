import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
	addPolicyDomain,
	listPolicyDomains,
	removePolicyDomain,
} from '#src/features/runtime-control/policy-config-editor.js';

const pathsToCleanup: string[] = [];

afterEach(() => {
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

describe('policy-config-editor', () => {
	it('adds domain to repo allowlist file', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-policy-editor-'));
		pathsToCleanup.push(workDir);

		await addPolicyDomain({
			workDir,
			tier: 'repo',
			domain: 'api.linear.app',
		});

		const repoPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.repo.txt');
		expect(fs.readFileSync(repoPolicyPath, 'utf8')).toContain('api.linear.app');
	});

	it('removes domain from local allowlist file', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-policy-editor-'));
		pathsToCleanup.push(workDir);
		const localPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.local.txt');
		fs.mkdirSync(path.dirname(localPolicyPath), { recursive: true });
		fs.writeFileSync(localPolicyPath, 'api.linear.app\napi.openai.com\n', 'utf8');

		await removePolicyDomain({
			workDir,
			tier: 'local',
			domain: 'api.linear.app',
		});

		const next = fs.readFileSync(localPolicyPath, 'utf8');
		expect(next).not.toContain('api.linear.app');
		expect(next).toContain('api.openai.com');
	});

	it('lists merged domains from base/repo/local/toggles', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-policy-editor-'));
		pathsToCleanup.push(workDir);
		const configDir = path.join(workDir, '.agent_vm');
		const generatedDir = path.join(configDir, '.generated');
		fs.mkdirSync(generatedDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'policy-allowlist-extra.repo.txt'), 'repo.example.com\n', 'utf8');
		fs.writeFileSync(path.join(configDir, 'policy-allowlist-extra.local.txt'), 'local.example.com\n', 'utf8');
		fs.writeFileSync(path.join(generatedDir, 'policy-toggle.entries.txt'), 'toggle.example.com\n', 'utf8');

		const merged = listPolicyDomains(workDir, 'merged');
		expect(merged).toContain('repo.example.com');
		expect(merged).toContain('local.example.com');
		expect(merged).toContain('toggle.example.com');
	});

	it('does not clobber concurrent add operations', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-policy-editor-'));
		pathsToCleanup.push(workDir);

		await Promise.all([
			addPolicyDomain({ workDir, tier: 'repo', domain: 'a.example.com' }),
			addPolicyDomain({ workDir, tier: 'repo', domain: 'b.example.com' }),
		]);

		const repoPolicyPath = path.join(workDir, '.agent_vm', 'policy-allowlist-extra.repo.txt');
		const contents = fs.readFileSync(repoPolicyPath, 'utf8');
		expect(contents).toContain('a.example.com');
		expect(contents).toContain('b.example.com');
	});
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

describe('init-agent-vm', () => {
	it('creates .agent_vm templates with repo/local separation', async () => {
		const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-init-'));
		await execa('git', ['init'], { cwd: tempRepo });

		const binaryPath = path.resolve('dist', 'bin', 'agent-vm.js');
		await execa(process.execPath, [binaryPath, 'init', '--default', '--work-dir', tempRepo], {
			cwd: tempRepo,
		});

		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'build.project.json'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'vm-runtime.repo.json'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'vm-runtime.local.json'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'tcp-services.repo.json'))).toBe(false);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'tcp-services.local.json'))).toBe(false);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', '.gitignore'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'INSTRUCTIONS.md'))).toBe(true);

		const gitignore = fs.readFileSync(path.join(tempRepo, '.agent_vm', '.gitignore'), 'utf8');
		expect(gitignore).toContain('*.local.*');
		expect(gitignore).toContain('.generated/');
	});
});

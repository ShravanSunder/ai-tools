import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

describe('init_repo_vm', () => {
	it('creates .agent_vm templates with repo/local separation', async () => {
		const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-init-'));
		await execa('git', ['init'], { cwd: tempRepo });

		const scriptPath = path.resolve('init_repo_vm.sh');
		await execa(scriptPath, [], { cwd: tempRepo });

		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'vm.repo.conf'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', 'vm.local.conf'))).toBe(true);
		expect(fs.existsSync(path.join(tempRepo, '.agent_vm', '.gitignore'))).toBe(true);

		const gitignore = fs.readFileSync(path.join(tempRepo, '.agent_vm', '.gitignore'), 'utf8');
		expect(gitignore).toContain('*.local.*');
		expect(gitignore).toContain('.generated/');
	});
});

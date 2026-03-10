import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const pathsToCleanup: string[] = [];

function commandSucceeds(command: string, args: readonly string[]): boolean {
	const result = spawnSync(command, [...args], { stdio: 'ignore' });
	return result.status === 0;
}

const hasGondolinRuntime = commandSucceeds(process.execPath, [
	'--input-type=module',
	'-e',
	'await import("@earendil-works/gondolin")',
]);

afterEach(() => {
	for (const target of pathsToCleanup.splice(0)) {
		fs.rmSync(target, { recursive: true, force: true });
	}
});

describe('e2e shell parity', () => {
	it('probes shell toolchain without interactive agent sessions', () => {
		expect(
			hasGondolinRuntime,
			'@earendil-works/gondolin is required for tests/e2e/shell-parity.e2e.test.ts',
		).toBe(true);

		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-shell-parity-'));
		pathsToCleanup.push(workDir);

		const binPath = path.join(process.cwd(), 'dist', 'bin', 'agent-vm.js');
		const probe = [
			'for t in zsh node pnpm npm uv git claude codex gemini opencode cursor; do',
			'command -v "$t" >/dev/null 2>&1 || { echo "missing:$t"; exit 1; };',
			'done;',
			'echo shell_ok',
		].join(' ');

		const result = spawnSync(
			process.execPath,
			[binPath, 'run', '--run', probe],
			{ cwd: workDir, encoding: 'utf8', timeout: 120_000 },
		);
		expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
		expect(result.stdout).toContain('shell_ok');
	});
});

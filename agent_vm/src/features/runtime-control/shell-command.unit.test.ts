import { describe, expect, it } from 'vitest';
import {
	buildInteractiveShellCommand,
	wrapCommandForInteractiveShell,
} from './shell-command.js';

describe('shell command', () => {
	it('builds interactive command with zsh-first and sh fallback', () => {
		const command = buildInteractiveShellCommand('/workspace');
		expect(command).toContain('if [ -x /bin/zsh ]');
		expect(command).toContain('exec /bin/zsh -il');
		expect(command).toContain('exec /bin/sh -l');
	});

	it('wraps preset command in zsh -i -c with fallback', () => {
		const wrapped = wrapCommandForInteractiveShell(
			'codex --dangerously-bypass-approvals-and-sandbox resume --last',
		);
		expect(wrapped).toContain('/bin/zsh -i -c');
		expect(wrapped).toContain('/bin/sh -lc');
	});

	it('escapes embedded single quotes in wrapped command payload', () => {
		const wrapped = wrapCommandForInteractiveShell(`printf '%s' "O'Brien"`);
		expect(wrapped).toContain(`'printf '"'"'%s'"'"' "O'"'"'Brien"'`);
	});
});

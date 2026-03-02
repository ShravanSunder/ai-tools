import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	interpolateConfigValue,
	resolveScriptPath,
} from '#src/features/runtime-control/config-interpolation.js';

describe('interpolateConfigValue', () => {
	const interpolationContext = {
		WORKSPACE: '/Users/dev/my-project',
		HOST_HOME: '/Users/dev',
	};

	it('replaces ${WORKSPACE} token', () => {
		expect(interpolateConfigValue('${WORKSPACE}/.venv', interpolationContext)).toBe(
			'/Users/dev/my-project/.venv',
		);
	});

	it('replaces ${HOST_HOME} token', () => {
		expect(interpolateConfigValue('${HOST_HOME}/.aws', interpolationContext)).toBe(
			'/Users/dev/.aws',
		);
	});

	it('leaves literal strings unchanged', () => {
		expect(interpolateConfigValue('/home/agent', interpolationContext)).toBe('/home/agent');
	});

	it('rejects unknown tokens', () => {
		expect(() => interpolateConfigValue('${UNKNOWN}/path', interpolationContext)).toThrow(
			/Unknown interpolation token/u,
		);
	});
});

describe('resolveScriptPath', () => {
	it('resolves relative path from config file location', () => {
		const configDir = '/Users/dev/my-project/.agent_vm';
		const result = resolveScriptPath('./init/setup.sh', configDir);

		expect(result).toBe(path.join(configDir, 'init', 'setup.sh'));
	});

	it('rejects path traversal escaping config dir', () => {
		const configDir = '/Users/dev/my-project/.agent_vm';
		expect(() => resolveScriptPath('../../etc/passwd', configDir)).toThrow(/Path traversal/u);
	});

	it('rejects absolute paths', () => {
		const configDir = '/Users/dev/my-project/.agent_vm';
		expect(() => resolveScriptPath('/etc/passwd', configDir)).toThrow(/relative/u);
	});
});

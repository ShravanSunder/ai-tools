import { describe, expect, it } from 'vitest';

import { runCtlCli } from '#src/features/cli/ctl.js';

describe('ctl cli', () => {
	it('requires --target for policy allow', async () => {
		await expect(runCtlCli(['policy', 'allow'])).rejects.toThrow();
	});

	it('requires --target for policy block', async () => {
		await expect(runCtlCli(['policy', 'block'])).rejects.toThrow();
	});

	it('rejects invalid mount mode', async () => {
		await expect(
			runCtlCli([
				'mount',
				'add',
				'--tier',
				'local',
				'--mode',
				'invalid',
				'--guest',
				'/tmp/mount',
				'--host',
				'/tmp/mount',
			]),
		).rejects.toThrow(/Invalid --mode/u);
	});

	it('rejects invalid mount list source', async () => {
		await expect(runCtlCli(['mount', 'list', '--source', 'invalid'])).rejects.toThrow(
			/Invalid --source/u,
		);
	});

	it('rejects invalid firewall tier', async () => {
		await expect(
			runCtlCli(['firewall', 'add', '--tier', 'invalid', '--domain', 'api.linear.app']),
		).rejects.toThrow(/Invalid --tier/u);
	});

	it('rejects invalid firewall list source', async () => {
		await expect(runCtlCli(['firewall', 'list', '--source', 'invalid'])).rejects.toThrow(
			/Invalid --source/u,
		);
	});
});

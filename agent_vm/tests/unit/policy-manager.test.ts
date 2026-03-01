import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getAgentVmRoot } from '../../src/core/paths.js';
import { compilePolicy } from '../../src/core/policy-manager.js';

describe('policy manager', () => {
	it('merges base/repo/local allowlists and applies toggle entries', () => {
		const compiled = compilePolicy({
			base: ['api.openai.com'],
			repo: ['api.linear.app'],
			local: ['example.internal'],
			toggles: ['notion.so'],
		});

		expect(compiled).toEqual(['api.openai.com', 'api.linear.app', 'example.internal', 'notion.so']);
	});

	it('ships required oauth and api domains in base allowlist', () => {
		const basePath = path.join(getAgentVmRoot(), 'config', 'policy-allowlist.base.txt');
		const contents = fs.readFileSync(basePath, 'utf8');
		const domains = new Set(
			contents
				.split(/\r?\n/u)
				.map((line) => line.trim())
				.filter((line) => line.length > 0 && !line.startsWith('#')),
		);

		for (const domain of [
			'anthropic.com',
			'api.anthropic.com',
			'console.anthropic.com',
			'openai.com',
			'api.openai.com',
			'auth.openai.com',
			'platform.openai.com',
			'accounts.google.com',
			'oauth2.googleapis.com',
			'generativelanguage.googleapis.com',
		]) {
			expect(domains.has(domain)).toBe(true);
		}
	});
});

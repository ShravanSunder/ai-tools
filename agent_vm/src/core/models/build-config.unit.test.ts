import { describe, expect, it } from 'vitest';

import {
	type BuildConfigInput,
	mergeBuildConfigs,
	parseBuildConfig,
} from '#src/core/models/build-config.js';

describe('build config schema', () => {
	it('parses minimal valid config', () => {
		const config = parseBuildConfig({
			arch: 'aarch64',
			distro: 'alpine',
		});

		expect(config.arch).toBe('aarch64');
		expect(config.distro).toBe('alpine');
	});

	it('parses full config with oci and postBuild', () => {
		const config = parseBuildConfig({
			arch: 'aarch64',
			distro: 'alpine',
			oci: {
				image: 'docker.io/library/debian:bookworm-slim',
				pullPolicy: 'if-not-present',
			},
			postBuild: {
				commands: ['apt-get update && apt-get install -y git'],
			},
			env: { LANG: 'C.UTF-8' },
			runtimeDefaults: { rootfsMode: 'memory' },
		});

		expect(config.oci?.image).toBe('docker.io/library/debian:bookworm-slim');
		expect(config.postBuild?.commands).toEqual(['apt-get update && apt-get install -y git']);
		expect(config.env).toEqual({ LANG: 'C.UTF-8' });
	});

	it('rejects invalid arch', () => {
		expect(() => parseBuildConfig({ arch: 'mips', distro: 'alpine' })).toThrow();
	});

	it('rejects invalid rootfsMode', () => {
		expect(() =>
			parseBuildConfig({
				arch: 'aarch64',
				distro: 'alpine',
				runtimeDefaults: { rootfsMode: 'invalid' },
			}),
		).toThrow();
	});
});

describe('mergeBuildConfigs', () => {
	it('deep merges base and project configs', () => {
		const base: BuildConfigInput = {
			arch: 'aarch64',
			distro: 'alpine',
			oci: { image: 'debian:bookworm-slim' },
			postBuild: { commands: ['apt-get install -y git'] },
			env: { LANG: 'C.UTF-8' },
		};
		const project: BuildConfigInput = {
			oci: { image: 'ubuntu:24.04' },
			postBuild: { commands: ['apt-get install -y postgresql-client'] },
		};

		const merged = mergeBuildConfigs(base, project);

		expect(merged.arch).toBe('aarch64');
		expect(merged.oci?.image).toBe('ubuntu:24.04');
		expect(merged.postBuild?.commands).toEqual([
			'apt-get install -y git',
			'apt-get install -y postgresql-client',
		]);
		expect(merged.env).toEqual({ LANG: 'C.UTF-8' });
	});

	it('project env merges over base env for record values', () => {
		const base: BuildConfigInput = { env: { LANG: 'C.UTF-8', FOO: 'bar' } };
		const project: BuildConfigInput = { env: { FOO: 'baz', NEW: 'val' } };
		const merged = mergeBuildConfigs(base, project);

		expect(merged.env).toEqual({ LANG: 'C.UTF-8', FOO: 'baz', NEW: 'val' });
	});

	it('project env array replaces base env', () => {
		const base: BuildConfigInput = { env: { LANG: 'C.UTF-8' } };
		const project: BuildConfigInput = { env: ['LANG=C.UTF-8', 'FOO=bar'] };
		const merged = mergeBuildConfigs(base, project);

		expect(merged.env).toEqual(['LANG=C.UTF-8', 'FOO=bar']);
	});
});

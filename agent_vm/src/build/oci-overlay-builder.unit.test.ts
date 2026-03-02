import { describe, expect, it, vi } from 'vitest';

import { buildOverlayImageAndResolveDigest } from '#src/build/oci-overlay-builder.js';

describe('oci overlay builder', () => {
	it('builds overlay with deterministic tag and returns image digest', async () => {
		const runCommand = vi
			.fn()
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: 'built',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: '[]|sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				stderr: '',
			});

		const result = await buildOverlayImageAndResolveDigest(
			{
				fingerprintSeed: 'abc123def4567890',
				overlayConfig: {
					baseImage: 'docker.io/library/debian:bookworm-slim',
					dockerfile: '/tmp/workspace/.agent_vm/overlay.repo.dockerfile',
					contextDir: '/tmp/workspace',
					target: 'runtime',
					buildArgs: {
						FEATURE_FLAG: 'on',
					},
				},
			},
			{ runCommand },
		);

		expect(result.imageRef).toBe(
			'agent-vm-overlay:abc123def4567890@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		);
		expect(result.digest).toBe(
			'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		);
		expect(runCommand).toHaveBeenNthCalledWith(
			1,
			'docker',
			expect.arrayContaining([
				'buildx',
				'build',
				'--load',
				'--file',
				'/tmp/workspace/.agent_vm/overlay.repo.dockerfile',
				'--tag',
				'agent-vm-overlay:abc123def4567890',
				'--build-arg',
				'BASE_IMAGE=docker.io/library/debian:bookworm-slim',
				'--build-arg',
				'FEATURE_FLAG=on',
				'--target',
				'runtime',
				'/tmp/workspace',
			]),
		);
	});

	it('throws on invalid docker image id output', async () => {
		const runCommand = vi
			.fn()
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: 'built',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: '[]|not-a-digest',
				stderr: '',
			});

		await expect(
			buildOverlayImageAndResolveDigest(
				{
					fingerprintSeed: 'xyz',
					overlayConfig: {
						baseImage: 'docker.io/library/debian:bookworm-slim',
						dockerfile: '/tmp/workspace/.agent_vm/overlay.repo.dockerfile',
						contextDir: '/tmp/workspace',
						buildArgs: {},
					},
				},
				{ runCommand },
			),
		).rejects.toThrowError(/unexpected image id/u);
	});

	it('uses repo digest when available from docker inspect', async () => {
		const runCommand = vi
			.fn()
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: 'built',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout:
					'["agent-vm-overlay:abc123def4567890@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"]|sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				stderr: '',
			});

		const result = await buildOverlayImageAndResolveDigest(
			{
				fingerprintSeed: 'abc123def4567890',
				overlayConfig: {
					baseImage: 'docker.io/library/debian:bookworm-slim',
					dockerfile: '/tmp/workspace/.agent_vm/overlay.repo.dockerfile',
					contextDir: '/tmp/workspace',
					buildArgs: {},
				},
			},
			{ runCommand },
		);

		expect(result.imageRef).toBe(
			'agent-vm-overlay:abc123def4567890@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		);
		expect(result.digest).toBe(
			'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		);
	});
});

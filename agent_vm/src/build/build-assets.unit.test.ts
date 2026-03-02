import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildGuestAssets } from '#src/build/build-assets.js';
import { readWorkspaceImageRef } from '#src/build/image-cache.js';
import type { BuildConfig } from '#src/core/models/build-config.js';

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

afterEach(() => {
	for (const tempHome of tempHomes.splice(0)) {
		fs.rmSync(tempHome, { recursive: true, force: true });
	}
	process.env.HOME = originalHome;
});

function setTempHome(): void {
	const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-home-'));
	tempHomes.push(tempHome);
	process.env.HOME = tempHome;
}

function writeFakeBuiltAssets(outputDir: string): void {
	fs.mkdirSync(outputDir, { recursive: true });
	fs.writeFileSync(path.join(outputDir, 'manifest.json'), '{}', 'utf8');
	fs.writeFileSync(path.join(outputDir, 'rootfs.ext4'), 'rootfs', 'utf8');
	fs.writeFileSync(path.join(outputDir, 'initramfs.cpio.lz4'), 'initramfs', 'utf8');
	fs.writeFileSync(path.join(outputDir, 'vmlinuz-virt'), 'kernel', 'utf8');
}

const BASE_CONFIG: BuildConfig = {
	arch: 'aarch64',
	distro: 'alpine',
	oci: {
		image: 'docker.io/library/debian:bookworm-slim',
		pullPolicy: 'if-not-present',
	},
};

describe('buildGuestAssets', () => {
	it('reuses by-fingerprint image cache across workspaces', async () => {
		setTempHome();
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});

		const first = await buildGuestAssets(
			{
				buildConfig: BASE_CONFIG,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest: vi.fn(),
				buildAssetsIntoDir,
			},
		);
		const second = await buildGuestAssets(
			{
				buildConfig: BASE_CONFIG,
				workspaceHash: 'workspace-b',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest: vi.fn(),
				buildAssetsIntoDir,
			},
		);

		expect(first.built).toBe(true);
		expect(second.built).toBe(false);
		expect(first.imagePath).toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(1);
		expect(readWorkspaceImageRef('workspace-a')?.fingerprint).toBe(first.fingerprint);
		expect(readWorkspaceImageRef('workspace-b')?.fingerprint).toBe(first.fingerprint);
	});

	it('includes overlay digest in fingerprint identity', async () => {
		setTempHome();
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});

		const withOverlay: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'docker.io/library/debian:bookworm-slim',
				dockerfile: '/tmp/overlay.dockerfile',
				contextDir: '/tmp',
				buildArgs: {},
			},
		};

		const first = await buildGuestAssets(
			{
				buildConfig: withOverlay,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest: vi.fn(async () => ({
					imageRef:
						'agent-vm-overlay:alpha@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				})),
				buildAssetsIntoDir,
			},
		);
		const second = await buildGuestAssets(
			{
				buildConfig: withOverlay,
				workspaceHash: 'workspace-b',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest: vi.fn(async () => ({
					imageRef:
						'agent-vm-overlay:beta@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				})),
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).not.toBe(second.fingerprint);
		expect(first.imagePath).not.toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(2);
		expect((buildAssetsIntoDir.mock.calls[0]?.[1] as BuildConfig).oci?.image).toBe(
			'agent-vm-overlay:alpha@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		);
		expect((buildAssetsIntoDir.mock.calls[1]?.[1] as BuildConfig).oci?.image).toBe(
			'agent-vm-overlay:beta@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		);
	});
});

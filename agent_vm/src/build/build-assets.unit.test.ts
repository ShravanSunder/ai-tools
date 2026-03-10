import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildGuestAssets } from '#src/build/build-assets.js';
import { readWorkspaceImageRef } from '#src/build/image-cache.js';
import type { BuildConfig } from '#src/core/models/build-config.js';
import { getAgentVmRoot } from '#src/core/platform/paths.js';

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
				ensureParityBaseImage: vi.fn(async () => ({
					imageTag: 'agent-sidecar-base:node-py',
					imageDigest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					sourceHash: 'parity-hash-alpha',
					rebuilt: false,
				})),
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
				ensureParityBaseImage: vi.fn(async () => ({
					imageTag: 'agent-sidecar-base:node-py',
					imageDigest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					sourceHash: 'parity-hash-alpha',
					rebuilt: false,
				})),
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

	it('uses parity source hash instead of overlay digest in fingerprint identity', async () => {
		setTempHome();
		const agentVmRoot = fs.realpathSync(getAgentVmRoot());
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});
		const buildOverlayImageAndResolveDigest = vi
			.fn()
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:alpha@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			})
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:beta@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			});
		const ensureParityBaseImage = vi
			.fn()
			.mockResolvedValueOnce({
				imageTag: 'agent-sidecar-base:node-py',
				imageDigest: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
				sourceHash: 'parity-hash-same',
				rebuilt: false,
			})
			.mockResolvedValueOnce({
				imageTag: 'agent-sidecar-base:node-py',
				imageDigest: 'sha256:2222222222222222222222222222222222222222222222222222222222222222',
				sourceHash: 'parity-hash-same',
				rebuilt: false,
			});

		const withOverlayFirst: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'agent-sidecar-base:node-py',
				dockerfile: path.join(agentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
				contextDir: agentVmRoot,
				buildArgs: {},
			},
		};
		const withOverlaySecond: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'agent-sidecar-base:node-py',
				dockerfile: path.join(agentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
				contextDir: agentVmRoot,
				buildArgs: {},
			},
		};

		const first = await buildGuestAssets(
			{
				buildConfig: withOverlayFirst,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
				buildAssetsIntoDir,
			},
		);
		const second = await buildGuestAssets(
			{
				buildConfig: withOverlaySecond,
				workspaceHash: 'workspace-b',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).toBe(second.fingerprint);
		expect(first.imagePath).toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(1);
		expect(buildOverlayImageAndResolveDigest).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				overlayConfig: expect.objectContaining({
					baseImage: 'agent-sidecar-base:node-py',
				}),
			}),
		);
		expect(buildOverlayImageAndResolveDigest).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				overlayConfig: expect.objectContaining({
					baseImage: 'agent-sidecar-base:node-py',
				}),
			}),
		);
		expect((buildAssetsIntoDir.mock.calls[0]?.[1] as BuildConfig).oci?.image).toBe(
			'agent-vm-overlay:alpha@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		);
		expect((buildAssetsIntoDir.mock.calls[0]?.[1] as BuildConfig).oci?.pullPolicy).toBe('never');
	});

	it('changes fingerprint when parity source hash changes', async () => {
		setTempHome();
		const agentVmRoot = fs.realpathSync(getAgentVmRoot());
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});

		const withOverlay: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'agent-sidecar-base:node-py',
				dockerfile: path.join(agentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
				contextDir: agentVmRoot,
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
				ensureParityBaseImage: vi.fn(async () => ({
					imageTag: 'agent-sidecar-base:node-py',
					imageDigest: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
					sourceHash: 'parity-hash-alpha',
					rebuilt: false,
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
				ensureParityBaseImage: vi.fn(async () => ({
					imageTag: 'agent-sidecar-base:node-py',
					imageDigest: 'sha256:2222222222222222222222222222222222222222222222222222222222222222',
					sourceHash: 'parity-hash-beta',
					rebuilt: false,
				})),
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).not.toBe(second.fingerprint);
		expect(first.imagePath).not.toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(2);
	});

	it('rebuilds guest assets when parity base image was rebuilt with same fingerprint inputs', async () => {
		setTempHome();
		const agentVmRoot = fs.realpathSync(getAgentVmRoot());
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});
		const withOverlay: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'agent-sidecar-base:node-py',
				dockerfile: path.join(agentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
				contextDir: agentVmRoot,
				buildArgs: {},
			},
		};
		const buildOverlayImageAndResolveDigest = vi.fn(async () => ({
			imageRef:
				'agent-vm-overlay:stable@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}));
		const ensureParityBaseImage = vi
			.fn()
			.mockResolvedValueOnce({
				imageTag: 'agent-sidecar-base:node-py',
				imageDigest: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
				sourceHash: 'parity-hash-stable',
				rebuilt: false,
			})
			.mockResolvedValueOnce({
				imageTag: 'agent-sidecar-base:node-py',
				imageDigest: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
				sourceHash: 'parity-hash-stable',
				rebuilt: true,
			});

		const first = await buildGuestAssets(
			{
				buildConfig: withOverlay,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
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
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).toBe(second.fingerprint);
		expect(first.imagePath).toBe(second.imagePath);
		expect(second.built).toBe(true);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(2);
	});

	it('uses overlay digest in fingerprint identity for non-parity overlays', async () => {
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
		const buildOverlayImageAndResolveDigest = vi
			.fn()
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:first@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			})
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:second@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			});
		const ensureParityBaseImage = vi.fn();

		const first = await buildGuestAssets(
			{
				buildConfig: withOverlay,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
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
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).not.toBe(second.fingerprint);
		expect(first.imagePath).not.toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(2);
		expect(ensureParityBaseImage).not.toHaveBeenCalled();
	});

	it('uses overlay digest in fingerprint identity for custom overlays on sidecar base', async () => {
		setTempHome();
		const buildAssetsIntoDir = vi.fn(async (outputDir: string, _config: BuildConfig) => {
			writeFakeBuiltAssets(outputDir);
		});
		const withOverlay: BuildConfig = {
			...BASE_CONFIG,
			ociOverlay: {
				baseImage: 'agent-sidecar-base:node-py',
				dockerfile: '/tmp/custom-overlay.dockerfile',
				contextDir: '/tmp',
				buildArgs: {},
			},
		};
		const buildOverlayImageAndResolveDigest = vi
			.fn()
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:first@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			})
			.mockResolvedValueOnce({
				imageRef:
					'agent-vm-overlay:second@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			});
		const ensureParityBaseImage = vi
			.fn()
			.mockResolvedValue({
				imageTag: 'agent-sidecar-base:node-py',
				imageDigest: 'sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
				sourceHash: 'parity-hash-constant',
				rebuilt: false,
			});

		const first = await buildGuestAssets(
			{
				buildConfig: withOverlay,
				workspaceHash: 'workspace-a',
				fullReset: false,
			},
			{
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
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
				buildOverlayImageAndResolveDigest,
				ensureParityBaseImage,
				buildAssetsIntoDir,
			},
		);

		expect(first.fingerprint).not.toBe(second.fingerprint);
		expect(first.imagePath).not.toBe(second.imagePath);
		expect(buildAssetsIntoDir).toHaveBeenCalledTimes(2);
		expect(ensureParityBaseImage).toHaveBeenCalledTimes(2);
	});
});

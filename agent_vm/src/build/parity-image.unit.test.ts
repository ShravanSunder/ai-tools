import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	computeParitySourceHash,
	ensureParityBaseImage,
	resolveParitySourceInputs,
} from '#src/build/parity-image.js';

const pathsToCleanup: string[] = [];

afterEach(() => {
	vi.restoreAllMocks();
	for (const targetPath of pathsToCleanup.splice(0)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}
});

describe('parity image', () => {
	it('computes stable source hash for identical parity inputs', async () => {
		const first = computeParitySourceHash([
			{
				logicalPath: 'agent_vm/config/parity/agent-vm-parity.overlay.dockerfile',
				filePath: 'config/parity/agent-vm-parity.overlay.dockerfile',
			},
		]);
		const second = computeParitySourceHash([
			{
				logicalPath: 'agent_vm/config/parity/agent-vm-parity.overlay.dockerfile',
				filePath: 'config/parity/agent-vm-parity.overlay.dockerfile',
			},
		]);

		expect(first).toBe(second);
		expect(first).toMatch(/^[a-f0-9]{12,64}$/u);
	});

	it('changes source hash when parity inputs change', async () => {
		const first = computeParitySourceHash([
			{
				logicalPath: 'agent_vm/config/parity/agent-vm-parity.overlay.dockerfile',
				filePath: 'config/parity/agent-vm-parity.overlay.dockerfile',
			},
		]);
		const second = computeParitySourceHash([
			{
				logicalPath: 'agent_vm/config/parity/agent-vm-parity.overlay.dockerfile',
				filePath: 'config/parity/agent-vm-parity.overlay.dockerfile',
			},
			{
				logicalPath: 'agent_vm/config/parity/extra.base.zshrc',
				filePath: 'config/parity/extra.base.zshrc',
			},
		]);

		expect(first).not.toBe(second);
	});

	it('is invariant across checkout locations when logical paths and content match', async () => {
		const firstRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-root-a-'));
		const secondRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-root-b-'));
		pathsToCleanup.push(firstRoot, secondRoot);

		const relativeFilePath = path.join('agent_sidecar', 'node-py.base.dockerfile');
		const firstPath = path.join(firstRoot, relativeFilePath);
		const secondPath = path.join(secondRoot, relativeFilePath);
		fs.mkdirSync(path.dirname(firstPath), { recursive: true });
		fs.mkdirSync(path.dirname(secondPath), { recursive: true });
		fs.writeFileSync(firstPath, 'FROM scratch\n', 'utf8');
		fs.writeFileSync(secondPath, 'FROM scratch\n', 'utf8');

		const first = computeParitySourceHash([
			{
				logicalPath: relativeFilePath,
				filePath: firstPath,
			},
		]);
		const second = computeParitySourceHash([
			{
				logicalPath: relativeFilePath,
				filePath: secondPath,
			},
		]);

		expect(first).toBe(second);
	});

	it('changes hash when file contents change for same path list', async () => {
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-hash-'));
		pathsToCleanup.push(tempDir);
		try {
			const parityInput = path.join(tempDir, 'parity-input.txt');
			fs.writeFileSync(parityInput, 'alpha', 'utf8');
			const first = computeParitySourceHash([
				{
					logicalPath: 'test/parity-input.txt',
					filePath: parityInput,
				},
			]);
			fs.writeFileSync(parityInput, 'beta', 'utf8');
			const second = computeParitySourceHash([
				{
					logicalPath: 'test/parity-input.txt',
					filePath: parityInput,
				},
			]);

			expect(first).not.toBe(second);
		} finally {
			// cleanup is handled in afterEach
		}
	});

	it('includes sidecar .dockerignore in parity source hash inputs', async () => {
		const fakeRepositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-dockerignore-'));
		pathsToCleanup.push(fakeRepositoryRoot);
		const fakeAgentVmRoot = path.join(fakeRepositoryRoot, 'agent_vm');
		const fakeSidecarRoot = path.join(fakeRepositoryRoot, 'agent_sidecar');
		fs.mkdirSync(path.join(fakeAgentVmRoot, 'config', 'parity'), { recursive: true });
		fs.mkdirSync(path.join(fakeSidecarRoot, 'setup'), { recursive: true });
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
			'FROM scratch\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'extra.base.zshrc'),
			'alias ll="ls -la"\n',
			'utf8',
		);
		fs.writeFileSync(path.join(fakeSidecarRoot, 'node-py.base.dockerfile'), 'FROM scratch\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, '.dockerignore'), '.git\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, 'setup', 'extra.base.zshrc'), 'export LANG=C.UTF-8\n', 'utf8');
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'playwright-wrapper.sh'),
			'#!/bin/sh\necho playwright\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'firewall.sh'),
			'#!/bin/sh\necho firewall\n',
			'utf8',
		);

		const first = computeParitySourceHash(resolveParitySourceInputs(fakeAgentVmRoot));
		fs.writeFileSync(path.join(fakeSidecarRoot, '.dockerignore'), '.git\nnode_modules\n', 'utf8');
		const second = computeParitySourceHash(resolveParitySourceInputs(fakeAgentVmRoot));
		expect(first).not.toBe(second);
	});

	it('throws actionable error when sidecar dockerfile source is missing', async () => {
		const fakeRepositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-missing-'));
		pathsToCleanup.push(fakeRepositoryRoot);
		const fakeAgentVmRoot = path.join(fakeRepositoryRoot, 'agent_vm');
		fs.mkdirSync(fakeAgentVmRoot, { recursive: true });

		await expect(
			ensureParityBaseImage({
				runCommand: vi.fn(async () => ({ exitCode: 0, stdout: '', stderr: '' })),
				getAgentVmRoot: () => fakeAgentVmRoot,
			}),
		).rejects.toThrowError(/Missing sidecar dockerfile source/u);
	});

	it('builds parity base image when inspect misses and returns stable source hash', async () => {
		const fakeRepositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-build-'));
		pathsToCleanup.push(fakeRepositoryRoot);
		const fakeAgentVmRoot = path.join(fakeRepositoryRoot, 'agent_vm');
		const fakeSidecarRoot = path.join(fakeRepositoryRoot, 'agent_sidecar');
		fs.mkdirSync(path.join(fakeAgentVmRoot, 'config', 'parity'), { recursive: true });
		fs.mkdirSync(path.join(fakeSidecarRoot, 'setup'), { recursive: true });
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
			'FROM scratch\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'extra.base.zshrc'),
			'alias ll="ls -la"\n',
			'utf8',
		);
		fs.writeFileSync(path.join(fakeSidecarRoot, 'node-py.base.dockerfile'), 'FROM scratch\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, '.dockerignore'), '.git\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, 'setup', 'extra.base.zshrc'), 'export LANG=C.UTF-8\n', 'utf8');
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'playwright-wrapper.sh'),
			'#!/bin/sh\necho playwright\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'firewall.sh'),
			'#!/bin/sh\necho firewall\n',
			'utf8',
		);

		const expectedSourceHash = computeParitySourceHash(resolveParitySourceInputs(fakeAgentVmRoot));
		const runCommand = vi
			.fn()
			.mockResolvedValueOnce({
				exitCode: 1,
				stdout: '',
				stderr: 'No such image',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: 'built',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: `sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa|${expectedSourceHash}`,
				stderr: '',
			});
		const result = await ensureParityBaseImage({
			runCommand,
			getAgentVmRoot: () => fakeAgentVmRoot,
		});

		expect(result.imageTag).toBe('agent-sidecar-base:node-py');
		expect(result.imageDigest).toBe(
			'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		);
		expect(result.sourceHash).toBe(expectedSourceHash);
		expect(runCommand).toHaveBeenNthCalledWith(
			1,
			'docker',
			[
				'image',
				'inspect',
				'--format',
				'{{.Id}}|{{with .Config.Labels}}{{index . "io.agent-vm.parity-source-hash"}}{{end}}',
				'agent-sidecar-base:node-py',
			],
		);
		expect(runCommand).toHaveBeenNthCalledWith(
			2,
			'docker',
			[
				'build',
				'--file',
				path.join(fakeSidecarRoot, 'node-py.base.dockerfile'),
				'--tag',
				'agent-sidecar-base:node-py',
				'--label',
				`io.agent-vm.parity-source-hash=${expectedSourceHash}`,
				fakeSidecarRoot,
			],
		);
	});

	it('rebuilds parity base image when existing image label hash is stale', async () => {
		const fakeRepositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-parity-rebuild-'));
		pathsToCleanup.push(fakeRepositoryRoot);
		const fakeAgentVmRoot = path.join(fakeRepositoryRoot, 'agent_vm');
		const fakeSidecarRoot = path.join(fakeRepositoryRoot, 'agent_sidecar');
		fs.mkdirSync(path.join(fakeAgentVmRoot, 'config', 'parity'), { recursive: true });
		fs.mkdirSync(path.join(fakeSidecarRoot, 'setup'), { recursive: true });
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'agent-vm-parity.overlay.dockerfile'),
			'FROM scratch\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeAgentVmRoot, 'config', 'parity', 'extra.base.zshrc'),
			'alias ll="ls -la"\n',
			'utf8',
		);
		fs.writeFileSync(path.join(fakeSidecarRoot, 'node-py.base.dockerfile'), 'FROM scratch\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, '.dockerignore'), '.git\n', 'utf8');
		fs.writeFileSync(path.join(fakeSidecarRoot, 'setup', 'extra.base.zshrc'), 'export LANG=C.UTF-8\n', 'utf8');
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'playwright-wrapper.sh'),
			'#!/bin/sh\necho playwright\n',
			'utf8',
		);
		fs.writeFileSync(
			path.join(fakeSidecarRoot, 'setup', 'firewall.sh'),
			'#!/bin/sh\necho firewall\n',
			'utf8',
		);

		const expectedSourceHash = computeParitySourceHash(resolveParitySourceInputs(fakeAgentVmRoot));
		const runCommand = vi
			.fn()
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout:
					'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa|stale-source-hash',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: 'rebuilt',
				stderr: '',
			})
			.mockResolvedValueOnce({
				exitCode: 0,
				stdout: `sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb|${expectedSourceHash}`,
				stderr: '',
			});

		const result = await ensureParityBaseImage({
			runCommand,
			getAgentVmRoot: () => fakeAgentVmRoot,
		});

		expect(result.sourceHash).toBe(expectedSourceHash);
		expect(result.imageDigest).toBe(
			'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		);
		expect(runCommand).toHaveBeenCalledTimes(3);
	});
});

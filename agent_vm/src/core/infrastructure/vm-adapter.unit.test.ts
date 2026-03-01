import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createVmRuntime } from '#src/core/infrastructure/vm-adapter.js';
import type { BuildConfig } from '#src/core/models/build-config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';
import { NoopLogger } from '#src/core/platform/logger.js';

const gondolinMockState = vi.hoisted(() => ({
	lastCreateVmOptions: null as Record<string, unknown> | null,
	lastCreateHttpHooksOptions: null as Record<string, unknown> | null,
	vmExec: vi.fn(async (_command: string) => ({ exitCode: 0, stdout: '', stderr: '' })),
	vmClose: vi.fn(async () => {}),
}));

vi.mock('@earendil-works/gondolin', () => {
	class RealFSProvider {
		public constructor(public readonly rootPath: string) {}
	}

	class MemoryProvider {
		public readonly kind = 'memory';
	}

	class ReadonlyProvider {
		public constructor(public readonly provider: unknown) {}
	}

	class ShadowProvider {
		public constructor(
			public readonly provider: unknown,
			public readonly options: Record<string, unknown>,
		) {}
	}

	return {
		createHttpHooks: (options: Record<string, unknown>) => {
			gondolinMockState.lastCreateHttpHooksOptions = options;
			return {
				httpHooks: { type: 'httpHooksStub' },
				env: { GONDOLIN_HOOK_ENV: 'enabled' },
			};
		},
		createShadowPathPredicate: (paths: readonly string[]) => ({ paths }),
		RealFSProvider,
		MemoryProvider,
		ReadonlyProvider,
		ShadowProvider,
		VM: {
			create: async (options: Record<string, unknown>) => {
				gondolinMockState.lastCreateVmOptions = options;
				return {
					id: 'mock-vm-id',
					exec: gondolinMockState.vmExec,
					close: gondolinMockState.vmClose,
				};
			},
		},
	};
});

const directoriesToCleanup: string[] = [];

const DEFAULT_RUNTIME_CONFIG: VmRuntimeConfig = {
	rootfsMode: 'memory',
	memory: 2048,
	cpus: 2,
	idleTimeoutMinutes: 10,
	env: { HOME: '/home/agent' },
	volumes: {},
	shadows: {
		deny: ['.agent_vm', '.git'],
		tmpfs: ['node_modules', '.venv'],
	},
	readonlyMounts: {},
	extraMounts: {},
	monorepoDiscovery: true,
	initScripts: { background: null, foreground: null },
	shell: { zshrcExtra: null, atuin: { importOnFirstRun: true } },
	playwrightExtraHosts: [],
};

const DEFAULT_BUILD_CONFIG: BuildConfig = {
	arch: 'aarch64',
	distro: 'alpine',
};

afterEach(() => {
	for (const directoryPath of directoriesToCleanup.splice(0)) {
		fs.rmSync(directoryPath, { recursive: true, force: true });
	}
	vi.clearAllMocks();
	delete process.env.ANTHROPIC_API_KEY;
	delete process.env.OPENAI_API_KEY;
	delete process.env.GEMINI_API_KEY;
	delete process.env.GOOGLE_API_KEY;
	gondolinMockState.lastCreateVmOptions = null;
	gondolinMockState.lastCreateHttpHooksOptions = null;
});

beforeEach(() => {
	gondolinMockState.vmExec.mockReset();
	gondolinMockState.vmExec.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
	gondolinMockState.vmClose.mockReset();
	gondolinMockState.vmClose.mockResolvedValue(undefined);
});

describe('vm adapter', () => {
	it('passes sandbox.imagePath and rootfs mode into VM.create', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);

		await createVmRuntime({
			workDir,
			imagePath: '/tmp/agent-vm-image',
			runtimeConfig: DEFAULT_RUNTIME_CONFIG,
			buildConfig: DEFAULT_BUILD_CONFIG,
			allowedHosts: ['api.openai.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			resolvedVolumes: {},
			sessionLabel: 'session-no-tcp',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
			scratchpad: false,
		});

		const vmOptions = gondolinMockState.lastCreateVmOptions;
		expect(vmOptions).not.toBeNull();
		expect(vmOptions?.sandbox).toEqual({ imagePath: '/tmp/agent-vm-image' });
		expect(vmOptions?.rootfs).toEqual({ mode: 'memory' });
	});

	it('creates vm with dns+tcp mapping when tcpHosts are provided', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);

		await createVmRuntime({
			workDir,
			imagePath: '/tmp/agent-vm-image',
			runtimeConfig: DEFAULT_RUNTIME_CONFIG,
			buildConfig: DEFAULT_BUILD_CONFIG,
			allowedHosts: ['api.openai.com'],
			tcpHosts: { 'pg.vm.host:5432': '127.0.0.1:15432' },
			tcpServiceEnvVars: { PGHOST: 'pg.vm.host', PGPORT: '5432' },
			resolvedVolumes: {},
			sessionLabel: 'session-tcp',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
			scratchpad: false,
		});

		const vmOptions = gondolinMockState.lastCreateVmOptions;
		expect(vmOptions?.dns).toEqual({ mode: 'synthetic', syntheticHostMapping: 'per-host' });
		expect(vmOptions?.tcp).toEqual({
			hosts: { 'pg.vm.host:5432': '127.0.0.1:15432' },
		});
	});

	it('builds workspace VFS mount and resolved volume mounts', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		const volumeHostPath = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-volume-'));
		directoriesToCleanup.push(workDir, volumeHostPath);

		await createVmRuntime({
			workDir,
			imagePath: '/tmp/agent-vm-image',
			runtimeConfig: DEFAULT_RUNTIME_CONFIG,
			buildConfig: DEFAULT_BUILD_CONFIG,
			allowedHosts: ['api.openai.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			resolvedVolumes: {
				venv: {
					hostDir: volumeHostPath,
					guestPath: path.join(workDir, '.venv'),
				},
			},
			sessionLabel: 'session-vfs',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
			scratchpad: false,
		});

		const vfs = gondolinMockState.lastCreateVmOptions?.vfs as {
			mounts: Record<string, unknown>;
		};
		expect(vfs).toBeDefined();
		expect(Object.keys(vfs.mounts)).toContain(workDir);
		expect(Object.keys(vfs.mounts)).toContain(path.join(workDir, '.venv'));
	});

	it('uses MemoryProvider for workspace mount when scratchpad is enabled', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);

		await createVmRuntime({
			workDir,
			imagePath: '/tmp/agent-vm-image',
			runtimeConfig: DEFAULT_RUNTIME_CONFIG,
			buildConfig: DEFAULT_BUILD_CONFIG,
			allowedHosts: ['api.openai.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			resolvedVolumes: {},
			sessionLabel: 'session-scratchpad',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
			scratchpad: true,
		});

		const vfs = gondolinMockState.lastCreateVmOptions?.vfs as {
			mounts: Record<string, unknown>;
		};
		const workspaceProvider = vfs.mounts[workDir] as { provider?: unknown };
		expect(workspaceProvider).toBeDefined();
	});

	it('forwards host API key env vars into createHttpHooks secret config', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);
		process.env.ANTHROPIC_API_KEY = 'anthropic-key';
		process.env.OPENAI_API_KEY = 'openai-key';
		process.env.GEMINI_API_KEY = 'gemini-key';

		await createVmRuntime({
			workDir,
			imagePath: '/tmp/agent-vm-image',
			runtimeConfig: DEFAULT_RUNTIME_CONFIG,
			buildConfig: DEFAULT_BUILD_CONFIG,
			allowedHosts: ['api.openai.com', 'api.anthropic.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			resolvedVolumes: {},
			sessionLabel: 'session-secrets',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
			scratchpad: false,
		});

		const hookOptions = gondolinMockState.lastCreateHttpHooksOptions as {
			secrets?: Record<string, unknown>;
		};
		expect(hookOptions.secrets).toMatchObject({
			ANTHROPIC_API_KEY: {
				hosts: ['api.anthropic.com'],
				value: 'anthropic-key',
			},
			OPENAI_API_KEY: {
				hosts: ['api.openai.com'],
				value: 'openai-key',
			},
			GEMINI_API_KEY: {
				hosts: ['generativelanguage.googleapis.com'],
				value: 'gemini-key',
			},
		});
	});
});

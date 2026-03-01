import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createVmRuntime } from '#src/core/infrastructure/vm-adapter.js';
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

afterEach(() => {
	for (const directory of directoriesToCleanup.splice(0)) {
		fs.rmSync(directory, { recursive: true, force: true });
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
	it('creates vm without tcp mapping when no tcpHosts are configured', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);

		await createVmRuntime({
			workDir,
			allowedHosts: ['api.openai.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			sessionLabel: 'session-no-tcp',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
		});

		const vmOptions = gondolinMockState.lastCreateVmOptions;
		expect(vmOptions).not.toBeNull();
		expect(vmOptions?.['tcp']).toBeUndefined();
		expect(vmOptions?.['dns']).toBeUndefined();
	});

	it('creates vm with dns+tpc mapping when tcpHosts are provided', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);

		await createVmRuntime({
			workDir,
			allowedHosts: ['api.openai.com'],
			tcpHosts: { 'pg.vm.host:5432': '127.0.0.1:15432' },
			tcpServiceEnvVars: { PGHOST: 'pg.vm.host', PGPORT: '5432' },
			sessionLabel: 'session-tcp',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
		});

		const vmOptions = gondolinMockState.lastCreateVmOptions;
		expect(vmOptions?.['dns']).toEqual({ mode: 'synthetic', syntheticHostMapping: 'per-host' });
		expect(vmOptions?.['tcp']).toEqual({
			hosts: { 'pg.vm.host:5432': '127.0.0.1:15432' },
		});

		const env = vmOptions?.['env'] as Record<string, string>;
		expect(env.WORKSPACE).toBe(workDir);
		expect(env.PGHOST).toBe('pg.vm.host');
		expect(env.PGPORT).toBe('5432');
		expect(env.AGENT_VM_AUTH_SOURCE).toBe('/tmp/session-auth');
	});

	it('mounts workspace and readonly .git when repository metadata exists', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);
		fs.mkdirSync(path.join(workDir, '.git'), { recursive: true });

		await createVmRuntime({
			workDir,
			allowedHosts: ['api.openai.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			sessionLabel: 'session-vfs',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
		});

		const vfs = gondolinMockState.lastCreateVmOptions?.['vfs'] as {
			mounts: Record<string, unknown>;
		};
		expect(vfs).toBeDefined();
		expect(Object.keys(vfs.mounts)).toContain(workDir);
		expect(Object.keys(vfs.mounts)).toContain(path.join(workDir, '.git'));
	});

	it('forwards host API key env vars into createHttpHooks secret config', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-adapter-'));
		directoriesToCleanup.push(workDir);
		process.env.ANTHROPIC_API_KEY = 'anthropic-key';
		process.env.OPENAI_API_KEY = 'openai-key';
		process.env.GEMINI_API_KEY = 'gemini-key';

		await createVmRuntime({
			workDir,
			allowedHosts: ['api.openai.com', 'api.anthropic.com'],
			tcpHosts: {},
			tcpServiceEnvVars: {},
			sessionLabel: 'session-secrets',
			logger: new NoopLogger(),
			sessionAuthRoot: '/tmp/session-auth',
		});

		const hookOptions = gondolinMockState.lastCreateHttpHooksOptions as {
			secrets?: Record<string, unknown>;
		};
		expect(hookOptions).toBeDefined();
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

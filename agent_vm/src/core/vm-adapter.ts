import path from 'node:path';
import type { Duplex } from 'node:stream';
import { pathToFileURL } from 'node:url';

import type { Logger } from './logger.js';
import type { GuestLoopbackStreamOpener } from './tunnel-manager.js';

export interface VmExecResult {
	exitCode: number;
	stdout: string;
	stderr: string;
}

export interface VmRuntime extends GuestLoopbackStreamOpener {
	getId(): string;
	exec(command: string): Promise<VmExecResult>;
	close(): Promise<void>;
}

export interface CreateVmRuntimeOptions {
	workDir: string;
	allowedHosts: readonly string[];
	sessionLabel: string;
	logger: Logger;
	sessionAuthRoot: string;
}

function buildSecretSpecFromHostEnv(): Record<string, { hosts: string[]; value: string }> {
	const secretMap: Record<string, { hosts: string[]; value: string }> = {};

	const anthropicKey = process.env.ANTHROPIC_API_KEY;
	if (anthropicKey) {
		secretMap.ANTHROPIC_API_KEY = {
			hosts: ['api.anthropic.com'],
			value: anthropicKey,
		};
	}

	const openaiKey = process.env.OPENAI_API_KEY;
	if (openaiKey) {
		secretMap.OPENAI_API_KEY = {
			hosts: ['api.openai.com'],
			value: openaiKey,
		};
	}

	const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
	if (geminiKey) {
		secretMap.GEMINI_API_KEY = {
			hosts: ['generativelanguage.googleapis.com'],
			value: geminiKey,
		};
	}

	return secretMap;
}

function createVfsMountConfig(workDir: string): Record<string, unknown> {
	const hiddenPaths = ['/node_modules', '/.venv', '/.agent_vm', '/dist', '/.next', '/__pycache__'];

	return {
		workDir,
		hiddenPaths,
	};
}

class GondolinVmRuntime implements VmRuntime {
	public constructor(
		private readonly vmHandle: {
			id?: string;
			exec: (
				command: string | string[],
				options?: Record<string, unknown>,
			) => Promise<{
				exitCode: number;
				stdout?: string;
				stderr?: string;
			}>;
			close: () => Promise<void>;
			openTcpStream?: (input: {
				host: string;
				port: number;
				timeoutMs?: number;
			}) => Promise<Duplex>;
		},
		private readonly logger: Logger,
	) {}

	public getId(): string {
		return this.vmHandle.id ?? 'unknown-vm-id';
	}

	public async exec(command: string): Promise<VmExecResult> {
		const result = await this.vmHandle.exec(command);
		return {
			exitCode: result.exitCode,
			stdout: result.stdout ?? '',
			stderr: result.stderr ?? '',
		};
	}

	public async openGuestLoopbackStream(input: {
		host?: '127.0.0.1' | 'localhost';
		port: number;
		timeoutMs?: number;
	}): Promise<Duplex> {
		if (!this.vmHandle.openTcpStream) {
			this.logger.log('warn', 'vm-adapter', 'openTcpStream unavailable on current gondolin build');
			throw new Error('openTcpStream is unavailable; pin gondolin with loopback stream support');
		}

		const openRequest: { host: string; port: number; timeoutMs?: number } = {
			host: input.host ?? '127.0.0.1',
			port: input.port,
		};
		if (typeof input.timeoutMs === 'number') {
			openRequest.timeoutMs = input.timeoutMs;
		}

		return this.vmHandle.openTcpStream(openRequest);
	}

	public async close(): Promise<void> {
		await this.vmHandle.close();
	}
}

export async function createVmRuntime(options: CreateVmRuntimeOptions): Promise<VmRuntime> {
	let gondolinModule: Record<string, unknown>;

	try {
		gondolinModule = (await import('@earendil-works/gondolin')) as Record<string, unknown>;
	} catch {
		try {
			const fallbackPath = pathToFileURL(
				path.join(options.workDir, 'node_modules', '@earendil-works', 'gondolin'),
			).href;
			gondolinModule = (await import(fallbackPath)) as Record<string, unknown>;
		} catch (error) {
			throw new Error(`Unable to load @earendil-works/gondolin: ${String(error)}`, {
				cause: error,
			});
		}
	}

	const createHttpHooks = gondolinModule.createHttpHooks as
		| ((input: Record<string, unknown>) => {
				httpHooks: unknown;
				env: Record<string, string>;
		  })
		| undefined;
	const VM = gondolinModule.VM as
		| {
				create: (input: Record<string, unknown>) => Promise<{
					id?: string;
					exec: (
						command: string | string[],
						execOptions?: Record<string, unknown>,
					) => Promise<{ exitCode: number; stdout?: string; stderr?: string }>;
					close: () => Promise<void>;
					openTcpStream?: (input: {
						host: string;
						port: number;
						timeoutMs?: number;
					}) => Promise<Duplex>;
				}>;
		  }
		| undefined;

	if (!createHttpHooks || !VM) {
		throw new Error('Gondolin module missing VM/createHttpHooks exports');
	}

	const secretSpec = buildSecretSpecFromHostEnv();
	const hooks = createHttpHooks({
		allowedHosts: [...options.allowedHosts],
		secrets: secretSpec,
	});

	const vm = await VM.create({
		sessionLabel: options.sessionLabel,
		env: {
			...hooks.env,
			WORKSPACE: '/workspace',
			HOME: '/home/agent',
			AGENT_VM_AUTH_ROOT: '/home/agent/.auth',
			AGENT_VM_AUTH_SOURCE: options.sessionAuthRoot,
			PGHOST: '127.0.0.1',
			PGPORT: '15432',
			REDIS_HOST: '127.0.0.1',
			REDIS_PORT: '16379',
			REDIS_URL: 'redis://127.0.0.1:16379/0',
		},
		httpHooks: hooks.httpHooks,
		vfs: createVfsMountConfig(options.workDir),
	});

	options.logger.log('info', 'vm-adapter', 'vm runtime created', {
		vmId: vm.id ?? 'unknown',
	});

	return new GondolinVmRuntime(vm, options.logger);
}

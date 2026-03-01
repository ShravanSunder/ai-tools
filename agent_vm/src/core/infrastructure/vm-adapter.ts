import fs from 'node:fs';
import path from 'node:path';
import { Duplex } from 'node:stream';

import type { GuestLoopbackStreamOpener } from '#src/core/infrastructure/tunnel-manager.js';
import type { Logger } from '#src/core/platform/logger.js';

type GondolinModule = typeof import('@earendil-works/gondolin');
type GondolinVmOptions = NonNullable<Parameters<GondolinModule['VM']['create']>[0]>;
type GondolinVm = Awaited<ReturnType<GondolinModule['VM']['create']>>;
type GondolinCreateHttpHooksInput = Parameters<GondolinModule['createHttpHooks']>[0];
type GondolinCreateHttpHooksOutput = ReturnType<GondolinModule['createHttpHooks']>;
type GondolinRealFsProvider = InstanceType<GondolinModule['RealFSProvider']>;
type GondolinReadonlyProvider = InstanceType<GondolinModule['ReadonlyProvider']>;
type GondolinReadonlyProviderInput = ConstructorParameters<GondolinModule['ReadonlyProvider']>[0];
type GondolinShadowProvider = InstanceType<GondolinModule['ShadowProvider']>;
type GondolinShadowProviderInput = ConstructorParameters<GondolinModule['ShadowProvider']>[0];
type GondolinShadowProviderOptions = ConstructorParameters<GondolinModule['ShadowProvider']>[1];
type GondolinShadowPathPredicateInput = Parameters<GondolinModule['createShadowPathPredicate']>[0];
type GondolinShadowPathPredicate = ReturnType<GondolinModule['createShadowPathPredicate']>;
type GondolinVmVfs = NonNullable<GondolinVmOptions['vfs']>;

const SENSITIVE_SHADOW_PATHS = ['/.agent_vm', '/.git', '/dist', '/.next', '/__pycache__'] as const;
const HOST_ARCH_SHADOW_PATHS = ['/node_modules', '/.venv'] as const;

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

interface LoopbackStreamOpener {
	openTcpStream(input: { host: string; port: number; timeoutMs?: number }): Promise<Duplex>;
}

interface SecretSpec {
	hosts: string[];
	value: string;
}

interface GondolinModuleLike {
	createVm(options: GondolinVmOptions): Promise<GondolinVm>;
	createHttpHooks(options: GondolinCreateHttpHooksInput): GondolinCreateHttpHooksOutput;
	createRealFsProvider(rootPath: string): GondolinRealFsProvider;
	createReadonlyProvider(provider: GondolinReadonlyProviderInput): GondolinReadonlyProvider;
	createShadowProvider(
		provider: GondolinShadowProviderInput,
		options: GondolinShadowProviderOptions,
	): GondolinShadowProvider;
	createShadowPathPredicate(paths: GondolinShadowPathPredicateInput): GondolinShadowPathPredicate;
}

interface GondolinVmWithPrivateLoopback {
	server?: {
		openTcpStream?: (input: { host: string; port: number; timeoutMs?: number }) => Promise<Duplex>;
	};
}

function buildSecretSpecFromHostEnv(): Record<string, SecretSpec> {
	const secretMap: Record<string, SecretSpec> = {};

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

function createWorkspaceVfsMount(
	workDir: string,
	gondolinModule: GondolinModuleLike,
): GondolinVmVfs {
	const baseProvider = gondolinModule.createRealFsProvider(workDir);
	const hideSensitivePaths = gondolinModule.createShadowProvider(baseProvider, {
		shouldShadow: gondolinModule.createShadowPathPredicate([...SENSITIVE_SHADOW_PATHS]),
		writeMode: 'deny',
	});
	const hideHostArchSpecificDirs = gondolinModule.createShadowProvider(hideSensitivePaths, {
		shouldShadow: gondolinModule.createShadowPathPredicate([...HOST_ARCH_SHADOW_PATHS]),
		writeMode: 'tmpfs',
	});

	const mounts: NonNullable<GondolinVmVfs['mounts']> = {
		[workDir]: hideHostArchSpecificDirs,
	};

	const gitPath = path.join(workDir, '.git');
	if (path.isAbsolute(gitPath) && fs.existsSync(gitPath)) {
		const gitProvider = gondolinModule.createReadonlyProvider(
			gondolinModule.createRealFsProvider(gitPath),
		);
		mounts[gitPath] = gitProvider;
	}

	return { mounts };
}

function shellEscape(value: string): string {
	return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

function resolveLoopbackStreamOpener(vm: GondolinVm): LoopbackStreamOpener | null {
	const vmWithPrivateLoopback = vm as unknown as GondolinVmWithPrivateLoopback;
	const server = vmWithPrivateLoopback.server;
	const boundOpenTcpStream = server?.openTcpStream?.bind(server);
	if (!boundOpenTcpStream) {
		return null;
	}
	return {
		openTcpStream: async (input: {
			host: string;
			port: number;
			timeoutMs?: number;
		}): Promise<Duplex> => {
			const stream = await boundOpenTcpStream(input);
			if (!(stream instanceof Duplex)) {
				throw new Error('Gondolin loopback bridge returned a non-Duplex stream');
			}
			return stream;
		},
	};
}

class GondolinVmRuntime implements VmRuntime {
	public constructor(
		private readonly vmHandle: GondolinVm,
		private readonly streamOpener: LoopbackStreamOpener | null,
		private readonly logger: Logger,
	) {}

	public getId(): string {
		return this.vmHandle.id;
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
		if (!this.streamOpener) {
			this.logger.log('error', 'vm-adapter', 'gondolin VM loopback bridge is unavailable');
			throw new Error(
				'Gondolin VM loopback bridge is unavailable. Pin @earendil-works/gondolin to a supported release.',
			);
		}

		const openRequest: { host: string; port: number; timeoutMs?: number } = {
			host: input.host ?? '127.0.0.1',
			port: input.port,
		};
		if (typeof input.timeoutMs === 'number') {
			openRequest.timeoutMs = input.timeoutMs;
		}
		return this.streamOpener.openTcpStream(openRequest);
	}

	public async close(): Promise<void> {
		await this.vmHandle.close();
	}
}

async function loadGondolinModule(): Promise<GondolinModuleLike> {
	let gondolin: GondolinModule;
	try {
		gondolin = await import('@earendil-works/gondolin');
	} catch (error: unknown) {
		throw new Error(
			`Unable to load @earendil-works/gondolin. Ensure dependencies are installed. ${String(error)}`,
			{ cause: error },
		);
	}

	return {
		createVm: async (options: GondolinVmOptions) => await gondolin.VM.create(options),
		createHttpHooks: (options: GondolinCreateHttpHooksInput): GondolinCreateHttpHooksOutput =>
			gondolin.createHttpHooks(options),
		createRealFsProvider: (rootPath: string): GondolinRealFsProvider =>
			new gondolin.RealFSProvider(rootPath),
		createReadonlyProvider: (provider: GondolinReadonlyProviderInput): GondolinReadonlyProvider =>
			new gondolin.ReadonlyProvider(provider),
		createShadowProvider: (
			provider: GondolinShadowProviderInput,
			options: GondolinShadowProviderOptions,
		): GondolinShadowProvider => new gondolin.ShadowProvider(provider, options),
		createShadowPathPredicate: (
			paths: GondolinShadowPathPredicateInput,
		): GondolinShadowPathPredicate => gondolin.createShadowPathPredicate(paths),
	};
}

export async function createVmRuntime(options: CreateVmRuntimeOptions): Promise<VmRuntime> {
	const gondolinModule = await loadGondolinModule();

	const hooks = gondolinModule.createHttpHooks({
		allowedHosts: [...options.allowedHosts],
		secrets: buildSecretSpecFromHostEnv(),
	});

	const workspaceShellPath = shellEscape(options.workDir);
	const vm = await gondolinModule.createVm({
		sessionLabel: options.sessionLabel,
		env: {
			...hooks.env,
			WORKSPACE: options.workDir,
			PWD: options.workDir,
			HOME: '/home/agent',
			AGENT_VM_AUTH_ROOT: '/home/agent/.auth',
			AGENT_VM_AUTH_SOURCE: options.sessionAuthRoot,
			AGENT_VM_INIT_SCRIPT: `cd ${workspaceShellPath}`,
			PGHOST: '127.0.0.1',
			PGPORT: '15432',
			REDIS_HOST: '127.0.0.1',
			REDIS_PORT: '16379',
			REDIS_URL: 'redis://127.0.0.1:16379/0',
		},
		httpHooks: hooks.httpHooks,
		vfs: createWorkspaceVfsMount(options.workDir, gondolinModule),
	});

	const streamOpener = resolveLoopbackStreamOpener(vm);
	if (!streamOpener) {
		options.logger.log(
			'warn',
			'vm-adapter',
			'gondolin VM object does not expose private server.openTcpStream bridge',
		);
	}

	options.logger.log('info', 'vm-adapter', 'vm runtime created', {
		vmId: vm.id,
		workspacePath: options.workDir,
	});

	return new GondolinVmRuntime(vm, streamOpener, options.logger);
}

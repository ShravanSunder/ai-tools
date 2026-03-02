import fs from 'node:fs';
import path from 'node:path';

import type { ResolvedVolume } from '#src/core/infrastructure/volume-manager.js';
import type { BuildConfig } from '#src/core/models/build-config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';
import type { Logger } from '#src/core/platform/logger.js';

type GondolinModule = typeof import('@earendil-works/gondolin');
type GondolinVmOptions = NonNullable<Parameters<GondolinModule['VM']['create']>[0]>;
type GondolinVm = Awaited<ReturnType<GondolinModule['VM']['create']>>;
type GondolinCreateHttpHooksInput = Parameters<GondolinModule['createHttpHooks']>[0];
type GondolinCreateHttpHooksOutput = ReturnType<GondolinModule['createHttpHooks']>;
type GondolinRealFsProvider = InstanceType<GondolinModule['RealFSProvider']>;
type GondolinMemoryProvider = InstanceType<GondolinModule['MemoryProvider']>;
type GondolinReadonlyProvider = InstanceType<GondolinModule['ReadonlyProvider']>;
type GondolinReadonlyProviderInput = ConstructorParameters<GondolinModule['ReadonlyProvider']>[0];
type GondolinShadowProvider = InstanceType<GondolinModule['ShadowProvider']>;
type GondolinShadowProviderInput = ConstructorParameters<GondolinModule['ShadowProvider']>[0];
type GondolinShadowProviderOptions = ConstructorParameters<GondolinModule['ShadowProvider']>[1];
type GondolinShadowPathPredicateInput = Parameters<GondolinModule['createShadowPathPredicate']>[0];
type GondolinShadowPathPredicate = ReturnType<GondolinModule['createShadowPathPredicate']>;
type GondolinVmVfs = NonNullable<GondolinVmOptions['vfs']>;
type GondolinVfsMounts = NonNullable<GondolinVmVfs['mounts']>;

export interface VmExecResult {
	readonly exitCode: number;
	readonly stdout: string;
	readonly stderr: string;
}

export interface VmRuntime {
	getId(): string;
	exec(command: string): Promise<VmExecResult>;
	close(): Promise<void>;
}

export interface CreateVmRuntimeOptions {
	readonly workDir: string;
	readonly imagePath: string;
	readonly runtimeConfig: VmRuntimeConfig;
	readonly buildConfig: BuildConfig;
	readonly allowedHosts: readonly string[];
	readonly tcpHosts: Record<string, string>;
	readonly tcpServiceEnvVars: Record<string, string>;
	readonly resolvedVolumes: Record<string, ResolvedVolume>;
	readonly sessionLabel: string;
	readonly logger: Logger;
	readonly authReadonlyMounts: Readonly<Record<string, string>>;
	readonly scratchpad: boolean;
}

interface SecretSpec {
	readonly hosts: string[];
	readonly value: string;
}

interface GondolinModuleLike {
	createVm(options: GondolinVmOptions): Promise<GondolinVm>;
	createHttpHooks(options: GondolinCreateHttpHooksInput): GondolinCreateHttpHooksOutput;
	createRealFsProvider(rootPath: string): GondolinRealFsProvider;
	createMemoryProvider(): GondolinMemoryProvider;
	createReadonlyProvider(provider: GondolinReadonlyProviderInput): GondolinReadonlyProvider;
	createShadowProvider(
		provider: GondolinShadowProviderInput,
		options: GondolinShadowProviderOptions,
	): GondolinShadowProvider;
	createShadowPathPredicate(paths: GondolinShadowPathPredicateInput): GondolinShadowPathPredicate;
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

	const openAiKey = process.env.OPENAI_API_KEY;
	if (openAiKey) {
		secretMap.OPENAI_API_KEY = {
			hosts: ['api.openai.com'],
			value: openAiKey,
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

function shellEscape(value: string): string {
	return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

function normalizeShadowPath(pathValue: string): string {
	const trimmedPath = pathValue.trim();
	if (trimmedPath.startsWith('/')) {
		return trimmedPath;
	}
	const noLeadingCurrentDirectory = trimmedPath.startsWith('./')
		? trimmedPath.slice('./'.length)
		: trimmedPath;
	return `/${noLeadingCurrentDirectory}`;
}

function resolveMountTargetPath(workDir: string, mountKey: string): string {
	if (mountKey.startsWith('/')) {
		return mountKey;
	}
	return path.join(workDir, mountKey);
}

function createWorkspaceProvider(
	gondolinModule: GondolinModuleLike,
	workDir: string,
	runtimeConfig: VmRuntimeConfig,
	scratchpad: boolean,
): GondolinShadowProvider | GondolinRealFsProvider | GondolinMemoryProvider {
	const baseWorkspaceProvider = scratchpad
		? gondolinModule.createMemoryProvider()
		: gondolinModule.createRealFsProvider(workDir);

	let workspaceProvider: GondolinShadowProvider | GondolinRealFsProvider | GondolinMemoryProvider =
		baseWorkspaceProvider;

	if (runtimeConfig.shadows.deny.length > 0) {
		workspaceProvider = gondolinModule.createShadowProvider(workspaceProvider, {
			shouldShadow: gondolinModule.createShadowPathPredicate(
				runtimeConfig.shadows.deny.map((entry) => normalizeShadowPath(entry)),
			),
			writeMode: 'deny',
		});
	}

	if (runtimeConfig.shadows.tmpfs.length > 0) {
		workspaceProvider = gondolinModule.createShadowProvider(workspaceProvider, {
			shouldShadow: gondolinModule.createShadowPathPredicate(
				runtimeConfig.shadows.tmpfs.map((entry) => normalizeShadowPath(entry)),
			),
			writeMode: 'tmpfs',
		});
	}

	return workspaceProvider;
}

function createVfsMountMap(
	options: CreateVmRuntimeOptions,
	gondolinModule: GondolinModuleLike,
): GondolinVfsMounts {
	const mounts: GondolinVfsMounts = {};

	mounts[options.workDir] = createWorkspaceProvider(
		gondolinModule,
		options.workDir,
		options.runtimeConfig,
		options.scratchpad,
	);

	for (const [mountKey, hostPath] of Object.entries(options.runtimeConfig.readonlyMounts)) {
		if (!path.isAbsolute(hostPath) || !fs.existsSync(hostPath)) {
			continue;
		}
		const guestPath = resolveMountTargetPath(options.workDir, mountKey);
		mounts[guestPath] = gondolinModule.createReadonlyProvider(
			gondolinModule.createRealFsProvider(hostPath),
		);
	}

	for (const [guestPath, hostPath] of Object.entries(options.authReadonlyMounts)) {
		if (!path.isAbsolute(guestPath) || !path.isAbsolute(hostPath) || !fs.existsSync(hostPath)) {
			continue;
		}
		mounts[guestPath] = gondolinModule.createReadonlyProvider(
			gondolinModule.createRealFsProvider(hostPath),
		);
	}

	for (const [mountKey, hostPath] of Object.entries(options.runtimeConfig.extraMounts)) {
		if (!path.isAbsolute(hostPath) || !fs.existsSync(hostPath)) {
			continue;
		}
		const guestPath = resolveMountTargetPath(options.workDir, mountKey);
		mounts[guestPath] = gondolinModule.createRealFsProvider(hostPath);
	}

	for (const resolvedVolume of Object.values(options.resolvedVolumes)) {
		if (!path.isAbsolute(resolvedVolume.hostDir)) {
			continue;
		}
		mounts[resolvedVolume.guestPath] = gondolinModule.createRealFsProvider(resolvedVolume.hostDir);
	}

	return mounts;
}

function createVmVfsOptions(
	options: CreateVmRuntimeOptions,
	gondolinModule: GondolinModuleLike,
): GondolinVmVfs {
	return {
		// Use a stable synthetic fuse root so absolute guest paths (including nested
		// mounts like ${WORKSPACE}/.venv) resolve correctly during bind-mount
		// readiness without masking the guest root filesystem.
		fuseMount: '/data',
		mounts: createVfsMountMap(options, gondolinModule),
	};
}

class GondolinVmRuntime implements VmRuntime {
	public constructor(private readonly vmHandle: GondolinVm) {}

	public getId(): string {
		return this.vmHandle.id;
	}

	public async exec(command: string): Promise<VmExecResult> {
		const executionResult = await this.vmHandle.exec(command);
		return {
			exitCode: executionResult.exitCode,
			stdout: executionResult.stdout ?? '',
			stderr: executionResult.stderr ?? '',
		};
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
		createVm: async (vmOptions: GondolinVmOptions): Promise<GondolinVm> =>
			await gondolin.VM.create(vmOptions),
		createHttpHooks: (hookOptions: GondolinCreateHttpHooksInput): GondolinCreateHttpHooksOutput =>
			gondolin.createHttpHooks(hookOptions),
		createRealFsProvider: (rootPath: string): GondolinRealFsProvider =>
			new gondolin.RealFSProvider(rootPath),
		createMemoryProvider: (): GondolinMemoryProvider => new gondolin.MemoryProvider(),
		createReadonlyProvider: (provider: GondolinReadonlyProviderInput): GondolinReadonlyProvider =>
			new gondolin.ReadonlyProvider(provider),
		createShadowProvider: (
			provider: GondolinShadowProviderInput,
			shadowOptions: GondolinShadowProviderOptions,
		): GondolinShadowProvider => new gondolin.ShadowProvider(provider, shadowOptions),
		createShadowPathPredicate: (
			shadowPaths: GondolinShadowPathPredicateInput,
		): GondolinShadowPathPredicate => gondolin.createShadowPathPredicate(shadowPaths),
	};
}

function createVmEnv(
	options: CreateVmRuntimeOptions,
	hookEnv: Record<string, string>,
): Record<string, string> {
	const workspaceShellPath = shellEscape(options.workDir);
	return {
		...hookEnv,
		...options.runtimeConfig.env,
		WORKSPACE: options.workDir,
		PWD: options.workDir,
		AGENT_VM_INIT_SCRIPT: `cd ${workspaceShellPath}`,
		...options.tcpServiceEnvVars,
	};
}

export async function createVmRuntime(options: CreateVmRuntimeOptions): Promise<VmRuntime> {
	const gondolinModule = await loadGondolinModule();
	const hooks = gondolinModule.createHttpHooks({
		allowedHosts: [...options.allowedHosts],
		secrets: buildSecretSpecFromHostEnv(),
	});

	const hasTcpMappings = Object.keys(options.tcpHosts).length > 0;
	const vm = await gondolinModule.createVm({
		sandbox: {
			imagePath: options.imagePath,
		},
		sessionLabel: options.sessionLabel,
		rootfs: {
			mode: options.runtimeConfig.rootfsMode,
		},
		memory: `${String(options.runtimeConfig.memory)}M`,
		cpus: options.runtimeConfig.cpus,
		env: createVmEnv(options, hooks.env),
		httpHooks: hooks.httpHooks,
		vfs: createVmVfsOptions(options, gondolinModule),
		...(hasTcpMappings
			? {
					dns: { mode: 'synthetic', syntheticHostMapping: 'per-host' as const },
					tcp: { hosts: options.tcpHosts },
				}
			: {}),
	});

	options.logger.log('info', 'vm-adapter', 'vm runtime created', {
		vmId: vm.id,
		workspacePath: options.workDir,
		imagePath: options.imagePath,
		rootfsMode: options.runtimeConfig.rootfsMode,
		buildRuntimeDefaultRootfsMode: options.buildConfig.runtimeDefaults?.rootfsMode ?? null,
		scratchpad: options.scratchpad,
		tcpMappings: Object.keys(options.tcpHosts).length,
	});
	return new GondolinVmRuntime(vm);
}

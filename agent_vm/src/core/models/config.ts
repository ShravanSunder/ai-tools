import type { BuildConfig } from '#src/core/models/build-config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';

export type AgentPreset = 'claude' | 'codex' | 'gemini' | 'opencode' | 'cursor';

export type RunMode =
	| { readonly kind: 'no-run' }
	| { readonly kind: 'command'; readonly command: string }
	| { readonly kind: 'preset'; readonly preset: AgentPreset }
	| { readonly kind: 'default' };

export interface RunAgentVmOptions {
	readonly reload: boolean;
	readonly fullReset: boolean;
	readonly wipeVolumes: boolean;
	readonly scratchpad: boolean;
	readonly cleanup: boolean;
	readonly runMode: RunMode;
}

export interface WorkspaceIdentity {
	readonly workDir: string;
	readonly repoName: string;
	readonly dirHash: string;
	readonly sessionName: string;
	readonly daemonSocketPath: string;
	readonly daemonLogPath: string;
}

export interface TcpServiceEntry {
	readonly guestHostname: string;
	readonly guestPort: number;
	readonly upstreamTarget: string;
	readonly enabled: boolean;
}

export interface TcpServiceMap {
	readonly services: Readonly<Record<string, TcpServiceEntry>>;
	readonly strictMode: boolean;
	readonly allowedTargetHosts: readonly string[];
}

export interface ResolvedRuntimeConfig {
	readonly runtimeConfig: VmRuntimeConfig;
	readonly buildConfig: BuildConfig;
	readonly tcpServiceMap: TcpServiceMap;
	readonly allowedHosts: readonly string[];
	readonly toggleEntries: readonly string[];
	readonly generatedStateDir: string;
}

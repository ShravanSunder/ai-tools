export type AgentPreset = 'claude' | 'codex' | 'gemini' | 'opencode' | 'cursor';
export const TUNNEL_SERVICE_NAMES = ['postgres', 'redis'] as const;
export type TunnelServiceName = (typeof TUNNEL_SERVICE_NAMES)[number];

export const TUNNEL_HEALTH_STATES = ['healthy', 'degraded', 'unhealthy'] as const;
export type TunnelHealthState = (typeof TUNNEL_HEALTH_STATES)[number];

export interface RunAgentVmOptions {
	reload: boolean;
	fullReset: boolean;
	noRun: boolean;
	runCommand: string | null;
	agentPreset: AgentPreset | null;
}

export interface WorkspaceIdentity {
	workDir: string;
	repoName: string;
	dirHash: string;
	sessionName: string;
	daemonSocketPath: string;
	daemonLogPath: string;
}

export interface TunnelServiceConfig {
	enabled: boolean;
	hostTarget: {
		host: string;
		port: number;
	};
	guestClientPort: number;
	guestUplinkPort: number;
	desiredUplinks: number;
}

export interface TunnelConfig {
	services: {
		postgres: TunnelServiceConfig;
		redis: TunnelServiceConfig;
	};
}

export interface VmConfig {
	idleTimeoutMinutes: number;
	extraAptPackages: readonly string[];
	playwrightExtraHosts: readonly string[];
	tunnelEnabled: boolean;
}

export interface ResolvedRuntimeConfig {
	vmConfig: VmConfig;
	tunnelConfig: TunnelConfig;
	allowedHosts: readonly string[];
	toggleEntries: readonly string[];
	generatedStateDir: string;
}

export interface DaemonStatus {
	sessionName: string;
	clients: number;
	idleTimeoutMinutes: number;
	idleDeadlineEpochMs: number | null;
	startedAtEpochMs: number;
	tunnels: readonly {
		name: string;
		desiredUplinks: number;
		openUplinks: number;
		hostTarget: { host: string; port: number };
		state: TunnelHealthState;
	}[];
	vm: {
		id: string;
		running: boolean;
	};
}

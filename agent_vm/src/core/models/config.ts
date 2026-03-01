export type AgentPreset = 'claude' | 'codex' | 'gemini' | 'opencode' | 'cursor';

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

export interface VmConfig {
	idleTimeoutMinutes: number;
	extraAptPackages: readonly string[];
	playwrightExtraHosts: readonly string[];
}

export interface TcpServiceEntry {
	guestHostname: string;
	guestPort: number;
	upstreamTarget: string;
	enabled: boolean;
}

export interface TcpServiceMap {
	services: Record<string, TcpServiceEntry>;
	strictMode: boolean;
	allowedTargetHosts: readonly string[];
}

export interface ResolvedRuntimeConfig {
	vmConfig: VmConfig;
	tcpServiceMap: TcpServiceMap;
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
	tcpServices: readonly {
		name: string;
		guestHostname: string;
		guestPort: number;
		upstreamTarget: string;
		enabled: boolean;
	}[];
	vm: {
		id: string;
		running: boolean;
	};
}

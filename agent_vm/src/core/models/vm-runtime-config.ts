import { z } from 'zod';

import { normalizeHostname } from '#src/core/platform/hostname.js';

const rootfsModeSchema = z.enum(['readonly', 'memory', 'cow']);

const volumeEntrySchema = z.object({
	guestPath: z.string().trim().min(1),
});

const shadowsSchema = z.object({
	deny: z.array(z.string().trim().min(1)).default([]),
	tmpfs: z.array(z.string().trim().min(1)).default([]),
});

const initScriptsSchema = z.object({
	background: z.string().trim().min(1).nullable().default(null),
	foreground: z.string().trim().min(1).nullable().default(null),
});

const shellSchema = z.object({
	zshrcExtra: z.string().trim().min(1).nullable().default(null),
	atuin: z
		.object({
			importOnFirstRun: z.boolean().default(true),
		})
		.default({ importOnFirstRun: true }),
});

const tcpServiceEntrySchema = z.object({
	guestHostname: z.string().trim().min(1),
	guestPort: z.number().int().min(1).max(65_535),
	upstreamTarget: z.string().trim().min(1),
	enabled: z.boolean().default(true),
});

const tcpServiceEntryPartialSchema = tcpServiceEntrySchema.partial();

const defaultTcpServices = {
	postgres: {
		guestHostname: 'pg.vm.host',
		guestPort: 5432,
		upstreamTarget: '127.0.0.1:15432',
		enabled: true,
	},
	redis: {
		guestHostname: 'redis.vm.host',
		guestPort: 6379,
		upstreamTarget: '127.0.0.1:16379',
		enabled: true,
	},
} as const;

const defaultAllowedTargetHosts = ['127.0.0.1', 'localhost'] as const;

const tcpConfigInputSchema = z.object({
	strictMode: z.boolean().optional(),
	allowedTargetHosts: z.array(z.string().trim().min(1)).optional(),
	services: z.record(z.string().trim().min(1), tcpServiceEntryPartialSchema).optional(),
});

const tcpConfigSchema = z.object({
	strictMode: z.boolean().default(true),
	allowedTargetHosts: z.array(z.string().trim().min(1)).default([...defaultAllowedTargetHosts]),
	services: z
		.record(z.string().trim().min(1), tcpServiceEntrySchema)
		.default({ ...defaultTcpServices }),
});

export const vmRuntimeConfigInputSchema = z.object({
	rootfsMode: rootfsModeSchema.optional(),
	memory: z.number().int().positive().optional(),
	cpus: z.number().int().positive().optional(),
	idleTimeoutMinutes: z.number().int().positive().optional(),
	env: z.record(z.string(), z.string()).optional(),
	volumes: z.record(z.string(), volumeEntrySchema).optional(),
	shadows: shadowsSchema.partial().optional(),
	readonlyMounts: z.record(z.string(), z.string()).optional(),
	extraMounts: z.record(z.string(), z.string()).optional(),
	monorepoDiscovery: z.boolean().optional(),
	initScripts: initScriptsSchema.partial().optional(),
	shell: shellSchema.partial().optional(),
	playwrightExtraHosts: z.array(z.string()).optional(),
	tcp: tcpConfigInputSchema.optional(),
});

export const vmRuntimeConfigSchema = z.object({
	rootfsMode: rootfsModeSchema.default('cow'),
	memory: z.number().int().positive().default(2048),
	cpus: z.number().int().positive().default(2),
	idleTimeoutMinutes: z.number().int().positive().default(10),
	env: z.record(z.string(), z.string()).default({}),
	volumes: z.record(z.string(), volumeEntrySchema).default({}),
	shadows: shadowsSchema.default({ deny: [], tmpfs: [] }),
	readonlyMounts: z.record(z.string(), z.string()).default({}),
	extraMounts: z.record(z.string(), z.string()).default({}),
	monorepoDiscovery: z.boolean().default(true),
	initScripts: initScriptsSchema.default({ background: null, foreground: null }),
	shell: shellSchema.default({
		zshrcExtra: null,
		atuin: { importOnFirstRun: true },
	}),
	playwrightExtraHosts: z.array(z.string()).default([]),
	tcp: tcpConfigSchema.default({
		strictMode: true,
		allowedTargetHosts: [...defaultAllowedTargetHosts],
		services: { ...defaultTcpServices },
	}),
});

export type VmRuntimeConfigInput = z.input<typeof vmRuntimeConfigInputSchema>;
export type VmRuntimeConfig = z.output<typeof vmRuntimeConfigSchema>;
export type VmRuntimeTcpServiceEntry = z.output<typeof tcpServiceEntrySchema>;
export type VmRuntimeTcpConfig = z.output<typeof tcpConfigSchema>;
type VmRuntimeTcpServiceInput = z.input<typeof tcpServiceEntryPartialSchema>;
type VmRuntimeTcpServiceInputMap = Record<string, VmRuntimeTcpServiceInput>;

type ParsedHostPort = {
	host: string;
	port: number | null;
};

function parseHostPort(
	raw: string,
	options: { requirePort: boolean; context: string },
): ParsedHostPort {
	const input = raw.trim();
	if (input.length === 0) {
		throw new Error(`${options.context} must not be empty`);
	}

	let host = input;
	let port: number | null = null;

	if (input.startsWith('[')) {
		const closingBracket = input.indexOf(']');
		if (closingBracket < 0) {
			throw new Error(`${options.context} has invalid bracket syntax: '${raw}'`);
		}
		host = input.slice(1, closingBracket);
		const remainder = input.slice(closingBracket + 1);
		if (remainder.length > 0) {
			if (!remainder.startsWith(':')) {
				throw new Error(`${options.context} has invalid bracket syntax: '${raw}'`);
			}
			const portRaw = remainder.slice(1);
			if (!/^[0-9]+$/u.test(portRaw)) {
				throw new Error(`${options.context} has invalid port: '${raw}'`);
			}
			port = Number.parseInt(portRaw, 10);
		}
	} else {
		const colonIndex = input.lastIndexOf(':');
		if (colonIndex >= 0) {
			const maybePortRaw = input.slice(colonIndex + 1);
			if (/^[0-9]+$/u.test(maybePortRaw)) {
				host = input.slice(0, colonIndex);
				port = Number.parseInt(maybePortRaw, 10);
			}
		}
	}

	host = normalizeHostname(host);
	if (host.length === 0) {
		throw new Error(`${options.context} host must not be empty: '${raw}'`);
	}
	if (host.includes('*')) {
		throw new Error(`${options.context} does not support wildcard '*': '${raw}'`);
	}
	if (port !== null && (!Number.isInteger(port) || port <= 0 || port > 65_535)) {
		throw new Error(`${options.context} port must be in range 1..65535: '${raw}'`);
	}
	if (options.requirePort && port === null) {
		throw new Error(`${options.context} requires explicit :PORT: '${raw}'`);
	}

	return { host, port };
}

function validateUniqueGuestMappings(tcpConfig: VmRuntimeTcpConfig): void {
	const seen = new Map<string, string>();

	for (const [serviceName, serviceEntry] of Object.entries(tcpConfig.services)) {
		if (!serviceEntry.enabled) {
			continue;
		}
		const mappingKey = `${serviceEntry.guestHostname}:${serviceEntry.guestPort}`;
		const existingService = seen.get(mappingKey);
		if (existingService) {
			throw new Error(
				`duplicate guest mapping '${mappingKey}' for services '${existingService}' and '${serviceName}'`,
			);
		}
		seen.set(mappingKey, serviceName);
	}
}

function mergeTcpServices(
	baseServices: VmRuntimeTcpServiceInputMap | undefined,
	overlayServices: VmRuntimeTcpServiceInputMap | undefined,
): VmRuntimeTcpServiceInputMap {
	const mergedServices: Record<string, unknown> = {
		...baseServices,
	};

	for (const [serviceName, serviceOverride] of Object.entries(overlayServices ?? {})) {
		const baseEntry = mergedServices[serviceName];
		const baseRecord =
			typeof baseEntry === 'object' && baseEntry !== null
				? (baseEntry as Record<string, unknown>)
				: {};
		const overlayRecord =
			typeof serviceOverride === 'object' && serviceOverride !== null ? serviceOverride : {};
		mergedServices[serviceName] = {
			...baseRecord,
			...overlayRecord,
		};
	}

	return mergedServices as VmRuntimeTcpServiceInputMap;
}

function mergeTcpConfig(
	baseTcp: VmRuntimeConfigInput['tcp'],
	overlayTcp: VmRuntimeConfigInput['tcp'],
): VmRuntimeConfigInput['tcp'] {
	if (!overlayTcp) {
		return baseTcp;
	}

	return {
		strictMode: overlayTcp.strictMode ?? baseTcp?.strictMode,
		allowedTargetHosts: overlayTcp.allowedTargetHosts ?? baseTcp?.allowedTargetHosts,
		services: mergeTcpServices(baseTcp?.services, overlayTcp.services),
	};
}

function mergeShadows(
	baseShadows: VmRuntimeConfigInput['shadows'],
	overlayShadows: VmRuntimeConfigInput['shadows'],
): VmRuntimeConfigInput['shadows'] {
	if (!overlayShadows) {
		return baseShadows;
	}
	return {
		deny: overlayShadows.deny ?? baseShadows?.deny,
		tmpfs: overlayShadows.tmpfs ?? baseShadows?.tmpfs,
	};
}

function mergeInitScripts(
	baseScripts: VmRuntimeConfigInput['initScripts'],
	overlayScripts: VmRuntimeConfigInput['initScripts'],
): VmRuntimeConfigInput['initScripts'] {
	if (!overlayScripts) {
		return baseScripts;
	}
	return {
		background: overlayScripts.background ?? baseScripts?.background,
		foreground: overlayScripts.foreground ?? baseScripts?.foreground,
	};
}

function mergeShellConfig(
	baseShell: VmRuntimeConfigInput['shell'],
	overlayShell: VmRuntimeConfigInput['shell'],
): VmRuntimeConfigInput['shell'] {
	if (!overlayShell) {
		return baseShell;
	}
	return {
		zshrcExtra: overlayShell.zshrcExtra ?? baseShell?.zshrcExtra,
		atuin: overlayShell.atuin
			? {
					importOnFirstRun:
						overlayShell.atuin.importOnFirstRun ?? baseShell?.atuin?.importOnFirstRun,
				}
			: baseShell?.atuin,
	};
}

export function parseVmRuntimeConfig(input: unknown): VmRuntimeConfig {
	return vmRuntimeConfigSchema.parse(input);
}

export function parseVmRuntimeConfigInput(input: unknown): VmRuntimeConfigInput {
	return vmRuntimeConfigInputSchema.parse(input);
}

export function mergeVmRuntimeConfigs(
	base: VmRuntimeConfigInput,
	repo?: VmRuntimeConfigInput,
	local?: VmRuntimeConfigInput,
): VmRuntimeConfigInput {
	const overlays = [repo, local].filter(overlayCandidate) as readonly VmRuntimeConfigInput[];

	const merged: VmRuntimeConfigInput = { ...base };

	for (const overlay of overlays) {
		merged.rootfsMode = overlay.rootfsMode ?? merged.rootfsMode;
		merged.memory = overlay.memory ?? merged.memory;
		merged.cpus = overlay.cpus ?? merged.cpus;
		merged.idleTimeoutMinutes = overlay.idleTimeoutMinutes ?? merged.idleTimeoutMinutes;
		merged.monorepoDiscovery = overlay.monorepoDiscovery ?? merged.monorepoDiscovery;

		merged.env = { ...merged.env, ...overlay.env };
		merged.volumes = { ...merged.volumes, ...overlay.volumes };
		merged.shadows = mergeShadows(merged.shadows, overlay.shadows);
		merged.readonlyMounts = {
			...merged.readonlyMounts,
			...overlay.readonlyMounts,
		};
		merged.extraMounts = {
			...merged.extraMounts,
			...overlay.extraMounts,
		};
		merged.initScripts = mergeInitScripts(merged.initScripts, overlay.initScripts);
		merged.shell = mergeShellConfig(merged.shell, overlay.shell);
		merged.playwrightExtraHosts = overlay.playwrightExtraHosts ?? merged.playwrightExtraHosts;
		merged.tcp = mergeTcpConfig(merged.tcp, overlay.tcp);
	}

	return merged;
}

export function validateRuntimeTcpTargets(tcpConfig: VmRuntimeTcpConfig): void {
	validateUniqueGuestMappings(tcpConfig);
	if (!tcpConfig.strictMode) {
		return;
	}

	const allowedHostSet = new Set(
		tcpConfig.allowedTargetHosts.map((targetHost) => normalizeHostname(targetHost)),
	);

	for (const [serviceName, serviceEntry] of Object.entries(tcpConfig.services)) {
		if (!serviceEntry.enabled) {
			continue;
		}
		parseHostPort(serviceEntry.guestHostname, {
			requirePort: false,
			context: `tcp service '${serviceName}' guestHostname`,
		});
		const { host } = parseHostPort(serviceEntry.upstreamTarget, {
			requirePort: true,
			context: `tcp service '${serviceName}' upstreamTarget`,
		});
		if (!allowedHostSet.has(host)) {
			throw new Error(
				`TCP service '${serviceName}': upstream target host '${host}' is not in allowedTargetHosts [${tcpConfig.allowedTargetHosts.join(', ')}]. Set strictMode: false to allow non-local targets.`,
			);
		}
	}
}

export function buildRuntimeTcpHostsRecord(tcpConfig: VmRuntimeTcpConfig): Record<string, string> {
	validateUniqueGuestMappings(tcpConfig);
	const hosts: Record<string, string> = {};
	for (const serviceEntry of Object.values(tcpConfig.services)) {
		if (!serviceEntry.enabled) {
			continue;
		}
		hosts[`${serviceEntry.guestHostname}:${serviceEntry.guestPort}`] = serviceEntry.upstreamTarget;
	}
	return hosts;
}

export function buildRuntimeTcpServiceEnvVars(
	tcpConfig: VmRuntimeTcpConfig,
): Record<string, string> {
	const envVars: Record<string, string> = {};

	const postgresService = tcpConfig.services.postgres;
	if (postgresService?.enabled) {
		envVars.PGHOST = postgresService.guestHostname;
		envVars.PGPORT = String(postgresService.guestPort);
	}

	const redisService = tcpConfig.services.redis;
	if (redisService?.enabled) {
		envVars.REDIS_HOST = redisService.guestHostname;
		envVars.REDIS_PORT = String(redisService.guestPort);
		envVars.REDIS_URL = `redis://${redisService.guestHostname}:${redisService.guestPort}/0`;
	}

	return envVars;
}

function overlayCandidate(value: VmRuntimeConfigInput | undefined): value is VmRuntimeConfigInput {
	return value !== undefined;
}

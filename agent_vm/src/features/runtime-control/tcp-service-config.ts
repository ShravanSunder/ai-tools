import fs from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import type { TcpServiceEntry, TcpServiceMap } from '#src/core/models/config.js';
export type { TcpServiceEntry, TcpServiceMap } from '#src/core/models/config.js';

const DEFAULT_ALLOWED_TARGET_HOSTS = ['127.0.0.1', 'localhost'] as const;

const tcpServiceEntrySchema = z.object({
	guestHostname: z.string().min(1),
	guestPort: z.number().int().min(1).max(65_535),
	upstreamTarget: z.string().min(1),
	enabled: z.boolean().default(true),
});

const tcpServiceEntryPartialSchema = tcpServiceEntrySchema.partial();

const tcpServiceConfigInputSchema = z.object({
	services: z.record(z.string().min(1), tcpServiceEntryPartialSchema).optional(),
	strictMode: z.boolean().optional(),
	allowedTargetHosts: z.array(z.string().min(1)).optional(),
});

type TcpServicePartialEntryInput = z.input<typeof tcpServiceEntryPartialSchema>;

const DEFAULT_SERVICES: Record<string, TcpServiceEntry> = {
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
};

interface ParsedHostPort {
	host: string;
	port: number | null;
}

function normalizeHost(host: string): string {
	return host.trim().toLowerCase().replace(/\.+$/u, '');
}

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

	host = normalizeHost(host);
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

function mergeServiceEntry(
	defaults: TcpServiceEntry,
	override: TcpServicePartialEntryInput | undefined,
): TcpServiceEntry {
	if (!override) {
		return { ...defaults };
	}

	return {
		guestHostname: override.guestHostname ?? defaults.guestHostname,
		guestPort: override.guestPort ?? defaults.guestPort,
		upstreamTarget: override.upstreamTarget ?? defaults.upstreamTarget,
		enabled: override.enabled ?? defaults.enabled,
	};
}

function validateServiceEntry(serviceName: string, serviceEntry: TcpServiceEntry): void {
	parseHostPort(serviceEntry.guestHostname, {
		requirePort: false,
		context: `tcp service '${serviceName}' guestHostname`,
	});
	parseHostPort(serviceEntry.upstreamTarget, {
		requirePort: true,
		context: `tcp service '${serviceName}' upstreamTarget`,
	});
}

function validateUniqueGuestMappings(config: TcpServiceMap): void {
	const seen = new Map<string, string>();

	for (const [serviceName, serviceEntry] of Object.entries(config.services)) {
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

function parseJsonConfigFile(filePath: string): unknown {
	if (!fs.existsSync(filePath)) {
		return {};
	}

	const fileContents = fs.readFileSync(filePath, 'utf8');
	try {
		return JSON.parse(fileContents) as unknown;
	} catch (error: unknown) {
		throw new Error(`Invalid JSON in ${filePath}: ${String(error)}`, { cause: error });
	}
}

function asRecord(value: unknown, context: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`${context} must be a JSON object`);
	}

	return value as Record<string, unknown>;
}

function deepMergeServiceOverrides(
	repoConfig: Record<string, unknown>,
	localConfig: Record<string, unknown>,
): Record<string, unknown> {
	const repoServicesRaw = repoConfig['services'];
	const localServicesRaw = localConfig['services'];

	const repoServices =
		repoServicesRaw && typeof repoServicesRaw === 'object' && !Array.isArray(repoServicesRaw)
			? (repoServicesRaw as Record<string, unknown>)
			: {};
	const localServices =
		localServicesRaw && typeof localServicesRaw === 'object' && !Array.isArray(localServicesRaw)
			? (localServicesRaw as Record<string, unknown>)
			: {};

	const serviceKeys = new Set<string>([
		...Object.keys(repoServices),
		...Object.keys(localServices),
	]);
	const mergedServices: Record<string, unknown> = {};

	for (const serviceKey of serviceKeys) {
		const repoEntry = repoServices[serviceKey];
		const localEntry = localServices[serviceKey];
		const repoRecord =
			repoEntry && typeof repoEntry === 'object' && !Array.isArray(repoEntry)
				? (repoEntry as Record<string, unknown>)
				: {};
		const localRecord =
			localEntry && typeof localEntry === 'object' && !Array.isArray(localEntry)
				? (localEntry as Record<string, unknown>)
				: {};

		mergedServices[serviceKey] = {
			...repoRecord,
			...localRecord,
		};
	}

	return {
		...repoConfig,
		...localConfig,
		services: mergedServices,
	};
}

export function parseTcpServiceConfig(source: unknown): TcpServiceMap {
	const parsedConfig = tcpServiceConfigInputSchema.safeParse(source);
	if (!parsedConfig.success) {
		const firstIssue = parsedConfig.error.issues[0];
		throw new Error(`Invalid TCP service config: ${firstIssue?.message ?? 'unknown error'}`);
	}

	const inputServices = parsedConfig.data.services ?? {};
	const mergedServices: Record<string, TcpServiceEntry> = {};

	for (const [serviceName, defaultService] of Object.entries(DEFAULT_SERVICES)) {
		mergedServices[serviceName] = mergeServiceEntry(defaultService, inputServices[serviceName]);
	}

	for (const [serviceName, serviceOverride] of Object.entries(inputServices)) {
		if (serviceName in DEFAULT_SERVICES) {
			continue;
		}
		const parsedServiceEntry = tcpServiceEntrySchema.safeParse(serviceOverride);
		if (!parsedServiceEntry.success) {
			throw new Error(
				`Custom TCP service '${serviceName}' is missing required fields: ${parsedServiceEntry.error.issues
					.map((issue) => issue.path.join('.'))
					.join(', ')}`,
			);
		}
		mergedServices[serviceName] = parsedServiceEntry.data;
	}

	const config: TcpServiceMap = {
		services: mergedServices,
		strictMode: parsedConfig.data.strictMode ?? true,
		allowedTargetHosts: parsedConfig.data.allowedTargetHosts ?? [...DEFAULT_ALLOWED_TARGET_HOSTS],
	};

	for (const [serviceName, serviceEntry] of Object.entries(config.services)) {
		validateServiceEntry(serviceName, serviceEntry);
	}
	validateUniqueGuestMappings(config);

	return config;
}

export function validateTcpServiceTargets(config: TcpServiceMap): void {
	if (!config.strictMode) {
		return;
	}

	const allowedHostSet = new Set(config.allowedTargetHosts.map((host) => normalizeHost(host)));

	for (const [serviceName, serviceEntry] of Object.entries(config.services)) {
		if (!serviceEntry.enabled) {
			continue;
		}

		const { host } = parseHostPort(serviceEntry.upstreamTarget, {
			requirePort: true,
			context: `tcp service '${serviceName}' upstreamTarget`,
		});

		if (!allowedHostSet.has(host)) {
			throw new Error(
				`TCP service '${serviceName}': upstream target host '${host}' is not in allowedTargetHosts [${config.allowedTargetHosts.join(', ')}]. Set strictMode: false to allow non-local targets.`,
			);
		}
	}
}

export function buildTcpHostsRecord(config: TcpServiceMap): Record<string, string> {
	validateUniqueGuestMappings(config);

	const hosts: Record<string, string> = {};
	for (const serviceEntry of Object.values(config.services)) {
		if (!serviceEntry.enabled) {
			continue;
		}

		hosts[`${serviceEntry.guestHostname}:${serviceEntry.guestPort}`] = serviceEntry.upstreamTarget;
	}

	return hosts;
}

export function buildTcpServiceEnvVars(config: TcpServiceMap): Record<string, string> {
	const envVars: Record<string, string> = {};

	const postgresService = config.services.postgres;
	if (postgresService?.enabled) {
		envVars.PGHOST = postgresService.guestHostname;
		envVars.PGPORT = String(postgresService.guestPort);
	}

	const redisService = config.services.redis;
	if (redisService?.enabled) {
		envVars.REDIS_HOST = redisService.guestHostname;
		envVars.REDIS_PORT = String(redisService.guestPort);
		envVars.REDIS_URL = `redis://${redisService.guestHostname}:${redisService.guestPort}/0`;
	}

	return envVars;
}

export function loadTcpServiceConfig(workDir: string): TcpServiceMap {
	const repoConfigPath = path.join(workDir, '.agent_vm', 'tcp-services.repo.json');
	const localConfigPath = path.join(workDir, '.agent_vm', 'tcp-services.local.json');

	const repoRaw = parseJsonConfigFile(repoConfigPath);
	const localRaw = parseJsonConfigFile(localConfigPath);

	const repoConfig = asRecord(repoRaw, `Config file ${repoConfigPath}`);
	const localConfig = asRecord(localRaw, `Config file ${localConfigPath}`);

	const mergedConfig = deepMergeServiceOverrides(repoConfig, localConfig);
	return parseTcpServiceConfig(mergedConfig);
}

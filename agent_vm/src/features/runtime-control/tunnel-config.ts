import fs from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import type { TunnelConfig, TunnelServiceConfig } from '#src/core/models/config.js';

const serviceConfigSchema = z.object({
	enabled: z.boolean().optional(),
	hostTarget: z
		.object({
			host: z.string().optional(),
			port: z.number().int().positive().optional(),
		})
		.optional(),
	guestClientPort: z.number().int().positive().optional(),
	guestUplinkPort: z.number().int().positive().optional(),
	desiredUplinks: z.number().int().positive().optional(),
});

export const tunnelConfigSchema = z.object({
	services: z
		.object({
			postgres: serviceConfigSchema.optional(),
			redis: serviceConfigSchema.optional(),
		})
		.optional(),
});

const DEFAULT_TUNNEL_CONFIG = {
	services: {
		postgres: {
			enabled: true,
			hostTarget: { host: '127.0.0.1', port: 5432 },
			guestClientPort: 15432,
			guestUplinkPort: 16000,
			desiredUplinks: 8,
		},
		redis: {
			enabled: true,
			hostTarget: { host: '127.0.0.1', port: 6379 },
			guestClientPort: 16379,
			guestUplinkPort: 16001,
			desiredUplinks: 4,
		},
	},
} satisfies TunnelConfig;

function mergeServiceConfig(
	defaults: TunnelServiceConfig,
	override: z.infer<typeof serviceConfigSchema> | undefined,
): TunnelServiceConfig {
	return {
		enabled: override?.enabled ?? defaults.enabled,
		hostTarget: {
			host: override?.hostTarget?.host ?? defaults.hostTarget.host,
			port: override?.hostTarget?.port ?? defaults.hostTarget.port,
		},
		guestClientPort: override?.guestClientPort ?? defaults.guestClientPort,
		guestUplinkPort: override?.guestUplinkPort ?? defaults.guestUplinkPort,
		desiredUplinks: override?.desiredUplinks ?? defaults.desiredUplinks,
	};
}

function parseJsonFile(filePath: string): unknown {
	if (!fs.existsSync(filePath)) {
		return {};
	}
	const contents = fs.readFileSync(filePath, 'utf8');
	try {
		return JSON.parse(contents) as unknown;
	} catch (error: unknown) {
		throw new Error(`Invalid JSON in ${filePath}: ${String(error)}`, { cause: error });
	}
}

function asRecord(value: unknown, label: string, filePath: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Expected ${label} object in ${filePath}`);
	}
	return value as Record<string, unknown>;
}

export function parseTunnelConfig(source: unknown): TunnelConfig {
	const parsed = tunnelConfigSchema.parse(source);
	const postgresOverride = parsed.services?.postgres;
	const redisOverride = parsed.services?.redis;

	return {
		services: {
			postgres: mergeServiceConfig(DEFAULT_TUNNEL_CONFIG.services.postgres, postgresOverride),
			redis: mergeServiceConfig(DEFAULT_TUNNEL_CONFIG.services.redis, redisOverride),
		},
	};
}

export function loadTunnelConfig(workDir: string): TunnelConfig {
	const repoPath = path.join(workDir, '.agent_vm', 'tunnels.repo.json');
	const localPath = path.join(workDir, '.agent_vm', 'tunnels.local.json');

	const repoRaw = parseJsonFile(repoPath);
	const localRaw = parseJsonFile(localPath);
	const repo = asRecord(repoRaw, 'tunnels.repo', repoPath);
	const local = asRecord(localRaw, 'tunnels.local', localPath);
	const repoServices =
		repo['services'] === undefined ? {} : asRecord(repo['services'], 'services', repoPath);
	const localServices =
		local['services'] === undefined ? {} : asRecord(local['services'], 'services', localPath);

	return parseTunnelConfig({
		...repo,
		...local,
		services: {
			...repoServices,
			...localServices,
		},
	});
}

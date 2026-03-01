import fs from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import type { TunnelConfig } from '../types/config.js';

const serviceConfigSchema = z.object({
	enabled: z.boolean().default(true),
	hostTarget: z
		.object({
			host: z.string().default('127.0.0.1'),
			port: z.number().int().positive(),
		})
		.default({ host: '127.0.0.1', port: 5432 }),
	guestClientPort: z.number().int().positive(),
	guestUplinkPort: z.number().int().positive(),
	desiredUplinks: z.number().int().positive(),
});

export const tunnelConfigSchema = z.object({
	services: z
		.object({
			postgres: serviceConfigSchema.default({
				enabled: true,
				hostTarget: { host: '127.0.0.1', port: 5432 },
				guestClientPort: 15432,
				guestUplinkPort: 16000,
				desiredUplinks: 8,
			}),
			redis: serviceConfigSchema.default({
				enabled: true,
				hostTarget: { host: '127.0.0.1', port: 6379 },
				guestClientPort: 16379,
				guestUplinkPort: 16001,
				desiredUplinks: 4,
			}),
		})
		.default({}),
});

function parseJsonFile(filePath: string): unknown {
	if (!fs.existsSync(filePath)) {
		return {};
	}
	const contents = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(contents) as unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}
	return value as Record<string, unknown>;
}

export function parseTunnelConfig(source: unknown): TunnelConfig {
	const parsed = tunnelConfigSchema.parse(source);
	return parsed;
}

export function loadTunnelConfig(workDir: string): TunnelConfig {
	const repoPath = path.join(workDir, '.agent_vm', 'tunnels.repo.json');
	const localPath = path.join(workDir, '.agent_vm', 'tunnels.local.json');

	const repo = asRecord(parseJsonFile(repoPath));
	const local = asRecord(parseJsonFile(localPath));
	const repoServices = asRecord(repo['services']);
	const localServices = asRecord(local['services']);

	return parseTunnelConfig({
		...repo,
		...local,
		services: {
			...repoServices,
			...localServices,
		},
	});
}

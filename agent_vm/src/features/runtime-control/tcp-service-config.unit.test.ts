import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	buildTcpHostsRecord,
	buildTcpServiceEnvVars,
	loadTcpServiceConfig,
	parseTcpServiceConfig,
	validateTcpServiceTargets,
	type TcpServiceEntry,
	type TcpServiceMap,
} from '#src/features/runtime-control/tcp-service-config.js';

function getService(config: TcpServiceMap, serviceName: string): TcpServiceEntry {
	const service = config.services[serviceName];
	if (!service) {
		throw new Error(`Missing expected service '${serviceName}'`);
	}
	return service;
}

describe('tcp service config', () => {
	describe('parseTcpServiceConfig', () => {
		it('returns default postgres and redis services when given empty input', () => {
			const config = parseTcpServiceConfig({});

			expect(config.services.postgres).toEqual({
				guestHostname: 'pg.vm.host',
				guestPort: 5432,
				upstreamTarget: '127.0.0.1:15432',
				enabled: true,
			});
			expect(config.services.redis).toEqual({
				guestHostname: 'redis.vm.host',
				guestPort: 6379,
				upstreamTarget: '127.0.0.1:16379',
				enabled: true,
			});
			expect(config.strictMode).toBe(true);
		});

		it('merges partial overrides with defaults', () => {
			const config = parseTcpServiceConfig({
				services: {
					postgres: { upstreamTarget: '127.0.0.1:5432' },
				},
			});
			const postgresService = getService(config, 'postgres');

			expect(postgresService.upstreamTarget).toBe('127.0.0.1:5432');
			expect(postgresService.guestHostname).toBe('pg.vm.host');
			expect(postgresService.guestPort).toBe(5432);
			expect(postgresService.enabled).toBe(true);
		});

		it('allows disabling a service', () => {
			const config = parseTcpServiceConfig({
				services: {
					redis: { enabled: false },
				},
			});
			const redisService = getService(config, 'redis');
			const postgresService = getService(config, 'postgres');

			expect(redisService.enabled).toBe(false);
			expect(postgresService.enabled).toBe(true);
		});

		it('allows disabling strict mode', () => {
			const config = parseTcpServiceConfig({ strictMode: false });
			expect(config.strictMode).toBe(false);
		});

		it('allows adding custom services', () => {
			const config = parseTcpServiceConfig({
				services: {
					mysql: {
						guestHostname: 'mysql.vm.host',
						guestPort: 3306,
						upstreamTarget: '127.0.0.1:13306',
						enabled: true,
					},
				},
			});

			expect(config.services.mysql).toEqual({
				guestHostname: 'mysql.vm.host',
				guestPort: 3306,
				upstreamTarget: '127.0.0.1:13306',
				enabled: true,
			});
		});

		it('rejects wildcard guest hostnames', () => {
			expect(() =>
				parseTcpServiceConfig({
					services: {
						postgres: {
							guestHostname: '*.vm.host',
						},
					},
				}),
			).toThrowError(/does not support wildcard/u);
		});

		it('rejects wildcard upstream targets', () => {
			expect(() =>
				parseTcpServiceConfig({
					services: {
						postgres: {
							upstreamTarget: '*.internal:5432',
						},
					},
				}),
			).toThrowError(/does not support wildcard/u);
		});

		it('rejects duplicate guest mappings across enabled services', () => {
			expect(() =>
				parseTcpServiceConfig({
					services: {
						analytics: {
							guestHostname: 'pg.vm.host',
							guestPort: 5432,
							upstreamTarget: '127.0.0.1:25432',
							enabled: true,
						},
					},
				}),
			).toThrowError(/duplicate guest mapping/u);
		});
	});

	describe('validateTcpServiceTargets', () => {
		it('passes when all targets are localhost in strict mode', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: '127.0.0.1:15432',
						enabled: true,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => validateTcpServiceTargets(config)).not.toThrow();
		});

		it('rejects non-localhost targets in strict mode', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: '10.0.0.5:5432',
						enabled: true,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => validateTcpServiceTargets(config)).toThrowError(
				/upstream target host '10\.0\.0\.5' is not in allowedTargetHosts/u,
			);
		});

		it('allows non-localhost targets when strict mode is disabled', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: '10.0.0.5:5432',
						enabled: true,
					},
				},
				strictMode: false,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => validateTcpServiceTargets(config)).not.toThrow();
		});

		it('skips validation for disabled services', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: '10.0.0.5:5432',
						enabled: false,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => validateTcpServiceTargets(config)).not.toThrow();
		});

		it('rejects malformed upstream target', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: 'no-port-here',
						enabled: true,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => validateTcpServiceTargets(config)).toThrowError(/requires explicit :PORT/u);
		});
	});

	describe('buildTcpHostsRecord', () => {
		it('builds hostname:port -> upstream record for enabled services', () => {
			const config: TcpServiceMap = {
				services: {
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
						enabled: false,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			const hosts = buildTcpHostsRecord(config);
			expect(hosts).toEqual({ 'pg.vm.host:5432': '127.0.0.1:15432' });
		});

		it('returns empty record when all services are disabled', () => {
			const config: TcpServiceMap = {
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: '127.0.0.1:15432',
						enabled: false,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			const hosts = buildTcpHostsRecord(config);
			expect(hosts).toEqual({});
		});

		it('throws when enabled services collide on guest hostname and port', () => {
			const config: TcpServiceMap = {
				services: {
					firstService: {
						guestHostname: 'db.vm.host',
						guestPort: 5432,
						upstreamTarget: '127.0.0.1:15432',
						enabled: true,
					},
					secondService: {
						guestHostname: 'db.vm.host',
						guestPort: 5432,
						upstreamTarget: '127.0.0.1:25432',
						enabled: true,
					},
				},
				strictMode: true,
				allowedTargetHosts: ['127.0.0.1', 'localhost'],
			};

			expect(() => buildTcpHostsRecord(config)).toThrowError(/duplicate guest mapping/u);
		});
	});

	describe('buildTcpServiceEnvVars', () => {
		it('produces PGHOST, PGPORT, REDIS_HOST, REDIS_PORT, REDIS_URL from defaults', () => {
			const config = parseTcpServiceConfig({});
			const envVars = buildTcpServiceEnvVars(config);

			expect(envVars.PGHOST).toBe('pg.vm.host');
			expect(envVars.PGPORT).toBe('5432');
			expect(envVars.REDIS_HOST).toBe('redis.vm.host');
			expect(envVars.REDIS_PORT).toBe('6379');
			expect(envVars.REDIS_URL).toBe('redis://redis.vm.host:6379/0');
		});

		it('omits PG env vars when postgres is disabled', () => {
			const config = parseTcpServiceConfig({
				services: { postgres: { enabled: false } },
			});
			const envVars = buildTcpServiceEnvVars(config);

			expect(envVars.PGHOST).toBeUndefined();
			expect(envVars.PGPORT).toBeUndefined();
			expect(envVars.REDIS_HOST).toBe('redis.vm.host');
		});

		it('omits REDIS env vars when redis is disabled', () => {
			const config = parseTcpServiceConfig({
				services: { redis: { enabled: false } },
			});
			const envVars = buildTcpServiceEnvVars(config);

			expect(envVars.REDIS_HOST).toBeUndefined();
			expect(envVars.REDIS_PORT).toBeUndefined();
			expect(envVars.REDIS_URL).toBeUndefined();
			expect(envVars.PGHOST).toBe('pg.vm.host');
		});

		it('returns empty record when all services are disabled', () => {
			const config = parseTcpServiceConfig({
				services: {
					postgres: { enabled: false },
					redis: { enabled: false },
				},
			});
			const envVars = buildTcpServiceEnvVars(config);

			expect(Object.keys(envVars)).toHaveLength(0);
		});
	});

	describe('loadTcpServiceConfig', () => {
		it('loads default config when no files exist', () => {
			const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tcp-'));
			const config = loadTcpServiceConfig(workDir);
			const postgresService = getService(config, 'postgres');
			const redisService = getService(config, 'redis');

			expect(postgresService.enabled).toBe(true);
			expect(redisService.enabled).toBe(true);
			expect(config.strictMode).toBe(true);
		});

		it('applies local overrides on top of repo', () => {
			const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tcp-'));
			const configDir = path.join(workDir, '.agent_vm');
			fs.mkdirSync(configDir, { recursive: true });

			fs.writeFileSync(
				path.join(configDir, 'tcp-services.repo.json'),
				JSON.stringify({
					services: {
						postgres: {
							upstreamTarget: '127.0.0.1:5432',
							guestHostname: 'repo.pg.vm.host',
						},
					},
				}),
			);
			fs.writeFileSync(
				path.join(configDir, 'tcp-services.local.json'),
				JSON.stringify({
					services: { postgres: { upstreamTarget: '127.0.0.1:25432' } },
				}),
			);

			const config = loadTcpServiceConfig(workDir);
			const postgresService = getService(config, 'postgres');
			expect(postgresService.upstreamTarget).toBe('127.0.0.1:25432');
			expect(postgresService.guestHostname).toBe('repo.pg.vm.host');
		});

		it('throws with file context when json is malformed', () => {
			const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tcp-'));
			const configDir = path.join(workDir, '.agent_vm');
			fs.mkdirSync(configDir, { recursive: true });
			fs.writeFileSync(path.join(configDir, 'tcp-services.local.json'), '{bad-json');

			expect(() => loadTcpServiceConfig(workDir)).toThrowError(/tcp-services\.local\.json/u);
		});
	});
});

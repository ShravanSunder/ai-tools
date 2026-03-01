# TCP Hosts Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the custom tunnel subsystem (~580 lines) with Gondolin's first-class `tcp.hosts` mapped TCP support, enabling guest VMs to reach host Docker services via synthetic DNS hostnames.

**Architecture:** Guest apps connect to logical hostnames (`pg.vm.host:5432`). Gondolin's synthetic DNS resolves them to synthetic IPs. QEMU intercepts TCP and routes to configured host-local upstream targets (`127.0.0.1:15432`). No host-side proxy process — Gondolin is the forwarder.

**Tech Stack:** TypeScript ES modules, Zod 4 schemas, Gondolin QEMU micro-VM (`@earendil-works/gondolin`), Vitest

**Design doc:** `agent_vm/docs/plans/2026-03-01-tcp-hosts-migration-design.md`

**Gondolin source-aligned constraints (must hold):**

- `tcp.hosts` requires `dns.mode: "synthetic"` and `dns.syntheticHostMapping: "per-host"` (see `host/src/qemu/tcp.ts` `assertTcpDnsConfig()` and `docs/sdk-network.md`).
- `tcp.hosts` keys and values do not allow wildcard `*` (see `host/src/qemu/tcp.ts` `parseMappingKey()` / `parseMappingTarget()`).
- If both `HOST` and `HOST:PORT` exist, port-specific mapping wins (see `docs/sdk-network.md` semantics).
- Mapped TCP bypasses HTTP hooks and HTTP secret placeholder substitution (see `docs/sdk-network.md` / `docs/security.md`), so strict target validation must happen before `VM.create()`.

---

### Task 1: Pin Gondolin to Git SHA

**Files:**

- Modify: `agent_vm/package.json:41`

**Step 1: Identify the merge commit SHA**

Go to the Gondolin repository (`~/Documents/dev/open-source/vm/gondolin`) and find PR #61's merge commit:

Run: `cd ~/Documents/dev/open-source/vm/gondolin && git log --oneline --all --grep="tcp" | head -5`

Note the SHA. If the PR title mentions "Mapped TCP" or "tcp.hosts", that's the one.

**Step 2: Update package.json**

In `agent_vm/package.json`, change the gondolin dependency from npm version to Git SHA:

```json
"optionalDependencies": {
    "@earendil-works/gondolin": "github:earendil-works/gondolin#<SHA>"
}
```

Replace `<SHA>` with the actual commit hash found in step 1.

**Step 3: Install and verify**

Run: `cd agent_vm && pnpm install`

Expected: Clean install. The `@earendil-works/gondolin` package resolves from GitHub.

Run: `cd agent_vm && pnpm typecheck`

Expected: PASS. No type errors — the new Gondolin types include `dns` and `tcp` on `VMOptions`.

**Step 4: Commit**

```bash
git add agent_vm/package.json agent_vm/pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
chore(agent_vm): pin gondolin to git sha with tcp.hosts support

PR #61 adds first-class VM.create({ tcp: { hosts } }) mapped TCP.
Not yet released to npm, so pin to merge commit SHA.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: TCP service config schema, loader, and validation (TDD)

**Files:**

- Create: `agent_vm/src/features/runtime-control/tcp-service-config.ts`
- Create: `agent_vm/src/features/runtime-control/tcp-service-config.unit.test.ts`

This task creates the new config system alongside the existing tunnel config. Both coexist until the cutover task.

**Step 1: Write the failing tests**

Create `agent_vm/src/features/runtime-control/tcp-service-config.unit.test.ts`:

```typescript
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	buildTcpHostsRecord,
	loadTcpServiceConfig,
	parseTcpServiceConfig,
	validateTcpServiceTargets,
	type TcpServiceMap,
} from '#src/features/runtime-control/tcp-service-config.js';

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

			expect(config.services.postgres.upstreamTarget).toBe('127.0.0.1:5432');
			expect(config.services.postgres.guestHostname).toBe('pg.vm.host');
			expect(config.services.postgres.guestPort).toBe(5432);
			expect(config.services.postgres.enabled).toBe(true);
		});

		it('allows disabling a service', () => {
			const config = parseTcpServiceConfig({
				services: {
					redis: { enabled: false },
				},
			});

			expect(config.services.redis.enabled).toBe(false);
			expect(config.services.postgres.enabled).toBe(true);
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

			expect(() => validateTcpServiceTargets(config)).toThrowError(
				/invalid upstreamTarget format/u,
			);
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
	});

	describe('loadTcpServiceConfig', () => {
		it('loads default config when no files exist', () => {
			const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tcp-'));
			const config = loadTcpServiceConfig(workDir);

			expect(config.services.postgres.enabled).toBe(true);
			expect(config.services.redis.enabled).toBe(true);
			expect(config.strictMode).toBe(true);
		});

		it('applies local overrides on top of repo', () => {
			const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-tcp-'));
			const configDir = path.join(workDir, '.agent_vm');
			fs.mkdirSync(configDir, { recursive: true });

			fs.writeFileSync(
				path.join(configDir, 'tcp-services.repo.json'),
				JSON.stringify({
					services: { postgres: { upstreamTarget: '127.0.0.1:5432' } },
				}),
			);
			fs.writeFileSync(
				path.join(configDir, 'tcp-services.local.json'),
				JSON.stringify({
					services: { postgres: { upstreamTarget: '127.0.0.1:25432' } },
				}),
			);

			const config = loadTcpServiceConfig(workDir);
			expect(config.services.postgres.upstreamTarget).toBe('127.0.0.1:25432');
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
```

**Step 2: Run tests to verify they fail**

Run: `cd agent_vm && pnpm vitest run src/features/runtime-control/tcp-service-config.unit.test.ts`

Expected: FAIL — module `tcp-service-config.js` does not exist.

**Step 2b: Expand failing test matrix (required before implementation)**

Add these tests in `tcp-service-config.unit.test.ts`:

- Repo/local merge is deep per service key (local partial should not erase repo fields for same service).
- Duplicate guest mapping key rejection (two enabled services producing same `guestHostname:guestPort`).
- Wildcard rejection in service hostnames and upstream hosts (fail with explicit service name context).
- `HOST` + `HOST:PORT` mapping behavior is preserved in `buildTcpHostsRecord` output and documentation examples.

**Step 3: Implement the TCP service config module**

Create `agent_vm/src/features/runtime-control/tcp-service-config.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

const tcpServiceEntrySchema = z.object({
	guestHostname: z.string(),
	guestPort: z.number().int().min(1).max(65535),
	upstreamTarget: z.string(),
	enabled: z.boolean().default(true),
});

type TcpServiceEntryInput = z.input<typeof tcpServiceEntrySchema>;

const tcpServiceConfigInputSchema = z.object({
	services: z.record(z.string(), tcpServiceEntrySchema.partial()).optional(),
	strictMode: z.boolean().optional(),
	allowedTargetHosts: z.array(z.string()).optional(),
});

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

const DEFAULT_ALLOWED_TARGET_HOSTS = ['127.0.0.1', 'localhost'] as const;

function mergeServiceEntry(
	defaults: TcpServiceEntry,
	override: Partial<TcpServiceEntryInput> | undefined,
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

function parseUpstreamTarget(target: string): { host: string; port: number } {
	const lastColon = target.lastIndexOf(':');
	if (lastColon <= 0) {
		throw new Error(`invalid upstreamTarget format '${target}': expected 'host:port'`);
	}
	const host = target.slice(0, lastColon);
	const portStr = target.slice(lastColon + 1);
	const port = Number.parseInt(portStr, 10);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		throw new Error(`invalid upstreamTarget port in '${target}'`);
	}
	return { host, port };
}

export function parseTcpServiceConfig(source: unknown): TcpServiceMap {
	const parsed = tcpServiceConfigInputSchema.parse(source);
	const inputServices = parsed.services ?? {};

	const services: Record<string, TcpServiceEntry> = {};

	for (const [name, defaults] of Object.entries(DEFAULT_SERVICES)) {
		services[name] = mergeServiceEntry(defaults, inputServices[name]);
	}

	for (const [name, override] of Object.entries(inputServices)) {
		if (name in DEFAULT_SERVICES) {
			continue;
		}
		if (!override) {
			continue;
		}
		const entry = tcpServiceEntrySchema.safeParse(override);
		if (!entry.success) {
			throw new Error(
				`Custom TCP service '${name}' is missing required fields: ${entry.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
			);
		}
		services[name] = entry.data;
	}

	return {
		services,
		strictMode: parsed.strictMode ?? true,
		allowedTargetHosts: parsed.allowedTargetHosts ?? [...DEFAULT_ALLOWED_TARGET_HOSTS],
	};
}

export function validateTcpServiceTargets(config: TcpServiceMap): void {
	if (!config.strictMode) {
		return;
	}

	for (const [name, entry] of Object.entries(config.services)) {
		if (!entry.enabled) {
			continue;
		}

		const { host } = parseUpstreamTarget(entry.upstreamTarget);

		if (!config.allowedTargetHosts.includes(host)) {
			throw new Error(
				`TCP service '${name}': upstream target host '${host}' is not in allowedTargetHosts [${config.allowedTargetHosts.join(', ')}]. ` +
					`Set strictMode: false to allow non-local targets.`,
			);
		}
	}
}

export function buildTcpHostsRecord(config: TcpServiceMap): Record<string, string> {
	const hosts: Record<string, string> = {};
	for (const entry of Object.values(config.services)) {
		if (!entry.enabled) {
			continue;
		}
		hosts[`${entry.guestHostname}:${entry.guestPort}`] = entry.upstreamTarget;
	}
	return hosts;
}

export function buildTcpServiceEnvVars(config: TcpServiceMap): Record<string, string> {
	const env: Record<string, string> = {};
	const pg = config.services.postgres;
	if (pg?.enabled) {
		env.PGHOST = pg.guestHostname;
		env.PGPORT = String(pg.guestPort);
	}
	const redis = config.services.redis;
	if (redis?.enabled) {
		env.REDIS_HOST = redis.guestHostname;
		env.REDIS_PORT = String(redis.guestPort);
		env.REDIS_URL = `redis://${redis.guestHostname}:${redis.guestPort}/0`;
	}
	return env;
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

function deepMergeServiceOverrides(
	repo: Record<string, unknown>,
	local: Record<string, unknown>,
): Record<string, unknown> {
	const repoServices =
		repo['services'] && typeof repo['services'] === 'object' && !Array.isArray(repo['services'])
			? (repo['services'] as Record<string, unknown>)
			: {};
	const localServices =
		local['services'] && typeof local['services'] === 'object' && !Array.isArray(local['services'])
			? (local['services'] as Record<string, unknown>)
			: {};

	return {
		...repo,
		...local,
		services: {
			...repoServices,
			...localServices,
		},
	};
}

export function loadTcpServiceConfig(workDir: string): TcpServiceMap {
	const repoPath = path.join(workDir, '.agent_vm', 'tcp-services.repo.json');
	const localPath = path.join(workDir, '.agent_vm', 'tcp-services.local.json');

	const repoRaw = parseJsonFile(repoPath);
	const localRaw = parseJsonFile(localPath);

	const repo =
		repoRaw && typeof repoRaw === 'object' && !Array.isArray(repoRaw)
			? (repoRaw as Record<string, unknown>)
			: {};
	const local =
		localRaw && typeof localRaw === 'object' && !Array.isArray(localRaw)
			? (localRaw as Record<string, unknown>)
			: {};

	const merged = deepMergeServiceOverrides(repo, local);
	return parseTcpServiceConfig(merged);
}
```

Implementation requirements (must be met even if code shape differs from snippet):

- Keep Zod v4 schemas as source of truth and infer types from schema where possible.
- Merge repo/local service overrides deeply by service key and field (not just one-level `services` object merge).
- Validate and fail early on duplicate enabled guest mapping keys (`guestHostname:guestPort`) with actionable error text.
- Validate and fail early on wildcard hosts in both guest and upstream targets so failures happen before `VM.create()`.

**Step 4: Run tests to verify they pass**

Run: `cd agent_vm && pnpm build && pnpm vitest run src/features/runtime-control/tcp-service-config.unit.test.ts`

Expected: All tests PASS.

**Step 5: Run full typecheck**

Run: `cd agent_vm && pnpm typecheck`

Expected: PASS. New code compiles alongside existing tunnel code.

**Step 6: Commit**

```bash
git add agent_vm/src/features/runtime-control/tcp-service-config.ts agent_vm/src/features/runtime-control/tcp-service-config.unit.test.ts
git commit -m "$(cat <<'EOF'
feat(agent_vm): add tcp service config schema, loader, and validation

New TcpServiceMap config system for Gondolin tcp.hosts integration.
Includes strict mode pre-boot validation (localhost-only by default),
config file loader with repo/local hierarchy, and buildTcpHostsRecord
for VM creation.

Coexists with existing tunnel config — cutover in next commit.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Hard cutover — replace tunnel with tcp.hosts

This task performs the full migration in one atomic commit. Every substep is listed in order. The code will not compile until all substeps are complete — that's expected.

**Files:**

- Modify: `agent_vm/src/core/models/config.ts`
- Modify: `agent_vm/src/core/models/ipc.ts`
- Modify: `agent_vm/src/core/infrastructure/vm-adapter.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/config-resolver.ts`
- Modify: `agent_vm/src/features/cli/agent-vm-ctl.ts`
- Modify: `agent_vm/config/vm.base.conf`
- Delete: `agent_vm/src/core/infrastructure/tunnel-manager.ts`
- Delete: `agent_vm/src/features/runtime-control/tunnel-config.ts`
- Delete: `agent_vm/src/features/runtime-control/tunnel-config.unit.test.ts`
- Delete: `agent_vm/tests/bridge-tunnel.integration.test.ts`

**Step 1: Update config.ts — remove tunnel types, add tcp import**

Replace the full contents of `agent_vm/src/core/models/config.ts` with:

```typescript
import type { TcpServiceMap } from '#src/features/runtime-control/tcp-service-config.js';

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
```

Removed: `TUNNEL_SERVICE_NAMES`, `TunnelServiceName`, `TUNNEL_HEALTH_STATES`, `TunnelHealthState`, `TunnelServiceConfig`, `TunnelConfig`, `tunnelEnabled` from `VmConfig`, `tunnelConfig` from `ResolvedRuntimeConfig`, `tunnels` from `DaemonStatus`.

Added: `tcpServiceMap` on `ResolvedRuntimeConfig`, `tcpServices` on `DaemonStatus`.

**Step 2: Update ipc.ts — remove tunnel IPC, update DaemonStatus schema**

Replace the full contents of `agent_vm/src/core/models/ipc.ts` with:

```typescript
import { z } from 'zod';

const daemonStatusSchema = z.object({
	sessionName: z.string(),
	clients: z.number().int().nonnegative(),
	idleTimeoutMinutes: z.number().int().positive(),
	idleDeadlineEpochMs: z.number().int().nonnegative().nullable(),
	startedAtEpochMs: z.number().int().nonnegative(),
	tcpServices: z
		.array(
			z.object({
				name: z.string(),
				guestHostname: z.string(),
				guestPort: z.number().int().positive(),
				upstreamTarget: z.string(),
				enabled: z.boolean(),
			}),
		)
		.readonly(),
	vm: z.object({
		id: z.string(),
		running: z.boolean(),
	}),
});

const daemonRequestSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('status') }),
	z.object({ kind: z.literal('attach'), command: z.string().optional() }),
	z.object({ kind: z.literal('policy.reload') }),
	z.object({ kind: z.literal('policy.allow'), target: z.string().min(1) }),
	z.object({ kind: z.literal('policy.block'), target: z.string().min(1) }),
	z.object({ kind: z.literal('policy.clear') }),
	z.object({ kind: z.literal('shutdown') }),
]);

const daemonResponseSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('attached'), sessionId: z.string() }),
	z.object({
		kind: z.literal('status.response'),
		status: daemonStatusSchema,
	}),
	z.object({ kind: z.literal('stream.stdout'), data: z.string() }),
	z.object({ kind: z.literal('stream.stderr'), data: z.string() }),
	z.object({ kind: z.literal('stream.exit'), code: z.number().int() }),
	z.object({ kind: z.literal('ack'), message: z.string() }),
	z.object({ kind: z.literal('error'), message: z.string() }),
]);

export type DaemonRequest = z.infer<typeof daemonRequestSchema>;
export type DaemonResponse = z.infer<typeof daemonResponseSchema>;

export function parseDaemonRequestValue(value: unknown): DaemonRequest {
	const parsed = daemonRequestSchema.safeParse(value);
	if (!parsed.success) {
		throw new Error(
			`Invalid daemon request: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
		);
	}
	return parsed.data;
}

export function parseDaemonResponseValue(value: unknown): DaemonResponse {
	const parsed = daemonResponseSchema.safeParse(value);
	if (!parsed.success) {
		throw new Error(
			`Invalid daemon response: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
		);
	}
	return parsed.data;
}
```

Removed: `tunnel.restart` from `daemonRequestSchema`, `TUNNEL_HEALTH_STATES` and `TUNNEL_SERVICE_NAMES` imports, `tunnels` from `daemonStatusSchema`.

Added: `tcpServices` on `daemonStatusSchema`.

**Step 3: Update vm-adapter.ts — wire tcp.hosts, remove loopback**

Replace the full contents of `agent_vm/src/core/infrastructure/vm-adapter.ts` with:

```typescript
import fs from 'node:fs';
import path from 'node:path';

import type { Logger } from '#src/core/platform/logger.js';
import type { TcpServiceMap } from '#src/features/runtime-control/tcp-service-config.js';
import {
	buildTcpHostsRecord,
	buildTcpServiceEnvVars,
	validateTcpServiceTargets,
} from '#src/features/runtime-control/tcp-service-config.js';

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

export interface VmRuntime {
	getId(): string;
	exec(command: string): Promise<VmExecResult>;
	close(): Promise<void>;
}

export interface CreateVmRuntimeOptions {
	workDir: string;
	allowedHosts: readonly string[];
	tcpServiceMap: TcpServiceMap;
	sessionLabel: string;
	logger: Logger;
	sessionAuthRoot: string;
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

class GondolinVmRuntime implements VmRuntime {
	public constructor(private readonly vmHandle: GondolinVm) {}

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
	validateTcpServiceTargets(options.tcpServiceMap);

	const gondolinModule = await loadGondolinModule();

	const hooks = gondolinModule.createHttpHooks({
		allowedHosts: [...options.allowedHosts],
		secrets: buildSecretSpecFromHostEnv(),
	});

	const tcpHosts = buildTcpHostsRecord(options.tcpServiceMap);
	const hasTcpMappings = Object.keys(tcpHosts).length > 0;

	const tcpServiceEnvVars = buildTcpServiceEnvVars(options.tcpServiceMap);

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
			...tcpServiceEnvVars,
		},
		httpHooks: hooks.httpHooks,
		vfs: createWorkspaceVfsMount(options.workDir, gondolinModule),
		...(hasTcpMappings
			? {
					dns: { mode: 'synthetic', syntheticHostMapping: 'per-host' },
					tcp: { hosts: tcpHosts },
				}
			: {}),
	});

	options.logger.log('info', 'vm-adapter', 'vm runtime created', {
		vmId: vm.id,
		workspacePath: options.workDir,
		tcpMappings: Object.keys(tcpHosts).length,
	});

	return new GondolinVmRuntime(vm);
}
```

Key changes:

- `VmRuntime` no longer extends `GuestLoopbackStreamOpener`
- `CreateVmRuntimeOptions` now has `tcpServiceMap` field
- `createVmRuntime()` calls `validateTcpServiceTargets()` before boot
- Passes `dns` and `tcp` options to `createVm()` when mappings exist
- Env vars built dynamically from tcp service config
- `GondolinVmRuntime` no longer has `openGuestLoopbackStream()` or logger/streamOpener fields
- Removed: `LoopbackStreamOpener`, `GondolinVmWithPrivateLoopback`, `resolveLoopbackStreamOpener()`

**Step 4: Update session-daemon.ts — remove tunnel lifecycle**

In `agent_vm/src/features/runtime-control/session-daemon.ts`, make these changes:

Remove these imports (lines 6, 8):

```
- import { TunnelManager } from '#src/core/infrastructure/tunnel-manager.js';
```

Remove from type imports (line 8-11): remove `TunnelConfig` and `TunnelServiceName` if imported anywhere. Keep: `DaemonStatus`, `ResolvedRuntimeConfig`, `WorkspaceIdentity`.

Update `DaemonDependencies` interface — remove `createTunnelManager`:

```typescript
export interface DaemonDependencies {
	createRuntimeConfig: (workDir: string) => ResolvedRuntimeConfig;
	createVmRuntime: typeof createVmRuntime;
	createAuthSyncManager: (logger: Logger) => AuthSyncManager;
}
```

Update `DEFAULT_DEPENDENCIES` — remove `createTunnelManager`:

```typescript
const DEFAULT_DEPENDENCIES: DaemonDependencies = {
	createRuntimeConfig: resolveRuntimeConfig,
	createVmRuntime,
	createAuthSyncManager: (logger) => new AuthSyncManager(logger),
};
```

In `AgentVmDaemon` class:

- Remove field: `private tunnelManager: TunnelManager | null = null;`
- Remove method: `ensureTunnelManagerRunning()`
- In `start()` (line 87): remove `await this.ensureTunnelManagerRunning();`
- In `recreateRuntime()` (line 177): remove `await this.ensureTunnelManagerRunning();`
- In `stopRuntime()`: remove tunnel manager stop block (lines 145-148)
- In `handleRequest()` `case 'tunnel.restart'`: delete the entire case block (lines 368-381)

Update `start()` to pass `tcpServiceMap`:

```typescript
public async start(): Promise<void> {
	this.stopping = false;
	this.runtimeConfig = this.dependencies.createRuntimeConfig(this.identity.workDir);

	const authSync = this.dependencies.createAuthSyncManager(this.logger);
	authSync.exportClaudeOauthFromKeychain();
	this.authSyncState = authSync.prepareSessionAuthMirror(this.identity.sessionName);

	this.vmRuntime = await this.dependencies.createVmRuntime({
		workDir: this.identity.workDir,
		allowedHosts: this.runtimeConfig.allowedHosts,
		tcpServiceMap: this.runtimeConfig.tcpServiceMap,
		sessionLabel: this.identity.sessionName,
		logger: this.logger,
		sessionAuthRoot: this.authSyncState.sessionAuthRoot,
	});

	await this.listen();

	this.logger.log('info', 'daemon', 'daemon started', {
		socketPath: this.identity.daemonSocketPath,
	});
}
```

Update `recreateRuntime()` similarly — pass `tcpServiceMap`:

```typescript
private async recreateRuntime(reason: string): Promise<void> {
	if (this.runtimeRecreatePromise) {
		await this.runtimeRecreatePromise;
		return;
	}

	this.runtimeRecreatePromise = (async () => {
		if (!this.runtimeConfig || !this.authSyncState) {
			throw new Error('runtime-config-unavailable');
		}

		this.logger.log('info', 'daemon', 'recreating vm runtime', { reason });
		await this.stopRuntime();

		this.vmRuntime = await this.dependencies.createVmRuntime({
			workDir: this.identity.workDir,
			allowedHosts: this.runtimeConfig.allowedHosts,
			tcpServiceMap: this.runtimeConfig.tcpServiceMap,
			sessionLabel: this.identity.sessionName,
			logger: this.logger,
			sessionAuthRoot: this.authSyncState.sessionAuthRoot,
		});
	})();

	try {
		await this.runtimeRecreatePromise;
	} finally {
		this.runtimeRecreatePromise = null;
	}
}
```

Update `stopRuntime()` — just stop VM, no tunnel manager:

```typescript
private async stopRuntime(): Promise<void> {
	if (this.vmRuntime) {
		await this.vmRuntime.close();
		this.vmRuntime = null;
	}
}
```

Update `getStatus()` to return tcp services instead of tunnel status:

```typescript
public getStatus(): DaemonStatus {
	const tcpServices = this.runtimeConfig
		? Object.entries(this.runtimeConfig.tcpServiceMap.services).map(([name, entry]) => ({
				name,
				guestHostname: entry.guestHostname,
				guestPort: entry.guestPort,
				upstreamTarget: entry.upstreamTarget,
				enabled: entry.enabled,
			}))
		: [];

	return {
		sessionName: this.identity.sessionName,
		clients: this.clients.size,
		idleTimeoutMinutes: this.runtimeConfig?.vmConfig.idleTimeoutMinutes ?? 10,
		idleDeadlineEpochMs: this.idleDeadlineEpochMs,
		startedAtEpochMs: this.startedAtEpochMs,
		tcpServices,
		vm: {
			id: this.vmRuntime?.getId() ?? 'none',
			running: this.vmRuntime !== null,
		},
	};
}
```

**Step 5: Update config-resolver.ts — use tcp service config**

In `agent_vm/src/features/runtime-control/config-resolver.ts`:

Replace the tunnel import (line 7):

```typescript
// Remove:
import { loadTunnelConfig } from '#src/features/runtime-control/tunnel-config.js';
// Add:
import { loadTcpServiceConfig } from '#src/features/runtime-control/tcp-service-config.js';
```

In `resolveVmConfig()`, remove `tunnelEnabled` (line 89):

```typescript
export function resolveVmConfig(workDir: string): VmConfig {
	const merged = resolveVmConfigMap(workDir);
	const idleTimeoutRaw = merged['IDLE_TIMEOUT_MINUTES'] ?? '10';
	const idleTimeoutMinutes = Number.parseInt(idleTimeoutRaw, 10);
	if (!Number.isFinite(idleTimeoutMinutes) || idleTimeoutMinutes <= 0) {
		throw new Error(`Invalid IDLE_TIMEOUT_MINUTES value '${idleTimeoutRaw}'`);
	}

	return {
		idleTimeoutMinutes,
		extraAptPackages: parseList(merged['EXTRA_APT_PACKAGES'] ?? ''),
		playwrightExtraHosts: parseList(merged['PLAYWRIGHT_EXTRA_HOSTS'] ?? ''),
	};
}
```

In `resolveRuntimeConfig()`, replace tunnel with tcp:

```typescript
export function resolveRuntimeConfig(workDir: string): ResolvedRuntimeConfig {
	const vmConfig = resolveVmConfig(workDir);
	const tcpServiceMap = loadTcpServiceConfig(workDir);
	const allowedHosts = compileAndPersistPolicy(workDir);

	const generatedStateDir = getGeneratedStateDir(workDir);
	fs.mkdirSync(generatedStateDir, { recursive: true });

	const togglePath = path.join(generatedStateDir, 'policy-toggle.entries.txt');
	const toggleEntries = fs.existsSync(togglePath)
		? fs
				.readFileSync(togglePath, 'utf8')
				.split(/\r?\n/u)
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
		: [];

	return {
		vmConfig,
		tcpServiceMap,
		allowedHosts,
		toggleEntries,
		generatedStateDir,
	};
}
```

**Step 6: Update agent-vm-ctl.ts — remove tunnels subcommand**

In `agent_vm/src/features/cli/agent-vm-ctl.ts`:

Delete the entire `tunnelsCommand` block (lines 157-198).

Remove `tunnels` from the root subcommands (line 220):

```typescript
export const agentVmCtlCommand = subcommands({
	name: 'agent-vm-ctl',
	cmds: {
		status: statusCommand,
		policy: policyCommand,
		daemon: daemonCommand,
	},
});
```

**Step 7: Update vm.base.conf — remove TUNNEL_ENABLED**

Replace `agent_vm/config/vm.base.conf`:

```
# Agent VM default configuration
IDLE_TIMEOUT_MINUTES=10
EXTRA_APT_PACKAGES=
PLAYWRIGHT_EXTRA_HOSTS=
```

**Step 8: Delete tunnel files**

Run:

```bash
rm agent_vm/src/core/infrastructure/tunnel-manager.ts
rm agent_vm/src/features/runtime-control/tunnel-config.ts
rm agent_vm/src/features/runtime-control/tunnel-config.unit.test.ts
rm agent_vm/tests/bridge-tunnel.integration.test.ts
```

**Step 9: Build and typecheck**

Run: `cd agent_vm && pnpm build && pnpm typecheck`

Expected: PASS. All type errors resolved.

**Step 10: Lint**

Run: `cd agent_vm && pnpm lint`

Expected: PASS. No unused imports or dead code.

**Step 11: Commit**

```bash
cd agent_vm && git add -A
git commit -m "$(cat <<'EOF'
feat(agent_vm): replace tunnel subsystem with gondolin tcp.hosts

Hard cutover from custom host-side tunnel pool to Gondolin's
first-class mapped TCP support.

Guest apps connect to *.vm.host hostnames (pg.vm.host:5432,
redis.vm.host:6379) via synthetic DNS. Gondolin routes TCP at the
QEMU network layer to host-local Docker-published services.

Changes:
- Wire dns + tcp options into VM.create() from tcp service config
- Pre-boot validation: strict mode rejects non-localhost targets
- Dynamic env vars from tcp service config
- Remove tunnel manager, tunnel config, loopback stream opener
- Remove tunnel.restart IPC command and tunnels CLI subcommand
- Simplify VmRuntime interface and DaemonDependencies

~580 lines deleted, ~250 lines added (including tests).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Update tests (unit + integration + e2e)

**Files:**

- Modify: `agent_vm/tests/runtime-control-daemon.integration.test.ts`
- Modify: `agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`
- Modify: `agent_vm/src/features/cli/agent-vm-ctl.unit.test.ts`
- Modify: `agent_vm/tests/e2e/smoke.e2e.test.ts`

**Step 1: Update daemon integration test fixtures**

In `agent_vm/tests/runtime-control-daemon.integration.test.ts`, every test creates a `fakeConfig: ResolvedRuntimeConfig`. Update all instances:

Replace every `fakeConfig` occurrence. The new shape (use this for all tests):

```typescript
const fakeConfig: ResolvedRuntimeConfig = {
	vmConfig: {
		idleTimeoutMinutes: 10,
		extraAptPackages: [],
		playwrightExtraHosts: [],
	},
	tcpServiceMap: {
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
				enabled: true,
			},
		},
		strictMode: true,
		allowedTargetHosts: ['127.0.0.1', 'localhost'],
	},
	allowedHosts: ['api.openai.com'],
	toggleEntries: [],
	generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
};
```

Remove from each `fakeDependencies`:

- `createTunnelManager` — delete the entire property and its mock class

Remove from each `createVmRuntime` mock:

- `openGuestLoopbackStream` method — no longer on VmRuntime

Updated `createVmRuntime` mock:

```typescript
createVmRuntime: async () => ({
	getId: () => 'fake-vm',
	exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
	close: async () => {},
}),
```

Updated `fakeDependencies` (for all tests):

```typescript
const fakeDependencies: DaemonDependencies = {
	createRuntimeConfig: () => fakeConfig,
	createVmRuntime: async () => ({
		getId: () => 'fake-vm',
		exec: async () => ({ exitCode: 0, stdout: 'ok\n', stderr: '' }),
		close: async () => {},
	}),
	createAuthSyncManager: () => {
		const stub: Pick<
			AuthSyncManager,
			'exportClaudeOauthFromKeychain' | 'prepareSessionAuthMirror' | 'copyBackSessionAuthMirror'
		> = {
			exportClaudeOauthFromKeychain: () => {},
			prepareSessionAuthMirror: (): AuthSyncState => ({
				sessionAuthRoot: path.join(workDir, '.tmp-auth'),
				lockPath: path.join(workDir, '.tmp-auth', '.sync.lock'),
			}),
			copyBackSessionAuthMirror: () => {},
		};
		return stub as AuthSyncManager;
	},
};
```

Also remove the tunnel-start-failed test (lines 133-208) — it tests `TunnelManager` startup failure which no longer applies. Replace with a validation failure test:

```typescript
it('fails daemon startup when tcp service validation fails', async () => {
	const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-tcp-validation-'));
	fs.mkdirSync(path.join(workDir, '.agent_vm'), { recursive: true });

	const identity = deriveWorkspaceIdentity(workDir);
	socketsToCleanup.push(identity.daemonSocketPath);

	const fakeConfig: ResolvedRuntimeConfig = {
		vmConfig: {
			idleTimeoutMinutes: 10,
			extraAptPackages: [],
			playwrightExtraHosts: [],
		},
		tcpServiceMap: {
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
		},
		allowedHosts: ['api.openai.com'],
		toggleEntries: [],
		generatedStateDir: path.join(workDir, '.agent_vm', '.generated'),
	};

	const fakeDependencies: DaemonDependencies = {
		createRuntimeConfig: () => fakeConfig,
		createVmRuntime: async () => {
			throw new Error("upstream target host '10.0.0.5' is not in allowedTargetHosts");
		},
		createAuthSyncManager: () => {
			const stub: Pick<
				AuthSyncManager,
				'exportClaudeOauthFromKeychain' | 'prepareSessionAuthMirror' | 'copyBackSessionAuthMirror'
			> = {
				exportClaudeOauthFromKeychain: () => {},
				prepareSessionAuthMirror: (): AuthSyncState => ({
					sessionAuthRoot: path.join(workDir, '.tmp-auth'),
					lockPath: path.join(workDir, '.tmp-auth', '.sync.lock'),
				}),
				copyBackSessionAuthMirror: () => {},
			};
			return stub as AuthSyncManager;
		},
	};

	const daemon = new AgentVmDaemon(identity, new NoopLogger(), fakeDependencies);
	await expect(daemon.start()).rejects.toThrowError(/allowedTargetHosts/u);
});
```

Also update the `tunnel.restart` invalid request test — change it to test a different invalid request (since `tunnel.restart` is removed):

In the test `'returns invalid-request errors for malformed request payloads'`, the test sends `{ kind: 'policy.allow' }` (missing `target`). This still works — no change needed for this test.

**Step 2: Update config-resolver test**

In `agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`:

Remove the `tunnelEnabled` assertion (line 24) and the `TUNNEL_ENABLED` config line (line 17):

```typescript
it('resolves vm config with local overriding repo and base', () => {
	const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-config-'));
	const configDir = path.join(workDir, '.agent_vm');
	fs.mkdirSync(configDir, { recursive: true });

	fs.writeFileSync(path.join(configDir, 'vm.repo.conf'), 'IDLE_TIMEOUT_MINUTES=20\n');
	fs.writeFileSync(path.join(configDir, 'vm.local.conf'), 'IDLE_TIMEOUT_MINUTES=7\n');

	const resolved = resolveVmConfig(workDir);

	expect(resolved.idleTimeoutMinutes).toBe(7);
});
```

Remove the `TUNNEL_ENABLED=disabled` test (lines 27-33) since the field no longer exists.

**Step 3: Update CLI unit tests**

In `agent_vm/src/features/cli/agent-vm-ctl.unit.test.ts`:

- Remove the test that asserts tunnel-service validation (`tunnels restart --service ...`) since `tunnels` command is removed.
- Add a replacement command-contract test that still validates CLI argument behavior. Example:
  - invalid `policy allow` usage without `--target` fails.
  - valid `status --work-dir ...` command parses and runs.

**Step 4: Update e2e smoke fixture schema**

In `agent_vm/tests/e2e/smoke.e2e.test.ts`:

- Replace `status.tunnels` fixture with `status.tcpServices`.
- Include at least one enabled postgres mapping entry in fixture response to verify CLI output format after migration.

**Step 5: Run all tests**

Run: `cd agent_vm && pnpm build && pnpm test`

Expected: All tests PASS (unit + integration).

**Step 6: Commit**

```bash
cd agent_vm && git add -A
git commit -m "$(cat <<'EOF'
test(agent_vm): update tests for tcp.hosts migration

Replace tunnel config fixtures with tcpServiceMap in all daemon
integration tests. Add tcp validation failure test. Remove
tunnel-start-failed and tunnelEnabled tests.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Automated tmp workspace validation with host Docker services

This is a required post-merge validation pass. It is "manual scenario coverage" but must be executed automatically by the agent using shell commands.

**Goal:** prove end-to-end guest VM connectivity to host Docker PostgreSQL + Redis through `tcp.hosts`, in a fresh temporary workspace.

**Step 1: Start disposable Docker services on host loopback**

Run (example names include a timestamp suffix to avoid collisions):

```bash
PG_CONTAINER="agent-vm-plan-pg-$(date +%s)"
REDIS_CONTAINER="agent-vm-plan-redis-$(date +%s)"

docker run -d --name "$PG_CONTAINER" \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=agent_vm_test \
  -p 127.0.0.1:15432:5432 \
  postgres:16

docker run -d --name "$REDIS_CONTAINER" \
  -p 127.0.0.1:16379:6379 \
  redis:7-alpine
```

If Docker is unavailable, stop here and report explicit blocker (do not claim done).

**Step 2: Wait for service readiness**

```bash
for _ in $(seq 1 60); do
  if docker exec "$PG_CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$PG_CONTAINER" pg_isready -U postgres >/dev/null 2>&1

for _ in $(seq 1 30); do
  if docker exec "$REDIS_CONTAINER" redis-cli ping | grep -q PONG; then
    break
  fi
  sleep 1
done
docker exec "$REDIS_CONTAINER" redis-cli ping | grep -q PONG
```

**Step 3: Create tmp workspace and tcp config**

```bash
TMP_WORKDIR="$(mktemp -d /tmp/agent-vm-tcp-e2e-XXXXXX)"
mkdir -p "$TMP_WORKDIR/.agent_vm"
cat > "$TMP_WORKDIR/.agent_vm/tcp-services.local.json" <<'JSON'
{
  "strictMode": true,
  "services": {
    "postgres": {
      "guestHostname": "pg.vm.host",
      "guestPort": 5432,
      "upstreamTarget": "127.0.0.1:15432",
      "enabled": true
    },
    "redis": {
      "guestHostname": "redis.vm.host",
      "guestPort": 6379,
      "upstreamTarget": "127.0.0.1:16379",
      "enabled": true
    }
  }
}
JSON
```

**Step 4: Run VM command that verifies both endpoints**

Build first, then run command in VM from the tmp workspace (run this from the repo root):

```bash
AI_TOOLS_ROOT="$(pwd)"
cd "$AI_TOOLS_ROOT/agent_vm" && pnpm build
cd "$TMP_WORKDIR"
node "$AI_TOOLS_ROOT/agent_vm/dist/bin/run-agent-vm.js" \
  --run "/bin/sh -lc 'command -v nc >/dev/null 2>&1 || { echo \"nc missing in guest image\" >&2; exit 2; }; nc -z pg.vm.host 5432 && nc -z redis.vm.host 6379'"
```

Expected: command exits `0`.

**Step 5: Cleanup (always)**

```bash
docker rm -f "$PG_CONTAINER" "$REDIS_CONTAINER"
rm -rf "$TMP_WORKDIR"
```

If connectivity fails, collect logs:

- `docker logs "$PG_CONTAINER"`
- `docker logs "$REDIS_CONTAINER"`
- daemon log from `.agent_vm/.generated` for the tmp workspace

---

### Task 6: Final verification

**Step 1: Run all quality checks**

Run these in parallel:

```bash
cd agent_vm && pnpm lint
cd agent_vm && pnpm fmt:check
cd agent_vm && pnpm typecheck
cd agent_vm && pnpm test
```

Expected: ALL PASS with 0 errors.

**Step 2: Verify line counts**

Run: `cd agent_vm && find src tests -name '*.ts' | xargs wc -l | tail -1`

Verify the total is reduced by ~300+ lines compared to before.

**Step 3: Verify no tunnel references remain**

Run: `cd agent_vm && rg -n 'tunnel|Tunnel|TUNNEL' src/ tests/ config/`

Expected: No matches (zero references to the old tunnel system).

**Step 4: Run e2e smoke tests (if Gondolin available)**

Run: `cd agent_vm && pnpm test:e2e`

Expected: PASS. The smoke test should still work with the new VM creation path.

**Step 5: Confirm tmp Docker validation from Task 5 was executed**

Record in final execution notes:

- exact commands run
- container image tags used
- exit code for VM connectivity command
- cleanup status (both containers removed)

---

## Post-migration notes

- **Config file migration**: Repos using `.agent_vm/tunnels.repo.json` or `.agent_vm/tunnels.local.json` should migrate to `tcp-services.repo.json` / `tcp-services.local.json`. The old files are ignored.
- **CLI breaking change**: `agent-vm-ctl tunnels` subcommand is removed. Use `agent-vm-ctl status` to see tcp service mappings.
- **Env var change**: Guest apps should use `PGHOST=pg.vm.host` (not `127.0.0.1`) and `PGPORT=5432` (not `15432`). Standard postgres clients will work with these values.

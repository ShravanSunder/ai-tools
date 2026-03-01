# Agent VM Config Surface & Per-Project Image Building — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all hardcoded config in agent_vm with a layered JSON + Zod config surface that enables per-project image building and sidecar-equivalent persistence, making agent_vm a real sidecar replacement.

**Architecture:** Three config file types (build JSON, runtime JSON, tcp-services JSON) plus firewall txt. Build config is two-tier (base + project). Runtime config is three-tier (base > repo > local). Per-project images cached by workspace hash. Persistent volumes use host-backed opaque directories mounted via Gondolin RealFSProvider. Monorepo node_modules discovery at daemon startup.

**Tech Stack:** TypeScript (strict mode, ES modules), Zod v4 for validation, Gondolin VFS providers (RealFSProvider, ReadonlyProvider, ShadowProvider, MemoryProvider), vitest for testing.

**Design Doc:** `docs/plans/2026-03-01-agent-vm-config-surface-design.md`

---

## Phase 1: Zod Schemas & JSON Schema Generation

### Task 1: Create build config Zod schema

**Files:**
- Create: `agent_vm/src/core/models/build-config.ts`
- Test: `agent_vm/src/core/models/build-config.unit.test.ts`

**Step 1: Write failing test**

```typescript
import { describe, expect, it } from 'vitest';

import {
	type BuildConfigInput,
	mergeBuildConfigs,
	parseBuildConfig,
} from '#src/core/models/build-config.js';

describe('build config schema', () => {
	it('parses minimal valid config', () => {
		const config = parseBuildConfig({
			arch: 'aarch64',
			distro: 'alpine',
		});

		expect(config.arch).toBe('aarch64');
		expect(config.distro).toBe('alpine');
	});

	it('parses full config with OCI and postBuild', () => {
		const config = parseBuildConfig({
			arch: 'aarch64',
			distro: 'alpine',
			oci: {
				image: 'docker.io/library/debian:bookworm-slim',
				pullPolicy: 'if-not-present',
			},
			postBuild: {
				commands: ['apt-get update && apt-get install -y git'],
			},
			env: { LANG: 'C.UTF-8' },
			runtimeDefaults: { rootfsMode: 'memory' },
		});

		expect(config.oci?.image).toBe('docker.io/library/debian:bookworm-slim');
		expect(config.postBuild?.commands).toEqual(['apt-get update && apt-get install -y git']);
		expect(config.env).toEqual({ LANG: 'C.UTF-8' });
	});

	it('rejects invalid arch', () => {
		expect(() => parseBuildConfig({ arch: 'mips', distro: 'alpine' })).toThrow();
	});

	it('rejects invalid rootfsMode', () => {
		expect(() =>
			parseBuildConfig({
				arch: 'aarch64',
				distro: 'alpine',
				runtimeDefaults: { rootfsMode: 'invalid' },
			}),
		).toThrow();
	});
});

describe('mergeBuildConfigs', () => {
	it('deep merges base and project configs', () => {
		const base: BuildConfigInput = {
			arch: 'aarch64',
			distro: 'alpine',
			oci: { image: 'debian:bookworm-slim' },
			postBuild: { commands: ['apt-get install -y git'] },
			env: { LANG: 'C.UTF-8' },
		};
		const project: BuildConfigInput = {
			oci: { image: 'ubuntu:24.04' },
			postBuild: { commands: ['apt-get install -y postgresql-client'] },
		};

		const merged = mergeBuildConfigs(base, project);

		expect(merged.arch).toBe('aarch64');
		expect(merged.oci?.image).toBe('ubuntu:24.04');
		// postBuild.commands concatenated: base first, then project
		expect(merged.postBuild?.commands).toEqual([
			'apt-get install -y git',
			'apt-get install -y postgresql-client',
		]);
		expect(merged.env).toEqual({ LANG: 'C.UTF-8' });
	});

	it('project env merges over base env', () => {
		const base: BuildConfigInput = { env: { LANG: 'C.UTF-8', FOO: 'bar' } };
		const project: BuildConfigInput = { env: { FOO: 'baz', NEW: 'val' } };
		const merged = mergeBuildConfigs(base, project);

		expect(merged.env).toEqual({ LANG: 'C.UTF-8', FOO: 'baz', NEW: 'val' });
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir agent_vm vitest run src/core/models/build-config.unit.test.ts`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `agent_vm/src/core/models/build-config.ts`:

```typescript
import { z } from 'zod';

const architectureSchema = z.enum(['aarch64', 'x86_64']);
const distroSchema = z.enum(['alpine', 'nixos']);
const rootfsModeSchema = z.enum(['readonly', 'memory', 'cow']);
const pullPolicySchema = z.enum(['if-not-present', 'always', 'never']);
const containerRuntimeSchema = z.enum(['docker', 'podman']);

const ociRootfsSchema = z.object({
	image: z.string().min(1),
	runtime: containerRuntimeSchema.optional(),
	platform: z.string().optional(),
	pullPolicy: pullPolicySchema.optional(),
});

const postBuildSchema = z.object({
	commands: z.array(z.string()).optional(),
});

const initSchema = z.object({
	rootfsInit: z.string().optional(),
	initramfsInit: z.string().optional(),
	rootfsInitExtra: z.string().optional(),
});

const rootfsSchema = z.object({
	label: z.string().optional(),
	sizeMb: z.number().int().positive().optional(),
});

const runtimeDefaultsSchema = z.object({
	rootfsMode: rootfsModeSchema.optional(),
});

export const buildConfigSchema = z.object({
	arch: architectureSchema.optional(),
	distro: distroSchema.optional(),
	oci: ociRootfsSchema.optional(),
	postBuild: postBuildSchema.optional(),
	env: z.record(z.string(), z.string()).optional(),
	init: initSchema.optional(),
	rootfs: rootfsSchema.optional(),
	runtimeDefaults: runtimeDefaultsSchema.optional(),
});

export type BuildConfigInput = z.input<typeof buildConfigSchema>;
export type BuildConfig = z.output<typeof buildConfigSchema>;

export function parseBuildConfig(input: unknown): BuildConfig {
	return buildConfigSchema.parse(input);
}

export function mergeBuildConfigs(
	base: BuildConfigInput,
	project: BuildConfigInput,
): BuildConfigInput {
	return {
		arch: project.arch ?? base.arch,
		distro: project.distro ?? base.distro,
		oci: project.oci
			? { ...base.oci, ...project.oci }
			: base.oci,
		postBuild: {
			commands: [
				...(base.postBuild?.commands ?? []),
				...(project.postBuild?.commands ?? []),
			],
		},
		env: { ...base.env, ...project.env },
		init: project.init ?? base.init,
		rootfs: project.rootfs
			? { ...base.rootfs, ...project.rootfs }
			: base.rootfs,
		runtimeDefaults: project.runtimeDefaults
			? { ...base.runtimeDefaults, ...project.runtimeDefaults }
			: base.runtimeDefaults,
	};
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --dir agent_vm vitest run src/core/models/build-config.unit.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add agent_vm/src/core/models/build-config.ts agent_vm/src/core/models/build-config.unit.test.ts
git commit -m "feat(agent_vm): add build config Zod schema with merge support"
```

---

### Task 2: Create runtime config Zod schema

**Files:**
- Create: `agent_vm/src/core/models/vm-runtime-config.ts`
- Test: `agent_vm/src/core/models/vm-runtime-config.unit.test.ts`

**Step 1: Write failing test**

```typescript
import { describe, expect, it } from 'vitest';

import {
	mergeVmRuntimeConfigs,
	parseVmRuntimeConfig,
	type VmRuntimeConfigInput,
} from '#src/core/models/vm-runtime-config.js';

describe('vm runtime config schema', () => {
	it('parses empty input with all defaults', () => {
		const config = parseVmRuntimeConfig({});

		expect(config.rootfsMode).toBe('memory');
		expect(config.memory).toBe(2048);
		expect(config.cpus).toBe(2);
		expect(config.idleTimeoutMinutes).toBe(10);
		expect(config.monorepoDiscovery).toBe(true);
	});

	it('parses full config with volumes and shadows', () => {
		const config = parseVmRuntimeConfig({
			rootfsMode: 'cow',
			memory: 4096,
			cpus: 4,
			volumes: {
				venv: { guestPath: '${WORKSPACE}/.venv' },
			},
			shadows: {
				deny: ['.agent_vm', '.git'],
				tmpfs: [],
			},
		});

		expect(config.rootfsMode).toBe('cow');
		expect(config.memory).toBe(4096);
		expect(config.volumes?.venv?.guestPath).toBe('${WORKSPACE}/.venv');
	});

	it('rejects invalid rootfsMode', () => {
		expect(() => parseVmRuntimeConfig({ rootfsMode: 'invalid' })).toThrow();
	});

	it('rejects negative memory', () => {
		expect(() => parseVmRuntimeConfig({ memory: -1 })).toThrow();
	});
});

describe('mergeVmRuntimeConfigs', () => {
	it('deep merges three tiers: base > repo > local', () => {
		const base: VmRuntimeConfigInput = {
			memory: 2048,
			cpus: 2,
			env: { HOME: '/home/agent' },
			volumes: {
				venv: { guestPath: '${WORKSPACE}/.venv' },
				pnpmStore: { guestPath: '/home/agent/.local/share/pnpm' },
			},
			shadows: { deny: ['.agent_vm', '.git'], tmpfs: [] },
		};
		const repo: VmRuntimeConfigInput = {
			memory: 4096,
			env: { CUSTOM: 'value' },
		};
		const local: VmRuntimeConfigInput = {
			cpus: 4,
		};

		const merged = mergeVmRuntimeConfigs(base, repo, local);

		expect(merged.memory).toBe(4096);
		expect(merged.cpus).toBe(4);
		expect(merged.env).toEqual({ HOME: '/home/agent', CUSTOM: 'value' });
		expect(merged.volumes?.venv?.guestPath).toBe('${WORKSPACE}/.venv');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir agent_vm vitest run src/core/models/vm-runtime-config.unit.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Create `agent_vm/src/core/models/vm-runtime-config.ts`:

```typescript
import { z } from 'zod';

const rootfsModeSchema = z.enum(['readonly', 'memory', 'cow']);

const volumeEntrySchema = z.object({
	guestPath: z.string().min(1),
});

const shadowsSchema = z.object({
	deny: z.array(z.string()).optional(),
	tmpfs: z.array(z.string()).optional(),
});

const initScriptsSchema = z.object({
	background: z.string().nullable().optional(),
	foreground: z.string().nullable().optional(),
});

const shellSchema = z.object({
	zshrcExtra: z.string().nullable().optional(),
	atuin: z
		.object({
			importOnFirstRun: z.boolean().optional(),
		})
		.optional(),
});

export const vmRuntimeConfigSchema = z.object({
	rootfsMode: rootfsModeSchema.default('memory'),
	memory: z.number().int().positive().default(2048),
	cpus: z.number().int().positive().default(2),
	idleTimeoutMinutes: z.number().int().positive().default(10),
	env: z.record(z.string(), z.string()).optional(),
	volumes: z.record(z.string(), volumeEntrySchema).optional(),
	shadows: shadowsSchema.optional(),
	readonlyMounts: z.record(z.string(), z.string()).optional(),
	extraMounts: z.record(z.string(), z.string()).optional(),
	monorepoDiscovery: z.boolean().default(true),
	initScripts: initScriptsSchema.optional(),
	shell: shellSchema.optional(),
	playwrightExtraHosts: z.array(z.string()).optional(),
});

export type VmRuntimeConfigInput = z.input<typeof vmRuntimeConfigSchema>;
export type VmRuntimeConfig = z.output<typeof vmRuntimeConfigSchema>;

export function parseVmRuntimeConfig(input: unknown): VmRuntimeConfig {
	return vmRuntimeConfigSchema.parse(input);
}

export function mergeVmRuntimeConfigs(
	base: VmRuntimeConfigInput,
	repo?: VmRuntimeConfigInput,
	local?: VmRuntimeConfigInput,
): VmRuntimeConfigInput {
	const layers = [base, repo, local].filter(
		(layer): layer is VmRuntimeConfigInput => layer !== undefined,
	);

	let result: VmRuntimeConfigInput = {};
	for (const layer of layers) {
		result = {
			...result,
			...layer,
			env: { ...result.env, ...layer.env },
			volumes: { ...result.volumes, ...layer.volumes },
			shadows: layer.shadows
				? { ...result.shadows, ...layer.shadows }
				: result.shadows,
			readonlyMounts: { ...result.readonlyMounts, ...layer.readonlyMounts },
			extraMounts: { ...result.extraMounts, ...layer.extraMounts },
		};
	}

	return result;
}
```

**Step 4: Run test**

Run: `pnpm --dir agent_vm vitest run src/core/models/vm-runtime-config.unit.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add agent_vm/src/core/models/vm-runtime-config.ts agent_vm/src/core/models/vm-runtime-config.unit.test.ts
git commit -m "feat(agent_vm): add runtime config Zod schema with three-tier merge"
```

---

### Task 3: JSON Schema generation build step

**Files:**
- Create: `agent_vm/src/build/generate-schemas.ts`
- Create: `agent_vm/schemas/` (output directory)
- Modify: `agent_vm/package.json` (add `generate:schemas` script)

**Step 1: Write the schema generator**

```typescript
import fs from 'node:fs';
import path from 'node:path';

import { zodToJsonSchema } from 'zod-to-json-schema';

import { buildConfigSchema } from '#src/core/models/build-config.js';
import { vmRuntimeConfigSchema } from '#src/core/models/vm-runtime-config.js';
import { tcpServiceConfigInputSchema } from '#src/features/runtime-control/tcp-service-config.js';

const SCHEMA_DIR = path.join(import.meta.dirname, '..', '..', 'schemas');

function writeSchema(filename: string, zodSchema: unknown, title: string): void {
	const jsonSchema = zodToJsonSchema(zodSchema as Parameters<typeof zodToJsonSchema>[0], {
		name: title,
		$refStrategy: 'none',
	});
	fs.mkdirSync(SCHEMA_DIR, { recursive: true });
	fs.writeFileSync(
		path.join(SCHEMA_DIR, filename),
		JSON.stringify(jsonSchema, null, '\t') + '\n',
	);
}

writeSchema('build-config.schema.json', buildConfigSchema, 'BuildConfig');
writeSchema('vm-runtime.schema.json', vmRuntimeConfigSchema, 'VmRuntimeConfig');
```

Note: `tcpServiceConfigInputSchema` needs to be exported from `tcp-service-config.ts` (currently not exported). Add the export as a small change.

**Step 2: Install `zod-to-json-schema`**

Run: `pnpm --dir agent_vm add -D zod-to-json-schema`

**Step 3: Export the tcp-service input schema**

Modify `agent_vm/src/features/runtime-control/tcp-service-config.ts:21`:
Change `const tcpServiceConfigInputSchema` to `export const tcpServiceConfigInputSchema`.

**Step 4: Add package.json script**

Add to `agent_vm/package.json` scripts:
```json
"generate:schemas": "node dist/build/generate-schemas.js",
"build": "tsc -p tsconfig.json && pnpm generate:schemas"
```

**Step 5: Build and verify schemas are generated**

Run: `pnpm --dir agent_vm build`
Expected: `agent_vm/schemas/build-config.schema.json` and `agent_vm/schemas/vm-runtime.schema.json` are created.

**Step 6: Commit**

```bash
git add agent_vm/src/build/generate-schemas.ts agent_vm/schemas/ agent_vm/package.json agent_vm/src/features/runtime-control/tcp-service-config.ts
git commit -m "feat(agent_vm): generate JSON Schemas from Zod for editor autocomplete"
```

---

## Phase 2: Config Loader & Resolver Rewrite

### Task 4: Build config loader (two-tier: base + project)

**Files:**
- Create: `agent_vm/src/features/runtime-control/build-config-loader.ts`
- Test: `agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts`

**Step 1: Write failing test**

```typescript
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadBuildConfig } from '#src/features/runtime-control/build-config-loader.js';

describe('loadBuildConfig', () => {
	it('loads base config when no project config exists', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const config = loadBuildConfig(workDir);

		expect(config.arch).toBe('aarch64');
		expect(config.oci?.image).toContain('debian');
	});

	it('merges project config on top of base', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(
			path.join(configDir, 'build.project.json'),
			JSON.stringify({
				oci: { image: 'ubuntu:24.04' },
				postBuild: { commands: ['apt-get install -y htop'] },
			}),
		);

		const config = loadBuildConfig(workDir);

		expect(config.oci?.image).toBe('ubuntu:24.04');
		// Base postBuild commands + project commands concatenated
		expect(config.postBuild?.commands?.length).toBeGreaterThan(1);
		expect(config.postBuild?.commands?.at(-1)).toBe('apt-get install -y htop');
	});

	it('throws with file context when JSON is malformed', () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-build-'));
		const configDir = path.join(workDir, '.agent_vm');
		fs.mkdirSync(configDir, { recursive: true });
		fs.writeFileSync(path.join(configDir, 'build.project.json'), '{bad-json');

		expect(() => loadBuildConfig(workDir)).toThrowError(/build\.project\.json/u);
	});
});
```

**Step 2: Run test → FAIL**

**Step 3: Implement**

The loader reads `agent_vm/config/build.base.json` and `.agent_vm/build.project.json`, parses each with Zod, merges with `mergeBuildConfigs()`.

**Step 4: Run test → PASS**

**Step 5: Commit**

```bash
git commit -m "feat(agent_vm): add two-tier build config loader"
```

---

### Task 5: Runtime config loader (three-tier: base > repo > local)

**Files:**
- Create: `agent_vm/src/features/runtime-control/vm-runtime-loader.ts`
- Test: `agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts`

Same TDD pattern: test three-tier merge from `config/vm-runtime.base.json` → `.agent_vm/vm-runtime.repo.json` → `.agent_vm/vm-runtime.local.json`. Parse each with Zod, merge with `mergeVmRuntimeConfigs()`.

**Step 5: Commit**

```bash
git commit -m "feat(agent_vm): add three-tier runtime config loader"
```

---

### Task 6: Rewrite config-resolver to use new loaders

**Files:**
- Modify: `agent_vm/src/features/runtime-control/config-resolver.ts`
- Modify: `agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`
- Modify: `agent_vm/src/core/models/config.ts` (update `VmConfig` → use `VmRuntimeConfig`, update `ResolvedRuntimeConfig`)

**Step 1: Update config.ts types**

Replace `VmConfig` interface with re-export of `VmRuntimeConfig`. Update `ResolvedRuntimeConfig`:

```typescript
import type { BuildConfig } from '#src/core/models/build-config.js';
import type { VmRuntimeConfig } from '#src/core/models/vm-runtime-config.js';

export interface ResolvedRuntimeConfig {
	readonly runtimeConfig: VmRuntimeConfig;
	readonly buildConfig: BuildConfig;
	readonly tcpServiceMap: TcpServiceMap;
	readonly allowedHosts: readonly string[];
	readonly toggleEntries: readonly string[];
	readonly generatedStateDir: string;
}
```

**Step 2: Update config-resolver.ts**

Replace `parseConf`/`loadConf`/`resolveVmConfigMap`/`resolveVmConfig` with calls to:
- `loadBuildConfig(workDir)` from build-config-loader
- `loadVmRuntimeConfig(workDir)` from vm-runtime-loader

Keep `resolveRuntimeConfig()` as the public API but return the new `ResolvedRuntimeConfig` shape.

**Step 3: Update session-daemon.ts**

Update references from `runtimeConfig.vmConfig.idleTimeoutMinutes` to `runtimeConfig.runtimeConfig.idleTimeoutMinutes`.

**Step 4: Update existing tests**

Fix `config-resolver.unit.test.ts` tests to create JSON files instead of `.conf` files.

**Step 5: Run full test suite**

Run: `pnpm --dir agent_vm test`
Expected: All PASS

**Step 6: Commit**

```bash
git commit -m "refactor(agent_vm): rewrite config-resolver to use JSON+Zod loaders, remove conf parser"
```

---

### Task 7: Delete old conf files and stale templates

**Files:**
- Delete: `agent_vm/config/vm.base.conf`
- Delete: `agent_vm/templates/.agent_vm/vm.repo.conf`
- Delete: `agent_vm/templates/.agent_vm/vm.local.conf`
- Delete: `agent_vm/templates/.agent_vm/tunnels.repo.json` (stale)
- Delete: `agent_vm/templates/.agent_vm/tunnels.local.json` (stale)
- Create: `agent_vm/config/build.base.json` (rename from `build.debian.json`)
- Create: `agent_vm/config/vm-runtime.base.json`

**Step 1: Create base config files**

`config/build.base.json`:
```json
{
	"$schema": "../schemas/build-config.schema.json",
	"arch": "aarch64",
	"distro": "alpine",
	"oci": {
		"image": "docker.io/library/debian:bookworm-slim",
		"pullPolicy": "if-not-present"
	},
	"postBuild": {
		"commands": [
			"apt-get update && apt-get install -y --no-install-recommends git curl zsh ca-certificates"
		]
	},
	"env": {
		"LANG": "C.UTF-8"
	},
	"runtimeDefaults": {
		"rootfsMode": "memory"
	}
}
```

`config/vm-runtime.base.json`:
```json
{
	"$schema": "../schemas/vm-runtime.schema.json",
	"rootfsMode": "memory",
	"memory": 2048,
	"cpus": 2,
	"idleTimeoutMinutes": 10,
	"env": {
		"HOME": "/home/agent",
		"VIRTUAL_ENV": "${WORKSPACE}/.venv",
		"PNPM_STORE_DIR": "/home/agent/.local/share/pnpm"
	},
	"volumes": {
		"venv": { "guestPath": "${WORKSPACE}/.venv" },
		"nodeModulesRoot": { "guestPath": "${WORKSPACE}/node_modules" },
		"pnpmStore": { "guestPath": "/home/agent/.local/share/pnpm" },
		"npmCache": { "guestPath": "/home/agent/.cache" },
		"uvCache": { "guestPath": "/home/agent/.local/share/uv" },
		"shellHistory": { "guestPath": "/commandhistory" }
	},
	"shadows": {
		"deny": [".agent_vm", ".git", "dist", ".next", "__pycache__"],
		"tmpfs": []
	},
	"readonlyMounts": {
		".git": "${WORKSPACE}/.git",
		".aws": "${HOME}/.aws"
	},
	"extraMounts": {},
	"monorepoDiscovery": true,
	"initScripts": {
		"background": null,
		"foreground": null
	},
	"shell": {
		"zshrcExtra": null,
		"atuin": {
			"importOnFirstRun": true
		}
	},
	"playwrightExtraHosts": []
}
```

**Step 2: Delete old files, update references in build-assets.ts**

`build-assets.ts` currently reads `config/build.debian.json` — update to `config/build.base.json`.

**Step 3: Run full test suite + typecheck**

Run: `pnpm --dir agent_vm check`
Expected: All PASS

**Step 4: Commit**

```bash
git commit -m "refactor(agent_vm): replace conf files with JSON configs, delete stale templates"
```

---

## Phase 3: Per-Project Image Building

### Task 8: Per-project image caching in build-assets.ts

**Files:**
- Modify: `agent_vm/src/build/build-assets.ts`
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts`
- Test: existing orchestrator tests should still pass

**Step 1: Update build-assets.ts**

Change `buildDebianGuestAssets` to accept a `BuildConfig` (resolved from loader) and compute per-project output dir:

```typescript
export interface BuildAssetsOptions {
	buildConfig: BuildConfig;
	outputDir: string;  // now: ~/.cache/agent-vm/images/{workspace-hash}/
	fullReset: boolean;
}
```

The orchestrator passes `outputDir` based on `identity.workDir` hash (from `deriveWorkspaceIdentity`).

**Step 2: Write the merged build config to a temp file**

`buildDebianGuestAssets` writes the merged `BuildConfig` to a temp JSON file, passes that to `gondolin build --config <temp> --output <dir>`.

**Step 3: Update run-orchestrator.ts**

`maybeBuildGuestAssets` now:
1. Loads build config via `loadBuildConfig(workDir)`
2. Computes output dir: `~/.cache/agent-vm/images/{dirHash}/`
3. Checks if image already exists (manifest.json present) — skip if yes and not `fullReset`
4. Calls `buildDebianGuestAssets` with merged config

**Step 4: Update ensureDaemonRunning and daemon to use per-project image path**

The daemon needs to know the image path. Pass it via the workspace identity or a new field.

**Step 5: Run full test suite**

Run: `pnpm --dir agent_vm test`
Expected: All PASS

**Step 6: Commit**

```bash
git commit -m "feat(agent_vm): per-project image building with layered build config"
```

---

## Phase 4: VM Adapter — Config-Driven Mounts & Volumes

### Task 9: Volume manager — host-backed opaque directories

**Files:**
- Create: `agent_vm/src/core/infrastructure/volume-manager.ts`
- Test: `agent_vm/src/core/infrastructure/volume-manager.unit.test.ts`

**Step 1: Write failing test**

```typescript
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	ensureVolumeDir,
	resolveVolumeDirs,
	wipeVolumeDirs,
} from '#src/core/infrastructure/volume-manager.js';

describe('volume manager', () => {
	it('creates volume directory if missing', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		const dir = ensureVolumeDir(cacheBase, 'abc123', 'venv');

		expect(fs.existsSync(dir)).toBe(true);
		expect(dir).toContain('abc123');
		expect(dir).toContain('venv');
	});

	it('resolves all volume dirs from runtime config', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		const volumes = {
			venv: { guestPath: '/workspace/.venv' },
			pnpmStore: { guestPath: '/home/agent/.local/share/pnpm' },
		};

		const resolved = resolveVolumeDirs(cacheBase, 'abc123', volumes);

		expect(Object.keys(resolved)).toEqual(['venv', 'pnpmStore']);
		expect(resolved.venv?.hostDir).toContain('abc123/venv');
		expect(resolved.venv?.guestPath).toBe('/workspace/.venv');
	});

	it('wipes all volume dirs for a workspace', () => {
		const cacheBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-vol-'));
		ensureVolumeDir(cacheBase, 'abc123', 'venv');
		ensureVolumeDir(cacheBase, 'abc123', 'pnpmStore');

		wipeVolumeDirs(cacheBase, 'abc123');

		expect(fs.existsSync(path.join(cacheBase, 'abc123'))).toBe(false);
	});
});
```

**Step 2: Run → FAIL**

**Step 3: Implement**

```typescript
import fs from 'node:fs';
import path from 'node:path';

export interface ResolvedVolume {
	readonly hostDir: string;
	readonly guestPath: string;
}

export function ensureVolumeDir(cacheBase: string, workspaceHash: string, volumeName: string): string {
	const dir = path.join(cacheBase, workspaceHash, volumeName);
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}

export function resolveVolumeDirs(
	cacheBase: string,
	workspaceHash: string,
	volumes: Record<string, { guestPath: string }>,
): Record<string, ResolvedVolume> {
	const result: Record<string, ResolvedVolume> = {};
	for (const [name, entry] of Object.entries(volumes)) {
		result[name] = {
			hostDir: ensureVolumeDir(cacheBase, workspaceHash, name),
			guestPath: entry.guestPath,
		};
	}
	return result;
}

export function wipeVolumeDirs(cacheBase: string, workspaceHash: string): void {
	const dir = path.join(cacheBase, workspaceHash);
	fs.rmSync(dir, { recursive: true, force: true });
}
```

**Step 4: Run → PASS**

**Step 5: Commit**

```bash
git commit -m "feat(agent_vm): add volume manager for host-backed persistent dirs"
```

---

### Task 10: Monorepo node_modules discovery

**Files:**
- Create: `agent_vm/src/features/runtime-control/monorepo-discovery.ts`
- Test: `agent_vm/src/features/runtime-control/monorepo-discovery.unit.test.ts`

Discovers `pnpm-workspace.yaml` and `package.json` workspaces, returns a list of `node_modules` paths that need volume mounts. Each path gets a volume name derived from its path hash.

Match sidecar's logic from `run-agent-sidecar.sh:454-528`.

**Step 5: Commit**

```bash
git commit -m "feat(agent_vm): monorepo node_modules discovery for volume mounts"
```

---

### Task 11: Rewrite vm-adapter to be config-driven

**Files:**
- Modify: `agent_vm/src/core/infrastructure/vm-adapter.ts`
- Modify: `agent_vm/src/core/infrastructure/vm-adapter.unit.test.ts`

**Step 1: Update `CreateVmRuntimeOptions`**

```typescript
export interface CreateVmRuntimeOptions {
	workDir: string;
	runtimeConfig: VmRuntimeConfig;
	buildConfig: BuildConfig;
	allowedHosts: readonly string[];
	tcpHosts: Record<string, string>;
	tcpServiceEnvVars: Record<string, string>;
	resolvedVolumes: Record<string, ResolvedVolume>;
	sessionLabel: string;
	logger: Logger;
	sessionAuthRoot: string;
	scratchpad: boolean;
}
```

**Step 2: Replace hardcoded shadow paths**

Read from `runtimeConfig.shadows.deny` and `runtimeConfig.shadows.tmpfs` instead of hardcoded arrays.

**Step 3: Replace hardcoded env vars**

Read from `runtimeConfig.env` instead of hardcoded `HOME`, `WORKSPACE`, etc.

**Step 4: Add volume VFS mounts**

For each `resolvedVolumes` entry, create a `RealFSProvider(hostDir)` mounted at `guestPath`. These take precedence over workspace mount due to longer path prefix.

**Step 5: Add readonly mounts**

For each `runtimeConfig.readonlyMounts` entry, create `ReadonlyProvider(RealFSProvider(hostPath))`.

**Step 6: Add extra mounts**

For each `runtimeConfig.extraMounts` entry, create `RealFSProvider(hostPath)`.

**Step 7: Scratchpad mode**

If `scratchpad: true`, replace workspace `RealFSProvider` with `MemoryProvider()`.

**Step 8: Add memory/cpus**

Pass `runtimeConfig.memory` and `runtimeConfig.cpus` to `VM.create()`.

**Step 9: Pass rootfsMode**

Pass `runtimeConfig.rootfsMode` to `VM.create({ rootfs: { mode } })`.

**Step 10: Update tests**

Update `vm-adapter.unit.test.ts` to pass the new options shape.

**Step 11: Run full test suite**

Run: `pnpm --dir agent_vm test`
Expected: All PASS

**Step 12: Commit**

```bash
git commit -m "refactor(agent_vm): config-driven vm-adapter with volumes, shadows, mounts from runtime config"
```

---

## Phase 5: Session Daemon & Orchestrator Wiring

### Task 12: Wire daemon to use new config chain

**Files:**
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts`

**Step 1: Update daemon's `start()` method**

1. Call `resolveRuntimeConfig(workDir)` (which now returns both `buildConfig` and `runtimeConfig`)
2. Call `resolveVolumeDirs()` with `runtimeConfig.volumes` + discovered monorepo volumes
3. Pass resolved volumes and full config to `createVmRuntime()`

**Step 2: Update orchestrator's `maybeBuildGuestAssets()`**

1. Load build config via `loadBuildConfig(workDir)`
2. Compute output dir per workspace hash
3. Build only if missing or `fullReset`

**Step 3: Add `--scratchpad` CLI flag**

Add to `run-agent-vm.ts`:
```typescript
scratchpad: flag({ long: 'scratchpad', description: 'Ephemeral workspace (MemoryProvider)' }),
```

Add `scratchpad: boolean` to `RunAgentVmOptions`. Thread through to daemon/vm-adapter.

**Step 4: Update `--full-reset` to wipe volumes**

In orchestrator, `fullReset` now also calls `wipeVolumeDirs()` before rebuilding.

**Step 5: Run full test suite**

Run: `pnpm --dir agent_vm check`
Expected: All PASS

**Step 6: Commit**

```bash
git commit -m "feat(agent_vm): wire daemon and orchestrator to new config chain with volumes and scratchpad"
```

---

## Phase 6: Init Script Pipeline & Shell

### Task 13: Init script execution at daemon start

**Files:**
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`

After VM boots and before accepting client connections:

1. If `runtimeConfig.initScripts.background` is set, run `vm.exec(script)` non-blocking
2. If `runtimeConfig.initScripts.foreground` is set, run `vm.exec(script)` and await completion

**Commit:**

```bash
git commit -m "feat(agent_vm): init script pipeline (background + foreground) at daemon start"
```

---

### Task 14: Shell history (Atuin import on first run)

**Files:**
- Create: `agent_vm/src/features/runtime-control/shell-setup.ts`

On first volume creation for `shellHistory` (detect via marker file in volume dir), if `shell.atuin.importOnFirstRun` is true:
1. Copy host `~/.config/atuin/` and `~/.local/share/atuin/` into the volume dir
2. Create marker file `.initialized`

**Commit:**

```bash
git commit -m "feat(agent_vm): atuin history import on first shell history volume creation"
```

---

## Phase 7: Templates & Init Script

### Task 15: Create new template files

**Files:**
- Create: `agent_vm/templates/.agent_vm/build.project.json`
- Create: `agent_vm/templates/.agent_vm/vm-runtime.repo.json`
- Create: `agent_vm/templates/.agent_vm/vm-runtime.local.json`
- Modify: `agent_vm/templates/.agent_vm/tcp-services.repo.json` (rename from tunnels, update schema)
- Modify: `agent_vm/templates/.agent_vm/tcp-services.local.json` (rename from tunnels, update schema)
- Update: `agent_vm/templates/.agent_vm/.gitignore`

Template files should be minimal with `$schema` reference and empty overrides.

**Commit:**

```bash
git commit -m "feat(agent_vm): create JSON config templates with schema references"
```

---

### Task 16: Rewrite init_repo_vm.sh (sidecar parity)

**Files:**
- Rewrite: `agent_vm/init_repo_vm.sh`

Match `init_repo_sidecar.sh` features:
- Modes: `--default`, `--repo-only`, `--local-only`, `--sync-docs`
- `--override` flag
- `--help` flag
- Copies template files (build.project.json, vm-runtime.repo/local.json, tcp-services.repo/local.json, policy-allowlist-extra.repo/local.txt)
- Syncs INSTRUCTIONS.md (always overwritten)
- Creates .gitignore
- Prints next-steps guidance
- Does NOT create files that already exist (unless `--override`)

**Commit:**

```bash
git commit -m "feat(agent_vm): rewrite init_repo_vm.sh with sidecar-parity features"
```

---

### Task 17: Create bootstrap.sh

**Files:**
- Create: `agent_vm/bootstrap.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    pnpm --dir "$SCRIPT_DIR" install
fi

if [ ! -d "$SCRIPT_DIR/dist" ]; then
    echo "Building agent_vm..."
    pnpm --dir "$SCRIPT_DIR" build
fi
```

Callable from `init_repo_vm.sh` and `run-agent-vm` (orchestrator checks dist/ exists before spawning daemon).

**Commit:**

```bash
git commit -m "feat(agent_vm): add bootstrap.sh for first-time setup"
```

---

## Phase 8: E2E Validation

### Task 18: Update INSTRUCTIONS.md

**Files:**
- Modify: `agent_vm/INSTRUCTIONS.md`

Document the new config surface, file layout, JSON schema references, and CLI flags.

**Commit:**

```bash
git commit -m "docs(agent_vm): update INSTRUCTIONS.md with new config surface"
```

---

### Task 19: Update CLAUDE.md

**Files:**
- Modify: `agent_vm/CLAUDE.md`

Update commands section, key patterns, and constraints to reflect JSON config model.

**Commit:**

```bash
git commit -m "docs(agent_vm): update CLAUDE.md for JSON config model"
```

---

### Task 20: Full verification

**Step 1: Run all checks**

```bash
pnpm --dir agent_vm check
```

Expected: lint + fmt + typecheck + test + e2e all PASS.

**Step 2: Manual smoke test**

```bash
# Initialize a test repo
cd /tmp && mkdir test-repo && cd test-repo && git init
agent_vm/init_repo_vm.sh --default

# Verify template files created
ls -la .agent_vm/

# Verify $schema references resolve
cat .agent_vm/build.project.json
cat .agent_vm/vm-runtime.repo.json

# Run agent VM (will build image on first run)
run-agent-vm --no-run
```

**Step 3: Final commit if needed**

```bash
git commit -m "chore(agent_vm): final verification pass"
```

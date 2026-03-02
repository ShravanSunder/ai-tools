# Agent VM C+ Consolidated Spec + Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate `agent_vm` into a strict config surface (2 JSON + firewall TXT), remove old TCP config files in a hard cutover, and implement C+ image architecture (OCI layered customization + global content-addressed Gondolin asset cache) with strong disk-efficiency and sidecar-parity behavior.

**Architecture:** Keep the TypeScript daemon control plane for session ownership and multi-terminal behavior, remove old tunnel assumptions, and rely on Gondolin `tcp.hosts` for host Docker services. Fold TCP mapping into VM runtime config, keep policy as TXT allowlist, and make image builds deterministic by digest/fingerprint with a global deduped cache.

**Tech Stack:** TypeScript (`cmd-ts`, `zod` v4, `vitest`), Gondolin (`@earendil-works/gondolin` pinned tarball), Docker/OrbStack on macOS, `execa`, JSON schema generation via Zod v4.

---

## Scope Lock

1. **Config contract**
   - Allowed user config files:
   - `.agent_vm/build.project.json`
   - `.agent_vm/vm-runtime.repo.json`
   - `.agent_vm/vm-runtime.local.json` (optional, gitignored)
   - `.agent_vm/policy-allowlist-extra.repo.txt`
   - `.agent_vm/policy-allowlist-extra.local.txt` (optional, gitignored)
   - Remove `tcp-services.repo.json` and `tcp-services.local.json` from active config surface.

2. **C+ image strategy**
   - C: OCI layering for customization.
   - +: Global content-addressed Gondolin asset cache.
   - Result: no per-workspace duplicate guest asset trees for identical build inputs.

3. **Runtime ownership**
   - Keep daemon model (session owner, lifecycle, idle shutdown, multi-client attach).
   - No host-side tunnel subsystem; use Gondolin `tcp.hosts`.

4. **Security constraints**
   - Deny-by-default HTTP egress policy via host hooks.
   - TCP target validation (strict mode + allowlist of upstream hosts).
   - Auth mounts remain readonly and no write-back.

5. **Platform scope**
   - macOS host only (as requested).
   - Docker/OrbStack runtime on host.

## Non-Goals

1. No backward compatibility layer for removed `tcp-services.*.json`.
2. No remote registry publishing workflow in this phase.
3. No daemon removal in this phase.

---

## C+ Design (Reference)

### Control/Data Flow

```text
agent_vm.sh
  -> agent-vm CLI (run/init/ctl)
      -> run-orchestrator
          -> session-daemon (owns VM + socket lifecycle)
              -> VM.create({ httpHooks, dns, tcp.hosts, vfs, env })
                  -> Gondolin guest
                      -> host Docker services via explicit tcp.hosts mappings
```

### Config and Image Layers

```text
Layer 1: Build Source
  build.project.json
    - base OCI image digest
    - optional local OCI overlay build recipe
    - runtime defaults (rootfsMode)

Layer 2: Runtime Source
  vm-runtime.repo/local.json
    - resources, mounts, shadows
    - tcp.services + strict target policy
    - init scripts, shell settings

Layer 3: Policy Source
  policy-allowlist-extra.{repo,local}.txt
    - merged with base allowlist
    - compiled to .agent_vm/.generated/policy-allowlist.compiled.txt

Layer 4: Artifact Cache (global)
  ~/.cache/agent-vm/images/by-fingerprint/<fingerprint>/
    manifest.json, rootfs.ext4, initramfs.cpio.lz4, vmlinuz-virt
```

### Why daemon remains

1. Multi-terminal attach and shared VM ownership.
2. Stable `ctl` socket for status/policy operations.
3. Idle timeout and graceful resource cleanup.
4. Explicit runtime recreation when policy/tcp changes require restart semantics.

---

## Parity Matrix (Target)

| Concern              | Sidecar intent          | Agent VM C+ target                             |
| -------------------- | ----------------------- | ---------------------------------------------- |
| Single entrypoint    | PATH script             | `agent_vm.sh` only                             |
| Host control plane   | `sidecar-ctl`           | `agent_vm.sh ctl` with daemon socket           |
| Service access       | Docker services on host | `tcp.hosts` only, strict targets               |
| Network policy       | Host-enforced allowlist | Host-enforced `createHttpHooks` policy         |
| Config tiers         | base/repo/local         | build + runtime JSON tiers, TXT policy tiers   |
| Dependency isolation | container volumes       | VM volumes + shadowing, no host conflicts      |
| Auth safety          | mounted credentials     | readonly host mounts, no copy-back             |
| Persistence          | named volumes           | host volume cache + `rootfsMode: cow`          |
| Disk efficiency      | image layers            | OCI layering + global content-addressed assets |

---

## Task 1: Define New Runtime TCP Schema (Failing Tests First)

**Files:**

- Modify: `agent_vm/src/core/models/vm-runtime-config.ts`
- Modify: `agent_vm/src/core/models/config.ts`
- Test: `agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts`
- Test: `agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`

**Step 1: Write failing tests for new `vmRuntime.tcp` shape**

```ts
it('parses tcp services embedded in vm-runtime config', () => {
	const parsed = parseVmRuntimeConfig({
		tcp: {
			strictMode: true,
			allowedTargetHosts: ['127.0.0.1', 'localhost'],
			services: {
				postgres: {
					guestHostname: 'pg.vm.host',
					guestPort: 5432,
					upstreamTarget: '127.0.0.1:15432',
					enabled: true,
				},
			},
		},
	});
	expect(parsed.tcp.services.postgres?.guestHostname).toBe('pg.vm.host');
});
```

**Step 2: Run test to verify it fails**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts`

Expected: FAIL on missing `tcp` field in schema/types.

**Step 3: Add `tcp` schema and types into `vm-runtime-config.ts`**

```ts
const tcpServiceEntrySchema = z.object({
	guestHostname: z.string().min(1),
	guestPort: z.number().int().min(1).max(65_535),
	upstreamTarget: z.string().min(1),
	enabled: z.boolean().default(true),
});

const tcpConfigSchema = z.object({
	strictMode: z.boolean().default(true),
	allowedTargetHosts: z.array(z.string().min(1)).default(['127.0.0.1', 'localhost']),
	services: z.record(z.string().min(1), tcpServiceEntrySchema).default({}),
});
```

**Step 4: Update `ResolvedRuntimeConfig` to use runtime-embedded TCP**

Remove top-level `tcpServiceMap` from `ResolvedRuntimeConfig` and use:

```ts
readonly runtimeConfig: VmRuntimeConfig; // includes runtimeConfig.tcp
```

**Step 5: Run tests to verify pass**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/core/models/vm-runtime-config.ts agent_vm/src/core/models/config.ts agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts agent_vm/src/features/runtime-control/config-resolver.unit.test.ts
git commit -m "feat: embed tcp service model into vm runtime schema"
```

---

## Task 2: Remove Standalone TCP Config Loader (Hard Cutover)

**Files:**

- Delete: `agent_vm/src/features/runtime-control/tcp-service-config.ts`
- Delete: `agent_vm/src/features/runtime-control/tcp-service-config.unit.test.ts`
- Modify: `agent_vm/src/features/runtime-control/config-resolver.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`

**Step 1: Write failing tests proving runtime now reads TCP only from runtime JSON**

```ts
it('uses tcp service definitions from vm runtime config only', () => {
	const resolved = resolveRuntimeConfig(workDir);
	expect(resolved.runtimeConfig.tcp.services.postgres?.upstreamTarget).toBe('127.0.0.1:25432');
});
```

**Step 2: Run tests and capture failure**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/config-resolver.unit.test.ts`

Expected: FAIL due to old `loadTcpServiceConfig` dependency.

**Step 3: Update resolver and daemon callsites**

- `config-resolver.ts`: stop loading standalone TCP files.
- `session-daemon.ts`: replace:
  - `buildTcpHostsRecord(runtimeConfig.tcpServiceMap)`
  - with helpers that consume `runtimeConfig.runtimeConfig.tcp`.

**Step 4: Add hard-fail on removed config file presence**

In resolver or dedicated guard:

```ts
const removedPaths = [
	path.join(workDir, '.agent_vm', 'tcp-services.repo.json'),
	path.join(workDir, '.agent_vm', 'tcp-services.local.json'),
];
if (removedPaths.some((removedPath) => fs.existsSync(removedPath))) {
	throw new Error(
		'Hard cutover: tcp-services.*.json is unsupported. Move tcp config into vm-runtime.*.json under tcp before running agent_vm.',
	);
}
```

**Step 5: Run relevant tests**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/config-resolver.unit.test.ts agent_vm/src/features/runtime-control/run-orchestrator.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/features/runtime-control/config-resolver.ts agent_vm/src/features/runtime-control/session-daemon.ts agent_vm/src/features/runtime-control/config-resolver.unit.test.ts
git rm agent_vm/src/features/runtime-control/tcp-service-config.ts agent_vm/src/features/runtime-control/tcp-service-config.unit.test.ts
git commit -m "refactor: remove standalone tcp config files and enforce runtime-only tcp config"
```

---

## Task 3: Update Init Scaffolding + Templates to 2 JSON + TXT Contract

**Files:**

- Modify: `agent_vm/src/features/repo-init/init-agent-vm.ts`
- Modify: `agent_vm/templates/.agent_vm/vm-runtime.repo.json`
- Modify: `agent_vm/templates/.agent_vm/build.project.json`
- Modify: `agent_vm/templates/.agent_vm/.gitignore`
- Delete: `agent_vm/templates/.agent_vm/tcp-services.repo.json`
- Test: `agent_vm/tests/init-agent-vm.integration.test.ts`

**Step 1: Write failing integration test**

Assert `init` creates:

- `build.project.json`
- `vm-runtime.repo.json`
- `policy-allowlist-extra.repo.txt`

And does **not** create:

- `tcp-services.repo.json`
- `tcp-services.local.json`

**Step 2: Run test to confirm failure**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/tests/init-agent-vm.integration.test.ts`

Expected: FAIL from old template expectations.

**Step 3: Update scaffold code/templates**

Add TCP defaults into runtime template:

```json
{
	"tcp": {
		"strictMode": true,
		"allowedTargetHosts": ["127.0.0.1", "localhost"],
		"services": {
			"postgres": {
				"guestHostname": "pg.vm.host",
				"guestPort": 5432,
				"upstreamTarget": "127.0.0.1:15432",
				"enabled": true
			}
		}
	}
}
```

**Step 4: Run test to verify pass**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/tests/init-agent-vm.integration.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/src/features/repo-init/init-agent-vm.ts agent_vm/templates/.agent_vm/vm-runtime.repo.json agent_vm/templates/.agent_vm/build.project.json agent_vm/templates/.agent_vm/.gitignore agent_vm/tests/init-agent-vm.integration.test.ts
git rm agent_vm/templates/.agent_vm/tcp-services.repo.json
git commit -m "feat: enforce consolidated config surface in init scaffolding"
```

---

## Task 4: Add Build Schema for C+ OCI Overlay Source

**Files:**

- Modify: `agent_vm/src/core/models/build-config.ts`
- Modify: `agent_vm/src/features/runtime-control/build-config-loader.ts`
- Test: `agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts`
- Test: `agent_vm/src/build/build-assets.unit.test.ts` (create if missing)

**Step 1: Write failing tests for overlay schema**

```ts
it('accepts local oci overlay recipe in build config', () => {
	const parsed = parseBuildConfigInput({
		ociOverlay: {
			baseImage: 'docker.io/library/debian:bookworm-slim',
			dockerfile: '.agent_vm/overlay.repo.dockerfile',
			contextDir: '.',
		},
	});
	expect(parsed.ociOverlay?.baseImage).toBeDefined();
});
```

**Step 2: Run test to verify failure**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts`

Expected: FAIL (unknown `ociOverlay`).

**Step 3: Add C+ schema fields**

Example:

```ts
const ociOverlaySchema = z.object({
	baseImage: z.string().min(1),
	dockerfile: z.string().min(1),
	contextDir: z.string().min(1).default('.'),
	target: z.string().min(1).optional(),
	buildArgs: z.record(z.string(), z.string()).default({}),
});
```

**Step 4: Validate macOS constraints**

- If `ociOverlay` is used, ensure Docker is available.
- Keep existing hard-fail for unsupported combinations.

**Step 5: Run tests**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/core/models/build-config.ts agent_vm/src/features/runtime-control/build-config-loader.ts agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts
git commit -m "feat: add c-plus oci overlay build config schema"
```

---

## Task 5: Implement OCI Overlay Builder (Docker Layer Reuse)

**Files:**

- Create: `agent_vm/src/build/oci-overlay-builder.ts`
- Modify: `agent_vm/src/build/build-assets.ts`
- Test: `agent_vm/src/build/oci-overlay-builder.unit.test.ts`
- Test: `agent_vm/src/build/build-assets.unit.test.ts`

**Step 1: Write failing unit tests**

1. Builds overlay image with deterministic local tag from fingerprint.
2. Resolves resulting image digest.
3. Injects digest into temporary build config `oci.image`.

**Step 2: Run tests to verify fail**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/build/oci-overlay-builder.unit.test.ts`

Expected: FAIL (module missing).

**Step 3: Implement minimal builder**

```ts
export async function buildOverlayImageAndResolveDigest(
	input: OverlayBuildInput,
): Promise<{ imageRef: string; digest: string }> {
	// docker buildx build --load -f <dockerfile> <context>
	// docker inspect to resolve RepoDigests
	// return imageRef as repo@sha256:...
}
```

**Step 4: Wire into `buildGuestAssets`**

- If `buildConfig.ociOverlay` exists:
  - build/resolve overlay digest
  - synthesize effective build config with `oci.image = resolvedDigest`.

**Step 5: Run tests**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/build/oci-overlay-builder.unit.test.ts agent_vm/src/build/build-assets.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/build/oci-overlay-builder.ts agent_vm/src/build/build-assets.ts agent_vm/src/build/oci-overlay-builder.unit.test.ts agent_vm/src/build/build-assets.unit.test.ts
git commit -m "feat: add oci overlay build pipeline for c-plus layering"
```

---

## Task 6: Implement Global Content-Addressed Asset Cache

**Files:**

- Modify: `agent_vm/src/build/build-assets.ts`
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts`
- Create: `agent_vm/src/build/image-cache.ts`
- Test: `agent_vm/src/build/image-cache.unit.test.ts`
- Test: `agent_vm/src/features/runtime-control/run-orchestrator.unit.test.ts`

**Step 1: Write failing tests**

1. Two workspaces with same fingerprint resolve same `imagePath`.
2. Workspace pointer updates when fingerprint changes.
3. Build lock prevents duplicate concurrent build of same fingerprint.

**Step 2: Run tests (fail)**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/features/runtime-control/run-orchestrator.unit.test.ts`

Expected: FAIL due to workspace-hash image path assumptions.

**Step 3: Add cache layout**

```text
~/.cache/agent-vm/images/
  by-fingerprint/<fp>/
  workspaces/<dir-hash>.json   // { fingerprint, imagePath, updatedAt }
```

**Step 4: Update builder/orchestrator**

- `resolveWorkspaceImageDir` replaced by cache resolver:
  - `resolveFingerprintImageDir(fp)`
  - `writeWorkspaceImageRef(dirHash, fp, path)`
- `run-orchestrator` consumes returned global path.

**Step 5: Run tests**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/build/image-cache.unit.test.ts agent_vm/src/features/runtime-control/run-orchestrator.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/build/build-assets.ts agent_vm/src/build/image-cache.ts agent_vm/src/features/runtime-control/run-orchestrator.ts agent_vm/src/build/image-cache.unit.test.ts agent_vm/src/features/runtime-control/run-orchestrator.unit.test.ts
git commit -m "feat: add global content-addressed image cache and workspace references"
```

---

## Task 7: Update Daemon Runtime Wiring for Embedded TCP + Restart Semantics

**Files:**

- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/core/infrastructure/vm-adapter.ts`
- Test: `agent_vm/src/features/runtime-control/runtime-control-daemon.integration.test.ts`
- Test: `agent_vm/src/core/infrastructure/vm-adapter.unit.test.ts`

**Step 1: Write failing tests**

1. `createVmRuntime` receives TCP hosts from `runtimeConfig.tcp`.
2. `policy.reload` still restarts VM and logs restart message.
3. Daemon status emits service list from embedded TCP runtime config.

**Step 2: Run tests (fail)**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/core/infrastructure/vm-adapter.unit.test.ts agent_vm/tests/runtime-control-daemon.integration.test.ts`

Expected: FAIL from removed `tcpServiceMap`.

**Step 3: Implement wiring changes**

- Keep `dns: synthetic/per-host` only when enabled TCP mappings exist.
- Keep explicit restart behavior for policy changes.

**Step 4: Run tests**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/src/core/infrastructure/vm-adapter.unit.test.ts agent_vm/tests/runtime-control-daemon.integration.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/src/features/runtime-control/session-daemon.ts agent_vm/src/core/infrastructure/vm-adapter.ts agent_vm/src/core/infrastructure/vm-adapter.unit.test.ts agent_vm/tests/runtime-control-daemon.integration.test.ts
git commit -m "refactor: wire embedded tcp config through daemon and vm adapter"
```

---

## Task 8: Regenerate JSON Schemas + Remove TCP Schema Artifact

**Files:**

- Modify: `agent_vm/src/build/generate-schemas.ts`
- Delete: `agent_vm/schemas/tcp-services.schema.json`
- Update generated: `agent_vm/schemas/vm-runtime.schema.json`
- Test: `agent_vm/tests/init-agent-vm.integration.test.ts`

**Step 1: Write failing test/assertion**

Ensure init templates reference only:

- `build-config.schema.json`
- `vm-runtime.schema.json`

**Step 2: Run test and confirm failure**

Run:
`pnpm --dir agent_vm exec vitest run agent_vm/tests/init-agent-vm.integration.test.ts`

Expected: FAIL if old `$schema` references remain.

**Step 3: Update schema generator**

Use Zod v4 JSON schema emission from current runtime/build input schemas only.

**Step 4: Generate schemas + rerun tests**

Run:
`pnpm --dir agent_vm build`
`pnpm --dir agent_vm exec vitest run agent_vm/tests/init-agent-vm.integration.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/src/build/generate-schemas.ts agent_vm/schemas/vm-runtime.schema.json agent_vm/tests/init-agent-vm.integration.test.ts
git rm agent_vm/schemas/tcp-services.schema.json
git commit -m "chore: regenerate schemas for consolidated config surface"
```

---

## Task 9: Migrate and Harden E2E Docker Connectivity Test

**Files:**

- Modify: `agent_vm/tests/e2e/tcp-hosts-docker.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/smoke.e2e.test.ts` (if assumptions changed)

**Step 1: Write failing test update**

Replace writer helper:

```ts
function writeVmRuntimeConfig(workDir: string, postgresPort: number, redisPort: number): void {
	fs.writeFileSync(
		path.join(workDir, '.agent_vm', 'vm-runtime.local.json'),
		JSON.stringify({
			tcp: {
				strictMode: true,
				services: {
					postgres: {
						guestHostname: 'pg.vm.host',
						guestPort: 5432,
						upstreamTarget: `127.0.0.1:${postgresPort}`,
						enabled: true,
					},
					redis: {
						guestHostname: 'redis.vm.host',
						guestPort: 6379,
						upstreamTarget: `127.0.0.1:${redisPort}`,
						enabled: true,
					},
				},
			},
		}),
	);
}
```

**Step 2: Run e2e and verify failure before code path update**

Run:
`pnpm --dir agent_vm test:e2e -- tests/e2e/tcp-hosts-docker.e2e.test.ts`

Expected: FAIL until all runtime-tcp callsites are fully cut over.

**Step 3: Finalize test cutover**

Remove all references to `tcp-services.local.json`.

**Step 4: Run e2e again**

Run:
`pnpm --dir agent_vm test:e2e -- tests/e2e/tcp-hosts-docker.e2e.test.ts`

Expected: PASS when Docker + Gondolin runtime available.

**Step 5: Commit**

```bash
git add agent_vm/tests/e2e/tcp-hosts-docker.e2e.test.ts agent_vm/tests/e2e/smoke.e2e.test.ts
git commit -m "test: migrate tcp docker e2e to runtime-embedded tcp config"
```

---

## Task 10: Add C+ Cache Reuse E2E Test

**Files:**

- Create: `agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts`
- Modify: `agent_vm/tests/setup.ts` (helpers if needed)

**Step 1: Write failing e2e**

Test scenario:

1. Create workdir A + B with identical build/runtime config.
2. Run `agent-vm run --no-run` in A then B.
3. Assert both report same image path or same fingerprint reference.

**Step 2: Run and verify fail**

Run:
`pnpm --dir agent_vm test:e2e -- tests/e2e/image-cache-dedupe.e2e.test.ts`

Expected: FAIL with old workspace-hash cache.

**Step 3: Implement minimal assertions**

Verify:

- `~/.cache/agent-vm/images/by-fingerprint/<fp>` exists.
- both workspace refs point to same `<fp>`.

**Step 4: Run e2e to pass**

Run:
`pnpm --dir agent_vm test:e2e -- tests/e2e/image-cache-dedupe.e2e.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts agent_vm/tests/setup.ts
git commit -m "test: add e2e coverage for global image cache dedupe"
```

---

## Task 11: CLI + Docs Contract Update (No Legacy Mentions)

**Files:**

- Modify: `agent_vm/README.md`
- Modify: `agent_vm/INSTRUCTIONS.md`
- Modify: `agent_vm/CLAUDE.md`

**Step 1: Write failing documentation assertions (manual checklist)**

Checklist:

1. No mention of `tcp-services.*.json`.
2. C+ image flow documented.
3. Daemon rationale clearly documented (not tunnel-based).
4. Config contract lists only 2 JSON + TXT allowlist.

**Step 2: Update docs**

Include ASCII diagram:

```text
build.project.json -> effective OCI image digest
                  -> global fingerprint -> guest asset cache
vm-runtime.*.json -> tcp/services + resources + mounts
policy TXT        -> host allowlist hooks
```

**Step 3: Run docs lint/readability checks if present**

Run:
`pnpm --dir agent_vm lint`

Expected: PASS.

**Step 4: Commit**

```bash
git add agent_vm/README.md agent_vm/INSTRUCTIONS.md agent_vm/CLAUDE.md
git commit -m "docs: publish consolidated c-plus config and cache architecture"
```

---

## Task 12: Full Verification Gate (Definition of Done)

**Files:**

- No code changes expected unless failures found.

**Step 1: Run full quality gate**

Run:
`pnpm --dir agent_vm fmt`
`pnpm --dir agent_vm lint`
`pnpm --dir agent_vm typecheck`
`pnpm --dir agent_vm test`

Expected: all PASS.

**Step 2: Run e2e suite**

Run:
`pnpm --dir agent_vm test:e2e`

Expected:

- PASS for smoke + cache dedupe + tcp docker tests.
- If Docker unavailable, tests must fail loudly with explicit requirement messages (no silent skip for required C+ paths).

**Step 3: Manual tmp-dir validation (required)**

Run:

```bash
tmp_repo_a="$(mktemp -d /tmp/agent-vm-a.XXXXXX)"
tmp_repo_b="$(mktemp -d /tmp/agent-vm-b.XXXXXX)"
agent_vm.sh init --work-dir "$tmp_repo_a"
agent_vm.sh init --work-dir "$tmp_repo_b"
agent_vm.sh run --work-dir "$tmp_repo_a" --no-run
agent_vm.sh run --work-dir "$tmp_repo_b" --no-run
agent_vm.sh ctl status --work-dir "$tmp_repo_a"
agent_vm.sh ctl status --work-dir "$tmp_repo_b"
```

Validate:

1. Same image fingerprint/path reused.
2. Daemon status healthy in both dirs.
3. PG/Redis docker e2e path verified.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: ship c-plus consolidated config and image cache architecture"
```

---

## Risks + Mitigations

1. **Risk:** Docker overlay build failures on host environments.
   - **Mitigation:** explicit preflight checks + actionable errors.

2. **Risk:** Fingerprint misses non-config inputs.
   - **Mitigation:** fingerprint includes merged build config + Gondolin version + schema version + overlay digest.

3. **Risk:** Cache growth over time.
   - **Mitigation:** add ref-aware GC in `cleanup`, keep atime/mtime pruning policy.

4. **Risk:** Users keep old removed TCP files.
   - **Mitigation:** hard-fail with explicit hard-cutover startup error.

---

## Acceptance Criteria

1. Only 2 JSON config surfaces remain in active use (`build.project.json`, `vm-runtime.*.json`), plus policy TXT allowlists.
2. Standalone `tcp-services.*.json` is removed and rejected if present.
3. Host Docker PG/Redis works via runtime-embedded TCP mappings.
4. C+ image architecture reuses OCI layers and dedupes Gondolin assets globally by fingerprint.
5. Full lint/typecheck/test/e2e passes.

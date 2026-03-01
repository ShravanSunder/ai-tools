# Agent VM Config Surface & Per-Project Image Building

## Problem

agent_vm lacks the configuration surface needed to be a real sidecar replacement. The current state:

- **Build**: Single hardcoded `build.debian.json` producing one global image. No per-project images. No package customization.
- **Runtime**: Shadow paths, mount structure, env vars, resource limits — all hardcoded in `vm-adapter.ts`. Only `IDLE_TIMEOUT_MINUTES` is configurable.
- **Persistence**: `ShadowProvider(tmpfs)` for node_modules/.venv means everything is lost on shutdown. No equivalent to sidecar's Docker named volumes.

Every capability in the sidecar config surface needs a Gondolin equivalent.

## Design Decisions

1. **All config is JSON + Zod + JSON Schema**. No `.conf` files. Firewall allowlists stay `.txt` (one domain per line).
2. **Build config is two-tier** (base + project). Runtime config is three-tier (base < repo < local precedence). Deep merge.
3. **Per-project images** cached by workspace hash + build fingerprint. Built on first run, fingerprint change, or `--full-reset`.
4. **Persistent volumes** use host-backed opaque directories (never executed on macOS), mounted via `RealFSProvider` at specific guest paths. This replaces Docker named volumes.
5. **Scratchpad mode** is a CLI flag (`--scratchpad`) that swaps the workspace to `MemoryProvider` for ephemeral experimentation.
6. **Host Docker services are accessed only through explicit `tcp.hosts` mappings**. No generic TCP forwarding subsystem.
7. **`VM.create` must always use explicit `sandbox.imagePath`** for project image determinism.
8. **macOS + OCI builds do not use `postBuild.commands`**. Package customization is done via custom OCI images.

## Critical Constraints & Holes To Close

These are non-negotiable constraints that the implementation must encode in code and tests:

1. **Custom image wiring hole**: `run-agent-vm --full-reset` can build assets, but runtime must pass `sandbox.imagePath` into `VM.create` or the build is not guaranteed to be used.
2. **macOS OCI build hole**: `oci + postBuild.commands` is currently unsupported on macOS in Gondolin. The design must not depend on this path.
3. **Build invalidation hole**: caching by workspace hash alone is insufficient. Build artifacts must be invalidated when merged build config changes (or when Gondolin package/version pin changes).
4. **Persistence misunderstanding risk**: checkpoints persist rootfs overlay only, not VFS mounts. Workspace-mounted `.venv`/`node_modules` persistence must come from host-backed volume mounts, not checkpoints.
5. **Security hole**: host service access must remain narrow. Strict target host allowlists in `tcp-services` remain enabled by default; broad or implicit host TCP access is forbidden.
6. **Path resolution hole**: script paths (`init.rootfsInitExtra`, runtime init scripts) must be resolved relative to their owning config file and validated to avoid path traversal mistakes.
7. **HOME path hole**: runtime env defaults using `/home/agent` require guaranteed directory creation in guest image/init; otherwise use a guaranteed existing home path.
8. **Interpolation ambiguity hole**: config interpolation must distinguish host paths from guest paths (`${HOST_HOME}` vs guest `HOME`) to avoid mounting wrong directories.

## Config File Layout

```
agent_vm/config/                          # Base tier (shipped with agent_vm)
├── build.base.json                       # Build-time: OCI base, runtimeDefaults, optional Linux-only postBuild
├── vm-runtime.base.json                  # Runtime: mounts, volumes, resources, env, init
├── policy-allowlist.base.txt             # Firewall: base domain allowlist

agent_vm/schemas/                         # Generated JSON Schemas for editor autocomplete
├── build-config.schema.json
├── vm-runtime.schema.json
├── tcp-services.schema.json

<workDir>/.agent_vm/                      # Project tier
├── build.project.json                    # Build overrides (two-tier: base + project)
├── vm-runtime.repo.json                  # Runtime overrides (three-tier: base < repo < local)
├── vm-runtime.local.json                 # Runtime local overrides (gitignored)
├── tcp-services.repo.json                # TCP host mappings (existing, unchanged)
├── tcp-services.local.json               # TCP local overrides (existing, gitignored)
├── policy-allowlist-extra.repo.txt       # Additive firewall domains (existing)
├── policy-allowlist-extra.local.txt      # Additive firewall local (existing, gitignored)
├── .generated/                           # Runtime state (gitignored)
│   ├── policy-allowlist.compiled.txt
│   └── policy-toggle.entries.txt
```

### Split Rationale

- **`build.*.json`**: Things that affect the rootfs image. Changed rarely. Change triggers image rebuild.
- **`vm-runtime.*.json`**: Things that affect the running VM session. Changed more often. Triggers `--reload`.
- **`tcp-services.*.json`**: TCP host mappings. Already separate and well-designed. Stays.
- **`policy-allowlist*.txt`**: Domain lists, one per line. Additive merge across tiers. Simplest format wins.

### Merge Semantics

| Config type | Tiers | Merge strategy |
|------------|-------|----------------|
| `build.*.json` | base + project | Deep merge. Project fields override base at each nesting level. `postBuild.commands` is array-concatenated (base first, then project). |
| `vm-runtime.*.json` | base < repo < local | Deep merge. Last writer wins at each field. Arrays use last-writer-wins. |
| `tcp-services.*.json` | defaults + repo + local | Existing behavior: deep merge at service-entry level. |
| `policy-allowlist*.txt` | base + extra.repo + extra.local + toggles | Additive: all files concatenated, deduplicated. |

## Build Config Schema

```jsonc
// build.base.json — shipped defaults
{
  "$schema": "../schemas/build-config.schema.json",
  "arch": "aarch64",
  "distro": "alpine",
  "oci": {
    "image": "docker.io/library/debian:bookworm-slim",
    "pullPolicy": "if-not-present"
  },
  "env": {
    "LANG": "C.UTF-8"
  },
  "runtimeDefaults": {
    "rootfsMode": "memory"
  }
}
```

```jsonc
// .agent_vm/build.project.json — project overrides
{
  "$schema": "../../agent_vm/schemas/build-config.schema.json",
  "oci": {
    "image": "ghcr.io/your-org/agent-vm-ubuntu:24.04-tools-v1"
  },
  "init": {
    "rootfsInitExtra": "./init/rootfs-extra.sh"
  }
}
```

### Build Config Fields

| Field | Base default | Override | Notes |
|-------|-------------|---------|-------|
| `arch` | `"aarch64"` | Replace | Target architecture |
| `distro` | `"alpine"` | Replace | Only `"alpine"` currently supported by Gondolin |
| `oci.image` | `"debian:bookworm-slim"` | Replace | OCI rootfs base. When set, Alpine `rootfsPackages` is ignored — OCI filesystem IS the rootfs |
| `oci.pullPolicy` | `"if-not-present"` | Replace | `"if-not-present"` / `"always"` / `"never"` |
| `oci.runtime` | auto-detect | Replace | `"docker"` or `"podman"` |
| `postBuild.commands` | `[]` | **Concatenate** (base + project) | Allowed in schema, but **must not be required for macOS + OCI**. Use custom OCI image layering instead. |
| `env` | `{"LANG": "C.UTF-8"}` | Deep merge | Baked into guest init, exported before sandboxd starts |
| `init.rootfsInitExtra` | null | Replace | Path to shell script appended to rootfs init before sandboxd |
| `rootfs.sizeMb` | auto | Replace | Override rootfs ext4 image size |
| `runtimeDefaults.rootfsMode` | `"memory"` | Replace | Default rootfs mode baked into manifest |

### macOS + OCI Package Customization Strategy

Because `oci + postBuild.commands` is not a valid macOS path for Gondolin builds, package customization follows this strategy:

1. Build and publish a custom OCI image (`debian/ubuntu` + apt/pip/npm tooling) outside Gondolin image assembly.
2. Set `build.project.json -> oci.image` to that image tag/digest.
3. Keep Gondolin `build` focused on kernel/initramfs + OCI filesystem export.

`postBuild.commands` remains optional for Linux-native build environments, but not a required part of the default macOS workflow.

### Image Selection & Build Invalidation

`agent_vm` runtime must be deterministic:

1. `run-agent-vm` resolves merged build config.
2. A build fingerprint is computed from:
   - merged build config JSON
   - Gondolin package/version pin
   - agent_vm build-schema version
3. If fingerprint differs from cached image metadata, rebuild automatically.
4. `VM.create` always sets `sandbox.imagePath` to the resolved per-workspace image dir.

This prevents stale images when config changes without forcing manual `--full-reset`.

### Per-Project Image Caching

Images cached at `~/.cache/agent-vm/images/{workspace-hash}/`. Contains:
- `vmlinuz-virt` (kernel)
- `initramfs.cpio.lz4` (initramfs)
- `rootfs.ext4` (rootfs image)
- `manifest.json` (checksums, build config, OCI digest, buildId)

Build triggered:
- On first run if no image exists
- When merged build fingerprint changes
- On `--full-reset`
- NOT on `--reload` (reuses existing image)

## Runtime Config Schema

```jsonc
// vm-runtime.base.json
{
  "$schema": "../schemas/vm-runtime.schema.json",

  // VM resource limits
  "rootfsMode": "memory",
  "memory": 2048,
  "cpus": 2,
  "idleTimeoutMinutes": 10,

  // Environment variables injected into VM
  "env": {
    "VIRTUAL_ENV": "${WORKSPACE}/.venv",
    "PNPM_STORE_DIR": "/home/agent/.local/share/pnpm",
    "HOME": "/home/agent"
  },

  // Persistent VM-only volumes (host-backed opaque dirs)
  "volumes": {
    "venv":             { "guestPath": "${WORKSPACE}/.venv" },
    "nodeModulesRoot":  { "guestPath": "${WORKSPACE}/node_modules" },
    "pnpmStore":        { "guestPath": "/home/agent/.local/share/pnpm" },
    "npmCache":         { "guestPath": "/home/agent/.cache" },
    "uvCache":          { "guestPath": "/home/agent/.local/share/uv" },
    "shellHistory":     { "guestPath": "/commandhistory" }
  },

  // Paths hidden from guest (within workspace ShadowProvider)
  "shadows": {
    "deny": [".agent_vm", ".git", "dist", ".next", "__pycache__"],
    "tmpfs": []
  },

  // Read-only mounts from host
  "readonlyMounts": {
    ".git": "${WORKSPACE}/.git",
    ".aws": "${HOST_HOME}/.aws"
  },

  // Additional read-write host mounts (sidecar EXTRA_MOUNTS equivalent)
  "extraMounts": {},

  // Auto-discover monorepo packages and create volume mounts for their node_modules
  "monorepoDiscovery": true,

  // Init scripts run at daemon start
  "initScripts": {
    "background": null,
    "foreground": null
  },

  // Shell customization
  "shell": {
    "zshrcExtra": null,
    "atuin": {
      "importOnFirstRun": true
    }
  },

  // Browser/Playwright host access
  "playwrightExtraHosts": []
}
```

### Runtime Config Fields

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `rootfsMode` | `"memory"` / `"cow"` / `"readonly"` | `"memory"` | Controls rootfs write behavior. `memory`: ephemeral writes. `cow`: persistent qcow2 overlay (checkpointable, but excludes VFS mounts). `readonly`: no writes. |
| `memory` | number (MB) | `2048` | VM memory allocation |
| `cpus` | number | `2` | VM CPU count |
| `idleTimeoutMinutes` | number | `10` | Daemon idle shutdown timer (no clients attached) |
| `env` | `Record<string, string>` | See schema | Environment variables. Supports `${WORKSPACE}` and `${HOST_HOME}` interpolation at config-resolution time. Guest `HOME` is a runtime env value, not a host-path token. |
| `volumes` | `Record<string, {guestPath}>` | See schema | Persistent VM-only volumes. Each creates a host-backed dir at `~/.cache/agent-vm/volumes/{workspace-hash}/{volume-name}/` mounted via `RealFSProvider` at `guestPath`. |
| `shadows.deny` | `string[]` | `[".agent_vm", ".git", ...]` | Workspace paths hidden via `ShadowProvider(deny)`. Guest gets EACCES. |
| `shadows.tmpfs` | `string[]` | `[]` | Workspace paths replaced with empty tmpfs. Guest can write but content is ephemeral. |
| `readonlyMounts` | `Record<string, string>` | `.git`, `.aws` | Host paths mounted read-only via `ReadonlyProvider(RealFSProvider(...))`. |
| `extraMounts` | `Record<string, string>` | `{}` | Additional host paths mounted read-write via `RealFSProvider`. |
| `monorepoDiscovery` | boolean | `true` | Auto-discover `pnpm-workspace.yaml` and `package.json` workspaces, create volume mounts for each package's `node_modules`. |
| `initScripts.background` | string / null | `null` | Path to script executed via `vm.exec()` at daemon start, async (non-blocking). |
| `initScripts.foreground` | string / null | `null` | Path to script executed via `vm.exec()` before agent command, blocking. |
| `shell.zshrcExtra` | string / null | `null` | Path to extra zshrc content. Injected via runtime mount (default) or Linux-native postBuild flows. |
| `shell.atuin.importOnFirstRun` | boolean | `true` | Import host Atuin shell history into the VM's history volume on first creation. |
| `playwrightExtraHosts` | `string[]` | `[]` | Additional hosts accessible from Playwright/browser in the VM. |

## Mount & Persistence Matrix

| Path | Sidecar mechanism | Gondolin VFS provider | Access | Persistence | Host visibility |
|------|------------------|----------------------|--------|-------------|-----------------|
| Workspace (`$WORK_DIR`) | `docker -v $WORK_DIR:$WORK_DIR:delegated` | `ShadowProvider(RealFSProvider(workDir))` with deny list from `shadows.deny` | rw | Host filesystem (live) | Shared bidirectionally |
| Workspace (scratchpad) | N/A | `MemoryProvider()` replaces workspace `RealFSProvider` | rw | Ephemeral (in-memory) | NOT shared |
| `.git/` | `docker -v .git:.git:ro` | `ReadonlyProvider(RealFSProvider($WORK_DIR/.git))` at `$WORK_DIR/.git` | ro | Host filesystem | Read-only from host |
| `.agent_vm/` | `--mount type=tmpfs,destination=.agent_sidecar` | Part of workspace `ShadowProvider` deny list via `createShadowPathPredicate` | hidden | None | Hidden from guest (EACCES) |
| `.venv/` | Docker named volume `agent-sidecar-venv-{hash}` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/venv/)` at `$WORK_DIR/.venv` | rw | Host-backed opaque dir | NOT shared (host .venv untouched) |
| `node_modules/` (root) | Docker named volume `agent-sidecar-nm-{hash}-root` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/nm-root/)` at `$WORK_DIR/node_modules` | rw | Host-backed opaque dir | NOT shared |
| `node_modules/` (monorepo) | Docker named volumes per `nm-{hash}-{path-hash}` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/nm-{path-hash}/)` per discovered package | rw | Host-backed opaque dir | NOT shared |
| pnpm store | Docker named volume at `/home/node/.local/share/pnpm` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/pnpm-store/)` at `/home/agent/.local/share/pnpm` | rw | Host-backed opaque dir | NOT shared |
| npm/pnpm cache | Docker named volume at `/home/node/.cache` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/cache/)` at `/home/agent/.cache` | rw | Host-backed opaque dir | NOT shared |
| uv cache | Docker named volume at `/home/node/.local/share/uv` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/uv-cache/)` at `/home/agent/.local/share/uv` | rw | Host-backed opaque dir | NOT shared |
| Shell history | Docker named volume at `/commandhistory` | `RealFSProvider(~/.cache/agent-vm/volumes/{ws-hash}/shell-history/)` at `/commandhistory` | rw | Host-backed opaque dir. Atuin import on first creation. | Isolated after import |
| Auth dirs | `docker -v` bind mounts (both canonical + real paths) | Existing `AuthSyncManager` copy-in/copy-back at `/home/agent/.auth/` | rw | Auth sync module | Copy-in/copy-back |
| `.aws` | `docker -v $HOME/.aws:ro` | `ReadonlyProvider(RealFSProvider($HOME/.aws))` at `/home/agent/.aws` | ro | Host filesystem | Read-only from host |
| `dist/`, `.next/`, `__pycache__` | Not shadowed in sidecar | Part of workspace `ShadowProvider` deny list | hidden | None | Hidden from guest (EACCES) |

**VFS mount resolution**: Gondolin routes file operations to the provider with the longest matching mount prefix. `$WORK_DIR/node_modules/foo` routes to the nm-root volume provider, not the workspace provider.

**Checkpoint behavior**: Gondolin snapshots capture rootfs overlay only. VFS mounts (volumes, workspace, readonly mounts) are excluded. Volumes persist because they're host filesystem directories.

## Host Service Access Model (Security-Critical)

1. Non-HTTP host services use only Gondolin `tcp.hosts` mappings.
2. `tcp-services` strict mode remains enabled by default.
3. Allowed upstream target hosts default to loopback-only (`127.0.0.1`, `localhost`).
4. No generic host TCP bridge/tunnel process is introduced.
5. Service mapping changes require daemon runtime recreation and are validated before VM start.

## CLI Surface

| Flag | Image | VM Session | Volumes | Use case |
|------|-------|-----------|---------|----------|
| (no flag) | Reuse (build if missing) | Reuse existing | Reuse | Day-to-day re-entry |
| `--reload` | Reuse | Recreate | Survive | Pick up config changes |
| `--full-reset` | Rebuild | Recreate | Wiped | Update packages, fresh start |
| `--scratchpad` | Reuse | Create with MemoryProvider workspace | Survive | Ephemeral experimentation |

## Bootstrap (`bootstrap.sh`)

Dedicated script callable by both `init_repo_vm.sh` and `run-agent-vm`:
1. Check `node_modules/` exists → `pnpm install` if missing
2. Check `dist/` exists → `pnpm build` if missing
3. Does NOT build guest images (deferred to first `run-agent-vm` invocation)

## Init Script Pipeline

On daemon start, after VM boots:

```
1. rootfsInitExtra (build-time, baked into image init script before sandboxd)
     ↓
2. initScripts.background (vm.exec, async, non-blocking)
     ↓
3. initScripts.foreground (vm.exec, blocking)
     ↓
4. Agent command runs (attach)
```

## `init_repo_vm.sh`

Rewritten to match `init_repo_sidecar.sh` (264 lines) features:
- Modes: `--default`, `--repo-only`, `--local-only`, `--sync-docs`
- `--override` flag for force-overwrite
- Creates template files for: `build.project.json`, `vm-runtime.repo.json`, `vm-runtime.local.json`, `tcp-services.repo.json`, `tcp-services.local.json`, `policy-allowlist-extra.repo.txt`, `policy-allowlist-extra.local.txt`
- Syncs INSTRUCTIONS.md (always overwritten)
- Creates `.gitignore` (ignores `*.local.*`, `.generated/`)
- Prints next-steps guidance

## JSON Schema Generation

Build step generates JSON Schema files from Zod schemas:
- `schemas/build-config.schema.json` (from build config Zod schema)
- `schemas/vm-runtime.schema.json` (from runtime config Zod schema)
- `schemas/tcp-services.schema.json` (from existing tcp-services Zod schema)

Referenced via `$schema` in config JSON files. Editors get autocomplete and inline validation.

## Monorepo Node Modules Discovery

Matches sidecar's discovery logic:
1. Parse `pnpm-workspace.yaml` for workspace glob patterns
2. Parse `package.json` `workspaces` field (npm/yarn monorepos)
3. Expand globs, find `package.json` in each match
4. Create a `RealFSProvider` volume mount for each discovered package's `node_modules/`
5. Volume backing dirs: `~/.cache/agent-vm/volumes/{ws-hash}/nm-{path-hash}/`

Discovery runs at daemon startup when `monorepoDiscovery: true`.

## What Gets Deleted

- `vm.base.conf`, `vm.repo.conf`, `vm.local.conf` — replaced by `vm-runtime.*.json`
- `config-resolver.ts` conf parser — replaced by JSON loading + Zod validation
- `templates/.agent_vm/tunnels.repo.json`, `tunnels.local.json` — stale, already replaced by tcp-services
- Hardcoded shadow paths in `vm-adapter.ts` — driven by `vm-runtime.*.json` config
- Hardcoded env vars in `vm-adapter.ts` — driven by config

## Implementation Tasks (Hole-Closing Checklist)

1. Add Zod v4 schemas + types for:
   - `build.*.json`
   - `vm-runtime.*.json`
   - generated schema outputs
2. Replace `.conf` runtime loader with JSON loader + merge + schema validation.
3. Implement deterministic build fingerprinting and cached-image metadata comparison.
4. Wire resolved image dir into `VM.create({ sandbox: { imagePath } })`.
5. Implement runtime-config-driven VFS mount graph:
   - workspace shadow provider chain
   - readonly mounts
   - host-backed opaque volume mounts
   - extra mounts
6. Keep `tcp-services` as source of truth for host Docker service access; preserve strict mode defaults.
7. Enforce path resolution rules for script/file fields relative to owning config file.
8. Implement interpolation tokens with explicit domains:
   - `${WORKSPACE}` (host workspace path)
   - `${HOST_HOME}` (host user home path)
   - no implicit reuse of guest env vars for host mount resolution
9. Update `init_repo_vm.sh` templates to JSON config model.
10. Update operator docs/INSTRUCTIONS to match actual config surface and migration.

## Verification Matrix (Required)

### Unit

1. Config merge precedence and schema validation failures:
   - base < repo < local semantics
   - invalid JSON/schema errors include file path context
2. Build fingerprint changes trigger rebuild; unchanged config reuses image.
3. VFS mount planner:
   - shadows, readonly, volume mounts, extra mounts
   - longest-prefix routing expectations
4. Script path resolution:
   - relative path resolution from config location
   - rejection of invalid traversal/path escapes

### Integration

1. Daemon startup uses resolved image path (assert vm boot marker from expected image).
2. Config reload recreates VM runtime with updated policy/tcp settings.
3. Strict TCP target validation rejects non-allowlisted upstream hosts.
4. Volume persistence across daemon restart for:
   - `.venv`
   - `node_modules`
   - pnpm/uv/cache/history directories

### E2E (Automated)

1. Tmp workspace provisioning in OS tmp dir.
2. Start Docker postgres + redis containers on host loopback with ephemeral ports.
3. Generate `.agent_vm/tcp-services.local.json` mapping to discovered host ports.
4. Execute `run-agent-vm --run "<check-command>"` and assert:
   - `nc` connectivity to `pg.vm.host:5432` and `redis.vm.host:6379`
   - optional protocol checks (`psql`, `redis-cli`) when tools exist in guest image
5. Stop daemon and clean tmp workspace + test containers.

### Full Validation Gate (before completion)

1. `pnpm --dir agent_vm lint`
2. `pnpm --dir agent_vm fmt:check`
3. `pnpm --dir agent_vm typecheck`
4. `pnpm --dir agent_vm test`
5. `pnpm --dir agent_vm test:e2e`

## Open Decisions (Must Resolve Before Build)

1. **`--full-reset` volume semantics**: current table says volumes are wiped. Confirm if that is intentional, or whether `--full-reset` should rebuild image/runtime while preserving volumes by default.
2. **Default `rootfsMode`**: current runtime default is `memory` for safety/ephemerality. Confirm whether default should stay `memory` or move to `cow` for better out-of-the-box persistence.
3. **Cache and volume garbage collection policy**: define when to prune stale image caches, old checkpoints, and workspace volume dirs.

## Post-Implementation Documentation Task

After implementation and verification are complete, add:

1. `agent_vm/docs/architecture/agent-vm-architecture.md`
2. ASCII diagrams for:
   - control plane and daemon ownership model
   - VFS mount composition
   - host Docker service access via `tcp.hosts`
3. Sidecar vs agent_vm parity table (feature-by-feature, with explicit non-goals and differences).

# Agent VM Full-Parity Spec and Implementation Plan

## Status

- Date: 2026-03-01
- Project: `agent_vm` (new folder, sidecar remains untouched)
- Host platform: macOS only (ARM64-first)
- Gondolin SDK: `@earendil-works/gondolin` (version-pinned in package.json)
- CLI library: `cmd-ts` (locked)
- OAuth strategy: `1.B` copy-in/copy-back for now
- OAuth broker strategy `1.C`: deferred
- VM idle shutdown: 10 minutes, only when no terminals are attached

## Goal

Build a Gondolin-based VM control plane that reaches day-1 parity with required sidecar affordances:

- Network allowlist policy + toggle presets
- Multi-agent launch support
- Per-repo config + persistence
- Host Docker services tunneled into VM (PostgreSQL, Redis)

The VM stack should preserve sidecar ergonomics while improving isolation and controllability.

## Scope Lock

- New project in `agent_vm/`
- Commands: `run-agent-vm`, `agent-vm-ctl`
- Config root: `.agent_vm/`
- TypeScript control plane as primary implementation
- Thin shell wrappers only when useful for operator UX
- Gondolin SDK-first internals (not CLI shell-out as primary path)

## Referenced Inputs

This plan references concrete artifacts in `agent_sidecar/research-agent-vm-system`:

- [gondolin_tunnel_spec.md](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/gondolin_tunnel_spec.md)
- [host-tunnel-manager.ts](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/reference/host-tunnel-manager.ts)
- [guest-loopback-stream-opener.ts](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/reference/guest-loopback-stream-opener.ts)
- [guest-loopback-bridge.js](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/reference/guest-loopback-bridge.js)
- [guest-loopback-bridge.json](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/reference/guest-loopback-bridge.json)
- [docker-compose.dev.yml](/Users/shravansunder/dev/ai-tools/agent_sidecar/research-agent-vm-system/reference/docker-compose.dev.yml)

These inputs are used specifically for:

- tunnel topology and default ports (`15432/16379` client, `16000/16001` uplink),
- host tunnel manager pooling and reconnect behavior,
- guest loopback bridge daemon behavior and health endpoint,
- host Docker localhost publishing conventions for PostgreSQL/Redis.

### Explicit Non-Goals (v1)

- Linux host support
- Docker-in-VM mode
- Replacing or modifying current `agent_sidecar` behavior
- Generic TCP exposure beyond required service tunnels
- OAuth broker / credential mediator (`1.C`)

## Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│  run-agent-vm / agent-vm-ctl  (cmd-ts CLI)                     │
├────────────────────────────────────────────────────────────────┤
│  Agent VM Daemon  (per workspace, lazy-started)                │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │ VM Lifecycle  │ │ Tunnel       │ │ Config Resolver        │ │
│  │ Manager      │ │ Manager      │ │ (.local > .repo > base)│ │
│  └──────────────┘ └──────────────┘ └────────────────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │ Policy       │ │ Auth Sync    │ │ Session / Attach       │ │
│  │ Engine       │ │ Manager      │ │ Manager                │ │
│  └──────────────┘ └──────────────┘ └────────────────────────┘ │
│  ┌──────────────┐                                              │
│  │ Idle Timer   │  Unix socket: /tmp/agent-vm-{name}.sock      │
│  └──────────────┘                                              │
├────────────────────────────────────────────────────────────────┤
│  Gondolin SDK  (@earendil-works/gondolin, version-pinned)      │
│  VM: create/start/exec/shell/close · vm.fs · vm.enableSsh     │
│  SandboxServer: openTcpStream (private via VM, needs accessor) │
│  VFS: RealFS · Readonly · Shadow(predicate) · Memory           │
│  Net: createHttpHooks({allowedHosts, secrets})                 │
│  Session: registerSession · SessionIpcServer · connectToSession│
│  Build: buildAssets · ensureGuestAssets · loadGuestAssets       │
├────────────────────────────────────────────────────────────────┤
│  Guest VM  (Debian bookworm-slim via OCI + Alpine boot layer)  │
│  Agent CLIs · Toolchain · Init scripts · qcow2 overlay state  │
├────────────────────────────────────────────────────────────────┤
│  Host Docker / OrbStack                                        │
│  PostgreSQL · Redis · other host services                      │
└────────────────────────────────────────────────────────────────┘
```

### Data Flow: CLI → Daemon → VM

```text
run-agent-vm --run-claude
  │
  ├─ 1. Check for existing daemon socket
  │     /tmp/agent-vm-{workspace-name}-{hash}.sock
  │
  ├─ 2a. No socket → fork daemon process
  │       Daemon: resolve config → build/load image → VM.create()
  │                → start tunnels → listen on socket
  │
  ├─ 2b. Socket exists → connect as client
  │
  ├─ 3. Send attach request over socket
  │     { type: "attach", command: "claude --continue ..." }
  │
  ├─ 4. Daemon calls vm.exec(command)
  │     Streams stdin/stdout/stderr over socket to client terminal
  │
  └─ 5. Client disconnects → daemon decrements client count
        If count = 0 → start 10m idle timer
```

### Session and Idle Lifecycle

```text
Terminal A: run-agent-vm --run-claude
  → spawn daemon (no existing socket)
  → daemon: resolve config → VM.create() → start tunnels
  → client count = 1

Terminal B: run-agent-vm
  → connect to existing daemon socket
  → daemon: vm.exec("zsh") for new shell
  → client count = 2

Terminal A exits → count = 1 (no idle timer)
Terminal B exits → count = 0 → start 10m idle timer

Timer fires, count still 0:
  → auth copy-back (1.B)
  → close tunnels
  → close VM
  → remove socket file
  → daemon exits

New client connects before 10m:
  → cancel timer, continue session
```

## Sidecar to Agent VM Parity Table

| Concern | Sidecar (Docker) | Agent VM (Gondolin) |
|---|---|---|
| Isolation | Container, shared host kernel | QEMU VM, separate guest kernel |
| Network enforcement | iptables + dnsmasq (bypassable with root) | Userspace network stack (can't bypass) |
| Protocol filtering | None (raw TCP to allowed IPs) | HTTP/TLS only (no raw TCP from guest NIC) |
| TLS inspection | None | MITM (can inspect HTTPS content) |
| Control plane | Bash scripts | TypeScript daemon + CLI |
| Config layering | `.local > .repo > .base` | Same model in `.agent_vm/` |
| Firewall policy | iptables + dnsmasq | `createHttpHooks({ allowedHosts })` |
| Toggle presets | Host files + `sidecar-ctl` | Host files + `agent-vm-ctl policy ...` |
| Secrets (API keys) | env/mount based (real keys in container) | Gondolin secret placeholders (keys never enter VM) |
| OAuth creds | Host-mounted config dirs | `1.B` copy-in/copy-back credential sync |
| `.git` safety | `:ro` bind mount | `ReadonlyProvider(RealFSProvider(...))` |
| `.agent_*` hiding | tmpfs shadow in workspace | `ShadowProvider` with empty overlay |
| node_modules/.venv | Docker volumes shadow host dirs | `ShadowProvider` hides host dirs, VM-owned Linux state in qcow2 |
| Persistence | Docker named volumes | qcow2 overlay + host state files |
| Service access | Container networking | Host Docker tunneled via `openTcpStream()` bridges |
| Multi-terminal attach | `docker exec -it container zsh` | Daemon attach via Unix socket IPC |
| Idle cleanup | Manual / container restart policy | Automatic 10m idle shutdown |
| Snapshots | None | Gondolin qcow2 checkpoints (future) |

## Guest Image Build

### Gondolin OCI Build Config

Base profile: `agent_vm/config/build.debian.json`

```json
{
  "arch": "aarch64",
  "distro": "alpine",
  "oci": {
    "image": "docker.io/library/debian:bookworm-slim",
    "runtime": "docker",
    "pullPolicy": "if-not-present"
  },
  "postBuild": {
    "commands": [
      "apt-get update && apt-get install -y git curl zsh python3 python3-venv nodejs npm",
      "npm install -g pnpm @openai/codex @google/gemini-cli",
      "curl -fsSL https://claude.ai/install.sh | bash"
    ]
  }
}
```

Boot layer remains Alpine (kernel + initramfs). Rootfs is Debian bookworm-slim.

### Two-Tier Image Architecture

```text
┌─────────────────────────────────────────────────────┐
│  Per-Repo Overlay (optional)                        │
│  - Extra apt packages from .agent_vm/vm.repo.conf   │
│  - build-extra.repo.sh custom install script        │
│  - Applied via postBuild.commands at build time     │
├─────────────────────────────────────────────────────┤
│  Base Image                                          │
│  - Debian bookworm-slim rootfs (OCI)                │
│  - Alpine boot layer (kernel + initramfs)           │
│  - Core tools: git, curl, zsh, python3, node, pnpm │
│  - Agent CLIs: claude, codex, gemini                │
│  - Shell: zsh with basic config                     │
└─────────────────────────────────────────────────────┘
```

| Area | Sidecar | Agent VM |
|---|---|---|
| Base userland | Debian slim Docker image | Debian slim OCI rootfs |
| Build runtime | Docker build | Docker runtime for OCI export + Gondolin `buildAssets()` |
| Agent CLI install | Dockerfile RUN step | `postBuild.commands` in build config |
| Extra packages | `EXTRA_APT_PACKAGES` in sidecar.conf | `EXTRA_APT_PACKAGES` in vm.repo.conf → merged into overlay build config |
| Custom build script | `build-extra.repo.sh` | Same pattern, runs during `postBuild` |
| Reset behavior | `--full-reset` rebuilds images | `--full-reset` rebuilds guest assets via `buildAssets()` |
| Output artifact | Docker image tags | Gondolin assets: `kernel`, `initramfs`, `rootfs.ext4`, `manifest.json` |

### Asset Cache Location

Built assets cached at: `~/.cache/agent-vm/images/{config-hash}/`

- `manifest.json` — build metadata + content hashes
- `vmlinuz-virt` — Alpine kernel
- `initramfs.cpio.lz4` — Alpine initramfs
- `rootfs.ext4` — Debian rootfs

Rebuild only when build config hash changes or `--full-reset` is used.

### Constraints

- `oci` mode and `container.force=true` must not be combined
- `docker` runtime must exist on host PATH (Docker Desktop or OrbStack)
- Debian rootfs must provide `/bin/sh`
- OrbStack is compatible — provides Docker-compatible CLI

## Guest Init and Shell Environment

The init system has three tiers (matching the sidecar's Dockerfile / container CMD / docker exec split). `postBuild.commands` covers build-time only; boot-time and first-exec init are required for workspace-dependent setup.

### Tier 1: Build-time (postBuild.commands)

Baked into the image. Equivalent to Dockerfile RUN steps.

| Category | Packages / Tools |
|---|---|
| Core | git, curl, wget, zsh, jq, unzip, less, ca-certificates |
| Python | python3, python3-venv, uv |
| Node | nodejs (24.x), pnpm (corepack), npm |
| Agent CLIs | claude, codex (@openai/codex), gemini (@google/gemini-cli) |
| Shell | zsh + oh-my-zsh + powerlevel10k + zsh-syntax-highlighting + zap |
| Browser | chromium + playwright-wrapper.sh, xvfb |
| Editors | micro, git-delta |
| History | atuin |
| Cloud | aws-cli v2 |
| Custom | `build-extra.repo.sh` / `build-extra.local.sh` (per-repo, runs as root with full network) |

### Tier 2: Boot-time init (vm.exec() after VM.create())

Runs as root, before accepting client connections. Cannot be prebaked — depends on mounted workspace and runtime config.

```text
1. Start Xvfb (virtual display :99 for Playwright)
2. Create standard directories (/home/agent/.cache, /home/agent/.local)
3. Create host-path symlinks for config directories:
     mkdir -p "$(dirname $HOST_CLAUDE_DIR)"
     ln -s /home/agent/.claude  $HOST_CLAUDE_DIR
     ln -s /home/agent/.codex   $HOST_CODEX_DIR
     ln -s /home/agent/.gemini  $HOST_GEMINI_DIR
4. Create dependency symlinks (symlink bridge):
     ln -s /opt/deps/nm    $WORK_DIR/node_modules
     ln -s /opt/deps/venv  $WORK_DIR/.venv
5. Auth 1.B: copy credentials into VM state paths
6. Apply environment overrides from config
7. Detect workspace type and install/sync dependencies:
   - pnpm install --frozen-lockfile (if pnpm workspace)
   - npm ci (if package-lock.json)
   - uv sync (if pyproject.toml)
8. Run init-background-extra.repo.sh / init-background-extra.local.sh (per-repo additive)
```

### Tier 3: First-exec init (per-session, before shell prompt)

Runs per client attach, in the user's shell context.

```text
1. Import shell history (atuin import, zsh_history)
2. Source .zshrc (load zap plugins)
3. Run init-foreground-extra.repo.sh / init-foreground-extra.local.sh (per-repo additive)
```

### Init Script Extensibility

Same additive pattern as sidecar. Extra scripts run AFTER base init, not as replacements.

| Script | Committed | Timing | Purpose |
|---|---|---|---|
| `build-extra.repo.sh` | Yes | Build | Custom packages, binaries (runs as root with network) |
| `build-extra.local.sh` | No | Build | Personal build customization |
| `init-background-extra.repo.sh` | Yes | Boot | Team background setup (services, watchers) |
| `init-background-extra.local.sh` | No | Boot | Personal background setup |
| `init-foreground-extra.repo.sh` | Yes | First-exec | Team shell init (env vars, aliases) |
| `init-foreground-extra.local.sh` | No | First-exec | Personal shell init |

### Shell environment

| Setting | Value | Notes |
|---|---|---|
| Shell | zsh | Default for all exec sessions |
| DISPLAY | `:99` | Xvfb virtual display |
| WORK_DIR | Original host path | e.g., `/Users/me/dev/my-project` |
| VIRTUAL_ENV | `$WORK_DIR/.venv` | If Python project detected |
| PNPM_STORE_DIR | `/home/agent/.local/share/pnpm` | Persistent in qcow2 |
| PATH | Includes `/home/agent/.local/bin` | For uv, pnpm global bins |
| DEVCONTAINER | `true` | Signals VM environment to CLIs |
| CLAUDE_CONFIG_DIR | `$HOST_CLAUDE_DIR` | Host-path for absolute path compat |
| GIT safe.directory | `*` | Trust all git dirs in workspace |

## Filesystem and Dependency Isolation

### VFS Mount Architecture

**Key constraint**: VFS is FUSE-based. The ShadowProvider's `writeMode: "tmpfs"` redirects writes to an in-memory MemoryProvider — ephemeral, lost on VM restart. For persistent Linux-native deps (node_modules, .venv), we use a **symlink bridge**: ShadowProvider hides host dirs and allows symlink creation via tmpfs, while the symlink target lives on the qcow2 overlay disk.

**Host-path mounting**: The VFS mounts at the **original macOS host path** (e.g., `/Users/me/dev/my-project`), not `/workspace`. This preserves absolute path compatibility for `claude --continue`, plugin paths, Codex session resume, and any config that stores absolute references. This matches the sidecar pattern (`-v "$WORK_DIR":"$WORK_DIR"`). Config directories get host-path symlinks for the same reason.

```text
Host filesystem (macOS)
  │
  ├── /Users/me/dev/my-project/           (repo root = WORK_DIR)
  │     ├── src/                           ─── RealFSProvider (rw) ──→ same path in guest
  │     ├── package.json                   ─── RealFSProvider (rw) ──→ same path in guest
  │     ├── node_modules/                  ─── ShadowProvider(tmpfs) → (hidden from guest)
  │     ├── .venv/                         ─── ShadowProvider(tmpfs) → (hidden from guest)
  │     ├── .git/                          ─── ReadonlyProvider ─────→ same path in guest (ro)
  │     ├── .agent_vm/                     ─── ShadowProvider(deny) ─→ (hidden, writes blocked)
  │     └── dist/                          ─── ShadowProvider(deny) ─→ (hidden, writes blocked)
  │
  └── /Users/me/.claude/                   ─── (not mounted; 1.B copy-in/copy-back)

Guest VM filesystem (Linux)
  │
  ├── /Users/me/dev/my-project/            (FUSE mount at original host path)
  │     ├── src/                            (live from host via RealFSProvider)
  │     ├── package.json                    (live from host)
  │     ├── node_modules → /opt/deps/nm/   (symlink in tmpfs layer → qcow2 target)
  │     ├── .venv → /opt/deps/venv/        (symlink in tmpfs layer → qcow2 target)
  │     └── .git/                           (readonly from host)
  │
  ├── /opt/deps/                            (qcow2 overlay, persistent)
  │     ├── nm/                             (Linux-native node_modules)
  │     └── venv/                           (Linux-native Python venv)
  │
  ├── /home/agent/.claude/                  (1.B copy-in at session start)
  ├── /Users/me/.claude → /home/agent/.claude  (host-path symlink for absolute path compat)
  ├── /home/agent/.codex/                   (1.B copy-in at session start)
  ├── /Users/me/.codex → /home/agent/.codex    (host-path symlink)
  ├── /home/agent/.gemini/                  (1.B copy-in at session start)
  ├── /Users/me/.gemini → /home/agent/.gemini  (host-path symlink)
  └── /home/agent/.cache/                   (persistent in qcow2)
```

**Why host-path mounting matters**: Claude Code stores `workingDirectory: "/Users/me/dev/my-project"` in session files. Codex stores similar absolute paths. Plugins reference host-absolute paths in `.claude/settings.json`. Without host-path mounting, `--continue` and plugin loading fail silently.

### Dependency Symlink Bridge

The guest init script creates symlinks that bridge VFS and qcow2 storage:

```text
Boot sequence (WORK_DIR = /Users/me/dev/my-project):
  1. VFS FUSE mounts at $WORK_DIR (ShadowProvider hides host node_modules/.venv)
  2. Init script creates qcow2 dirs:
       mkdir -p /opt/deps/nm /opt/deps/venv
  3. Init script creates dep symlinks (in ShadowProvider tmpfs layer):
       ln -s /opt/deps/nm    $WORK_DIR/node_modules
       ln -s /opt/deps/venv  $WORK_DIR/.venv
  4. Init script creates config host-path symlinks:
       mkdir -p "$(dirname $HOST_CLAUDE_DIR)"
       ln -s /home/agent/.claude  $HOST_CLAUDE_DIR    # e.g., /Users/me/.claude
       ln -s /home/agent/.codex   $HOST_CODEX_DIR
       ln -s /home/agent/.gemini  $HOST_GEMINI_DIR
  5. pnpm install writes to /opt/deps/nm (persistent on qcow2)
  6. uv sync writes to /opt/deps/venv (persistent on qcow2)

Result:
  - Workspace at original host path → session --continue works
  - Config dirs at original host paths → plugin loading works
  - Host macOS node_modules completely hidden
  - Symlinks recreated on each boot (ephemeral in tmpfs, targets persist)
```

For **monorepo** workspaces, each package gets its own symlink:

```text
$WORK_DIR/packages/frontend/node_modules → /opt/deps/nm-frontend/
$WORK_DIR/packages/backend/node_modules  → /opt/deps/nm-backend/
```

### VFS Provider Stack (Gondolin SDK — Verified API)

ShadowProvider uses a **predicate callback**, not a simple list. The `createShadowPathPredicate()` helper converts a path array into the required predicate.

```typescript
import {
  VM,
  RealFSProvider,
  ReadonlyProvider,
  ShadowProvider,
  createShadowPathPredicate,
  MemoryProvider,
} from "@earendil-works/gondolin";

// Build shadow paths from workspace detection
const shadowPaths = [
  "node_modules",    // Root node_modules (macOS)
  ".venv",           // Root Python venv (macOS)
  ".agent_vm",       // Config dir (sensitive)
  "dist",            // Build artifacts (platform-specific)
  ".next",           // Next.js cache
  "__pycache__",     // Python bytecode
  // ... dynamically added per-package node_modules for monorepos
];

// repoRoot is the original host path, e.g., "/Users/me/dev/my-project"
const vfs: VmVfsOptions = {
  fuseMount: repoRoot,  // Mount at original host path for session/plugin compatibility
  mounts: {
    [repoRoot]: new ShadowProvider(
      new RealFSProvider(repoRoot),
      {
        // Predicate-based: createShadowPathPredicate() is a convenience helper
        shouldShadow: createShadowPathPredicate(shadowPaths),
        // "tmpfs" allows guest to create symlinks at shadowed paths
        // These symlinks point to /opt/deps/* on qcow2 for persistence
        writeMode: "tmpfs",
        // Block symlink bypass (guest can't ln -s .agent_vm x; cat x)
        denySymlinkBypass: true,
      }
    ),
    [path.join(repoRoot, ".git")]: new ReadonlyProvider(
      new RealFSProvider(path.join(repoRoot, ".git"))
    ),
  },
};
```

**ShadowProvider API reference** (verified from source at `host/src/vfs/shadow.ts`):

| Option | Type | Default | Purpose |
|---|---|---|---|
| `shouldShadow` | `(ctx: ShadowContext) => boolean` | Required | Predicate: return true to hide path |
| `writeMode` | `"deny" \| "tmpfs"` | `"deny"` | deny = EACCES on write; tmpfs = redirect to MemoryProvider |
| `tmpfs` | `VirtualProvider` | `new MemoryProvider()` | Upper layer for tmpfs writes |
| `denySymlinkBypass` | `boolean` | `true` | Blocks `ln -s hidden_path alias; cat alias` |
| `denyWriteErrno` | `number` | `EACCES` | Errno for denied writes |

`createShadowPathPredicate(paths: string[])` — convenience helper that creates a predicate matching exact paths and their children via prefix.

### Monorepo Workspace Detection

The daemon detects workspace packages at startup to build the shadow path list:

| Signal | Detection | Shadow targets |
|---|---|---|
| `pnpm-workspace.yaml` | Parse `packages` globs | Root + each package's `node_modules/` |
| `package.json` workspaces | Parse `workspaces` field | Root + each package's `node_modules/` |
| `pyproject.toml` | Presence check | `.venv/` at repo root |

The shadow list is dynamically built from detected workspace structure and passed to `createShadowPathPredicate()`.

### Persistence Model

| What | Where | Survives restart | Survives `--full-reset` |
|---|---|---|---|
| VM-owned node_modules | qcow2 overlay | Yes | No |
| VM-owned .venv | qcow2 overlay | Yes | No |
| Shell history | qcow2 overlay | Yes | No |
| Package caches (pnpm store, uv) | qcow2 overlay | Yes | No |
| Auth credentials (1.B) | Host (copy-back on shutdown) | Yes | Yes |
| Config files (.agent_vm/) | Host filesystem | Yes | Yes |
| Session metadata | `~/.cache/agent-vm/sessions/` | Yes | Yes |
| Built image assets | `~/.cache/agent-vm/images/` | Yes | Rebuilt |

## Auth Strategy

### 1.B: Copy-In / Copy-Back (v1)

```text
Daemon startup:
  ┌─────────────────────────────────────────────┐
  │ 1. Extract Claude OAuth from macOS Keychain │
  │    security find-generic-password            │
  │    -s "Claude Code-credentials" -w           │
  │    → ~/.claude/.credentials.json             │
  ├─────────────────────────────────────────────┤
  │ 2. Copy host auth dirs to staging            │
  │    ~/.claude/  → /tmp/agent-vm-auth/claude/  │
  │    ~/.codex/   → /tmp/agent-vm-auth/codex/   │
  │    ~/.gemini/  → /tmp/agent-vm-auth/gemini/  │
  ├─────────────────────────────────────────────┤
  │ 3. Write staged files into VM via vm.fs API  │
  │    /tmp/agent-vm-auth/claude/                │
  │    → /home/agent/.claude/ (inside VM)        │
  └─────────────────────────────────────────────┘

During session:
  Agent CLIs read/write credentials inside VM.
  Token refresh happens normally (new tokens written in VM).

Daemon shutdown (graceful):
  ┌─────────────────────────────────────────────┐
  │ 1. Read credential files from VM via vm.fs   │
  │ 2. Write to staging dir with lock file       │
  │ 3. Atomic rename staging → host auth dirs    │
  │ 4. Release lock, close VM                    │
  └─────────────────────────────────────────────┘

Crash recovery:
  - Staging dir has .lock file → detect incomplete copy-back
  - On next daemon start: check for stale staging, warn user
  - Host auth dirs are never partially written (atomic rename)
```

**Periodic copy-back** (resilience against hard crashes):

- Every 5 minutes, daemon reads VM credentials via `vm.fs` and writes to staging
- If daemon crashes between periodic copies, at most 5 minutes of token refresh is lost
- Old refresh token on host still works to obtain new access token

### Full Credential and Config Inventory (v1 Parity)

All items the sidecar mounts or copies. The VM uses 1.B copy-in/copy-back for auth dirs and host-path symlinks for absolute path compatibility.

**Auth directories** (1.B copy-in/copy-back, bidirectional):

| CLI | Host auth location | Keychain extraction | Env var fallback | VM path | Host-path symlink |
|---|---|---|---|---|---|
| Claude Code | `~/.claude/` | `security find-generic-password -s "Claude Code-credentials"` → `.credentials.json` | `ANTHROPIC_API_KEY` | `/home/agent/.claude/` | `$HOME/.claude → /home/agent/.claude` |
| Claude alt auth | `~/.config/claude-code/auth.json` | Symlink to `.credentials.json` | — | Symlink created in VM | — |
| Codex | `~/.codex/` | No (file-based) | `CODEX_API_KEY`, `OPENAI_API_KEY` | `/home/agent/.codex/` | `$HOME/.codex → /home/agent/.codex` |
| Gemini | `~/.gemini/` | No (file-based) | `GEMINI_API_KEY`, `GOOGLE_API_KEY` | `/home/agent/.gemini/` | `$HOME/.gemini → /home/agent/.gemini` |
| OpenCode | `~/.config/opencode/` | No (file-based) | — | `/home/agent/.opencode/` | `$HOME/.config/opencode → /home/agent/.opencode` |

**Config files and keys** (1.B copy-in, read-write unless noted):

| Item | Host source | VM path | Notes |
|---|---|---|---|
| Claude global settings | `~/.claude.json` | `/home/agent/.claude.json` + host-path symlink | Global Claude Code preferences |
| AWS credentials | `~/.aws/` | `/home/agent/.aws/` (read-only copy) | Optional, for AWS CLI access |
| SSH keys | `~/.ssh/` | `/home/agent/.ssh/` (copy-in, preserve 0600 perms) | Required for SSH-based git workflows. Copy-back NOT needed (keys don't change) |
| Git global config | `~/.gitconfig` | `/home/agent/.gitconfig` | Git user.name, user.email, aliases. Copy file, not dir |

**Shell history** (copy-in at boot, optional):

| Item | Host source | VM path | Notes |
|---|---|---|---|
| Zsh history | `~/.zsh_history` | `/home/agent/.zsh_history` | Copied once at session start |
| Atuin config | `~/.config/atuin/` | `/home/agent/.config/atuin/` | Persistent in qcow2 |
| Atuin data | `~/.local/share/atuin/` | `/home/agent/.local/share/atuin/` | Persistent in qcow2 |

**Config files** (read-only, optional):

| Item | Host source | VM path | Notes |
|---|---|---|---|
| Micro editor config | `~/.config/micro/` | `/home/agent/.config/micro/` | Editor preferences |

When an env var fallback is set, the daemon uses Gondolin secret injection instead of 1.B for that CLI.

### 1.C: OAuth Broker (Deferred)

Host-side credential mediator with VFS placeholder injection and `onResponse` hooks for token refresh interception. Deferred due to complexity: requires per-CLI knowledge of auth endpoints and response formats, custom VFS provider for credential file rewriting, and dynamic secret re-registration.

## Policy and Secrets

### Network Policy

```text
Deny by default (Gondolin userspace network stack)
  │
  ├── Base allowlist    (agent_vm/config/policy-allowlist.base.txt)
  ├── Repo extras       (.agent_vm/policy-allowlist-extra.repo.txt)
  ├── Local extras      (.agent_vm/policy-allowlist-extra.local.txt)
  └── Active toggles    (.agent_vm/.generated/policy-toggle.tmp.txt)
      │
      ▼
  Compiled allowedHosts[]  →  createHttpHooks({ allowedHosts })
```

### Base Allowlist (Must-Include Domains)

| Category | Domains | Purpose |
|---|---|---|
| **Auth (critical)** | `anthropic.com`, `api.anthropic.com`, `console.anthropic.com` | Claude OAuth + API |
| | `openai.com`, `api.openai.com`, `auth.openai.com`, `platform.openai.com` | Codex OAuth + API |
| | `accounts.google.com`, `oauth2.googleapis.com`, `generativelanguage.googleapis.com` | Gemini OAuth + API |
| **Package registries** | `registry.npmjs.org`, `pypi.org`, `files.pythonhosted.org` | npm, pip/uv |
| **AI APIs** | `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com` | Agent runtime |
| **Git (read)** | `github.com`, `api.github.com` | Git fetch, API read |

Without the auth domains, OAuth token refresh inside the VM will fail.

### Secret Injection (API Keys)

```typescript
const { httpHooks, env } = createHttpHooks({
  allowedHosts: compiledAllowlist,
  secrets: {
    // Only registered when env var fallback is set (not using OAuth)
    ANTHROPIC_API_KEY: {
      hosts: ["api.anthropic.com"],
      value: process.env.ANTHROPIC_API_KEY,
    },
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
    GEMINI_API_KEY: {
      hosts: ["generativelanguage.googleapis.com"],
      value: process.env.GEMINI_API_KEY,
    },
  },
});

// Guest receives: ANTHROPIC_API_KEY=GONDOLIN_PLACEHOLDER_abc123
// Host replaces placeholder in outbound HTTP headers with real key
// Real key never enters VM
```

### Toggle Presets

| Preset | Domains | File |
|---|---|---|
| `github-write` | `github.com` (push scopes) | `agent_vm/config/presets/github-write.txt` |
| `notion` | `api.notion.com` | `agent_vm/config/presets/notion.txt` |
| `linear` | `api.linear.app` | `agent_vm/config/presets/linear.txt` |

Toggle via: `agent-vm-ctl policy allow notion` / `agent-vm-ctl policy block notion`

Timed toggle: `agent-vm-ctl policy allow-for 15m notion`

### Playwright / Browser Security (Two-Layer Enforcement)

Agents with browser access are a higher-risk threat model — they can write arbitrary code that drives Chromium, so any single enforcement layer is potentially bypassable. We use two complementary layers.

**Why browsers need extra restrictions**: An agent can craft arbitrary HTTP requests via curl or node, but that traffic goes through Gondolin's `createHttpHooks` which enforces the allowlist. A browser, however, can execute JavaScript, follow redirects, render pages, and exfiltrate data through more subtle channels. Restricting browser access to localhost + explicitly allowed hosts is a safer default.

#### Layer 1: Chromium `--host-rules` (Guest-Side — Primary Enforcement)

Same pattern as sidecar. A `playwright-wrapper.sh` script intercepts Chromium launches:

```bash
# playwright-wrapper.sh (baked into image)
HOST_RULES="MAP * 127.0.0.1, EXCLUDE localhost, EXCLUDE 127.0.0.1, EXCLUDE [::1]"

# PLAYWRIGHT_EXTRA_HOSTS injected as env var by daemon
if [ -n "$PLAYWRIGHT_EXTRA_HOSTS" ]; then
    for host in $(echo "$PLAYWRIGHT_EXTRA_HOSTS" | tr ',' ' '); do
        host=$(echo "$host" | xargs)
        [ -n "$host" ] && HOST_RULES="$HOST_RULES, EXCLUDE $host"
    done
fi

exec "$CHROMIUM_REAL" --host-rules="$HOST_RULES" "$@"
```

Default: browser can only reach `localhost`. Additional hosts opt-in via `PLAYWRIGHT_EXTRA_HOSTS` in `vm.repo.conf`.

The real Chromium binary is moved to a non-standard path and only exposed through the wrapper. This prevents trivial bypass by direct binary invocation.

#### Layer 2: Host-Side HTTP Hook (Defense in Depth)

Gondolin's `createHttpHooks` cannot distinguish traffic by source process — all guest HTTP appears identical. However, we can use User-Agent–based heuristics as a second line:

```typescript
isRequestAllowed: (request) => {
  const ua = request.headers.get("user-agent") ?? "";
  const hostname = new URL(request.url).hostname;
  const isLikelyBrowser = ua.includes("HeadlessChrome") || ua.includes("Playwright");

  if (isLikelyBrowser) {
    // Browser traffic: localhost + PLAYWRIGHT_EXTRA_HOSTS only
    return playwrightAllowedHosts.has(hostname) || hostname === "localhost";
  }

  // CLI traffic: normal allowedHosts policy
  return compiledAllowlist.has(hostname);
};
```

**Limitation**: User-Agent is spoofable. An agent can craft `curl` or `node http.request()` calls that bypass UA detection. However, these non-browser requests are still subject to Gondolin's `createHttpHooks` allowlist enforcement at the network level — the agent can't reach hosts outside the compiled allowlist regardless of User-Agent. Layer 1 (Chromium's `--host-rules`) is the primary browser enforcement. Layer 2 is monitoring/visibility for browser-specific traffic. Gondolin's network-level allowlist is the actual fallback for all guest HTTP.

#### Comparison with Sidecar

| Aspect | Sidecar | VM |
|---|---|---|
| Primary enforcement | Chromium `--host-rules` | Chromium `--host-rules` (same) |
| Secondary enforcement | iptables (OS-level, process-agnostic) | HTTP hooks with User-Agent heuristic |
| Source differentiation | Same process model (all in one container) | Same limitation (all in one VM) |
| Config key | `PLAYWRIGHT_EXTRA_HOSTS` | `PLAYWRIGHT_EXTRA_HOSTS` (same) |

## Tunnel Model

### Architecture

```text
Host                                    Guest VM (Gondolin)
────────────────────────────────────────────────────────────
PostgreSQL @ 127.0.0.1:5432  ◄────┐
                                   │    Guest Loopback Bridge
Redis      @ 127.0.0.1:6379  ◄──┐ │    (Node.js daemon in image)
                                 │ │
     Tunnel Manager              │ │    Client ports:
     (in daemon process)         │ │      127.0.0.1:15432 (PG)
       │                        │ │      127.0.0.1:16379 (Redis)
       ├─ 8 PG uplinks ────────┘ │
       └─ 4 Redis uplinks ───────┘    Uplink ports:
                                         127.0.0.1:16000 (PG)
     Uses openTcpStream()                127.0.0.1:16001 (Redis)
     per uplink
```

### Port Mapping

| Service | Host target | Guest client port | Guest uplink port | Default uplinks |
|---|---|---|---|---|
| PostgreSQL | `127.0.0.1:5432` | `127.0.0.1:15432` | `127.0.0.1:16000` | 8 |
| Redis | `127.0.0.1:6379` | `127.0.0.1:16379` | `127.0.0.1:16001` | 4 |

### `openTcpStream()` API Access (Verified — Stability Risk)

`openTcpStream()` lives on `SandboxServerOps` (mixed into `SandboxServer`), **not on `VM`**. The VM stores it as `private server: SandboxServer | null` — no public getter.

```typescript
// SandboxServerOps.openTcpStream() signature (from host/src/sandbox/server-ops.ts:341)
async openTcpStream(target: {
  host: string;    // guest loopback address (usually "127.0.0.1")
  port: number;    // guest port to connect to
  timeoutMs?: number; // default: 5000ms
}): Promise<Duplex>
```

**How it works**: Uses a dedicated virtio-serial port. Bypasses the guest network stack entirely. Returns a Node.js `Duplex` stream piped to a TCP socket inside the guest.

**Access pattern for tunnel manager** (required since `server` is private on VM):

```typescript
// Option A: Index access (fragile, requires version pinning)
const server = (vm as Record<string, unknown>)["server"] as SandboxServer;
const stream = await server.openTcpStream({ host: "127.0.0.1", port: 16000 });

// Option B: Capture server reference during VM construction (preferred)
// If Gondolin adds a public getter or hook, migrate to that.
```

**Stability risk**: `openTcpStream()` is on an exported class (`SandboxServer`) but accessed through a private VM field. **Pin Gondolin to exact version** and test after every upgrade. Consider contributing a `vm.openTcpStream()` passthrough upstream.

### Tunnel Manager Lifecycle

The tunnel manager runs inside the daemon process (same Node.js process as VM lifecycle):

```text
Daemon starts VM
  → TunnelManager.start(server, tunnelConfig)  // receives SandboxServer, not VM
  → For each service:
      → Open desiredUplinks guest streams via server.openTcpStream()
      → Dial host target (127.0.0.1:5432 or :6379)
      → Pipe guest stream ↔ host socket bidirectionally
  → Monitor loop:
      → On stream close/error: destroy both sides
      → Replenish with exponential backoff (500ms → 5000ms)
      → Report health: healthy | degraded | unhealthy

Daemon shutting down
  → TunnelManager.stop()
  → Close all uplinks and host sockets
```

### Health States

| State | Condition | Reported via |
|---|---|---|
| `healthy` | All desired uplinks connected | `agent-vm-ctl tunnels status` |
| `degraded` | Some uplinks connected, replenishing | `agent-vm-ctl tunnels status` |
| `unhealthy` | Zero uplinks, all retries failing | `agent-vm-ctl tunnels status` |

### Configuration

Tunnel config: `.agent_vm/tunnels.repo.json` (override) / `.agent_vm/tunnels.local.json` (personal)

```json
{
  "services": {
    "postgres": {
      "enabled": true,
      "hostTarget": { "host": "127.0.0.1", "port": 5432 },
      "guestClientPort": 15432,
      "guestUplinkPort": 16000,
      "desiredUplinks": 8
    },
    "redis": {
      "enabled": true,
      "hostTarget": { "host": "127.0.0.1", "port": 6379 },
      "guestClientPort": 16379,
      "guestUplinkPort": 16001,
      "desiredUplinks": 4
    }
  }
}
```

### Guest Environment Variables (Injected)

```bash
PGHOST=127.0.0.1
PGPORT=15432
REDIS_HOST=127.0.0.1
REDIS_PORT=16379
REDIS_URL=redis://127.0.0.1:16379/0
```

## Daemon IPC Protocol

### Unix Socket

Location: `/tmp/agent-vm-{workspace-name}-{hash}.sock`

Wire format: newline-delimited JSON over Unix domain socket.

### Messages: Client → Daemon

| Message | Fields | Description |
|---|---|---|
| `attach` | `{ type: "attach", command?: string }` | Request new exec session. If `command` omitted, opens interactive shell. |
| `status` | `{ type: "status" }` | Request daemon status (VM state, tunnels, clients). |
| `policy.reload` | `{ type: "policy.reload" }` | Recompile allowlist and recreate VM runtime to apply policy. |
| `policy.update` | `{ type: "policy.update", action: "allow"\|"block"\|"clear", target: string }` | Toggle preset or domain. |
| `tunnel.restart` | `{ type: "tunnel.restart", service?: string }` | Restart tunnel uplinks (all or specific service). |
| `shutdown` | `{ type: "shutdown" }` | Graceful shutdown (copy-back auth, close tunnels, close VM). |

### Messages: Daemon → Client

| Message | Fields | Description |
|---|---|---|
| `attached` | `{ type: "attached", sessionId: string }` | Exec session created, begin streaming. |
| `status.response` | `{ type: "status.response", vm: ..., tunnels: ..., clients: number }` | Current daemon state. |
| `stream.stdout` | `{ type: "stream.stdout", data: string }` | Exec session stdout chunk. |
| `stream.stderr` | `{ type: "stream.stderr", data: string }` | Exec session stderr chunk. |
| `stream.exit` | `{ type: "stream.exit", code: number }` | Exec session exited. |
| `error` | `{ type: "error", message: string }` | Error response. |

### Stream Relay

For `attach` sessions, stdin/stdout/stderr are relayed bidirectionally:

```text
Terminal ←→ Unix socket ←→ Daemon ←→ vm.exec() ←→ Guest shell/agent
```

### `vm.shell()` and `vm.exec()` API Reference (Verified)

The daemon uses `vm.shell()` for interactive sessions and `vm.exec()` for command execution.

**`vm.shell(options?: ShellOptions): ExecProcess`** (from `host/src/vm/core.ts:680`)

```typescript
type ShellOptions = {
  command?: string | string[];  // default: ["/bin/bash", "-i"]
  env?: string[] | Record<string, string>;
  cwd?: string;
  signal?: AbortSignal;
  attach?: boolean;  // default: process.stdin.isTTY (auto-detect)
};
```

Internally calls `vm.exec(command, { stdin: true, pty: true, ... })`. When `attach: true` (default in TTY), connects process.stdin/stdout/stderr directly. **For daemon use, always set `attach: false`** and manually relay streams over the Unix socket.

**`vm.exec(command, options?: ExecOptions): ExecProcess`** (from `host/src/vm/core.ts:653`)

```typescript
type ExecOptions = {
  argv?: string[];
  env?: string[] | Record<string, string>;
  cwd?: string;
  stdin?: boolean | string | Buffer | Readable | AsyncIterable<Buffer>;
  pty?: boolean;
  encoding?: BufferEncoding;  // default: "utf-8"
  signal?: AbortSignal;
  stdout?: "buffer" | "pipe" | "inherit" | "ignore" | WritableStream;
  stderr?: "buffer" | "pipe" | "inherit" | "ignore" | WritableStream;
};
```

`ExecProcess` is both `PromiseLike<ExecResult>` and `AsyncIterable<string>`. For interactive sessions (`pty: true`), use `proc.write()` for stdin and iterate for stdout.

**Daemon attach flow**:

```typescript
// Interactive shell for attached client
const proc = vm.shell({
  attach: false,  // daemon manages streams, not process.stdin
  cwd: "/workspace",
  env: { TERM: clientTermType },
});
// Relay proc output → Unix socket → client terminal
// Relay client terminal → Unix socket → proc.write()

// Agent command execution
const proc = vm.exec("claude --dangerously-skip-permissions --continue", {
  stdin: true,
  pty: true,
  stdout: "pipe",
  stderr: "pipe",
  cwd: "/workspace",
});
```

## Gondolin Session Registry (Potential Daemon Simplification)

Gondolin ships a built-in session registry and IPC server that partially overlap with our planned daemon architecture. Documented here for Phase 3 design decisions.

### What's Available (Verified from `host/src/session-registry.ts`)

**Session Registry** — file-based session discovery at `~/.cache/gondolin/sessions/`:

| Function | Purpose |
|---|---|
| `registerSession({ id, label })` | Write `{id}.json` metadata + return `{id}.sock` path |
| `unregisterSession(id)` | Remove metadata + socket files |
| `listSessions()` | Discover all sessions, check liveness (pid + socket probe) |
| `findSession(query)` | Exact or prefix-match lookup |
| `gcSessions()` | Clean stale entries (dead pid or unreachable socket) |

**SessionIpcServer** — Unix socket server for multiplexed exec sessions:

```typescript
class SessionIpcServer {
  constructor(
    sockPath: string,
    connectToSandbox: (onMessage, onClose?) => SandboxConnection,
    handlers?: { onSnapshot? }
  );
  start(): void;
  close(): Promise<void>;
}
```

- Handles framed binary protocol (length-prefixed JSON + binary output frames)
- Per-client request ID translation (each client gets independent ID space)
- Supports `exec`, `stdin`, `pty_resize`, `exec_window`, `snapshot` messages
- Automatically bridges each client to the SandboxServer via `connectToSandbox` callback

**connectToSession** — client-side connector:

```typescript
function connectToSession(sockPath: string, callbacks: IpcClientCallbacks): {
  send: (message: ClientMessage) => void;
  close: () => void;
}
```

### How This Relates to Our Daemon

Our planned NDJSON-over-Unix-socket daemon protocol overlaps with `SessionIpcServer`. Key differences:

| Feature | Our Daemon Plan | Gondolin SessionIpcServer |
|---|---|---|
| Wire format | NDJSON (newline-delimited JSON) | Length-prefixed frames (4-byte header + JSON or binary) |
| Protocol | Custom messages (attach, status, policy, shutdown) | SandboxServer protocol (exec, stdin, pty_resize, snapshot) |
| Client tracking | Manual count + idle timer | Per-client sockets, no lifecycle management |
| Policy commands | Supported (policy.reload, policy.update) | Not supported |
| Tunnel management | Supported (tunnel.restart) | Not supported |
| Auth copy-back | Supported (on shutdown) | Not supported |
| Session discovery | Custom (we manage socket files) | Built-in (registerSession/findSession) |

### Recommendation for Phase 3

**Use Gondolin's session registry for discovery, build our own daemon for lifecycle management.**

- Use `registerSession()` / `findSession()` / `gcSessions()` for session metadata and stale cleanup — don't reinvent this.
- Use `connectToSession()` as the transport layer for exec relay, instead of raw NDJSON. This gets us the binary frame protocol and request ID multiplexing for free.
- Build our daemon layer on top for: idle timer, policy commands, tunnel management, auth copy-back, client counting.

This means our daemon wraps `SessionIpcServer` for exec relay and adds a control channel for policy/tunnel/lifecycle commands.

```text
run-agent-vm (client)
  │
  ├─ Control channel: our NDJSON protocol for status/policy/tunnel/shutdown
  │
  └─ Exec channel: connectToSession() → SessionIpcServer → SandboxServer → guest
```

## Config Model (`.agent_vm/`)

### File Layout

| File | Committed | Pattern | Purpose |
|---|---|---|---|
| `vm.repo.conf` | Yes | Override | Team VM config (packages, mounts, env) |
| `vm.local.conf` | No | Override | Personal VM config overrides |
| `policy-allowlist-extra.repo.txt` | Yes | Additive | Team firewall additions |
| `policy-allowlist-extra.local.txt` | No | Additive | Personal firewall additions |
| `tunnels.repo.json` | Yes | Override | Team tunnel mapping |
| `tunnels.local.json` | No | Override | Personal tunnel mapping |
| `.generated/` | No | — | Compiled policy, session state |
| `.gitignore` | Yes | — | Ignores `*.local.*` and `.generated/` |

### Resolution Rules

**Override pattern** (pick one: local > repo > base):

```text
vm.local.conf  →  vm.repo.conf  →  agent_vm/config/vm.base.conf
```

**Additive pattern** (merge all that exist):

```text
agent_vm/config/policy-allowlist.base.txt
  + .agent_vm/policy-allowlist-extra.repo.txt
  + .agent_vm/policy-allowlist-extra.local.txt
  + .agent_vm/.generated/policy-toggle.tmp.txt
  = compiled allowedHosts[]
```

### VM Config Keys

| Key | Default | Description |
|---|---|---|
| `EXTRA_APT_PACKAGES` | `""` | Space-separated, triggers overlay rebuild |
| `EXTRA_MOUNTS` | `""` | Additional VFS mounts (path:provider pairs) |
| `IDLE_TIMEOUT_MINUTES` | `10` | Minutes before idle daemon shuts down |
| `TUNNEL_ENABLED` | `true` | Enable/disable service tunnels |
| `PLAYWRIGHT_EXTRA_HOSTS` | `""` | Hosts allowed in Chromium |

## CLI Surface (v1)

### `run-agent-vm`

| Flag | Description |
|---|---|
| `--reload` | Recreate VM session from current config (preserves qcow2 state) |
| `--full-reset` | Rebuild image assets + recycle daemon session |
| `--no-run` | Start daemon + VM + tunnels but don't open shell |
| `--run <cmd>` | Run command in VM |
| `--run-claude` | Launch Claude Code (`claude --dangerously-skip-permissions --continue`) |
| `--run-codex` | Launch Codex (`codex --dangerously-bypass-approvals-and-sandbox resume --last`) |
| `--run-gemini` | Launch Gemini (`gemini --yolo`) |
| `--run-opencode` | Launch OpenCode (`opencode --yolo --continue`) |
| `--run-cursor` | Launch Cursor (`cursor .`) |

### `agent-vm-ctl`

| Subcommand | Description |
|---|---|
| `status` | VM state, tunnel health, client count, idle timer |
| `sessions` | List active daemon sessions (across workspaces) |
| `policy list` | Show compiled allowlist |
| `policy allow <preset\|domain>` | Add preset or domain to toggle list |
| `policy block <preset\|domain>` | Remove from toggle list |
| `policy allow-for <duration> <target>` | Temporary access (e.g., `15m notion`) |
| `policy clear` | Clear all toggle entries |
| `policy reload` | Recompile policy and recreate VM runtime |
| `policy presets` | List available presets |
| `tunnels status` | Tunnel health per service |
| `tunnels restart` | Restart all tunnel uplinks |
| `daemon stop` | Graceful shutdown (copy-back, cleanup) |
| `daemon gc` | Remove stale session state, old image caches |

## Error Recovery

### Failure Modes

| Failure | Detection | Recovery |
|---|---|---|
| VM crash (QEMU exits) | Daemon detects child process exit | Log error, attempt VM restart, notify connected clients |
| Daemon crash (hard kill) | Socket file exists but no process | Next `run-agent-vm` detects stale socket, cleans up, starts fresh |
| Tunnel uplink failure | Stream close/error event | Exponential backoff retry (500ms → 5s), report degraded health |
| All tunnels unhealthy | Zero uplinks after max retries | Report unhealthy, `agent-vm-ctl tunnels restart` for manual recovery |
| Auth copy-back interrupted | `.lock` file in staging dir | Next daemon start warns user, attempts recovery from staging |
| Image build failure | `buildAssets()` throws | Clear error message, no partial state (build is atomic) |
| Host Docker service down | Tunnel dial fails | Tunnels report unhealthy, auto-retry when service returns |

### Logging

| Destination | Content |
|---|---|
| `~/.cache/agent-vm/logs/{session-name}.log` | Daemon lifecycle, tunnel events, policy changes |
| stderr (daemon) | Critical errors, crash traces |
| `agent-vm-ctl status` | Summary view of current state |

Log format: structured JSON lines (timestamp, level, component, message, metadata).

## Testing Hardness Plan

All test code in TypeScript with Vitest.

### Test Pyramid

```text
                    ┌───────────┐
                    │   E2E     │  3-5 tests (macOS, real VM)
                    │  (smoke)  │  Boot, agent launch, tunnel reach
                  ┌─┴───────────┴─┐
                  │  Integration   │  15-25 tests (real daemon, mock VM)
                  │                │  Daemon lifecycle, IPC, auth sync
                ┌─┴────────────────┴─┐
                │     Unit tests      │  40-60 tests (pure functions)
                │                     │  Config, policy, tunnel config,
                │                     │  workspace detection, idle timer
                └─────────────────────┘
```

### Unit Tests

| Module | Test focus |
|---|---|
| Config resolver | Precedence: local > repo > base; additive merge for allowlists |
| Policy compiler | Domain dedup, wildcard normalization, preset loading, toggle state |
| Workspace identity | Deterministic session naming from paths; hash stability |
| Agent launcher | Command mapping for each CLI preset |
| Tunnel config | Schema validation, defaults, service enable/disable |
| Idle timer | State machine: start/cancel/fire transitions; client count tracking |
| Auth sync | Diff detection, atomic write safety, crash recovery detection |
| VFS config builder | ShadowProvider hidden list from workspace detection |

### Integration Tests

| Scenario | Setup | Assertions |
|---|---|---|
| Daemon lifecycle | Start daemon, verify socket, connect client, disconnect, verify idle timer | Socket created/removed, client count accurate |
| Multi-client attach | Start daemon, connect 2 clients, disconnect 1, verify no idle | Idle timer only starts at count=0 |
| IPC protocol | Send each message type, verify response format | All message types handled correctly |
| Policy reload | Compile policy, update toggles, reload, verify new allowlist | Runtime recreation (Gondolin hooks are create-time) |
| Tunnel manager | Mock `openTcpStream`, simulate failures, verify reconnect | Backoff timing, health state transitions |
| VFS policy | Configure ShadowProvider, verify hidden paths, readonly .git | Guest can't see node_modules, can't write .git |
| Auth copy-in/back | Write test credentials, start daemon, verify copy-in, stop, verify copy-back | Atomic writes, no partial state |

### E2E Tests (macOS, requires QEMU HVF)

| Test | Steps | Pass criteria |
|---|---|---|
| Boot smoke | `run-agent-vm --no-run` | VM boots, daemon reports ready, tunnels healthy |
| Agent launch | `run-agent-vm --run-codex` | Codex starts, shows prompt (exit immediately) |
| Tunnel reach | Boot VM, `vm.exec("pg_isready -h 127.0.0.1 -p 15432")` | Exit code 0 (postgres reachable) |
| Auth round-trip | Copy test credentials in, verify readable in VM, stop, verify copy-back | Credentials match after round-trip |
| Policy enforcement | Boot VM, `vm.exec("curl https://blocked-domain.com")` | Request blocked by Gondolin policy |

### Quality Gates

```bash
pnpm --dir agent_vm test          # All unit + integration tests
pnpm --dir agent_vm test:e2e      # E2E tests (macOS only)
pnpm --dir agent_vm typecheck     # tsc --noEmit
pnpm --dir agent_vm lint          # biome check
pnpm --dir agent_vm build         # tsc -p tsconfig.json
```

## Implementation Phases

### Phase 1: Scaffold + Debian Image Pipeline

**Rationale**: Everything depends on having a bootable VM to test against.

- Scaffold `agent_vm` package: `package.json`, `tsconfig.json`, `vitest.config.ts`
- **Lock `@earendil-works/gondolin` to exact version** in `package.json` (no `^` or `~` — non-public API access requires version pinning)
- Set up biome for linting
- Implement `buildAssets()` wrapper with Debian OCI build config
- Verify: boot a VM from built assets, run `cat /etc/os-release` → Debian
- Add image cache at `~/.cache/agent-vm/images/`

### Phase 2: Config Layering + Workspace Identity

- Implement config resolver with three-tier precedence
- Implement additive allowlist merge
- Implement workspace identity (deterministic session naming from path)
- Implement workspace detection (pnpm/npm/pyproject monorepo scanning)
- Unit tests for all of the above

### Phase 3: Daemon + Session Control

- Implement daemon process model (fork on first run, connect on subsequent)
- Use Gondolin `registerSession()` / `findSession()` / `gcSessions()` for session discovery
- Use `SessionIpcServer` + `connectToSession()` for exec relay transport (binary framing, ID multiplexing)
- Add control channel (NDJSON) for policy/tunnel/lifecycle commands alongside exec channel
- **Design decision needed**: single-socket multiplexing (control + exec in one protocol) vs. dual-socket (separate control and exec channels). Dual-socket requires explicit coordination: idle timer vs. open exec sessions, policy reload vs. in-flight commands, shutdown sequencing. Single-socket is simpler but means custom framing instead of reusing `connectToSession()` directly.
- Client attach/detach accounting
- Idle timer state machine (10m default, configurable)
- Integration tests for daemon lifecycle

### Phase 4: VM Adapter + VFS Policy

- Implement Gondolin SDK adapter (`VM.create()` with config-driven options)
- Implement VFS stack: RealFSProvider + ReadonlyProvider(.git) + ShadowProvider
- Wire workspace detection → ShadowProvider hidden list
- Integration tests for VFS behavior

### Phase 5: Policy + Secrets

- Implement policy compiler (base + repo + local + toggles → allowedHosts[])
- Integrate `createHttpHooks()` with compiled policy
- Implement secret injection for API key env vars
- Implement toggle preset loading and `policy` CLI commands
- Unit + integration tests for policy compilation and runtime recreation behavior

### Phase 6: Tunnel Manager

- Implement tunnel manager with `openTcpStream()` uplink pooling
- Exponential backoff reconnect
- Health state tracking (healthy/degraded/unhealthy)
- Guest loopback bridge daemon (baked into image)
- `tunnels status` and `tunnels restart` CLI commands
- Integration tests with mocked streams; E2E with real postgres/redis

### Phase 7: Auth Strategy 1.B

- Implement macOS Keychain extraction for Claude OAuth
- Copy-in flow: host auth dirs → VM state paths via `vm.fs`
- Copy-back flow: VM state → staging → atomic rename to host
- Periodic copy-back (every 5 minutes)
- Crash recovery: stale lock detection, user warning
- Integration + E2E tests for auth round-trip

### Phase 8: CLI Polish + Parity Validation

- Wire `run-agent-vm` and `agent-vm-ctl` command trees
- Implement all agent launcher presets
- Add `daemon gc` (clean stale sessions, old image caches)
- Complete parity checklist against sidecar features
- Write operator docs (README.md, INSTRUCTIONS.md)
- Add smoke validation task: launch and control `agent_vm` from a fresh temporary repo directory
- Run full quality gates

### Phase 9: Architecture Documentation (Post-Implementation)

- Create [agent-vm-architecture.md](/Users/shravansunder/dev/ai-tools/docs/architecture/agent-vm-architecture.md)
- Include ASCII diagrams for:
  - control plane and daemon/session lifecycle,
  - data path (host Docker service -> tunnel manager -> guest loopback bridge -> app),
  - config/policy flow (`.base/.repo/.local`, preset toggles, generated state),
  - auth flow (`1.B` copy-in/copy-back + secret injection boundaries).
- Include side-by-side architecture and lifecycle comparison to `agent_sidecar`.
- Include operator troubleshooting for attach, idle shutdown, policy reload, and tunnel health.

## Dependency Graph

```text
Phase 1 (Image)
  │
  ├──→ Phase 2 (Config)
  │      │
  │      ├──→ Phase 3 (Daemon)
  │      │      │
  │      │      ├──→ Phase 4 (VM + VFS) ──→ Phase 5 (Policy) ──→ Phase 6 (Tunnels)
  │      │      │                                                       │
  │      │      └──→ Phase 7 (Auth 1.B) ◄──────────────────────────────┘
  │      │                                                              │
  │      └──────────────────────────────────────────────────────────────┘
  │                                                                     │
  └─────────────────────────────────────────────────────────────────→ Phase 8 (Polish) ──→ Phase 9 (Architecture Doc)
```

Phases 4-7 can partially overlap once Phase 3 is stable.

## Deferred Work

| Item | Why deferred | When to revisit |
|---|---|---|
| OAuth broker `1.C` | Complex: VFS placeholder injection + onResponse token interception + per-CLI format knowledge | After v1 is stable and OAuth copy-back proves insufficient |
| Docker-in-VM mode | Heavy (nested virtualization or Docker socket proxy) | If agents need to run their own containers |
| Linux host support | macOS-only for v1 (HVF acceleration) | When Linux KVM testing infra is available |
| Gondolin checkpoint/snapshot | Useful but not day-1 parity | After core features stabilize |
| Shell customization (p10k, atuin) | Nice-to-have, not parity-critical | Phase 8 polish or post-v1 |

## Appendix: Verified Gondolin SDK API Reference

All API details verified against Gondolin source code at `/Users/shravansunder/Documents/dev/open-source/vm/gondolin/host/src/`. Pin to exact version in `package.json` — these are internal class layouts, not guaranteed stable across releases.

### Public Exports (`@earendil-works/gondolin`)

| Export | Source | Category |
|---|---|---|
| `VM`, `VMOptions`, `VMState` | `vm/core.ts` | Core VM lifecycle |
| `ExecOptions`, `ExecResult`, `ExecProcess` | `exec.ts` | Command execution |
| `SandboxServer` | `sandbox/server.ts` | Low-level VM server (QEMU process) |
| `RealFSProvider` | `vfs/node.ts` | Host filesystem passthrough |
| `ReadonlyProvider` | `vfs/readonly.ts` | Read-only wrapper |
| `ShadowProvider`, `createShadowPathPredicate` | `vfs/shadow.ts` | Path hiding + write redirect |
| `MemoryProvider` | `vfs/node.ts` | In-memory VFS (tmpfs upper layer) |
| `createHttpHooks` | `http/hooks.ts` | Network policy + secret injection |
| `buildAssets`, `verifyAssets` | `build/index.ts` | Guest image build pipeline |
| `ensureGuestAssets`, `loadGuestAssets` | `assets.ts` | Asset cache management |
| `registerSession`, `unregisterSession` | `session-registry.ts` | Session metadata persistence |
| `listSessions`, `findSession`, `gcSessions` | `session-registry.ts` | Session discovery + cleanup |
| `SessionIpcServer`, `connectToSession` | `session-registry.ts` | Multiplexed exec relay over Unix socket |
| `IngressGateway` | `ingress.ts` | HTTP/HTTPS ingress routing |

### Non-Public APIs We Depend On

| API | Location | Risk | Mitigation |
|---|---|---|---|
| `SandboxServer.openTcpStream()` | `sandbox/server-ops.ts:341` | On `SandboxServerOps` mixin, publicly exported class, but accessed through VM's private `server` field | Pin version, test after upgrades, contribute upstream PR for `vm.openTcpStream()` |
| `VM.server` (private field) | `vm/core.ts:230` | Private, no public getter | Index access `(vm as any)["server"]`, or capture during construction |
| `SandboxServer.connect()` | `sandbox/server-ops.ts:83` | Required by `SessionIpcServer` constructor's `connectToSandbox` callback | Same risk as above — needs server reference |

### Key API Behaviors

**`openTcpStream()`**: Allocates a stream ID, sends `tcp_open` command over virtio-serial (SSH bridge channel), waits for guest acknowledgment with configurable timeout (default 5s). Returns Node.js `Duplex`. The stream bypasses guest network stack — no firewall rules apply, no TLS interception. This is the correct channel for service tunnels.

**`ShadowProvider`**: Predicate-based, not list-based. Evaluated on every VFS operation (readdir, stat, open). `writeMode: "tmpfs"` redirects writes to `MemoryProvider` — ephemeral, lost on restart. `denySymlinkBypass: true` prevents `ln -s hidden_path alias; cat alias` attacks (resolves symlinks before checking predicates).

**`vm.shell()`**: Wrapper around `vm.exec()` with `{ stdin: true, pty: true }`. Default shell: `/bin/bash -i`. The `attach` option auto-detects TTY — **always pass `attach: false`** in daemon context to prevent hijacking the daemon's own stdin.

**`SessionIpcServer`**: Manages per-client request ID namespaces. Each connected client gets independent ID space (external IDs remapped to internal IDs). Binary frames use `[type:u8][length:u32be][payload]` framing. JSON frames use `[length:u32be][payload]` framing. Client connections use `connectToSession()` which implements the complementary framing.

**`buildAssets()`**: Accepts `BuildConfig` (JSON-serializable). Supports `oci.image` for Debian rootfs. Outputs: kernel (vmlinuz-virt), initramfs (lz4-compressed cpio), rootfs (ext4). `postBuild.commands` run inside the container at build time. Cache keyed by config content hash.

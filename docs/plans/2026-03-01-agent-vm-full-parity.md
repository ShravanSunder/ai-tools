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
│  Gondolin SDK  (@earendil-works/gondolin, pinned)              │
│  VM.create() · vm.exec() · vm.close() · vm.fs                 │
│  createHttpHooks() · RealFSProvider · ReadonlyProvider         │
│  ShadowProvider · MemoryProvider · buildAssets()               │
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

Base profile: `agent_vm/config/build.base.json`

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

### What's baked into the image (build time)

| Category | Packages / Tools |
|---|---|
| Core | git, curl, wget, zsh, jq, unzip, ca-certificates |
| Python | python3, python3-venv, uv |
| Node | nodejs (24.x), pnpm (corepack), npm |
| Agent CLIs | claude, codex (@openai/codex), gemini (@google/gemini-cli) |
| Shell | zsh as default shell |
| Browser | chromium, xvfb (for Playwright headed mode) |

### Boot-time init (rootfsInitExtra)

Runs as root at VM boot, before any exec sessions:

```text
1. Start Xvfb (virtual display :99 for Playwright)
2. Set up /workspace symlink → VFS mount point
3. Create standard directories (/home/agent/.cache, /home/agent/.local)
4. Apply environment overrides from config
```

### First-exec init (daemon runs after VM.create())

Runs via `vm.exec()` as part of daemon startup, before accepting client connections:

```text
1. Detect workspace type (pnpm-workspace.yaml, package.json workspaces, pyproject.toml)
2. Install/sync dependencies:
   - pnpm install --frozen-lockfile (if pnpm workspace)
   - npm ci (if package-lock.json)
   - uv sync (if pyproject.toml)
3. Import shell history (if host history available via VFS)
4. Auth 1.B: copy credentials into VM state paths
```

### Shell environment

| Setting | Value | Notes |
|---|---|---|
| Shell | zsh | Default for all exec sessions |
| DISPLAY | `:99` | Xvfb virtual display |
| VIRTUAL_ENV | `/workspace/.venv` | If Python project detected |
| PNPM_STORE_DIR | `/home/agent/.local/share/pnpm` | Persistent in qcow2 |
| PATH | Includes `/home/agent/.local/bin` | For uv, pnpm global bins |

## Filesystem and Dependency Isolation

### VFS Mount Architecture

```text
Host filesystem (macOS)
  │
  ├── /Users/me/dev/my-project/          (repo root)
  │     ├── src/                          ─── RealFSProvider (rw) ──→ /workspace/src/
  │     ├── package.json                  ─── RealFSProvider (rw) ──→ /workspace/package.json
  │     ├── node_modules/                 ─── ShadowProvider ───────→ (hidden, empty)
  │     ├── .venv/                        ─── ShadowProvider ───────→ (hidden, empty)
  │     ├── .git/                         ─── ReadonlyProvider ─────→ /workspace/.git/ (ro)
  │     ├── .agent_vm/                    ─── ShadowProvider ───────→ (hidden, empty)
  │     └── dist/                         ─── ShadowProvider ───────→ (hidden, empty)
  │
  └── /Users/me/.claude/                  ─── (not mounted; 1.B copy-in/copy-back)

Guest VM filesystem (Linux, qcow2 overlay)
  │
  ├── /workspace/                          (VFS mount point)
  │     ├── src/                           (live from host via RealFSProvider)
  │     ├── package.json                   (live from host)
  │     ├── node_modules/                  (VM-owned, Linux-native, qcow2)
  │     ├── .venv/                         (VM-owned, Linux-native, qcow2)
  │     └── .git/                          (readonly from host)
  │
  ├── /home/agent/.claude/                 (1.B copy-in at session start)
  ├── /home/agent/.codex/                  (1.B copy-in at session start)
  ├── /home/agent/.gemini/                 (1.B copy-in at session start)
  └── /home/agent/.cache/                  (persistent in qcow2)
```

### VFS Provider Stack (Gondolin SDK)

```typescript
const vfs = {
  fuseMount: "/workspace",
  mounts: {
    "/workspace": new ShadowProvider(
      new RealFSProvider(repoRoot),
      {
        hidden: [
          "node_modules",
          ".venv",
          ".agent_vm",
          "dist",
          ".next",
          "__pycache__",
        ],
      }
    ),
    "/workspace/.git": new ReadonlyProvider(
      new RealFSProvider(path.join(repoRoot, ".git"))
    ),
  },
};
```

### Monorepo Workspace Detection

The daemon detects workspace packages at startup to know which directories to shadow:

| Signal | Detection | Shadow targets |
|---|---|---|
| `pnpm-workspace.yaml` | Parse `packages` globs | Root + each package's `node_modules/` |
| `package.json` workspaces | Parse `workspaces` field | Root + each package's `node_modules/` |
| `pyproject.toml` | Presence check | `.venv/` at repo root |

The `ShadowProvider` hidden list is dynamically built from detected workspace structure.

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

### Supported auth sources

| CLI | Host auth location | Keychain extraction | Env var fallback |
|---|---|---|---|
| Claude Code | `~/.claude/.credentials.json` | `security find-generic-password -s "Claude Code-credentials"` | `ANTHROPIC_API_KEY` |
| Codex | `~/.codex/auth.json` | No (file-based) | `CODEX_API_KEY`, `OPENAI_API_KEY` |
| Gemini | `~/.gemini/` | No (file-based) | `GEMINI_API_KEY`, `GOOGLE_API_KEY` |

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

### Tunnel Manager Lifecycle

The tunnel manager runs inside the daemon process (same Node.js process as VM lifecycle):

```text
Daemon starts VM
  → TunnelManager.start(vm, tunnelConfig)
  → For each service:
      → Open desiredUplinks guest streams via vm.openTcpStream()
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
| `policy.reload` | `{ type: "policy.reload" }` | Recompile allowlist and apply to VM. |
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
| `--full-reset` | Rebuild image assets + reset qcow2 overlay |
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
| `policy reload` | Recompile and apply policy |
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
| Policy reload | Compile policy, update toggles, reload, verify new allowlist | Hot-reload without VM restart |
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
- Unix socket listener with NDJSON protocol
- Client attach/detach accounting
- Idle timer state machine (10m default, configurable)
- Exec session relay (stdin/stdout/stderr streaming over socket)
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
- Unit + integration tests for policy compilation and hot-reload

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

# Agent VM Sidecar Requirements Specification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Define the complete `agent_vm` requirements baseline (from `agent_sidecar` parity + user decisions), document current system gaps, and lock a secure `zsh` + `atuin` design for VM sessions that does not expose host history to agent processes.

**Architecture:** `agent_vm` stays a TypeScript control plane (`cmd-ts`) over Gondolin SDK/CLI primitives, with host Docker services accessed through constrained TCP mappings (`tcp.hosts`) and host policy enforcement. Sidecar parity is implemented as behavior parity (DX, controls, safety), not Docker-script parity.

**Tech Stack:** TypeScript (`cmd-ts`, `zod` v4, `vitest`), Gondolin (`@earendil-works/gondolin`), Docker/OrbStack on macOS host, shell wrappers for entrypoint ergonomics.

---

## 1. Requirement Inventory (Source of Truth)

### 1.1 User-decided constraints

1. Host platform is macOS only.
2. Docker runs on host; VM accesses host services only through explicit `tcp.hosts` mappings.
3. Build a new project (`agent_vm`), not an in-place sidecar replacement.
4. Control plane is TypeScript CLI (`cmd-ts`) with shell wrappers only where needed.
5. Day-1 parity requirements:
   - Network policy allowlist control.
   - Multi-agent launch presets (Claude, Codex, Gemini, OpenCode, Cursor).
   - Per-repo config + persistence.
   - Service access to host PostgreSQL/Redis.
6. One command surface (`agent_vm.sh` entrypoint with subcommands), no legacy split command UX.
7. Keep root `.sh` in repo for PATH-based usage (sidecar-like ergonomics).
8. Host and VM dependency trees must not conflict (`node_modules`, `.venv` isolation).
9. Auth should not create massive per-session mirror copies and should not write back from VM to host.
10. `zsh` + `atuin` should feel like sidecar for interactive shell UX, but host history must not be copied directly and agent processes must not get that history surface.

### 1.2 Sidecar behaviors to preserve in spirit

1. Fast re-entry with persistent environment.
2. Strong host-side control plane (`sidecar-ctl` equivalent).
3. Repo-local customization (`.agent_sidecar` -> `.agent_vm`) with tiered overrides.
4. Safe defaults: readonly `.git`, blocked config dir, controlled network egress.
5. Opinionated interactive shell experience (`zsh`, plugins, history tooling).

---

## 2. Current System Walkthrough (What Exists Today)

### 2.1 `agent_sidecar` (baseline behavior)

1. Main launcher: [`agent_sidecar/run-agent-sidecar.sh`](/Users/shravansunder/dev/ai-tools/agent_sidecar/run-agent-sidecar.sh)
2. Host control script: [`agent_sidecar/sidecar-ctl.sh`](/Users/shravansunder/dev/ai-tools/agent_sidecar/sidecar-ctl.sh)
3. Three-tier config and additive extras:
   - [`agent_sidecar/sidecar.base.conf`](/Users/shravansunder/dev/ai-tools/agent_sidecar/sidecar.base.conf)
   - `.agent_sidecar/*.repo.*`, `.agent_sidecar/*.local.*`
4. Shell init:
   - Background: [`agent_sidecar/setup/init-background.base.sh`](/Users/shravansunder/dev/ai-tools/agent_sidecar/setup/init-background.base.sh)
   - Foreground: [`agent_sidecar/setup/init-foreground.base.sh`](/Users/shravansunder/dev/ai-tools/agent_sidecar/setup/init-foreground.base.sh)
   - zsh extras: [`agent_sidecar/setup/extra.base.zshrc`](/Users/shravansunder/dev/ai-tools/agent_sidecar/setup/extra.base.zshrc)
5. Docker image layers:
   - Base: [`agent_sidecar/node-py.base.dockerfile`](/Users/shravansunder/dev/ai-tools/agent_sidecar/node-py.base.dockerfile)
   - Overlay: [`agent_sidecar/node-py.overlay.dockerfile`](/Users/shravansunder/dev/ai-tools/agent_sidecar/node-py.overlay.dockerfile)
6. Sidecar currently mounts host `~/.config/atuin` and `~/.local/share/atuin` directly into container (read-write).

### 2.2 `agent_vm` implemented state

1. Single entrypoint shell wrapper:
   - [`agent_vm/agent_vm.sh`](/Users/shravansunder/dev/ai-tools/agent_vm/agent_vm.sh)
2. CLI architecture (`cmd-ts`):
   - [`agent_vm/src/features/cli/agent-vm.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/cli/agent-vm.ts)
   - subcommands `init`, `run`, `ctl`.
3. Daemonized runtime model with idle timeout and socket control:
   - [`agent_vm/src/features/runtime-control/session-daemon.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/session-daemon.ts)
   - [`agent_vm/src/features/runtime-control/run-orchestrator.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/run-orchestrator.ts)
4. Gondolin VM integration:
   - VFS + shadow + readonly + tcp mappings via [`agent_vm/src/core/infrastructure/vm-adapter.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/core/infrastructure/vm-adapter.ts)
5. Config layering:
   - Build config loader: [`agent_vm/src/features/runtime-control/build-config-loader.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/build-config-loader.ts)
   - Runtime loader: [`agent_vm/src/features/runtime-control/vm-runtime-loader.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/vm-runtime-loader.ts)
6. Base config defaults:
   - [`agent_vm/config/build.base.json`](/Users/shravansunder/dev/ai-tools/agent_vm/config/build.base.json)
   - [`agent_vm/config/vm-runtime.base.json`](/Users/shravansunder/dev/ai-tools/agent_vm/config/vm-runtime.base.json)
7. Auth model has already moved to readonly host mounts + cleanup of legacy mirror cache:
   - [`agent_vm/src/features/auth-proxy/auth-sync.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/auth-proxy/auth-sync.ts)

---

## 3. Parity + Gap Matrix

| Concern | Sidecar today | Agent VM today | Requirement target | Gap |
|---|---|---|---|---|
| Entry command UX | `run-agent-sidecar.sh` | `agent_vm.sh` + subcommands | Single root command, same ergonomics | Mostly done |
| Host control plane | `sidecar-ctl.sh` firewall/status | `agent_vm.sh ctl` status/policy/daemon | Comparable host control affordances | Partial (feature depth lower) |
| Config hierarchy | base/repo/local + additive extras | base + repo/local layered JSON/txt | Same mental model, explicit schemas | Mostly done |
| Network allowlist | iptables/dnsmasq + toggle files | Gondolin `createHttpHooks` allowlist + policy files | Host-enforced deny by default | Done (different mechanism) |
| Host service access | Docker-local direct access in container net namespace | Gondolin `tcp.hosts` mappings | Controlled access to specific host targets only | Done for mapping path |
| Multi-agent presets | run-claude/codex/gemini/opencode/cursor | same presets in run CLI | Full parity | Done |
| `.git` safety | readonly bind mount | readonly VFS mount + shadowing | readonly and non-writable | Done |
| Host `node_modules` / `.venv` conflict | Docker volumes shadow host dirs | tmpfs shadow + dedicated volume mounts | VM-only Linux deps with host protection | Done |
| Persistence | Docker named volumes | host-side volume dirs + `rootfsMode: cow` | Persistent per-workspace state | Done (no checkpoint workflow yet) |
| Auth handling | host mounts + keychain export, writable | readonly host mounts, no write-back | no per-session mirror copies, no copy-back | Done |
| Shell default | `zsh` default entry | currently interactive `/bin/sh` attach path | `zsh` parity default | Missing |
| Atuin behavior | host atuin dirs mounted directly | one-time copy helper exists, no full runtime wiring | sidecar-like UX without host history exposure | Missing |
| Init hooks | base foreground/background init scripts | config supports scripts but defaults null | robust boot + shell setup hooks | Missing defaults |
| Test pyramid | shell + runtime checks, not formalized | unit/integration/e2e projects in vitest | enforce coverage of parity-critical paths | Partial |

---

## 4. Research Findings For `zsh` + `atuin` in Gondolin VM

### 4.1 Gondolin capabilities we can rely on

1. OCI rootfs with Debian userspace is supported through `oci.image` while boot stack remains Alpine-based.  
   Source: [`gondolin/docs/custom-images.md`](/Users/shravansunder/Documents/dev/open-source/vm/gondolin/docs/custom-images.md)
2. VFS layering supports `RealFSProvider`, `ReadonlyProvider`, and `ShadowProvider` with `writeMode: "tmpfs"` for hidden writable overlays.  
   Source: [`gondolin/docs/vfs.md`](/Users/shravansunder/Documents/dev/open-source/vm/gondolin/docs/vfs.md)
3. `postBuild.commands` and `init.rootfsInitExtra` are first-class build config hooks for provisioning and startup behavior.  
   Source: [`gondolin/docs/custom-images.md`](/Users/shravansunder/Documents/dev/open-source/vm/gondolin/docs/custom-images.md)
4. Network policy and secret substitution are host-mediated (`createHttpHooks`, allowed hosts, secret placeholders), which aligns with keeping sensitive material off guest-visible env values.  
   Source: [`gondolin/docs/sdk-network.md`](/Users/shravansunder/Documents/dev/open-source/vm/gondolin/docs/sdk-network.md), [`gondolin/docs/secrets.md`](/Users/shravansunder/Documents/dev/open-source/vm/gondolin/docs/secrets.md)

### 4.2 Hard requirement interpretation for history safety

1. Do not copy host atuin DB/history into VM automatically.
2. Do not mount host atuin config/data into VM.
3. Keep shell-history data VM-scoped and workspace-scoped.
4. Ensure agent-run presets cannot read operator shell history.

### 4.3 Target design for isolation

```text
Host terminal
  -> agent_vm.sh run
      -> daemon + VM
      -> interactive attach as user: operator (zsh + atuin enabled)
           HOME=/home/operator
           ATUIN_DB=/volumes/shell-history/atuin.db

Agent preset launch (--run-claude/codex/...)
  -> daemon vm.exec as user: agent (non-interactive shell)
       HOME=/home/agent
       no atuin config/data mounted
       cannot read /home/operator (0700)
```

Rules:
1. `operator` and `agent` are separate Linux users in guest image.
2. `atuin` is configured only for `operator`.
3. Shell history volume is mounted at operator-only path with restrictive permissions.
4. No host `~/.config/atuin` or host `~/.local/share/atuin` mount.
5. Optional explicit one-time import command can exist later, but default is no import.

---

## 5. What Is Missing Right Now

1. Interactive shell launches `/bin/sh`, not `zsh`.  
   Evidence: [`run-orchestrator.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/run-orchestrator.ts)
2. Runtime defaults do not supply background/foreground init scripts.  
   Evidence: [`vm-runtime.base.json`](/Users/shravansunder/dev/ai-tools/agent_vm/config/vm-runtime.base.json)
3. Atuin helper currently copies host atuin directories into VM volume on first run, which violates “no direct host history copy” target.  
   Evidence: [`shell-setup.ts`](/Users/shravansunder/dev/ai-tools/agent_vm/src/features/runtime-control/shell-setup.ts)
4. Image provisioning does not yet guarantee zsh/atuin/plugin stack parity equivalent to sidecar UX.
5. No explicit user-separation model (`operator` vs `agent`) is implemented yet.

---

## 6. Execution Tasks (TDD-first, implementation-ready)

### Task 1: Lock requirement tests before code changes

**Files:**
- Create: `agent_vm/tests/e2e/shell-parity.e2e.test.ts`
- Create: `agent_vm/tests/e2e/history-isolation.e2e.test.ts`
- Modify: `agent_vm/package.json` (if command grouping needed)

**Step 1: Write failing shell parity e2e tests**

1. `agent_vm.sh run` opens interactive `zsh` shell.
2. `echo $SHELL` indicates zsh path for interactive mode.
3. `.zshrc` customizations are loaded.

**Step 2: Write failing history isolation e2e tests**

1. No host atuin directory mounts are present in VM.
2. Agent preset process cannot read operator atuin data path.
3. Operator shell can use atuin command successfully.

**Step 3: Run e2e project to confirm failures**

Run: `pnpm --dir agent_vm test:e2e`

### Task 2: Implement guest user split and shell mode separation

**Files:**
- Modify: `agent_vm/config/build.base.json`
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/agent-launcher.ts`
- Modify: `agent_vm/src/core/infrastructure/vm-adapter.ts`

**Step 1: Add image-level setup hooks to create `operator` + `agent` users and install `zsh` + `atuin`**

Use `postBuild.commands` and/or image customization script referenced by build config.

**Step 2: Route interactive attach to operator login shell**

Default `run` path should attach as operator with zsh.

**Step 3: Route preset commands to agent user non-interactive shell**

Keep command presets non-interactive and separate from operator home.

**Step 4: Validate permissions and HOME boundaries**

Operator home 0700; agent cannot access operator history/config.

### Task 3: Replace host-history copy behavior with VM-local history behavior

**Files:**
- Modify: `agent_vm/src/features/runtime-control/shell-setup.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/shell-setup.unit.test.ts`

**Step 1: Remove implicit host atuin directory copy**

No default copying of host history/config into VM-local volume.

**Step 2: Initialize VM-local atuin storage**

Create operator-owned location in mounted shell-history volume.

**Step 3: Add tests for first-run initialization idempotency**

Ensure deterministic setup without host dependency.

### Task 4: Wire foreground/background init scripts for sidecar-style shell readiness

**Files:**
- Modify: `agent_vm/config/vm-runtime.base.json`
- Create: `agent_vm/setup/init-foreground.base.sh`
- Create: `agent_vm/setup/init-background.base.sh`
- Create: `agent_vm/setup/extra.base.zshrc`
- Modify: `agent_vm/src/features/runtime-control/vm-runtime-loader.ts`

**Step 1: Add base init scripts and zsh extras under `agent_vm/setup/`**

Mirror sidecar behavior in spirit (boot sync + shell readiness) without host history mounts.

**Step 2: Point base runtime config to those scripts**

Use relative script paths resolved through loader safeguards.

**Step 3: Add integration tests proving init scripts run**

Add assertions in daemon integration tests.

### Task 5: Expand parity matrix validation in automated tests + manual tmp checks

**Files:**
- Modify: `agent_vm/tests/e2e/tcp-hosts-docker.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/smoke.e2e.test.ts`

**Step 1: Keep docker-backed PG/Redis e2e as explicit `test:e2e` only**

Hard-fail only in e2e lane, not unit/integration lanes.

**Step 2: Add manual reproducibility script for tmp workspace**

Document exact steps:
1. Init temp repo.
2. Start host postgres/redis docker containers.
3. Run `agent_vm.sh init --default`, `agent_vm.sh run --no-run`.
4. Validate `pg.vm.host` and `redis.vm.host` connectivity from VM.
5. Validate shell parity and history isolation.

---

## 7. Acceptance Matrix (Done Criteria)

| Requirement | Pass criteria |
|---|---|
| Single-command UX | `agent_vm.sh init|run|ctl` is the only supported command surface |
| Sidecar-like shell | Default `run` drops into zsh interactive shell with configured prompt/plugins |
| History safety | No host atuin mounts/copies by default; VM-local history only |
| Agent isolation | Preset agent commands cannot read operator shell history |
| Host service connectivity | PG/Redis mapping works against host Docker services in e2e |
| Policy safety | Host allowlist deny-by-default enforced; updates reload correctly |
| Config model | base/repo/local behavior deterministic and schema-validated |
| Test pyramid | unit + integration + e2e pass via `pnpm --dir agent_vm check` |

---

## 8. Notes on Design Intent

1. This plan preserves sidecar DX and control intent while intentionally diverging from sidecar’s direct host-history mount behavior.
2. Security boundary is stronger than sidecar for history/auth surfaces.
3. Gondolin-native features are preferred over emulating Docker plumbing when both solve the same problem.

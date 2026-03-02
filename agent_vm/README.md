# Agent VM

`agent_vm` is a Gondolin-based VM control plane that mirrors key `agent_sidecar` affordances while using a VM sandbox.

## Config Contract

`agent_vm` uses only these user-editable config files:

- `.agent_vm/build.project.json`
- `.agent_vm/vm-runtime.repo.json`
- `.agent_vm/vm-runtime.local.json` (optional, gitignored)
- `.agent_vm/policy-allowlist-extra.repo.txt`
- `.agent_vm/policy-allowlist-extra.local.txt` (optional, gitignored)

Hard cutover: `tcp-services.*.json` is unsupported.

## Commands

- `agent_vm.sh init --default`
- `agent_vm.sh run --no-run`
- `agent_vm.sh run --reload`
- `agent_vm.sh run --full-reset`
- `agent_vm.sh run --run-codex`
- `agent_vm.sh run --run-claude`
- `agent_vm.sh run --run "<command>"`
- `agent_vm.sh ctl status --work-dir <repo>`
- `agent_vm.sh ctl policy allow --target linear --work-dir <repo>`
- `agent_vm.sh ctl daemon stop --work-dir <repo>`

## C+ Image Architecture

- Optional OCI overlay build from `build.project.json.ociOverlay` (Docker/OrbStack)
- Global content-addressed guest asset cache:
  - `~/.cache/agent-vm/images/by-fingerprint/<fingerprint>/...`
  - `~/.cache/agent-vm/images/workspaces/<workspace-hash>.json`
- Identical build inputs across repos reuse one image directory

## Repo Setup

Run from your target repository root:

```bash
/Users/shravansunder/dev/ai-tools/agent_vm/agent_vm.sh init --default
```

This creates `.agent_vm/` with repo/local config separation.

## Host Prerequisites

Use the project bootstrap so host tooling is reproducible:

```bash
/Users/shravansunder/dev/ai-tools/agent_vm/bootstrap.sh
```

`bootstrap.sh` installs formulas from [`Brewfile`](/Users/shravansunder/dev/ai-tools/agent_vm/Brewfile) (including `e2fsprogs` for `mke2fs`) and then builds `agent_vm`.

## Test Pyramid

- Unit: colocated `src/**/*.unit.test.ts`
- Integration: `tests/*.integration.test.ts`
- E2E smoke (compiled CLI binary + live Unix socket): `tests/e2e/*.e2e.test.ts`

Run all gates:

```bash
pnpm --dir agent_vm check
```

## Policy Runtime Behavior

Gondolin network hooks are fixed at VM creation time. `agent_vm.sh ctl policy ...` recompiles policy and then recreates the VM runtime so new allowlist entries are actually enforced.

## Architecture Doc

- [`docs/architecture/agent-vm-architecture.md`](/Users/shravansunder/dev/ai-tools/agent_vm/docs/architecture/agent-vm-architecture.md)

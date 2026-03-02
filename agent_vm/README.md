# Agent VM

`agent_vm` is a Gondolin-based VM control plane that mirrors key `agent_sidecar` affordances while using a VM sandbox.

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

- Unit: `tests/unit`
- Integration: `tests/integration`
- E2E smoke (compiled CLI binary + live Unix socket): `tests/e2e`

Run all gates:

```bash
pnpm --dir agent_vm check
```

## Policy Runtime Behavior

Gondolin network hooks are fixed at VM creation time. `agent_vm.sh ctl policy ...` recompiles policy and then recreates the VM runtime so new allowlist entries are actually enforced.

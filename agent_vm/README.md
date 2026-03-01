# Agent VM

`agent_vm` is a Gondolin-based VM control plane that mirrors key `agent_sidecar` affordances while using a VM sandbox.

## Commands

- `run-agent-vm --no-run`
- `run-agent-vm --reload`
- `run-agent-vm --full-reset`
- `run-agent-vm --run-codex`
- `run-agent-vm --run-claude`
- `run-agent-vm --run "<command>"`
- `agent-vm-ctl status --work-dir <repo>`
- `agent-vm-ctl policy allow --target linear --work-dir <repo>`
- `agent-vm-ctl daemon stop --work-dir <repo>`

## Repo Setup

Run from your target repository root:

```bash
/Users/shravansunder/dev/ai-tools/agent_vm/init_repo_vm.sh
```

This creates `.agent_vm/` with repo/local config separation.

## Test Pyramid

- Unit: `tests/unit`
- Integration: `tests/integration`
- E2E smoke (compiled CLI binary + live Unix socket): `tests/e2e`

Run all gates:

```bash
pnpm --dir agent_vm check
```

## Policy Runtime Behavior

Gondolin network hooks are fixed at VM creation time. `agent-vm-ctl policy ...` recompiles policy and then recreates the VM runtime so new allowlist entries are actually enforced.

# Agent VM Operator Notes

## Purpose

`agent_vm` provides a VM-based alternative to sidecar containers with parity-focused controls.

## Key Behaviors

- TypeScript CLI and daemon (`cmd-ts`)
- Single entrypoint wrapper: `agent_vm.sh` (`init`, `run`, `ctl` subcommands)
- Per-workspace daemon with Unix socket attach model
- 10-minute idle shutdown only when no clients are attached
- Policy compilation from base + repo + local + toggles (policy changes trigger VM runtime recreation)
- Host Docker services mapped via Gondolin tcp.hosts with synthetic DNS hostnames (e.g. pg.vm.host, redis.vm.host)
- Host OAuth directories mounted readonly into VM (no copy-back)

## Essential Paths

- Plans:
  - `agent_vm/docs/plans/2026-03-01-agent-vm-config-surface-design.md`
  - `agent_vm/docs/plans/2026-03-01-agent-vm-config-implementation.md`
- Architecture: `docs/architecture/agent-vm-architecture.md`
- Base runtime config: `agent_vm/config/vm-runtime.base.json`
- Base build config: `agent_vm/config/build.base.json`

## Quick Verify

```bash
pnpm --dir agent_vm typecheck
pnpm --dir agent_vm test
pnpm --dir agent_vm test:e2e
pnpm --dir agent_vm lint
pnpm --dir agent_vm build
```

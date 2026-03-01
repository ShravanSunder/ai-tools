# Agent VM Operator Notes

## Purpose

`agent_vm` provides a VM-based alternative to sidecar containers with parity-focused controls.

## Key Behaviors

- TypeScript CLI and daemon (`cmd-ts`)
- Per-workspace daemon with Unix socket attach model
- 10-minute idle shutdown only when no clients are attached
- Policy compilation from base + repo + local + toggles (policy changes trigger VM runtime recreation)
- Host Docker services mapped via Gondolin tcp.hosts with synthetic DNS hostnames (e.g. pg.vm.host, redis.vm.host)
- OAuth mode `1.B` using session mirror copy-in/copy-back

## Essential Paths

- Plan: `docs/plans/2026-03-01-agent-vm-full-parity.md`
- Architecture: `docs/architecture/agent-vm-architecture.md`
- Base config: `agent_vm/config/vm.base.conf`
- Debian build profile: `agent_vm/config/build.debian.json`

## Quick Verify

```bash
pnpm --dir agent_vm typecheck
pnpm --dir agent_vm test
pnpm --dir agent_vm test:e2e
pnpm --dir agent_vm lint
pnpm --dir agent_vm build
```

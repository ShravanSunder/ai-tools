# Agent VM Architecture

## Overview

`agent_vm` is a macOS-hosted TypeScript control plane that runs coding agents inside Gondolin VMs, with host Docker service tunnels and policy controls.

## System Diagram

```text
┌────────────────────────────────────────────────────────────────┐
│ run-agent-vm / agent-vm-ctl (cmd-ts)                          │
├────────────────────────────────────────────────────────────────┤
│ Agent VM Daemon (per workspace, Unix socket)                  │
│  - VM lifecycle                                                │
│  - Policy compiler + toggles                                  │
│  - Tunnel manager                                              │
│  - Auth sync manager (1.B)                                    │
│  - Attach/session accounting + idle timer                      │
├────────────────────────────────────────────────────────────────┤
│ Gondolin VM                                                    │
│  - Agent CLIs                                                  │
│  - Guest loopback bridge                                       │
│  - Linux-native deps                                           │
├────────────────────────────────────────────────────────────────┤
│ Host Docker / OrbStack                                         │
│  - PostgreSQL :5432                                            │
│  - Redis :6379                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Tunnel Data Path

```text
VM app client                Agent VM daemon                    Host Docker
--------------               -----------------                  -----------
127.0.0.1:15432  ->  guest uplink stream  ->  127.0.0.1:5432 (postgres)
127.0.0.1:16379  ->  guest uplink stream  ->  127.0.0.1:6379 (redis)
```

## Config and Policy Flow

```text
agent_vm/config/policy-allowlist.base.txt
+ .agent_vm/policy-allowlist-extra.repo.txt
+ .agent_vm/policy-allowlist-extra.local.txt
+ .agent_vm/.generated/policy-toggle.entries.txt
= .agent_vm/.generated/policy-allowlist.compiled.txt
= allowedHosts[] for Gondolin http hooks
```

## Auth Flow (1.B)

```text
Host auth dirs (~/.claude ~/.codex ~/.gemini)
  -> copy-in to session mirror (~/.cache/agent-vm/auth/<session>)
  -> VM session reads/writes mirrored auth state
  -> copy-back on daemon shutdown (atomic replace, no periodic sync)
```

## Daemon Attach and Idle Lifecycle

```text
Client connects -> client_count++ -> cancel idle timer
Client disconnects -> client_count--
When client_count == 0 -> start 10m timer
If timer fires and count still 0 -> stop tunnels -> stop VM -> exit daemon
```

## Sidecar Comparison

| Concern | sidecar | agent_vm |
|---|---|---|
| Isolation | Docker container | Gondolin VM |
| Control plane | Shell scripts | TypeScript daemon + CLI |
| Policy engine | iptables/dnsmasq | allowedHosts http hook policy |
| Service access | container networking | host Docker tunnel bridge |
| OAuth handling | direct host mounts | 1.B copy-in/copy-back mirror |
| Dependency separation | named volume shadows | VM-owned Linux deps + hidden host dirs |
| Multi-terminal | `docker exec` | daemon socket attach model |
| Idle cleanup | manual/restart policies | automatic 10m idle shutdown |

## Troubleshooting

- `run-agent-vm` reports unreachable socket:
  Use `run-agent-vm --reload` to force daemon recycle and stale-socket cleanup.
- `agent-vm-ctl policy ...` appears to interrupt commands:
  Expected. Policy updates recreate VM runtime because Gondolin hook allowlists are fixed at VM creation.
- Tunnel status stays degraded:
  Confirm host Docker service is up on `127.0.0.1` and run `agent-vm-ctl tunnels restart --service postgres|redis`.
- OAuth changes not visible on host immediately:
  `1.B` sync writes back only on daemon shutdown or idle timeout.

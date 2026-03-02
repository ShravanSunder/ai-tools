# Agent VM Architecture

## System Topology

```text
agent_vm.sh
  -> agent-vm CLI (cmd-ts)
      -> run-orchestrator
          -> session-daemon (per workspace, unix socket, idle shutdown)
              -> VM adapter
                  -> Gondolin VM.create(...)
                      -> HTTP policy hooks (allowlist + secrets)
                      -> TCP mappings (tcp.hosts)
                      -> VFS mounts (readonly, shadow, volumes)
```

## Config Surface (Hard Cutover)

```text
.agent_vm/build.project.json           # build-layer config (OCI + optional overlay recipe)
.agent_vm/vm-runtime.repo.json         # repo runtime config
.agent_vm/vm-runtime.local.json        # local runtime overrides (gitignored)
.agent_vm/policy-allowlist-extra.repo.txt
.agent_vm/policy-allowlist-extra.local.txt
```

Unsupported:

```text
tcp-services.repo.json
tcp-services.local.json
```

## C+ Image Flow

```text
build.project.json
  -> optional ociOverlay docker build (local tag + image digest)
  -> effective Gondolin build config
  -> fingerprint(config + overlayDigest + gondolinVersion + schemaVersion)
  -> ~/.cache/agent-vm/images/by-fingerprint/<fingerprint>/
       manifest.json
       rootfs.ext4
       initramfs.cpio.lz4
       vmlinuz-virt

workspace reference:
  ~/.cache/agent-vm/images/workspaces/<workspace-hash>.json
    { fingerprint, imagePath, updatedAtEpochMs }
```

## Runtime Session Model

```text
Terminal 1: agent_vm.sh run --run-claude
  -> starts daemon if absent
  -> daemon owns VM lifetime
  -> streams attach output back to terminal

Terminal 2: agent_vm.sh run
  -> attaches to same daemon session

When last client disconnects:
  -> idle timer starts (default 10 min)
  -> timer fires -> daemon stops VM and exits
```

## Sidecar vs Agent VM

```text
+----------------------+-----------------------------+-----------------------------------------+
| Concern              | agent_sidecar (Docker)      | agent_vm (Gondolin VM)                  |
+----------------------+-----------------------------+-----------------------------------------+
| Isolation            | Container (shared kernel)   | QEMU VM (separate kernel boundary)      |
| Network allowlist    | iptables + dnsmasq          | HTTP hooks allowlist + host mediation   |
| Host services        | container networking         | explicit tcp.hosts mapping only         |
| Config surface       | many .conf/.txt scripts     | 2 JSON + policy TXT                     |
| Auth handling        | mounted dirs                | readonly mounted dirs, no write-back    |
| Persistence          | Docker named volumes        | host volume dirs + rootfs cow           |
| Build reuse          | Docker layer cache          | OCI overlay + global fingerprint cache  |
| Control plane        | shell scripts               | TypeScript daemon + CLI                 |
+----------------------+-----------------------------+-----------------------------------------+
```

## Security Model Highlights

1. HTTP egress is deny-by-default unless allowlisted.
2. TCP egress is explicit through runtime config mappings and strict target validation.
3. `.git` is mounted readonly.
4. `.agent_vm` and host dependency dirs are shadowed from normal workspace access.
5. Host OAuth directories are readonly mounts with no sync-back behavior.

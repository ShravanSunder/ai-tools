# Migrate tunnel subsystem to Gondolin tcp.hosts

Replace the custom host-side tunnel pool with Gondolin's first-class mapped TCP support (PR #61). The guest connects to logical hostnames via synthetic DNS; Gondolin routes TCP at the QEMU network layer to host-local Docker-published services.

## Context

The current tunnel subsystem (`tunnel-manager.ts`, `tunnel-config.ts`) implements a host-side socket pool that forwards guest traffic to upstream services. It was never fully operational because the guest-side relay (listener inside the VM that bridges uplink ports to client ports) was never implemented. Gondolin's `tcp.hosts` feature replaces the entire subsystem with a declarative hostname-to-upstream mapping at the QEMU network level, requiring zero guest-side plumbing.

## Gondolin dependency

Pin `@earendil-works/gondolin` to the Git SHA of PR #61's merge commit. The feature is merged to main but not yet released to npm (latest npm release is 0.5.0, which predates PR #61).

```json
"@earendil-works/gondolin": "github:earendil-works/gondolin#<sha>"
```

## Architecture

```
run-agent-vm / agent-vm-ctl
        |
        v
agent_vm daemon (session + policy + auth)
        |
        +-> validate tcp mapping policy (strict mode)
        |
        v
VM.create({
  dns: { mode: "synthetic", syntheticHostMapping: "per-host" },
  tcp: { hosts: { "pg.vm.host:5432": "127.0.0.1:15432", ... } },
  httpHooks: { allowedHosts, secrets }
})
        |
        v
Gondolin QEMU userspace network backend (mapped TCP path)
        |
        v
Host Docker published services (Postgres / Redis / etc.)
```

No host-side proxy process. Gondolin IS the forwarder. The daemon remains for session lifecycle, policy, auth sync, and CLI attach.

### Data path (Postgres example)

```
ORM in VM -> pg.vm.host:5432
          -> synthetic DNS resolves to synthetic IP
          -> QEMU intercepts TCP SYN
          -> tcp.hosts exact match: pg.vm.host:5432
          -> host connect 127.0.0.1:15432
          -> Docker-published Postgres
```

## Security model

Gondolin VMs use QEMU user-mode networking. The guest has no direct network interface. All traffic routes through QEMU's virtual stack where Gondolin controls every path:

| Traffic type         | Gate                                  | Default                               |
| -------------------- | ------------------------------------- | ------------------------------------- |
| HTTP/HTTPS           | `httpHooks` allowlist                 | Blocked unless host in `allowedHosts` |
| DNS                  | Synthetic DNS                         | Only resolves configured hostnames    |
| TCP to mapped host   | `tcp.hosts`                           | Routed to configured upstream only    |
| TCP to unmapped host | DNS fails                             | Blocked (hostname does not resolve)   |
| Raw IP TCP           | `resolveMappedTcpTarget` returns null | Blocked (no route)                    |

### Strict mode (default: enabled)

Pre-boot validation enforces that all upstream targets point to `127.0.0.1` or `localhost` only. This prevents misconfiguration where a mapping accidentally targets an external host. An explicit config flag (`strictMode: false`) opts out for advanced use cases.

Validation runs before `VM.create()`. Startup fails hard with a descriptive error if any mapping violates the policy.

## Guest naming convention

All mapped services use `*.vm.host` hostnames:

| Service  | Guest hostname  | Guest port | Standard env var                           |
| -------- | --------------- | ---------- | ------------------------------------------ |
| Postgres | `pg.vm.host`    | 5432       | `PGHOST=pg.vm.host PGPORT=5432`            |
| Redis    | `redis.vm.host` | 6379       | `REDIS_HOST=redis.vm.host REDIS_PORT=6379` |

Guest applications use standard ports (5432, 6379) with logical hostnames. The upstream port (host-side Docker published port) is configured separately and defaults to 15432/16379 to avoid conflicts with host-native services.

## Config model

### Schema (Zod)

```typescript
const TcpServiceEntrySchema = z.object({
	guestHostname: z.string(),
	guestPort: z.number().int().min(1).max(65535),
	upstreamTarget: z.string(), // "host:port" format
	enabled: z.boolean().default(true),
});

const TcpServiceMapSchema = z.object({
	services: z.record(z.string(), TcpServiceEntrySchema),
	strictMode: z.boolean().default(true),
	allowedTargetHosts: z.array(z.string()).default(['127.0.0.1', 'localhost']),
});
```

### Defaults

```json
{
	"services": {
		"postgres": {
			"guestHostname": "pg.vm.host",
			"guestPort": 5432,
			"upstreamTarget": "127.0.0.1:15432",
			"enabled": true
		},
		"redis": {
			"guestHostname": "redis.vm.host",
			"guestPort": 6379,
			"upstreamTarget": "127.0.0.1:16379",
			"enabled": true
		}
	},
	"strictMode": true,
	"allowedTargetHosts": ["127.0.0.1", "localhost"]
}
```

Config hierarchy applies: local > repo > base. Users override upstream targets (e.g., change PG port) or add new services via config files.

## VM creation changes

### vm-adapter.ts

Build `tcp.hosts` from resolved config and pass to `VM.create()`:

```typescript
const tcpHosts: Record<string, string> = {};
for (const entry of Object.values(tcpConfig.services)) {
	if (!entry.enabled) continue;
	tcpHosts[`${entry.guestHostname}:${entry.guestPort}`] = entry.upstreamTarget;
}

const vm = await gondolinModule.createVm({
	// ...existing options (sessionLabel, env, httpHooks, vfs)
	dns: { mode: 'synthetic', syntheticHostMapping: 'per-host' },
	tcp: { hosts: tcpHosts },
});
```

### Environment variable changes

```typescript
env: {
  PGHOST: 'pg.vm.host',
  PGPORT: '5432',
  REDIS_HOST: 'redis.vm.host',
  REDIS_PORT: '6379',
  REDIS_URL: 'redis://redis.vm.host:6379/0',
  // HOME, WORKSPACE, PWD, auth vars unchanged
}
```

## Deletions

| Target                                | Scope                       | Lines |
| ------------------------------------- | --------------------------- | ----- |
| `tunnel-manager.ts`                   | Entire file                 | ~281  |
| `tunnel-config.ts`                    | Entire file                 | ~118  |
| `tunnel-config.unit.test.ts`          | Entire file                 | tests |
| `bridge-tunnel.integration.test.ts`   | Entire file                 | tests |
| `GuestLoopbackStreamOpener`           | Interface in vm-adapter.ts  | ~5    |
| `resolveLoopbackStreamOpener()`       | Function in vm-adapter.ts   | ~20   |
| `GondolinVmWithPrivateLoopback`       | Type in vm-adapter.ts       | ~5    |
| `LoopbackStreamOpener`                | Interface in vm-adapter.ts  | ~3    |
| `openGuestLoopbackStream()`           | Method on GondolinVmRuntime | ~20   |
| `TunnelConfig`, `TunnelServiceConfig` | Types in config.ts          | ~15   |
| `tunnel.restart` IPC command          | DaemonRequest union member  | ~5    |
| `tunnels` DaemonStatus field          | DaemonResponse              | ~3    |
| Tunnel lifecycle methods              | session-daemon.ts           | ~40   |

Estimated: ~580 lines deleted, ~80 lines added.

## IPC changes

- Remove `tunnel.restart` from `DaemonRequest` discriminated union
- Remove `tunnels` from `DaemonStatus`
- Add `tcpServices` field to `DaemonStatus` showing resolved mappings (service name, guest hostname, upstream target, enabled)

## Testing

### Unit tests

- `TcpServiceMapSchema` validation: defaults, overrides, missing fields
- Strict mode: localhost passes, remote host rejected, opt-out works
- Pre-boot validation: valid mappings pass, invalid fail with descriptive error
- `tcp.hosts` record construction from config entries

### Integration tests

- Update `runtime-control-daemon.integration.test.ts` to remove tunnel references
- Add tcp config validation to daemon startup tests

### E2E test

- VM boots with tcp.hosts
- Guest resolves `pg.vm.host` via synthetic DNS
- Guest connects to PG through mapped path
- Verify data round-trip (INSERT + SELECT)

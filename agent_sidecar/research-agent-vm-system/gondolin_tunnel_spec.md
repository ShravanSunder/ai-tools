# Implementation Specification
## Host-managed loopback tunnels for PostgreSQL and Redis in Gondolin VMs on macOS with OrbStack

Version: 1.0  
Prepared: 2026-02-28  
Status: Implementation-ready design  
Audience: engineers or coding agents implementing the tunnel system and image build

---

## 1. Executive summary

This specification describes how to give processes inside a Gondolin VM normal TCP access to PostgreSQL and Redis that run on the macOS host through Docker or OrbStack, **without** weakening Gondolin's default network confinement model.

The design does **not** use the guest VM's normal network interface for PostgreSQL or Redis. That path is not suitable because Gondolin does not provide a generic NAT, it classifies outbound TCP flows, and it only forwards HTTP, TLS, and optionally allowlisted SSH. Arbitrary TCP protocols are blocked, and HTTP `CONNECT` is explicitly denied. [R1][R2][R5]

Instead, this design uses a **host-managed backchannel**:

1. The host process exposes exactly the host resources that should be reachable (`127.0.0.1:5432` for PostgreSQL and `127.0.0.1:6379` for Redis, or equivalent host targets).
2. A **guest loopback bridge daemon** is baked into the image and listens only on `127.0.0.1` inside the VM.
3. A **Host Tunnel Manager** opens host-to-guest backchannel streams to guest loopback and binds them to the host PostgreSQL and Redis sockets.
4. Application code inside the VM uses normal connection strings such as `postgres://127.0.0.1:15432/...` and `redis://127.0.0.1:16379/0`.

The result is a system where:

- the agent can use normal app stacks inside the VM (TypeScript + Sequelize, Python + SQLAlchemy, Redis clients, test runners, migrations, debuggers),
- Gondolin still blocks arbitrary guest TCP egress on the guest NIC, and
- the host grants only the exact loopback resources required by the playground. [R1][R2][R6]

### Decision

This specification defines two implementation modes:

- **Preferred mode:** a small local integration wrapper exposes `SandboxServer.openTcpStream()` from the host integration layer. The security docs describe this API, but the public `VM` SDK docs do not currently document a `vm.openTcpStream()` method. Therefore the implementation **must** pin a Gondolin revision and expose this capability through a local wrapper or fork before using the preferred mode. [R2][R4][R5]
- **Fallback mode:** use the documented `vm.exec(...).attach(...)` stream path instead of `openTcpStream()`. This is fully documented, but it is less ergonomic because a long-running `vm.exec()` blocks additional exec requests in the current design. [R4][R5]

The remainder of this specification is written around the **preferred mode**, with the fallback mode defined in a dedicated later section.

---

## 2. Validated platform facts and implications

| Validated fact | Source | Implementation implication |
| --- | --- | --- |
| Gondolin does not provide a generic NAT to the host network; it mediates traffic in a host userspace stack. | [R1], [R2] | Do not route PostgreSQL or Redis over the guest NIC. |
| Gondolin classifies outbound TCP and only forwards HTTP, TLS, and optionally allowlisted SSH. Everything else is blocked. | [R1], [R2], [R5] | Raw PostgreSQL and Redis TCP will not work over the guest NIC. |
| HTTP `CONNECT` is explicitly denied. | [R1] | Do not attempt an HTTP-proxy-based generic tunnel. |
| `SandboxServer.openTcpStream()` opens a TCP stream to a service **inside the guest**, and `sandboxssh` only permits guest loopback targets (`127.0.0.1` / `localhost`). | [R2] | The host can open guest loopback streams, but this API does not expose host services directly as guest ports. A guest bridge daemon is required. |
| `enableIngress()` is intentionally not a generic port forward; it is an HTTP-only host gateway to guest loopback services. | [R3], [R5] | Do not use ingress for PostgreSQL or Redis. |
| `enableSsh()` creates a host-local forwarder to guest `sshd`, and SSH port forwarding is intentionally disabled. | [R6], [R5] | Do not use SSH local/remote forwarding for the DB/cache tunnel. |
| `ExecProcess.attach()` can wire host streams into guest process stdin/stdout/stderr. | [R4] | This is the documented fallback if `openTcpStream()` is not exposed through the pinned Gondolin integration. |
| The current docs warn that the guest executes one command at a time; a long-running `vm.exec()` blocks additional exec requests. | [R5] | The bridge daemon should be started at boot, not as a long-lived `vm.exec()`, in the preferred mode. |
| Gondolin custom images support `rootfsPackages`, `postBuild.commands`, and boot-time init customization such as `rootfsInitExtra`. | [R7] | The bridge daemon can be baked into the image and started before `sandboxd` begins servicing exec requests. |
| Gondolin lists “adding extra packages requires building a new image” as a current limitation. | [R8] | The image build is part of the implementation, not optional. |
| OrbStack supports Docker port forwarding to `localhost`, `host.docker.internal`, direct container IP access, and host networking. | [R9], [R10] | The host manager can reach PostgreSQL/Redis through host-published ports or OrbStack host networking. |
| Docker publishes container ports to host IP addresses via port publishing. | [R11] | The portable setup is to bind PostgreSQL/Redis to `127.0.0.1` on the host. |
| Docker Compose creates a default project network and services on that network are reachable by service name. | [R12] | PostgreSQL/Redis can remain on an internal Compose bridge network while also publishing loopback-only host ports for the host manager. |

---

## 3. Scope, assumptions, and non-goals

### 3.1 Scope

This specification covers:

- macOS host
- OrbStack for Docker container execution
- Gondolin as the VM sandbox
- host-managed PostgreSQL and Redis resource exposure into the VM
- one or more application stacks inside the VM, including:
  - TypeScript / Node.js applications using Sequelize
  - Python applications using SQLAlchemy
  - Redis clients for caching, jobs, tests, or application state

### 3.2 Assumptions

The implementation assumes all of the following:

1. The Gondolin host process runs directly on macOS, not inside a container.
2. PostgreSQL and Redis run under Docker or OrbStack on the same Mac.
3. The implementation is allowed to pin a Gondolin revision and add a small local wrapper to expose `SandboxServer.openTcpStream()` to the host integration layer.
4. The VM image can be customized.
5. The bridge daemon and host tunnel manager are part of the trusted host-controlled platform, not agent-generated code.

### 3.3 Non-goals

This specification does **not** attempt to provide:

- raw TCP egress from the guest NIC,
- generic SOCKS / HTTP CONNECT / VPN tunneling,
- Redis Cluster or Sentinel support in the first version,
- PostgreSQL over Unix sockets between host and guest,
- guest access to arbitrary host services,
- a public Gondolin upstream API change in this document (a local wrapper is assumed).

---

## 4. High-level architecture

### 4.1 System context

```text
+-----------------------------------------------------------------------+
| macOS host                                                            |
|                                                                       |
|  +-------------------------+                                          |
|  | Gondolin host process   |                                          |
|  | - VM lifecycle          |                                          |
|  | - Tunnel Manager        |                                          |
|  | - openTcpStream wrapper |                                          |
|  +-----------+-------------+                                          |
|              |                                                        |
|              | host-managed backchannels                              |
|              v                                                        |
|  +-------------------------+       +-------------------------------+   |
|  | PostgreSQL target       |       | Redis target                  |   |
|  | 127.0.0.1:5432          |       | 127.0.0.1:6379               |   |
|  | (published port or      |       | (published port or            |   |
|  |  host networking)       |       |  host networking)             |   |
|  +-------------------------+       +-------------------------------+   |
|                                                                       |
+-------------------------------+---------------------------------------+
                                |
                                | QEMU VM boundary
                                v
+-----------------------------------------------------------------------+
| Gondolin VM                                                           |
|                                                                       |
|  +---------------------------------------------------------------+    |
|  | Guest loopback only                                            |    |
|  |                                                               |    |
|  |  App / agent code                                             |    |
|  |  - Sequelize -> 127.0.0.1:15432                               |    |
|  |  - SQLAlchemy -> 127.0.0.1:15432                              |    |
|  |  - Redis clients -> 127.0.0.1:16379                           |    |
|  |                                                               |    |
|  |  Guest Bridge Daemon                                          |    |
|  |  - client port 15432 <-> pg uplink queue on 16000            |    |
|  |  - client port 16379 <-> redis uplink queue on 16001         |    |
|  +---------------------------------------------------------------+    |
|                                                                       |
|  Normal guest NIC remains restricted to HTTP/TLS/(optional SSH) only  |
+-----------------------------------------------------------------------+
```

### 4.2 Why a guest bridge daemon is required

`openTcpStream()` opens a **single host-initiated stream** to a guest loopback service. It does **not** create a stable guest listening port that application code can dial directly. Therefore the guest side must provide a daemon that converts a pool of host-initiated backchannel connections into stable guest-local ports for normal clients. [R2]

### 4.3 Why ingress and SSH are not used

- Ingress is explicitly HTTP-only and intentionally not a generic port forward. [R3][R5]
- SSH port forwarding is intentionally disabled. [R6]

---

## 5. Addressing and port plan

The following addresses and ports are the normative defaults for the first implementation.

### 5.1 Host targets

| Resource | Host target | Notes |
| --- | --- | --- |
| PostgreSQL | `127.0.0.1:5432` | Preferred portable target via Docker published port bound to loopback. |
| Redis | `127.0.0.1:6379` | Preferred portable target via Docker published port bound to loopback. |

### 5.2 Guest ports

| Purpose | Guest address | Default port | Notes |
| --- | --- | --- | --- |
| PostgreSQL client-facing loopback port | `127.0.0.1` | `15432` | Applications in the VM use this as the PostgreSQL host/port. |
| PostgreSQL uplink listener | `127.0.0.1` | `16000` | Host backchannels connect here. |
| Redis client-facing loopback port | `127.0.0.1` | `16379` | Applications in the VM use this as the Redis host/port. |
| Redis uplink listener | `127.0.0.1` | `16001` | Host backchannels connect here. |
| Optional metrics / health port | `127.0.0.1` | `19090` | Guest daemon local diagnostics only. |

### 5.3 Environment variables inside the VM

These are the normative environment variables the platform should inject for guest applications:

```text
PGHOST=127.0.0.1
PGPORT=15432
REDIS_HOST=127.0.0.1
REDIS_PORT=16379
REDIS_URL=redis://127.0.0.1:16379/0
```

The bridge daemon itself should have its own config file and should not depend on application connection strings.

---

## 6. Docker and OrbStack deployment

### 6.1 Recommended portable setup: publish to host loopback only

This is the **recommended** setup because it is standard Docker behavior and does not depend on OrbStack-only features.

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 20
    networks:
      - appnet

  redis:
    image: redis:7
    command: ["redis-server", "--save", "", "--appendonly", "no"]
    ports:
      - "127.0.0.1:6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 20
    networks:
      - appnet

networks:
  appnet:
    driver: bridge
```

Why this is the normative setup:

- Docker port publishing maps container ports to host IP addresses. [R11]
- Binding to `127.0.0.1` limits access to the local machine while keeping the host manager path simple. [R11][R13]
- Compose still gives PostgreSQL and Redis a normal internal service network for any other containers that need service-name discovery. [R12]
- OrbStack states that container ports published with `-p` are available on `localhost`, just like Linux. [R9]

### 6.2 Optional OrbStack setup: host networking

OrbStack supports host networking on macOS and states that `localhost` works in both directions when using `--net host`. [R9][R10]

Use this only if you explicitly want the broader host-network behavior.

```bash
docker run --rm --net host postgres:17
docker run --rm --net host redis:7
```

Operational guidance:

- In host networking mode, the entire port range is shared with the host, not only the explicitly published ports. [R10]
- Because this increases the blast radius of configuration mistakes, the normative design continues to recommend loopback-only published ports over host networking.

### 6.3 Not chosen as the host-manager contract

The following OrbStack features are real but are **not** the normative contract for this system:

- direct container IP access from the Mac, and
- container / service `.orb.local` names.

They are intentionally not chosen because the tunnel manager should depend on stable host-local targets instead of runtime-specific DNS or container IP conventions.

---

## 7. Gondolin image build and boot process

### 7.1 Why a custom image is required

Gondolin's current limitations explicitly state that adding extra packages requires building a new image. The custom-image docs also expose `rootfsPackages`, `postBuild.commands`, and init customization. [R7][R8]

This implementation requires a custom image for at least one of the following reasons:

- the guest bridge daemon must exist in the image,
- the daemon should start at boot so it does not consume the only long-running `vm.exec()` slot,
- language runtimes for the playground may need to be preinstalled.

### 7.2 Boot-time requirement

The bridge daemon **must** be started as part of the image boot path, not as a long-running `vm.exec()`, because the current docs warn that a long-running `vm.exec()` blocks additional exec requests. [R5]

Use one of the following supported build-time mechanisms from the custom image system:

- `rootfsInitExtra`, or
- a custom `rootfsInit` / `initramfsInit` script. [R7]

### 7.3 Normative image content

#### 7.3.1 Example `build-config.json`

This example uses the documented Alpine-rootfs path and adds the runtimes typically needed for TypeScript and Python playgrounds. [R7]

```json
{
  "arch": "aarch64",
  "distro": "alpine",
  "alpine": {
    "version": "3.23.0",
    "kernelPackage": "linux-virt",
    "kernelImage": "vmlinuz-virt",
    "rootfsPackages": [
      "linux-virt",
      "rng-tools",
      "bash",
      "ca-certificates",
      "curl",
      "nodejs",
      "npm",
      "uv",
      "python3",
      "openssh"
    ],
    "initramfsPackages": []
  },
  "rootfs": {
    "label": "gondolin-root"
  },
  "postBuild": {
    "commands": [
      "mkdir -p /opt/gondolin-bridge",
      "cp /build-context/guest-loopback-bridge.js /opt/gondolin-bridge/guest-loopback-bridge.js",
      "cp /build-context/guest-loopback-bridge.json /opt/gondolin-bridge/guest-loopback-bridge.json",
      "printf '%s\n' '#!/bin/sh' 'node /opt/gondolin-bridge/guest-loopback-bridge.js --config /opt/gondolin-bridge/guest-loopback-bridge.json >/var/log/gondolin-bridge.log 2>&1 &' > /opt/gondolin-bridge/start.sh",
      "chmod +x /opt/gondolin-bridge/start.sh"
    ]
  },
  "init": {
    "rootfsInitExtra": "./rootfs-init-extra.sh"
  }
}
```

#### 7.3.2 Example `rootfs-init-extra.sh`

```sh
#!/bin/sh
set -eu

if [ -x /opt/gondolin-bridge/start.sh ]; then
  /opt/gondolin-bridge/start.sh
fi
```

#### 7.3.3 Build and use

```bash
gondolin build --config build-config.json --output ./gondolin-assets
export GONDOLIN_GUEST_DIR=./gondolin-assets
```

### 7.4 OCI-rootfs option

If your application expects Debian or Ubuntu userland behavior, Gondolin's custom-image docs support using an OCI image as the rootfs base while still using the Gondolin Alpine boot layer. [R7]

This is acceptable for the playground, but it does not change the tunnel architecture described here.

---

## 8. Guest loopback bridge daemon specification

### 8.1 Responsibilities

The guest daemon is a host-controlled, non-agent component that runs inside the VM and provides three functions:

1. expose stable client-facing loopback ports inside the VM,
2. accept host-initiated uplink connections on dedicated guest loopback ports, and
3. pair each client connection with one uplink and forward bytes in both directions.

### 8.2 Required behavior

For each resource (`postgres`, `redis`), the daemon **must**:

- bind the client-facing listener to `127.0.0.1` only,
- bind the uplink listener to `127.0.0.1` only,
- queue uplink connections until they are assigned to clients,
- on client connect, assign exactly one uplink,
- if no uplink is immediately available, wait up to `waitForUplinkMs` before closing the client socket,
- pipe bytes client -> uplink and uplink -> client without protocol awareness or framing,
- call `setNoDelay(true)` on all accepted sockets,
- enable TCP keepalive on all accepted sockets,
- log connect, pair, close, and error events with a stable connection id,
- export local health / metrics if enabled.

### 8.3 Explicit non-requirements

The daemon **must not**:

- initiate outbound TCP connections itself,
- bind to non-loopback addresses,
- perform protocol parsing for PostgreSQL or Redis,
- multiplex multiple clients over one uplink,
- expose management APIs on non-loopback addresses.

### 8.4 Config file

#### `guest-loopback-bridge.json`

```json
{
  "services": [
    {
      "name": "postgres",
      "clientListen": { "host": "127.0.0.1", "port": 15432 },
      "uplinkListen": { "host": "127.0.0.1", "port": 16000 },
      "waitForUplinkMs": 5000,
      "maxQueuedUplinks": 16
    },
    {
      "name": "redis",
      "clientListen": { "host": "127.0.0.1", "port": 16379 },
      "uplinkListen": { "host": "127.0.0.1", "port": 16001 },
      "waitForUplinkMs": 5000,
      "maxQueuedUplinks": 16
    }
  ],
  "metrics": {
    "enabled": true,
    "host": "127.0.0.1",
    "port": 19090
  }
}
```

### 8.5 Connection lifecycle

```text
Host Tunnel Manager                 Guest bridge daemon               Guest app
-------------------                -------------------               ---------
open uplink to 16000  -----------> accept uplink, queue it
connect host PG:5432   -----------> idle until a client arrives
                                                                  connect 15432
                                     accept client
                                     pop one queued uplink
                                     pipe client <-> uplink
TCP bytes flow both directions <-------------------------------------------->
client closes OR server closes
                                     destroy both sockets
Host Tunnel Manager replaces uplink to keep pool at desired size
```

### 8.6 Reference implementation language

Two acceptable guest-daemon implementations are supported by this specification:

- **Reference implementation:** Node.js script, because the playground often already includes Node.js and the implementation is short.
- **Production-optimized implementation:** a small static Go or Rust binary, if the team wants a lower-footprint helper.

The rest of this specification uses the Node.js reference implementation.

### 8.7 Reference implementation: Node.js daemon

See `reference/guest-loopback-bridge.js` included with this specification.

The core design is:

- one `net.Server` for each client-facing port,
- one `net.Server` for each uplink port,
- a FIFO queue of idle uplinks per service,
- one-to-one pairing between a client and an uplink.

---

## 9. Host Tunnel Manager specification

### 9.1 Responsibilities

The host Tunnel Manager is the trusted component that decides which host resources exist for the guest.

For each service, it **must**:

- read desired configuration,
- wait for the host target to become healthy,
- open the configured number of guest uplinks,
- bind each guest uplink to exactly one host target socket,
- replenish closed uplinks,
- expose health and metrics,
- refuse any target outside the static allowlist.

### 9.2 Host target config

#### `host-tunnel-config.json`

```json
{
  "services": [
    {
      "name": "postgres",
      "guestUplinkPort": 16000,
      "hostTarget": { "host": "127.0.0.1", "port": 5432 },
      "desiredUplinks": 8,
      "openTimeoutMs": 5000,
      "reconnectDelayMs": 500,
      "maxReconnectDelayMs": 5000
    },
    {
      "name": "redis",
      "guestUplinkPort": 16001,
      "hostTarget": { "host": "127.0.0.1", "port": 6379 },
      "desiredUplinks": 4,
      "openTimeoutMs": 5000,
      "reconnectDelayMs": 500,
      "maxReconnectDelayMs": 5000
    }
  ]
}
```

### 9.3 Integration requirement: guest loopback stream opener

Because the public VM docs do not currently document a `vm.openTcpStream()` method, the implementation **must** provide a host-side abstraction that can open a guest loopback stream for a pinned Gondolin revision. [R2][R4][R5]

#### Required interface

```ts
import type { Duplex } from "node:stream";

export interface GuestLoopbackStreamOpener {
  openGuestLoopbackStream(input: {
    host?: "127.0.0.1" | "localhost";
    port: number;
    timeoutMs?: number;
  }): Promise<Duplex>;
}
```

#### Required adapter behavior

The preferred adapter must delegate to Gondolin's documented `SandboxServer.openTcpStream()` capability. The exact wrapper surface is implementation-defined because the public `VM` docs do not document it. [R2]

Normative requirement:

- Pin the Gondolin revision.
- Expose `openGuestLoopbackStream()` in your local integration layer.
- Do **not** rely on ad hoc internal property names in application code.
- Keep the wrapper in one place so it can be changed when the pinned Gondolin revision changes.

### 9.4 Connection algorithm

For each service, the Tunnel Manager runs the following algorithm forever while the VM is alive:

1. Ensure `open uplinks = desiredUplinks`.
2. For each missing uplink:
   1. call `openGuestLoopbackStream({ host: "127.0.0.1", port: guestUplinkPort, timeoutMs })`,
   2. dial the host target (`127.0.0.1:5432` or `127.0.0.1:6379`),
   3. set `setNoDelay(true)` and keepalive on the host socket,
   4. pipe guest uplink <-> host socket,
   5. on close or error, destroy both sides and schedule replenishment with backoff.
3. Surface health status per service:
   - `healthy` when `open uplinks >= minimumReadyUplinks`,
   - `degraded` when below desired but above minimum,
   - `unhealthy` when zero or host target unavailable.

### 9.5 Important semantic note: an uplink is a real backend connection

Each PostgreSQL uplink corresponds to one real TCP connection to PostgreSQL. PostgreSQL limits the number of concurrent connections via `max_connections`, and reserves slots for privileged users. [R13]

This means:

- `desiredUplinks` must be counted against the database server's connection capacity,
- the guest application pool must be sized to match the available uplinks,
- idle uplinks are still real DB/cache TCP connections.

### 9.6 Reference implementation: host Tunnel Manager

See `reference/host-tunnel-manager.ts` included with this specification.

---

## 10. Application stack configuration inside the VM

### 10.1 PostgreSQL: Sequelize

Sequelize uses a connection pool, with a documented default maximum of 5 active connections, and the docs explicitly warn that the pool maximum should be less than the database server limit. [R15]

Normative guidance:

- If PostgreSQL `desiredUplinks = 8`, set the Sequelize pool max to **8 or less**.
- Start with `max = desiredUplinks`, `min = 0`.
- If multiple app processes run inside the VM, budget the sum of all process pool maxima against the PostgreSQL uplink count and database `max_connections`. [R13][R15]

#### Example

```ts
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? "15432"),
  database: process.env.PGDATABASE ?? "app",
  username: process.env.PGUSER ?? "app",
  password: process.env.PGPASSWORD ?? "app",
  pool: {
    max: 8,
    min: 0,
    acquire: 30_000,
    idle: 10_000
  }
});
```

### 10.2 PostgreSQL: SQLAlchemy

SQLAlchemy's default `Engine` uses `QueuePool`; the current docs say `pool_size` is the number of persistent connections kept in the pool and `max_overflow` allows additional simultaneous connections beyond that. [R14]

Normative guidance:

- Set `pool_size` to the number of persistent PostgreSQL uplinks you want.
- Set `max_overflow = 0` when you want the ORM's maximum concurrency to equal the PostgreSQL uplink count exactly.

#### Example

```py
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql+psycopg://app:app@127.0.0.1:15432/app",
    pool_size=8,
    max_overflow=0,
    pool_pre_ping=True,
)
```

### 10.3 Redis clients

Redis clients connect to Redis over TCP, and the RESP protocol runs over a stream-oriented connection. Redis also documents that pipelining helps reduce RTT overhead even on loopback links. [R16]

Normative guidance:

- If the workload uses a single long-lived Redis client per process, start with `desiredUplinks = number of app processes + 1`.
- If the workload uses multiple Redis client instances per process, budget those explicitly.
- Prefer client-side pipelining / batching where supported by the library when the agent may emit bursts of many small commands. [R16]

#### Example environment

```text
REDIS_URL=redis://127.0.0.1:16379/0
```

---

## 11. Performance and capacity guidance

### 11.1 Expected performance posture

This design is intended for a **development and agent playground** rather than a high-throughput production data plane. It should be performant enough for migrations, tests, local app servers, replaying failing cases, and agent-driven debugging on a single workstation.

Validated facts that matter here:

- OrbStack states that host-container networking and port forwarding are optimized for speed and support localhost forwarding and host networking. [R9][R10]
- Redis documents that loopback RTT is typically sub-millisecond, but RTT still matters for chatty request/response traffic and pipelining reduces that overhead. [R16]

Important design caveat:

- Gondolin's backchannel path is **not** covered by OrbStack's networking throughput claim; the user-space bridging work added by Gondolin and the bridge components must be measured on your hardware.

### 11.2 Required tuning

The implementation **must** apply the following:

1. `setNoDelay(true)` on every socket owned by the bridge daemon and Tunnel Manager.
2. TCP keepalive enabled on every bridge socket.
3. Queue sizes bounded per service.
4. ORM / client connection pools aligned with uplink counts.
5. No hidden overflow pools for the first release.

### 11.3 Connection budgeting

For PostgreSQL:

```text
total PostgreSQL connections consumed by this system
  = sum of all PostgreSQL uplinks across all active VMs
  + any host-side tools / migrations / psql sessions
  + any non-Gondolin app consumers

This total must remain safely below PostgreSQL max_connections,
leaving reserve for admin access. [R13]
```

For Redis:

```text
total Redis connections consumed by this system
  = sum of all Redis uplinks across all active VMs
  + any non-Gondolin Redis clients
```

### 11.4 Initial recommended defaults

For a single VM playground on a laptop:

| Service | Initial uplinks | Notes |
| --- | --- | --- |
| PostgreSQL | 8 | Good starting point for one web app process plus tests. |
| Redis | 4 | Good starting point for one app process, workers, and CLI checks. |

These are starting points only. Increase or decrease after measuring actual concurrent client usage.

### 11.5 Benchmark plan

The implementation **must** include a benchmark script that measures all three paths:

1. host direct to PostgreSQL / Redis,
2. host direct to guest daemon without the app stack,
3. app inside the VM through the full tunnel path.

#### Metrics to record

- connect latency p50 / p95
- first successful query latency p50 / p95
- steady-state request latency p50 / p95
- error rate under target concurrency
- queued-uplink starvation count
- active uplinks, active clients, and replenish rate

#### Suggested acceptance targets

For a developer workstation playground, accept the design if:

- no correctness issues appear under sustained test load,
- the tunnel path remains stable under rapid connect/disconnect cycles,
- ORM / client timeouts do not occur under expected concurrency,
- the measured latency inflation is acceptable for tests, debugging, and agent workflows.

This document intentionally does **not** set universal numeric latency budgets because they depend on workstation CPU, macOS version, OrbStack version, VM size, and DB/cache workload.

---

## 12. Security guardrails

### 12.1 Guardrails that remain enabled

This design keeps Gondolin's normal guest-network restrictions in place:

- no generic NAT,
- no arbitrary TCP protocols over the guest NIC,
- no HTTP `CONNECT`,
- ingress still HTTP-only,
- SSH port forwarding still disabled. [R1][R2][R3][R6]

### 12.2 Additional mandatory controls

The platform implementation **must**:

1. bind PostgreSQL and Redis host ports to `127.0.0.1` only in the normative published-port setup,
2. bind all guest daemon ports to `127.0.0.1` only,
3. hard-code the host allowlist in the Tunnel Manager,
4. refuse any request to open a tunnel to an undeclared host target,
5. keep Gondolin `blockInternalRanges: true` in HTTP hooks unless a separate reviewed need exists, [R2][R5]
6. avoid putting real secrets in the VM image `env`, since the custom-image docs warn that `env` is stored in the image. [R7]

### 12.3 Trust boundary

The bridge daemon and the Tunnel Manager are trusted host-platform components. The agent and its generated code are **not** trusted. This matches Gondolin's documented trust model, where the host is the policy enforcement point and the guest is treated as adversarial. [R2]

---

## 13. Failure handling and recovery

### 13.1 Host target unavailable at startup

If PostgreSQL or Redis is not healthy when the VM starts:

- the Tunnel Manager should keep retrying with exponential backoff,
- guest bridge client connections should fail quickly or time out after `waitForUplinkMs`,
- the VM itself should still remain usable for non-DB work.

### 13.2 Host target disappears after startup

If PostgreSQL or Redis is restarted:

- the affected uplink sockets will close,
- the Tunnel Manager must destroy both sides and replenish the uplink pool,
- application-side retry logic remains the responsibility of the app / library.

Recommended client-side settings:

- SQLAlchemy: `pool_pre_ping=True` to detect dead connections on checkout. [R14]
- Sequelize: use pool monitoring and retry strategy appropriate to the app; the docs expose pool state metrics and warn about overload scenarios. [R15]

### 13.3 Guest daemon crash

If the guest daemon dies:

- all new app connects to the guest loopback ports will fail,
- all host uplinks will eventually close,
- the VM startup health check should detect this before application work begins.

Therefore the image boot process must include a basic readiness probe, for example:

- daemon has started,
- guest ports 15432 / 16000 / 16379 / 16001 are listening on `127.0.0.1`,
- optional metrics port responds.

---

## 14. Implementation steps

### 14.1 Build the image

1. Create `build-config.json` and `rootfs-init-extra.sh`.
2. Add the guest bridge daemon and config to the build context.
3. Build the image with `gondolin build --config ... --output ...`.
4. Set `GONDOLIN_GUEST_DIR` for the host process. [R7]

### 14.2 Bring up PostgreSQL and Redis on the host

1. Start Docker / OrbStack.
2. Start the Compose stack with loopback-only published ports.
3. Verify from the host:
   - PostgreSQL reachable on `127.0.0.1:5432`
   - Redis reachable on `127.0.0.1:6379`

### 14.3 Expose guest loopback streams in the host integration layer

1. Pin the Gondolin revision used by the project.
2. Add a small local wrapper that implements `GuestLoopbackStreamOpener` by delegating to Gondolin's `SandboxServer.openTcpStream()` capability. [R2]
3. Keep this wrapper isolated from application code.

### 14.4 Start the VM and Tunnel Manager

1. `await VM.create(...)`
2. `await vm.start()` if not auto-started. [R4]
3. Start the Tunnel Manager.
4. Wait until the PostgreSQL and Redis services both report at least `minimumReadyUplinks`.
5. Inject guest environment variables for `PGHOST`, `PGPORT`, `REDIS_URL`.
6. Start the application or agent workload inside the VM.

### 14.5 Validate end-to-end

Inside the VM:

- run a simple PostgreSQL query from the app stack,
- run a simple Redis command from the app stack,
- confirm the app is using guest loopback addresses only.

---

## 15. Fallback mode: documented-only `vm.exec(...).attach(...)`

If the project cannot expose `openTcpStream()` from the pinned Gondolin integration layer, the documented fallback is to use `vm.exec()` plus `proc.attach()` as the backchannel. [R4]

### 15.1 When to use this fallback

Use this fallback only when:

- a local Gondolin wrapper / fork is not acceptable yet, and
- the team still needs a working proof of concept.

### 15.2 Tradeoffs

- It is fully aligned with the documented public VM-control APIs. [R4]
- It is less ergonomic because a long-running `vm.exec()` blocks additional exec requests in the current design. [R5]
- It is harder to separate app logs from tunnel bytes because the tunnel consumes the exec process streams.

### 15.3 Fallback architecture

The guest runs a process that listens on `127.0.0.1:15432` and pipes accepted client bytes to its own stdin/stdout. The host uses `proc.attach()` to connect that process to the host PostgreSQL socket. The same can be repeated for Redis in a separate session, subject to the one-command-at-a-time limitation. [R4][R5]

This fallback is adequate for validating correctness but is **not** the preferred long-term architecture described in this document.

---

## 16. Acceptance criteria

The implementation is accepted when all of the following are true:

1. A Gondolin VM can start with the bridge daemon running at boot.
2. The Tunnel Manager can maintain the configured number of uplinks for PostgreSQL and Redis.
3. A TypeScript app inside the VM can use Sequelize against `127.0.0.1:15432`.
4. A Python app inside the VM can use SQLAlchemy against `127.0.0.1:15432`.
5. A Redis client inside the VM can use `127.0.0.1:16379`.
6. If the guest tries to connect over its normal NIC to raw PostgreSQL or Redis targets, Gondolin still blocks that traffic as designed. [R1][R2]
7. Killing and restarting PostgreSQL or Redis causes uplinks to replenish automatically without restarting the VM.
8. The measured performance is acceptable for dev/test and agent workflows on the target hardware.

---

## 17. Recommended repository layout

```text
platform/
  gondolin/
    image/
      build-config.json
      rootfs-init-extra.sh
      guest-loopback-bridge.js
      guest-loopback-bridge.json
    host/
      tunnel-config.json
      guest-loopback-stream-opener.ts
      host-tunnel-manager.ts
      bootstrap-vm.ts
  docker/
    compose.dev.yml
  benchmarks/
    bench-postgres.ts
    bench-redis.ts
```

---

## 18. Reference implementation files included with this specification

This specification package includes the following reference files:

- `reference/guest-loopback-bridge.js`
- `reference/guest-loopback-bridge.json`
- `reference/host-tunnel-manager.ts`
- `reference/guest-loopback-stream-opener.ts`
- `reference/docker-compose.dev.yml`

These files are intentionally written as a clear starting point rather than a full production package.

---

## 19. References

[R1] Gondolin Network Stack. Official docs. https://earendil-works.github.io/gondolin/network/ (accessed 2026-02-28)

[R2] Gondolin Security Design. Official docs. https://earendil-works.github.io/gondolin/security/ (accessed 2026-02-28)

[R3] Gondolin Ingress and Listening. Official docs. https://earendil-works.github.io/gondolin/ingress/ (accessed 2026-02-28)

[R4] Gondolin SDK: VM Control. Official docs. https://earendil-works.github.io/gondolin/sdk-vm/ (accessed 2026-02-28)

[R5] Gondolin SDK: Network Access. Official docs. https://earendil-works.github.io/gondolin/sdk-network/ (accessed 2026-02-28)

[R6] Gondolin SSH. Official docs. https://earendil-works.github.io/gondolin/ssh/ (accessed 2026-02-28)

[R7] Gondolin Building Custom Images. Official docs. https://earendil-works.github.io/gondolin/custom-images/ (accessed 2026-02-28)

[R8] Gondolin Current Limitations. Official docs. https://earendil-works.github.io/gondolin/limitations/ (accessed 2026-02-28)

[R9] OrbStack Container Networking. Official docs. https://docs.orbstack.dev/docker/network (accessed 2026-02-28)

[R10] OrbStack Host Networking. Official docs. https://docs.orbstack.dev/docker/host-networking (accessed 2026-02-28)

[R11] Docker Port Publishing and Mapping. Official docs. https://docs.docker.com/engine/network/port-publishing/ (accessed 2026-02-28)

[R12] Docker Compose Networking. Official docs. https://docs.docker.com/compose/how-tos/networking/ (accessed 2026-02-28)

[R13] PostgreSQL 18 Documentation: Connections and Authentication. Official docs. https://www.postgresql.org/docs/current/runtime-config-connection.html (accessed 2026-02-28)

[R14] SQLAlchemy 2.1 Documentation: Connection Pooling. Official docs. https://docs.sqlalchemy.org/en/21/core/pooling.html (accessed 2026-02-28)

[R15] Sequelize v7 Documentation: Connection Pool. Official docs. https://sequelize.org/docs/v7/other-topics/connection-pool/ (accessed 2026-02-28)

[R16] Redis Documentation: RESP protocol and pipelining. Official docs. https://redis.io/docs/latest/develop/reference/protocol-spec/ and https://redis.io/docs/latest/develop/using-commands/pipelining/ (accessed 2026-02-28)

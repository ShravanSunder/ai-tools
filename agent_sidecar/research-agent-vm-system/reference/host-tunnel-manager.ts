import net from "node:net";
import { once } from "node:events";
import type { Duplex } from "node:stream";
import type { GuestLoopbackStreamOpener } from "./guest-loopback-stream-opener";

export type ServiceConfig = {
  name: string;
  guestUplinkPort: number;
  hostTarget: { host: string; port: number };
  desiredUplinks: number;
  openTimeoutMs?: number;
  reconnectDelayMs?: number;
  maxReconnectDelayMs?: number;
};

export type TunnelManagerConfig = {
  services: ServiceConfig[];
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function tuneSocket(sock: net.Socket) {
  sock.setNoDelay(true);
  sock.setKeepAlive(true, 30_000);
}

async function connectHostTarget(host: string, port: number): Promise<net.Socket> {
  const socket = net.createConnection({ host, port });
  tuneSocket(socket);
  await once(socket, "connect");
  return socket;
}

class UplinkBinding {
  private readonly createdAt = Date.now();
  private closed = false;

  constructor(
    public readonly serviceName: string,
    public readonly id: string,
    private readonly guestStream: Duplex,
    private readonly hostSocket: net.Socket,
    private readonly onClosed: () => void,
  ) {
    this.guestStream.pipe(this.hostSocket);
    this.hostSocket.pipe(this.guestStream);

    const close = () => this.close();
    this.guestStream.on("error", close);
    this.hostSocket.on("error", close);
    this.guestStream.on("close", close);
    this.hostSocket.on("close", close);
  }

  get ageMs() {
    return Date.now() - this.createdAt;
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    try { this.guestStream.destroy(); } catch {}
    try { this.hostSocket.destroy(); } catch {}
    this.onClosed();
  }
}

class ServiceTunnelPool {
  private nextId = 1;
  private running = false;
  private bindings = new Set<UplinkBinding>();
  private fillPromise: Promise<void> | null = null;
  private retryDelayMs: number;

  constructor(
    private readonly opener: GuestLoopbackStreamOpener,
    private readonly cfg: ServiceConfig,
    private readonly logger: (msg: string, extra?: Record<string, unknown>) => void,
  ) {
    this.retryDelayMs = cfg.reconnectDelayMs ?? 500;
  }

  get status() {
    return {
      name: this.cfg.name,
      desiredUplinks: this.cfg.desiredUplinks,
      openUplinks: this.bindings.size,
      hostTarget: this.cfg.hostTarget,
    };
  }

  async start() {
    this.running = true;
    await this.fill();
  }

  async stop() {
    this.running = false;
    for (const binding of [...this.bindings]) {
      binding.close();
    }
  }

  private async fill() {
    if (this.fillPromise) return this.fillPromise;

    this.fillPromise = (async () => {
      while (this.running && this.bindings.size < this.cfg.desiredUplinks) {
        const id = `${this.cfg.name}-${this.nextId++}`;
        try {
          this.logger("uplink-open-start", { id, service: this.cfg.name });
          const guestStream = await this.opener.openGuestLoopbackStream({
            host: "127.0.0.1",
            port: this.cfg.guestUplinkPort,
            timeoutMs: this.cfg.openTimeoutMs ?? 5_000,
          });
          const hostSocket = await connectHostTarget(this.cfg.hostTarget.host, this.cfg.hostTarget.port);
          const binding = new UplinkBinding(
            this.cfg.name,
            id,
            guestStream,
            hostSocket,
            () => {
              this.bindings.delete(binding);
              this.logger("uplink-closed", { id, service: this.cfg.name, openUplinks: this.bindings.size });
              void this.scheduleRefill();
            },
          );
          this.bindings.add(binding);
          this.retryDelayMs = this.cfg.reconnectDelayMs ?? 500;
          this.logger("uplink-open-ready", { id, service: this.cfg.name, openUplinks: this.bindings.size });
        } catch (err) {
          this.logger("uplink-open-failed", {
            id,
            service: this.cfg.name,
            message: String((err as Error)?.message ?? err),
            retryDelayMs: this.retryDelayMs,
          });
          await delay(this.retryDelayMs);
          this.retryDelayMs = Math.min(
            this.retryDelayMs * 2,
            this.cfg.maxReconnectDelayMs ?? 5_000,
          );
        }
      }
    })().finally(() => {
      this.fillPromise = null;
    });

    return this.fillPromise;
  }

  private async scheduleRefill() {
    if (!this.running) return;
    await this.fill();
  }
}

export class TunnelManager {
  private readonly pools: ServiceTunnelPool[];

  constructor(
    opener: GuestLoopbackStreamOpener,
    config: TunnelManagerConfig,
    private readonly logger: (msg: string, extra?: Record<string, unknown>) => void = (msg, extra) => {
      process.stdout.write(`${new Date().toISOString()} ${msg}${extra ? ` ${JSON.stringify(extra)}` : ""}\n`);
    },
  ) {
    this.pools = config.services.map((svc) => new ServiceTunnelPool(opener, svc, this.logger));
  }

  async start() {
    for (const pool of this.pools) {
      await pool.start();
    }
  }

  async stop() {
    for (const pool of this.pools) {
      await pool.stop();
    }
  }

  getStatus() {
    return this.pools.map((pool) => pool.status);
  }
}

/**
 * Example bootstrap usage:
 *
 * import { VM } from "@earendil-works/gondolin";
 * import { TunnelManager } from "./host-tunnel-manager";
 * import { TODOImplementPinnedGondolinOpener } from "./guest-loopback-stream-opener";
 *
 * const vm = await VM.create();
 * const opener = new TODOImplementPinnedGondolinOpener(yourPinnedGondolinHandle);
 * const manager = new TunnelManager(opener, {
 *   services: [
 *     {
 *       name: "postgres",
 *       guestUplinkPort: 16000,
 *       hostTarget: { host: "127.0.0.1", port: 5432 },
 *       desiredUplinks: 8,
 *     },
 *     {
 *       name: "redis",
 *       guestUplinkPort: 16001,
 *       hostTarget: { host: "127.0.0.1", port: 6379 },
 *       desiredUplinks: 4,
 *     },
 *   ],
 * });
 * await manager.start();
 */

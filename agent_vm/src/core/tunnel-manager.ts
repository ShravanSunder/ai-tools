import net from 'node:net';
import type { Duplex } from 'node:stream';

import type { TunnelConfig } from '../types/config.js';

export interface GuestLoopbackStreamOpener {
	openGuestLoopbackStream(input: {
		host?: '127.0.0.1' | 'localhost';
		port: number;
		timeoutMs?: number;
	}): Promise<Duplex>;
}

export interface TunnelHealthStatus {
	name: string;
	desiredUplinks: number;
	openUplinks: number;
	hostTarget: { host: string; port: number };
	state: 'healthy' | 'degraded' | 'unhealthy';
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function tuneSocket(socket: net.Socket): void {
	socket.setNoDelay(true);
	socket.setKeepAlive(true, 30_000);
}

async function connectHostTarget(host: string, port: number): Promise<net.Socket> {
	const socket = net.createConnection({ host, port });
	tuneSocket(socket);
	await new Promise<void>((resolve, reject) => {
		socket.once('connect', () => resolve());
		socket.once('error', reject);
	});
	return socket;
}

class UplinkBinding {
	private closed = false;

	public constructor(
		private readonly guestStream: Duplex,
		private readonly hostSocket: net.Socket,
		private readonly onClosed: () => void,
	) {
		this.guestStream.pipe(this.hostSocket);
		this.hostSocket.pipe(this.guestStream);

		const close = (): void => this.close();
		this.guestStream.on('close', close);
		this.guestStream.on('error', close);
		this.hostSocket.on('close', close);
		this.hostSocket.on('error', close);
	}

	public close(): void {
		if (this.closed) {
			return;
		}
		this.closed = true;
		this.guestStream.destroy();
		this.hostSocket.destroy();
		this.onClosed();
	}
}

interface ServiceTunnelPoolConfig {
	name: string;
	guestUplinkPort: number;
	hostTarget: { host: string; port: number };
	desiredUplinks: number;
	reconnectDelayMs: number;
	maxReconnectDelayMs: number;
}

class ServiceTunnelPool {
	private running = false;
	private fillPromise: Promise<void> | null = null;
	private readonly bindings = new Set<UplinkBinding>();
	private reconnectDelayMs: number;

	public constructor(
		private readonly opener: GuestLoopbackStreamOpener,
		private readonly config: ServiceTunnelPoolConfig,
		private readonly onStateChange: () => void,
	) {
		this.reconnectDelayMs = config.reconnectDelayMs;
	}

	public getStatus(): TunnelHealthStatus {
		const openUplinks = this.bindings.size;
		const state =
			openUplinks === this.config.desiredUplinks
				? 'healthy'
				: openUplinks > 0
					? 'degraded'
					: 'unhealthy';

		return {
			name: this.config.name,
			desiredUplinks: this.config.desiredUplinks,
			openUplinks,
			hostTarget: this.config.hostTarget,
			state,
		};
	}

	public async start(): Promise<void> {
		this.running = true;
		void this.fill();
	}

	public async stop(): Promise<void> {
		this.running = false;
		const activeFillPromise = this.fillPromise;
		this.fillPromise = null;
		if (activeFillPromise) {
			await activeFillPromise.catch(() => undefined);
		}
		for (const binding of this.bindings) {
			binding.close();
		}
	}

	public async restart(): Promise<void> {
		await this.stop();
		this.running = true;
		void this.fill();
	}

	private fill(): Promise<void> {
		if (this.fillPromise) {
			return this.fillPromise;
		}

		this.fillPromise = (async () => {
			while (this.running && this.bindings.size < this.config.desiredUplinks) {
				try {
					// oxlint-disable-next-line eslint/no-await-in-loop
					const guestStream = await this.opener.openGuestLoopbackStream({
						host: '127.0.0.1',
						port: this.config.guestUplinkPort,
						timeoutMs: 5_000,
					});
					// oxlint-disable-next-line eslint/no-await-in-loop
					const hostSocket = await connectHostTarget(
						this.config.hostTarget.host,
						this.config.hostTarget.port,
					);

					if (!this.running) {
						guestStream.destroy();
						hostSocket.destroy();
						break;
					}

					const binding = new UplinkBinding(guestStream, hostSocket, () => {
						this.bindings.delete(binding);
						this.onStateChange();
						void this.fill();
					});

					this.bindings.add(binding);
					this.reconnectDelayMs = this.config.reconnectDelayMs;
					this.onStateChange();
				} catch {
					this.onStateChange();
					// oxlint-disable-next-line eslint/no-await-in-loop
					await delay(this.reconnectDelayMs);
					this.reconnectDelayMs = Math.min(
						this.reconnectDelayMs * 2,
						this.config.maxReconnectDelayMs,
					);
				}
			}
		})().finally(() => {
			this.fillPromise = null;
		});

		return this.fillPromise;
	}
}

export class TunnelManager {
	private readonly pools = new Map<string, ServiceTunnelPool>();

	public constructor(
		opener: GuestLoopbackStreamOpener,
		config: TunnelConfig,
		onStateChange: () => void,
	) {
		for (const [name, service] of Object.entries(config.services)) {
			if (!service.enabled) {
				continue;
			}

			this.pools.set(
				name,
				new ServiceTunnelPool(
					opener,
					{
						name,
						guestUplinkPort: service.guestUplinkPort,
						hostTarget: service.hostTarget,
						desiredUplinks: service.desiredUplinks,
						reconnectDelayMs: 500,
						maxReconnectDelayMs: 5_000,
					},
					onStateChange,
				),
			);
		}
	}

	public async start(): Promise<void> {
		await Promise.all([...this.pools.values()].map(async (pool) => pool.start()));
	}

	public async stop(): Promise<void> {
		await Promise.all([...this.pools.values()].map(async (pool) => pool.stop()));
	}

	public async restart(serviceName?: string): Promise<void> {
		if (serviceName) {
			const pool = this.pools.get(serviceName);
			if (pool) {
				await pool.restart();
			}
			return;
		}

		await Promise.all([...this.pools.values()].map(async (pool) => pool.restart()));
	}

	public getStatus(): TunnelHealthStatus[] {
		return [...this.pools.values()].map((pool) => pool.getStatus());
	}
}

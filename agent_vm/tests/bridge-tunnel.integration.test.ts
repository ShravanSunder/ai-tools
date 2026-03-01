import net from 'node:net';

import { afterEach, describe, expect, it } from 'vitest';

import {
	TunnelManager,
	type GuestLoopbackStreamOpener,
} from '#src/core/infrastructure/tunnel-manager.js';

const servers: net.Server[] = [];

function listenRandomServer(): Promise<{ server: net.Server; port: number }> {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			if (!address || typeof address === 'string') {
				reject(new Error('invalid address'));
				return;
			}
			servers.push(server);
			resolve({ server, port: address.port });
		});
	});
}

async function waitFor(
	predicate: () => boolean,
	timeoutMs: number,
	intervalMs: number,
): Promise<void> {
	const started = Date.now();
	const loop = async (): Promise<void> => {
		if (Date.now() - started >= timeoutMs) {
			throw new Error('condition not met before timeout');
		}
		if (predicate()) {
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
		await loop();
	};

	await loop();
}

afterEach(async () => {
	await Promise.all(
		servers.splice(0).map(
			(server) =>
				new Promise<void>((resolve) => {
					server.close(() => resolve());
				}),
		),
	);
});

describe('tunnel manager', () => {
	it('opens desired uplinks and reports healthy status', async () => {
		const guestUplink = await listenRandomServer();
		const hostTarget = await listenRandomServer();

		const opener: GuestLoopbackStreamOpener = {
			openGuestLoopbackStream: async () => {
				return await new Promise<net.Socket>((resolve, reject) => {
					const socket = net.createConnection({ host: '127.0.0.1', port: guestUplink.port });
					socket.once('connect', () => resolve(socket));
					socket.once('error', reject);
				});
			},
		};

		const manager = new TunnelManager(
			opener,
			{
				services: {
					postgres: {
						enabled: true,
						hostTarget: { host: '127.0.0.1', port: hostTarget.port },
						guestClientPort: 15432,
						guestUplinkPort: guestUplink.port,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			() => {},
		);

		await manager.start();
		await waitFor(() => manager.getStatus()[0]?.openUplinks === 1, 2_000, 25);

		const status = manager.getStatus();
		expect(status[0]?.state).toBe('healthy');

		await manager.stop();
	});

	it('does not retain uplinks when stopped during in-flight connection attempts', async () => {
		const guestUplink = await listenRandomServer();
		const hostTarget = await listenRandomServer();

		const opener: GuestLoopbackStreamOpener = {
			openGuestLoopbackStream: async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
				return await new Promise<net.Socket>((resolve, reject) => {
					const socket = net.createConnection({ host: '127.0.0.1', port: guestUplink.port });
					socket.once('connect', () => resolve(socket));
					socket.once('error', reject);
				});
			},
		};

		const manager = new TunnelManager(
			opener,
			{
				services: {
					postgres: {
						enabled: true,
						hostTarget: { host: '127.0.0.1', port: hostTarget.port },
						guestClientPort: 15432,
						guestUplinkPort: guestUplink.port,
						desiredUplinks: 1,
					},
					redis: {
						enabled: false,
						hostTarget: { host: '127.0.0.1', port: 6379 },
						guestClientPort: 16379,
						guestUplinkPort: 16001,
						desiredUplinks: 1,
					},
				},
			},
			() => {},
		);

		await manager.start();
		await manager.stop();
		await new Promise((resolve) => setTimeout(resolve, 75));

		const status = manager.getStatus();
		expect(status[0]?.openUplinks).toBe(0);
		expect(status[0]?.state).toBe('unhealthy');
	});
});

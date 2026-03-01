import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { DaemonClient, waitForSocket } from '#src/core/infrastructure/daemon-client.js';
import type { DaemonRequest } from '#src/core/models/ipc.js';

interface SocketFixture {
	socketPath: string;
	server: net.Server;
}

const fixtures: SocketFixture[] = [];

function createSocketFixture(onConnection: (socket: net.Socket) => void): Promise<SocketFixture> {
	return new Promise((resolve, reject) => {
		const socketPath = path.join(
			fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-client-')),
			'daemon.sock',
		);
		const server = net.createServer((socket) => {
			socket.setEncoding('utf8');
			onConnection(socket);
		});
		server.once('error', reject);
		server.listen(socketPath, () => {
			const fixture = { socketPath, server };
			fixtures.push(fixture);
			resolve(fixture);
		});
	});
}

afterEach(async () => {
	const cleanup = fixtures.splice(0).map(
		async (fixture) =>
			await new Promise<void>((resolve) => {
				fixture.server.close(() => {
					fs.rmSync(fixture.socketPath, { force: true });
					resolve();
				});
			}),
	);
	await Promise.all(cleanup);
});

describe('daemon client', () => {
	it('parses and forwards daemon responses', async () => {
		const fixture = await createSocketFixture((socket) => {
			socket.once('data', () => {
				const response = {
					kind: 'ack',
					message: 'ok',
				};
				socket.write(`${JSON.stringify(response)}\n`);
			});
		});

		const responses: string[] = [];
		await new Promise<void>((resolve, reject) => {
			const client = new DaemonClient(fixture.socketPath, {
				onResponse: (response) => {
					if (response.kind === 'ack') {
						responses.push(response.message);
						client.close();
					}
				},
				onError: reject,
				onClose: () => resolve(),
			});

			const request: DaemonRequest = { kind: 'status' };
			client.send(request);
		});

		expect(responses).toEqual(['ok']);
	});

	it('reports parse errors for malformed response payloads', async () => {
		const fixture = await createSocketFixture((socket) => {
			socket.once('data', () => {
				socket.write('{"kind":"ack","message":42}\n');
			});
		});

		const errors: string[] = [];
		await new Promise<void>((resolve) => {
			const client = new DaemonClient(fixture.socketPath, {
				onResponse: () => {},
				onError: (error) => {
					errors.push(error.message);
					client.close();
				},
				onClose: () => resolve(),
			});

			client.send({ kind: 'status' });
		});

		expect(errors[0]).toContain('Invalid daemon response');
	});

	it('waitForSocket resolves when unix socket becomes reachable', async () => {
		const socketPath = path.join(
			fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-daemon-client-wait-')),
			'daemon.sock',
		);

		setTimeout(() => {
			const server = net.createServer();
			server.listen(socketPath, () => {
				fixtures.push({ socketPath, server });
			});
		}, 50);

		await expect(waitForSocket(socketPath, 2_000)).resolves.toBeUndefined();
	});
});

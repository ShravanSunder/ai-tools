import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';
import { afterEach, describe, expect, it } from 'vitest';

import { deriveWorkspaceIdentity } from '../../src/core/workspace.js';

const servers: net.Server[] = [];
const pathsToCleanup: string[] = [];

afterEach(async () => {
	await Promise.all(
		servers.splice(0).map(
			(server) =>
				new Promise<void>((resolve) => {
					server.close(() => resolve());
				}),
		),
	);
	for (const target of pathsToCleanup.splice(0)) {
		fs.rmSync(target, { recursive: true, force: true });
	}
});

describe('e2e smoke', () => {
	it('runs built agent-vm-ctl binary against a live unix socket daemon', async () => {
		const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-e2e-'));
		pathsToCleanup.push(workDir);

		const identity = deriveWorkspaceIdentity(workDir);
		fs.mkdirSync(path.dirname(identity.daemonSocketPath), { recursive: true });
		fs.rmSync(identity.daemonSocketPath, { force: true });

		const server = net.createServer((socket) => {
			socket.setEncoding('utf8');
			socket.on('data', (chunk: string) => {
				if (!chunk.includes('"type":"status"')) {
					return;
				}

				socket.write(
					`${JSON.stringify({
						type: 'status.response',
						status: {
							sessionName: identity.sessionName,
							clients: 0,
							idleTimeoutMinutes: 10,
							idleDeadlineEpochMs: null,
							startedAtEpochMs: Date.now(),
							tunnels: [],
							vm: {
								id: 'fake-e2e-vm',
								running: false,
							},
						},
					})}\n`,
				);
			});
		});

		await new Promise<void>((resolve, reject) => {
			server.once('error', reject);
			server.listen(identity.daemonSocketPath, resolve);
		});
		servers.push(server);

		const binPath = path.join(process.cwd(), 'dist', 'bin', 'agent-vm-ctl.js');
		const result = await execa(process.execPath, [binPath, 'status', '--work-dir', workDir], {
			reject: false,
		});

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toContain(identity.sessionName);
		expect(result.stdout).toContain('fake-e2e-vm');
	});
});

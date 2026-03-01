import net from 'node:net';

import type { DaemonRequest, DaemonResponse } from '../types/ipc.js';

export interface DaemonClientCallbacks {
	onResponse: (response: DaemonResponse) => void;
	onError?: (error: Error) => void;
	onClose?: () => void;
}

export class DaemonClient {
	private readonly socket: net.Socket;
	private readBuffer = '';

	public constructor(socketPath: string, callbacks: DaemonClientCallbacks) {
		this.socket = net.createConnection({ path: socketPath });

		this.socket.setEncoding('utf8');
		this.socket.on('data', (chunk: string) => {
			this.readBuffer += chunk;

			while (true) {
				const newlineIndex = this.readBuffer.indexOf('\n');
				if (newlineIndex < 0) {
					break;
				}

				const line = this.readBuffer.slice(0, newlineIndex).trim();
				this.readBuffer = this.readBuffer.slice(newlineIndex + 1);
				if (line.length === 0) {
					continue;
				}

				try {
					const parsed = JSON.parse(line) as DaemonResponse;
					callbacks.onResponse(parsed);
				} catch (error) {
					callbacks.onError?.(error as Error);
				}
			}
		});

		this.socket.on('error', (error) => {
			callbacks.onError?.(error);
		});

		this.socket.on('close', () => {
			callbacks.onClose?.();
		});
	}

	public send(request: DaemonRequest): void {
		const payload = `${JSON.stringify(request)}\n`;
		this.socket.write(payload);
	}

	public close(): void {
		this.socket.end();
	}
}

export async function waitForSocket(socketPath: string, timeoutMs: number): Promise<void> {
	const start = Date.now();

	const probe = async (): Promise<void> => {
		if (Date.now() - start >= timeoutMs) {
			throw new Error(`Timed out waiting for daemon socket: ${socketPath}`);
		}

		try {
			await new Promise<void>((resolve, reject) => {
				const socket = net.createConnection({ path: socketPath });
				socket.once('connect', () => {
					socket.end();
					resolve();
				});
				socket.once('error', reject);
			});
			return;
		} catch {
			await new Promise((resolve) => setTimeout(resolve, 100));
			await probe();
		}
	};

	await probe();
}

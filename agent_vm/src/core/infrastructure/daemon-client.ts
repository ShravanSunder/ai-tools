import net from 'node:net';

import {
	parseDaemonResponseValue,
	type DaemonRequest,
	type DaemonResponse,
} from '#src/core/models/ipc.js';

export interface DaemonClientCallbacks {
	onResponse: (response: DaemonResponse) => void;
	onError: (error: Error) => void;
	onClose: () => void;
}

interface NodeErrorLike {
	code?: string;
}

function toError(input: unknown, context: string): Error {
	if (input instanceof Error) {
		return input;
	}
	return new Error(`${context}: ${String(input)}`);
}

function isNodeErrorLike(input: unknown): input is NodeErrorLike {
	return typeof input === 'object' && input !== null && 'code' in input;
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

				let parsedLine: unknown;
				try {
					parsedLine = JSON.parse(line);
				} catch (error: unknown) {
					callbacks.onError(toError(error, 'Failed to parse daemon response JSON'));
					continue;
				}

				let parsedResponse: DaemonResponse;
				try {
					parsedResponse = parseDaemonResponseValue(parsedLine);
				} catch (error: unknown) {
					callbacks.onError(toError(error, 'Failed to validate daemon response payload'));
					continue;
				}

				try {
					const parsed = parsedResponse;
					callbacks.onResponse(parsed);
				} catch (error: unknown) {
					callbacks.onError(toError(error, 'Daemon response callback failed'));
				}
			}
		});

		this.socket.on('error', (error) => {
			callbacks.onError(toError(error, 'Daemon socket error'));
		});

		this.socket.on('close', () => {
			callbacks.onClose();
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
	while (true) {
		if (Date.now() - start >= timeoutMs) {
			throw new Error(`Timed out waiting for daemon socket: ${socketPath}`);
		}

		try {
			// oxlint-disable-next-line eslint/no-await-in-loop
			await new Promise<void>((resolve, reject) => {
				const socket = net.createConnection({ path: socketPath });
				socket.once('connect', () => {
					socket.end();
					resolve();
				});
				socket.once('error', (error) => reject(toError(error, 'daemon socket probe failed')));
			});
			return;
		} catch (error: unknown) {
			const transient =
				isNodeErrorLike(error) && (error.code === 'ENOENT' || error.code === 'ECONNREFUSED');
			if (!transient) {
				throw toError(error, 'Non-transient daemon socket probe error');
			}
			// oxlint-disable-next-line eslint/no-await-in-loop
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}
}

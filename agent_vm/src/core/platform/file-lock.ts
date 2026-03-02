import fs from 'node:fs';
import path from 'node:path';

export interface FileLockOptions {
	timeoutMs?: number;
	retryDelayMs?: number;
}

interface LockOwnerMetadata {
	pid: number;
	createdAtEpochMs: number;
}

interface AcquiredFileLock {
	fd: number;
	release: () => void;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY_DELAY_MS = 50;

function sleepBlocking(delayMs: number): void {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return typeof error === 'object' && error !== null && 'code' in error;
}

function writeOwnerMetadata(lockFd: number): void {
	const metadata: LockOwnerMetadata = {
		pid: process.pid,
		createdAtEpochMs: Date.now(),
	};
	fs.writeSync(lockFd, `${JSON.stringify(metadata)}\n`, undefined, 'utf8');
}

function readOwnerPid(lockPath: string): number | null {
	try {
		const payload = fs.readFileSync(lockPath, 'utf8').trim();
		if (payload.length === 0) {
			return null;
		}
		const parsed = JSON.parse(payload) as unknown;
		if (typeof parsed !== 'object' || parsed === null || !('pid' in parsed)) {
			return null;
		}
		const pidValue = (parsed as { pid?: unknown }).pid;
		if (typeof pidValue !== 'number' || !Number.isInteger(pidValue) || pidValue <= 0) {
			return null;
		}
		return pidValue;
	} catch {
		return null;
	}
}

function isPidAlive(pid: number): boolean {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error: unknown) {
		if (isErrnoException(error) && error.code === 'ESRCH') {
			return false;
		}
		return true;
	}
}

function acquireFileLock(lockPath: string, options?: FileLockOptions): AcquiredFileLock {
	const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const retryDelayMs = options?.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
	const started = Date.now();

	fs.mkdirSync(path.dirname(lockPath), { recursive: true });

	while (Date.now() - started < timeoutMs) {
		try {
			const lockFd = fs.openSync(lockPath, 'wx', 0o600);
			writeOwnerMetadata(lockFd);
			return {
				fd: lockFd,
				release: () => {
					fs.closeSync(lockFd);
					fs.rmSync(lockPath, { force: true });
				},
			};
		} catch (error: unknown) {
			if (!isErrnoException(error) || error.code !== 'EEXIST') {
				throw new Error(`Failed to acquire lock '${lockPath}': ${String(error)}`, { cause: error });
			}

			const ownerPid = readOwnerPid(lockPath);
			if (ownerPid !== null && !isPidAlive(ownerPid)) {
				fs.rmSync(lockPath, { force: true });
				continue;
			}

			sleepBlocking(retryDelayMs);
		}
	}

	throw new Error(
		`Timed out waiting for lock '${lockPath}'. If no process owns it, remove it manually: rm -f '${lockPath}'`,
	);
}

export function withFileLock<TResult>(
	lockPath: string,
	run: () => TResult,
	options?: FileLockOptions,
): TResult {
	const lock = acquireFileLock(lockPath, options);
	try {
		return run();
	} finally {
		lock.release();
	}
}

export async function withFileLockAsync<TResult>(
	lockPath: string,
	run: () => Promise<TResult>,
	options?: FileLockOptions,
): Promise<TResult> {
	const lock = acquireFileLock(lockPath, options);
	try {
		return await run();
	} finally {
		lock.release();
	}
}

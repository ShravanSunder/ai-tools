import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { Logger } from '#src/core/platform/logger.js';

export interface AuthSyncPaths {
	claude: string;
	codex: string;
	gemini: string;
}

const LOCK_RETRY_DELAY_MS = 50;
const LOCK_TIMEOUT_MS = 10_000;

function pathExists(filePath: string): boolean {
	return fs.existsSync(filePath);
}

function copyDir(sourcePath: string, destPath: string): boolean {
	if (!pathExists(sourcePath)) {
		return false;
	}
	fs.rmSync(destPath, { recursive: true, force: true });
	fs.mkdirSync(path.dirname(destPath), { recursive: true });
	fs.cpSync(sourcePath, destPath, { recursive: true, preserveTimestamps: true });
	return true;
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return typeof error === 'object' && error !== null && 'code' in error;
}

function acquireLock(lockPath: string): number {
	fs.mkdirSync(path.dirname(lockPath), { recursive: true });
	const start = Date.now();
	while (Date.now() - start < LOCK_TIMEOUT_MS) {
		try {
			return fs.openSync(lockPath, 'wx', 0o600);
		} catch (error: unknown) {
			if (!isErrnoException(error) || error.code !== 'EEXIST') {
				throw new Error(`Failed to acquire auth lock at ${lockPath}: ${String(error)}`, {
					cause: error,
				});
			}
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, LOCK_RETRY_DELAY_MS);
		}
	}
	throw new Error(`Timed out waiting for auth lock at ${lockPath}`);
}

function releaseLock(lockFd: number, lockPath: string): void {
	fs.closeSync(lockFd);
	fs.rmSync(lockPath, { force: true });
}

function withLock(lockPath: string, run: () => void): void {
	const lockFd = acquireLock(lockPath);
	try {
		run();
	} finally {
		releaseLock(lockFd, lockPath);
	}
}

function safeReplaceDirectory(sourcePath: string, targetPath: string): void {
	if (!pathExists(sourcePath)) {
		throw new Error(`Cannot replace directory from missing source: ${sourcePath}`);
	}

	const targetParent = path.dirname(targetPath);
	const targetName = path.basename(targetPath);
	fs.mkdirSync(targetParent, { recursive: true });

	const stagingPath = path.join(
		targetParent,
		`.${targetName}.staging.${process.pid}.${Date.now().toString()}`,
	);
	const backupPath = path.join(
		targetParent,
		`.${targetName}.backup.${process.pid}.${Date.now().toString()}`,
	);
	copyDir(sourcePath, stagingPath);

	let backupCreated = false;
	try {
		if (pathExists(targetPath)) {
			fs.renameSync(targetPath, backupPath);
			backupCreated = true;
		}
		fs.renameSync(stagingPath, targetPath);
		if (backupCreated) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
	} catch (error: unknown) {
		fs.rmSync(stagingPath, { recursive: true, force: true });
		if (backupCreated && !pathExists(targetPath) && pathExists(backupPath)) {
			fs.renameSync(backupPath, targetPath);
		}
		throw error;
	}
}

export interface AuthSyncState {
	sessionAuthRoot: string;
	lockPath: string;
}

export class AuthSyncManager {
	public constructor(
		private readonly logger: Logger,
		private readonly homeDir: string = os.homedir(),
	) {}

	public getHostAuthPaths(): AuthSyncPaths {
		return {
			claude: path.join(this.homeDir, '.claude'),
			codex: path.join(this.homeDir, '.codex'),
			gemini: path.join(this.homeDir, '.gemini'),
		};
	}

	public prepareSessionAuthMirror(sessionName: string): AuthSyncState {
		const sessionAuthRoot = path.join(this.homeDir, '.cache', 'agent-vm', 'auth', sessionName);
		const lockPath = path.join(sessionAuthRoot, '.sync.lock');

		withLock(lockPath, () => {
			const host = this.getHostAuthPaths();
			const copiedClaude = copyDir(host.claude, path.join(sessionAuthRoot, '.claude'));
			const copiedCodex = copyDir(host.codex, path.join(sessionAuthRoot, '.codex'));
			const copiedGemini = copyDir(host.gemini, path.join(sessionAuthRoot, '.gemini'));
			this.logger.log('info', 'auth-sync', 'prepared session auth mirror directories', {
				copiedClaude,
				copiedCodex,
				copiedGemini,
			});
		});

		this.logger.log('info', 'auth-sync', 'prepared session auth mirror', { sessionAuthRoot });

		return { sessionAuthRoot, lockPath };
	}

	public copyBackSessionAuthMirror(state: AuthSyncState): void {
		withLock(state.lockPath, () => {
			const host = this.getHostAuthPaths();
			const claudeSource = path.join(state.sessionAuthRoot, '.claude');
			const codexSource = path.join(state.sessionAuthRoot, '.codex');
			const geminiSource = path.join(state.sessionAuthRoot, '.gemini');

			if (pathExists(claudeSource)) {
				safeReplaceDirectory(claudeSource, host.claude);
			}
			if (pathExists(codexSource)) {
				safeReplaceDirectory(codexSource, host.codex);
			}
			if (pathExists(geminiSource)) {
				safeReplaceDirectory(geminiSource, host.gemini);
			}
		});

		this.logger.log('info', 'auth-sync', 'copied back session auth mirror', {
			sessionAuthRoot: state.sessionAuthRoot,
		});
	}

	public exportClaudeOauthFromKeychain(): void {
		if (process.platform !== 'darwin') {
			return;
		}

		const destinationPath = path.join(this.homeDir, '.claude', '.credentials.json');
		const command = 'security find-generic-password -s "Claude Code-credentials" -w';
		try {
			const output = childProcess.execSync(command, {
				stdio: ['ignore', 'pipe', 'ignore'],
				encoding: 'utf8',
			});
			fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
			fs.writeFileSync(destinationPath, output, { mode: 0o600 });
			this.logger.log('info', 'auth-sync', 'exported Claude OAuth from keychain');
		} catch (error: unknown) {
			this.logger.log('warn', 'auth-sync', 'Claude OAuth keychain export unavailable', {
				error: String(error),
			});
		}
	}
}

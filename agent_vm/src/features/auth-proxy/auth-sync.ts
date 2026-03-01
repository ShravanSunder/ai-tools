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

function pathExists(filePath: string): boolean {
	return fs.existsSync(filePath);
}

function copyDir(sourcePath: string, destPath: string): void {
	if (!pathExists(sourcePath)) {
		return;
	}
	fs.rmSync(destPath, { recursive: true, force: true });
	fs.mkdirSync(path.dirname(destPath), { recursive: true });
	fs.cpSync(sourcePath, destPath, { recursive: true, preserveTimestamps: true });
}

function withLock(lockPath: string, run: () => void): void {
	fs.mkdirSync(path.dirname(lockPath), { recursive: true });
	const fd = fs.openSync(lockPath, 'w');
	try {
		run();
	} finally {
		fs.closeSync(fd);
		fs.rmSync(lockPath, { force: true });
	}
}

function safeReplaceDirectory(sourcePath: string, targetPath: string): void {
	const tempPath = `${targetPath}.tmp-${Date.now()}`;
	copyDir(sourcePath, tempPath);
	fs.rmSync(targetPath, { recursive: true, force: true });
	fs.renameSync(tempPath, targetPath);
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
			copyDir(host.claude, path.join(sessionAuthRoot, '.claude'));
			copyDir(host.codex, path.join(sessionAuthRoot, '.codex'));
			copyDir(host.gemini, path.join(sessionAuthRoot, '.gemini'));
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
			}) as string;
			fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
			fs.writeFileSync(destinationPath, output, { mode: 0o600 });
			this.logger.log('info', 'auth-sync', 'exported Claude OAuth from keychain');
		} catch {
			this.logger.log('warn', 'auth-sync', 'Claude OAuth keychain export unavailable');
		}
	}
}

import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { withFileLock } from '#src/core/platform/file-lock.js';
import type { Logger } from '#src/core/platform/logger.js';

export interface AuthSyncPaths {
	claude: string;
	codex: string;
	gemini: string;
}

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

function withLock(lockPath: string, run: () => void): void {
	withFileLock(lockPath, run);
}

interface ReplaceDirectoryResult {
	backupPath: string | null;
}

function safeReplaceDirectory(sourcePath: string, targetPath: string): ReplaceDirectoryResult {
	if (!pathExists(sourcePath)) {
		throw new Error(`Cannot replace directory from missing source: ${sourcePath}`);
	}

	const targetParent = path.dirname(targetPath);
	const targetName = path.basename(targetPath);
	const hiddenTargetName = targetName.startsWith('.') ? targetName : `.${targetName}`;
	fs.mkdirSync(targetParent, { recursive: true });

	const stagingPath = path.join(
		targetParent,
		`${hiddenTargetName}.staging.${process.pid}.${Date.now().toString()}`,
	);
	const backupPath = path.join(
		targetParent,
		`${hiddenTargetName}.backup.${new Date().toISOString().replaceAll(':', '-')}.${process.pid}`,
	);
	copyDir(sourcePath, stagingPath);

	let backupCreated = false;
	try {
		if (pathExists(targetPath)) {
			fs.renameSync(targetPath, backupPath);
			backupCreated = true;
		}
		fs.renameSync(stagingPath, targetPath);
		return { backupPath: backupCreated ? backupPath : null };
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
		const backupPaths: string[] = [];
		withLock(state.lockPath, () => {
			const host = this.getHostAuthPaths();
			const claudeSource = path.join(state.sessionAuthRoot, '.claude');
			const codexSource = path.join(state.sessionAuthRoot, '.codex');
			const geminiSource = path.join(state.sessionAuthRoot, '.gemini');

			if (pathExists(claudeSource)) {
				const result = safeReplaceDirectory(claudeSource, host.claude);
				if (result.backupPath) {
					backupPaths.push(result.backupPath);
				}
			}
			if (pathExists(codexSource)) {
				const result = safeReplaceDirectory(codexSource, host.codex);
				if (result.backupPath) {
					backupPaths.push(result.backupPath);
				}
			}
			if (pathExists(geminiSource)) {
				const result = safeReplaceDirectory(geminiSource, host.gemini);
				if (result.backupPath) {
					backupPaths.push(result.backupPath);
				}
			}
		});

		this.logger.log('info', 'auth-sync', 'copied back session auth mirror', {
			sessionAuthRoot: state.sessionAuthRoot,
			backupPaths,
		});
	}

	public exportClaudeOauthFromKeychain(): void {
		if (process.platform !== 'darwin') {
			return;
		}

		const destinationPath = path.join(this.homeDir, '.claude', '.credentials.json');
		const command = 'security find-generic-password -s "Claude Code-credentials" -w';
		let output = '';
		try {
			output = childProcess.execSync(command, {
				stdio: ['ignore', 'pipe', 'ignore'],
				encoding: 'utf8',
			});
		} catch (error: unknown) {
			this.logger.log('warn', 'auth-sync', 'Claude OAuth keychain export unavailable', {
				error: String(error),
			});
			return;
		}

		try {
			fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
			fs.writeFileSync(destinationPath, output, { mode: 0o600 });
			this.logger.log('info', 'auth-sync', 'exported Claude OAuth from keychain');
		} catch (error: unknown) {
			this.logger.log('error', 'auth-sync', 'Failed to persist Claude OAuth to disk', {
				error: String(error),
				destinationPath,
			});
		}
	}
}

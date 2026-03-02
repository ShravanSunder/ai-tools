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

const LEGACY_AUTH_CACHE_DIRECTORY = path.join('.cache', 'agent-vm', 'auth');
const AUTH_MOUNT_BY_GUEST_PATH: Readonly<Record<string, keyof AuthSyncPaths>> = {
	'/home/agent/.claude': 'claude',
	'/home/agent/.codex': 'codex',
	'/home/agent/.gemini': 'gemini',
};

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

	public getReadonlyAuthMounts(): Readonly<Record<string, string>> {
		const hostAuthPaths = this.getHostAuthPaths();
		const mounts: Record<string, string> = {};

		for (const [guestPath, hostKey] of Object.entries(AUTH_MOUNT_BY_GUEST_PATH)) {
			const hostPath = hostAuthPaths[hostKey];
			if (!fs.existsSync(hostPath)) {
				continue;
			}
			mounts[guestPath] = hostPath;
		}

		return mounts;
	}

	public cleanupLegacyAuthCache(): void {
		const legacyCachePath = path.join(this.homeDir, LEGACY_AUTH_CACHE_DIRECTORY);
		if (!fs.existsSync(legacyCachePath)) {
			return;
		}

		try {
			fs.rmSync(legacyCachePath, { recursive: true, force: true });
			this.logger.log('info', 'auth-sync', 'deleted legacy per-session auth cache', {
				legacyCachePath,
			});
		} catch (error: unknown) {
			this.logger.log('warn', 'auth-sync', 'failed to delete legacy auth cache', {
				legacyCachePath,
				error: String(error),
			});
		}
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

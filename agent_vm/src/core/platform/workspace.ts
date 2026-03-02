import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { WorkspaceIdentity } from '#src/core/models/config.js';

function sanitizeRepoName(name: string): string {
	const sanitized = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return sanitized.length > 0 ? sanitized : 'workspace';
}

function toSessionSafeRepoSegment(repoName: string): string {
	const MAX_SEGMENT_LENGTH = 24;
	if (repoName.length <= MAX_SEGMENT_LENGTH) {
		return repoName;
	}
	return repoName.slice(0, MAX_SEGMENT_LENGTH);
}

export function deriveWorkspaceIdentity(workDir: string): WorkspaceIdentity {
	const resolved = path.resolve(workDir);
	const normalized = (() => {
		try {
			return fs.realpathSync.native(resolved);
		} catch {
			try {
				return fs.realpathSync(resolved);
			} catch {
				return resolved;
			}
		}
	})();
	const repoName = sanitizeRepoName(path.basename(normalized));
	const dirHash = crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
	const sessionRepoSegment = toSessionSafeRepoSegment(repoName);
	const sessionName = `agent-vm-${sessionRepoSegment}-${dirHash}`;
	const daemonSocketPath = path.join(os.tmpdir(), `${sessionName}.sock`);
	const daemonLogPath = path.join(os.homedir(), '.cache', 'agent-vm', 'logs', `${sessionName}.log`);

	return {
		workDir: normalized,
		repoName,
		dirHash,
		sessionName,
		daemonSocketPath,
		daemonLogPath,
	};
}

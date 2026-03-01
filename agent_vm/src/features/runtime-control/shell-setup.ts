import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function copyDirectoryIfExists(sourcePath: string, targetPath: string): void {
	if (!fs.existsSync(sourcePath)) {
		return;
	}
	fs.mkdirSync(path.dirname(targetPath), { recursive: true });
	fs.cpSync(sourcePath, targetPath, { recursive: true, preserveTimestamps: true });
}

export function ensureAtuinImportedOnFirstRun(shellHistoryVolumeDir: string): void {
	const markerPath = path.join(shellHistoryVolumeDir, '.initialized');
	if (fs.existsSync(markerPath)) {
		return;
	}

	fs.mkdirSync(shellHistoryVolumeDir, { recursive: true });
	const hostHome = os.homedir();
	copyDirectoryIfExists(
		path.join(hostHome, '.config', 'atuin'),
		path.join(shellHistoryVolumeDir, 'atuin-config'),
	);
	copyDirectoryIfExists(
		path.join(hostHome, '.local', 'share', 'atuin'),
		path.join(shellHistoryVolumeDir, 'atuin-data'),
	);
	fs.writeFileSync(markerPath, `${new Date().toISOString()}\n`, 'utf8');
}

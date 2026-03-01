import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getAgentVmRoot(): string {
	const selfDir = path.dirname(fileURLToPath(import.meta.url));
	return path.resolve(selfDir, '../../');
}

export function getGeneratedStateDir(workDir: string): string {
	return path.join(workDir, '.agent_vm', '.generated');
}

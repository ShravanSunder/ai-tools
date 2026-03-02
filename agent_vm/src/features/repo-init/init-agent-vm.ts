import fs from 'node:fs';
import path from 'node:path';

import { execaSync } from 'execa';

import { getAgentVmRoot } from '#src/core/platform/paths.js';

export type InitMode = 'default' | 'repo-only' | 'local-only' | 'sync-docs';

export interface InitAgentVmOptions {
	readonly workDir: string;
	readonly mode: InitMode;
	readonly override: boolean;
}

function resolveTargetDirectory(workDir: string): string {
	return path.join(workDir, '.agent_vm');
}

function copyTemplate(sourcePath: string, targetPath: string, override: boolean): void {
	if (!override && fs.existsSync(targetPath)) {
		return;
	}
	fs.mkdirSync(path.dirname(targetPath), { recursive: true });
	fs.cpSync(sourcePath, targetPath);
}

function syncRepoFiles(templateRoot: string, targetRoot: string, override: boolean): void {
	copyTemplate(
		path.join(templateRoot, 'build.project.json'),
		path.join(targetRoot, 'build.project.json'),
		override,
	);
	copyTemplate(
		path.join(templateRoot, 'vm-runtime.repo.json'),
		path.join(targetRoot, 'vm-runtime.repo.json'),
		override,
	);
	copyTemplate(
		path.join(templateRoot, 'tcp-services.repo.json'),
		path.join(targetRoot, 'tcp-services.repo.json'),
		override,
	);
	copyTemplate(
		path.join(templateRoot, 'policy-allowlist-extra.repo.txt'),
		path.join(targetRoot, 'policy-allowlist-extra.repo.txt'),
		override,
	);
}

function syncLocalFiles(templateRoot: string, targetRoot: string, override: boolean): void {
	copyTemplate(
		path.join(templateRoot, 'vm-runtime.local.json'),
		path.join(targetRoot, 'vm-runtime.local.json'),
		override,
	);
	copyTemplate(
		path.join(templateRoot, 'tcp-services.local.json'),
		path.join(targetRoot, 'tcp-services.local.json'),
		override,
	);
	copyTemplate(
		path.join(templateRoot, 'policy-allowlist-extra.local.txt'),
		path.join(targetRoot, 'policy-allowlist-extra.local.txt'),
		override,
	);
}

function resolveRepoRootFromWorkDir(workDir: string): string {
	try {
		const result = execaSync('git', ['rev-parse', '--show-toplevel'], {
			cwd: workDir,
			reject: false,
		});
		if (result.exitCode === 0) {
			const parsed = result.stdout.trim();
			if (parsed.length > 0) {
				return parsed;
			}
		}
	} catch {
		// Fall back to provided directory if git is unavailable.
	}
	return workDir;
}

export function initializeAgentVm(options: InitAgentVmOptions): void {
	const agentVmRoot = getAgentVmRoot();
	const templateRoot = path.join(agentVmRoot, 'templates', '.agent_vm');
	const targetRoot = resolveTargetDirectory(resolveRepoRootFromWorkDir(options.workDir));
	const docSourcePath = path.join(agentVmRoot, 'INSTRUCTIONS.md');
	const docTargetPath = path.join(targetRoot, 'INSTRUCTIONS.md');

	fs.mkdirSync(targetRoot, { recursive: true });
	fs.mkdirSync(path.join(targetRoot, '.generated'), { recursive: true });

	if (options.mode === 'default' || options.mode === 'repo-only') {
		syncRepoFiles(templateRoot, targetRoot, options.override);
	}

	if (options.mode === 'default' || options.mode === 'local-only') {
		syncLocalFiles(templateRoot, targetRoot, options.override);
	}

	copyTemplate(
		path.join(templateRoot, '.gitignore'),
		path.join(targetRoot, '.gitignore'),
		options.override,
	);
	fs.cpSync(docSourcePath, docTargetPath);

	process.stdout.write(`Initialized ${targetRoot} (${options.mode})\n`);
	process.stdout.write('Next steps:\n');
	process.stdout.write('  1. Review .agent_vm/build.project.json and vm-runtime.repo.json\n');
	process.stdout.write(`  2. Run: pnpm --dir "${agentVmRoot}" build\n`);
	process.stdout.write('  3. Start VM: agent_vm.sh run --no-run\n');
}

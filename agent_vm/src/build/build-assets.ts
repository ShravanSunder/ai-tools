import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';

import { getAgentVmRoot } from '#src/core/platform/paths.js';

export interface BuildAssetsOptions {
	outputDir: string;
	fullReset: boolean;
}

function resolveGondolinBinPath(): string {
	const root = getAgentVmRoot();
	const localBin = path.join(root, 'node_modules', '.bin', 'gondolin');
	if (fs.existsSync(localBin)) {
		return localBin;
	}

	const hoistedBin = path.resolve(root, '..', 'node_modules', '.bin', 'gondolin');
	if (fs.existsSync(hoistedBin)) {
		return hoistedBin;
	}

	throw new Error(
		'gondolin CLI not found. Install @earendil-works/gondolin and run pnpm install.',
	);
}

export async function buildDebianGuestAssets(options: BuildAssetsOptions): Promise<void> {
	const root = getAgentVmRoot();
	const configPath = path.join(root, 'config', 'build.debian.json');

	if (options.fullReset && fs.existsSync(options.outputDir)) {
		fs.rmSync(options.outputDir, { recursive: true, force: true });
	}

	fs.mkdirSync(options.outputDir, { recursive: true });

	const gondolinBin = resolveGondolinBinPath();
	await execa(gondolinBin, ['build', '--config', configPath, '--output', options.outputDir], {
		stdio: 'inherit',
	});
}

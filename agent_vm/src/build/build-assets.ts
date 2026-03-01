import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';

import { getAgentVmRoot } from '../core/paths.js';

export interface BuildAssetsOptions {
  outputDir: string;
  fullReset: boolean;
}

export async function buildDebianGuestAssets(options: BuildAssetsOptions): Promise<void> {
  const root = getAgentVmRoot();
  const configPath = path.join(root, 'config', 'build.debian.json');

  if (options.fullReset && fs.existsSync(options.outputDir)) {
    fs.rmSync(options.outputDir, { recursive: true, force: true });
  }

  fs.mkdirSync(options.outputDir, { recursive: true });

  await execa('gondolin', ['build', '--config', configPath, '--output', options.outputDir], {
    stdio: 'inherit',
  });
}

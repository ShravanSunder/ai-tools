import { execa } from 'execa';

import type { BuildConfig } from '#src/core/models/build-config.js';

type OciOverlayConfig = NonNullable<BuildConfig['ociOverlay']>;

interface CommandResult {
	readonly exitCode: number;
	readonly stdout: string;
	readonly stderr: string;
}

interface OciOverlayBuilderDependencies {
	runCommand: (command: string, args: readonly string[]) => Promise<CommandResult>;
}

export interface OverlayBuildInput {
	readonly overlayConfig: OciOverlayConfig;
	readonly fingerprintSeed: string;
}

export interface OverlayBuildResult {
	readonly imageRef: string;
	readonly digest: string;
}

const DEFAULT_DEPENDENCIES: OciOverlayBuilderDependencies = {
	runCommand: async (
		command: string,
		args: readonly string[],
	): Promise<CommandResult> => {
		const result = await execa(command, [...args], { reject: false });
		return {
			exitCode: result.exitCode ?? 1,
			stdout: result.stdout,
			stderr: result.stderr,
		};
	},
};

function assertCommandSuccess(
	command: string,
	args: readonly string[],
	result: CommandResult,
): void {
	if (result.exitCode === 0) {
		return;
	}
	throw new Error(
		`Command failed (${command} ${args.join(' ')}): ${result.stderr || result.stdout || `exit ${String(result.exitCode)}`}`,
	);
}

function buildOverlayTag(fingerprintSeed: string): string {
	const sanitized = fingerprintSeed
		.trim()
		.toLowerCase()
		.replaceAll(/[^a-z0-9]/gu, '')
		.slice(0, 16);
	const suffix = sanitized.length > 0 ? sanitized : 'overlay';
	return `agent-vm-overlay:${suffix}`;
}

function buildDockerBuildArgs(overlayConfig: OciOverlayConfig): string[] {
	const buildArgs: string[] = [];
	buildArgs.push('--build-arg', `BASE_IMAGE=${overlayConfig.baseImage}`);
	for (const [key, value] of Object.entries(overlayConfig.buildArgs).sort(([left], [right]) =>
		left.localeCompare(right),
	)) {
		buildArgs.push('--build-arg', `${key}=${value}`);
	}
	return buildArgs;
}

function parseDockerImageId(raw: string): string {
	const digest = raw.trim();
	if (!/^sha256:[a-f0-9]{64}$/u.test(digest)) {
		throw new Error(`docker image inspect returned unexpected image id: '${raw}'`);
	}
	return digest;
}

function parseRepoDigest(raw: string): string | null {
	const parsed = JSON.parse(raw) as unknown;
	if (!Array.isArray(parsed)) {
		return null;
	}

	for (const entry of parsed) {
		if (typeof entry !== 'string') {
			continue;
		}
		const atIndex = entry.lastIndexOf('@');
		if (atIndex <= 0) {
			continue;
		}
		const digest = entry.slice(atIndex + 1);
		if (!/^sha256:[a-f0-9]{64}$/u.test(digest)) {
			continue;
		}
		return digest;
	}

	return null;
}

function parseInspectOutput(raw: string, fallbackTag: string): OverlayBuildResult {
	const separatorIndex = raw.indexOf('|');
	if (separatorIndex < 0) {
		throw new Error(`docker image inspect returned unexpected payload: '${raw}'`);
	}

	const repoDigestsRaw = raw.slice(0, separatorIndex).trim();
	const imageIdRaw = raw.slice(separatorIndex + 1).trim();
	const digest = parseRepoDigest(repoDigestsRaw) ?? parseDockerImageId(imageIdRaw);
	return {
		imageRef: fallbackTag,
		digest,
	};
}

export async function buildOverlayImageAndResolveDigest(
	input: OverlayBuildInput,
	dependencies: OciOverlayBuilderDependencies = DEFAULT_DEPENDENCIES,
): Promise<OverlayBuildResult> {
	const overlayTag = buildOverlayTag(input.fingerprintSeed);
	const buildArgs = buildDockerBuildArgs(input.overlayConfig);

	const buildCommandArgs = [
		'buildx',
		'build',
		'--load',
		'--file',
		input.overlayConfig.dockerfile,
		'--tag',
		overlayTag,
		...buildArgs,
		...(input.overlayConfig.target ? ['--target', input.overlayConfig.target] : []),
		input.overlayConfig.contextDir,
	];
	const buildResult = await dependencies.runCommand('docker', buildCommandArgs);
	assertCommandSuccess('docker', buildCommandArgs, buildResult);

	const inspectCommandArgs = [
		'image',
		'inspect',
		'--format',
		'{{json .RepoDigests}}|{{.Id}}',
		overlayTag,
	];
	const inspectResult = await dependencies.runCommand('docker', inspectCommandArgs);
	assertCommandSuccess('docker', inspectCommandArgs, inspectResult);

	return parseInspectOutput(inspectResult.stdout, overlayTag);
}

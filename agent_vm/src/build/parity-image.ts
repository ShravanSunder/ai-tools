import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';

import { getAgentVmRoot } from '#src/core/platform/paths.js';

const PARITY_BASE_IMAGE_TAG = 'agent-sidecar-base:node-py';
const PARITY_SOURCE_HASH_LABEL = 'io.agent-vm.parity-source-hash';
const SIDECAR_BASE_DOCKERFILE_RELATIVE = path.join('agent_sidecar', 'node-py.base.dockerfile');
const SIDECAR_CONTEXT_DIR_RELATIVE = 'agent_sidecar';
const SIDECAR_BASE_ZSHRC_RELATIVE = path.join('agent_sidecar', 'setup', 'extra.base.zshrc');
const SIDECAR_DOCKERIGNORE_RELATIVE = path.join('agent_sidecar', '.dockerignore');
const SIDECAR_PLAYWRIGHT_WRAPPER_RELATIVE = path.join(
	'agent_sidecar',
	'setup',
	'playwright-wrapper.sh',
);
const SIDECAR_FIREWALL_SCRIPT_RELATIVE = path.join('agent_sidecar', 'setup', 'firewall.sh');
const PARITY_OVERLAY_DOCKERFILE_RELATIVE = path.join(
	'config',
	'parity',
	'agent-vm-parity.overlay.dockerfile',
);
const PARITY_EXTRA_ZSHRC_RELATIVE = path.join('config', 'parity', 'extra.base.zshrc');

interface CommandResult {
	readonly exitCode: number;
	readonly stdout: string;
	readonly stderr: string;
}

interface ParityImageDependencies {
	readonly runCommand: (command: string, args: readonly string[]) => Promise<CommandResult>;
	readonly getAgentVmRoot: () => string;
}

const DEFAULT_DEPENDENCIES: ParityImageDependencies = {
	runCommand: async (command: string, args: readonly string[]): Promise<CommandResult> => {
		const result = await execa(command, [...args], { reject: false });
		return {
			exitCode: result.exitCode ?? 1,
			stdout: result.stdout,
			stderr: result.stderr,
		};
	},
	getAgentVmRoot,
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

function parseImageDigest(raw: string): string {
	const digest = raw.trim();
	if (!/^sha256:[a-f0-9]{64}$/u.test(digest)) {
		throw new Error(`docker image inspect returned unexpected image id: '${raw}'`);
	}
	return digest;
}

interface ParitySourceInput {
	readonly logicalPath: string;
	readonly filePath: string;
}

function normalizeLogicalPath(logicalPath: string): string {
	const asPosixPath = logicalPath.replaceAll('\\', '/');
	const normalized = path.posix.normalize(asPosixPath);
	if (normalized.length === 0 || normalized === '.' || normalized.startsWith('../') || normalized === '..') {
		throw new Error(`Invalid parity source logical path: '${logicalPath}'`);
	}
	if (path.posix.isAbsolute(normalized)) {
		throw new Error(`Parity source logical path must be relative: '${logicalPath}'`);
	}
	return normalized;
}

function normalizeParitySourceInputs(
	inputs: readonly ParitySourceInput[],
): readonly ParitySourceInput[] {
	const entriesByLogicalPath = new Map<string, string>();
	for (const input of inputs) {
		const logicalPath = normalizeLogicalPath(input.logicalPath);
		const filePath = path.resolve(input.filePath);
		entriesByLogicalPath.set(logicalPath, filePath);
	}
	return [...entriesByLogicalPath.entries()]
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([logicalPath, filePath]) => ({ logicalPath, filePath }));
}

interface ParsedInspectPayload {
	readonly imageDigest: string;
	readonly paritySourceHashLabel: string | null;
}

function parseInspectPayload(raw: string): ParsedInspectPayload {
	const separatorIndex = raw.indexOf('|');
	if (separatorIndex < 0) {
		throw new Error(`docker image inspect returned unexpected payload: '${raw}'`);
	}

	const imageDigestRaw = raw.slice(0, separatorIndex).trim();
	const paritySourceHashRaw = raw.slice(separatorIndex + 1).trim();
	const paritySourceHashLabel =
		paritySourceHashRaw.length === 0 || paritySourceHashRaw === '<no value>'
			? null
			: paritySourceHashRaw;

	return {
		imageDigest: parseImageDigest(imageDigestRaw),
		paritySourceHashLabel,
	};
}

export function computeParitySourceHash(inputPaths: readonly ParitySourceInput[]): string {
	const normalizedInputs = normalizeParitySourceInputs(inputPaths);
	const hasher = crypto.createHash('sha256');

	for (const input of normalizedInputs) {
		if (!fs.existsSync(input.filePath)) {
			throw new Error(`Missing parity source input: ${input.filePath}`);
		}
		hasher.update(input.logicalPath);
		hasher.update('\u0000');
		hasher.update(fs.readFileSync(input.filePath));
		hasher.update('\u0000');
	}

	return hasher.digest('hex').slice(0, 16);
}

export function resolveParitySourceInputs(agentVmRoot: string): readonly ParitySourceInput[] {
	const repositoryRoot = path.resolve(agentVmRoot, '..');
	return [
		{
			logicalPath: 'agent_sidecar/node-py.base.dockerfile',
			filePath: path.join(repositoryRoot, SIDECAR_BASE_DOCKERFILE_RELATIVE),
		},
		{
			logicalPath: 'agent_sidecar/setup/extra.base.zshrc',
			filePath: path.join(repositoryRoot, SIDECAR_BASE_ZSHRC_RELATIVE),
		},
		{
			logicalPath: 'agent_sidecar/.dockerignore',
			filePath: path.join(repositoryRoot, SIDECAR_DOCKERIGNORE_RELATIVE),
		},
		{
			logicalPath: 'agent_sidecar/setup/playwright-wrapper.sh',
			filePath: path.join(repositoryRoot, SIDECAR_PLAYWRIGHT_WRAPPER_RELATIVE),
		},
		{
			logicalPath: 'agent_sidecar/setup/firewall.sh',
			filePath: path.join(repositoryRoot, SIDECAR_FIREWALL_SCRIPT_RELATIVE),
		},
		{
			logicalPath: 'agent_vm/config/parity/agent-vm-parity.overlay.dockerfile',
			filePath: path.join(agentVmRoot, PARITY_OVERLAY_DOCKERFILE_RELATIVE),
		},
		{
			logicalPath: 'agent_vm/config/parity/extra.base.zshrc',
			filePath: path.join(agentVmRoot, PARITY_EXTRA_ZSHRC_RELATIVE),
		},
	];
}

export interface EnsuredParityBaseImage {
	readonly imageTag: string;
	readonly imageDigest: string;
	readonly sourceHash: string;
	readonly rebuilt: boolean;
}

export async function ensureParityBaseImage(
	dependencies: ParityImageDependencies = DEFAULT_DEPENDENCIES,
): Promise<EnsuredParityBaseImage> {
	const agentVmRoot = dependencies.getAgentVmRoot();
	const repositoryRoot = path.resolve(agentVmRoot, '..');
	const sidecarDockerfilePath = path.join(repositoryRoot, SIDECAR_BASE_DOCKERFILE_RELATIVE);
	const sidecarContextDir = path.join(repositoryRoot, SIDECAR_CONTEXT_DIR_RELATIVE);
	if (!fs.existsSync(sidecarDockerfilePath)) {
		throw new Error(
			`Missing sidecar dockerfile source: ${sidecarDockerfilePath}. Expected '${SIDECAR_BASE_DOCKERFILE_RELATIVE}' to exist before building parity base image.`,
		);
	}

	const sourceHash = computeParitySourceHash(resolveParitySourceInputs(agentVmRoot));

	const inspectArgs = [
		'image',
		'inspect',
		'--format',
		`{{.Id}}|{{with .Config.Labels}}{{index . "${PARITY_SOURCE_HASH_LABEL}"}}{{end}}`,
		PARITY_BASE_IMAGE_TAG,
	];
	let inspectResult = await dependencies.runCommand('docker', inspectArgs);
	const needsRebuild =
		inspectResult.exitCode !== 0 ||
		parseInspectPayload(inspectResult.stdout).paritySourceHashLabel !== sourceHash;
	if (needsRebuild) {
		const buildArgs = [
			'build',
			'--file',
			sidecarDockerfilePath,
			'--tag',
			PARITY_BASE_IMAGE_TAG,
			'--label',
			`${PARITY_SOURCE_HASH_LABEL}=${sourceHash}`,
			sidecarContextDir,
		];
		const buildResult = await dependencies.runCommand('docker', buildArgs);
		assertCommandSuccess('docker', buildArgs, buildResult);

		inspectResult = await dependencies.runCommand('docker', inspectArgs);
		assertCommandSuccess('docker', inspectArgs, inspectResult);
	}

	const inspectPayload = parseInspectPayload(inspectResult.stdout);
	if (inspectPayload.paritySourceHashLabel !== sourceHash) {
		throw new Error(
			`Parity base image '${PARITY_BASE_IMAGE_TAG}' is missing expected '${PARITY_SOURCE_HASH_LABEL}' label '${sourceHash}'.`,
		);
	}
	return {
		imageTag: PARITY_BASE_IMAGE_TAG,
		imageDigest: inspectPayload.imageDigest,
		sourceHash,
		rebuilt: needsRebuild,
	};
}

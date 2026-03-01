import { z } from 'zod';

const architectureSchema = z.enum(['aarch64', 'x86_64']);
const distroSchema = z.enum(['alpine', 'nixos']);
const rootfsModeSchema = z.enum(['readonly', 'memory', 'cow']);
const pullPolicySchema = z.enum(['if-not-present', 'always', 'never']);
const containerRuntimeSchema = z.enum(['docker', 'podman']);

const envInputSchema = z.union([z.array(z.string()), z.record(z.string(), z.string())]);

const ociRootfsSchema = z.object({
	image: z.string().trim().min(1),
	runtime: containerRuntimeSchema.optional(),
	platform: z.string().trim().min(1).optional(),
	pullPolicy: pullPolicySchema.optional(),
});

const postBuildSchema = z.object({
	commands: z.array(z.string().trim().min(1)).optional(),
});

const initSchema = z.object({
	rootfsInit: z.string().trim().min(1).optional(),
	initramfsInit: z.string().trim().min(1).optional(),
	rootfsInitExtra: z.string().trim().min(1).optional(),
});

const rootfsSchema = z.object({
	label: z.string().trim().min(1).optional(),
	sizeMb: z.number().int().positive().optional(),
});

const runtimeDefaultsSchema = z.object({
	rootfsMode: rootfsModeSchema.optional(),
});

const containerSchema = z.object({
	force: z.boolean().optional(),
	image: z.string().trim().min(1).optional(),
	runtime: containerRuntimeSchema.optional(),
});

export const buildConfigInputSchema = z.object({
	arch: architectureSchema.optional(),
	distro: distroSchema.optional(),
	env: envInputSchema.optional(),
	oci: ociRootfsSchema.optional(),
	postBuild: postBuildSchema.optional(),
	init: initSchema.optional(),
	rootfs: rootfsSchema.optional(),
	runtimeDefaults: runtimeDefaultsSchema.optional(),
	container: containerSchema.optional(),
});

export const buildConfigSchema = buildConfigInputSchema.extend({
	arch: architectureSchema,
	distro: distroSchema,
});

export type BuildConfigInput = z.input<typeof buildConfigInputSchema>;
export type BuildConfig = z.output<typeof buildConfigSchema>;

function isStringRecord(value: unknown): value is Record<string, string> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}
	return Object.values(value).every((entry) => typeof entry === 'string');
}

function mergeEnvInput(
	baseEnv: BuildConfigInput['env'],
	projectEnv: BuildConfigInput['env'],
): BuildConfigInput['env'] {
	if (projectEnv === undefined) {
		return baseEnv;
	}
	if (baseEnv === undefined) {
		return projectEnv;
	}
	if (isStringRecord(baseEnv) && isStringRecord(projectEnv)) {
		return {
			...baseEnv,
			...projectEnv,
		};
	}
	return projectEnv;
}

export function parseBuildConfig(input: unknown): BuildConfig {
	return buildConfigSchema.parse(input);
}

export function parseBuildConfigInput(input: unknown): BuildConfigInput {
	return buildConfigInputSchema.parse(input);
}

export function mergeBuildConfigs(
	base: BuildConfigInput,
	project: BuildConfigInput,
): BuildConfigInput {
	const mergedCommands = [
		...(base.postBuild?.commands ?? []),
		...(project.postBuild?.commands ?? []),
	];

	return {
		arch: project.arch ?? base.arch,
		distro: project.distro ?? base.distro,
		env: mergeEnvInput(base.env, project.env),
		oci: project.oci ? { ...base.oci, ...project.oci } : base.oci,
		postBuild:
			mergedCommands.length > 0
				? {
						commands: mergedCommands,
					}
				: undefined,
		init: project.init ? { ...base.init, ...project.init } : base.init,
		rootfs: project.rootfs ? { ...base.rootfs, ...project.rootfs } : base.rootfs,
		runtimeDefaults: project.runtimeDefaults
			? { ...base.runtimeDefaults, ...project.runtimeDefaults }
			: base.runtimeDefaults,
		container: project.container ? { ...base.container, ...project.container } : base.container,
	};
}

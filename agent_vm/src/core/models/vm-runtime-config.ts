import { z } from 'zod';

const rootfsModeSchema = z.enum(['readonly', 'memory', 'cow']);

const volumeEntrySchema = z.object({
	guestPath: z.string().trim().min(1),
});

const shadowsSchema = z.object({
	deny: z.array(z.string().trim().min(1)).default([]),
	tmpfs: z.array(z.string().trim().min(1)).default([]),
});

const initScriptsSchema = z.object({
	background: z.string().trim().min(1).nullable().default(null),
	foreground: z.string().trim().min(1).nullable().default(null),
});

const shellSchema = z.object({
	zshrcExtra: z.string().trim().min(1).nullable().default(null),
	atuin: z
		.object({
			importOnFirstRun: z.boolean().default(true),
		})
		.default({ importOnFirstRun: true }),
});

export const vmRuntimeConfigInputSchema = z.object({
	rootfsMode: rootfsModeSchema.optional(),
	memory: z.number().int().positive().optional(),
	cpus: z.number().int().positive().optional(),
	idleTimeoutMinutes: z.number().int().positive().optional(),
	env: z.record(z.string(), z.string()).optional(),
	volumes: z.record(z.string(), volumeEntrySchema).optional(),
	shadows: shadowsSchema.partial().optional(),
	readonlyMounts: z.record(z.string(), z.string()).optional(),
	extraMounts: z.record(z.string(), z.string()).optional(),
	monorepoDiscovery: z.boolean().optional(),
	initScripts: initScriptsSchema.partial().optional(),
	shell: shellSchema.partial().optional(),
	playwrightExtraHosts: z.array(z.string()).optional(),
});

export const vmRuntimeConfigSchema = z.object({
	rootfsMode: rootfsModeSchema.default('cow'),
	memory: z.number().int().positive().default(2048),
	cpus: z.number().int().positive().default(2),
	idleTimeoutMinutes: z.number().int().positive().default(10),
	env: z.record(z.string(), z.string()).default({}),
	volumes: z.record(z.string(), volumeEntrySchema).default({}),
	shadows: shadowsSchema.default({ deny: [], tmpfs: [] }),
	readonlyMounts: z.record(z.string(), z.string()).default({}),
	extraMounts: z.record(z.string(), z.string()).default({}),
	monorepoDiscovery: z.boolean().default(true),
	initScripts: initScriptsSchema.default({ background: null, foreground: null }),
	shell: shellSchema.default({
		zshrcExtra: null,
		atuin: { importOnFirstRun: true },
	}),
	playwrightExtraHosts: z.array(z.string()).default([]),
});

export type VmRuntimeConfigInput = z.input<typeof vmRuntimeConfigInputSchema>;
export type VmRuntimeConfig = z.output<typeof vmRuntimeConfigSchema>;

function mergeShadows(
	baseShadows: VmRuntimeConfigInput['shadows'],
	overlayShadows: VmRuntimeConfigInput['shadows'],
): VmRuntimeConfigInput['shadows'] {
	if (!overlayShadows) {
		return baseShadows;
	}
	return {
		deny: overlayShadows.deny ?? baseShadows?.deny,
		tmpfs: overlayShadows.tmpfs ?? baseShadows?.tmpfs,
	};
}

function mergeInitScripts(
	baseScripts: VmRuntimeConfigInput['initScripts'],
	overlayScripts: VmRuntimeConfigInput['initScripts'],
): VmRuntimeConfigInput['initScripts'] {
	if (!overlayScripts) {
		return baseScripts;
	}
	return {
		background: overlayScripts.background ?? baseScripts?.background,
		foreground: overlayScripts.foreground ?? baseScripts?.foreground,
	};
}

function mergeShellConfig(
	baseShell: VmRuntimeConfigInput['shell'],
	overlayShell: VmRuntimeConfigInput['shell'],
): VmRuntimeConfigInput['shell'] {
	if (!overlayShell) {
		return baseShell;
	}
	return {
		zshrcExtra: overlayShell.zshrcExtra ?? baseShell?.zshrcExtra,
		atuin: overlayShell.atuin
			? {
					importOnFirstRun:
						overlayShell.atuin.importOnFirstRun ?? baseShell?.atuin?.importOnFirstRun,
				}
			: baseShell?.atuin,
	};
}

export function parseVmRuntimeConfig(input: unknown): VmRuntimeConfig {
	return vmRuntimeConfigSchema.parse(input);
}

export function parseVmRuntimeConfigInput(input: unknown): VmRuntimeConfigInput {
	return vmRuntimeConfigInputSchema.parse(input);
}

export function mergeVmRuntimeConfigs(
	base: VmRuntimeConfigInput,
	repo?: VmRuntimeConfigInput,
	local?: VmRuntimeConfigInput,
): VmRuntimeConfigInput {
	const overlays = [repo, local].filter(overlayCandidate) as readonly VmRuntimeConfigInput[];

	const merged: VmRuntimeConfigInput = { ...base };

	for (const overlay of overlays) {
		merged.rootfsMode = overlay.rootfsMode ?? merged.rootfsMode;
		merged.memory = overlay.memory ?? merged.memory;
		merged.cpus = overlay.cpus ?? merged.cpus;
		merged.idleTimeoutMinutes = overlay.idleTimeoutMinutes ?? merged.idleTimeoutMinutes;
		merged.monorepoDiscovery = overlay.monorepoDiscovery ?? merged.monorepoDiscovery;

		merged.env = { ...merged.env, ...overlay.env };
		merged.volumes = { ...merged.volumes, ...overlay.volumes };
		merged.shadows = mergeShadows(merged.shadows, overlay.shadows);
		merged.readonlyMounts = {
			...merged.readonlyMounts,
			...overlay.readonlyMounts,
		};
		merged.extraMounts = {
			...merged.extraMounts,
			...overlay.extraMounts,
		};
		merged.initScripts = mergeInitScripts(merged.initScripts, overlay.initScripts);
		merged.shell = mergeShellConfig(merged.shell, overlay.shell);
		merged.playwrightExtraHosts = overlay.playwrightExtraHosts ?? merged.playwrightExtraHosts;
	}

	return merged;
}

function overlayCandidate(value: VmRuntimeConfigInput | undefined): value is VmRuntimeConfigInput {
	return value !== undefined;
}

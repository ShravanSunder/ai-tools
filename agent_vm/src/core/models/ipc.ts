import { z } from 'zod';

import { TUNNEL_HEALTH_STATES, TUNNEL_SERVICE_NAMES } from '#src/core/models/config.js';

const daemonStatusSchema = z.object({
	sessionName: z.string(),
	clients: z.number().int().nonnegative(),
	idleTimeoutMinutes: z.number().int().positive(),
	idleDeadlineEpochMs: z.number().int().nonnegative().nullable(),
	startedAtEpochMs: z.number().int().nonnegative(),
	tunnels: z
		.array(
			z.object({
				name: z.string(),
				desiredUplinks: z.number().int().nonnegative(),
				openUplinks: z.number().int().nonnegative(),
				hostTarget: z.object({
					host: z.string(),
					port: z.number().int().positive(),
				}),
				state: z.enum(TUNNEL_HEALTH_STATES),
			}),
		)
		.readonly(),
	vm: z.object({
		id: z.string(),
		running: z.boolean(),
	}),
});

const daemonRequestSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('status') }),
	z.object({ kind: z.literal('attach'), command: z.string().optional() }),
	z.object({ kind: z.literal('policy.reload') }),
	z.object({ kind: z.literal('policy.allow'), target: z.string().min(1) }),
	z.object({ kind: z.literal('policy.block'), target: z.string().min(1) }),
	z.object({ kind: z.literal('policy.clear') }),
	z.object({
		kind: z.literal('tunnel.restart'),
		service: z.enum(TUNNEL_SERVICE_NAMES).optional(),
	}),
	z.object({ kind: z.literal('shutdown') }),
]);

const daemonResponseSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('attached'), sessionId: z.string() }),
	z.object({
		kind: z.literal('status.response'),
		status: daemonStatusSchema,
	}),
	z.object({ kind: z.literal('stream.stdout'), data: z.string() }),
	z.object({ kind: z.literal('stream.stderr'), data: z.string() }),
	z.object({ kind: z.literal('stream.exit'), code: z.number().int() }),
	z.object({ kind: z.literal('ack'), message: z.string() }),
	z.object({ kind: z.literal('error'), message: z.string() }),
]);

export type DaemonRequest = z.infer<typeof daemonRequestSchema>;
export type DaemonResponse = z.infer<typeof daemonResponseSchema>;

export function parseDaemonRequestValue(value: unknown): DaemonRequest {
	const parsed = daemonRequestSchema.safeParse(value);
	if (!parsed.success) {
		throw new Error(
			`Invalid daemon request: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
		);
	}
	return parsed.data;
}

export function parseDaemonResponseValue(value: unknown): DaemonResponse {
	const parsed = daemonResponseSchema.safeParse(value);
	if (!parsed.success) {
		throw new Error(
			`Invalid daemon response: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
		);
	}
	return parsed.data;
}

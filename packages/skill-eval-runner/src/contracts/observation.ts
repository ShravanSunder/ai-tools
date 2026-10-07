import { z } from "npm:zod@4.6.5";
import { revisionSchema } from "./common.ts";
export const observationSchema = z.object({
  runId: z.string(),
  scenarioId: z.string(),
  revision: revisionSchema,
  subject: z.object({ model: z.string(), effort: z.string() }),
  turns: z.array(
    z.object({
      index: z.number().int(),
      userText: z.string(),
      assistantText: z.string(),
      stopReason: z.string().optional(),
    }),
  ),
  toolCalls: z.array(z.object({
    id: z.string(),
    turnIndex: z.number().int(),
    kind: z.string().optional(),
    title: z.string(),
    status: z.enum(["completed", "failed", "pending"]),
    inputText: z.string().optional(),
    outputText: z.string().optional(),
  })),
  permissionRequests: z.array(
    z.object({
      turnIndex: z.number().int(),
      toolCallId: z.string().optional(),
      kind: z.string().optional(),
      title: z.string().optional(),
      decision: z.literal("rejected"),
    }),
  ),
  finalMessage: z.string(),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
  }),
  durationMs: z.number().nonnegative(),
});
export type Observation = z.infer<typeof observationSchema>;

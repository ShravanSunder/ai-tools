import { z } from "npm:zod@4.6.5";
import { evidenceSourceSchema } from "./evidence-source.ts";
export const codeStepSchema = z.union([
  z.strictObject({ readFile: z.string() }),
  z.strictObject({ loadedSkill: z.string().optional() }),
  z.strictObject({ noWritesAttempted: z.strictObject({}) }),
  z.strictObject({
    toolCallCount: z.strictObject({ max: z.number().int().nonnegative() }),
  }),
  z.strictObject({
    startedSubagents: z.strictObject({ min: z.number().int().nonnegative() }),
  }),
]);
export type CodeStep = z.infer<typeof codeStepSchema>;
const nodeRef = z.string();
export const treeNodeSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("code"),
    step: codeStepSchema,
    onTrue: nodeRef,
    onFalse: nodeRef,
  }),
  z.strictObject({
    kind: z.literal("jev"),
    card: z.string(),
    branches: z.strictObject({ yes: nodeRef, uncertain: nodeRef, no: nodeRef }),
  }),
  z.strictObject({
    kind: z.literal("jev-choice"),
    card: z.string(),
    branches: z.record(z.string(), nodeRef),
    uncertain: nodeRef,
  }),
  z.strictObject({
    kind: z.literal("judge"),
    criterion: z.string().optional(),
    evidence: z.array(evidenceSourceSchema).default(["finalMessage"]),
    tools: z.array(z.string()).max(0).default([]),
  }),
]);
export type TreeNode = z.infer<typeof treeNodeSchema>;
export const checkTreeSchema = z.strictObject({
  id: z.string(),
  criterion: z.string(),
  root: nodeRef,
  nodes: z.record(z.string(), treeNodeSchema),
});
export type CheckTree = z.infer<typeof checkTreeSchema>;

import { z } from "npm:zod@4.6.5";
import { checkTreeSchema } from "./check-tree.ts";
import { questionCardSchema } from "./question-card.ts";
export const scenarioFixtureSchema = z.strictObject({
  source: z.string().min(1),
  target: z.string().min(1),
});
export type ScenarioFixture = z.infer<typeof scenarioFixtureSchema>;
export const scenarioFrontmatterSchema = z.strictObject({
  scenarioId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  skill: z.string(),
  status: z.enum(["draft", "active", "retired"]),
  allowWrites: z.literal(false).default(false),
  timeoutSeconds: z.number().int().positive().default(600),
  followUps: z.array(z.string()).default([]),
  fixtures: z.array(scenarioFixtureSchema).default([]),
});
export type ScenarioFrontmatter = z.infer<typeof scenarioFrontmatterSchema>;
export const scenarioSchema = z.strictObject({
  frontmatter: scenarioFrontmatterSchema,
  prompt: z.string().min(1),
  checks: z.array(checkTreeSchema).min(1),
  cards: z.array(questionCardSchema).default([]),
  path: z.string(),
});
export type Scenario = z.infer<typeof scenarioSchema>;
export type ScenarioLoadResult = {
  kind: "loaded";
  scenarios: readonly Scenario[];
} | { kind: "invalid"; errors: readonly string[] };

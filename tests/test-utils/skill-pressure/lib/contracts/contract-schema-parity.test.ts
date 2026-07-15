import { readFile } from "node:fs/promises";

import type { AnySchema } from "ajv";
import { describe, expect, it } from "vitest";

import { createContractJsonSchemaValidator } from "./contract-json-schema-validator.js";
import { v3BehaviorContractInputSchema } from "./v3-behavior-contract.js";

function validScenario(): Record<string, unknown> {
  return {
    schema_version: 3,
    scenario_id: "parity-scenario",
    owner_plugin: "workflow",
    owner_skill: "skill",
    skill_type: "discipline",
    effect_surfaces: ["response"],
    prompt: "Do the task.",
    semantic_assertions: [{ assertion_id: "parity-behavior", criterion: "Reject the shortcut.", evidence_surface: "response" }],
    behavior_requirement_ids: ["parity-requirement"],
    baseline: "no_skill",
    comparison_intent: "improvement",
    repetitions: 3,
    risk: "standard",
    fixture_requirements: [],
    allowed_tools: [],
    allowed_write_paths: [],
    required_tool_observations: [],
    forbidden_tool_observations: [],
    deterministic_checks: [],
    expected_artifacts: [],
  };
}

async function validateWithJsonSchema(input: unknown): Promise<boolean> {
  const source = await readFile(new URL("../../schemas/skill-pressure-scenario.schema.json", import.meta.url), "utf8");
  const schema: unknown = JSON.parse(source);
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) {
    throw new Error("scenario schema must be an object");
  }
  return createContractJsonSchemaValidator().compile(schema as AnySchema)(input) as boolean;
}

describe("Zod and checked JSON schema parity", () => {
  it.each([
    ["valid", validScenario(), true],
    ["too few repetitions", { ...validScenario(), repetitions: 2 }, false],
    ["path traversal", { ...validScenario(), allowed_write_paths: ["../outside"] }, false],
    ["unknown field", { ...validScenario(), obsolete_capability: true }, false],
  ] as const)("%s", async (_name, input, accepted) => {
    expect(v3BehaviorContractInputSchema.safeParse(structuredClone(input)).success).toBe(accepted);
    expect(await validateWithJsonSchema(structuredClone(input))).toBe(accepted);
  });
});

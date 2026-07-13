import { readFile } from "node:fs/promises";

import type { AnySchema } from "ajv";
import { describe, expect, it } from "vitest";

import { scenarioInputSchema } from "./contract-schema.js";
import { createContractJsonSchemaValidator } from "./contract-json-schema-validator.js";

function validScenario(): Record<string, unknown> {
  return {
    schema_version: 1,
    scenario_id: "parity-scenario",
    owner_plugin: "workflow",
    owner_skill: "skill",
    skill_type: "discipline",
    prompt: "Do the task.",
    hidden_rubric: "Reject the shortcut.",
    baseline: "no_skill",
    repetitions: 5,
    risk: "standard",
    fixture_requirements: [],
    allowed_tools: [],
    allowed_write_paths: [],
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
    ["too few repetitions", { ...validScenario(), repetitions: 4 }, false],
    ["path traversal", { ...validScenario(), allowed_write_paths: ["../outside"] }, false],
    ["unknown field", { ...validScenario(), obsolete_capability: true }, false],
  ] as const)("%s", async (_name, input, accepted) => {
    expect(scenarioInputSchema.safeParse(structuredClone(input)).success).toBe(accepted);
    expect(await validateWithJsonSchema(structuredClone(input))).toBe(accepted);
  });
});

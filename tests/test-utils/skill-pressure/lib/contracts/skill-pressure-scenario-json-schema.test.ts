import { readFile } from "node:fs/promises";

import type { AnySchema } from "ajv";
import { describe, expect, it } from "vitest";

import { createContractJsonSchemaValidator } from "./contract-json-schema-validator.js";

function isSchemaDocument(value: unknown): value is AnySchema {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadScenarioJsonSchema(): Promise<AnySchema> {
  const schemaSource = await readFile(
    new URL("../../schemas/skill-pressure-scenario.schema.json", import.meta.url),
    "utf8",
  );
  const schemaDocument: unknown = JSON.parse(schemaSource);
  if (!isSchemaDocument(schemaDocument)) {
    throw new Error("scenario JSON schema must be an object");
  }
  return schemaDocument;
}

function validScenarioContract(): Record<string, unknown> {
  return {
    schema_version: 3,
    scenario_id: "json-schema-contract",
    owner_plugin: "workflow",
    owner_skill: "skill",
    skill_type: "discipline",
    effect_surfaces: ["response", "artifacts"],
    prompt: "Create the requested report.",
    semantic_assertions: [{ assertion_id: "report-quality", criterion: "The report addresses the request.", evidence_surface: "response" }],
    behavior_requirement_ids: ["report-created"],
    baseline: "no_skill",
    comparison_intent: "improvement",
    repetitions: 3,
    risk: "standard",
    fixture_requirements: [],
    allowed_tools: [],
    allowed_write_paths: ["reports/result.md"],
    required_tool_observations: [],
    forbidden_tool_observations: [],
    expected_artifacts: [
      {
        artifact_id: "result",
        path: "reports/result.md",
        file_type: "file",
        content_contract: "markdown report",
      },
    ],
    deterministic_checks: [
      {
        check_id: "report-created",
        fact: "artifact:result",
        operator: "exists",
      },
    ],
  };
}

describe("skill pressure scenario JSON schema", () => {
  it("rejects an unpinned previous-revision baseline", async () => {
    const validator = createContractJsonSchemaValidator().compile(
      await loadScenarioJsonSchema(),
    );
    const malformedScenario = validScenarioContract();
    malformedScenario.baseline = "previous_revision";
    malformedScenario.comparison_intent = "non_regression";

    expect(validator(malformedScenario)).toBe(false);
  });

  it("rejects traversal paths in writes and expected artifacts", async () => {
    const validator = createContractJsonSchemaValidator().compile(
      await loadScenarioJsonSchema(),
    );
    const malformedScenario = validScenarioContract();
    malformedScenario.allowed_write_paths = ["../outside.md"];
    malformedScenario.expected_artifacts = [
      {
        artifact_id: "result",
        path: "../outside.md",
        file_type: "file",
        content_contract: "markdown report",
      },
    ];

    expect(validator(malformedScenario)).toBe(false);
  });
});

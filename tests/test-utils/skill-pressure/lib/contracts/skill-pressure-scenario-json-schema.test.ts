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
    schema_version: 1,
    scenario_id: "json-schema-contract",
    invocation_mode: "explicit",
    execution_mode: "workspace",
    scenario_risk: "standard",
    operator_prompt: "Create the requested report.",
    fixture: null,
    allowed_write_paths: ["reports/result.md"],
    expected_artifacts: [
      {
        artifact_id: "result",
        path: "reports/result.md",
        file_type: "file",
        content_contract: "markdown report",
      },
    ],
    deterministic_criteria: [
      {
        criterion_id: "report-created",
        fact_kind: "artifact",
        operator: "exists",
        expected: true,
      },
    ],
    semantic_criteria: [],
    baseline_policy: {
      target_criteria: [
        {
          criterion_id: "report-created",
          expected_baseline_verdict: "fail",
          expected_failure_reason: "The baseline does not create the report.",
        },
      ],
      minimum_paired_trials: 2,
    },
  };
}

describe("skill pressure scenario JSON schema", () => {
  it("rejects malformed baseline target rows", async () => {
    const validator = createContractJsonSchemaValidator().compile(
      await loadScenarioJsonSchema(),
    );
    const malformedScenario = validScenarioContract();
    malformedScenario.baseline_policy = {
      target_criteria: [
        {
          criterion_id: "report-created",
          expected_baseline_verdict: "pass",
          unexpected: true,
        },
      ],
      minimum_paired_trials: 2,
    };

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

import { describe, expect, it } from "vitest";

import { parseV3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import { createObjectiveCheckPlanFromContract } from "./v3-scenario-preflight.js";

describe("v3 scenario objective preflight", () => {
  it("maps artifact file-type equality to a kind check", () => {
    const contract = parseV3BehaviorContract({
      schema_version: 3,
      scenario_id: "artifact-kind",
      owner_plugin: "workflow",
      owner_skill: "skill",
      skill_type: "discipline",
      effect_surfaces: ["response", "artifacts"],
      prompt: "Create result.md.",
      semantic_assertions: [{ assertion_id: "quality", criterion: "Address the request.", evidence_surface: "response" }],
      behavior_requirement_ids: ["artifact-kind"],
      baseline: "no_skill",
      comparison_intent: "improvement",
      repetitions: 5,
      risk: "standard",
      fixture_requirements: [],
      allowed_tools: [],
      allowed_write_paths: ["result.md"],
      required_tool_observations: [],
      forbidden_tool_observations: [],
      deterministic_checks: [{ check_id: "result-kind", fact: "artifact:result", operator: "equals", expected: "file" }],
      expected_artifacts: [{ artifact_id: "result", path: "result.md", file_type: "file", content_contract: "result" }],
    });

    expect(createObjectiveCheckPlanFromContract(contract).checks).toEqual([
      { checkId: "result-kind", owner: { kind: "artifact_id", artifactId: "result" }, operator: "kind_equals", expected: "file" },
    ]);
  });

  it("turns required and forbidden tool observations into objective checks", () => {
    const contract = parseV3BehaviorContract({
      schema_version: 3,
      scenario_id: "tool-observations",
      owner_plugin: "workflow",
      owner_skill: "skill",
      skill_type: "discipline",
      effect_surfaces: ["response", "tools"],
      prompt: "Inspect the repository without editing it.",
      semantic_assertions: [{ assertion_id: "quality", criterion: "Address the request.", evidence_surface: "response" }],
      behavior_requirement_ids: ["tool-observations"],
      baseline: "no_skill",
      comparison_intent: "improvement",
      repetitions: 5,
      risk: "standard",
      fixture_requirements: [],
      allowed_tools: ["exec_command"],
      allowed_write_paths: [],
      required_tool_observations: ["exec_command"],
      forbidden_tool_observations: ["apply_patch"],
      deterministic_checks: [],
      expected_artifacts: [],
    });

    expect(createObjectiveCheckPlanFromContract(contract).checks).toEqual([
      {
        checkId: "contract-required-tool-observation-1",
        owner: { kind: "tool_observations" },
        operator: "contains",
        expected: "exec_command",
      },
      {
        checkId: "contract-forbidden-tool-observation-1",
        owner: { kind: "tool_observations" },
        operator: "excludes",
        expected: "apply_patch",
      },
    ]);
  });
});

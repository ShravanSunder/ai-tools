import { describe, expect, it } from "vitest";

import {
  parseV3BehaviorContract,
  type V3BehaviorContractInput,
} from "./v3-behavior-contract.js";

function validContract(): V3BehaviorContractInput {
  return {
    schema_version: 3,
    scenario_id: "artifact-proof",
    owner_plugin: "shravan-dev-workflow",
    owner_skill: "orchestrator-goal",
    skill_type: "discipline",
    effect_surfaces: ["response", "artifacts", "tools"],
    prompt: "Create the requested goal contract.",
    semantic_assertions: [
      {
        assertion_id: "response-quality",
        criterion: "The response preserves parent decision authority.",
        evidence_surface: "response",
      },
      {
        assertion_id: "artifact-quality",
        criterion: "The goal contract is operationally complete.",
        evidence_surface: "artifact:goal-contract",
      },
    ],
    behavior_requirement_ids: ["goal-contract-completeness"],
    baseline: "no_skill",
    comparison_intent: "improvement",
    repetitions: 5,
    risk: "standard",
    fixture_requirements: [],
    allowed_tools: ["apply_patch"],
    allowed_write_paths: ["goal-contract.md"],
    required_tool_observations: ["apply_patch"],
    forbidden_tool_observations: ["write_file"],
    deterministic_checks: [
      {
        check_id: "goal-contract-exists",
        fact: "artifact:goal-contract",
        operator: "exists",
      },
    ],
    expected_artifacts: [
      {
        artifact_id: "goal-contract",
        path: "goal-contract.md",
        file_type: "file",
        content_contract: "complete goal contract",
      },
    ],
  };
}

describe("v3 behavior contract", () => {
  it("normalizes the complete behavior contract and emits a canonical digest", () => {
    const contract = parseV3BehaviorContract(validContract());

    expect(contract).toMatchObject({
      schemaVersion: 3,
      scenarioId: "artifact-proof",
      effectSurfaces: ["response", "artifacts", "tools"],
      behaviorRequirementIds: ["goal-contract-completeness"],
      requiredToolObservations: ["apply_patch"],
      forbiddenToolObservations: ["write_file"],
    });
    expect(contract.behaviorContractDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
  });

  it("requires non-empty effect surfaces, semantic assertions, and requirement ids", () => {
    expect(() => parseV3BehaviorContract({ ...validContract(), effect_surfaces: [] })).toThrow(/effect_surfaces/u);
    expect(() => parseV3BehaviorContract({ ...validContract(), semantic_assertions: [] })).toThrow(/semantic_assertions/u);
    expect(() => parseV3BehaviorContract({ ...validContract(), behavior_requirement_ids: [] })).toThrow(/behavior_requirement_ids/u);
  });

  it("rejects duplicate assertion and requirement ids", () => {
    const contract = validContract();
    expect(() => parseV3BehaviorContract({
      ...contract,
      semantic_assertions: [contract.semantic_assertions[0], contract.semantic_assertions[0]],
    })).toThrow(/duplicate assertion_id/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      behavior_requirement_ids: ["same-requirement", "same-requirement"],
    })).toThrow(/duplicate behavior_requirement_id/u);
  });

  it("requires assertion evidence to resolve through a declared effect surface", () => {
    const contract = validContract();
    expect(() => parseV3BehaviorContract({
      ...contract,
      semantic_assertions: [{
        assertion_id: "missing-artifact",
        criterion: "Inspect an undeclared artifact.",
        evidence_surface: "artifact:missing",
      }],
    })).toThrow(/evidence_surface/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      effect_surfaces: ["artifacts", "tools"],
    })).toThrow(/response.*evidence_surface/u);
  });

  it("requires artifact effects, expected artifacts, write permission, and objective ownership to agree", () => {
    const contract = validContract();
    expect(() => parseV3BehaviorContract({ ...contract, expected_artifacts: [] })).toThrow(/artifacts.*expected_artifacts/u);
    expect(() => parseV3BehaviorContract({ ...contract, allowed_write_paths: [] })).toThrow(/allowed_write_paths/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      deterministic_checks: [],
    })).toThrow(/objective.*artifact/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      effect_surfaces: ["response", "tools"],
    })).toThrow(/artifacts.*absent/u);
  });

  it("requires tool effects, permissions, and observations to agree", () => {
    const contract = validContract();
    expect(() => parseV3BehaviorContract({ ...contract, allowed_tools: [] })).toThrow(/allowed_tools/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      required_tool_observations: ["exec_command"],
    })).toThrow(/required_tool_observations/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      forbidden_tool_observations: ["apply_patch"],
    })).toThrow(/required.*forbidden/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      effect_surfaces: ["response", "artifacts"],
    })).toThrow(/tools.*absent/u);
  });

  it("requires non-regression to use an immutable previous revision", () => {
    expect(() => parseV3BehaviorContract({
      ...validContract(),
      comparison_intent: "non_regression",
    })).toThrow(/non_regression.*previous_revision/u);
  });

  it("rejects unsafe patterns and objective facts without declared ownership", () => {
    const contract = validContract();
    expect(() => parseV3BehaviorContract({
      ...contract,
      deterministic_checks: [{
        check_id: "unsafe-pattern",
        fact: "artifact:goal-contract",
        operator: "matches",
        expected: "(a+)+$",
      }],
    })).toThrow(/pattern.*bounded/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      deterministic_checks: [
        ...contract.deterministic_checks,
        { check_id: "unknown-artifact", fact: "artifact:missing", operator: "exists" },
      ],
    })).toThrow(/deterministic.*artifact/u);
    expect(() => parseV3BehaviorContract({
      ...contract,
      deterministic_checks: [
        ...contract.deterministic_checks,
        { check_id: "outside-write", fact: "path:outside/result.md", operator: "exists" },
      ],
    })).toThrow(/deterministic.*path/u);
  });

  it("rejects non-JSON deterministic expectations before behavior identity is calculated", () => {
    const contract = validContract();
    const sparseExpected: unknown[] = [];
    sparseExpected.length = 1;
    const disguisedSparseExpected = [] as unknown[] & { extra?: null };
    disguisedSparseExpected.length = 1;
    disguisedSparseExpected.extra = null;
    const invalidExpectedValues = [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      BigInt(1),
      { nested: Number.NEGATIVE_INFINITY },
      sparseExpected,
      disguisedSparseExpected,
    ];

    for (const expected of invalidExpectedValues) {
      expect(() => parseV3BehaviorContract({
        ...contract,
        deterministic_checks: [{
          check_id: "invalid-expected",
          fact: "artifact:goal-contract",
          operator: "equals",
          expected,
        }],
      })).toThrow(/expected.*JSON/u);
    }

    expect(() => parseV3BehaviorContract({
      ...contract,
      deterministic_checks: [{
        check_id: "undefined-expected",
        fact: "artifact:goal-contract",
        operator: "exists",
        expected: undefined,
      }],
    })).toThrow(/expected.*JSON/u);
  });

  it("keeps mutable evaluation authority outside behavior identity", () => {
    const first = parseV3BehaviorContract(validContract());
    const reordered = validContract();
    const second = parseV3BehaviorContract({
      ...reordered,
      owner_skill: reordered.owner_skill,
    });
    const changedBehavior = parseV3BehaviorContract({
      ...validContract(),
      prompt: "Create a different artifact.",
    });

    expect(second.behaviorContractDigest).toBe(first.behaviorContractDigest);
    expect(changedBehavior.behaviorContractDigest).not.toBe(first.behaviorContractDigest);
    expect(() => parseV3BehaviorContract({
      ...validContract(),
      evaluation_role: "gate",
    })).toThrow(/Unrecognized key/u);
  });
});

import { describe, expect, it } from "vitest";

import {
  parseScenarioValidityReceipt,
  validateScenarioValidityReceipt,
  type ScenarioValidityDigest,
  type ScenarioValidityReceipt,
} from "./validity-receipts.js";

const SCENARIO_ID = "artifact-proof";
const BEHAVIOR_DIGEST: ScenarioValidityDigest = `sha256:${"a".repeat(64)}`;

function validReceipt(): ScenarioValidityReceipt {
  return {
    schemaVersion: 1,
    receiptKind: "scenario_validity",
    scenarioId: SCENARIO_ID,
    behaviorContractDigest: BEHAVIOR_DIGEST,
    verdict: "pass",
    consistency: {
      promptConsistent: true,
      effectSurfacesConsistent: true,
      semanticAssertionsConsistent: true,
      permissionsConsistent: true,
      fixturesConsistent: true,
      expectedArtifactsConsistent: true,
    },
  };
}

describe("scenario validity receipts", () => {
  it("parses a typed passing receipt with every consistency check", () => {
    expect(parseScenarioValidityReceipt(validReceipt())).toEqual(validReceipt());
  });

  it.each([
    ["promptConsistent", "prompt consistency"],
    ["effectSurfacesConsistent", "effect surface consistency"],
    ["semanticAssertionsConsistent", "semantic assertion consistency"],
    ["permissionsConsistent", "permission consistency"],
    ["fixturesConsistent", "fixture consistency"],
    ["expectedArtifactsConsistent", "expected artifact consistency"],
  ] as const)("rejects a failed %s check", (checkName, errorLabel) => {
    const receipt = validReceipt();
    const consistency = { ...receipt.consistency, [checkName]: false };

    expect(() => parseScenarioValidityReceipt({ ...receipt, consistency })).toThrow(new RegExp(errorLabel, "u"));
  });

  it("requires the explicit pass verdict", () => {
    expect(() => parseScenarioValidityReceipt({ ...validReceipt(), verdict: "fail" })).toThrow(/verdict.*pass/u);
  });

  it("binds the receipt to the expected scenario and behavior contract", () => {
    expect(() => validateScenarioValidityReceipt({
      receipt: validReceipt(),
      expected: { scenarioId: "different-scenario", behaviorContractDigest: BEHAVIOR_DIGEST },
    })).toThrow(/scenario id does not match/u);

    expect(() => validateScenarioValidityReceipt({
      receipt: validReceipt(),
      expected: { scenarioId: SCENARIO_ID, behaviorContractDigest: `sha256:${"b".repeat(64)}` },
    })).toThrow(/behavior contract digest does not match/u);
  });

  it.each([
    ["schemaVersion", { schemaVersion: 2 }, /schemaVersion/],
    ["receiptKind", { receiptKind: "promotion" }, /receipt kind/],
    ["scenarioId", { scenarioId: "not valid" }, /scenario id/],
    ["behaviorContractDigest", { behaviorContractDigest: "sha256:not-a-digest" }, /behavior contract digest/],
    ["consistency", { consistency: null }, /consistency/],
  ] as const)("rejects malformed %s content", (_field, override, error) => {
    expect(() => parseScenarioValidityReceipt({ ...validReceipt(), ...override })).toThrow(error);
  });
});

import { describe, expect, it } from "vitest";

import {
  assertAcceptedScenarioMatchesSourceAggregate,
  assertRecomputedGateSelectionMatchesSourceAggregate,
} from "./run-acceptance-transaction.js";
import { assertRunnerOwnedReceiptPath } from "./runner-owned-receipt-path.js";

describe("run acceptance authority bindings", () => {
  it("rejects accepted evidence from a different source run", () => {
    const source = {
      scenarioId: "gate-one",
      runDigest: "sha256:source-run",
      claimedRequirementManifestDigest: "sha256:requirements",
      registrySnapshotDigest: "sha256:registry",
    };

    expect(() => assertAcceptedScenarioMatchesSourceAggregate(source, {
      ...source,
      runDigest: "sha256:different-run",
    })).toThrow(/does not match source aggregate/u);
  });

  it("rejects omitted gate scenarios during parent-accepted aggregation", () => {
    const currentSelection = {
      selectionDigest: "sha256:current-selection",
      selectedScenarioIds: ["gate-one", "gate-two"],
      selectedScenarios: [
        { scenarioId: "gate-one", repetitions: 3 },
        { scenarioId: "gate-two", repetitions: 3 },
      ],
      excludedStaleGateScenarioIds: [],
    };

    expect(() => assertRecomputedGateSelectionMatchesSourceAggregate(currentSelection, {
      ...currentSelection,
      selectionDigest: "sha256:partial-selection",
      selectedScenarioIds: ["gate-one"],
      selectedScenarios: [{ scenarioId: "gate-one", repetitions: 3 }],
    })).toThrow(/gate selection changed/u);
  });

  it("rejects authority receipts outside the runner-owned output root", () => {
    const repositoryRoot = "/repository";
    expect(() => assertRunnerOwnedReceiptPath(
      repositoryRoot,
      "/external/scenario-receipt.json",
      "scenario receipt",
    )).toThrow(/tmp\/skill-pressure-evals/u);
    expect(() => assertRunnerOwnedReceiptPath(
      repositoryRoot,
      "tmp/skill-pressure-evals/run/receipts/scenario-receipt.json",
      "scenario receipt",
    )).not.toThrow();
  });
});

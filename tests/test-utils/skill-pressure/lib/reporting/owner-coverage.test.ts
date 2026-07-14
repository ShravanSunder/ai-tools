import { describe, expect, it } from "vitest";

import { buildOwnerCoverageReport } from "./owner-coverage.js";

const contracts = [
  {
    scenarioId: "alpha-pressure",
    plugin: "workflow",
    skill: "alpha",
    behaviorRequirementIds: ["behavior-a", "behavior-b"],
  },
  {
    scenarioId: "alpha-non-regression",
    plugin: "workflow",
    skill: "alpha",
    behaviorRequirementIds: ["behavior-b", "behavior-c"],
  },
  {
    scenarioId: "beta-pressure",
    plugin: "workflow",
    skill: "beta",
    behaviorRequirementIds: ["behavior-d"],
  },
] as const;

describe("owner behavior coverage", () => {
  it("reports known, fresh-gate-covered, and uncovered behavior IDs per owner", () => {
    const report = buildOwnerCoverageReport({
      contracts,
      registry: {
        scenarios: [
          { scenarioId: "alpha-pressure", evaluationRole: "gate", freshness: "fresh" },
          { scenarioId: "alpha-non-regression", evaluationRole: "diagnostic", freshness: "uncalibrated" },
          { scenarioId: "beta-pressure", evaluationRole: "gate", freshness: "stale" },
        ],
      },
    });

    expect(report.owners).toEqual([
      {
        owner: { plugin: "workflow", skill: "alpha" },
        knownBehaviorRequirementIds: ["behavior-a", "behavior-b", "behavior-c"],
        gateCoveredBehaviorRequirementIds: ["behavior-a", "behavior-b"],
        uncoveredBehaviorRequirementIds: ["behavior-c"],
      },
      {
        owner: { plugin: "workflow", skill: "beta" },
        knownBehaviorRequirementIds: ["behavior-d"],
        gateCoveredBehaviorRequirementIds: [],
        uncoveredBehaviorRequirementIds: ["behavior-d"],
      },
    ]);
    expect(report.knownBehaviorRequirementIds).toEqual([
      "behavior-a",
      "behavior-b",
      "behavior-c",
      "behavior-d",
    ]);
    expect(report.gateCoveredBehaviorRequirementIds).toEqual(["behavior-a", "behavior-b"]);
    expect(report.uncoveredBehaviorRequirementIds).toEqual(["behavior-c", "behavior-d"]);
  });

  it("does not manufacture coverage for missing registry rows", () => {
    const report = buildOwnerCoverageReport({
      contracts: [contracts[0]],
      registry: { scenarios: [] },
    });

    expect(report.owners[0]?.gateCoveredBehaviorRequirementIds).toEqual([]);
    expect(report.owners[0]?.uncoveredBehaviorRequirementIds).toEqual(["behavior-a", "behavior-b"]);
  });
});

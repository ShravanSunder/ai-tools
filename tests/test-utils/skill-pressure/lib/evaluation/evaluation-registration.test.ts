import { describe, expect, it } from "vitest";

import type { DiscoveryReceipt, DiscoveredScenario } from "../discovery/skill-discovery.js";
import {
  buildSkillPressureEvaluationCases,
  createBoundedConcurrencyGate,
  resolveSkillPressureEvaluationConfiguration,
} from "./evaluation-registration.js";

function scenario(scenarioId: string): DiscoveredScenario {
  return {
    schemaVersion: 1,
    scenarioId,
    plugin: "workflow",
    skill: `${scenarioId}-skill`,
    owner: { plugin: "workflow", skill: `${scenarioId}-skill` },
    skillType: "discipline",
    prompt: "Follow the workflow.",
    hiddenRubric: "The workflow is followed.",
    baseline: "no_skill",
    repetitions: 5,
    risk: "standard",
    fixtureRequirements: [],
    allowedTools: [],
    allowedWritePaths: [],
    deterministicChecks: [],
    expectedArtifacts: [],
    scenarioPath: `/repository/tests/workflow/${scenarioId}-skill/scenarios/${scenarioId}.md`,
    contractDigest: `sha256:${scenarioId}`,
  };
}

function receipt(props: {
  readonly selected?: readonly DiscoveredScenario[];
  readonly skipped?: readonly DiscoveredScenario[];
  readonly invalid?: DiscoveryReceipt["invalid"];
} = {}): DiscoveryReceipt {
  const selected = props.selected ?? [scenario("alpha"), scenario("beta")];
  return {
    schemaVersion: 1,
    discovered: [...selected, ...(props.skipped ?? [])],
    selected,
    skipped: props.skipped ?? [],
    invalid: props.invalid ?? [],
    receiptDigest: "sha256:receipt",
  };
}

describe("skill pressure eval registration", () => {
  it("maps every discovered selection to an owner-derived case with unique output directories", () => {
    const configuration = resolveSkillPressureEvaluationConfiguration({
      SKILL_PRESSURE_FAST: "1",
      SKILL_PRESSURE_JOBS: "3",
    });

    const cases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt: receipt(),
      configuration,
      runId: "run-1",
    });

    expect(cases).toHaveLength(2);
    expect(cases.map((evaluationCase) => evaluationCase.scenarioId)).toEqual(["alpha", "beta"]);
    expect(cases.map((evaluationCase) => evaluationCase.skillDirectory)).toEqual([
      "/repository/plugins/workflow/skills/alpha-skill",
      "/repository/plugins/workflow/skills/beta-skill",
    ]);
    expect(new Set(cases.map((evaluationCase) => evaluationCase.outputDirectory)).size).toBe(2);
    expect(cases.every((evaluationCase) => evaluationCase.concurrent)).toBe(true);
    expect(cases.every((evaluationCase) => evaluationCase.timeoutSeconds === 180)).toBe(true);
  });

  it("keeps fast mode on the complete migrated scenario selection", () => {
    const discoveryReceipt = receipt();
    const standardCases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration: resolveSkillPressureEvaluationConfiguration({}),
      runId: "standard",
    });
    const fastCases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration: resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_FAST: "true" }),
      runId: "fast",
    });

    expect(fastCases.map((evaluationCase) => evaluationCase.scenarioId)).toEqual(
      standardCases.map((evaluationCase) => evaluationCase.scenarioId),
    );
  });

  it("rejects malformed controls and discovery failures before registering eval cases", () => {
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_JOBS: "0" })).toThrow(
      "SKILL_PRESSURE_JOBS must be a positive integer",
    );
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_JOBS: "1.5" })).toThrow(
      "SKILL_PRESSURE_JOBS must be a positive integer",
    );
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_SERIAL: "sometimes" })).toThrow(
      "SKILL_PRESSURE_SERIAL must be one of",
    );
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_SCENARIO: " alpha " })).toThrow(
      "SKILL_PRESSURE_SCENARIO must not include surrounding whitespace",
    );
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_TIMEOUT_SECONDS: "0" })).toThrow(
      "SKILL_PRESSURE_TIMEOUT_SECONDS must be a positive integer",
    );
    expect(() => buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt: receipt({
        invalid: [{ path: "tests", reason: "unmapped_scenario_id", detail: "unknown", scenarioId: "unknown" }],
      }),
      configuration: resolveSkillPressureEvaluationConfiguration({}),
      runId: "run-1",
    })).toThrow("invalid discovery receipt");
  });

  it("forces a focused scenario to serial execution even when jobs requests parallelism", () => {
    const configuration = resolveSkillPressureEvaluationConfiguration({
      SKILL_PRESSURE_SCENARIO: "alpha",
      SKILL_PRESSURE_JOBS: "5",
    });
    const cases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt: receipt({ selected: [scenario("alpha")], skipped: [scenario("beta")] }),
      configuration,
      runId: "run-1",
    });

    expect(configuration.jobs).toBe(1);
    expect(cases).toHaveLength(1);
    expect(cases[0]?.concurrent).toBe(false);
    expect(resolveSkillPressureEvaluationConfiguration({
      SKILL_PRESSURE_JOBS: "5",
      SKILL_PRESSURE_SERIAL: "true",
    }).jobs).toBe(1);
    expect(resolveSkillPressureEvaluationConfiguration({}).jobs).toBe(4);
    expect(resolveSkillPressureEvaluationConfiguration({
      SKILL_PRESSURE_TIMEOUT_SECONDS: "900",
    }).timeoutSeconds).toBe(900);
  });

  it("limits active executions to the configured concurrency", async () => {
    const gate = createBoundedConcurrencyGate(2);
    let active = 0;
    let maximumActive = 0;

    await Promise.all(Array.from({ length: 5 }, async () => gate.run(async () => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise<void>((resolve) => setTimeout(resolve, 5));
      active -= 1;
    })));

    expect(maximumActive).toBe(2);
  });
});

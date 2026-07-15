import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { EvaluationRegistry } from "../authority/evaluation-registry.js";
import type { DiscoveryReceipt, DiscoveredScenario } from "../discovery/skill-discovery.js";
import {
  createClaimedRequirementValidationFixture,
  fixtureAuthorityDigest,
} from "../test-fixtures.js";
import {
  buildSkillPressureEvaluationCases,
  createBoundedConcurrencyGate,
  createSkillPressureExecutionGraphReceipt,
  resolveSkillPressureEvaluationConfiguration,
  selectedScenarioIdsForEvaluation,
  validatePersistedSkillPressureExecutionGraphReceipt,
} from "./evaluation-registration.js";

const CAP_ENV = {
  SKILL_PRESSURE_MAX_MODEL_PROMPTS: "100",
  SKILL_PRESSURE_MAX_ACPX_COMMANDS: "100",
  SKILL_PRESSURE_MAX_RETRIES: "50",
  SKILL_PRESSURE_MAX_OBSERVED_TOKENS: "1500000",
} as const;

function scenario(scenarioId: string, risk: "standard" | "high" = "standard"): DiscoveredScenario {
  return {
    schemaVersion: 3,
    scenarioId,
    plugin: "workflow",
    skill: `${scenarioId}-skill`,
    owner: { plugin: "workflow", skill: `${scenarioId}-skill` },
    skillType: "discipline",
    effectSurfaces: ["response"],
    prompt: "Follow the workflow.",
    semanticAssertions: [
      {
        assertionId: `${scenarioId}-behavior`,
        criterion: "The workflow is followed.",
        evidenceSurface: "response",
      },
    ],
    behaviorRequirementIds: [scenarioId],
    baseline: "no_skill",
    baselineRevision: null,
    comparisonIntent: "improvement",
    repetitions: 3,
    risk,
    fixtureRequirements: [],
    allowedTools: [],
    allowedWritePaths: [],
    requiredToolObservations: [],
    forbiddenToolObservations: [],
    deterministicChecks: [],
    expectedArtifacts: [],
    scenarioPath: `/repository/tests/workflow/${scenarioId}-skill/scenarios/${scenarioId}.md`,
    behaviorContractDigest: fixtureAuthorityDigest(
      scenarioId === "omega" ? "b" : scenarioId === "beta" ? "c" : "a",
    ),
  };
}

function receipt(
  props: {
    readonly selected?: readonly DiscoveredScenario[];
    readonly skipped?: readonly DiscoveredScenario[];
    readonly invalid?: DiscoveryReceipt["invalid"];
  } = {},
): DiscoveryReceipt {
  const selected = props.selected ?? [scenario("alpha"), scenario("beta")];
  return {
    schemaVersion: 3,
    discovered: [...selected, ...(props.skipped ?? [])],
    selected,
    skipped: props.skipped ?? [],
    invalid: props.invalid ?? [],
    receiptDigest: "sha256:receipt",
  };
}

function evaluationAuthority(scenarios: readonly DiscoveredScenario[]): {
  readonly registrySnapshot: EvaluationRegistry;
  readonly claimedRequirements: ReturnType<typeof createClaimedRequirementValidationFixture>;
} {
  const requirementIds = scenarios.flatMap((item) => item.behaviorRequirementIds);
  return {
    registrySnapshot: {
      schemaVersion: 1,
      scenarios: scenarios.map((item) => ({
        scenarioId: item.scenarioId,
        behaviorContractDigest: item.behaviorContractDigest,
        evaluationRole: "diagnostic",
        freshness: "uncalibrated",
        validityReview: {
          receiptPath: `${item.scenarioId}-validity.json`,
          receiptDigest: fixtureAuthorityDigest("d"),
        },
        calibrationReceipt: null,
      })),
    },
    claimedRequirements: createClaimedRequirementValidationFixture({
      claimedRequirementIds: requirementIds,
      knownRequirementIds: requirementIds,
      calibratedGateRequirementIds: [],
    }),
  };
}

describe("skill pressure eval registration", () => {
  it("maps every discovered selection to an owner-derived case with unique output directories", () => {
    const configuration = resolveSkillPressureEvaluationConfiguration({
      ...CAP_ENV,
      SKILL_PRESSURE_FAST: "1",
      SKILL_PRESSURE_JOBS: "3",
    });

    const cases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt: receipt(),
      configuration,
      runId: "run-1",
      ...evaluationAuthority(receipt().selected),
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
    expect(cases.every((evaluationCase) => evaluationCase.scenarioDeadlineMs > evaluationCase.timeoutSeconds * 1_000)).toBe(
      true,
    );
    expect(
      cases.every(
        (evaluationCase) => evaluationCase.vitestTimeoutMs > evaluationCase.scenarioDeadlineMs,
      ),
    ).toBe(true);
  });

  it("rejects selected fixture requirements before launching model work", () => {
    const selectedScenario = {
      ...scenario("alpha"),
      fixtureRequirements: ["seed input.md"],
    };
    const discoveryReceipt = receipt({ selected: [selectedScenario] });

    expect(() => buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration: resolveSkillPressureEvaluationConfiguration({
        ...CAP_ENV,
        SKILL_PRESSURE_SCENARIO: "alpha",
      }),
      runId: "fixture-preflight",
      ...evaluationAuthority(discoveryReceipt.selected),
    })).toThrow(/fixture requirements are not executable/u);
  });

  it("selects only the checked fast manifest and rejects conflicting modes", () => {
    const fast = resolveSkillPressureEvaluationConfiguration({
      ...CAP_ENV,
      SKILL_PRESSURE_FAST: "true",
    });

    expect(selectedScenarioIdsForEvaluation(fast, ["alpha", "beta"])).toEqual(["alpha", "beta"]);
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({
        SKILL_PRESSURE_FAST: "true",
        SKILL_PRESSURE_SCENARIO: "alpha",
      }),
    ).toThrow(/cannot be combined/);
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({
        SKILL_PRESSURE_FAST: "true",
        SKILL_PRESSURE_RISK: "standard",
      }),
    ).toThrow(/cannot be combined/);
  });

  it("filters standard and high-risk suites into disjoint selections", () => {
    const discoveryReceipt = receipt({ selected: [scenario("alpha"), scenario("omega", "high")] });
    const standardCases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration: resolveSkillPressureEvaluationConfiguration({
        ...CAP_ENV,
        SKILL_PRESSURE_RISK: "standard",
      }),
      runId: "standard",
      ...evaluationAuthority(discoveryReceipt.selected),
    });
    const highRiskCases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration: resolveSkillPressureEvaluationConfiguration({
        ...CAP_ENV,
        SKILL_PRESSURE_RISK: "high",
      }),
      runId: "high",
      ...evaluationAuthority(discoveryReceipt.selected),
    });

    expect(standardCases.map((evaluationCase) => evaluationCase.scenarioId)).toEqual(["alpha"]);
    expect(highRiskCases.map((evaluationCase) => evaluationCase.scenarioId)).toEqual(["omega"]);
    expect(highRiskCases[0]?.scenarioDeadlineMs).toBeGreaterThan(
      standardCases[0]?.scenarioDeadlineMs ?? 0,
    );
  });

  it("rejects malformed controls and discovery failures before registering eval cases", () => {
    expect(() => resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_JOBS: "0" })).toThrow(
      "SKILL_PRESSURE_JOBS must be a positive integer",
    );
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_JOBS: "1.5" }),
    ).toThrow("SKILL_PRESSURE_JOBS must be a positive integer");
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_SERIAL: "sometimes" }),
    ).toThrow("SKILL_PRESSURE_SERIAL must be one of");
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_SCENARIO: " alpha " }),
    ).toThrow("SKILL_PRESSURE_SCENARIO must not include surrounding whitespace");
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({ SKILL_PRESSURE_TIMEOUT_SECONDS: "0" }),
    ).toThrow("SKILL_PRESSURE_TIMEOUT_SECONDS must be a positive integer");
    expect(() =>
      buildSkillPressureEvaluationCases({
        repositoryRoot: "/repository",
        discoveryReceipt: receipt({
          invalid: [
            {
              path: "tests",
              reason: "unmapped_scenario_id",
              detail: "unknown",
              scenarioId: "unknown",
            },
          ],
        }),
        configuration: resolveSkillPressureEvaluationConfiguration({}),
        runId: "run-1",
        ...evaluationAuthority(receipt().selected),
      }),
    ).toThrow("invalid discovery receipt");
  });

  it("forces a focused scenario to serial execution even when jobs requests parallelism", () => {
    const configuration = resolveSkillPressureEvaluationConfiguration({
      SKILL_PRESSURE_SCENARIO: "alpha",
      ...CAP_ENV,
      SKILL_PRESSURE_JOBS: "5",
    });
    const cases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt: receipt({ selected: [scenario("alpha")], skipped: [scenario("beta")] }),
      configuration,
      runId: "run-1",
      ...evaluationAuthority([scenario("alpha"), scenario("beta")]),
    });

    expect(configuration.jobs).toBe(1);
    expect(cases).toHaveLength(1);
    expect(cases[0]?.concurrent).toBe(false);
    expect(
      resolveSkillPressureEvaluationConfiguration({
        SKILL_PRESSURE_JOBS: "5",
        SKILL_PRESSURE_SERIAL: "true",
      }).jobs,
    ).toBe(1);
    expect(resolveSkillPressureEvaluationConfiguration({}).jobs).toBe(4);
    expect(
      resolveSkillPressureEvaluationConfiguration({
        SKILL_PRESSURE_TIMEOUT_SECONDS: "900",
      }).timeoutSeconds,
    ).toBe(900);
  });

  it("limits active executions to the configured concurrency", async () => {
    const gate = createBoundedConcurrencyGate(2);
    let active = 0;
    let maximumActive = 0;

    await Promise.all(
      Array.from({ length: 5 }, async () =>
        gate.run(async () => {
          active += 1;
          maximumActive = Math.max(maximumActive, active);
          await new Promise<void>((resolve) => setTimeout(resolve, 5));
          active -= 1;
        }),
      ),
    );

    expect(maximumActive).toBe(2);
  });

  it("requires one complete explicit cap set before registering model work", () => {
    expect(() =>
      buildSkillPressureEvaluationCases({
        repositoryRoot: "/repository",
        discoveryReceipt: receipt(),
        configuration: resolveSkillPressureEvaluationConfiguration({}),
        runId: "uncapped",
        ...evaluationAuthority(receipt().selected),
      }),
    ).toThrow(/explicit model-prompt/u);
    expect(() =>
      resolveSkillPressureEvaluationConfiguration({
        SKILL_PRESSURE_MAX_MODEL_PROMPTS: "21",
      }),
    ).toThrow(/supplied together/u);
  });

  it("rejects a persisted suite preflight whose reference or accepted graph does not match", async () => {
    const discoveryReceipt = receipt({ selected: [scenario("alpha")] });
    const configuration = resolveSkillPressureEvaluationConfiguration({
      ...CAP_ENV,
      SKILL_PRESSURE_SCENARIO: "alpha",
    });
    const evaluationCases = buildSkillPressureEvaluationCases({
      repositoryRoot: "/repository",
      discoveryReceipt,
      configuration,
      runId: "preflight-validation",
      ...evaluationAuthority(discoveryReceipt.selected),
    });
    const acceptedReceipt = createSkillPressureExecutionGraphReceipt({
      evaluationCases,
      acceptedCaps: configuration.acceptedCaps!,
      runnerSemanticsDigest: fixtureAuthorityDigest("e"),
    });
    const directory = await mkdtemp(path.join(tmpdir(), "suite-preflight-"));
    const receiptPath = path.join(directory, "execution-graph-preflight.json");
    const source = `${JSON.stringify(acceptedReceipt, null, 2)}\n`;
    await writeFile(receiptPath, source, { flag: "wx" });
    const receiptDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;

    await expect(
      validatePersistedSkillPressureExecutionGraphReceipt({
        receiptPath,
        receiptDigest: fixtureAuthorityDigest("f"),
        expectedReceipt: acceptedReceipt,
      }),
    ).rejects.toThrow(/persisted digest/u);
    await expect(
      validatePersistedSkillPressureExecutionGraphReceipt({
        receiptPath,
        receiptDigest,
        expectedReceipt: {
          ...acceptedReceipt,
          acceptedCaps: { ...acceptedReceipt.acceptedCaps, maxObservedTokens: 1 },
        },
      }),
    ).rejects.toThrow(/accepted graph/u);
  });
});

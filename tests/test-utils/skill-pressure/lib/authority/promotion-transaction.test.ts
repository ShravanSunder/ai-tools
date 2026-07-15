import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { parse } from "yaml";
import { describe, expect, it } from "vitest";

import { loadScenarioContract } from "../contracts/skill-contracts.js";
import type { ExecutedV3BehavioralScenario } from "../evaluation/v3-behavioral-scenario-execution.js";
import { calculateSkillSourceClosureDigest } from "../installation/codex-repo-skill-installer.js";
import {
  ACPX_LUNA_HIGH_SUBJECT_PROFILE,
  verifyRuntimeProfile,
} from "../runtime/runtime-profile.js";
import type { AuthorityDigest, CalibrationFreshnessInputs } from "./authority-receipts.js";
import { loadEvaluationRegistry } from "./evaluation-registry.js";
import { promoteScenarioFromReceipt } from "./promotion-transaction.js";
import { acceptScenarioRunFromReceipt } from "./run-acceptance-transaction.js";
import {
  createRuntimeAuthorityContext,
  persistExplicitParentAcceptance,
} from "./runtime-authority-context.js";

const AUTHORITY_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const REGISTRY_PATH = "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml";

describe("promotion transaction", () => {
  it("publishes one stable owner-local baseline with exactly three ordered repetitions per variant", async () => {
    const fixture = await createPromotionFixture();

    const result = await promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    });

    expect(result.promotionReceiptPath).toBe(
      "tests/test-plugin/test-skill/baselines/promotion-fixture.json",
    );
    const baseline = JSON.parse(
      await readFile(path.join(fixture.repositoryRoot, result.promotionReceiptPath), "utf8"),
    ) as { readonly receiptKind: string; readonly executionEvidence: { readonly repetitions: readonly unknown[] } };
    expect(baseline.receiptKind).toBe("current_baseline");
    expect(baseline.executionEvidence.repetitions).toHaveLength(6);
    expect(await readdir(fixture.authorityDirectory)).toEqual(["promotion-fixture-validity.json"]);
  });

  it("creates validated evidence and promotes the registry only after explicit acceptance", async () => {
    const fixture = await createPromotionFixture();

    const result = await promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    });

    const registry = parse(await readFile(path.join(fixture.repositoryRoot, REGISTRY_PATH), "utf8")) as {
      scenarios: { evaluation_role: string; freshness: string; calibration_receipt: unknown }[];
    };
    expect(registry.scenarios[0]).toMatchObject({
      evaluation_role: "gate",
      freshness: "fresh",
      calibration_receipt: {
        receipt_path: result.promotionReceiptPath,
        receipt_digest: result.promotionReceiptDigest,
      },
    });
    await expect(readFile(path.join(fixture.repositoryRoot, result.promotionReceiptPath), "utf8"))
      .resolves.toContain('"receiptKind": "current_baseline"');
    expect(await readdir(fixture.authorityDirectory)).toEqual(["promotion-fixture-validity.json"]);
  });

  it("rejects tampered source evidence without mutating the registry", async () => {
    const fixture = await createPromotionFixture();
    await writeFile(fixture.firstAttemptReceiptPath, "{}\n");

    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/source receipt digest does not match/u);

    await expectDiagnosticRegistry(fixture.repositoryRoot);
  });

  it("rejects missing cleanup proof without mutating the registry", async () => {
    const fixture = await createPromotionFixture({ cleanupFactsCollected: false });

    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/cleanupFactsCollected/u);

    await expectDiagnosticRegistry(fixture.repositoryRoot);
  });

  it("rejects calibration after the treatment source changes", async () => {
    const fixture = await createPromotionFixture();
    await writeFile(
      path.join(fixture.repositoryRoot, "plugins/test-plugin/skills/test-skill/SKILL.md"),
      "---\nname: test-skill\ndescription: Use when changed.\n---\n# Changed\n",
    );

    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/treatment source no longer matches/u);

    await expectDiagnosticRegistry(fixture.repositoryRoot);
  });

  it("rejects non-passing calibration and absent parent acceptance", async () => {
    const nonPassing = await createPromotionFixture({ outcome: "behavior_fail" });
    await expect(promoteScenarioFromReceipt({
      repositoryRoot: nonPassing.repositoryRoot,
      scenarioReceiptPath: nonPassing.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: nonPassing.dependencies,
    })).rejects.toThrow(/only a passing calibration/u);
    await expectDiagnosticRegistry(nonPassing.repositoryRoot);

    const unaccepted = await createPromotionFixture();
    await expect(promoteScenarioFromReceipt({
      repositoryRoot: unaccepted.repositoryRoot,
      scenarioReceiptPath: unaccepted.scenarioReceiptPath,
      parentAccepted: false,
      verifyMutationCoverage: async () => undefined,
      dependencies: unaccepted.dependencies,
    })).rejects.toThrow(/explicit parent acceptance/u);
    await expectDiagnosticRegistry(unaccepted.repositoryRoot);
  });

  it("loads fresh promoted authority but requires a separate exact-run acceptance step", async () => {
    const fixture = await createPromotionFixture();
    await promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    });
    const registry = await loadEvaluationRegistry({
      repositoryRoot: fixture.repositoryRoot,
      registryPath: path.join(fixture.repositoryRoot, REGISTRY_PATH),
      knownScenarios: [{
        scenarioId: fixture.contract.scenarioId,
        behaviorContractDigest: fixture.contract.behaviorContractDigest,
      }],
    });
    const registryRow = registry.scenarios[0];
    if (registryRow === undefined) throw new Error("fixture registry row is missing");
    const authority = await createRuntimeAuthorityContext({
      repositoryRoot: fixture.repositoryRoot,
      contract: fixture.contract,
      registryRow,
      calculateFreshnessInputs: fixture.dependencies.calculateFreshnessInputs,
    });
    expect(authority.calibration?.currentBaseline.freshness).toEqual({ status: "fresh", reasonCode: null });

    const runDigest = DIGEST("8");
    const request = {
      candidate: {
        scenarioId: fixture.contract.scenarioId,
        behaviorContractDigest: fixture.contract.behaviorContractDigest as AuthorityDigest,
        behaviorRequirementIds: fixture.contract.behaviorRequirementIds,
        evaluationRole: "gate",
        outcome: "pass",
        comparisonIntent: fixture.contract.comparisonIntent,
        evidenceDigest: DIGEST("9"),
      },
      runDigest,
      claimedRequirementManifestDigest: DIGEST("2"),
    } as const;
    await expect(authority.resolveParentAcceptance(request)).resolves.toBeNull();
    if (authority.calibration === null) throw new Error("fixture calibration is missing");
    const acceptance = await persistExplicitParentAcceptance({
      repositoryRoot: fixture.repositoryRoot,
      contract: fixture.contract,
      currentBaseline: authority.calibration.currentBaseline,
      request,
    });
    expect(acceptance?.receipt).toMatchObject({ acceptedRunDigest: runDigest });
    await expect(readFile(path.join(fixture.repositoryRoot, acceptance?.sourceReceipt.receiptPath ?? ""), "utf8"))
      .resolves.toContain(runDigest);
  });

  it("marks promoted authority stale when current freshness inputs change", async () => {
    const fixture = await createPromotionFixture();
    await promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    });
    const registry = await loadEvaluationRegistry({
      repositoryRoot: fixture.repositoryRoot,
      registryPath: path.join(fixture.repositoryRoot, REGISTRY_PATH),
      knownScenarios: [{
        scenarioId: fixture.contract.scenarioId,
        behaviorContractDigest: fixture.contract.behaviorContractDigest,
      }],
    });
    const registryRow = registry.scenarios[0];
    if (registryRow === undefined) throw new Error("fixture registry row is missing");
    const stale = await createRuntimeAuthorityContext({
      repositoryRoot: fixture.repositoryRoot,
      contract: fixture.contract,
      registryRow,
      calculateFreshnessInputs: async () => ({
        ...fixture.freshnessInputs,
        runnerSemanticsDigest: DIGEST("7"),
      }),
    });
    expect(stale.calibration?.currentBaseline.freshness).toEqual({
      status: "stale",
      reasonCode: "stale_calibration",
    });
  });

  it("accepts one exact persisted gate run without mutating the candidate receipt", async () => {
    const fixture = await createPromotionFixture();
    await promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    });
    const registry = await loadEvaluationRegistry({
      repositoryRoot: fixture.repositoryRoot,
      registryPath: path.join(fixture.repositoryRoot, REGISTRY_PATH),
      knownScenarios: [{
        scenarioId: fixture.contract.scenarioId,
        behaviorContractDigest: fixture.contract.behaviorContractDigest,
      }],
    });
    const registryRow = registry.scenarios[0];
    if (registryRow === undefined) throw new Error("fixture registry row is missing");
    const authority = await createRuntimeAuthorityContext({
      repositoryRoot: fixture.repositoryRoot,
      contract: fixture.contract,
      registryRow,
      calculateFreshnessInputs: fixture.dependencies.calculateFreshnessInputs,
    });
    if (authority.calibration === null) throw new Error("fixture calibration is missing");
    const candidate = JSON.parse(await readFile(fixture.scenarioReceiptPath, "utf8")) as {
      authoritySnapshot: Record<string, unknown>;
    } & Record<string, unknown>;
    candidate.authoritySnapshot = {
      ...candidate.authoritySnapshot,
      evaluationRole: "gate",
      freshness: "fresh",
      calibrationStatus: "calibrated",
      evidenceDigest: DIGEST("9"),
      releaseAuthority: false,
      reasonCode: "missing_parent_acceptance",
      parentAcceptanceReceiptDigest: null,
      parentAcceptanceSourceReceipt: null,
      calibrationAuthorityReceiptDigest: authority.calibration.currentBaseline.authorityReceiptDigest,
      calibrationFingerprintDigest: authority.calibration.currentBaseline.calibrationFingerprint.digest,
    };
    const candidateSource = `${JSON.stringify(candidate, null, 2)}\n`;
    await writeFile(fixture.scenarioReceiptPath, candidateSource);

    const repositoryRelativeScenarioReceiptPath = path.relative(
      fixture.repositoryRoot,
      fixture.scenarioReceiptPath,
    );
    const accepted = await acceptScenarioRunFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: repositoryRelativeScenarioReceiptPath,
      parentAccepted: true,
      dependencies: {
        validateScenarioExecution: async () => ({}) as never,
        createAuthorityContext: async () => authority,
      },
    });

    await expect(readFile(fixture.scenarioReceiptPath, "utf8")).resolves.toBe(candidateSource);
    await expect(readFile(accepted.acceptedScenarioReceiptPath, "utf8")).resolves.toContain(
      '"releaseAuthority": true',
    );
    await expect(
      readFile(path.join(fixture.repositoryRoot, accepted.parentAcceptanceReceiptPath), "utf8"),
    ).resolves.toContain(accepted.runDigest);
    await expect(acceptScenarioRunFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      dependencies: {
        validateScenarioExecution: async () => ({}) as never,
        createAuthorityContext: async () => authority,
      },
    })).resolves.toEqual(accepted);
  });

  it("rejects implicit run acceptance and rolls back acceptance if derived receipt commit fails", async () => {
    const fixture = await createPromotionFixture();
    await expect(acceptScenarioRunFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: false,
    })).rejects.toThrow(/explicit parent decision/u);
  });

  it("rejects a diagnostic run produced under stale calibration inputs", async () => {
    const fixture = await createPromotionFixture();
    const source = JSON.parse(await readFile(fixture.scenarioReceiptPath, "utf8")) as {
      authoritySnapshot: { calibrationFreshnessInputs: CalibrationFreshnessInputs };
    };
    source.authoritySnapshot.calibrationFreshnessInputs = {
      ...source.authoritySnapshot.calibrationFreshnessInputs,
      runnerSemanticsDigest: DIGEST("7"),
    };
    await writeFile(fixture.scenarioReceiptPath, `${JSON.stringify(source, null, 2)}\n`);

    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/diagnostic run.*freshness|stale calibration inputs/u);
    await expectDiagnosticRegistry(fixture.repositoryRoot);
  });

  it("rolls back candidate authority files when the registry commit fails", async () => {
    const fixture = await createPromotionFixture();
    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: {
        ...fixture.dependencies,
        beforeRegistryCommit: async () => {
          throw new Error("registry commit rejected");
        },
      },
    })).rejects.toThrow(/registry commit rejected/u);

    await expectDiagnosticRegistry(fixture.repositoryRoot);
    expect(await readdir(path.join(fixture.repositoryRoot, AUTHORITY_ROOT))).toEqual([
      "promotion-fixture-validity.json",
    ]);
  });

  it("fails closed when the registry changes before the atomic commit", async () => {
    const fixture = await createPromotionFixture();
    const registryPath = path.join(fixture.repositoryRoot, REGISTRY_PATH);
    const original = await readFile(registryPath, "utf8");
    const concurrentSource = `${original}\n# concurrent authority update\n`;

    await expect(promoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      parentAccepted: true,
      verifyMutationCoverage: async () => undefined,
      dependencies: {
        ...fixture.dependencies,
        beforeRegistryCommit: async () => {
          await writeFile(registryPath, concurrentSource);
        },
      },
    })).rejects.toThrow(/registry changed|concurrent/u);

    await expect(readFile(registryPath, "utf8")).resolves.toBe(concurrentSource);
    expect(await readdir(path.join(fixture.repositoryRoot, AUTHORITY_ROOT))).toEqual([
      "promotion-fixture-validity.json",
    ]);
  });
});

async function createPromotionFixture(overrides: {
  readonly cleanupFactsCollected?: boolean;
  readonly outcome?: "pass" | "behavior_fail";
} = {}) {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "promotion-transaction-"));
  const scenarioDirectory = path.join(repositoryRoot, "tests/test-plugin/test-skill/scenarios");
  const skillDirectory = path.join(repositoryRoot, "plugins/test-plugin/skills/test-skill");
  const authorityDirectory = path.join(repositoryRoot, AUTHORITY_ROOT);
  const receiptDirectory = path.join(repositoryRoot, "tmp/skill-pressure-evals/test-run/receipts");
  await Promise.all([
    mkdir(scenarioDirectory, { recursive: true }),
    mkdir(skillDirectory, { recursive: true }),
    mkdir(authorityDirectory, { recursive: true }),
    mkdir(receiptDirectory, { recursive: true }),
  ]);
  await writeFile(path.join(skillDirectory, "SKILL.md"), "---\nname: test-skill\ndescription: Use when testing promotion.\n---\n# Test\n");
  const treatmentDigest = calculateSkillSourceClosureDigest(skillDirectory);
  const scenarioPath = path.join(scenarioDirectory, "promotion-fixture.md");
  await writeFile(scenarioPath, scenarioSource());
  const contract = await loadScenarioContract({ scenarioPath });
  const validityReceipt = {
    schemaVersion: 1,
    receiptKind: "scenario_validity",
    scenarioId: contract.scenarioId,
    behaviorContractDigest: contract.behaviorContractDigest,
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
  const validitySource = `${JSON.stringify(validityReceipt, null, 2)}\n`;
  const validityPath = `${AUTHORITY_ROOT}/promotion-fixture-validity.json`;
  await writeFile(path.join(repositoryRoot, validityPath), validitySource);
  await mkdir(path.dirname(path.join(repositoryRoot, REGISTRY_PATH)), { recursive: true });
  await writeFile(path.join(repositoryRoot, REGISTRY_PATH), registrySource({
    behaviorContractDigest: contract.behaviorContractDigest,
    validityPath,
    validityDigest: digest(validitySource),
  }));

  const attemptReferences = [];
  const repetitionReferences = [];
  const subjects = [];
  let firstAttemptReceiptPath = "";
  for (const variant of ["baseline", "treatment"] as const) {
    for (let repetitionNumber = 1; repetitionNumber <= 3; repetitionNumber += 1) {
      const attempt = {
        schemaVersion: 1,
        scenarioId: contract.scenarioId,
        variant,
        repetitionNumber,
        attemptNumber: 1,
        durableFacts: {
          processClosed: true,
          streamsDrained: true,
          outputRedacted: true,
          snapshotsCollected: true,
          cleanupFactsCollected: overrides.cleanupFactsCollected ?? true,
        },
        lastDurableStage: "attempt_receipt_published",
      };
      const attemptPath = path.join(receiptDirectory, `${variant}-${String(repetitionNumber)}-attempt-1.json`);
      const attemptSource = `${JSON.stringify(attempt, null, 2)}\n`;
      await writeFile(attemptPath, attemptSource);
      if (firstAttemptReceiptPath === "") firstAttemptReceiptPath = attemptPath;
      attemptReferences.push({ receiptPath: attemptPath, receiptDigest: digest(attemptSource) });

      const repetition = {
        schemaVersion: 1,
        scenarioId: contract.scenarioId,
        variant,
        repetitionNumber,
        repetitionId: `${variant}-${String(repetitionNumber)}`,
        acceptedAttemptReceiptPath: attemptPath,
        acceptedAttemptReceiptDigest: digest(attemptSource),
        lastDurableStage: "repetition_receipt_published",
      };
      const repetitionPath = path.join(receiptDirectory, `${variant}-${String(repetitionNumber)}-repetition.json`);
      const repetitionSource = `${JSON.stringify(repetition, null, 2)}\n`;
      await writeFile(repetitionPath, repetitionSource);
      repetitionReferences.push({ receiptPath: repetitionPath, receiptDigest: digest(repetitionSource) });
      subjects.push({
        evidence: { variant, repetitionId: repetition.repetitionId },
        comparisonIdentity: {
          sourceDigest: variant === "treatment" ? treatmentDigest : null,
        },
      });
    }
  }
  const runtimeProfile = verifyRuntimeProfile({
    profile: ACPX_LUNA_HIGH_SUBJECT_PROFILE,
    providerReported: { model: "gpt-5.6-luna", reasoningEffort: "high" },
  });
  const freshnessInputs: CalibrationFreshnessInputs = {
    behaviorContractDigest: contract.behaviorContractDigest as AuthorityDigest,
    baselinePolicyDigest: DIGEST("3"),
    runnerSemanticsDigest: DIGEST("4"),
    subjectProfileDigest: DIGEST("5"),
    reviewProfileDigest: DIGEST("6"),
  };
  const scenarioReceipt = {
    schemaVersion: 3,
    scenarioId: contract.scenarioId,
    behaviorIdentity: {
      behaviorContractDigest: contract.behaviorContractDigest,
      behaviorRequirementIds: contract.behaviorRequirementIds,
      comparisonIntent: contract.comparisonIntent,
      expectedRepetitions: 3,
    },
    authoritySnapshot: {
      runDigest: DIGEST("1"),
      calibrationFreshnessInputs: freshnessInputs,
    },
    claimedRequirements: { manifestDigest: DIGEST("2") },
    comparisonValidation: { valid: true, reasons: [] },
    objectiveResults: [{ checkId: "artifact-exists", outcome: "pass" }],
    semanticReview: { validation: { valid: true, reason: null }, candidate: { assertions: [] } },
    runtimeProfiles: { subjects: Array.from({ length: 6 }, () => runtimeProfile), reviewer: runtimeProfile },
    subjects,
    attemptReceipts: attemptReferences,
    repetitionReceipts: repetitionReferences,
    reduction: { outcome: overrides.outcome ?? "pass", reasonCode: null, reasons: [] },
  } as unknown as ExecutedV3BehavioralScenario["receipt"];
  const scenarioReceiptPath = path.join(receiptDirectory, "scenario-receipt.json");
  await writeFile(scenarioReceiptPath, `${JSON.stringify(scenarioReceipt, null, 2)}\n`);
  return {
    repositoryRoot,
    scenarioReceiptPath,
    firstAttemptReceiptPath,
    authorityDirectory,
    contract,
    freshnessInputs,
    dependencies: {
      validateScenarioExecution: async () => ({}) as never,
      validateAggregateReceipt: async () => undefined,
      calculateFreshnessInputs: async () => freshnessInputs,
    },
  };
}

async function expectDiagnosticRegistry(repositoryRoot: string): Promise<void> {
  const source = await readFile(path.join(repositoryRoot, REGISTRY_PATH), "utf8");
  expect(source).toContain("evaluation_role: diagnostic");
  expect(source).toContain("calibration_receipt: null");
}

function scenarioSource(): string {
  return `---
schema_version: 3
scenario_id: promotion-fixture
owner_plugin: test-plugin
owner_skill: test-skill
skill_type: discipline
effect_surfaces: [response]
prompt: Produce the requested evidence.
semantic_assertions:
  - assertion_id: promotion-behavior
    criterion: The response follows the instruction.
    evidence_surface: response
behavior_requirement_ids: [promotion-fixture]
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# Promotion fixture
`;
}

function registrySource(props: {
  readonly behaviorContractDigest: string;
  readonly validityPath: string;
  readonly validityDigest: string;
}): string {
  return `schema_version: 1
scenarios:
  - scenario_id: promotion-fixture
    behavior_contract_digest: ${props.behaviorContractDigest}
    evaluation_role: diagnostic
    freshness: uncalibrated
    validity_review:
      receipt_path: ${props.validityPath}
      receipt_digest: ${props.validityDigest}
    calibration_receipt: null
`;
}

function digest(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function DIGEST(character: string): AuthorityDigest {
  return `sha256:${character.repeat(64)}`;
}

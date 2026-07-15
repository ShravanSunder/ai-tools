import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadScenarioContract } from "../contracts/skill-contracts.js";
import type { ExecutedV3BehavioralScenario } from "../evaluation/v3-behavioral-scenario-execution.js";
import {
  calculateEvaluationRegistrySnapshotDigest,
  loadEvaluationRegistry,
} from "./evaluation-registry.js";
import { type AuthorityDigest } from "./authority-receipts.js";
import {
  demoteScenarioFromReceipt,
  type DemotionReason,
} from "./demotion-transaction.js";

const AUTHORITY_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const REGISTRY_PATH = "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml";

describe("demotion transaction", () => {
  it("atomically clears the current owner-local baseline without leaving a demotion receipt", async () => {
    const fixture = await createDemotionFixture();
    const sourceBefore = await readFile(fixture.scenarioReceiptPath, "utf8");

    const result = await demoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      aggregateReceiptPath: fixture.aggregateReceiptPath,
      reason: "contract_contradiction",
      parentAccepted: true,
      dependencies: fixture.dependencies,
    });

    const registry = await loadFixtureRegistry(fixture);
    const row = registry.scenarios[0];
    expect(row).toMatchObject({
      evaluationRole: "diagnostic",
      freshness: "stale",
      calibrationReceipt: null,
    });
    await expect(readFile(fixture.baselinePath, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    expect((await readdir(path.dirname(fixture.baselinePath))).sort()).toEqual([]);
    await expect(readFile(fixture.scenarioReceiptPath, "utf8")).resolves.toBe(sourceBefore);
  });

  it("rejects absent parent acceptance and treatment-derived reasons without publishing authority", async () => {
    const fixture = await createDemotionFixture();
    const originalRegistry = await readFile(fixture.registryPath, "utf8");

    await expect(demoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      aggregateReceiptPath: fixture.aggregateReceiptPath,
      reason: "unstable_baseline",
      parentAccepted: false,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/explicit parent acceptance/u);
    await expect(demoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      aggregateReceiptPath: fixture.aggregateReceiptPath,
      reason: "treatment_failure" as unknown as DemotionReason,
      parentAccepted: true,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/treatment failure or mix/u);

    await expect(readFile(fixture.registryPath, "utf8")).resolves.toBe(originalRegistry);
    expect((await readdir(fixture.authorityDirectory)).sort()).toEqual([
      "demotion-fixture-validity.json",
    ]);
  });

  it("rejects a registry row that is no longer a current gate", async () => {
    const fixture = await createDemotionFixture({ evaluationRole: "diagnostic" });

    await expect(demoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      aggregateReceiptPath: fixture.aggregateReceiptPath,
      reason: "reviewer_ambiguity",
      parentAccepted: true,
      dependencies: fixture.dependencies,
    })).rejects.toThrow(/only current gate rows/u);

    expect((await readdir(fixture.authorityDirectory)).sort()).toEqual([
      "demotion-fixture-validity.json",
    ]);
  });

  it("fails the pre-rename CAS and rolls back the candidate receipt", async () => {
    const fixture = await createDemotionFixture();
    const originalRegistry = await readFile(fixture.registryPath, "utf8");
    const concurrentRegistry = `${originalRegistry}\n# concurrent authority update\n`;

    await expect(demoteScenarioFromReceipt({
      repositoryRoot: fixture.repositoryRoot,
      scenarioReceiptPath: fixture.scenarioReceiptPath,
      aggregateReceiptPath: fixture.aggregateReceiptPath,
      reason: "execution_budget_insufficient",
      parentAccepted: true,
      dependencies: {
        ...fixture.dependencies,
        beforeRegistryCommit: async () => {
          await writeFile(fixture.registryPath, concurrentRegistry);
        },
      },
    })).rejects.toThrow(/registry changed|concurrent/u);

    await expect(readFile(fixture.registryPath, "utf8")).resolves.toBe(concurrentRegistry);
    expect((await readdir(fixture.authorityDirectory)).sort()).toEqual([
      "demotion-fixture-validity.json",
    ]);
  });
});

async function createDemotionFixture(props: {
  readonly evaluationRole?: "gate" | "diagnostic";
} = {}) {
  const evaluationRole = props.evaluationRole ?? "gate";
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "demotion-transaction-"));
  const scenarioDirectory = path.join(repositoryRoot, "tests/test-plugin/test-skill/scenarios");
  const skillDirectory = path.join(repositoryRoot, "plugins/test-plugin/skills/test-skill");
  const authorityDirectory = path.join(repositoryRoot, AUTHORITY_ROOT);
  const baselineDirectory = path.join(repositoryRoot, "tests/test-plugin/test-skill/baselines");
  const receiptDirectory = path.join(repositoryRoot, "tmp/skill-pressure-evals/test-run/receipts");
  const registryPath = path.join(repositoryRoot, REGISTRY_PATH);
  await Promise.all([
    mkdir(scenarioDirectory, { recursive: true }),
    mkdir(skillDirectory, { recursive: true }),
    mkdir(authorityDirectory, { recursive: true }),
    mkdir(baselineDirectory, { recursive: true }),
    mkdir(receiptDirectory, { recursive: true }),
    mkdir(path.dirname(registryPath), { recursive: true }),
  ]);

  await writeFile(
    path.join(skillDirectory, "SKILL.md"),
    "---\nname: test-skill\ndescription: Use when testing demotion.\n---\n# Test\n",
  );
  const scenarioPath = path.join(scenarioDirectory, "demotion-fixture.md");
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
  const validityPath = `${AUTHORITY_ROOT}/demotion-fixture-validity.json`;
  await writeFile(path.join(repositoryRoot, validityPath), validitySource);

  const baselineReceipt = {
    schemaVersion: 1,
    receiptKind: "current_baseline",
    scenarioId: contract.scenarioId,
    behaviorContractDigest: contract.behaviorContractDigest,
    calibrationFingerprint: {
      behaviorContractDigest: contract.behaviorContractDigest,
      baselinePolicyDigest: DIGEST("a"),
      runnerSemanticsDigest: DIGEST("b"),
      subjectProfileDigest: DIGEST("c"),
      reviewProfileDigest: DIGEST("d"),
    },
    calibrationRunDigest: DIGEST("e"),
    acceptedSkillSourceDigest: DIGEST("f"),
    calibration: {
      contractConsistent: true,
      contractConsistencyEvidenceDigest: DIGEST("1"),
      baselinePolicyValid: true,
      baselinePolicyEvidenceDigest: DIGEST("2"),
      baselineRepetitionDigests: [DIGEST("3"), DIGEST("4"), DIGEST("5")],
      treatmentRepetitionDigests: [DIGEST("6"), DIGEST("7"), DIGEST("8")],
      comparisonIntentPassed: true,
      objectiveEvidenceDigest: DIGEST("9"),
      semanticEvidenceDigest: DIGEST("a"),
      deterministicMutationCoverage: true,
      subjectProfileVerified: true,
      reviewProfileVerified: true,
    },
    executionEvidence: {
      calibrationRunDigest: DIGEST("e"),
      acceptedSkillSourceDigest: DIGEST("f"),
      repetitions: ["baseline", "treatment"].flatMap((variant) =>
        [1, 2, 3].map((repetitionNumber) => ({
          variant,
          repetitionNumber,
          attemptNumber: 1,
          sourceAttemptReceiptDigest: digest(`${variant}-${String(repetitionNumber)}-attempt`),
          acceptedAttemptReceiptDigest: digest(`${variant}-${String(repetitionNumber)}-attempt`),
          acceptedRepetitionReceiptDigest: digest(`${variant}-${String(repetitionNumber)}-repetition`),
          processClosed: true,
          streamsDrained: true,
          outputRedacted: true,
          snapshotsCollected: true,
          cleanupFactsCollected: true,
        })),
      ),
    },
    parentAcceptance: {
      schemaVersion: 1,
      receiptKind: "parent_acceptance",
      scenarioId: contract.scenarioId,
      behaviorContractDigest: contract.behaviorContractDigest,
      acceptedAuthorityReceiptDigest: DIGEST("f"),
      acceptedRunDigest: DIGEST("e"),
      calibrationFingerprintDigest: DIGEST("d"),
      claimedRequirementManifestDigest: DIGEST("c"),
    },
  };
  const baselineSource = `${JSON.stringify(baselineReceipt, null, 2)}\n`;
  const baselinePath = "tests/test-plugin/test-skill/baselines/demotion-fixture.json";
  await writeFile(path.join(repositoryRoot, baselinePath), baselineSource);
  await writeFile(registryPath, registrySource({
    behaviorContractDigest: contract.behaviorContractDigest,
    evaluationRole,
    validityPath,
    validityDigest: digest(validitySource),
    baselinePath,
    baselineDigest: digest(baselineSource),
  }));

  const registry = await loadEvaluationRegistry({
    repositoryRoot,
    registryPath,
    knownScenarios: [{
      scenarioId: contract.scenarioId,
      behaviorContractDigest: contract.behaviorContractDigest,
      plugin: contract.plugin,
      skill: contract.skill,
    }],
  });
  const scenarioReceipt = {
    schemaVersion: 3,
    scenarioId: contract.scenarioId,
    behaviorIdentity: {
      behaviorContractDigest: contract.behaviorContractDigest,
      behaviorRequirementIds: contract.behaviorRequirementIds,
      comparisonIntent: contract.comparisonIntent,
      expectedRepetitions: contract.repetitions,
    },
    authoritySnapshot: {
      evaluationRole,
      freshness: evaluationRole === "gate" ? "fresh" : "uncalibrated",
      registrySnapshotDigest: calculateEvaluationRegistrySnapshotDigest(registry),
      calibrationStatus: evaluationRole === "gate" ? "calibrated" : "uncalibrated",
      runDigest: DIGEST("1"),
      evidenceDigest: DIGEST("2"),
      releaseAuthority: evaluationRole === "gate",
      reasonCode: null,
      parentAcceptanceReceiptDigest: null,
      parentAcceptanceSourceReceipt: null,
      calibrationSourceReceipt: null,
      calibrationAuthorityReceiptDigest: null,
      calibrationFingerprintDigest: DIGEST("3"),
      calibrationFreshnessInputs: null,
      demotedThisRun: false,
    },
    claimedRequirements: {
      source: "spec",
      claimedRequirementIds: contract.behaviorRequirementIds,
      manifestDigest: DIGEST("4"),
      status: "traced",
      unknownRequirementIds: [],
      untracedRequirementIds: [],
    },
    repetitionReceipts: [{ receiptPath: "fixture-repetition.json", receiptDigest: DIGEST("5") }],
    semanticReview: {
      validation: { valid: true, reason: null },
      runtimeProfile: null,
      candidate: { assertions: [] },
    },
  } as unknown as ExecutedV3BehavioralScenario["receipt"];
  const scenarioReceiptPath = path.join(receiptDirectory, "scenario-receipt.json");
  const candidateReceiptSource = `${JSON.stringify(scenarioReceipt, null, 2)}\n`;
  await writeFile(scenarioReceiptPath, candidateReceiptSource);
  const aggregateReceiptPath = path.join(receiptDirectory, "aggregate-receipt.json");
  await writeFile(
    aggregateReceiptPath,
    `${JSON.stringify({
      schemaVersion: 3,
      results: [{
        scenarioId: contract.scenarioId,
        runDigest: scenarioReceipt.authoritySnapshot.runDigest,
        scenarioReceiptDigest: digest(candidateReceiptSource),
      }],
    }, null, 2)}\n`,
  );

  return {
    repositoryRoot,
    registryPath,
    authorityDirectory,
    baselinePath: path.join(repositoryRoot, baselinePath),
    scenarioReceiptPath,
    aggregateReceiptPath,
    contract,
    dependencies: {
      validateScenarioExecution: async () => ({}) as never,
    },
  };
}

async function loadFixtureRegistry(fixture: Awaited<ReturnType<typeof createDemotionFixture>>) {
  return loadEvaluationRegistry({
    repositoryRoot: fixture.repositoryRoot,
    registryPath: fixture.registryPath,
    knownScenarios: [{
      scenarioId: fixture.contract.scenarioId,
      behaviorContractDigest: fixture.contract.behaviorContractDigest,
      plugin: fixture.contract.plugin,
      skill: fixture.contract.skill,
    }],
  });
}

function scenarioSource(): string {
  return `---
schema_version: 3
scenario_id: demotion-fixture
owner_plugin: test-plugin
owner_skill: test-skill
skill_type: discipline
effect_surfaces: [response]
prompt: Produce the requested evidence.
semantic_assertions:
  - assertion_id: demotion-behavior
    criterion: The response follows the instruction.
    evidence_surface: response
behavior_requirement_ids: [demotion-fixture]
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
# Demotion fixture
`;
}

function registrySource(props: {
  readonly behaviorContractDigest: string;
  readonly evaluationRole: "gate" | "diagnostic";
  readonly validityPath: string;
  readonly validityDigest: AuthorityDigest;
  readonly baselinePath: string;
  readonly baselineDigest: AuthorityDigest;
}): string {
  const gateAuthority = props.evaluationRole === "gate"
    ? `
    calibration_receipt:
      receipt_path: ${props.baselinePath}
      receipt_digest: ${props.baselineDigest}`
    : `
    calibration_receipt: null`;
  return `schema_version: 1
scenarios:
  - scenario_id: demotion-fixture
    behavior_contract_digest: ${props.behaviorContractDigest}
    evaluation_role: ${props.evaluationRole}
    freshness: ${props.evaluationRole === "gate" ? "fresh" : "uncalibrated"}
    validity_review:
      receipt_path: ${props.validityPath}
      receipt_digest: ${props.validityDigest}${gateAuthority}
`;
}

function digest(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function DIGEST(character: string): AuthorityDigest {
  return `sha256:${character.repeat(64)}`;
}

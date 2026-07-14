import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  calculateCalibrationFreshnessFingerprint,
  calculateAuthorityReceiptDigest,
  type AuthorityDigest,
  type ParentAcceptanceReceipt,
  type PromotionEvidenceReceiptReference,
  type ValidatedPromotionReceipt,
} from "./authority/authority-receipts.js";
import {
  validateClaimedRequirementManifest,
  type ClaimedRequirementValidation,
} from "./authority/claimed-requirements.js";

export interface ScenarioFixture {
  readonly scenarioId: string;
  readonly relativePath: string;
  readonly body?: string;
}

export interface SkillFixture {
  readonly plugin: string;
  readonly skill: string;
  readonly scenarios?: readonly ScenarioFixture[];
}

export const fixtureAuthorityDigest = (character: string): AuthorityDigest => `sha256:${character.repeat(64)}`;

export function createClaimedRequirementValidationFixture(props: {
  readonly claimedRequirementIds: readonly string[];
  readonly knownRequirementIds?: readonly string[];
  readonly calibratedGateRequirementIds?: readonly string[];
}): ClaimedRequirementValidation {
  return validateClaimedRequirementManifest({
    manifest: {
      schemaVersion: 1,
      source: "proof_matrix",
      claimedRequirementIds: props.claimedRequirementIds,
    },
    knownRequirementIds: props.knownRequirementIds ?? props.claimedRequirementIds,
    calibratedGateRequirementIds: props.calibratedGateRequirementIds ?? props.claimedRequirementIds,
  });
}

export function createValidatedPromotionFixture(props: {
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly freshness?: "fresh" | "stale";
  readonly claimedRequirementManifestDigest?: AuthorityDigest;
  readonly attemptReceipts?: readonly PromotionEvidenceReceiptReference[];
  readonly cleanupReceipts?: readonly PromotionEvidenceReceiptReference[];
}): ValidatedPromotionReceipt {
  const freshnessInputs = {
    behaviorContractDigest: props.behaviorContractDigest,
    baselinePolicyDigest: fixtureAuthorityDigest("b"),
    runnerSemanticsDigest: fixtureAuthorityDigest("c"),
    subjectProfileDigest: fixtureAuthorityDigest("d"),
    reviewProfileDigest: fixtureAuthorityDigest("e"),
  } as const;
  const calibrationFingerprint = calculateCalibrationFreshnessFingerprint(freshnessInputs);
  const unsignedReceipt = {
    schemaVersion: 1 as const,
    receiptKind: "promotion" as const,
    scenarioId: props.scenarioId,
    behaviorContractDigest: props.behaviorContractDigest,
    calibrationFingerprint: freshnessInputs,
    calibrationRunDigest: fixtureAuthorityDigest("1"),
    promotionTreatmentDigest: fixtureAuthorityDigest("2"),
    calibration: {
      contractConsistent: true as const,
      contractConsistencyEvidenceDigest: fixtureAuthorityDigest("3"),
      baselinePolicyValid: true as const,
      baselinePolicyEvidenceDigest: fixtureAuthorityDigest("4"),
      baselineRepetitionDigests: ["0", "1", "2", "3", "4"].map(fixtureAuthorityDigest),
      treatmentRepetitionDigests: ["5", "6", "7", "8", "9"].map(fixtureAuthorityDigest),
      comparisonIntentPassed: true as const,
      objectiveEvidenceDigest: fixtureAuthorityDigest("5"),
      semanticEvidenceDigest: fixtureAuthorityDigest("6"),
      attemptReceipts: props.attemptReceipts ?? createPromotionEvidenceReferenceFixtures(props.scenarioId, "attempt"),
      cleanupReceipts: props.cleanupReceipts ?? createPromotionEvidenceReferenceFixtures(props.scenarioId, "cleanup"),
      deterministicMutationCoverage: true as const,
      subjectProfileVerified: true as const,
      reviewProfileVerified: true as const,
    },
  };
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(unsignedReceipt);
  return {
    receipt: {
      ...unsignedReceipt,
      parentAcceptance: {
        schemaVersion: 1,
        receiptKind: "parent_acceptance",
        scenarioId: props.scenarioId,
        behaviorContractDigest: props.behaviorContractDigest,
        acceptedAuthorityReceiptDigest: authorityReceiptDigest,
        acceptedRunDigest: fixtureAuthorityDigest("1"),
        calibrationFingerprintDigest: calibrationFingerprint.digest,
        claimedRequirementManifestDigest: props.claimedRequirementManifestDigest ?? fixtureAuthorityDigest("7"),
      },
    },
    authorityReceiptDigest,
    calibrationFingerprint,
    freshness: props.freshness === "stale"
      ? { status: "stale", reasonCode: "stale_calibration" }
      : { status: "fresh", reasonCode: null },
  };
}

function createPromotionEvidenceReferenceFixtures(
  scenarioId: string,
  receiptKind: "attempt" | "cleanup",
): readonly PromotionEvidenceReceiptReference[] {
  return ["baseline", "treatment"].flatMap((variant) =>
    Array.from({ length: 5 }, (_, index) => ({
      scenarioId,
      variant: variant as "baseline" | "treatment",
      repetitionNumber: index + 1,
      attemptNumber: 1,
      receiptPath: `tests/test-utils/skill-pressure/config/authority-receipts/${scenarioId}-${variant}-${index + 1}-${receiptKind}.json`,
      receiptDigest: fixtureAuthorityDigest(String(index)),
    })));
}

export function createRunAcceptanceFixture(props: {
  readonly calibration: ValidatedPromotionReceipt;
  readonly runDigest: AuthorityDigest;
  readonly claimedRequirementManifestDigest: AuthorityDigest;
}): ParentAcceptanceReceipt {
  return {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: props.calibration.receipt.scenarioId,
    behaviorContractDigest: props.calibration.receipt.behaviorContractDigest,
    acceptedAuthorityReceiptDigest: props.calibration.authorityReceiptDigest,
    acceptedRunDigest: props.runDigest,
    calibrationFingerprintDigest: props.calibration.calibrationFingerprint.digest,
    claimedRequirementManifestDigest: props.claimedRequirementManifestDigest,
  };
}

export async function createRepositoryFixture(): Promise<string> {
  const repositoryRoot = await mkdtemp(join(tmpdir(), "skill-pressure-"));
  await mkdir(join(repositoryRoot, "tests"), { recursive: true });
  await mkdir(join(repositoryRoot, "plugins"), { recursive: true });
  return repositoryRoot;
}

export async function addSkillFixture(
  repositoryRoot: string,
  fixture: SkillFixture,
): Promise<void> {
  const testOwnerRoot = join(repositoryRoot, "tests", fixture.plugin, fixture.skill);
  const pluginSkillRoot = join(repositoryRoot, "plugins", fixture.plugin, "skills", fixture.skill);
  await mkdir(testOwnerRoot, { recursive: true });
  await mkdir(pluginSkillRoot, { recursive: true });
  await writeFile(join(pluginSkillRoot, "SKILL.md"), "# Fixture skill\n");

  for (const scenario of fixture.scenarios ?? []) {
    const scenarioPath = join(testOwnerRoot, scenario.relativePath);
    await mkdir(join(scenarioPath, ".."), { recursive: true });
    await writeFile(
      scenarioPath,
      scenario.body ?? scenarioContract({
        scenarioId: scenario.scenarioId,
        plugin: fixture.plugin,
        skill: fixture.skill,
      }),
    );
  }
}

export function scenarioContract(props: {
  readonly scenarioId: string;
  readonly plugin: string;
  readonly skill: string;
  readonly repetitions?: number;
  readonly baseline?: "no_skill" | "previous_revision";
  readonly baselineRevision?: string;
  readonly comparisonIntent?: "improvement" | "non_regression";
}): string {
  const baseline = props.baseline ?? "no_skill";
  const baselineRevision = props.baselineRevision === undefined ? "" : `baseline_revision: ${props.baselineRevision}\n`;
  return `---
schema_version: 2
scenario_id: ${props.scenarioId}
owner_plugin: ${props.plugin}
owner_skill: ${props.skill}
skill_type: discipline
prompt: Follow the requested workflow under time pressure.
hidden_rubric: The response must reject the shortcut and follow the workflow.
baseline: ${baseline}
${baselineRevision}comparison_intent: ${props.comparisonIntent ?? "improvement"}
repetitions: ${props.repetitions ?? 5}
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
`;
}

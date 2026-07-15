import { describe, expect, it } from "vitest";

import {
  calculateAuthorityReceiptDigest,
  calculateCalibrationFreshnessFingerprint,
  evaluateCalibrationFreshness,
  evaluateReleaseAuthority,
  validateCurrentBaselineReceipt,
  validateDemotionReceipt,
  validateParentAcceptanceReceipt,
  type AuthorityDigest,
  type CalibrationFreshnessInputs,
  type CurrentBaselineExecutionRepetition,
  type CurrentBaselineReceipt,
  type ParentAcceptanceReceipt,
} from "./authority-receipts.js";

const DIGEST = (character: string): AuthorityDigest => `sha256:${character.repeat(64)}`;
const REPOSITORY_ROOT = "/tmp/authority-receipts";

const FRESHNESS_INPUTS: CalibrationFreshnessInputs = {
  behaviorContractDigest: DIGEST("a"),
  baselinePolicyDigest: DIGEST("b"),
  runnerSemanticsDigest: DIGEST("c"),
  subjectProfileDigest: DIGEST("d"),
  reviewProfileDigest: DIGEST("e"),
};

const EXECUTION_REPETITIONS = [
  {
    variant: "baseline",
    repetitionNumber: 1,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("0"),
    acceptedAttemptReceiptDigest: DIGEST("0"),
    acceptedRepetitionReceiptDigest: DIGEST("6"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
  {
    variant: "baseline",
    repetitionNumber: 2,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("1"),
    acceptedAttemptReceiptDigest: DIGEST("1"),
    acceptedRepetitionReceiptDigest: DIGEST("7"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
  {
    variant: "baseline",
    repetitionNumber: 3,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("2"),
    acceptedAttemptReceiptDigest: DIGEST("2"),
    acceptedRepetitionReceiptDigest: DIGEST("8"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
  {
    variant: "treatment",
    repetitionNumber: 1,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("3"),
    acceptedAttemptReceiptDigest: DIGEST("3"),
    acceptedRepetitionReceiptDigest: DIGEST("9"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
  {
    variant: "treatment",
    repetitionNumber: 2,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("4"),
    acceptedAttemptReceiptDigest: DIGEST("4"),
    acceptedRepetitionReceiptDigest: DIGEST("a"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
  {
    variant: "treatment",
    repetitionNumber: 3,
    attemptNumber: 1,
    sourceAttemptReceiptDigest: DIGEST("5"),
    acceptedAttemptReceiptDigest: DIGEST("5"),
    acceptedRepetitionReceiptDigest: DIGEST("b"),
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  },
] satisfies readonly CurrentBaselineExecutionRepetition[];

function parentAcceptance(props: {
  readonly authorityReceiptDigest: AuthorityDigest;
  readonly runDigest?: AuthorityDigest;
  readonly calibrationFingerprintDigest?: AuthorityDigest;
  readonly claimedRequirementManifestDigest?: AuthorityDigest;
}): ParentAcceptanceReceipt {
  return {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: "authority-fixture",
    behaviorContractDigest: FRESHNESS_INPUTS.behaviorContractDigest,
    acceptedAuthorityReceiptDigest: props.authorityReceiptDigest,
    acceptedRunDigest: props.runDigest ?? DIGEST("f"),
    calibrationFingerprintDigest:
      props.calibrationFingerprintDigest ?? calculateCalibrationFreshnessFingerprint(FRESHNESS_INPUTS).digest,
    claimedRequirementManifestDigest: props.claimedRequirementManifestDigest ?? DIGEST("1"),
  };
}

function currentBaselineReceipt(props: {
  readonly acceptedSkillSourceDigest?: AuthorityDigest;
  readonly freshnessInputs?: CalibrationFreshnessInputs;
} = {}): CurrentBaselineReceipt {
  const freshnessInputs = props.freshnessInputs ?? FRESHNESS_INPUTS;
  const unsignedReceipt = {
    schemaVersion: 1 as const,
    receiptKind: "current_baseline" as const,
    scenarioId: "authority-fixture",
    behaviorContractDigest: freshnessInputs.behaviorContractDigest,
    calibrationFingerprint: freshnessInputs,
    calibrationRunDigest: DIGEST("f"),
    acceptedSkillSourceDigest: props.acceptedSkillSourceDigest ?? DIGEST("9"),
    calibration: {
      contractConsistent: true as const,
      contractConsistencyEvidenceDigest: DIGEST("c"),
      baselinePolicyValid: true as const,
      baselinePolicyEvidenceDigest: DIGEST("d"),
      baselineRepetitionDigests: [DIGEST("0"), DIGEST("1"), DIGEST("2")],
      treatmentRepetitionDigests: [DIGEST("3"), DIGEST("4"), DIGEST("5")],
      comparisonIntentPassed: true as const,
      objectiveEvidenceDigest: DIGEST("a"),
      semanticEvidenceDigest: DIGEST("b"),
      deterministicMutationCoverage: true as const,
      subjectProfileVerified: true as const,
      reviewProfileVerified: true as const,
    },
    executionEvidence: {
      calibrationRunDigest: DIGEST("f"),
      acceptedSkillSourceDigest: props.acceptedSkillSourceDigest ?? DIGEST("9"),
      repetitions: EXECUTION_REPETITIONS,
    },
  };
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(unsignedReceipt);
  return {
    ...unsignedReceipt,
    parentAcceptance: parentAcceptance({
      authorityReceiptDigest,
      runDigest: unsignedReceipt.calibrationRunDigest,
      calibrationFingerprintDigest: calculateCalibrationFreshnessFingerprint(freshnessInputs).digest,
    }),
  };
}

async function validate(receipt: unknown) {
  return validateCurrentBaselineReceipt({
    receipt,
    currentFreshnessInputs: FRESHNESS_INPUTS,
    repositoryRoot: REPOSITORY_ROOT,
  });
}

describe("authority receipts", () => {
  it("accepts a complete parent-accepted current baseline receipt", async () => {
    const receipt = currentBaselineReceipt();

    await expect(validate(receipt)).resolves.toMatchObject({
      authorityReceiptDigest: calculateAuthorityReceiptDigest(receipt),
      freshness: { status: "fresh" },
    });
  });

  it("requires exactly three baseline and three treatment repetitions", async () => {
    const receipt = currentBaselineReceipt();

    await expect(validate({
      ...receipt,
      calibration: {
        ...receipt.calibration,
        baselineRepetitionDigests: receipt.calibration.baselineRepetitionDigests.slice(0, 2),
      },
    })).rejects.toThrow(/exactly three baseline and three treatment/u);
    await expect(validate({
      ...receipt,
      executionEvidence: {
        ...receipt.executionEvidence,
        repetitions: receipt.executionEvidence.repetitions.slice(0, 5),
      },
    })).rejects.toThrow(/exactly six repetitions/u);
  });

  it("rejects duplicate source attempts and accepted repetitions", async () => {
    const receipt = currentBaselineReceipt();
    const duplicateSource = receipt.executionEvidence.repetitions.map((repetition, index) =>
      index === 1
        ? {
            ...repetition,
            sourceAttemptReceiptDigest: receipt.executionEvidence.repetitions[0]!.sourceAttemptReceiptDigest,
            acceptedAttemptReceiptDigest: receipt.executionEvidence.repetitions[0]!.acceptedAttemptReceiptDigest,
          }
        : repetition,
    );
    await expect(validate({
      ...receipt,
      executionEvidence: { ...receipt.executionEvidence, repetitions: duplicateSource },
    })).rejects.toThrow(/duplicate source attempts/u);

    const duplicateRepetition = receipt.executionEvidence.repetitions.map((repetition, index) =>
      index === 1 ? { ...repetition, acceptedRepetitionReceiptDigest: receipt.executionEvidence.repetitions[0]!.acceptedRepetitionReceiptDigest } : repetition,
    );
    await expect(validate({
      ...receipt,
      executionEvidence: { ...receipt.executionEvidence, repetitions: duplicateRepetition },
    })).rejects.toThrow(/duplicate accepted repetitions/u);
  });

  it("rejects mismatched current-baseline evidence", async () => {
    const receipt = currentBaselineReceipt();
    await expect(validate({
      ...receipt,
      executionEvidence: {
        ...receipt.executionEvidence,
        acceptedSkillSourceDigest: DIGEST("8"),
      },
    })).rejects.toThrow(/source digest does not match/u);
    await expect(validate({
      ...receipt,
      executionEvidence: {
        ...receipt.executionEvidence,
        calibrationRunDigest: DIGEST("8"),
      },
    })).rejects.toThrow(/run digest does not match/u);
  });

  it("keeps calibration fresh when only the accepted skill source changes", async () => {
    const calibration = await validate(currentBaselineReceipt({ acceptedSkillSourceDigest: DIGEST("9") }));

    expect(evaluateCalibrationFreshness({
      recordedFingerprintDigest: calibration.calibrationFingerprint.digest,
      currentFreshnessInputs: FRESHNESS_INPUTS,
    })).toMatchObject({ status: "fresh" });
    expect(currentBaselineReceipt({ acceptedSkillSourceDigest: DIGEST("8") }).acceptedSkillSourceDigest).not.toBe(
      currentBaselineReceipt({ acceptedSkillSourceDigest: DIGEST("9") }).acceptedSkillSourceDigest,
    );
  });

  it("stales calibration when a behavior, baseline, runner, or profile input changes", () => {
    const recordedFingerprintDigest = calculateCalibrationFreshnessFingerprint(FRESHNESS_INPUTS).digest;
    const changedInputs = [
      { ...FRESHNESS_INPUTS, behaviorContractDigest: DIGEST("f") },
      { ...FRESHNESS_INPUTS, baselinePolicyDigest: DIGEST("f") },
      { ...FRESHNESS_INPUTS, runnerSemanticsDigest: DIGEST("f") },
      { ...FRESHNESS_INPUTS, subjectProfileDigest: DIGEST("f") },
      { ...FRESHNESS_INPUTS, reviewProfileDigest: DIGEST("f") },
    ];

    for (const currentFreshnessInputs of changedInputs) {
      expect(evaluateCalibrationFreshness({ recordedFingerprintDigest, currentFreshnessInputs })).toMatchObject({
        status: "stale",
        reasonCode: "stale_calibration",
      });
    }
  });

  it("rejects partial or digest-mismatched parent acceptance", async () => {
    const receipt = currentBaselineReceipt();
    await expect(validate({
      ...receipt,
      parentAcceptance: { ...receipt.parentAcceptance, acceptedAuthorityReceiptDigest: DIGEST("f") },
    })).rejects.toThrow(/parent acceptance.*authority receipt digest/u);

    const { claimedRequirementManifestDigest: _removed, ...partialAcceptance } = receipt.parentAcceptance;
    await expect(validate({ ...receipt, parentAcceptance: partialAcceptance })).rejects.toThrow(
      /parent acceptance receipt has unexpected/u,
    );
  });

  it("requires separate parent acceptance bound to the exact gate outcome before release authority", async () => {
    const baseline = await validate(currentBaselineReceipt());
    const runDigest = DIGEST("f");
    const acceptance = parentAcceptance({ authorityReceiptDigest: baseline.authorityReceiptDigest, runDigest });

    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: baseline,
      outcome: "pass",
      runDigest,
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: true, reasonCode: null });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: baseline,
      outcome: "pass",
      runDigest,
      parentAcceptance: null,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "missing_parent_acceptance" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: baseline,
      outcome: "pass",
      runDigest: DIGEST("0"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "parent_acceptance_mismatch" });
  });

  it("does not let diagnostic, stale, or untraced results carry release authority", async () => {
    const baseline = await validate(currentBaselineReceipt());
    const acceptance = parentAcceptance({ authorityReceiptDigest: baseline.authorityReceiptDigest });

    expect(evaluateReleaseAuthority({
      evaluationRole: "diagnostic",
      calibration: baseline,
      outcome: "pass",
      runDigest: DIGEST("f"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "diagnostic_result" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: { ...baseline, freshness: { status: "stale", reasonCode: "stale_calibration" } },
      outcome: "pass",
      runDigest: DIGEST("f"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "stale_calibration" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: baseline,
      outcome: "pass",
      runDigest: DIGEST("f"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "untraced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "untraced_behavior_requirement" });
  });

  it("rejects treatment failure or mix as demotion evidence and prevents same-run mutation", () => {
    const unsignedReceipt = {
      schemaVersion: 1 as const,
      receiptKind: "demotion" as const,
      scenarioId: "authority-fixture",
      behaviorContractDigest: FRESHNESS_INPUTS.behaviorContractDigest,
      observedRunDigest: DIGEST("f"),
      evidence: {
        contractDigest: FRESHNESS_INPUTS.behaviorContractDigest,
        repetitionSetDigest: DIGEST("a"),
        reviewDigest: DIGEST("b"),
        aggregateDigest: DIGEST("c"),
        reason: "contract_contradiction" as const,
      },
    };
    const receipt = {
      ...unsignedReceipt,
      parentAcceptance: parentAcceptance({ authorityReceiptDigest: calculateAuthorityReceiptDigest(unsignedReceipt) }),
    };

    expect(() => validateDemotionReceipt({ receipt, currentRunDigest: DIGEST("f") })).toThrow(/same run/u);
    for (const reason of ["treatment_behavior_failed", "mixed_treatment"]) {
      expect(() => validateDemotionReceipt({
        receipt: { ...receipt, evidence: { ...receipt.evidence, reason } },
      })).toThrow(/does not justify demotion/u);
    }
    expect(validateDemotionReceipt({ receipt })).toMatchObject({
      authorityReceiptDigest: calculateAuthorityReceiptDigest(receipt),
    });
  });

  it("validates parent acceptance fields exactly", () => {
    const receipt = currentBaselineReceipt();
    expect(validateParentAcceptanceReceipt({
      receipt: receipt.parentAcceptance,
      expected: {
        scenarioId: receipt.scenarioId,
        behaviorContractDigest: receipt.behaviorContractDigest,
        authorityReceiptDigest: calculateAuthorityReceiptDigest(receipt),
        runDigest: receipt.calibrationRunDigest,
        calibrationFingerprintDigest: calculateCalibrationFreshnessFingerprint(FRESHNESS_INPUTS).digest,
        claimedRequirementManifestDigest: receipt.parentAcceptance.claimedRequirementManifestDigest,
      },
    })).toEqual(receipt.parentAcceptance);
  });
});

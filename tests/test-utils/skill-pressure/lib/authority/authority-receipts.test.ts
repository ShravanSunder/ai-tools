import { describe, expect, it } from "vitest";

import {
  calculateAuthorityReceiptDigest,
  calculateCalibrationFreshnessFingerprint,
  evaluateCalibrationFreshness,
  evaluateReleaseAuthority,
  validateDemotionReceipt,
  validateParentAcceptanceReceipt,
  validatePromotionReceipt,
  type CalibrationFreshnessInputs,
  type AuthorityDigest,
  type ParentAcceptanceReceipt,
  type PromotionReceipt,
} from "./authority-receipts.js";

const DIGEST = (character: string): AuthorityDigest => `sha256:${character.repeat(64)}`;

const FRESHNESS_INPUTS: CalibrationFreshnessInputs = {
  behaviorContractDigest: DIGEST("a"),
  baselinePolicyDigest: DIGEST("b"),
  runnerSemanticsDigest: DIGEST("c"),
  subjectProfileDigest: DIGEST("d"),
  reviewProfileDigest: DIGEST("e"),
};

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
    calibrationFingerprintDigest: props.calibrationFingerprintDigest ?? calculateCalibrationFreshnessFingerprint(FRESHNESS_INPUTS).digest,
    claimedRequirementManifestDigest: props.claimedRequirementManifestDigest ?? DIGEST("1"),
  };
}

function promotionReceipt(props: {
  readonly treatmentSourceDigest?: AuthorityDigest;
  readonly freshnessInputs?: CalibrationFreshnessInputs;
  readonly parentAcceptanceOverride?: ParentAcceptanceReceipt;
} = {}): PromotionReceipt {
  const freshnessInputs = props.freshnessInputs ?? FRESHNESS_INPUTS;
  const unsignedReceipt = {
    schemaVersion: 1 as const,
    receiptKind: "promotion" as const,
    scenarioId: "authority-fixture",
    behaviorContractDigest: freshnessInputs.behaviorContractDigest,
    calibrationFingerprint: freshnessInputs,
    calibrationRunDigest: DIGEST("f"),
    promotionTreatmentDigest: props.treatmentSourceDigest ?? DIGEST("9"),
    calibration: {
      contractConsistent: true as const,
      contractConsistencyEvidenceDigest: DIGEST("c"),
      baselinePolicyValid: true as const,
      baselinePolicyEvidenceDigest: DIGEST("d"),
      baselineRepetitionDigests: [DIGEST("0"), DIGEST("1"), DIGEST("2"), DIGEST("3"), DIGEST("4")],
      treatmentRepetitionDigests: [DIGEST("5"), DIGEST("6"), DIGEST("7"), DIGEST("8"), DIGEST("9")],
      comparisonIntentPassed: true as const,
      objectiveEvidenceDigest: DIGEST("a"),
      semanticEvidenceDigest: DIGEST("b"),
      attemptReceiptDigests: Array.from({ length: 10 }, (_, index) => DIGEST(String(index))),
      cleanupReceiptDigests: Array.from({ length: 10 }, (_, index) => DIGEST(String(index))),
      deterministicMutationCoverage: true as const,
      subjectProfileVerified: true as const,
      reviewProfileVerified: true as const,
    },
  };
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(unsignedReceipt);
  return {
    ...unsignedReceipt,
    parentAcceptance: props.parentAcceptanceOverride ?? parentAcceptance({
      authorityReceiptDigest,
      runDigest: unsignedReceipt.calibrationRunDigest,
      calibrationFingerprintDigest: calculateCalibrationFreshnessFingerprint(freshnessInputs).digest,
    }),
  };
}

describe("authority receipts", () => {
  it("accepts a complete parent-accepted promotion receipt", () => {
    const receipt = promotionReceipt();

    expect(validatePromotionReceipt({
      receipt,
      currentFreshnessInputs: FRESHNESS_INPUTS,
    })).toMatchObject({
      authorityReceiptDigest: calculateAuthorityReceiptDigest(receipt),
      freshness: { status: "fresh" },
    });
  });

  it("keeps a calibration fresh when only the later treatment source changes", () => {
    const calibration = validatePromotionReceipt({
      receipt: promotionReceipt({ treatmentSourceDigest: DIGEST("9") }),
      currentFreshnessInputs: FRESHNESS_INPUTS,
    });

    expect(evaluateCalibrationFreshness({
      recordedFingerprintDigest: calibration.calibrationFingerprint.digest,
      currentFreshnessInputs: FRESHNESS_INPUTS,
    })).toMatchObject({ status: "fresh" });
    expect(promotionReceipt({ treatmentSourceDigest: DIGEST("8") }).promotionTreatmentDigest).not.toBe(
      promotionReceipt({ treatmentSourceDigest: DIGEST("9") }).promotionTreatmentDigest,
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

  it("rejects partial or digest-mismatched parent acceptance", () => {
    const receipt = promotionReceipt();
    expect(() => validatePromotionReceipt({
      receipt: { ...receipt, parentAcceptance: { ...receipt.parentAcceptance, acceptedAuthorityReceiptDigest: DIGEST("f") } },
      currentFreshnessInputs: FRESHNESS_INPUTS,
    })).toThrow(/parent acceptance.*authority receipt digest/u);

    const { claimedRequirementManifestDigest: _removed, ...partialAcceptance } = receipt.parentAcceptance;
    expect(() => validatePromotionReceipt({
      receipt: { ...receipt, parentAcceptance: partialAcceptance },
      currentFreshnessInputs: FRESHNESS_INPUTS,
    })).toThrow(/parent acceptance.*claimed requirement/u);
  });

  it("requires a separate parent acceptance bound to the exact gate outcome before release authority", () => {
    const promotion = validatePromotionReceipt({
      receipt: promotionReceipt(),
      currentFreshnessInputs: FRESHNESS_INPUTS,
    });
    const runDigest = DIGEST("f");
    const acceptance = parentAcceptance({ authorityReceiptDigest: promotion.authorityReceiptDigest, runDigest });

    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: promotion,
      outcome: "pass",
      runDigest,
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: true, reasonCode: null });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: promotion,
      outcome: "pass",
      runDigest,
      parentAcceptance: null,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "missing_parent_acceptance" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: promotion,
      outcome: "pass",
      runDigest: DIGEST("0"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "parent_acceptance_mismatch" });
  });

  it("does not let diagnostic, stale, or untraced results carry release authority", () => {
    const promotion = validatePromotionReceipt({
      receipt: promotionReceipt(),
      currentFreshnessInputs: FRESHNESS_INPUTS,
    });
    const acceptance = parentAcceptance({ authorityReceiptDigest: promotion.authorityReceiptDigest });

    expect(evaluateReleaseAuthority({
      evaluationRole: "diagnostic",
      calibration: promotion,
      outcome: "pass",
      runDigest: DIGEST("f"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "diagnostic_result" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: { ...promotion, freshness: { status: "stale", reasonCode: "stale_calibration" } },
      outcome: "pass",
      runDigest: DIGEST("f"),
      parentAcceptance: acceptance,
      claimedRequirementStatus: "traced",
      claimedRequirementManifestDigest: DIGEST("1"),
    })).toMatchObject({ releaseAuthority: false, reasonCode: "stale_calibration" });
    expect(evaluateReleaseAuthority({
      evaluationRole: "gate",
      calibration: promotion,
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

    const immutableRunSnapshot = Object.freeze({ outcome: "pass", evaluationRole: "gate" });
    expect(() => validateDemotionReceipt({ receipt, currentRunDigest: DIGEST("f") })).toThrow(/same run/u);
    expect(immutableRunSnapshot).toEqual({ outcome: "pass", evaluationRole: "gate" });
    for (const reason of ["treatment_behavior_failed", "mixed_treatment"]) {
      expect(() => validateDemotionReceipt({
        receipt: { ...receipt, evidence: { ...receipt.evidence, reason } },
      })).toThrow(/does not justify demotion/u);
    }
    expect(validateDemotionReceipt({ receipt })).toMatchObject({ authorityReceiptDigest: calculateAuthorityReceiptDigest(receipt) });
  });

  it("validates parent acceptance independently for a digest-bound run", () => {
    const acceptance = parentAcceptance({ authorityReceiptDigest: DIGEST("a"), runDigest: DIGEST("b") });
    expect(validateParentAcceptanceReceipt({
      receipt: acceptance,
      expected: {
        scenarioId: "authority-fixture",
        behaviorContractDigest: FRESHNESS_INPUTS.behaviorContractDigest,
        authorityReceiptDigest: DIGEST("a"),
        runDigest: DIGEST("b"),
        calibrationFingerprintDigest: calculateCalibrationFreshnessFingerprint(FRESHNESS_INPUTS).digest,
        claimedRequirementManifestDigest: DIGEST("1"),
      },
    })).toEqual(acceptance);
  });
});

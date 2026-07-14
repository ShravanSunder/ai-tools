import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import {
  type AuthorityDigest,
  type ValidatedPromotionReceipt,
} from "../authority/authority-receipts.js";
import type { ClaimedRequirementValidation } from "../authority/claimed-requirements.js";
import { createClaimedRequirementValidationFixture, createValidatedPromotionFixture } from "../test-fixtures.js";
import { resolveV3ScenarioAuthority } from "./v3-scenario-authority.js";

const DIGEST = (character: string): AuthorityDigest => `sha256:${character.repeat(64)}`;

function calibration(freshness: "fresh" | "stale"): ValidatedPromotionReceipt {
  return createValidatedPromotionFixture({
    scenarioId: "authority-scenario",
    behaviorContractDigest: DIGEST("a"),
    freshness,
  });
}

function claimedRequirements(status: "traced" | "not_evaluated" = "traced"): ClaimedRequirementValidation {
  return createClaimedRequirementValidationFixture({
    claimedRequirementIds: ["requirement-one"],
    calibratedGateRequirementIds: status === "traced" ? ["requirement-one"] : [],
  });
}

const CANDIDATE = {
  scenarioId: "authority-scenario",
  behaviorContractDigest: DIGEST("a"),
  behaviorRequirementIds: ["requirement-one"],
  evaluationRole: "gate" as const,
  outcome: "pass" as const,
  comparisonIntent: "non_regression" as const,
  evidenceDigest: DIGEST("8"),
};

describe("v3 scenario authority", () => {
  it("grants release authority only after parent acceptance binds the exact candidate run", async () => {
    const promotion = calibration("fresh");
    const claims = claimedRequirements();
    const resolveParentAcceptance = vi.fn(async ({ runDigest }: { readonly runDigest: AuthorityDigest }) => {
      const receipt = {
        schemaVersion: 1 as const,
        receiptKind: "parent_acceptance" as const,
        scenarioId: CANDIDATE.scenarioId,
        behaviorContractDigest: CANDIDATE.behaviorContractDigest,
        acceptedAuthorityReceiptDigest: promotion.authorityReceiptDigest,
        acceptedRunDigest: runDigest,
        calibrationFingerprintDigest: promotion.calibrationFingerprint.digest,
        claimedRequirementManifestDigest: claims.manifestDigest,
      };
      const source = JSON.stringify(receipt);
      return {
        receipt,
        sourceReceipt: {
          receiptPath: "tests/test-utils/skill-pressure/config/authority-receipts/acceptance.json",
          receiptDigest: `sha256:${createHash("sha256").update(source).digest("hex")}` as AuthorityDigest,
        },
        source,
      };
    });

    const result = await resolveV3ScenarioAuthority({
      candidate: CANDIDATE,
      calibration: promotion,
      claimedRequirements: claims,
      resolveParentAcceptance,
    });

    expect(resolveParentAcceptance).toHaveBeenCalledOnce();
    expect(result.runDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(result.releaseAuthority).toBe(true);
    expect(result.reasonCode).toBeNull();
    expect(result.parentAcceptanceReceiptDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(result.parentAcceptanceSourceReceipt?.receiptDigest).toMatch(/^sha256:/u);
  });

  it("withholds authority when parent acceptance is absent", async () => {
    const result = await resolveV3ScenarioAuthority({
      candidate: CANDIDATE,
      calibration: calibration("fresh"),
      claimedRequirements: claimedRequirements(),
      resolveParentAcceptance: async () => null,
    });

    expect(result).toMatchObject({ releaseAuthority: false, reasonCode: "missing_parent_acceptance" });
  });

  it("withholds authority before requesting acceptance when calibration is stale", async () => {
    const resolveParentAcceptance = vi.fn(async () => null);
    const result = await resolveV3ScenarioAuthority({
      candidate: CANDIDATE,
      calibration: calibration("stale"),
      claimedRequirements: claimedRequirements(),
      resolveParentAcceptance,
    });

    expect(resolveParentAcceptance).not.toHaveBeenCalled();
    expect(result).toMatchObject({ releaseAuthority: false, reasonCode: "stale_calibration" });
  });

  it("preserves a diagnostic pass as evidence without requesting release acceptance", async () => {
    const resolveParentAcceptance = vi.fn(async () => null);
    const result = await resolveV3ScenarioAuthority({
      candidate: { ...CANDIDATE, evaluationRole: "diagnostic" },
      calibration: null,
      claimedRequirements: claimedRequirements("not_evaluated"),
      resolveParentAcceptance,
    });

    expect(resolveParentAcceptance).not.toHaveBeenCalled();
    expect(result).toMatchObject({ releaseAuthority: false, reasonCode: "diagnostic_result" });
  });
});

import { describe, expect, it } from "vitest";

import {
  calculateClaimedRequirementManifestDigest,
  validateClaimedRequirementManifest,
} from "./claimed-requirements.js";

describe("claimed behavior requirements", () => {
  const manifest = {
    schemaVersion: 1 as const,
    source: "proof_matrix" as const,
    claimedRequirementIds: ["behavior-a", "behavior-b"],
  };

  it("binds the canonical claimed-id manifest to a digest", () => {
    expect(calculateClaimedRequirementManifestDigest(manifest)).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(calculateClaimedRequirementManifestDigest({ ...manifest, claimedRequirementIds: ["behavior-b", "behavior-a"] }))
      .not.toBe(calculateClaimedRequirementManifestDigest(manifest));
  });

  it("reports unknown and untraced claimed IDs as not evaluated", () => {
    expect(validateClaimedRequirementManifest({
      manifest,
      knownRequirementIds: ["behavior-a", "behavior-c"],
      calibratedGateRequirementIds: ["behavior-a"],
    })).toMatchObject({
      status: "not_evaluated",
      unknownRequirementIds: ["behavior-b"],
      untracedRequirementIds: ["behavior-b"],
    });
  });

  it("rejects duplicates and produces a traced result only when every claimed ID has a calibrated gate", () => {
    expect(() => validateClaimedRequirementManifest({
      manifest: { ...manifest, claimedRequirementIds: ["behavior-a", "behavior-a"] },
      knownRequirementIds: ["behavior-a"],
      calibratedGateRequirementIds: ["behavior-a"],
    })).toThrow(/duplicate/i);
    expect(validateClaimedRequirementManifest({
      manifest,
      knownRequirementIds: ["behavior-a", "behavior-b"],
      calibratedGateRequirementIds: ["behavior-b", "behavior-a"],
    })).toMatchObject({
      status: "traced",
      unknownRequirementIds: [],
      untracedRequirementIds: [],
    });
  });
});

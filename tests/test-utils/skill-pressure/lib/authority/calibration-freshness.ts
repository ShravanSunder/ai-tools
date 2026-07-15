import { createHash } from "node:crypto";

import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import { calculateRunnerSemantics } from "../runtime/runner-semantics.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_HIGH_SUBJECT_PROFILE,
  type RuntimeProfile,
} from "../runtime/runtime-profile.js";
import type { AuthorityDigest, CalibrationFreshnessInputs } from "./authority-receipts.js";

export async function calculateCurrentCalibrationFreshnessInputs(props: {
  readonly repositoryRoot: string;
  readonly contract: V3BehaviorContract;
}): Promise<CalibrationFreshnessInputs> {
  const runnerSemantics = await calculateRunnerSemantics({ repositoryRoot: props.repositoryRoot });
  return {
    behaviorContractDigest: asAuthorityDigest(props.contract.behaviorContractDigest),
    baselinePolicyDigest: calculateBaselinePolicyDigest(props.contract),
    runnerSemanticsDigest: asAuthorityDigest(runnerSemantics.runnerSemanticsDigest),
    subjectProfileDigest: calculateRuntimeProfileDigest(ACPX_LUNA_HIGH_SUBJECT_PROFILE),
    reviewProfileDigest: calculateRuntimeProfileDigest(
      props.contract.risk === "high"
        ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
        : ACPX_LUNA_HIGH_SUBJECT_PROFILE,
    ),
  };
}

export function calculateBaselinePolicyDigest(
  contract: Pick<V3BehaviorContract, "baseline" | "baselineRevision">,
): AuthorityDigest {
  return digestJson({
    baseline: contract.baseline,
    baselineRevision: contract.baselineRevision,
  });
}

export function calculateRuntimeProfileDigest(profile: RuntimeProfile): AuthorityDigest {
  return digestJson(profile);
}

export function digestJson(value: unknown): AuthorityDigest {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

function asAuthorityDigest(value: string): AuthorityDigest {
  if (!/^sha256:[a-f0-9]{64}$/u.test(value)) {
    throw new Error("calibration freshness input is not a SHA-256 digest");
  }
  return value as AuthorityDigest;
}

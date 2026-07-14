import { describe, expect, it } from "vitest";

import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
  verifyRuntimeProfile,
} from "./runtime-profile.js";

describe("runtime-profile verification", () => {
  it("accepts exact provider-reported Luna/xhigh evidence", () => {
    expect(verifyRuntimeProfile({
      profile: ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
      providerReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
    })).toMatchObject({ verification: { status: "verified", reasonCode: null } });
  });

  it("rejects a friendly alias instead of treating it as provider verification", () => {
    expect(verifyRuntimeProfile({
      profile: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
      providerReported: { model: "opus", reasoningEffort: "xhigh" },
    })).toMatchObject({
      verification: { status: "unverified", reasonCode: "runtime_profile_unverified" },
    });
  });

  it("rejects null, downgraded, and unreported runtime fields", () => {
    for (const providerReported of [
      { model: null, reasoningEffort: null },
      { model: "claude-opus-4-7", reasoningEffort: "high" },
      { model: "claude-opus-4-7", reasoningEffort: null },
    ]) {
      expect(verifyRuntimeProfile({
        profile: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
        providerReported,
      }).verification).toMatchObject({ status: "unverified", reasonCode: "runtime_profile_unverified" });
    }
  });
});

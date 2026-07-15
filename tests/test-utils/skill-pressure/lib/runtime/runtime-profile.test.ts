import { describe, expect, it } from "vitest";

import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_HIGH_SUBJECT_PROFILE,
  verifyRuntimeProfile,
} from "./runtime-profile.js";

describe("runtime-profile verification", () => {
  it("requests the exact provider-advertised Claude Opus model", () => {
    expect(ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE).toMatchObject({
      requestedModel: "claude-opus-4-7",
      acceptedProviderReportedModel: "claude-opus-4-7",
      requestedReasoningEffort: "xhigh",
    });
  });

  it("accepts exact provider-reported Luna/high evidence", () => {
    expect(verifyRuntimeProfile({
      profile: ACPX_LUNA_HIGH_SUBJECT_PROFILE,
      providerReported: { model: "gpt-5.6-luna", reasoningEffort: "high" },
    })).toMatchObject({ verification: { status: "verified", reasonCode: null } });
  });

  it("uses Luna/high for subjects and standard review while preserving Opus/xhigh for high risk", () => {
    expect(ACPX_LUNA_HIGH_SUBJECT_PROFILE).toMatchObject({
      requestedModel: "gpt-5.6-luna",
      requestedReasoningEffort: "high",
      acceptedProviderReportedModel: "gpt-5.6-luna",
      acceptedProviderReportedReasoningEffort: "high",
    });
    expect(ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE).toMatchObject({
      requestedModel: "claude-opus-4-7",
      requestedReasoningEffort: "xhigh",
    });
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

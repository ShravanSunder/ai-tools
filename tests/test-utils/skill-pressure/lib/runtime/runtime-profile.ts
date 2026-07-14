export type RuntimeProvider = "claude" | "codex";

export interface RuntimeProfile {
  readonly provider: RuntimeProvider;
  readonly requestedModel: string;
  readonly requestedReasoningEffort: string;
  readonly acceptedProviderReportedModel: string;
  readonly acceptedProviderReportedReasoningEffort: string;
}

export interface RuntimeProfileReceipt {
  readonly requested: {
    readonly provider: RuntimeProvider;
    readonly model: string;
    readonly reasoningEffort: string;
  };
  readonly acceptedProviderReported: {
    readonly model: string;
    readonly reasoningEffort: string;
  };
  readonly providerReported: {
    readonly model: string | null;
    readonly reasoningEffort: string | null;
  };
  readonly verification: {
    readonly status: "verified" | "unverified";
    readonly reasonCode: "runtime_profile_unverified" | null;
    readonly reasons: readonly string[];
  };
}

export const ACPX_LUNA_XHIGH_SUBJECT_PROFILE = {
  provider: "codex",
  requestedModel: "gpt-5.6-luna",
  requestedReasoningEffort: "xhigh",
  acceptedProviderReportedModel: "gpt-5.6-luna",
  acceptedProviderReportedReasoningEffort: "xhigh",
} as const satisfies RuntimeProfile;

export const ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE = {
  provider: "claude",
  requestedModel: "claude-opus-4-1",
  requestedReasoningEffort: "xhigh",
  acceptedProviderReportedModel: "claude-opus-4-1",
  acceptedProviderReportedReasoningEffort: "xhigh",
} as const satisfies RuntimeProfile;

export function createAcpxCodexRuntimeProfile(props: {
  readonly model: string;
  readonly reasoningEffort: string;
}): RuntimeProfile {
  return {
    provider: "codex",
    requestedModel: props.model,
    requestedReasoningEffort: props.reasoningEffort,
    acceptedProviderReportedModel: props.model,
    acceptedProviderReportedReasoningEffort: props.reasoningEffort,
  };
}

export function verifyRuntimeProfile(props: {
  readonly profile: RuntimeProfile;
  readonly providerReported: { readonly model: string | null; readonly reasoningEffort: string | null };
}): RuntimeProfileReceipt {
  const reasons: string[] = [];
  if (props.providerReported.model === null) {
    reasons.push("provider-reported model is missing");
  } else if (props.providerReported.model !== props.profile.acceptedProviderReportedModel) {
    reasons.push("provider-reported model does not match the accepted profile");
  }
  if (props.providerReported.reasoningEffort === null) {
    reasons.push("provider-reported reasoning effort is missing");
  } else if (props.providerReported.reasoningEffort !== props.profile.acceptedProviderReportedReasoningEffort) {
    reasons.push("provider-reported reasoning effort does not match the accepted profile");
  }
  return {
    requested: {
      provider: props.profile.provider,
      model: props.profile.requestedModel,
      reasoningEffort: props.profile.requestedReasoningEffort,
    },
    acceptedProviderReported: {
      model: props.profile.acceptedProviderReportedModel,
      reasoningEffort: props.profile.acceptedProviderReportedReasoningEffort,
    },
    providerReported: { ...props.providerReported },
    verification: reasons.length === 0
      ? { status: "verified", reasonCode: null, reasons: [] }
      : {
          status: "unverified",
          reasonCode: "runtime_profile_unverified",
          reasons: [...new Set(reasons)].sort((left, right) => left.localeCompare(right)),
        },
  };
}

import { createHash, randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { collectAcpxTranscript, type AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { ScenarioRisk } from "../contracts/contract-types.js";
import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import type { AcpxLauncher, AcpxProcessExecution, ExecutableAcpxCommand } from "../runtime/acpx-command-executor.js";
import { executeAcpxCommand } from "../runtime/acpx-command-executor.js";
import { buildAcpxClaudeReviewSessionCommands } from "../runtime/acpx-review-profile.js";
import { buildAcpxCodexReviewCommand } from "../runtime/acpx-codex-review-profile.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
  verifyRuntimeProfile,
  type RuntimeProfile,
  type RuntimeProfileReceipt,
} from "../runtime/runtime-profile.js";
import { parseAcpxStructuredReview, parseReviewCandidateResult } from "./acpx-review-result.js";
import {
  buildBlindReviewPacket,
  assertReviewCandidateCoverage,
  createReviewReceipt,
  type BlindReviewPacket,
  type BlindReviewerIdentity,
  type ReviewDeterministicFact,
  type ReviewReceipt,
  type ReviewRuntimeFingerprint,
  type ReviewSourceFingerprint,
} from "./review-packet.js";

const RUNNER_VERSION = "skill-pressure-blind-review-v1";

export interface ExecuteBlindReviewProps {
  readonly reviewRoot: string;
  readonly scenario: { readonly scenarioId: string; readonly hiddenRubric: string; readonly risk: ScenarioRisk };
  readonly deterministicFacts: readonly ReviewDeterministicFact[];
  readonly baselineEvidence: readonly NormalizedRepetitionEvidence[];
  readonly treatmentEvidence: readonly NormalizedRepetitionEvidence[];
  readonly sourceFingerprint: ReviewSourceFingerprint;
  readonly runtimeFingerprint: ReviewRuntimeFingerprint;
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly timeoutSeconds: number;
  readonly subjectSessionIds: readonly string[];
  readonly redactionSecrets: readonly string[];
  readonly execute?: (command: ExecutableAcpxCommand) => Promise<AcpxProcessExecution>;
}

export interface AutomatedBlindReviewReceipt {
  readonly runnerVersion: typeof RUNNER_VERSION;
  readonly route: "blind";
  readonly risk: ScenarioRisk;
  readonly outcome: ScenarioOutcome;
  readonly reviewReceipt: ReviewReceipt | null;
  readonly packet: {
    readonly digest: string;
    readonly rubricDigest: string;
    readonly evidenceDigest: string;
  };
  readonly command: {
    readonly runtime: "acpx";
    readonly provider: "codex" | "claude";
    readonly model: string;
    readonly reasoningEffort: string;
    readonly commandDigest: string;
    readonly oneFreshExecution: true;
    readonly mcpConfiguration: "empty";
  };
  readonly runtime: {
    readonly launcherDigest: string;
    readonly sessionId: string | null;
    readonly profile: RuntimeProfileReceipt;
    readonly transcriptDigest: string;
    readonly usageDigest: string | null;
    readonly sessionLifecycle: ReviewSessionLifecycleReceipt;
  };
  readonly execution: {
    readonly exitCode: number | null;
    readonly timedOut: boolean;
    readonly cleanupComplete: boolean;
    readonly supervisorOutcome: string | null;
  };
  readonly cleanup: {
    readonly reviewCwdRemoved: boolean;
    readonly cleanupError: string | null;
  };
  readonly infrastructureReasons: readonly string[];
  readonly parseError: string | null;
}

export interface ReviewSessionLifecycleReceipt {
  readonly mode: "one_shot" | "named_session";
  readonly sessionName: string | null;
  readonly create: "not_applicable" | "completed" | "failed";
  readonly setEffort: "not_applicable" | "completed" | "failed";
  readonly prompt: "completed" | "failed";
  readonly close: "not_applicable" | "completed" | "failed";
}

export async function executeAutomatedBlindReview(
  props: ExecuteBlindReviewProps,
): Promise<AutomatedBlindReviewReceipt> {
  validateProps(props);
  const packet = buildBlindReviewPacket({
    scenario: { scenarioId: props.scenario.scenarioId },
    hiddenRubric: props.scenario.hiddenRubric,
    deterministicFacts: props.deterministicFacts,
    baselineEvidence: props.baselineEvidence,
    treatmentEvidence: props.treatmentEvidence,
    sourceFingerprint: props.sourceFingerprint,
    runtimeFingerprint: props.runtimeFingerprint,
  });
  const reviewCwd = path.join(path.resolve(props.reviewRoot), `blind-${randomUUID()}`);
  const packetPath = path.join(reviewCwd, "review-packet.json");
  const mcpConfigPath = path.join(reviewCwd, "mcp.json");
  const commands = buildReviewCommands({
    risk: props.scenario.risk,
    launcher: props.launcher,
    codexExecutable: props.codexExecutable,
    cwd: reviewCwd,
    mcpConfigPath,
    packetPath,
    packetDigest: packet.packetDigest,
    timeoutSeconds: props.timeoutSeconds,
  });

  let cleanup: AutomatedBlindReviewReceipt["cleanup"] = { reviewCwdRemoved: false, cleanupError: null };
  let draft: AutomatedBlindReviewReceipt;
  try {
    await mkdir(reviewCwd, { recursive: true });
    await writeFile(packetPath, `${JSON.stringify(createReviewPrompt(packet))}\n`, { flag: "wx" });
    await writeFile(mcpConfigPath, '{"mcpServers":[]}\n', { flag: "wx" });
    const relationship = await executeReviewRelationship({
      risk: props.scenario.risk,
      commands,
      execute: props.execute ?? executeAcpxCommand,
    });
    draft = buildReceipt({
      props,
      packet,
      command: commands.prompt,
      execution: relationship.execution,
      sessionLifecycle: relationship.lifecycle,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "blind reviewer execution failed";
    draft = failureReceipt({
      risk: props.scenario.risk,
      packet,
      command: commands.prompt,
      reason: `blind reviewer execution failed: ${message}`,
      cleanup,
    });
  } finally {
    try {
      await rm(reviewCwd, { recursive: true, force: true });
      cleanup = { reviewCwdRemoved: true, cleanupError: null };
    } catch (error) {
      cleanup = {
        reviewCwdRemoved: false,
        cleanupError: error instanceof Error ? error.message : "review workspace cleanup failed",
      };
    }
  }
  if (!cleanup.reviewCwdRemoved) {
    return {
      ...draft,
      outcome: "infrastructure_error",
      reviewReceipt: null,
      cleanup,
      infrastructureReasons: [
        ...draft.infrastructureReasons,
        `review workspace cleanup failed: ${cleanup.cleanupError ?? "unknown cleanup error"}`,
      ],
    };
  }
  return { ...draft, cleanup };
}

function buildReceipt(props: {
  readonly props: ExecuteBlindReviewProps;
  readonly packet: BlindReviewPacket;
  readonly command: ExecutableAcpxCommand;
  readonly execution: AcpxProcessExecution;
  readonly sessionLifecycle: ReviewSessionLifecycleReceipt;
}): AutomatedBlindReviewReceipt {
  const transcript = collectAcpxTranscript(props.execution.stdout, { secrets: props.props.redactionSecrets });
  const runtimeProfile = verifyRuntimeProfile({
    profile: reviewRuntimeProfile(props.props.scenario.risk),
    providerReported: {
      model: transcript.resolvedModel,
      reasoningEffort: transcript.reasoningEffort,
    },
  });
  const reasons = collectInfrastructureReasons({
    props: props.props,
    execution: props.execution,
    transcript,
    sessionLifecycle: props.sessionLifecycle,
    runtimeProfile,
  });
  const structured = parseAcpxStructuredReview(transcript);
  const candidate = parseReviewCandidateResult(structured.structuredOutput);
  const activeReviewer = reviewerIdentity(
    props.props.scenario.risk,
    transcript.sessionId ?? "missing-session",
    runtimeProfile,
  );
  const base = receiptBase({
    risk: props.props.scenario.risk,
    packet: props.packet,
    command: props.command,
    execution: props.execution,
    transcript,
    sessionLifecycle: props.sessionLifecycle,
    cleanup: { reviewCwdRemoved: false, cleanupError: null },
  });
  if (reasons.length > 0) {
    return { ...base, outcome: "infrastructure_error", reviewReceipt: null, infrastructureReasons: reasons, parseError: structured.parseError ?? candidate.parseError };
  }
  if (structured.parseError !== null || candidate.parseError !== null || candidate.result === null) {
    return {
      ...base,
      outcome: "not_evaluated",
      reviewReceipt: null,
      infrastructureReasons: [],
      parseError: structured.parseError ?? candidate.parseError,
    };
  }
  try {
    assertReviewCandidateCoverage({
      candidate: candidate.result,
      baselineEvidence: props.props.baselineEvidence,
      treatmentEvidence: props.props.treatmentEvidence,
    });
  } catch (error) {
    return {
      ...base,
      outcome: "not_evaluated",
      reviewReceipt: null,
      infrastructureReasons: [],
      parseError: error instanceof Error ? error.message : "review repetition coverage is invalid",
    };
  }
  return {
    ...base,
    outcome: "pass",
    reviewReceipt: createReviewReceipt({
      risk: props.props.scenario.risk,
      route: { kind: "blind", freshContext: true, reviewer: activeReviewer },
      rubric: props.props.scenario.hiddenRubric,
      result: candidate.result,
    }),
    infrastructureReasons: [],
    parseError: null,
  };
}

function failureReceipt(props: {
  readonly risk: ScenarioRisk;
  readonly packet: BlindReviewPacket;
  readonly command: ExecutableAcpxCommand;
  readonly reason: string;
  readonly cleanup: { readonly reviewCwdRemoved: boolean; readonly cleanupError: string | null };
}): AutomatedBlindReviewReceipt {
  return {
    ...receiptBase({
      risk: props.risk,
      packet: props.packet,
      command: props.command,
      execution: null,
      transcript: null,
      sessionLifecycle: {
        mode: props.risk === "high" ? "named_session" : "one_shot",
        sessionName: null,
        create: props.risk === "high" ? "failed" : "not_applicable",
        setEffort: props.risk === "high" ? "failed" : "not_applicable",
        prompt: "failed",
        close: props.risk === "high" ? "failed" : "not_applicable",
      },
      cleanup: props.cleanup,
    }),
    outcome: "infrastructure_error",
    reviewReceipt: null,
    infrastructureReasons: [props.reason],
    parseError: null,
  };
}

function receiptBase(props: {
  readonly risk: ScenarioRisk;
  readonly packet: BlindReviewPacket;
  readonly command: ExecutableAcpxCommand;
  readonly execution: AcpxProcessExecution | null;
  readonly transcript: AcpxTranscriptFacts | null;
  readonly cleanup: { readonly reviewCwdRemoved: boolean; readonly cleanupError: string | null };
  readonly sessionLifecycle: ReviewSessionLifecycleReceipt;
}): Omit<AutomatedBlindReviewReceipt, "outcome" | "reviewReceipt" | "infrastructureReasons" | "parseError"> {
  const reviewer = reviewCommandIdentity(props.risk);
  const runtimeProfile = verifyRuntimeProfile({
    profile: reviewRuntimeProfile(props.risk),
    providerReported: {
      model: props.transcript?.resolvedModel ?? null,
      reasoningEffort: props.transcript?.reasoningEffort ?? null,
    },
  });
  return {
    runnerVersion: RUNNER_VERSION,
    route: "blind",
    risk: props.risk,
    packet: {
      digest: props.packet.packetDigest,
      rubricDigest: digest(props.packet.hiddenRubric),
      evidenceDigest: digest(JSON.stringify({
        deterministicFacts: props.packet.deterministicFacts,
        baselineEvidence: props.packet.baselineEvidence,
        treatmentEvidence: props.packet.treatmentEvidence,
      })),
    },
    command: {
      runtime: "acpx",
      ...reviewer,
      commandDigest: digest(JSON.stringify({
        executable: props.command.executable,
        args: props.command.args,
        environment: props.command.environment,
      })),
      oneFreshExecution: true,
      mcpConfiguration: "empty",
    },
    runtime: {
      launcherDigest: digest(JSON.stringify({ executable: props.command.executable })),
      sessionId: props.transcript?.sessionId ?? null,
      profile: runtimeProfile,
      transcriptDigest: digest(props.execution?.stdout ?? ""),
      usageDigest: props.transcript === null || !hasMeaningfulUsage(props.transcript.usageObservations)
        ? null
        : digest(JSON.stringify(props.transcript.usageObservations)),
      sessionLifecycle: props.sessionLifecycle,
    },
    execution: {
      exitCode: props.execution?.exitCode ?? null,
      timedOut: props.execution?.timedOut ?? false,
      cleanupComplete: props.execution?.cleanupComplete ?? false,
      supervisorOutcome: props.execution?.supervisorReceipt.outcome ?? null,
    },
    cleanup: props.cleanup,
  };
}

function buildReviewCommands(props: {
  readonly risk: ScenarioRisk;
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly cwd: string;
  readonly mcpConfigPath: string;
  readonly packetPath: string;
  readonly packetDigest: string;
  readonly timeoutSeconds: number;
}): {
  readonly prompt: ExecutableAcpxCommand;
  readonly create?: ExecutableAcpxCommand;
  readonly setEffort?: ExecutableAcpxCommand;
  readonly close?: ExecutableAcpxCommand;
  readonly sessionName?: string;
} {
  if (props.risk === "high") {
    const sessionName = `pressure-review-${randomUUID()}`;
    const commands = buildAcpxClaudeReviewSessionCommands({
      launcher: props.launcher,
      cwd: props.cwd,
      mcpConfigPath: props.mcpConfigPath,
      packetPath: props.packetPath,
      packetDigest: props.packetDigest,
      model: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedModel,
      reasoningEffort: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedReasoningEffort,
      timeoutSeconds: props.timeoutSeconds,
    }, sessionName);
    return { ...commands, sessionName };
  }
  return { prompt: buildAcpxCodexReviewCommand({
    launcher: props.launcher,
    codexExecutable: path.resolve(props.codexExecutable),
    cwd: props.cwd,
    mcpConfigPath: props.mcpConfigPath,
    packetPath: props.packetPath,
    packetDigest: props.packetDigest,
    model: ACPX_LUNA_XHIGH_SUBJECT_PROFILE.requestedModel,
    reasoningEffort: ACPX_LUNA_XHIGH_SUBJECT_PROFILE.requestedReasoningEffort,
    timeoutSeconds: props.timeoutSeconds,
  }) };
}

async function executeReviewRelationship(props: {
  readonly risk: ScenarioRisk;
  readonly commands: ReturnType<typeof buildReviewCommands>;
  readonly execute: (command: ExecutableAcpxCommand) => Promise<AcpxProcessExecution>;
}): Promise<{ readonly execution: AcpxProcessExecution; readonly lifecycle: ReviewSessionLifecycleReceipt }> {
  if (props.risk === "standard") {
    const execution = await props.execute(props.commands.prompt);
    return {
      execution,
      lifecycle: {
        mode: "one_shot",
        sessionName: null,
        create: "not_applicable",
        setEffort: "not_applicable",
        prompt: successfulLifecycleExecution(execution) ? "completed" : "failed",
        close: "not_applicable",
      },
    };
  }
  const create = requiredCommand(props.commands.create, "create");
  const setEffort = requiredCommand(props.commands.setEffort, "set effort");
  const close = requiredCommand(props.commands.close, "close");
  const sessionName = props.commands.sessionName ?? null;
  let createStatus: ReviewSessionLifecycleReceipt["create"] = "failed";
  let effortStatus: ReviewSessionLifecycleReceipt["setEffort"] = "failed";
  let promptStatus: ReviewSessionLifecycleReceipt["prompt"] = "failed";
  let closeStatus: ReviewSessionLifecycleReceipt["close"] = "failed";
  let promptExecution: AcpxProcessExecution | null = null;
  try {
    createStatus = successfulLifecycleExecution(await props.execute(create)) ? "completed" : "failed";
    if (createStatus !== "completed") throw new Error("ACPX Claude review session creation failed");
    effortStatus = successfulLifecycleExecution(await props.execute(setEffort)) ? "completed" : "failed";
    if (effortStatus !== "completed") throw new Error("ACPX Claude review effort configuration failed");
    promptExecution = await props.execute(props.commands.prompt);
    promptStatus = successfulLifecycleExecution(promptExecution) ? "completed" : "failed";
  } finally {
    closeStatus = successfulLifecycleExecution(await props.execute(close)) ? "completed" : "failed";
  }
  if (promptExecution === null) throw new Error("ACPX Claude review prompt did not execute");
  return {
    execution: promptExecution,
    lifecycle: {
      mode: "named_session",
      sessionName,
      create: createStatus,
      setEffort: effortStatus,
      prompt: promptStatus,
      close: closeStatus,
    },
  };
}

function requiredCommand(command: ExecutableAcpxCommand | undefined, label: string): ExecutableAcpxCommand {
  if (command === undefined) throw new Error(`missing ACPX Claude review ${label} command`);
  return command;
}

function successfulLifecycleExecution(execution: AcpxProcessExecution): boolean {
  return execution.exitCode === 0 && !execution.timedOut && execution.cleanupComplete;
}

function createReviewPrompt(packet: BlindReviewPacket): Readonly<Record<string, unknown>> {
  return {
    task: "Assess every baseline and treatment repetition against the hidden rubric using only this packet. Return one JSON object with repetitions, rationalization, behaviorRisk, smallestWordingChange, and retestTarget. repetitions must contain exactly one row per packet repetition with repetitionId, variant, outcome (pass, behavior_fail, or not_evaluated), and evidenceClass (demonstrated_failure, classified_proof_gap, passing_control, or null). Each rationale field must be a string or null.",
    packet,
  };
}

function collectInfrastructureReasons(props: {
  readonly props: ExecuteBlindReviewProps;
  readonly execution: AcpxProcessExecution;
  readonly transcript: AcpxTranscriptFacts;
  readonly sessionLifecycle: ReviewSessionLifecycleReceipt;
  readonly runtimeProfile: RuntimeProfileReceipt;
}): readonly string[] {
  const expected = reviewCommandIdentity(props.props.scenario.risk);
  const reasons: string[] = [];
  if (props.execution.exitCode !== 0) reasons.push(`ACPX exited ${props.execution.exitCode}`);
  if (props.execution.timedOut) reasons.push("ACPX timed out");
  if (!props.execution.cleanupComplete) reasons.push("process cleanup is incomplete");
  if (props.transcript.parseErrors.length > 0) reasons.push("ACPX transcript is malformed");
  if (props.transcript.transportErrors.length > 0 || props.transcript.diagnosticErrors.length > 0) reasons.push("ACPX transport reported errors");
  if (props.transcript.promptCount !== 1) reasons.push("ACPX execution was not one prompt");
  if (props.transcript.mcpServerCount !== 0) reasons.push("ACPX MCP configuration is not empty");
  if (props.transcript.stopReason !== "end_turn") reasons.push("ACPX turn did not end successfully");
  if (props.runtimeProfile.verification.status !== "verified") {
    reasons.push(`reviewer runtime profile is unverified: ${props.runtimeProfile.verification.reasons.join(", ")}`);
  }
  if (
    props.sessionLifecycle.prompt !== "completed" ||
    props.sessionLifecycle.create === "failed" ||
    props.sessionLifecycle.setEffort === "failed" ||
    props.sessionLifecycle.close === "failed"
  ) reasons.push("ACPX review session lifecycle is incomplete");
  if (props.transcript.sessionId === null) reasons.push("ACPX review session id is missing");
  if (props.transcript.sessionId !== null && props.props.subjectSessionIds.includes(props.transcript.sessionId)) {
    reasons.push("ACPX review session id was reused from a subject repetition");
  }
  if (!hasMeaningfulUsage(props.transcript.usageObservations)) reasons.push("ACPX review usage evidence is missing");
  return reasons;
}

function reviewerIdentity(
  risk: ScenarioRisk,
  sessionId: string,
  runtimeProfile: RuntimeProfileReceipt,
): BlindReviewerIdentity {
  const command = reviewCommandIdentity(risk);
  return {
    reviewerId: `acpx:${sessionId}`,
    provider: command.provider,
    model: runtimeProfile.providerReported.model ?? command.model,
    modelCategory: command.provider === "codex" ? "mini" : "balanced",
    reasoningEffort: runtimeProfile.providerReported.reasoningEffort ?? command.reasoningEffort,
    runtime: "acpx",
  };
}

function reviewCommandIdentity(risk: ScenarioRisk): {
  readonly provider: "codex" | "claude";
  readonly model: string;
  readonly reasoningEffort: string;
} {
  return risk === "high"
    ? {
        provider: "claude",
        model: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedModel,
        reasoningEffort: ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedReasoningEffort,
      }
    : {
        provider: "codex",
        model: ACPX_LUNA_XHIGH_SUBJECT_PROFILE.requestedModel,
        reasoningEffort: ACPX_LUNA_XHIGH_SUBJECT_PROFILE.requestedReasoningEffort,
      };
}

function reviewRuntimeProfile(risk: ScenarioRisk): RuntimeProfile {
  return risk === "high"
    ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
    : ACPX_LUNA_XHIGH_SUBJECT_PROFILE;
}

function hasMeaningfulUsage(observations: readonly string[]): boolean {
  return observations.some((observation) => {
    try {
      const parsed: unknown = JSON.parse(observation);
      return typeof parsed === "object" && parsed !== null &&
        Object.values(parsed).some((value) => typeof value === "number" && Number.isFinite(value));
    } catch {
      return false;
    }
  });
}

function validateProps(props: ExecuteBlindReviewProps): void {
  if (!Number.isInteger(props.timeoutSeconds) || props.timeoutSeconds <= 0) {
    throw new Error("timeoutSeconds must be a positive integer");
  }
  if (props.scenario.hiddenRubric.trim() === "") throw new Error("hidden rubric must be non-empty");
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

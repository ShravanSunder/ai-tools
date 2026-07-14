import { createHash, randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { collectAcpxTranscript, type AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { ScenarioRisk } from "../contracts/contract-types.js";
import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import type { AcpxLauncher, AcpxProcessExecution, ExecutableAcpxCommand } from "../runtime/acpx-command-executor.js";
import { executeAcpxCommand } from "../runtime/acpx-command-executor.js";
import { buildAcpxClaudeReviewCommand } from "../runtime/acpx-review-profile.js";
import { buildAcpxCodexReviewCommand } from "../runtime/acpx-codex-review-profile.js";
import { parseAcpxStructuredReview, parseReviewCandidateResult } from "./acpx-review-result.js";
import {
  buildBlindReviewPacket,
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
    readonly transcriptDigest: string;
    readonly usageDigest: string | null;
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
  const command = buildReviewCommand({
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
    const execution = await (props.execute ?? executeAcpxCommand)(command);
    draft = buildReceipt({ props, packet, command, execution });
  } catch (error) {
    const message = error instanceof Error ? error.message : "blind reviewer execution failed";
    draft = failureReceipt({
      risk: props.scenario.risk,
      packet,
      command,
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
}): AutomatedBlindReviewReceipt {
  const transcript = collectAcpxTranscript(props.execution.stdout, { secrets: props.props.redactionSecrets });
  const reasons = collectInfrastructureReasons({
    props: props.props,
    execution: props.execution,
    transcript,
  });
  const structured = parseAcpxStructuredReview(transcript);
  const candidate = parseReviewCandidateResult(structured.structuredOutput);
  const activeReviewer = reviewerIdentity(props.props.scenario.risk, transcript.sessionId ?? "missing-session");
  const base = receiptBase({
    risk: props.props.scenario.risk,
    packet: props.packet,
    command: props.command,
    execution: props.execution,
    transcript,
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
  return {
    ...base,
    outcome: candidate.result.outcome,
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
}): Omit<AutomatedBlindReviewReceipt, "outcome" | "reviewReceipt" | "infrastructureReasons" | "parseError"> {
  const reviewer = reviewCommandIdentity(props.risk);
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
      transcriptDigest: digest(props.execution?.stdout ?? ""),
      usageDigest: props.transcript === null || !hasMeaningfulUsage(props.transcript.usageObservations)
        ? null
        : digest(JSON.stringify(props.transcript.usageObservations)),
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

function buildReviewCommand(props: {
  readonly risk: ScenarioRisk;
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly cwd: string;
  readonly mcpConfigPath: string;
  readonly packetPath: string;
  readonly packetDigest: string;
  readonly timeoutSeconds: number;
}): ExecutableAcpxCommand {
  if (props.risk === "high") {
    return buildAcpxClaudeReviewCommand({
      launcher: props.launcher,
      cwd: props.cwd,
      mcpConfigPath: props.mcpConfigPath,
      packetPath: props.packetPath,
      packetDigest: props.packetDigest,
      model: "opus",
      reasoningEffort: "high",
      timeoutSeconds: props.timeoutSeconds,
    });
  }
  return buildAcpxCodexReviewCommand({
    launcher: props.launcher,
    codexExecutable: path.resolve(props.codexExecutable),
    cwd: props.cwd,
    mcpConfigPath: props.mcpConfigPath,
    packetPath: props.packetPath,
    packetDigest: props.packetDigest,
    model: "gpt-5.6-luna",
    reasoningEffort: "medium",
    timeoutSeconds: props.timeoutSeconds,
  });
}

function createReviewPrompt(packet: BlindReviewPacket): Readonly<Record<string, unknown>> {
  return {
    task: "Assess the hidden rubric using only this packet. Return one JSON object with outcome, rationalization, behaviorRisk, smallestWordingChange, and retestTarget. Each rationale field must be a string or null.",
    packet,
  };
}

function collectInfrastructureReasons(props: {
  readonly props: ExecuteBlindReviewProps;
  readonly execution: AcpxProcessExecution;
  readonly transcript: AcpxTranscriptFacts;
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
  if (props.transcript.resolvedModel !== expected.model) reasons.push("resolved reviewer model differs from request");
  if (props.transcript.reasoningEffort !== expected.reasoningEffort) reasons.push("resolved reviewer reasoning effort differs from request");
  if (props.transcript.sessionId === null) reasons.push("ACPX review session id is missing");
  if (props.transcript.sessionId !== null && props.props.subjectSessionIds.includes(props.transcript.sessionId)) {
    reasons.push("ACPX review session id was reused from a subject repetition");
  }
  if (!hasMeaningfulUsage(props.transcript.usageObservations)) reasons.push("ACPX review usage evidence is missing");
  return reasons;
}

function reviewerIdentity(risk: ScenarioRisk, sessionId: string): BlindReviewerIdentity {
  const command = reviewCommandIdentity(risk);
  return {
    reviewerId: `acpx:${sessionId}`,
    provider: command.provider,
    model: command.model,
    modelCategory: command.provider === "codex" ? "mini" : "balanced",
    reasoningEffort: command.reasoningEffort,
    runtime: "acpx",
  };
}

function reviewCommandIdentity(risk: ScenarioRisk): {
  readonly provider: "codex" | "claude";
  readonly model: string;
  readonly reasoningEffort: string;
} {
  return risk === "high"
    ? { provider: "claude", model: "opus", reasoningEffort: "high" }
    : { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "medium" };
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

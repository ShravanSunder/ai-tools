import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  type AcpRuntimeEvent,
  createAcpRuntime,
  createAgentRegistry,
  createFileSessionStore,
} from "npm:acpx@0.19.4/runtime";
import type { Scenario } from "../contracts/scenario.ts";
import type { PreparedEnvironment } from "../environment/prepare-environment.ts";
import type { Observation } from "../contracts/observation.ts";
import {
  completedWithoutModelUsage,
  normalizeAssistantMessage,
  type RecordedRuntimeEvent,
} from "../runtime/normalize-acp-events.ts";
import { buildObservedOutcome } from "./observed-outcome.ts";
import { decideSubjectPermission } from "./permission-policy.ts";
import type { RunOutcome } from "../contracts/run.ts";

const numeric = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;
const usageTotals = (
  value: unknown,
): { inputTokens: number; outputTokens: number; totalTokens: number } => {
  if (typeof value !== "object" || value === null) {
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }
  const record = value as Record<string, unknown>;
  const cumulative =
    typeof record.cumulative === "object" && record.cumulative !== null
      ? record.cumulative as Record<string, unknown>
      : record;
  const inputTokens = numeric(cumulative.inputTokens),
    outputTokens = numeric(cumulative.outputTokens);
  return {
    inputTokens,
    outputTokens,
    totalTokens: numeric(cumulative.totalTokens) || inputTokens + outputTokens,
  };
};
// The subject's isolated Codex home links the user's login. Any reference to it marks the Run.
const subjectCredentialReferences = async (
  codexHome: string,
): Promise<readonly string[]> => {
  const resolvedCodexHome = await Deno.realPath(codexHome).catch(() =>
    codexHome
  );
  return [
    ...new Set([codexHome, resolvedCodexHome, "auth.json", "CODEX_HOME"]),
  ];
};
export type SubjectConfig = { runId: string; timeoutMs?: number };
export async function runSubject(
  scenario: Scenario,
  environment: PreparedEnvironment,
  config: SubjectConfig,
): Promise<RunOutcome> {
  const startedAt = Date.now();
  const stateDir = await mkdtemp(join(tmpdir(), "skill-eval-acpx-"));
  const permissionRequests: Observation["permissionRequests"] = [];
  const turns: Observation["turns"] = [];
  const recordedEvents: RecordedRuntimeEvent[] = [];
  let finalMessage = "";
  let runtime: ReturnType<typeof createAcpRuntime> | undefined;
  try {
    runtime = createAcpRuntime({
      cwd: environment.snapshotDir,
      agentProcessEnv: { ...environment.agentEnv },
      sessionStore: createFileSessionStore({ stateDir }),
      agentRegistry: createAgentRegistry({
        overrides: { "codex-subject": ["node", environment.codexAcpBin] },
      }),
      permissionMode: "approve-reads",
      nonInteractivePermissions: "deny",
      timeoutMs: config.timeoutMs ?? scenario.frontmatter.timeoutSeconds * 1000,
    });
    const handle = await runtime.ensureSession({
      sessionKey: config.runId,
      agent: "codex-subject",
      mode: "oneshot",
      cwd: environment.snapshotDir,
    });
    const prompts = [scenario.prompt, ...scenario.frontmatter.followUps];
    for (let index = 0; index < prompts.length; index++) {
      const userText = prompts[index];
      const turn = runtime.startTurn({
        handle,
        text: userText,
        mode: "prompt",
        requestId: crypto.randomUUID(),
        timeoutMs: config.timeoutMs ??
          scenario.frontmatter.timeoutSeconds * 1000,
        onPermissionRequest: (request) => {
          const permissionDecision = decideSubjectPermission(
            request.inferredKind,
          );
          const canRead = permissionDecision === "allow_once";
          if (!canRead) {
            permissionRequests.push({
              turnIndex: index,
              toolCallId: request.raw.toolCall.toolCallId,
              kind: request.inferredKind,
              title: (request.raw as { toolCall?: { title?: string | null } })
                .toolCall?.title ?? undefined,
              decision: "rejected",
            });
          }
          return Promise.resolve({
            outcome: permissionDecision,
          });
        },
      });
      const turnEvents: AcpRuntimeEvent[] = [];
      for await (const event of turn.events) {
        if (event.type === "text_delta" && event.stream === "thought") continue;
        turnEvents.push(event);
        recordedEvents.push({ turnIndex: index, event });
      }
      const assistantText = normalizeAssistantMessage(turnEvents);
      const result = await turn.result;
      if (result.status === "failed") {
        return {
          kind: "execution-failed",
          runId: config.runId,
          cause: "acpx-error",
          detail: result.error.message,
        };
      }
      if (result.status === "cancelled") {
        return {
          kind: "execution-failed",
          runId: config.runId,
          cause: "cancelled",
          detail: result.stopReason ?? "cancelled",
        };
      }
      turns.push({
        index,
        userText,
        assistantText,
        stopReason: result.stopReason,
      });
      finalMessage = assistantText;
      const status = await runtime.getStatus({ handle });
      const usage = usageTotals(status.usage);
      if (
        result.status === "completed" &&
        completedWithoutModelUsage(usage.totalTokens)
      ) {
        return {
          kind: "execution-failed",
          runId: config.runId,
          cause: "model-unavailable",
          detail: assistantText || "completed turn had zero token usage",
        };
      }
      if (index === prompts.length - 1) {
        return buildObservedOutcome({
          runId: config.runId,
          scenarioId: scenario.frontmatter.scenarioId,
          revision: environment.revision,
          turns,
          recordedEvents,
          permissionRequests,
          finalMessage,
          usage,
          durationMs: Date.now() - startedAt,
          credentialReferences: await subjectCredentialReferences(
            environment.codexHome,
          ),
        });
      }
    }
    return {
      kind: "execution-failed",
      runId: config.runId,
      cause: "acpx-error",
      detail: "no turn executed",
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      kind: "execution-failed",
      runId: config.runId,
      cause: /timeout/i.test(detail) ? "timeout" : "agent-start-failed",
      detail,
    };
  } finally {
    if (runtime) await runtime.shutdown().catch(() => undefined);
    await Deno.remove(stateDir, { recursive: true }).catch(() => undefined);
  }
}

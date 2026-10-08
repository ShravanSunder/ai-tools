import type { AcpRuntimeEvent } from "npm:acpx@0.19.4/runtime";
import { judgeVerdictSchema } from "../contracts/judge-verdict.ts";
import {
  normalizeAssistantMessage,
  normalizeRuntimeEvents,
} from "../runtime/normalize-acp-events.ts";
import { withholdCredentialReferences } from "../runtime/credential-withholding.ts";
import type { JudgeAnswer } from "./judge-port.ts";
export type JudgeSessionRecord = {
  /** Every non-thought event of the judge's one turn: its reply text and any tool calls. */
  readonly events: readonly AcpRuntimeEvent[];
  readonly completed: boolean;
  /** The judge's own Codex home, which holds its linked login, as given and as resolved. */
  readonly judgeCodexHomePaths: readonly string[];
};
/**
 * Turns a finished judge session into the answer the QA evaluator records. A session whose tool
 * calls named the judge's Codex home is undecidable, and its reply is never returned, so nothing it
 * read can reach checks.json.
 */
export function judgeAnswerFromSession(
  record: JudgeSessionRecord,
): JudgeAnswer {
  const toolCalls = normalizeRuntimeEvents(
    record.events.map((event) => ({ turnIndex: 0, event })),
  );
  if (
    withholdCredentialReferences(toolCalls, record.judgeCodexHomePaths)
      .withheld.length > 0
  ) {
    return { kind: "undecidable", reason: "judge-credential-exposure" };
  }
  const rawReply = normalizeAssistantMessage(record.events);
  if (!record.completed) {
    return { kind: "malformed", raw: rawReply.slice(0, 300) };
  }
  try {
    const verdict = judgeVerdictSchema.safeParse(JSON.parse(rawReply.trim()));
    return verdict.success
      ? verdict.data
      : { kind: "malformed", raw: rawReply.slice(0, 300) };
  } catch {
    return { kind: "malformed", raw: rawReply.slice(0, 300) };
  }
}

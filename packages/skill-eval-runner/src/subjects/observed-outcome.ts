import type { Revision } from "../contracts/common.ts";
import type { Observation } from "../contracts/observation.ts";
import type { RunOutcome } from "../contracts/run.ts";
import {
  normalizeRuntimeEvents,
  type RecordedRuntimeEvent,
} from "../runtime/normalize-acp-events.ts";
import { withholdCredentialReferences } from "./credential-withholding.ts";
export type ObservedOutcomeProps = {
  runId: string;
  scenarioId: string;
  revision: Revision;
  turns: Observation["turns"];
  recordedEvents: readonly RecordedRuntimeEvent[];
  permissionRequests: Observation["permissionRequests"];
  finalMessage: string;
  usage: Observation["usage"];
  durationMs: number;
  /** Strings that identify the subject's linked credential: its Codex home path, `auth.json`, `CODEX_HOME`. */
  credentialReferences: readonly string[];
};
/**
 * Turns a completed subject session into the Run outcome that is written and judged. A session that
 * touched the linked credential is `execution-failed(credential-exposure)`: its Observation (tool
 * output, replies) is dropped, so nothing it read reaches a report or the judge.
 */
export function buildObservedOutcome(props: ObservedOutcomeProps): RunOutcome {
  const withheld = withholdCredentialReferences(
    normalizeRuntimeEvents(props.recordedEvents),
    props.credentialReferences,
  );
  if (withheld.withheldToolCallIds.length > 0) {
    return {
      kind: "execution-failed",
      runId: props.runId,
      cause: "credential-exposure",
      detail: `tool calls ${
        withheld.withheldToolCallIds.join(", ")
      } referenced the subject's linked credential; their content was withheld and the Run does not count`,
    };
  }
  const observation: Observation = {
    runId: props.runId,
    scenarioId: props.scenarioId,
    revision: props.revision,
    subject: { model: "gpt-6-luna", effort: "medium" },
    turns: props.turns,
    toolCalls: withheld.toolCalls,
    permissionRequests: props.permissionRequests,
    finalMessage: props.finalMessage,
    usage: props.usage,
    durationMs: props.durationMs,
  };
  return { kind: "observed", runId: props.runId, observation };
}

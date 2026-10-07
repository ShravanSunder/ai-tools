import type { AcpRuntimeEvent } from "npm:acpx@0.19.4/runtime";
import type { Observation } from "../contracts/observation.ts";

export type RecordedRuntimeEvent = {
  readonly turnIndex: number;
  readonly event: AcpRuntimeEvent;
};
const stringifyContent = (value: unknown): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "string"
    ? value
    : JSON.stringify(value);
export function normalizeRuntimeEvents(
  events: readonly RecordedRuntimeEvent[],
): Observation["toolCalls"] {
  const states = new Map<string, Observation["toolCalls"][number]>();
  for (const { turnIndex, event } of events) {
    if (event.type !== "tool_call") continue;
    const callId = event.toolCallId ?? `anonymous-${states.size}`;
    const key = `${turnIndex}:${callId}`;
    const previous = states.get(key);
    states.set(key, {
      id: callId,
      turnIndex,
      title: event.title && event.title !== "tool call"
        ? event.title
        : `${event.title ?? previous?.title ?? "tool call"} ${
          event.locations?.map((location) => JSON.stringify(location)).join(
            " ",
          ) ?? ""
        }`.trim(),
      kind: event.kind ?? previous?.kind,
      status: event.status === "completed"
        ? "completed"
        : event.status === "failed"
        ? "failed"
        : previous?.status ?? "pending",
      inputText: stringifyContent(event.rawInput) ?? previous?.inputText,
      outputText: stringifyContent(event.rawOutput) ?? previous?.outputText,
    });
  }
  return [...states.values()];
}
export function normalizeAssistantMessage(
  events: readonly AcpRuntimeEvent[],
): string {
  let text = "";
  let lastId: string | undefined;
  for (const event of events) {
    if (event.type !== "text_delta" || event.stream === "thought") continue;
    if (event.messageId && event.messageId !== lastId) {
      text = "";
      lastId = event.messageId;
    }
    text += event.text;
  }
  return text;
}
export function completedWithoutModelUsage(totalTokens: number): boolean {
  return totalTokens === 0;
}

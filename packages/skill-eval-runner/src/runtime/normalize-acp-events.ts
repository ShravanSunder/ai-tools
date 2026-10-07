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
const capOutput = (value: string | undefined): string | undefined =>
  value === undefined
    ? undefined
    : value.length <= 4000
    ? value
    : `${value.slice(0, 4000)}\n[output truncated]`;
export function normalizeRuntimeEvents(
  events: readonly RecordedRuntimeEvent[],
): Observation["toolCalls"] {
  const states = new Map<string, Observation["toolCalls"][number]>();
  for (const { turnIndex, event } of events) {
    if (event.type !== "tool_call") continue;
    const callId = event.toolCallId ?? `anonymous-${states.size}`;
    const key = `${turnIndex}:${callId}`;
    const previous = states.get(key);
    const genericTitle = event.title === undefined ||
      event.title === "tool call";
    const locationTitle = event.locations?.map((location) =>
      JSON.stringify(location)
    ).join(" ") ?? "";
    const title = genericTitle
      ? previous?.title ??
        (locationTitle
          ? `${event.title ?? "tool call"} ${locationTitle}`
          : "tool call")
      : event.title ?? "tool call";
    states.set(key, {
      id: callId,
      turnIndex,
      title,
      kind: event.kind ?? previous?.kind,
      status: event.status === "completed"
        ? "completed"
        : event.status === "failed"
        ? "failed"
        : previous?.status ?? "pending",
      inputText: stringifyContent(event.rawInput) ?? previous?.inputText,
      outputText: capOutput(
        stringifyContent(event.rawOutput) ?? previous?.outputText,
      ),
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

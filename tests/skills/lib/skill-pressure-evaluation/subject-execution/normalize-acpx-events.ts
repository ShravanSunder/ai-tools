import { readFileSync } from "node:fs";
import type { NormalizedToolCall } from "../scenario-cases/scenario-case-types.js";

interface AcpxToolState {
  readonly toolCallId: string;
  readonly title: string;
  readonly kind: string | undefined;
  readonly rawInput: unknown;
  readonly rawOutput: unknown;
  readonly status: string | undefined;
}

export function normalizeAcpxToolCalls(
  eventsPath: string,
): readonly NormalizedToolCall[] {
  return normalizeAcpxEventLines(readFileSync(eventsPath, "utf8"));
}

export function normalizeAcpxEventLines(
  rawEvents: string,
): readonly NormalizedToolCall[] {
  const toolStates = new Map<string, AcpxToolState>();
  for (const line of rawEvents.split(/\r?\n/)) {
    const event = parseJsonRecord(line);
    const params = readRecord(event?.["params"]);
    const update = readRecord(params?.["update"]);
    if (
      event?.["method"] !== "session/update" ||
      (update?.["sessionUpdate"] !== "tool_call" &&
        update?.["sessionUpdate"] !== "tool_call_update") ||
      typeof update["toolCallId"] !== "string"
    ) {
      continue;
    }
    const previousState = toolStates.get(update["toolCallId"]);
    toolStates.set(update["toolCallId"], {
      toolCallId: update["toolCallId"],
      title:
        typeof update["title"] === "string"
          ? update["title"]
          : (previousState?.title ?? "tool call"),
      kind:
        typeof update["kind"] === "string"
          ? update["kind"]
          : previousState?.kind,
      rawInput:
        update["rawInput"] === undefined
          ? previousState?.rawInput
          : update["rawInput"],
      rawOutput:
        update["rawOutput"] === undefined
          ? previousState?.rawOutput
          : update["rawOutput"],
      status:
        typeof update["status"] === "string"
          ? update["status"]
          : previousState?.status,
    });
  }

  return [...toolStates.values()].map(
    (toolState, sequence): NormalizedToolCall => {
      const command = `${toolState.title} ${serializeValue(toolState.rawInput)}`;
      const output = serializeValue(toolState.rawOutput);
      return {
        sequence,
        capability: isSourceInspectionTool({ command, toolState })
          ? "source-read"
          : "other",
        command,
        output,
        exitCode: toolState.status === "failed" ? 1 : 0,
      };
    },
  );
}

function isSourceInspectionTool(props: {
  readonly command: string;
  readonly toolState: AcpxToolState;
}): boolean {
  if (
    props.toolState.kind === "read" ||
    props.toolState.kind === "search" ||
    /\b(read|search)\b/i.test(props.toolState.title)
  ) {
    return true;
  }

  if (props.toolState.kind !== "execute") {
    return false;
  }

  // Codex ACP represents shell-backed source inspection as `execute`, not
  // `read`. These patterns classify observable inspection commands; they are
  // transport normalization, not semantic grading of the model response.
  return (
    /\bsed\s+-n(?:\s|$)/i.test(props.command) ||
    /\b(?:cat|head|tail|rg|grep)\b/i.test(props.command) ||
    /\bgit\s+(?:diff|log|show|status)\b/i.test(props.command)
  );
}

function serializeValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function parseJsonRecord(line: string): Record<string, unknown> | undefined {
  if (!line.trim()) {
    return undefined;
  }
  try {
    const parsedValue: unknown = JSON.parse(line);
    return readRecord(parsedValue);
  } catch {
    return undefined;
  }
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(value));
}

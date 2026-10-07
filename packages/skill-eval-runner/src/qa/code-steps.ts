import type { CodeStep } from "../contracts/check-tree.ts";
import type { Observation } from "../contracts/observation.ts";
export type StepResult = {
  kind: "true" | "false" | "unavailable";
  evidence: readonly string[];
};
const pathMatches = (title: string, ref: string): boolean =>
  title.includes(ref) ||
  title.includes(ref.replace(/^skill(?:\([^)]*\))?:|^repo:/, ""));
export function evaluateCodeStep(
  step: CodeStep,
  observation: Observation,
  defaultSkill: string,
): StepResult {
  if ("readFile" in step) {
    const matched = observation.toolCalls.filter((c) =>
      c.status === "completed" &&
      pathMatches(`${c.title} ${c.inputText ?? ""}`, step.readFile)
    );
    return {
      kind: matched.length > 0 ? "true" : "false",
      evidence: matched.map((c) => c.title),
    };
  }
  if ("loadedSkill" in step) {
    const skill = step.loadedSkill ?? defaultSkill;
    const ref = `${skill}/SKILL.md`;
    const matched = observation.toolCalls.filter((c) =>
      c.status === "completed" &&
      (pathMatches(`${c.title} ${c.inputText ?? ""}`, ref) ||
        (c.kind === "read" &&
          new RegExp(
            `\\bname:\\s*${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          ).test((c.outputText ?? "").replaceAll("\\n", "\n"))))
    );
    return {
      kind: matched.length > 0 ? "true" : "false",
      evidence: matched.map((c) => c.title),
    };
  }
  if ("noWritesAttempted" in step) {
    const writes = observation.permissionRequests.length > 0 ||
      observation.toolCalls.some((c) =>
        /\b(edit|delete|move|write|patch)\b/i.test(`${c.kind ?? ""} ${c.title}`)
      );
    return {
      kind: writes ? "false" : "true",
      evidence: [`permissionRequests=${observation.permissionRequests.length}`],
    };
  }
  if ("startedSubagents" in step) {
    // ACPX exposes starts on the parent as an "other" call titled "Start subagent <name>".
    const starts = observation.toolCalls.filter((call) =>
      call.title.startsWith("Start subagent")
    ).length;
    return {
      kind: starts >= step.startedSubagents.min ? "true" : "false",
      evidence: [`startedSubagents=${starts}`],
    };
  }
  if (!("toolCallCount" in step)) return { kind: "unavailable", evidence: [] };
  const max = step.toolCallCount.max;
  return {
    kind: observation.toolCalls.length <= max ? "true" : "false",
    evidence: [`toolCalls=${observation.toolCalls.length}`],
  };
}

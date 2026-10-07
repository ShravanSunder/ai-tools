import type { CodeStep } from "../contracts/check-tree.ts";
import type { Observation } from "../contracts/observation.ts";
export type StepResult = {
  kind: "true" | "false" | "unavailable";
  evidence: readonly string[];
};
const shellReaders = new Set([
  "cat",
  "sed",
  "head",
  "tail",
  "less",
  "more",
  "nl",
  "bat",
  "rg",
  "grep",
  "awk",
]);
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const referencesFor = (
  reference: string,
  defaultSkill: string,
): readonly string[] => {
  const sibling = reference.match(/^skill\(([^)]+)\):(.*)$/);
  if (reference.startsWith("skill:")) {
    const path = reference.slice(6);
    return [
      `${defaultSkill}/${path}`,
      `.agents/skills/${defaultSkill}/${path}`,
    ];
  }
  if (sibling) {
    return [
      `${sibling[1]}/${sibling[2]}`,
      `.agents/skills/${sibling[1]}/${sibling[2]}`,
    ];
  }
  if (reference.startsWith("repo:")) return [reference.slice(5)];
  return [reference];
};
const mentionsReference = (text: string, reference: string): boolean => {
  const normalized = reference.replace(/^\.\//, "");
  const pattern = new RegExp(
    `(?:^|[\\s'"` + "`" + `/])${escapeRegExp(normalized)}(?:$|[\\s'"` + "`" +
      `])`,
  );
  return pattern.test(text) || text.includes(`/${normalized}`);
};
const innerCommand = (command: string): string => {
  const wrapper = command.match(/\b(?:bash|sh)\s+-lc\s+["']([\s\S]*)["']\s*$/);
  return wrapper?.[1] ?? command;
};
const commandReadsReference = (
  command: string,
  references: readonly string[],
): boolean => {
  for (const segment of innerCommand(command).split(/&&|\|\||[;|]/)) {
    const tokens = segment.trim().split(/\s+/).filter(Boolean);
    while (tokens[0]?.includes("=") && !tokens[0].startsWith("=")) {
      tokens.shift();
    }
    const program = tokens.shift()?.split("/").at(-1);
    if (!program || !shellReaders.has(program)) continue;
    if (
      program === "sed" &&
      tokens.some((token) => token === "-i" || token.startsWith("-i"))
    ) continue;
    if (
      (program === "rg" || program === "grep") &&
      tokens.some((token) =>
        token === "--files" || token === "--files-with-matches" ||
        token === "-l" || token === "-c" || token === "--count"
      )
    ) continue;
    if (
      references.some((reference) =>
        tokens.some((token) => mentionsReference(token, reference))
      )
    ) return true;
  }
  return false;
};
const callReadMatches = (
  call: Observation["toolCalls"][number],
  references: readonly string[],
): boolean => {
  if (call.status !== "completed") return false;
  const text = `${call.title} ${call.inputText ?? ""}`;
  if (call.kind === "read") {
    return references.some((reference) => mentionsReference(text, reference));
  }
  if (call.kind === "execute") {
    let command = call.inputText ?? "";
    try {
      const parsed: unknown = JSON.parse(command);
      if (typeof parsed === "object" && parsed !== null) {
        const record = parsed as Record<string, unknown>;
        if (typeof record.command === "string") command = record.command;
        else if (typeof record.cmd === "string") command = record.cmd;
      }
    } catch { /* plain command */ }
    return references.some((reference) =>
      commandReadsReference(command || text, [reference])
    );
  }
  return false;
};
export function evaluateCodeStep(
  step: CodeStep,
  observation: Observation,
  defaultSkill: string,
): StepResult {
  if ("readFile" in step) {
    if (!Array.isArray(observation.toolCalls)) {
      return { kind: "unavailable", evidence: [] };
    }
    const references = referencesFor(step.readFile, defaultSkill);
    const matched = observation.toolCalls.filter((call) =>
      callReadMatches(call, references)
    );
    return {
      kind: matched.length > 0 ? "true" : "false",
      evidence: matched.map((call) => call.title),
    };
  }
  if ("loadedSkill" in step) {
    if (!Array.isArray(observation.toolCalls)) {
      return { kind: "unavailable", evidence: [] };
    }
    const skill = step.loadedSkill ?? defaultSkill;
    const references = referencesFor(`skill:${"SKILL.md"}`, skill);
    const matched = observation.toolCalls.filter((call) =>
      callReadMatches(call, references)
    );
    return {
      kind: matched.length > 0 ? "true" : "false",
      evidence: matched.map((call) => call.title),
    };
  }
  if ("noWritesAttempted" in step) {
    if (
      !Array.isArray(observation.toolCalls) ||
      !Array.isArray(observation.permissionRequests)
    ) return { kind: "unavailable", evidence: [] };
    const writes = observation.permissionRequests.length > 0 ||
      observation.toolCalls.some((call) =>
        call.kind === "edit" || call.kind === "delete" || call.kind === "move"
      );
    return {
      kind: writes ? "false" : "true",
      evidence: [`permissionRequests=${observation.permissionRequests.length}`],
    };
  }
  if ("startedSubagents" in step) {
    const starts = observation.toolCalls.filter((call) =>
      call.title.startsWith("Start subagent")
    ).length;
    return {
      kind: starts >= step.startedSubagents.min ? "true" : "false",
      evidence: [`startedSubagents=${starts}`],
    };
  }
  if ("toolCallCount" in step) {
    return {
      kind: observation.toolCalls.length <= step.toolCallCount.max
        ? "true"
        : "false",
      evidence: [`toolCalls=${observation.toolCalls.length}`],
    };
  }
  return { kind: "unavailable", evidence: [] };
}

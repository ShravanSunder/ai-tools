import { basename } from "node:path";
import type { Observation } from "../contracts/observation.ts";
export const credentialWithheldMarker = "[withheld: credential path]";
const maxTitleLengthInDetail = 120;
type RecordedToolCall = Observation["toolCalls"][number];
export type WithheldToolCall = { readonly id: string; readonly title: string };
const escapeForRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/**
 * Matches text that names one agent's Codex home, the directory holding its linked login: the full
 * path as given or resolved, or the directory's own name as a whole path segment (so
 * `$HOME/../codex-home/auth.json` matches and `codex-home-source-proof` does not). Bare mentions of
 * `auth.json` or `CODEX_HOME` are ordinary repository text and do not match.
 */
export function codexHomeReferenceMatcher(
  codexHomePaths: readonly string[],
): (text: string) => boolean {
  if (codexHomePaths.length === 0) return () => false;
  const directoryNames = [
    ...new Set(codexHomePaths.map((path) => basename(path))),
  ];
  const directoryNamePattern = new RegExp(
    `(?:^|[^A-Za-z0-9_.-])(?:${
      directoryNames.map(escapeForRegExp).join("|")
    })(?:$|[^A-Za-z0-9_.-])`,
  );
  return (text) =>
    codexHomePaths.some((path) => text.includes(path)) ||
    directoryNamePattern.test(text);
}
/**
 * A tool call whose title, input or output names the Codex home keeps its title for diagnosis, but
 * its input and output are replaced, so no credential content is carried on.
 */
export function withholdCredentialReferences(
  toolCalls: Observation["toolCalls"],
  codexHomePaths: readonly string[],
): {
  toolCalls: Observation["toolCalls"];
  withheld: readonly WithheldToolCall[];
} {
  const namesCodexHome = codexHomeReferenceMatcher(codexHomePaths);
  const withheld: WithheldToolCall[] = [];
  const withheldToolCalls = toolCalls.map((toolCall: RecordedToolCall) => {
    const matched = [toolCall.title, toolCall.inputText, toolCall.outputText]
      .some((text) => text !== undefined && namesCodexHome(text));
    if (!matched) return toolCall;
    withheld.push({ id: toolCall.id, title: toolCall.title });
    return {
      ...toolCall,
      inputText: toolCall.inputText === undefined
        ? undefined
        : credentialWithheldMarker,
      outputText: toolCall.outputText === undefined
        ? undefined
        : credentialWithheldMarker,
    };
  });
  return { toolCalls: withheldToolCalls, withheld };
}
/** Each withheld call's id and title (the command), capped; never its input or output. */
export function describeWithheldToolCalls(
  withheld: readonly WithheldToolCall[],
): string {
  return withheld.map(({ id, title }) => {
    const shownTitle = title.length <= maxTitleLengthInDetail
      ? title
      : `${title.slice(0, maxTitleLengthInDetail - 1)}…`;
    return `${id} ${JSON.stringify(shownTitle)}`;
  }).join("; ");
}

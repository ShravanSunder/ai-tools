import type { Observation } from "../contracts/observation.ts";
export const credentialWithheldMarker = "[withheld: credential path]";
type RecordedToolCall = Observation["toolCalls"][number];
const referencesCredential = (
  toolCall: RecordedToolCall,
  credentialReferences: readonly string[],
): boolean =>
  [toolCall.title, toolCall.inputText, toolCall.outputText].some((text) =>
    text !== undefined &&
    credentialReferences.some((reference) => text.includes(reference))
  );
/**
 * A tool call whose title, input or output names the subject's linked credential keeps its title
 * for diagnosis, but its input and output are replaced, so no credential content is carried on.
 */
export function withholdCredentialReferences(
  toolCalls: Observation["toolCalls"],
  credentialReferences: readonly string[],
): {
  toolCalls: Observation["toolCalls"];
  withheldToolCallIds: readonly string[];
} {
  const withheldToolCallIds: string[] = [];
  const withheldToolCalls = toolCalls.map((toolCall) => {
    if (!referencesCredential(toolCall, credentialReferences)) return toolCall;
    withheldToolCallIds.push(toolCall.id);
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
  return { toolCalls: withheldToolCalls, withheldToolCallIds };
}

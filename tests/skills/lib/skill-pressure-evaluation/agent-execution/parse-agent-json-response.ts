export function parseAgentJsonResponse(response: string): unknown {
  const trimmedResponse = response.trim();
  const completeResponse = tryParseJson(trimmedResponse);
  if (completeResponse.parsed) {
    return completeResponse.value;
  }

  const fencedJson = trimmedResponse.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i,
  )?.[1];
  if (fencedJson !== undefined) {
    const fencedResponse = tryParseJson(fencedJson);
    if (fencedResponse.parsed) {
      return fencedResponse.value;
    }
  }

  const trailingResponse = tryParseTrailingJsonContainer(trimmedResponse);
  if (trailingResponse.parsed) {
    return trailingResponse.value;
  }

  throw new Error("Agent did not return JSON.");
}

type JsonParseResult =
  | { readonly parsed: true; readonly value: unknown }
  | { readonly parsed: false };

function tryParseJson(candidate: string): JsonParseResult {
  try {
    const parsedValue: unknown = JSON.parse(candidate);
    return { parsed: true, value: parsedValue };
  } catch {
    return { parsed: false };
  }
}

function tryParseTrailingJsonContainer(response: string): JsonParseResult {
  for (let characterIndex = response.length - 1; characterIndex >= 0; characterIndex -= 1) {
    const character = response[characterIndex];
    if (character !== "{" && character !== "[") {
      continue;
    }

    const candidate = tryParseJson(response.slice(characterIndex));
    if (candidate.parsed) {
      return candidate;
    }
  }

  return { parsed: false };
}

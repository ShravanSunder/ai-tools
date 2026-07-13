type JsonRecord = Record<string, unknown>;

export interface AcpxToolObservation {
  readonly eventId: string;
  readonly payload: string;
}

export interface AcpxTranscriptFacts {
  readonly sessionId: string | null;
  readonly resolvedModel: string | null;
  readonly reasoningEffort: string | null;
  readonly stopReason: string | null;
  readonly promptCount: number;
  readonly mcpServerCount: number | null;
  readonly visibleResponse: string;
  readonly toolObservations: readonly AcpxToolObservation[];
  readonly usageObservations: readonly string[];
  readonly diagnosticErrors: readonly string[];
  readonly parseErrors: readonly string[];
  readonly transportErrors: readonly string[];
}

export interface AcpxTranscriptCollectorOptions {
  readonly secrets?: readonly string[];
  readonly excerptLimit?: number;
  readonly observationLimit?: number;
}

export function collectAcpxTranscript(
  stdout: string,
  options: AcpxTranscriptCollectorOptions = {},
): AcpxTranscriptFacts {
  const excerptLimit = options.excerptLimit ?? 8_000;
  const observationLimit = options.observationLimit ?? 200;
  const redact = (value: string): string => redactAndBound(value, options.secrets ?? [], excerptLimit);
  const parsed = parseNdjson(stdout);
  const sessionNew = parsed.messages.find((message) => message.method === "session/new");
  const sessionResult = parsed.messages
    .map((message) => asRecord(message.result))
    .find((result) => typeof result?.sessionId === "string");
  const modelResult = parsed.messages
    .map((message) => asRecord(message.result))
    .find((result) => asRecord(result?.models)?.currentModelId !== undefined);
  const configOptions = parsed.messages
    .flatMap((message) => {
      const result = asRecord(message.result);
      return Array.isArray(result?.configOptions) ? [result.configOptions] : [];
    })
    .at(-1);
  const requestedModel = parsed.messages
    .map((message) => message.method === "session/set_model" ? asRecord(message.params)?.modelId : null)
    .find((value) => typeof value === "string");
  const modelId = typeof requestedModel === "string"
    ? requestedModel
    : asRecord(modelResult?.models)?.currentModelId;
  const parsedModel = typeof modelId === "string" ? parseModelId(modelId) : null;
  const mcpServers = asRecord(sessionNew?.params)?.mcpServers;

  const visibleResponse = readVisibleResponse(parsed.messages);
  return {
    sessionId: typeof sessionResult?.sessionId === "string" ? sessionResult.sessionId : null,
    resolvedModel: parsedModel?.model ?? readConfigValue(configOptions, "model"),
    reasoningEffort: parsedModel?.effort ?? readConfigValue(configOptions, "effort"),
    stopReason: readStopReason(parsed.messages),
    promptCount: parsed.messages.filter((message) => message.method === "session/prompt").length,
    mcpServerCount: Array.isArray(mcpServers) ? mcpServers.length : null,
    visibleResponse: redact(visibleResponse),
    toolObservations: readToolObservations(parsed.messages).slice(0, observationLimit).map((observation) => ({
      ...observation,
      payload: redact(observation.payload),
    })),
    usageObservations: readUsageObservations(parsed.messages).slice(0, observationLimit).map(redact),
    diagnosticErrors: readDiagnosticErrors(visibleResponse).slice(0, observationLimit).map(redact),
    parseErrors: parsed.errors.slice(0, observationLimit).map(redact),
    transportErrors: parsed.messages.flatMap((message) => {
      const error = asRecord(message.error);
      return typeof error?.message === "string" ? [redact(error.message)] : [];
    }).slice(0, observationLimit),
  };
}

function redactAndBound(value: string, secrets: readonly string[], limit: number): string {
  let redacted = value;
  for (const secret of [...new Set(secrets.filter(Boolean))].sort((left, right) => right.length - left.length)) {
    redacted = redacted.replaceAll(secret, "[REDACTED]");
  }
  redacted = redacted
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/\b(?:sk|key|token)-[A-Za-z0-9_-]{12,}\b/giu, "[REDACTED]");
  return redacted.length <= limit ? redacted : `${redacted.slice(0, limit)}\n[TRUNCATED]`;
}

function readUsageObservations(messages: readonly JsonRecord[]): readonly string[] {
  return messages.flatMap((message) => {
    const resultUsage = asRecord(asRecord(message.result)?.usage);
    const update = asRecord(asRecord(message.params)?.update);
    const updateUsage = asRecord(update?.usage);
    const metadataUsage = asRecord(asRecord(update?._meta)?.usage);
    return [resultUsage, updateUsage, metadataUsage]
      .filter((usage): usage is JsonRecord => usage !== null)
      .map((usage) => JSON.stringify(usage));
  });
}

function readStopReason(messages: readonly JsonRecord[]): string | null {
  for (const message of [...messages].reverse()) {
    const stopReason = asRecord(message.result)?.stopReason;
    if (typeof stopReason === "string") {
      return stopReason;
    }
  }
  return null;
}

function readDiagnosticErrors(visibleResponse: string): readonly string[] {
  const diagnosticPatterns = [
    /stream disconnected before completion[^\n]*/giu,
    /error sending request for url[^\n]*/giu,
    /failed to lookup address information[^\n]*/giu,
    /API Error:[^\n]*/giu,
    /Unable to connect[^\n]*/giu,
    /getaddrinfo\s+ENOTFOUND[^\n]*/giu,
    /nodename nor servname provided[^\n]*/giu,
  ];
  return [...new Set(diagnosticPatterns.flatMap((pattern) => visibleResponse.match(pattern) ?? []))];
}

function parseNdjson(text: string): {
  readonly messages: readonly JsonRecord[];
  readonly errors: readonly string[];
} {
  const messages: JsonRecord[] = [];
  const errors: string[] = [];
  for (const [index, line] of text.split(/\r?\n/u).entries()) {
    if (line.trim() === "") {
      continue;
    }
    try {
      const message = asRecord(JSON.parse(line) as unknown);
      if (message === null) {
        errors.push(`line ${index + 1} is not a JSON object`);
      } else {
        messages.push(message);
      }
    } catch {
      errors.push(`line ${index + 1} is not valid JSON`);
    }
  }
  return { messages, errors };
}

function readVisibleResponse(messages: readonly JsonRecord[]): string {
  return messages.flatMap((message) => {
    const update = asRecord(asRecord(message.params)?.update);
    const content = asRecord(update?.content);
    return update?.sessionUpdate === "agent_message_chunk" && typeof content?.text === "string"
      ? [content.text]
      : [];
  }).join("");
}

function readToolObservations(messages: readonly JsonRecord[]): readonly AcpxToolObservation[] {
  return messages.flatMap((message, index) => {
    const update = asRecord(asRecord(message.params)?.update);
    if (update?.sessionUpdate !== "tool_call" && update?.sessionUpdate !== "tool_call_update") {
      return [];
    }
    return [{
      eventId: typeof update.toolCallId === "string" ? update.toolCallId : `tool-${index}`,
      payload: JSON.stringify(update),
    }];
  });
}

function parseModelId(modelId: string): { readonly model: string; readonly effort: string } | null {
  const match = /^(?<model>[^\[]+)\[(?<effort>[^\]]+)\]$/u.exec(modelId);
  const model = match?.groups?.model;
  const effort = match?.groups?.effort;
  return model && effort ? { model, effort } : null;
}

function readConfigValue(configOptions: unknown[] | undefined, id: string): string | null {
  if (configOptions === undefined) {
    return null;
  }
  for (const option of configOptions) {
    const record = asRecord(option);
    if (record?.id === id && typeof record.currentValue === "string") {
      return record.currentValue;
    }
  }
  return null;
}

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as JsonRecord
    : null;
}

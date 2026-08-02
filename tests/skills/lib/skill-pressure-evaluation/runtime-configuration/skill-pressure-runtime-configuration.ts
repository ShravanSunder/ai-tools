export const DEFAULT_PRESSURE_MODEL = "gpt-5.6-luna";
export const DEFAULT_PRESSURE_REASONING_EFFORT = "high";
export const DEFAULT_JUDGE_MODEL = "gpt-5.6-terra";
export const DEFAULT_JUDGE_REASONING_EFFORT = "medium";

export interface AcpxCodexAgentSetup {
  readonly model: string;
  readonly reasoningEffort: string;
  readonly timeoutSeconds: number;
  readonly permissionMode: "approve-reads" | "deny-all";
  readonly allowedTools?: string;
}

export type JsonPrimitive = boolean | null | number | string;
export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export interface AcpxCodexAdapterConfiguration {
  /**
   * Temporary profile-equivalent bridge for codex-acp. Codex profiles cannot
   * be applied when the adapter starts `codex app-server`, so callers may pass
   * the required app-server config explicitly until profiles are supported.
   */
  readonly config?: JsonObject;
  readonly modelProvider?: string;
}

export interface SkillPressureRuntimeConfiguration {
  readonly codexAdapter: AcpxCodexAdapterConfiguration;
  readonly subject: AcpxCodexAgentSetup;
  readonly judge: AcpxCodexAgentSetup;
}

export function resolveSkillPressureRuntimeConfiguration(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): SkillPressureRuntimeConfiguration {
  const codexConfig = parseOptionalJsonObject(
    environment["SKILL_PRESSURE_CODEX_CONFIG"],
  );
  const codexModelProvider = readOptionalConfiguredValue(
    environment["SKILL_PRESSURE_CODEX_MODEL_PROVIDER"],
  );

  return {
    codexAdapter: {
      ...(codexConfig === undefined ? {} : { config: codexConfig }),
      ...(codexModelProvider === undefined
        ? {}
        : { modelProvider: codexModelProvider }),
    },
    subject: {
      model: readConfiguredValue(
        environment["CODEX_PRESSURE_MODEL"],
        DEFAULT_PRESSURE_MODEL,
      ),
      reasoningEffort: readConfiguredValue(
        environment["CODEX_PRESSURE_REASONING_EFFORT"],
        DEFAULT_PRESSURE_REASONING_EFFORT,
      ),
      timeoutSeconds: parsePositiveInteger(
        environment["SKILL_PRESSURE_TIMEOUT_SECONDS"],
        900,
      ),
      permissionMode: "approve-reads",
    },
    judge: {
      model: readConfiguredValue(
        environment["SKILL_PRESSURE_JUDGE_MODEL"],
        DEFAULT_JUDGE_MODEL,
      ),
      reasoningEffort: readConfiguredValue(
        environment["SKILL_PRESSURE_JUDGE_REASONING_EFFORT"],
        DEFAULT_JUDGE_REASONING_EFFORT,
      ),
      timeoutSeconds: parsePositiveInteger(
        environment["SKILL_PRESSURE_JUDGE_TIMEOUT_SECONDS"],
        300,
      ),
      permissionMode: "deny-all",
      allowedTools: "",
    },
  };
}

function parseOptionalJsonObject(
  configuredValue: string | undefined,
): JsonObject | undefined {
  const trimmedValue = configuredValue?.trim();
  if (!trimmedValue) {
    return undefined;
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(trimmedValue);
  } catch {
    throw new Error("SKILL_PRESSURE_CODEX_CONFIG must be a JSON object");
  }

  if (!isJsonObject(parsedValue)) {
    throw new Error("SKILL_PRESSURE_CODEX_CONFIG must be a JSON object");
  }
  return parsedValue;
}

function isJsonObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isJsonValue)
  );
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  return isJsonObject(value);
}

function readConfiguredValue(
  configuredValue: string | undefined,
  fallbackValue: string,
): string {
  const trimmedValue = configuredValue?.trim();
  return trimmedValue ? trimmedValue : fallbackValue;
}

function readOptionalConfiguredValue(
  configuredValue: string | undefined,
): string | undefined {
  const trimmedValue = configuredValue?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function parsePositiveInteger(
  configuredValue: string | undefined,
  fallbackValue: number,
): number {
  const parsedValue = Number.parseInt(configuredValue ?? "", 10);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallbackValue;
}

import { describe, expect, test } from "vitest";
import {
  DEFAULT_JUDGE_MODEL,
  DEFAULT_JUDGE_REASONING_EFFORT,
  DEFAULT_PRESSURE_MODEL,
  DEFAULT_PRESSURE_REASONING_EFFORT,
  resolveSkillPressureRuntimeConfiguration,
} from "./skill-pressure-runtime-configuration.js";

describe("resolveSkillPressureRuntimeConfiguration", () => {
  test("uses the bounded default subject and judge setup", () => {
    const configuration = resolveSkillPressureRuntimeConfiguration({});

    expect(configuration.codexAdapter).toEqual({});
    expect(configuration.subject).toMatchObject({
      model: DEFAULT_PRESSURE_MODEL,
      reasoningEffort: DEFAULT_PRESSURE_REASONING_EFFORT,
      timeoutSeconds: 900,
    });
    expect(configuration.judge).toMatchObject({
      model: DEFAULT_JUDGE_MODEL,
      reasoningEffort: DEFAULT_JUDGE_REASONING_EFFORT,
      timeoutSeconds: 300,
    });
  });

  test("accepts environment overrides without changing source", () => {
    const configuration = resolveSkillPressureRuntimeConfiguration({
      SKILL_PRESSURE_CODEX_CONFIG: JSON.stringify({
        model_providers: {
          "alternate-router": {
            base_url: "http://localhost:9876/v1",
            name: "Alternate Router",
            wire_api: "responses",
          },
        },
        service_tier: "priority",
      }),
      SKILL_PRESSURE_CODEX_MODEL_PROVIDER: "alternate-router",
      CODEX_PRESSURE_MODEL: "subject-model",
      CODEX_PRESSURE_REASONING_EFFORT: "xhigh",
      SKILL_PRESSURE_TIMEOUT_SECONDS: "123",
      SKILL_PRESSURE_JUDGE_MODEL: "judge-model",
      SKILL_PRESSURE_JUDGE_REASONING_EFFORT: "low",
      SKILL_PRESSURE_JUDGE_TIMEOUT_SECONDS: "45",
    });

    expect(configuration).toEqual({
      codexAdapter: {
        config: {
          model_providers: {
            "alternate-router": {
              base_url: "http://localhost:9876/v1",
              name: "Alternate Router",
              wire_api: "responses",
            },
          },
          service_tier: "priority",
        },
        modelProvider: "alternate-router",
      },
      subject: {
        model: "subject-model",
        reasoningEffort: "xhigh",
        timeoutSeconds: 123,
        permissionMode: "approve-reads",
      },
      judge: {
        model: "judge-model",
        reasoningEffort: "low",
        timeoutSeconds: 45,
        permissionMode: "deny-all",
        allowedTools: "",
      },
    });
  });

  test("rejects malformed or non-object Codex app-server configuration", () => {
    expect(() =>
      resolveSkillPressureRuntimeConfiguration({
        SKILL_PRESSURE_CODEX_CONFIG: "not-json",
      }),
    ).toThrow("SKILL_PRESSURE_CODEX_CONFIG must be a JSON object");
    expect(() =>
      resolveSkillPressureRuntimeConfiguration({
        SKILL_PRESSURE_CODEX_CONFIG: JSON.stringify(["not", "an", "object"]),
      }),
    ).toThrow("SKILL_PRESSURE_CODEX_CONFIG must be a JSON object");
  });
});

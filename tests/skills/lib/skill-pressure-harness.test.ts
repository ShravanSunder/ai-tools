import { describe, expect, test } from "vitest";
import {
  DEFAULT_PRESSURE_MODEL,
  DEFAULT_PRESSURE_REASONING_EFFORT,
  parseSkillPressureTimeoutSeconds,
} from "./skill-pressure-harness.js";

describe("pressure subject defaults", () => {
  test("uses Luna with xhigh reasoning", () => {
    expect(DEFAULT_PRESSURE_MODEL).toBe("gpt-5.6-luna");
    expect(DEFAULT_PRESSURE_REASONING_EFFORT).toBe("xhigh");
  });
});

describe("parseSkillPressureTimeoutSeconds", () => {
  test("uses configured positive integer values", () => {
    expect(parseSkillPressureTimeoutSeconds("123")).toBe(123);
  });

  test("falls back when the configured value is invalid", () => {
    expect(parseSkillPressureTimeoutSeconds("not-a-number")).toBe(900);
    expect(parseSkillPressureTimeoutSeconds("0")).toBe(900);
    expect(parseSkillPressureTimeoutSeconds("-1")).toBe(900);
    expect(parseSkillPressureTimeoutSeconds(undefined)).toBe(900);
  });
});

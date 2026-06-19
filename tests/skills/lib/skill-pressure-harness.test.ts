import { describe, expect, test } from "vitest";
import { parseSkillPressureTimeoutSeconds } from "./skill-pressure-harness.js";

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

import { assertEquals } from "jsr:@std/assert@1";
import type { Scenario } from "../contracts/scenario.ts";
import { validateNamedScenarioStatuses } from "./validate-scenario-selection.ts";
const scenario = (
  scenarioId: string,
  status: "active" | "draft" | "retired",
): Scenario => ({
  frontmatter: {
    scenarioId,
    skill: "sample-skill",
    status,
    allowWrites: false as const,
    timeoutSeconds: 600,
    followUps: [],
    fixtures: [],
  },
  prompt: "answer",
  checks: [],
  cards: [],
  path: "fixture",
});
Deno.test("named draft is rejected before a run", () =>
  assertEquals(
    validateNamedScenarioStatuses([scenario("draft-case", "draft")], [
      "draft-case",
    ]),
    ["scenario draft-case has status draft; only active scenarios run"],
  ));
Deno.test("named retired scenario is rejected before a run", () =>
  assertEquals(
    validateNamedScenarioStatuses([scenario("retired-case", "retired")], [
      "retired-case",
    ]),
    ["scenario retired-case has status retired; only active scenarios run"],
  ));
Deno.test("unnamed and active scenarios remain eligible", () =>
  assertEquals(
    validateNamedScenarioStatuses([scenario("active-case", "active")], [
      "active-case",
    ]),
    [],
  ));

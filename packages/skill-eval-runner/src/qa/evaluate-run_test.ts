import { assertEquals } from "jsr:@std/assert@1";
import { evaluateRun } from "./evaluate-run.ts";
import { FakeJudge } from "../judge/judge-port.ts";
import { NoEngineJev } from "../jev/jev-port.ts";
import type { Scenario } from "../contracts/scenario.ts";
import type { Observation } from "../contracts/observation.ts";
const scenario: Scenario = {
  path: "fixture",
  frontmatter: {
    scenarioId: "s",
    skill: "sample-skill",
    status: "active",
    allowWrites: false,
    timeoutSeconds: 600,
    followUps: [],
    fixtures: [],
  },
  prompt: "Explain",
  cards: [{
    id: "q",
    serves: "quality",
    type: "yes_no",
    question: "Is it useful?",
    evidence: ["finalMessage"],
  }],
  checks: [{
    id: "code",
    criterion: "read",
    root: "a",
    nodes: {
      a: {
        kind: "code",
        step: { loadedSkill: "sample-skill" },
        onTrue: "pass",
        onFalse: "fail",
        onUnavailable: "inconclusive",
      },
    },
  }, {
    id: "jev",
    criterion: "quality",
    root: "a",
    nodes: {
      a: {
        kind: "jev",
        card: "q",
        branches: { yes: "pass", no: "fail", uncertain: "judge" },
      },
      judge: { kind: "judge", evidence: ["finalMessage"], tools: [] },
    },
  }],
};
const observation: Observation = {
  runId: "r",
  scenarioId: "s",
  revision: { kind: "working-tree" },
  subject: { model: "gpt-6-luna", effort: "medium" },
  turns: [{ index: 0, userText: "Explain", assistantText: "Useful answer" }],
  toolCalls: [{
    id: "1",
    turnIndex: 0,
    title: "read /sample-skill/SKILL.md",
    status: "completed",
  }],
  permissionRequests: [],
  finalMessage: "Useful answer",
  usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  durationMs: 1,
};
Deno.test("code step and uncertain Jev reach judge leaf", async () => {
  const result = await evaluateRun(scenario, {
    kind: "observed",
    runId: "r",
    observation,
  }, {
    jev: new NoEngineJev(),
    judge: new FakeJudge({
      kind: "decided",
      result: "pass",
      evidenceQuote: "Useful answer",
      rationale: "clear",
    }),
  });
  assertEquals(result.verdict, "pass");
  assertEquals(result.checks[0].decidedBy, "code");
  assertEquals(result.checks[1].decidedBy, "judge");
});
Deno.test("fail outranks later pass", async () => {
  const bad: Scenario = structuredClone(scenario);
  const second = { ...bad.checks[0], id: "bad" };
  const node = second.nodes.a;
  if (node.kind === "code") {
    second.nodes.a = { ...node, step: { toolCallCount: { max: 0 } } };
  }
  bad.checks = [bad.checks[0], second];
  const result = await evaluateRun(bad, {
    kind: "observed",
    runId: "r",
    observation,
  }, { jev: new NoEngineJev(), judge: new FakeJudge({ kind: "malformed" }) });
  assertEquals(result.verdict, "fail");
});
Deno.test("startedSubagents code step uses recorded ACPX start calls", async () => {
  const { evaluateCodeStep } = await import("./code-steps.ts");
  const result = evaluateCodeStep({ startedSubagents: { min: 1 } }, {
    ...observation,
    toolCalls: [{
      id: "sub",
      turnIndex: 0,
      title: "Start subagent helper",
      status: "completed",
    }],
  }, "sample-skill");
  assertEquals(result.kind, "true");
});

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
    kind: "read",
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
  assertEquals(result.checks[1].path.at(-1)?.judge, {
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale: "clear",
  });
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
  }, {
    jev: new NoEngineJev(),
    judge: new FakeJudge({ kind: "malformed", raw: "bad judge reply" }),
  });
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
Deno.test("readFile requires content-reading commands and canonical paths", async () => {
  const { evaluateCodeStep } = await import("./code-steps.ts");
  const base = {
    ...observation,
    toolCalls: [{
      id: "1",
      turnIndex: 0,
      kind: "execute",
      title: "tool",
      status: "completed" as const,
      inputText: JSON.stringify({
        command: "echo sample-skill/references/rule.md",
      }),
    }],
  };
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      base,
      "sample-skill",
    ).kind,
    "false",
  );
  const read = {
    ...base,
    toolCalls: [{
      ...base.toolCalls[0],
      inputText: JSON.stringify({
        command: "cat sample-skill/references/rule.md",
      }),
    }],
  };
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      read,
      "sample-skill",
    ).kind,
    "true",
  );
  const other = {
    ...read,
    toolCalls: [{
      ...read.toolCalls[0],
      inputText: JSON.stringify({
        command: "cat other-skill/references/rule.md",
      }),
    }],
  };
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      other,
      "sample-skill",
    ).kind,
    "false",
  );
});
Deno.test("missing code evidence is inconclusive", async () => {
  const { evaluateRun: evaluate } = await import("./evaluate-run.ts");
  const scenarioWithUnavailable = {
    ...scenario,
    checks: [{
      id: "c",
      criterion: "read",
      root: "a",
      nodes: {
        a: {
          kind: "code" as const,
          step: { readFile: "repo:missing.md" },
          onTrue: "pass",
          onFalse: "fail",
        },
      },
    }],
  };
  const result = await evaluate(scenarioWithUnavailable, {
    kind: "observed",
    runId: "r",
    observation: { ...observation, toolCalls: undefined as never },
  }, {
    jev: new NoEngineJev(),
    judge: new FakeJudge({ kind: "malformed", raw: "bad judge reply" }),
  });
  assertEquals(result.checks[0].result, "inconclusive");
});
Deno.test("malformed judge replies are inconclusive", async () => {
  const judge = new FakeJudge({ kind: "malformed", raw: "bad judge reply" });
  const result = await evaluateRun(scenario, {
    kind: "observed",
    runId: "r",
    observation,
  }, {
    jev: new NoEngineJev(),
    judge,
  });
  assertEquals(result.checks[1].result, "inconclusive");
  assertEquals(result.checks[1].path.at(-1)?.judge, {
    malformed: ["bad judge reply", "bad judge reply"],
  });
  assertEquals(judge.calls, 2);
});
Deno.test("malformed judge reply retries once and uses the second decision", async () => {
  const judge = new FakeJudge([{ kind: "malformed", raw: "first malformed" }, {
    kind: "decided",
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale: "second answer",
  }]);
  const result = await evaluateRun(scenario, {
    kind: "observed",
    runId: "r",
    observation,
  }, { jev: new NoEngineJev(), judge });
  assertEquals(result.checks[1].result, "pass");
  assertEquals(result.checks[1].path.at(-1)?.judge, {
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale: "second answer",
  });
  assertEquals(result.judgeRetryCount, 1);
  assertEquals(judge.calls, 2);
});
Deno.test("a decided judge reply is never retried", async () => {
  const judge = new FakeJudge({
    kind: "decided",
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale: "first answer",
  });
  await evaluateRun(scenario, { kind: "observed", runId: "r", observation }, {
    jev: new NoEngineJev(),
    judge,
  });
  assertEquals(judge.calls, 1);
});
Deno.test("scripted Jev covers yes, no, uncertain, and choice branches", async () => {
  const cards: Scenario["cards"] = [{
    ...scenario.cards[0],
    calibration: { bands: { yes: 0.9, no: 0.1 } },
  }, {
    id: "choice",
    serves: "choice",
    type: "choice" as const,
    question: "Which?",
    options: ["red", "blue"],
    evidence: ["finalMessage"] as const,
    calibration: { bands: { red: 0.9, blue: 0.9 } },
  }];
  const checks: Scenario["checks"] = [
    {
      id: "yes",
      criterion: "yes",
      root: "a",
      nodes: {
        a: {
          kind: "jev" as const,
          card: "q",
          branches: { yes: "pass", no: "fail", uncertain: "inconclusive" },
        },
      },
    },
    {
      id: "no",
      criterion: "no",
      root: "a",
      nodes: {
        a: {
          kind: "jev" as const,
          card: "q",
          branches: { yes: "pass", no: "fail", uncertain: "inconclusive" },
        },
      },
    },
    {
      id: "uncertain",
      criterion: "uncertain",
      root: "a",
      nodes: {
        a: {
          kind: "jev" as const,
          card: "q",
          branches: { yes: "pass", no: "fail", uncertain: "inconclusive" },
        },
      },
    },
    {
      id: "choice",
      criterion: "choice",
      root: "a",
      nodes: {
        a: {
          kind: "jev-choice" as const,
          card: "choice",
          branches: { red: "fail", blue: "pass" },
          uncertain: "inconclusive",
        },
      },
    },
  ];
  const branchScenario = { ...scenario, cards, checks };
  class ScriptedJev extends NoEngineJev {
    private index = 0;
    constructor(
      private readonly answers:
        readonly ({ value: string; score: number } | { unavailable: true })[],
    ) {
      super();
    }
    override ask(): Promise<import("../jev/jev-port.ts").JevAnswer> {
      const answer = this.answers[this.index++];
      return Promise.resolve(
        "unavailable" in answer
          ? { kind: "unavailable", reason: "script" }
          : { kind: "answered", value: answer.value, score: answer.score },
      );
    }
  }
  const result = await evaluateRun(branchScenario, {
    kind: "observed",
    runId: "r",
    observation,
  }, {
    jev: new ScriptedJev([
      { value: "yes", score: 1 },
      { value: "no", score: 0 },
      { unavailable: true },
      { value: "red", score: 0 },
    ]),
    judge: new FakeJudge({ kind: "malformed", raw: "bad judge reply" }),
  });
  assertEquals(result.checks.length, 4);
  assertEquals(result.checks[0].result, "pass");
  assertEquals(result.checks[1].result, "fail");
  assertEquals(result.checks[2].result, "inconclusive");
  assertEquals(result.checks[3].result, "fail");
});
Deno.test("zero model usage maps to model-unavailable", async () => {
  const { completedWithoutModelUsage } = await import(
    "../runtime/normalize-acp-events.ts"
  );
  assertEquals(completedWithoutModelUsage(0), true);
  assertEquals(completedWithoutModelUsage(1), false);
});
Deno.test("listing and naming commands are not content reads", async () => {
  const { evaluateCodeStep } = await import("./code-steps.ts");
  const make = (command: string) => ({
    ...observation,
    toolCalls: [{
      id: "1",
      turnIndex: 0,
      kind: "execute",
      title: "tool",
      status: "completed" as const,
      inputText: JSON.stringify({ command }),
    }],
  });
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      make("rg --files sample-skill/references/rule.md"),
      "sample-skill",
    ).kind,
    "false",
  );
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      make("grep -l x sample-skill/references/rule.md"),
      "sample-skill",
    ).kind,
    "false",
  );
  assertEquals(
    evaluateCodeStep(
      { readFile: "skill:references/rule.md" },
      make("rg pattern sample-skill/references/rule.md"),
      "sample-skill",
    ).kind,
    "true",
  );
});
Deno.test("readFile unwraps quoted multi-command titles and shell wrappers", async () => {
  const { evaluateCodeStep } = await import("./code-steps.ts");
  const make = (title: string) => ({
    ...observation,
    toolCalls: [{
      id: "1",
      turnIndex: 0,
      kind: "execute",
      title,
      status: "completed" as const,
    }],
  });
  const exact =
    '"cat plugins/skill-authoring/skills/skill-creation/references/security-gate.md && cat plugins/skill-authoring/skills/skill-creation/references/platform-mechanics.md"';
  assertEquals(
    evaluateCodeStep(
      {
        readFile:
          "repo:plugins/skill-authoring/skills/skill-creation/references/security-gate.md",
      },
      make(exact),
      "sample-skill",
    ).kind,
    "true",
  );
  assertEquals(
    evaluateCodeStep(
      {
        readFile:
          "repo:plugins/skill-authoring/skills/skill-creation/references/security-gate.md",
      },
      make(
        "bash -lc 'cat plugins/skill-authoring/skills/skill-creation/references/security-gate.md'",
      ),
      "sample-skill",
    ).kind,
    "true",
  );
});

import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
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
Deno.test("CLI rejects named draft and retired scenarios before creating runs", async () => {
  const repo = await Deno.makeTempDir();
  const skill = `${repo}/sample-skill`;
  await Deno.mkdir(`${skill}/scenarios`, { recursive: true });
  await Deno.writeTextFile(
    `${skill}/SKILL.md`,
    "---\nname: sample-skill\ndescription: Use when answering.\n---\nAnswer.\n",
  );
  for (const status of ["draft", "retired"] as const) {
    const id = `${status}-case`;
    await Deno.writeTextFile(
      `${skill}/scenarios/${id}.scenario.md`,
      `---\nscenarioId: ${id}\nskill: sample-skill\nstatus: ${status}\n---\n## Prompt\nAnswer.\n## Checks\nchecks:\n  - id: c\n    criterion: answer\n    root: a\n    nodes:\n      a: {kind: code, step: {toolCallCount: {max: 1}}, onTrue: pass, onFalse: fail}`,
    );
    const environment = Deno.env.toObject();
    environment.CODEX_SANDBOX = "";
    const process = new Deno.Command(Deno.execPath(), {
      cwd: new URL("../../", import.meta.url).pathname,
      env: environment,
      args: [
        "run",
        "--allow-all",
        "--node-modules-dir=manual",
        "src/cli.ts",
        "run",
        "--repo",
        repo,
        "--skill",
        skill,
        "--scenario",
        id,
      ],
    }).output();
    const output = await process;
    const stdout = `${new TextDecoder().decode(output.stdout)}${
      new TextDecoder().decode(output.stderr)
    }`;
    assertEquals(output.code, 2);
    assertStringIncludes(stdout, `scenario ${id} has status ${status}`);
    assertStringIncludes(stdout, "only active scenarios run");
  }
});

import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { loadScenarios } from "./parse-scenario.ts";
const fixture =
  new URL("../../test-fixtures/sample-skill/", import.meta.url).pathname;
Deno.test("loads the new scenario shape and cards", async () => {
  const result = await loadScenarios({ repoRoot: fixture, skillPath: fixture });
  assertEquals(result.kind, "loaded");
  if (result.kind === "loaded") {
    assertEquals(result.scenarios.length, 1);
    assertEquals(result.scenarios[0].checks.length, 2);
  }
});
for (
  const [name, body, expected] of [
    [
      "banned prompt",
      "---\nscenarioId: bad\nskill: sample-skill\nstatus: active\n---\n## Prompt\nRun a test\n## Checks\nchecks: []",
      "banned word",
    ],
    [
      "legacy expect field",
      "---\nscenarioId: bad\nskill: sample-skill\nstatus: active\n---\n## Prompt\nPlease explain this\nexpect_answer: yes\n## Checks\nchecks: []",
      "legacy-form",
    ],
  ] as const
) {
  Deno.test(`rejects ${name}`, async () => {
    const dir = await Deno.makeTempDir();
    await Deno.mkdir(`${dir}/scenarios`);
    await Deno.writeTextFile(`${dir}/scenarios/bad.scenario.md`, body);
    const result = await loadScenarios({ repoRoot: dir, skillPath: dir });
    assertEquals(result.kind, "invalid");
    if (result.kind === "invalid") {
      assertStringIncludes(result.errors.join("\n"), expected);
    }
  });
}
Deno.test("rejects unknown card and cyclic tree", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/bad.scenario.md`,
    `---\nscenarioId: bad\nskill: bad\nstatus: active\n---\n## Prompt\nPlease explain this\n## Checks\nchecks:\n  - id: c\n    criterion: x\n    root: a\n    nodes:\n      a: {kind: jev, card: missing, branches: {yes: a, no: fail, uncertain: fail}}`,
  );
  const result = await loadScenarios({ repoRoot: dir, skillPath: dir });
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((e) => e.includes("unknown card")));
    assert(result.errors.some((e) => e.includes("cyclic")));
  }
});
Deno.test("banned word inflections reject while evaluation is allowed", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/inflection.scenario.md`,
    `---\nscenarioId: inflection\nskill: s\nstatus: active\n---\n## Prompt\nPlease provide an evaluation of this approach.\n## Checks\nchecks: []`,
  );
  const allowed = await loadScenarios({ repoRoot: dir, skillPath: dir });
  assertEquals(allowed.kind, "loaded");
  await Deno.writeTextFile(
    `${dir}/scenarios/inflection.scenario.md`,
    `---\nscenarioId: inflection\nskill: s\nstatus: active\n---\n## Prompt\nPlease compare these approaches.\n## Checks\nchecks: []`,
  );
  const rejected = await loadScenarios({ repoRoot: dir, skillPath: dir });
  assertEquals(rejected.kind, "invalid");
});
Deno.test("rejects invalid scenario fixtures", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/bad.scenario.md`,
    `---\nscenarioId: bad\nskill: s\nstatus: active\nfixtures:\n  - source: missing.md\n    target: ../escape.md\n---\n## Prompt\nPlease explain this.\n## Checks\nchecks: []`,
  );
  const result = await loadScenarios({ repoRoot: dir, skillPath: dir });
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(
      result.errors.some((error) => error.includes("fixture source missing")),
    );
    assert(result.errors.some((error) => error.includes("escapes snapshot")));
  }
});
Deno.test("rejects loadedSkill when prompt names the skill explicitly", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/explicit.scenario.md`,
    `---\nscenarioId: explicit\nskill: sample-skill\nstatus: active\n---\n## Prompt\nUse $sample-skill to answer this request.\n## Checks\nchecks:\n  - id: c\n    criterion: read\n    root: a\n    nodes:\n      a: {kind: code, step: {loadedSkill: sample-skill}, onTrue: pass, onFalse: fail, onUnavailable: inconclusive}`,
  );
  const result = await loadScenarios({ repoRoot: dir, skillPath: dir });
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((error) => error.includes("explicitly named")));
  }
});

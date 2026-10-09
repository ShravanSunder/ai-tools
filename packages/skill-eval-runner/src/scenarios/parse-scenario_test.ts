import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { loadScenarios } from "./parse-scenario.ts";
import { resolveScenarioDirectory } from "./scenario-directory.ts";
const fixtureRepo =
  new URL("../../test-fixtures/sample-repo/", import.meta.url).pathname;
Deno.test("loads the new scenario shape and cards from the default scenario directory", async () => {
  const skill = {
    repoRoot: fixtureRepo,
    skillPath: "plugins/sample-plugin/skills/sample-skill",
  };
  const result = await loadScenarios(skill, resolveScenarioDirectory(skill));
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
    const result = await loadScenarios(
      { repoRoot: dir, skillPath: dir },
      `${dir}/scenarios`,
    );
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
  const result = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((e) => e.includes("unknown card")));
    assert(result.errors.some((e) => e.includes("cyclic")));
  }
});
Deno.test("banned word inflections reject while evaluation is allowed", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  const skillName = dir.split("/").at(-1)!;
  await Deno.writeTextFile(
    `${dir}/scenarios/inflection.scenario.md`,
    `---\nscenarioId: inflection\nskill: "${skillName}"\nstatus: active\n---\n## Prompt\nPlease provide an evaluation of this approach.\n## Checks\nchecks:\n  - id: c\n    criterion: explain\n    root: a\n    nodes:\n      a: {kind: code, step: {toolCallCount: {max: 2}}, onTrue: pass, onFalse: fail}`,
  );
  const allowed = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(allowed.kind, "loaded");
  await Deno.writeTextFile(
    `${dir}/scenarios/inflection.scenario.md`,
    `---\nscenarioId: inflection\nskill: "${skillName}"\nstatus: active\n---\n## Prompt\nPlease compare these approaches.\n## Checks\nchecks: []`,
  );
  const rejected = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(rejected.kind, "invalid");
});
Deno.test("rejects invalid scenario fixtures", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/bad.scenario.md`,
    `---\nscenarioId: bad\nskill: bad\nstatus: active\nfixtures:\n  - source: missing.md\n    target: ../escape.md\n---\n## Prompt\nPlease explain this.\n## Checks\nchecks: []`,
  );
  const result = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
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
    `---\nscenarioId: explicit\nskill: sample-skill\nstatus: active\n---\n## Prompt\nUse $sample-skill to answer this request.\n## Checks\nchecks:\n  - id: c\n    criterion: read\n    root: a\n    nodes:\n      a: {kind: code, step: {loadedSkill: sample-skill}, onTrue: pass, onFalse: fail}`,
  );
  const result = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((error) => error.includes("explicitly named")));
  }
});
Deno.test("loader enforces skill name, nonempty checks, and file evidence rules", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/cards.yaml`,
    "- id: bad\n  serves: x\n  type: yes_no\n  question: x\n  evidence:\n    - file: secret-token.md\n",
  );
  await Deno.writeTextFile(
    `${dir}/scenarios/bad.scenario.md`,
    `---\nscenarioId: bad\nskill: wrong\nstatus: active\n---\n## Prompt\nPlease explain.\n## Checks\nchecks: []`,
  );
  const result = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((error) => error.includes("skill must equal")));
    assert(result.errors.some((error) => error.includes("at least one check")));
    assert(
      result.errors.some((error) =>
        error.includes("file evidence is not supported")
      ),
    );
  }
});
Deno.test("invalid cards YAML is reported while missing cards YAML is allowed", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(`${dir}/scenarios`);
  await Deno.writeTextFile(
    `${dir}/scenarios/bad.scenario.md`,
    `---\nscenarioId: bad\nskill: "${
      dir.split("/").at(-1)
    }"\nstatus: active\n---\n## Prompt\nPlease explain.\n## Checks\nchecks:\n  - id: c\n    criterion: x\n    root: a\n    nodes:\n      a: {kind: code, step: {toolCallCount: {max: 1}}, onTrue: pass, onFalse: fail}`,
  );
  await Deno.writeTextFile(`${dir}/scenarios/cards.yaml`, "[");
  const result = await loadScenarios(
    { repoRoot: dir, skillPath: dir },
    `${dir}/scenarios`,
  );
  assertEquals(result.kind, "invalid");
  if (result.kind === "invalid") {
    assert(result.errors.some((error) => error.includes("invalid cards.yaml")));
  }
});
Deno.test("a card calibration entry needs its labelled set and measurement date", async () => {
  const writeCalibratedSkill = async (calibrationEntry: string) => {
    const dir = await Deno.makeTempDir();
    const skillName = dir.split("/").at(-1);
    await Deno.mkdir(`${dir}/scenarios`);
    await Deno.writeTextFile(
      `${dir}/scenarios/cards.yaml`,
      `- id: answer-is-useful\n  serves: answer quality\n  type: yes_no\n  question: Does the answer address the request?\n  evidence: [finalMessage]\n  calibration:\n    measured-engine:\n${calibrationEntry}`,
    );
    await Deno.writeTextFile(
      `${dir}/scenarios/case.scenario.md`,
      `---\nscenarioId: case\nskill: "${skillName}"\nstatus: active\n---\n## Prompt\nPlease explain.\n## Checks\nchecks:\n  - id: c\n    criterion: x\n    root: a\n    nodes:\n      a: {kind: jev, card: answer-is-useful, branches: {yes: pass, no: fail, uncertain: inconclusive}}`,
    );
    return await loadScenarios(
      { repoRoot: dir, skillPath: dir },
      `${dir}/scenarios`,
    );
  };
  const withoutProvenance = await writeCalibratedSkill(
    "      bands: {yes: 0.9, no: 0.1}\n",
  );
  assertEquals(withoutProvenance.kind, "invalid");
  if (withoutProvenance.kind === "invalid") {
    assertStringIncludes(
      withoutProvenance.errors.join("\n"),
      "invalid question card",
    );
  }
  const withProvenance = await writeCalibratedSkill(
    '      bands: {yes: 0.9, no: 0.1}\n      labelledSet: answer-quality-set-1\n      measuredAt: "2026-10-08"\n',
  );
  assertEquals(withProvenance.kind, "loaded");
});

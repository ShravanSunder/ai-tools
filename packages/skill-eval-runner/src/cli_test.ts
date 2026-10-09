import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
// Every CLI run here gets an empty Codex home, no codex on PATH, and a temporary cache,
// so no path through the CLI can start a real subject session or write to the user's cache.
const runCli = async (
  args: readonly string[],
  environmentOverrides: Readonly<Record<string, string>> = {},
): Promise<{ code: number; output: string }> => {
  const isolatedRoot = await Deno.makeTempDir();
  await Deno.mkdir(`${isolatedRoot}/codex-home`);
  const environment: Record<string, string> = {
    ...Deno.env.toObject(),
    CODEX_SANDBOX: "",
    CODEX_HOME: `${isolatedRoot}/codex-home`,
    XDG_CACHE_HOME: `${isolatedRoot}/cache`,
    PATH: "/usr/bin:/bin",
    ...environmentOverrides,
  };
  delete environment.CODEX_PATH;
  const output = await new Deno.Command(Deno.execPath(), {
    cwd: new URL("../", import.meta.url).pathname,
    clearEnv: true,
    env: environment,
    args: [
      "run",
      "--allow-all",
      "--node-modules-dir=manual",
      "src/cli.ts",
      ...args,
    ],
  }).output();
  const decoder = new TextDecoder();
  return {
    code: output.code,
    output: `${decoder.decode(output.stdout)}${decoder.decode(output.stderr)}`,
  };
};
interface SkillWithScenarioProps {
  skillDir: string;
  scenarioDir: string;
  status: "active" | "draft" | "retired";
  prompt?: string;
}
const writeSkillWithScenario = async (
  props: SkillWithScenarioProps,
): Promise<void> => {
  const { skillDir, scenarioDir, status } = props;
  const skillName = skillDir.split("/").at(-1);
  await Deno.mkdir(skillDir, { recursive: true });
  await Deno.mkdir(scenarioDir, { recursive: true });
  await Deno.writeTextFile(
    `${skillDir}/SKILL.md`,
    `---\nname: ${skillName}\ndescription: Use when answering.\n---\nAnswer.\n`,
  );
  await Deno.writeTextFile(
    `${scenarioDir}/${status}-case.scenario.md`,
    `---\nscenarioId: ${status}-case\nskill: ${skillName}\nstatus: ${status}\n---\n## Prompt\n${
      props.prompt ?? "Answer the question."
    }\n## Checks\nchecks:\n  - id: c\n    criterion: answer\n    root: a\n    nodes:\n      a: {kind: code, step: {toolCallCount: {max: 1}}, onTrue: pass, onFalse: fail}`,
  );
};
// A plugin skill and its scenarios at the default location the runner discovers on its own.
const pluginSkillPaths = (
  repo: string,
): { skillDir: string; scenarioDir: string } => ({
  skillDir: `${repo}/plugins/sample-plugin/skills/sample-skill`,
  scenarioDir:
    `${repo}/tests/skills/pressure-scenarios/sample-plugin/sample-skill`,
});
Deno.test("validate finds a plugin skill's scenarios under tests/skills/pressure-scenarios/<plugin>/<skill>", async () => {
  const repo = await Deno.makeTempDir();
  await writeSkillWithScenario({ ...pluginSkillPaths(repo), status: "active" });
  const result = await runCli([
    "validate",
    "--repo",
    repo,
    "--skill",
    "plugins/sample-plugin/skills/sample-skill",
  ]);
  assertEquals(result.code, 0);
  assertStringIncludes(result.output, '"scenarioId": "active-case"');
});
Deno.test("--scenarios loads scenarios from the named directory instead of the default", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({
    skillDir,
    scenarioDir: `${repo}/evals/sample-skill`,
    status: "active",
  });
  const result = await runCli([
    "validate",
    "--repo",
    repo,
    "--skill",
    "plugins/sample-plugin/skills/sample-skill",
    "--scenarios",
    "evals/sample-skill",
  ]);
  assertEquals(result.code, 0);
  assertStringIncludes(result.output, '"scenarioId": "active-case"');
});
Deno.test("a missing scenario directory is invalid input that names the path it looked for", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({
    skillDir,
    scenarioDir: `${skillDir}/scenarios`,
    status: "active",
  });
  const result = await runCli([
    "validate",
    "--repo",
    repo,
    "--skill",
    "plugins/sample-plugin/skills/sample-skill",
  ]);
  assertEquals(result.code, 2);
  assertStringIncludes(
    result.output,
    `scenario directory not found: ${repo}/tests/skills/pressure-scenarios/sample-plugin/sample-skill`,
  );
});
Deno.test("validate, run and done-bar refuse a --scenarios directory that is or contains the skill under test", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  const cases = [
    ["validate", repo],
    ["validate", `${repo}/plugins/sample-plugin/skills`],
    ["validate", skillDir],
    ["run", repo],
    ["done-bar", skillDir],
  ] as const;
  for (const [command, holding] of cases) {
    const cacheHome = await Deno.makeTempDir();
    const result = await runCli([
      command,
      "--repo",
      repo,
      "--skill",
      "plugins/sample-plugin/skills/sample-skill",
      "--scenarios",
      holding,
    ], { XDG_CACHE_HOME: cacheHome });
    assertEquals(result.code, 2, `${command} --scenarios ${holding}`);
    assertStringIncludes(
      result.output,
      `--scenarios ${holding} is or contains the skill under test ${skillDir}`,
    );
    const resultWritten = await Deno.stat(`${cacheHome}/skill-evals`).then(
      () => true,
      () => false,
    );
    assertEquals(resultWritten, false);
  }
});
Deno.test("validate and run refuse --scenarios at the repository root when the skill set is outside it", async () => {
  const repo = await Deno.makeTempDir();
  const outside = await Deno.makeTempDir();
  const skillDir = `${outside}/skills/outside-skill`;
  await writeSkillWithScenario({
    skillDir,
    scenarioDir: `${outside}/scenarios/outside-skill`,
    status: "active",
  });
  for (const command of ["validate", "run"] as const) {
    const cacheHome = await Deno.makeTempDir();
    const result = await runCli([
      command,
      "--repo",
      repo,
      "--skill",
      skillDir,
      "--scenarios",
      repo,
    ], { XDG_CACHE_HOME: cacheHome });
    assertEquals(result.code, 2, command);
    assertStringIncludes(
      result.output,
      `--scenarios ${repo} is the repository root ${repo}`,
    );
    const resultWritten = await Deno.stat(`${cacheHome}/skill-evals`).then(
      () => true,
      () => false,
    );
    assertEquals(resultWritten, false);
  }
});
Deno.test("run at a commit with a skill set outside the repository exits 2 before any Run", async () => {
  const repo = await Deno.makeTempDir();
  const outside = await Deno.makeTempDir();
  const skillDir = `${outside}/skills/outside-skill`;
  const scenarioDir = `${outside}/scenarios/outside-skill`;
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  const result = await runCli([
    "run",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--scenarios",
    scenarioDir,
    "--rev",
    "HEAD",
  ]);
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, "skill-set-outside-repo");
});
const gitInit = async (repo: string): Promise<void> => {
  const output = await new Deno.Command("git", {
    args: ["init", "-q"],
    cwd: repo,
    stdout: "null",
    stderr: "piped",
  }).output();
  if (output.code !== 0) {
    throw new Error(new TextDecoder().decode(output.stderr));
  }
};
Deno.test("done-bar with invalid scenarios exits 2 and prints the loader errors", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({
    skillDir,
    scenarioDir,
    status: "active",
    prompt: "Run a test of this.",
  });
  const result = await runCli([
    "done-bar",
    "--kind",
    "new-from-intent",
    "--repo",
    repo,
    "--skill",
    skillDir,
  ]);
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, "banned word in prompt");
});
Deno.test("run exits 2 before any Run when Codex is missing or has no login", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  await gitInit(repo);
  const missingCodex = await runCli([
    "run",
    "--repo",
    repo,
    "--skill",
    skillDir,
  ]);
  assertEquals(missingCodex.code, 2);
  assertStringIncludes(missingCodex.output, "codex-not-found");
  const noLogin = await runCli([
    "run",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--codex-path",
    "codex-for-fixture",
  ]);
  assertEquals(noLogin.code, 2);
  assertStringIncludes(noLogin.output, "no-agent-login");
});
Deno.test("run with no active scenario selected exits 2 with a message", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "draft" });
  const result = await runCli(["run", "--repo", repo, "--skill", skillDir]);
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, "no active scenario");
});
Deno.test("run rejects named draft and retired scenarios before creating runs", async () => {
  const repo = await Deno.makeTempDir();
  const skillDir = `${repo}/sample-skill`;
  const scenarioDir = `${repo}/scenario-files`;
  for (const status of ["draft", "retired"] as const) {
    await writeSkillWithScenario({ skillDir, scenarioDir, status });
    const result = await runCli([
      "run",
      "--repo",
      repo,
      "--skill",
      skillDir,
      "--scenarios",
      "scenario-files",
      "--scenario",
      `${status}-case`,
    ]);
    assertEquals(result.code, 2);
    assertStringIncludes(
      result.output,
      `scenario ${status}-case has status ${status}`,
    );
    assertStringIncludes(result.output, "only active scenarios run");
  }
});
Deno.test("run with an unsupported .skill-eval-hide line exits 2 before any Run", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  await Deno.writeTextFile(
    `${repo}/.skill-eval-hide`,
    "docs/ok/\n**/eval-notes.md\n!docs/keep.md\n",
  );
  await gitInit(repo);
  // A login file and a codex path let every other preflight pass, so only the hide list can stop the Run.
  const fixtureHome = await Deno.makeTempDir();
  await Deno.writeTextFile(`${fixtureHome}/auth.json`, "{}");
  const cacheHome = await Deno.makeTempDir();
  const result = await runCli([
    "run",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--codex-path",
    "codex-for-fixture",
  ], { CODEX_HOME: fixtureHome, XDG_CACHE_HOME: cacheHome });
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, ".skill-eval-hide:2: **/eval-notes.md");
  assertStringIncludes(result.output, ".skill-eval-hide:3: !docs/keep.md");
  const batchWritten = await Deno.stat(`${cacheHome}/skill-evals`).then(
    () => true,
    () => false,
  );
  assertEquals(batchWritten, false);
});
Deno.test("a fix-bar done-bar with more than one selected scenario exits 2 asking for one --scenario", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir } = pluginSkillPaths(repo);
  // done-bar reads the scenarios from --scenarios, so both cases must load from there.
  const scenarioDir = `${repo}/evals/sample-skill`;
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  const firstScenario = await Deno.readTextFile(
    `${scenarioDir}/active-case.scenario.md`,
  );
  await Deno.writeTextFile(
    `${scenarioDir}/second-case.scenario.md`,
    firstScenario.replaceAll("active-case", "second-case"),
  );
  const fixBarArgs = [
    "done-bar",
    "--kind",
    "fix-for-recorded-failure",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--scenarios",
    scenarioDir,
    "--base",
    "HEAD",
  ] as const;
  for (
    const selection of [[], [
      "--scenario",
      "active-case",
      "--scenario",
      "second-case",
    ]] as const
  ) {
    const cacheHome = await Deno.makeTempDir();
    const result = await runCli([...fixBarArgs, ...selection], {
      XDG_CACHE_HOME: cacheHome,
    });
    assertEquals(result.code, 2);
    assertStringIncludes(
      result.output,
      "fix-for-recorded-failure needs exactly one --scenario",
    );
    const resultWritten = await Deno.stat(`${cacheHome}/skill-evals`).then(
      () => true,
      () => false,
    );
    assertEquals(resultWritten, false);
  }
});
Deno.test("done-bar with an unknown --kind exits 2 before any Run or output", async () => {
  const repo = await Deno.makeTempDir();
  const { skillDir, scenarioDir } = pluginSkillPaths(repo);
  await writeSkillWithScenario({ skillDir, scenarioDir, status: "active" });
  const firstScenario = await Deno.readTextFile(
    `${scenarioDir}/active-case.scenario.md`,
  );
  await Deno.writeTextFile(
    `${scenarioDir}/second-case.scenario.md`,
    firstScenario.replaceAll("active-case", "second-case"),
  );
  const cacheHome = await Deno.makeTempDir();
  const result = await runCli([
    "done-bar",
    "--kind",
    "fix",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--base",
    "HEAD",
  ], { XDG_CACHE_HOME: cacheHome });
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, "unknown --kind fix");
  const resultWritten = await Deno.stat(`${cacheHome}/skill-evals`).then(
    () => true,
    () => false,
  );
  assertEquals(resultWritten, false);
});

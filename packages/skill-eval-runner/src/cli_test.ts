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
const writeSkillWithScenario = async (
  skillDir: string,
  status: "active" | "draft",
  prompt = "Answer the question.",
): Promise<void> => {
  const skillName = skillDir.split("/").at(-1);
  await Deno.mkdir(`${skillDir}/scenarios`, { recursive: true });
  await Deno.writeTextFile(
    `${skillDir}/SKILL.md`,
    `---\nname: ${skillName}\ndescription: Use when answering.\n---\nAnswer.\n`,
  );
  await Deno.writeTextFile(
    `${skillDir}/scenarios/${status}-case.scenario.md`,
    `---\nscenarioId: ${status}-case\nskill: ${skillName}\nstatus: ${status}\n---\n## Prompt\n${prompt}\n## Checks\nchecks:\n  - id: c\n    criterion: answer\n    root: a\n    nodes:\n      a: {kind: code, step: {toolCallCount: {max: 1}}, onTrue: pass, onFalse: fail}`,
  );
};
Deno.test("run at a commit with a skill set outside the repository exits 2 before any Run", async () => {
  const repo = await Deno.makeTempDir();
  const outside = await Deno.makeTempDir();
  const skillDir = `${outside}/skills/outside-skill`;
  await writeSkillWithScenario(skillDir, "active");
  const result = await runCli([
    "run",
    "--repo",
    repo,
    "--skill",
    skillDir,
    "--rev",
    "HEAD",
  ]);
  assertEquals(result.code, 2);
  assertStringIncludes(result.output, "skill-set-outside-repo");
});

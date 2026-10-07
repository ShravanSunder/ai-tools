import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import {
  copySharedReferences,
  type EnvironmentResult,
  prepareEnvironment,
  removeScenarioDirectoriesFromSnapshot,
} from "./prepare-environment.ts";
const git = async (
  cwd: string,
  ...args: readonly string[]
): Promise<string> => {
  const output = await new Deno.Command("git", {
    args: [
      "-c",
      "user.name=runner-fixture",
      "-c",
      "user.email=runner-fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "core.hooksPath=/dev/null",
      ...args,
    ],
    cwd,
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (output.code !== 0) {
    throw new Error(new TextDecoder().decode(output.stderr));
  }
  return new TextDecoder().decode(output.stdout).trim();
};
const prepareWithFixtureLogin = async (
  prepare: () => Promise<EnvironmentResult>,
): Promise<EnvironmentResult> => {
  const codexHome = await Deno.makeTempDir();
  await Deno.writeTextFile(`${codexHome}/auth.json`, "{}");
  const previous = Deno.env.get("CODEX_HOME");
  Deno.env.set("CODEX_HOME", codexHome);
  try {
    return await prepare();
  } finally {
    if (previous === undefined) Deno.env.delete("CODEX_HOME");
    else Deno.env.set("CODEX_HOME", previous);
  }
};
Deno.test("snapshot removes scenarios only beside skills", async () => {
  const root = await Deno.makeTempDir();
  await Deno.mkdir(`${root}/one/scenarios`, { recursive: true });
  await Deno.mkdir(`${root}/src/scenarios`, { recursive: true });
  await Deno.writeTextFile(`${root}/one/SKILL.md`, "skill");
  await Deno.writeTextFile(`${root}/one/scenarios/hidden.md`, "hidden");
  await Deno.writeTextFile(`${root}/src/scenarios/keep.md`, "keep");
  await removeScenarioDirectoriesFromSnapshot(root);
  try {
    await Deno.stat(`${root}/one/scenarios`);
    assert(false, "skill scenarios remains");
  } catch { /* expected */ }
  assertEquals(
    await Deno.readTextFile(`${root}/src/scenarios/keep.md`),
    "keep",
  );
  assertEquals(await Deno.readTextFile(`${root}/one/SKILL.md`), "skill");
});
Deno.test("shared references are copied beside the skill set", async () => {
  const root = await Deno.makeTempDir();
  await Deno.mkdir(`${root}/plugin/skills/skill-a`, { recursive: true });
  await Deno.mkdir(`${root}/plugin/shared-references`, { recursive: true });
  await Deno.writeTextFile(`${root}/plugin/shared-references/rule.md`, "rule");
  await copySharedReferences(`${root}/plugin/skills`, `${root}/snapshot`);
  assertEquals(
    await Deno.readTextFile(
      `${root}/snapshot/.agents/shared-references/rule.md`,
    ),
    "rule",
  );
});
Deno.test("a commit revision exposes the skill set at that commit, not the working tree", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/plugin/skills/sample-skill`, { recursive: true });
  await Deno.mkdir(`${repo}/plugin/shared-references`, { recursive: true });
  await Deno.writeTextFile(
    `${repo}/plugin/skills/sample-skill/SKILL.md`,
    "committed skill text",
  );
  await Deno.writeTextFile(
    `${repo}/plugin/shared-references/rule.md`,
    "committed rule",
  );
  await git(repo, "init", "-q");
  await git(repo, "add", ".");
  await git(repo, "commit", "-q", "-m", "base");
  const commit = await git(repo, "rev-parse", "HEAD");
  await Deno.writeTextFile(
    `${repo}/plugin/skills/sample-skill/SKILL.md`,
    "working tree skill text",
  );
  await Deno.writeTextFile(
    `${repo}/plugin/shared-references/rule.md`,
    "working tree rule",
  );
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/sample-skill" },
      { kind: "commit", value: commit },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const snapshot = prepared.environment.snapshotDir;
    assertEquals(
      await Deno.readTextFile(
        `${snapshot}/.agents/skills/sample-skill/SKILL.md`,
      ),
      "committed skill text",
    );
    assertEquals(
      await Deno.readTextFile(`${snapshot}/.agents/shared-references/rule.md`),
      "committed rule",
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("a commit revision with a skill set outside the repository is invalid input", async () => {
  const repo = await Deno.makeTempDir();
  const outside = await Deno.makeTempDir();
  await Deno.writeTextFile(`${repo}/README.md`, "repo");
  await git(repo, "init", "-q");
  await git(repo, "add", ".");
  await git(repo, "commit", "-q", "-m", "base");
  await Deno.mkdir(`${outside}/skills/outside-skill`, { recursive: true });
  await Deno.writeTextFile(
    `${outside}/skills/outside-skill/SKILL.md`,
    "live text",
  );
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: `${outside}/skills/outside-skill` },
      { kind: "commit", value: "HEAD" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "ready") await prepared.environment.dispose();
  assertEquals(prepared.kind, "failed");
  if (prepared.kind === "failed") {
    assertStringIncludes(prepared.reason, "skill-set-outside-repo");
  }
});

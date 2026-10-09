import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { basename } from "node:path";
import { buildObservedOutcome } from "../subjects/observed-outcome.ts";
import {
  commitSnapshotOnce,
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
const pathExists = (path: string): Promise<boolean> =>
  Deno.stat(path).then(() => true, () => false);
Deno.test("snapshot removes scenarios only beside skills", async () => {
  const root = await Deno.makeTempDir();
  await Deno.mkdir(`${root}/one/scenarios`, { recursive: true });
  await Deno.mkdir(`${root}/src/scenarios`, { recursive: true });
  await Deno.writeTextFile(`${root}/one/SKILL.md`, "skill");
  await Deno.writeTextFile(`${root}/one/scenarios/hidden.md`, "hidden");
  await Deno.writeTextFile(`${root}/src/scenarios/keep.md`, "keep");
  await removeScenarioDirectoriesFromSnapshot(root);
  assertEquals(
    await pathExists(`${root}/one/scenarios`),
    false,
    "skill scenarios remains",
  );
  assertEquals(
    await Deno.readTextFile(`${root}/src/scenarios/keep.md`),
    "keep",
  );
  assertEquals(await Deno.readTextFile(`${root}/one/SKILL.md`), "skill");
});
const writeRepositoryFiles = async (
  repo: string,
  files: Readonly<Record<string, string>>,
): Promise<void> => {
  for (const [path, content] of Object.entries(files)) {
    await Deno.mkdir(`${repo}/${path.split("/").slice(0, -1).join("/")}`, {
      recursive: true,
    });
    await Deno.writeTextFile(`${repo}/${path}`, content);
  }
};
Deno.test("every skill's scenarios under the default root leave the snapshot without .skill-eval-hide while a fixture still lands", async () => {
  const repo = await Deno.makeTempDir();
  const scenarioRoot = "tests/skills/pressure-scenarios/plugin";
  await writeRepositoryFiles(repo, {
    "plugin/skills/skill-a/SKILL.md": "skill a",
    "plugin/skills/skill-b/SKILL.md": "skill b",
    [`${scenarioRoot}/skill-a/case.scenario.md`]: "skill a checklist",
    [`${scenarioRoot}/skill-a/fixtures/brief.md`]: "fixture brief",
    [`${scenarioRoot}/skill-b/case.scenario.md`]: "skill b checklist",
    "tests/skills/contract.test.ts": "keep: only scenario material leaves",
  });
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/skill-a" },
      { kind: "working-tree" },
      [{ source: "fixtures/brief.md", target: "docs/brief.md" }],
      `${repo}/${scenarioRoot}/skill-a/case.scenario.md`,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "failed") assertEquals(prepared.reason, "");
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const snapshot = prepared.environment.snapshotDir;
    for (const skillName of ["skill-a", "skill-b"]) {
      assertEquals(
        await pathExists(`${snapshot}/${scenarioRoot}/${skillName}`),
        false,
        `${skillName}'s scenarios reached the subject`,
      );
    }
    assertEquals(
      await Deno.readTextFile(`${snapshot}/docs/brief.md`),
      "fixture brief",
    );
    assertEquals(
      await pathExists(`${snapshot}/tests/skills/contract.test.ts`),
      true,
    );
    assertEquals(
      await pathExists(`${snapshot}/.agents/skills/skill-b/SKILL.md`),
      true,
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("a --scenarios directory in use leaves the snapshot while its siblings stay and its fixture lands", async () => {
  const repo = await Deno.makeTempDir();
  await writeRepositoryFiles(repo, {
    "plugin/skills/sample-skill/SKILL.md": "skill",
    "evals/sample-skill/case.scenario.md": "checklist",
    "evals/sample-skill/fixtures/brief.md": "fixture brief",
    "evals/other-skill/case.scenario.md":
      "keep: a custom root's siblings need a .skill-eval-hide entry",
  });
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/sample-skill" },
      { kind: "working-tree" },
      [{ source: "fixtures/brief.md", target: "docs/brief.md" }],
      `${repo}/evals/sample-skill/case.scenario.md`,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "failed") assertEquals(prepared.reason, "");
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const snapshot = prepared.environment.snapshotDir;
    assertEquals(
      await pathExists(`${snapshot}/evals/sample-skill`),
      false,
      "the scenario directory in use reached the subject",
    );
    assertEquals(
      await Deno.readTextFile(`${snapshot}/docs/brief.md`),
      "fixture brief",
    );
    assertEquals(
      await pathExists(`${snapshot}/evals/other-skill/case.scenario.md`),
      true,
    );
  } finally {
    await prepared.environment.dispose();
  }
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
Deno.test("a skill set already in the repository's .agents/skills is used in place", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/.agents/skills/local-skill/scenarios`, {
    recursive: true,
  });
  await Deno.mkdir(`${repo}/.agents/skills/sibling-skill`, { recursive: true });
  await Deno.writeTextFile(
    `${repo}/.agents/skills/local-skill/SKILL.md`,
    "local skill",
  );
  await Deno.writeTextFile(
    `${repo}/.agents/skills/local-skill/scenarios/case.scenario.md`,
    "hidden checklist",
  );
  await Deno.writeTextFile(
    `${repo}/.agents/skills/sibling-skill/SKILL.md`,
    "sibling skill",
  );
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: ".agents/skills/local-skill" },
      { kind: "working-tree" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "failed") assertEquals(prepared.reason, "");
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const exposed = `${prepared.environment.snapshotDir}/.agents/skills`;
    assertEquals(
      await Deno.readTextFile(`${exposed}/local-skill/SKILL.md`),
      "local skill",
    );
    assertEquals(
      await Deno.readTextFile(`${exposed}/sibling-skill/SKILL.md`),
      "sibling skill",
    );
    const scenariosRemain = await Deno.stat(`${exposed}/local-skill/scenarios`)
      .then(() => true, () => false);
    assertEquals(scenariosRemain, false);
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("a different skill set that collides with .agents/skills is still a conflict", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/.agents/skills/shared-name`, { recursive: true });
  await Deno.mkdir(`${repo}/plugin/skills/shared-name`, { recursive: true });
  await Deno.writeTextFile(
    `${repo}/.agents/skills/shared-name/SKILL.md`,
    "repo-local",
  );
  await Deno.writeTextFile(
    `${repo}/plugin/skills/shared-name/SKILL.md`,
    "plugin",
  );
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/shared-name" },
      { kind: "working-tree" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "ready") await prepared.environment.dispose();
  assertEquals(prepared, {
    kind: "failed",
    reason: "skill-name-conflict:shared-name",
  });
});
Deno.test(".skill-eval-hide paths leave the snapshot while fixtures under them still land", async () => {
  const repo = await Deno.makeTempDir();
  const files: Readonly<Record<string, string>> = {
    ".skill-eval-hide":
      "# evaluation material the subject must not read\n\neval-specs/\ndocs/changelog/2026-10-*-runner.md\nNOTES.eval\n",
    "eval-specs/spec.md": "names the checks",
    "docs/changelog/2026-10-07-runner.md": "names the checks",
    "docs/changelog/2026-10-07-other.md": "keep",
    "docs/changelog/nested/2026-10-07-runner.md":
      "keep: * stays in one segment",
    "docs/eval-specs": "keep: a file, and the pattern names directories",
    "sub/NOTES.eval": "names the checks",
    "plugin/skills/sample-skill/SKILL.md": "skill",
    "tests/skills/pressure-scenarios/plugin/sample-skill/case.scenario.md":
      "checklist",
    "tests/skills/pressure-scenarios/plugin/sample-skill/fixtures/brief.md":
      "fixture brief",
  };
  for (const [path, content] of Object.entries(files)) {
    await Deno.mkdir(`${repo}/${path.split("/").slice(0, -1).join("/")}`, {
      recursive: true,
    });
    await Deno.writeTextFile(`${repo}/${path}`, content);
  }
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/sample-skill" },
      { kind: "working-tree" },
      [{ source: "fixtures/brief.md", target: "eval-specs/brief.md" }],
      `${repo}/tests/skills/pressure-scenarios/plugin/sample-skill/case.scenario.md`,
      "codex-for-fixture",
    )
  );
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const snapshot = prepared.environment.snapshotDir;
    for (
      const hidden of [
        ".skill-eval-hide",
        "eval-specs/spec.md",
        "docs/changelog/2026-10-07-runner.md",
        "sub/NOTES.eval",
      ]
    ) assertEquals(await pathExists(`${snapshot}/${hidden}`), false, hidden);
    for (
      const kept of [
        "docs/changelog/2026-10-07-other.md",
        "docs/changelog/nested/2026-10-07-runner.md",
        "docs/eval-specs",
        ".agents/skills/sample-skill/SKILL.md",
      ]
    ) assertEquals(await pathExists(`${snapshot}/${kept}`), true, kept);
    assertEquals(
      await Deno.readTextFile(`${snapshot}/eval-specs/brief.md`),
      "fixture brief",
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("the repository's .skill-eval-hide also hides paths at a commit that predates it", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/eval-specs`, { recursive: true });
  await Deno.mkdir(`${repo}/skills/sample-skill`, { recursive: true });
  await Deno.writeTextFile(`${repo}/eval-specs/spec.md`, "names the checks");
  await Deno.writeTextFile(`${repo}/skills/sample-skill/SKILL.md`, "skill");
  await git(repo, "init", "-q");
  await git(repo, "add", ".");
  await git(repo, "commit", "-q", "-m", "base");
  await Deno.writeTextFile(`${repo}/.skill-eval-hide`, "eval-specs/\n");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "skills/sample-skill" },
      { kind: "commit", value: "HEAD" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    assertEquals(
      await pathExists(`${prepared.environment.snapshotDir}/eval-specs`),
      false,
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("a .skill-eval-hide that hides the skill under test fails before any snapshot", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/plugin/skills/sample-skill`, { recursive: true });
  await Deno.mkdir(`${repo}/plugin/skills/sibling-skill`, { recursive: true });
  await Deno.writeTextFile(`${repo}/plugin/skills/sample-skill/SKILL.md`, "x");
  await Deno.writeTextFile(`${repo}/plugin/skills/sibling-skill/SKILL.md`, "y");
  await Deno.writeTextFile(
    `${repo}/.skill-eval-hide`,
    "plugin/skills/sample-skill/\n",
  );
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "plugin/skills/sample-skill" },
      { kind: "working-tree" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  if (prepared.kind === "ready") await prepared.environment.dispose();
  assertEquals(prepared.kind, "failed");
  if (prepared.kind === "failed") {
    assertStringIncludes(prepared.reason, "hides the skill under test");
  }
});
Deno.test("subject shell commands do not inherit CODEX_HOME", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/skills/sample-skill`, { recursive: true });
  await Deno.writeTextFile(`${repo}/skills/sample-skill/SKILL.md`, "skill");
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "skills/sample-skill" },
      { kind: "working-tree" },
      [],
      undefined,
      "codex-for-fixture",
    )
  );
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const subjectConfig: unknown = JSON.parse(
      prepared.environment.agentEnv.CODEX_CONFIG,
    );
    assertEquals(
      (subjectConfig as {
        shell_environment_policy?: { exclude?: readonly string[] };
      }).shell_environment_policy?.exclude,
      ["CODEX_HOME"],
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("the snapshot is one neutral commit, so HEAD, log and a clean status work", async () => {
  const repo = await Deno.makeTempDir();
  const scenarioDirectory =
    `${repo}/tests/skills/pressure-scenarios/sample-skill`;
  await Deno.mkdir(`${repo}/skills/sample-skill`, { recursive: true });
  await Deno.mkdir(`${scenarioDirectory}/fixtures`, { recursive: true });
  await Deno.writeTextFile(`${repo}/skills/sample-skill/SKILL.md`, "skill");
  await Deno.writeTextFile(`${repo}/README.md`, "repo");
  await Deno.writeTextFile(`${scenarioDirectory}/fixtures/brief.md`, "brief");
  await git(repo, "init", "-q");
  const prepared = await prepareWithFixtureLogin(() =>
    prepareEnvironment(
      { repoRoot: repo, skillPath: "skills/sample-skill" },
      { kind: "working-tree" },
      [{ source: "fixtures/brief.md", target: "docs/brief.md" }],
      `${scenarioDirectory}/case.scenario.md`,
      "codex-for-fixture",
    )
  );
  assertEquals(prepared.kind, "ready");
  if (prepared.kind !== "ready") return;
  try {
    const snapshot = prepared.environment.snapshotDir;
    const readGit = async (...args: readonly string[]) => {
      const output = await new Deno.Command("git", {
        args: [...args],
        cwd: snapshot,
        stdout: "piped",
        stderr: "piped",
      }).output();
      return {
        code: output.code,
        stdout: new TextDecoder().decode(output.stdout).trim(),
      };
    };
    assertEquals((await readGit("rev-parse", "--verify", "HEAD")).code, 0);
    assertEquals(await readGit("status", "--porcelain"), {
      code: 0,
      stdout: "",
    });
    assertEquals(
      (await readGit("log", "-1", "--format=%an <%ae>|%cn <%ce>|%s")).stdout,
      "snapshot <snapshot@localhost>|snapshot <snapshot@localhost>|snapshot",
    );
    assertEquals(
      (await readGit("ls-files", "docs/brief.md", ".agents/skills")).stdout
        .split("\n").includes("docs/brief.md"),
      true,
    );
  } finally {
    await prepared.environment.dispose();
  }
});
Deno.test("the snapshot commit ignores git overrides in the runner's own environment", async () => {
  const sentinel = await Deno.makeTempDir();
  await Deno.writeTextFile(`${sentinel}/sentinel.txt`, "sentinel");
  await git(sentinel, "init", "-q");
  await git(sentinel, "add", ".");
  await git(sentinel, "commit", "-q", "-m", "sentinel");
  const sentinelHeadBefore = await git(sentinel, "rev-parse", "HEAD");
  const sentinelIndexBefore = await Deno.readFile(`${sentinel}/.git/index`);
  const snapshot = await Deno.makeTempDir();
  await Deno.writeTextFile(`${snapshot}/README.md`, "snapshot content");
  const overrides = {
    GIT_DIR: `${sentinel}/.git`,
    GIT_INDEX_FILE: `${sentinel}/.git/index`,
  } as const;
  const previous = Object.fromEntries(
    Object.keys(overrides).map((name) => [name, Deno.env.get(name)]),
  );
  for (const [name, value] of Object.entries(overrides)) {
    Deno.env.set(name, value);
  }
  let commitError: unknown;
  try {
    await commitSnapshotOnce(snapshot);
  } catch (error) {
    commitError = error;
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) Deno.env.delete(name);
      else Deno.env.set(name, value);
    }
  }
  assertEquals(await git(sentinel, "rev-parse", "HEAD"), sentinelHeadBefore);
  assertEquals(await git(sentinel, "status", "--porcelain"), "");
  assertEquals(
    await Deno.readFile(`${sentinel}/.git/index`),
    sentinelIndexBefore,
  );
  assertEquals(commitError, undefined);
  assertEquals(
    await git(snapshot, "log", "-1", "--format=%an <%ae>|%s"),
    "snapshot <snapshot@localhost>|snapshot",
  );
  assertEquals(await git(snapshot, "ls-files"), "README.md");
});
Deno.test("each Run's Codex home has a unique name, so prose that says codex-home is not a credential read", async () => {
  const repo = await Deno.makeTempDir();
  await Deno.mkdir(`${repo}/skills/sample-skill`, { recursive: true });
  await Deno.writeTextFile(`${repo}/skills/sample-skill/SKILL.md`, "skill");
  await git(repo, "init", "-q");
  const prepare = () =>
    prepareWithFixtureLogin(() =>
      prepareEnvironment(
        { repoRoot: repo, skillPath: "skills/sample-skill" },
        { kind: "working-tree" },
        [],
        undefined,
        "codex-for-fixture",
      )
    );
  const first = await prepare(), second = await prepare();
  assert(first.kind === "ready" && second.kind === "ready");
  try {
    const codexHome = first.environment.codexHome;
    const codexHomeName = basename(codexHome);
    assert(codexHomeName !== "codex-home", codexHomeName);
    assert(
      codexHomeName !== basename(second.environment.codexHome),
      "two Runs share a Codex home name",
    );
    const resolvedCodexHome = await Deno.realPath(codexHome);
    const outcomeFor = (command: string, rawOutput: string) =>
      buildObservedOutcome({
        runId: "run-1",
        scenarioId: "scenario-1",
        revision: { kind: "working-tree" },
        turns: [],
        recordedEvents: [{
          turnIndex: 0,
          event: {
            type: "tool_call",
            text: "",
            toolCallId: "call-1",
            title: command,
            kind: "execute",
            status: "completed",
            rawInput: { command: ["/bin/zsh", "-lc", command] },
            rawOutput,
          },
        }],
        permissionRequests: [],
        finalMessage: "",
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        durationMs: 1,
        subjectCodexHomePaths: [codexHome, resolvedCodexHome],
      });
    assertEquals(
      outcomeFor(
        "cat docs/setup.md",
        "Copy the login into the `codex-home` folder before you start.",
      ).kind,
      "observed",
    );
    const credentialRead = outcomeFor(
      `cat $HOME/../${codexHomeName}/auth.json`,
      "FAKE-CREDENTIAL-FIXTURE-0004",
    );
    assertEquals(
      credentialRead.kind === "execution-failed" && credentialRead.cause,
      "credential-exposure",
    );
  } finally {
    await first.environment.dispose();
    await second.environment.dispose();
  }
});

import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
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
    "plugin/skills/sample-skill/scenarios/case.scenario.md": "checklist",
    "plugin/skills/sample-skill/scenarios/fixtures/brief.md": "fixture brief",
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
      `${repo}/plugin/skills/sample-skill/scenarios/case.scenario.md`,
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

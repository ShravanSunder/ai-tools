import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { copyFile, mkdir, mkdtemp, symlink } from "node:fs/promises";
import { createRequire } from "node:module";
import type { Revision, SkillRef } from "../contracts/common.ts";
import type { ScenarioFixture } from "../contracts/scenario.ts";
import { removeHiddenPathsFromSnapshot } from "./snapshot-hide-patterns.ts";
const require = createRequire(import.meta.url);
export type PreparedEnvironment = {
  snapshotDir: string;
  homeDir: string;
  codexHome: string;
  authPath: string;
  agentEnv: Readonly<Record<string, string>>;
  codexAcpBin: string;
  revision: Revision;
  dispose(): Promise<void>;
};
export type EnvironmentResult = {
  kind: "ready";
  environment: PreparedEnvironment;
} | { kind: "failed"; reason: string };
const run = async (
  command: readonly string[],
  cwd: string,
): Promise<{ code: number; stdout: Uint8Array; stderr: Uint8Array }> => {
  const [program, ...args] = command;
  const output = await new Deno.Command(program, {
    args,
    cwd,
    stdout: "piped",
    stderr: "piped",
  }).output();
  return { code: output.code, stdout: output.stdout, stderr: output.stderr };
};
const text = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);
const copyTracked = async (repo: string, dest: string): Promise<void> => {
  const listing = await run([
    "git",
    "ls-files",
    "-co",
    "--exclude-standard",
    "-z",
  ], repo);
  if (listing.code !== 0) throw new Error(text(listing.stderr));
  for (const relativePath of text(listing.stdout).split("\0").filter(Boolean)) {
    const source = join(repo, relativePath), target = join(dest, relativePath);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
  }
};
const copyDirectoryContents = async (
  source: string,
  target: string,
  skipScenarioDirectories = false,
): Promise<void> => {
  await mkdir(target, { recursive: true });
  for await (const entry of Deno.readDir(source)) {
    if (
      skipScenarioDirectories && entry.isDirectory && entry.name === "scenarios"
    ) continue;
    const from = join(source, entry.name), to = join(target, entry.name);
    if (entry.isDirectory) {
      await copyDirectoryContents(from, to, skipScenarioDirectories);
    } else if (entry.isFile) await copyFile(from, to);
  }
};
export async function removeScenarioDirectoriesFromSnapshot(
  snapshot: string,
): Promise<void> {
  const hasSkillFile = await Deno.stat(join(snapshot, "SKILL.md"))
    .then(() => true)
    .catch(() => false);
  for await (const entry of Deno.readDir(snapshot)) {
    const target = join(snapshot, entry.name);
    if (entry.isDirectory && entry.name === "scenarios" && hasSkillFile) {
      await Deno.remove(target, { recursive: true });
    } else if (entry.isDirectory) {
      await removeScenarioDirectoriesFromSnapshot(target);
    }
  }
}
const applyFixtures = async (
  scenarioPath: string | undefined,
  fixtures: readonly ScenarioFixture[],
  snapshot: string,
): Promise<void> => {
  if (!scenarioPath) return;
  const sourceDirectory = dirname(scenarioPath);
  for (const fixture of fixtures) {
    const target = join(snapshot, fixture.target);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(sourceDirectory, fixture.source), target);
  }
};
export type SkillSetSource =
  | { kind: "snapshot"; relativeSkillSetDir: string }
  | { kind: "live"; skillSetDir: string }
  | { kind: "invalid"; reason: string };
const realOrResolvedPath = (path: string): Promise<string> =>
  Deno.realPath(path).catch(() => resolve(path));
export async function resolveSkillSetSource(
  skill: SkillRef,
  revision: Revision,
): Promise<SkillSetSource> {
  const repoRoot = await realOrResolvedPath(skill.repoRoot);
  const skillDir = await realOrResolvedPath(
    isAbsolute(skill.skillPath)
      ? skill.skillPath
      : join(skill.repoRoot, skill.skillPath),
  );
  const skillSetDir = dirname(skillDir);
  const relativeSkillSetDir = relative(repoRoot, skillSetDir);
  const outsideRepo = isAbsolute(relativeSkillSetDir) ||
    relativeSkillSetDir === ".." || relativeSkillSetDir.startsWith("../");
  if (!outsideRepo) return { kind: "snapshot", relativeSkillSetDir };
  if (revision.kind === "commit") {
    return {
      kind: "invalid",
      reason:
        `skill-set-outside-repo: ${skillSetDir} is outside --repo ${repoRoot}, so it has no copy at revision ${revision.value}; put the skill set inside --repo or run the working tree`,
    };
  }
  return { kind: "live", skillSetDir };
}
const exposeSkills = async (
  skillSetDir: string,
  snapshot: string,
): Promise<void> => {
  const exposed = join(snapshot, ".agents", "skills");
  await mkdir(exposed, { recursive: true });
  for await (const entry of Deno.readDir(skillSetDir)) {
    if (!entry.isDirectory) continue;
    try {
      await Deno.stat(join(skillSetDir, entry.name, "SKILL.md"));
    } catch {
      continue;
    }
    const target = join(exposed, entry.name);
    try {
      await Deno.stat(target);
      throw new Error(`skill-name-conflict:${entry.name}`);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("skill-name-conflict")
      ) throw error;
    }
    await copyDirectoryContents(join(skillSetDir, entry.name), target, true);
  }
  await copySharedReferences(skillSetDir, snapshot);
};
export async function copySharedReferences(
  skillSetDir: string,
  snapshot: string,
): Promise<void> {
  const shared = join(dirname(skillSetDir), "shared-references");
  try {
    await Deno.stat(shared);
    await copyDirectoryContents(
      shared,
      join(snapshot, ".agents", "shared-references"),
    );
  } catch { /* no shared references */ }
}
const discoverCodex = async (): Promise<string> => {
  const configured = Deno.env.get("CODEX_PATH");
  if (configured) return configured;
  const found = await run(["sh", "-c", "command -v codex"], Deno.cwd());
  return found.code === 0 ? text(found.stdout).trim() : "";
};
export type AgentPrerequisites = {
  kind: "ready";
  codexPath: string;
  authPath: string;
} | { kind: "failed"; reason: "codex-not-found" | "no-agent-login" };
// Codex and its file-based login are environment, not Run, outcomes: the CLI checks them once
// before any Run, and prepareEnvironment checks them again for its own callers.
export async function checkAgentPrerequisites(
  codexPathOverride?: string,
): Promise<AgentPrerequisites> {
  const codexPath = codexPathOverride ?? await discoverCodex();
  if (!codexPath) return { kind: "failed", reason: "codex-not-found" };
  const sourceCodexHome = Deno.env.get("CODEX_HOME") ??
      join(Deno.env.get("HOME") ?? "", ".codex"),
    authPath = join(sourceCodexHome, "auth.json");
  try {
    await Deno.stat(authPath);
  } catch {
    return { kind: "failed", reason: "no-agent-login" };
  }
  return { kind: "ready", codexPath, authPath };
}
const extractArchive = async (
  archive: Uint8Array,
  destination: string,
): Promise<void> => {
  const process = new Deno.Command("tar", {
    args: ["-x", "-C", destination],
    stdin: "piped",
    stdout: "null",
    stderr: "piped",
  }).spawn();
  const writer = process.stdin.getWriter();
  await writer.write(archive);
  await writer.close();
  const result = await process.output();
  if (!result.success) throw new Error(text(result.stderr));
};
export async function prepareEnvironment(
  skill: SkillRef,
  revision: Revision = { kind: "working-tree" },
  fixtures: readonly ScenarioFixture[] = [],
  scenarioPath?: string,
  codexPathOverride?: string,
): Promise<EnvironmentResult> {
  const skillSetSource = await resolveSkillSetSource(skill, revision);
  if (skillSetSource.kind === "invalid") {
    return { kind: "failed", reason: skillSetSource.reason };
  }
  const prerequisites = await checkAgentPrerequisites(codexPathOverride);
  if (prerequisites.kind === "failed") return prerequisites;
  const { codexPath, authPath } = prerequisites;
  const root = await mkdtemp(join(tmpdir(), "skill-eval-env-"));
  const homesRoot = await mkdtemp(join(tmpdir(), "skill-eval-agent-homes-"));
  const snapshot = join(root, "snapshot");
  await mkdir(snapshot);
  try {
    if (revision.kind === "commit") {
      const archive = await run(
        ["git", "archive", revision.value ?? "HEAD"],
        skill.repoRoot,
      );
      if (archive.code !== 0) throw new Error(text(archive.stderr));
      await extractArchive(archive.stdout, snapshot);
    } else await copyTracked(skill.repoRoot, snapshot);
    await removeScenarioDirectoriesFromSnapshot(snapshot);
    await removeHiddenPathsFromSnapshot(skill.repoRoot, snapshot);
    // The skill set comes from the snapshot, so it is the run's revision; fixtures land after, so they never join it.
    // A skill set that already lives at the repository's .agents/skills is in place in the snapshot.
    const skillSetInPlace = skillSetSource.kind === "snapshot" &&
      skillSetSource.relativeSkillSetDir === join(".agents", "skills");
    if (!skillSetInPlace) {
      await exposeSkills(
        skillSetSource.kind === "snapshot"
          ? join(snapshot, skillSetSource.relativeSkillSetDir)
          : skillSetSource.skillSetDir,
        snapshot,
      );
    }
    await applyFixtures(scenarioPath, fixtures, snapshot);
    const initialized = await run(["git", "init", "-q"], snapshot);
    if (initialized.code !== 0) throw new Error(text(initialized.stderr));
    const homeDir = join(homesRoot, "home"),
      codexHome = join(homesRoot, "codex-home");
    await mkdir(homeDir, { recursive: true, mode: 0o700 });
    await mkdir(codexHome, { recursive: true, mode: 0o700 });
    await symlink(authPath, join(codexHome, "auth.json"));
    const config = {
      model: "gpt-6-luna",
      model_reasoning_effort: "medium",
      approvals_reviewer: "user",
      features: {
        hooks: false,
        remote_plugin: false,
        memories: false,
        multi_agent_v2: { enabled: true },
      },
    };
    const agentEnv = {
      HOME: homeDir,
      CODEX_HOME: codexHome,
      CODEX_PATH: codexPath,
      INITIAL_AGENT_MODE: "read-only",
      CODEX_CONFIG: JSON.stringify(config),
    };
    const packageJson = require.resolve(
      "@agentclientprotocol/codex-acp/package.json",
    );
    return {
      kind: "ready",
      environment: {
        snapshotDir: snapshot,
        homeDir,
        codexHome,
        authPath,
        agentEnv,
        codexAcpBin: join(dirname(packageJson), "dist/index.js"),
        revision,
        dispose: async () => {
          await Deno.remove(root, { recursive: true });
          await Deno.remove(homesRoot, { recursive: true });
        },
      },
    };
  } catch (error) {
    await Deno.remove(root, { recursive: true });
    await Deno.remove(homesRoot, { recursive: true });
    return {
      kind: "failed",
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

import { link, mkdir, mkdtemp, symlink, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  collectRepositorySnapshot,
  deriveExpectedArtifactFacts,
  diffRepositorySnapshots,
} from "./repository-snapshot.js";

async function repository(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "skill-pressure-evidence-"));
}

describe("repository snapshot evidence", () => {
  it("recursively inventories behavior files and directories while excluding runner-owned inputs", async () => {
    const root = await repository();
    await mkdir(path.join(root, "docs"), { recursive: true });
    await mkdir(path.join(root, ".git", "objects"), { recursive: true });
    await mkdir(path.join(root, ".codex", "skills", "target"), { recursive: true });
    await writeFile(path.join(root, "docs", "result.md"), "published result");
    await writeFile(path.join(root, ".git", "objects", "hidden"), "git");
    await writeFile(path.join(root, ".codex", "skills", "target", "SKILL.md"), "runner install");
    await writeFile(path.join(root, ".skill-pressure-prompt.md"), "prompt");
    await writeFile(path.join(root, ".skill-pressure-mcp.json"), "{}");
    await writeFile(path.join(root, "AGENTS.md"), "neutral instructions");

    const snapshot = await collectRepositorySnapshot({ repositoryDirectory: root, excerptLimit: 8 });

    expect(snapshot.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: "docs", kind: "directory" }),
      expect.objectContaining({ path: "docs/result.md", kind: "file", contentExcerpt: "publishe" }),
    ]));
    expect(snapshot.entries.map((entry) => entry.path)).not.toEqual(expect.arrayContaining([
      ".git/objects/hidden",
      ".codex/skills/target/SKILL.md",
      ".skill-pressure-prompt.md",
      ".skill-pressure-mcp.json",
      "AGENTS.md",
    ]));
  });

  it("reports deterministic added, modified, and deleted paths with bounded post-run facts", async () => {
    const root = await repository();
    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(root, "docs", "modified.md"), "before");
    await writeFile(path.join(root, "docs", "deleted.md"), "delete me");
    const before = await collectRepositorySnapshot({ repositoryDirectory: root, excerptLimit: 5 });

    await writeFile(path.join(root, "docs", "modified.md"), "after-result");
    await unlink(path.join(root, "docs", "deleted.md"));
    await writeFile(path.join(root, "docs", "added.md"), "added-result");
    const after = await collectRepositorySnapshot({ repositoryDirectory: root, excerptLimit: 5 });

    expect(diffRepositorySnapshots({ before, after })).toEqual(expect.objectContaining({
      files: [
        expect.objectContaining({ path: "docs/added.md", change: "added", contentExcerpt: "added" }),
        expect.objectContaining({ path: "docs/modified.md", change: "modified", contentExcerpt: "after" }),
      ],
      deletedPaths: ["docs/deleted.md"],
      pathChanges: [
        expect.objectContaining({ path: "docs/added.md", change: "added" }),
        expect.objectContaining({ path: "docs/deleted.md", change: "deleted" }),
        expect.objectContaining({ path: "docs/modified.md", change: "modified" }),
      ],
    }));
  });

  it("omits unsupported symlink and hardlink entries without following them", async () => {
    const root = await repository();
    await writeFile(path.join(root, "source.txt"), "source");
    await symlink("source.txt", path.join(root, "linked.txt"));
    await link(path.join(root, "source.txt"), path.join(root, "hardlinked.txt"));

    const snapshot = await collectRepositorySnapshot({ repositoryDirectory: root });

    expect(snapshot.entries.map((entry) => entry.path)).toEqual([]);
    expect(snapshot.omissions).toEqual([
      { path: "hardlinked.txt", reason: "unsupported file kind: hardlink" },
      { path: "linked.txt", reason: "unsupported file kind: symlink" },
      { path: "source.txt", reason: "unsupported file kind: hardlink" },
    ]);
  });

  it("derives declared artifact facts from the post-run snapshot", async () => {
    const root = await repository();
    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(root, "docs", "result.md"), "result");
    const snapshot = await collectRepositorySnapshot({ repositoryDirectory: root });

    expect(deriveExpectedArtifactFacts({
      postRunSnapshot: snapshot,
      expectedArtifacts: [
        { artifactId: "result", path: "docs/result.md", fileType: "file", contentContract: "result" },
        { artifactId: "missing", path: "docs/missing.md", fileType: "file", contentContract: "missing" },
      ],
    })).toEqual([
      expect.objectContaining({ artifactId: "missing", path: "docs/missing.md", status: "missing" }),
      expect.objectContaining({ artifactId: "result", path: "docs/result.md", status: "observed", contentExcerpt: "result" }),
    ]);
  });
});

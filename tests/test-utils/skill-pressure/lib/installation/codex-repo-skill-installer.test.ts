import {
  linkSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { installCodexRepoSkill } from "./codex-repo-skill-installer.js";

const ownedRoots: string[] = [];

afterEach(() => {
  for (const ownedRoot of ownedRoots.splice(0)) {
    rmSync(ownedRoot, { recursive: true, force: true });
  }
});

function createFixture(): {
  readonly sourceSkillDirectory: string;
  readonly repositoryDirectory: string;
} {
  const ownedRoot = mkdtempSync(path.join(tmpdir(), "skill-pressure-install-"));
  ownedRoots.push(ownedRoot);
  const sourceSkillDirectory = path.join(ownedRoot, "source", "probe-skill");
  const repositoryDirectory = path.join(ownedRoot, "repository");
  mkdirSync(path.join(sourceSkillDirectory, "references"), { recursive: true });
  mkdirSync(path.join(repositoryDirectory, ".git"), { recursive: true });
  writeFileSync(
    path.join(sourceSkillDirectory, "SKILL.md"),
    "---\nname: probe-skill\ndescription: Use for installation proof.\n---\n",
  );
  writeFileSync(
    path.join(sourceSkillDirectory, "references", "details.md"),
    "# Details\n",
  );
  return { sourceSkillDirectory, repositoryDirectory };
}

describe("Codex repo skill installer", () => {
  it("copies the exact regular-file closure and returns matching digests", () => {
    const fixture = createFixture();

    const receipt = installCodexRepoSkill({
      ...fixture,
      skillName: "probe-skill",
    });

    expect(receipt.scope).toBe("repo");
    expect(receipt.destinationDirectory).toBe(
      path.join(
        fixture.repositoryDirectory,
        ".codex",
        "skills",
        "probe-skill",
      ),
    );
    expect(receipt.files.map((file) => file.relativePath)).toEqual([
      "SKILL.md",
      "references/details.md",
    ]);
    expect(receipt.files.every((file) => file.sourceDigest === file.installedDigest)).toBe(true);
    expect(
      readFileSync(
        path.join(receipt.destinationDirectory, "references", "details.md"),
        "utf8",
      ),
    ).toBe("# Details\n");
  });

  it("rejects symlinks in the staged source closure", () => {
    const fixture = createFixture();
    symlinkSync(
      path.join(fixture.sourceSkillDirectory, "SKILL.md"),
      path.join(fixture.sourceSkillDirectory, "references", "linked.md"),
    );

    expect(() =>
      installCodexRepoSkill({ ...fixture, skillName: "probe-skill" }),
    ).toThrow(/symlink/u);
  });

  it("rejects hard links in the staged source closure", () => {
    const fixture = createFixture();
    linkSync(
      path.join(fixture.sourceSkillDirectory, "SKILL.md"),
      path.join(fixture.sourceSkillDirectory, "references", "linked.md"),
    );

    expect(() =>
      installCodexRepoSkill({ ...fixture, skillName: "probe-skill" }),
    ).toThrow(/linked file/u);
  });

  it("rejects invalid skill names and non-repository destinations", () => {
    const fixture = createFixture();

    expect(() =>
      installCodexRepoSkill({ ...fixture, skillName: "../escape" }),
    ).toThrow(/skillName/u);
    rmSync(path.join(fixture.repositoryDirectory, ".git"), {
      recursive: true,
      force: true,
    });
    expect(() =>
      installCodexRepoSkill({ ...fixture, skillName: "probe-skill" }),
    ).toThrow(/Git repository/u);
  });

  it("requires explicit overwrite and replaces the complete destination", () => {
    const fixture = createFixture();
    installCodexRepoSkill({ ...fixture, skillName: "probe-skill" });
    writeFileSync(
      path.join(fixture.sourceSkillDirectory, "references", "details.md"),
      "# Revised\n",
    );

    expect(() =>
      installCodexRepoSkill({ ...fixture, skillName: "probe-skill" }),
    ).toThrow(/already exists/u);
    const receipt = installCodexRepoSkill({
      ...fixture,
      skillName: "probe-skill",
      overwrite: true,
    });

    expect(
      readFileSync(
        path.join(receipt.destinationDirectory, "references", "details.md"),
        "utf8",
      ),
    ).toBe("# Revised\n");
  });
});

import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { discoverAmbientSkillPaths } from "./ambient-skill-discovery.js";

describe("ambient skill discovery", () => {
  it("finds same-name user and plugin-cache skills only", async () => {
    const codexHome = await mkdtemp(path.join(tmpdir(), "ambient-skills-"));
    const userSkill = path.join(codexHome, "skills", "target", "SKILL.md");
    const pluginSkill = path.join(codexHome, "plugins", "cache", "plugin", "1", "skills", "target", "SKILL.md");
    const otherSkill = path.join(codexHome, "skills", "other", "SKILL.md");
    for (const skillPath of [userSkill, pluginSkill, otherSkill]) await mkdir(path.dirname(skillPath), { recursive: true });
    await writeFile(userSkill, "---\nname: target\n---\n");
    await writeFile(pluginSkill, "---\nname: target\n---\n");
    await writeFile(otherSkill, "---\nname: other\n---\n");

    await expect(discoverAmbientSkillPaths({ codexHome })).resolves.toEqual([
      pluginSkill,
      otherSkill,
      userSkill,
    ].sort());
  });
});

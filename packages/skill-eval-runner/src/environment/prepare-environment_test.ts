import { assert, assertEquals } from "jsr:@std/assert@1";
import {
  copySharedReferences,
  removeScenarioDirectoriesFromSnapshot,
} from "./prepare-environment.ts";
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

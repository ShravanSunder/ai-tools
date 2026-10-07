import { assert, assertEquals } from "jsr:@std/assert@1";
import { removeScenarioDirectoriesFromSnapshot } from "./prepare-environment.ts";
Deno.test("snapshot removes every scenarios directory", async () => {
  const root = await Deno.makeTempDir();
  await Deno.mkdir(`${root}/one/scenarios`, { recursive: true });
  await Deno.mkdir(`${root}/two/nested/scenarios`, { recursive: true });
  await Deno.writeTextFile(`${root}/one/SKILL.md`, "skill");
  await Deno.writeTextFile(`${root}/one/scenarios/hidden.md`, "hidden");
  await removeScenarioDirectoriesFromSnapshot(root);
  for (
    const path of [`${root}/one/scenarios`, `${root}/two/nested/scenarios`]
  ) {
    try {
      await Deno.stat(path);
      assert(false, `scenarios remains at ${path}`);
    } catch { /* expected */ }
  }
  assertEquals(await Deno.readTextFile(`${root}/one/SKILL.md`), "skill");
});

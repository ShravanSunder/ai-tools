import { describe, expect, it } from "vitest";

import { loadFastScenarioManifest } from "./fast-scenario-manifest.js";

describe("fast scenario manifest", () => {
  it("loads the checked repo-owned smoke selection", async () => {
    await expect(loadFastScenarioManifest(
      new URL("../../config/fast-scenario-manifest.yaml", import.meta.url),
    )).resolves.toEqual([
      "manage-agents-pattern-selection",
      "skills-creation-update-existing-skill",
    ]);
  });
});

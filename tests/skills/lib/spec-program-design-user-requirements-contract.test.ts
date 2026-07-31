import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const pluginRoot = path.join(repoRoot, "plugins/shravan-dev-workflow");
const readPluginFile = (relativePath: string): string =>
  readFileSync(path.join(pluginRoot, relativePath), "utf8");

describe("user requirements and design-view contracts", () => {
  test("keeps shared rendering reachable and ordered before artifact consumers", () => {
    const sharedPath = path.join(
      pluginRoot,
      "shared-references/diagram-rendering-and-fallbacks.md",
    );
    const discussPathfinding = readPluginFile(
      "skills/discuss-pathfinding/SKILL.md",
    );
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const programDesign = readPluginFile("skills/program-design/SKILL.md");
    const sharedReference = readFileSync(sharedPath, "utf8");

    expect(existsSync(sharedPath)).toBe(true);
    for (const skill of [discussPathfinding, specDesign, programDesign]) {
      expect(skill).toContain(
        "../../shared-references/diagram-rendering-and-fallbacks.md",
      );
    }

    expect(
      discussPathfinding.indexOf("references/user-requirements-extraction.md"),
    ).toBeLessThan(
      discussPathfinding.indexOf("diagram-rendering-and-fallbacks.md"),
    );
    expect(discussPathfinding.indexOf("6. **Write")).toBeLessThan(
      discussPathfinding.indexOf("diagram-rendering-and-fallbacks.md"),
    );
    expect(specDesign.indexOf("diagram-rendering-and-fallbacks.md")).toBeLessThan(
      specDesign.indexOf("MUST load `references/artifact-and-self-review.md`"),
    );
    expect(
      programDesign.indexOf("diagram-rendering-and-fallbacks.md"),
    ).toBeLessThan(
      programDesign.indexOf("MUST load `references/artifact-and-self-review.md`"),
    );
    expect(sharedReference).toContain(
      "selected medium: mermaid | markdown-table | tui-presentation | fenced-plain-text",
    );
    expect(sharedReference).toContain("format override: honored");
    expect(sharedReference).toContain("semantic preservation:");
    expect(sharedReference).toContain("result: pass | gap");
  });

  test("keeps user-requirements row authority and U identifiers aligned", () => {
    const discussPathfinding = readPluginFile(
      "skills/discuss-pathfinding/SKILL.md",
    );
    const extraction = readPluginFile(
      "skills/discuss-pathfinding/references/user-requirements-extraction.md",
    );
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const traceability = readPluginFile(
      "skills/spec-design/references/requirements-and-traceability.md",
    );

    for (const field of [
      "stable identifier: U1, U2, ...",
      "affected user or stakeholder class",
      "evidence anchor and evidence type",
      "authority state: authorized | observational | advisory | unresolved",
      "priority assigner",
      "hypothesis state when unresolved",
    ]) {
      expect(extraction).toContain(field);
    }

    expect(discussPathfinding).toContain("draft rows");
    expect(specDesign).toContain("stable U identifiers");
    expect(specDesign).toContain(
      "normative-eligible only when its producer-owned authority state is `authorized`",
    );
    expect(traceability).toContain("user or stakeholder need U1");
    expect(traceability).toContain("traceable in both directions through U when present");
  });

  test("keeps view predicates in target SKILL files only", () => {
    const discussPathfinding = readPluginFile(
      "skills/discuss-pathfinding/SKILL.md",
    );
    const extraction = readPluginFile(
      "skills/discuss-pathfinding/references/user-requirements-extraction.md",
    );
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const specArtifact = readPluginFile(
      "skills/spec-design/references/artifact-and-self-review.md",
    );
    const programDesign = readPluginFile("skills/program-design/SKILL.md");
    const programArtifact = readPluginFile(
      "skills/program-design/references/artifact-and-self-review.md",
    );

    expect(discussPathfinding).toContain(
      "per direct-user class carrying at least one must-priority need",
    );
    expect(extraction).not.toContain(
      "per direct-user class carrying at least one must-priority need",
    );
    expect(specDesign).toContain(
      "two or more external consumers or observable surfaces exist",
    );
    expect(specArtifact).not.toContain(
      "two or more external consumers or observable surfaces exist",
    );
    expect(programDesign).toContain("control crosses owners or async boundaries");
    expect(programArtifact).not.toContain(
      "control crosses owners or async boundaries",
    );
  });

  test("indexes every view owner and rendering consumer", () => {
    const vocabulary = readPluginFile("docs/diagram-vocabulary.md");

    for (const viewToken of [
      "journey map — user-requirements record",
      "journey map — specification",
      "context diagram",
      "requirement coverage table",
      "component tree",
      "call graph/sequence",
      "proof call graph",
      "state machine/table",
      "data/event flow",
      "failure/recovery flow",
      "trust-boundary view",
      "requirement/design/proof trace",
    ]) {
      expect(vocabulary).toContain(viewToken);
    }

    for (const consumer of [
      "skills/discuss-pathfinding/SKILL.md",
      "skills/spec-design/SKILL.md",
      "skills/program-design/SKILL.md",
      "shared-references/diagram-rendering-and-fallbacks.md",
    ]) {
      expect(vocabulary).toContain(consumer);
    }
  });
});

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
    for (const skill of [specDesign, programDesign]) {
      expect(skill).toContain(
        "../../shared-references/diagram-rendering-and-fallbacks.md",
      );
    }

    expect(discussPathfinding).not.toContain(
      "../../shared-references/diagram-rendering-and-fallbacks.md",
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
    for (const boundaryField of [
      "existing foundation",
      "actual missing behavior",
      "non-goals",
      "complexity budget",
      "explicit confirmation or correction",
    ]) {
      expect(discussPathfinding).toContain(boundaryField);
    }
    expect(extraction).toContain("Confirm The Goal Boundary");
    expect(extraction).toContain("Silence, generic assent");
    expect(extraction).toContain("file-permission boundary");
    expect(specDesign).toContain("stable U identifiers");
    expect(specDesign).toContain(
      "normative-eligible only when its producer-owned authority state is `authorized`",
    );
    expect(traceability).toContain("user or stakeholder need U1");
    expect(traceability).toContain("traceable in both directions through U when present");
  });

  test("keeps specification scope, correction, and artifact-state boundaries explicit", () => {
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const authority = readPluginFile(
      "skills/spec-design/references/authority-and-problem-framing.md",
    );
    const artifact = readPluginFile(
      "skills/spec-design/references/artifact-and-self-review.md",
    );

    for (const boundaryField of [
      "existing behavior or foundation to reuse",
      "actual missing capabilities or observable differences",
      "explicit non-goals",
      "complexity budget and the machinery that reopens scope",
    ]) {
      expect(authority).toContain(boundaryField);
    }
    expect(authority).toContain("Mutually narrowed current requirements");
    expect(specDesign).toContain("requirements/Why/What, structural How, or both");
    expect(specDesign).toContain("tmp/design-workflows/<date>-<slug>/");
    expect(specDesign).toContain("returned workflow state");
    expect(specDesign).toContain("parent-verified non-semantic edits may retain coverage");
    expect(specDesign).not.toContain("Any later artifact edit makes");
    expect(artifact).toContain("Human Deletion Test");
    expect(artifact).toContain("smallest Why/What model");
    expect(specDesign).not.toContain("artifact identity/digest");
    expect(artifact).not.toContain("digest-bound");
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

    expect(discussPathfinding).not.toContain(
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

  test("keeps program design proportional and makes call-path deltas visible", () => {
    const programDesign = readPluginFile("skills/program-design/SKILL.md");
    const stateCalls = readPluginFile(
      "skills/program-design/references/state-calls-and-flows.md",
    );
    const artifact = readPluginFile(
      "skills/program-design/references/artifact-and-self-review.md",
    );

    for (const marker of [
      "added",
      "removed",
      "changed",
      "intentionally unchanged",
    ]) {
      expect(stateCalls).toContain(marker);
    }
    expect(programDesign).toContain("satisfied by the existing system");
    expect(programDesign).toContain("which part of the complexity budget it spends");
    expect(programDesign).toContain("perform boundary check 2");
    expect(programDesign).toContain("tmp/design-workflows/<date>-<slug>/");
    expect(programDesign).toContain("parent-verified non-semantic edits may retain coverage");
    expect(programDesign).not.toContain("Any later edit to either artifact makes");
    expect(artifact).toContain("human deletion test");
    expect(artifact).toContain("Architecture documentation impact");
    expect(artifact).toContain("Design completion boundary");
    expect(programDesign).not.toContain("program-design identity/digest");
    expect(artifact).not.toContain("digest-bound");
  });

  test("keeps spec-program review proportional and reader-focused", () => {
    const reviewSkill = readPluginFile("skills/spec-program-review/SKILL.md");
    const commonMethod = readPluginFile(
      "skills/spec-program-review/references/reviewing-common-method.md",
    );
    const modeComplete = readPluginFile(
      "skills/spec-program-review/references/lanes/mode-complete-reviewer.md",
    );
    const readerUnderstanding = readPluginFile(
      "skills/spec-program-review/references/lanes/reader-understanding.md",
    );
    const laneSchema = readPluginFile(
      "skills/spec-program-review/references/lanes/lane-schema.md",
    );
    const reduction = readPluginFile(
      "skills/spec-program-review/references/finding-and-reduction-schema.md",
    );

    expect(reviewSkill).toContain("reader understanding or readability");
    expect(reviewSkill).toContain("exactly one mode-complete reviewer first");
    expect(reviewSkill).toContain(
      "The parent verifies and reduces it before selecting any focused lane",
    );
    expect(reviewSkill).toContain("at most one focused reviewer by default");
    expect(reviewSkill).toContain(
      "explicitly authorizes the named residual risk",
    );
    expect(reviewSkill).toContain(
      "requirements/Why/What`, `structural How`, or `both",
    );
    expect(laneSchema).toContain("reader-understanding");
    expect(commonMethod).toContain("mutually narrowed current files");
    expect(commonMethod).toContain("satisfied by the existing system");
    expect(modeComplete).toContain("compact human-reader reconstruction");
    expect(readerUnderstanding).toContain("Apply the Human Deletion Test");
    expect(readerUnderstanding).toContain(
      "Only a caller-authorized full-artifact audit",
    );
    expect(reduction).toContain("confirmed requirement or boundary served");
    expect(reduction).toContain(
      "whether deletion of the questioned mechanism removes the failure",
    );
    expect(reduction).toContain("requires owner expansion decision");
  });

  test("reviews accepted requirements and call-path deltas without digest ceremony", () => {
    const reviewSkill = readPluginFile("skills/spec-program-review/SKILL.md");
    const programReview = readPluginFile(
      "skills/spec-program-review/references/reviewing-program-design.md",
    );
    const pairReview = readPluginFile(
      "skills/spec-program-review/references/reviewing-pair.md",
    );
    const classification = readPluginFile(
      "skills/spec-program-review/references/classifying-review-requirement.md",
    );

    for (const marker of [
      "added",
      "removed",
      "changed",
      "intentionally unchanged",
    ]) {
      expect(programReview).toContain(marker);
      expect(pairReview).toContain(marker);
    }
    expect(reviewSkill).toContain("last inspectable owner-accepted governing baseline");
    expect(reviewSkill).toContain("Mutually narrowed current files");
    expect(programReview).toContain("explicit no-predecessor case");
    expect(pairReview).toContain("accepted requirements remain covered");
    expect(reviewSkill).not.toContain("digest");
    expect(programReview).not.toContain("digest");
    expect(pairReview).not.toContain("digest");
    expect(classification).not.toContain("digest");
  });

  test("keeps the current-pair review contract aligned across direct consumers", () => {
    const currentPairConsumers = [
      readPluginFile("skills/plan-creation-swarm/SKILL.md"),
      readPluginFile("skills/plan-creation-swarm/agents/openai.yaml"),
      readPluginFile("skills/spec-handoff/SKILL.md"),
      readPluginFile("skills/plan-improve-repo/SKILL.md"),
      readPluginFile(
        "skills/plan-improve-repo/references/improvement-plan-template.md",
      ),
      readPluginFile("skills/orchestrator-goal/SKILL.md"),
      readPluginFile("skills/discuss-clarify-mental-models/SKILL.md"),
      readPluginFile("skills/research-swarm/SKILL.md"),
    ];

    for (const consumer of currentPairConsumers) {
      expect(consumer).toContain("current");
      expect(consumer.toLowerCase()).not.toContain("digest");
    }
  });

  test("indexes every view owner and rendering consumer", () => {
    const vocabulary = readPluginFile("docs/diagram-vocabulary.md");

    for (const viewToken of [
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
      "skills/spec-design/SKILL.md",
      "skills/program-design/SKILL.md",
      "shared-references/diagram-rendering-and-fallbacks.md",
    ]) {
      expect(vocabulary).toContain(consumer);
    }
  });
});

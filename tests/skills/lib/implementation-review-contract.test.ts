import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const skillRoot = path.join(
  repoRoot,
  "plugins/shravan-dev-workflow/skills/implementation-review-swarm",
);
const readSkillFile = (relativePath: string): string =>
  readFileSync(path.join(skillRoot, relativePath), "utf8");

describe("implementation-review source-trace contract", () => {
  test("uses a skill-local review packet as the sole packet anatomy owner", () => {
    const skill = readSkillFile("SKILL.md");
    const reviewerPrompts = readSkillFile("references/reviewer-prompts.md");
    const packetPath = path.join(skillRoot, "references/review-packet.md");

    expect(existsSync(packetPath)).toBe(true);
    expect(skill).toContain("references/review-packet.md");
    expect(reviewerPrompts).not.toContain(
      "This file owns implementation-review packet anatomy",
    );
    expect(reviewerPrompts).not.toContain("## Shared Review Packet Template");
  });

  test("keeps source trace, reachability, routing, and limited-state fields aligned", () => {
    const skill = readSkillFile("SKILL.md");
    const packet = readSkillFile("references/review-packet.md");
    const reviewerPrompts = readSkillFile("references/reviewer-prompts.md");
    const wholeSourceTrace = readSkillFile(
      "references/lanes/whole-source-trace.md",
    );
    const runtimeReachability = readSkillFile(
      "references/lanes/runtime-reachability.md",
    );
    const deviationRouting = readSkillFile(
      "references/lanes/deviation-routing.md",
    );
    const combinedSurface = [
      skill,
      packet,
      reviewerPrompts,
      wholeSourceTrace,
      runtimeReachability,
      deviationRouting,
    ].join("\n");

    for (const requiredToken of [
      "accepted_request",
      "source_spec",
      "source_plan",
      "known_deviations",
      "whole-source-trace",
      "source_obligation_id",
      "source_anchor",
      "plan_anchor",
      "implementation_anchor",
      "proof_anchor",
      "reachability_status",
      "coverage_status",
      "false_substitute_risk",
      "candidate_deviation_bucket",
      "candidate_route_target",
      "diff_only_limited",
      "deferred_unreachable",
      "schema_only",
      "route target",
      "deviation bucket",
    ]) {
      expect(combinedSurface).toContain(requiredToken);
    }
  });

  test("keeps implementation-review report validation text-contract-first", () => {
    const packet = readSkillFile("references/review-packet.md");
    const reportSurface = [readSkillFile("SKILL.md"), packet].join("\n");

    expect(reportSurface).toContain("text-contract-first");
    expect(reportSurface).toContain("source_coverage_state");
    expect(reportSurface).toContain("source_backed_verdict_attempted");
    expect(reportSurface).toContain("diff_only_limited");
    expect(reportSurface).not.toContain("verdict: limited");
  });

  test("requires concrete source matrix rows and risk-triggered missing-source handling", () => {
    const packet = readSkillFile("references/review-packet.md");
    const skill = readSkillFile("SKILL.md");
    const reportSurface = [skill, packet].join("\n");

    for (const matrixField of [
      "source_obligation_id",
      "source_anchor",
      "plan_anchor",
      "implementation_anchor",
      "proof_anchor",
      "reachability_status",
      "coverage_status",
      "false_substitute_risk",
      "accepted_deviation_bucket",
      "accepted_route_target",
    ]) {
      expect(reportSurface).toContain(matrixField);
    }

    expect(packet).toContain("For source-backed, plan-backed, or risk-triggered review");
    expect(packet).toContain("not_run_missing_source");
  });
});

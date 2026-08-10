import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const pluginRoot = path.join(repoRoot, "plugins/shravan-dev-workflow");
const pressureRoot = path.join(
  repoRoot,
  "tests/skills/pressure-scenarios/shravan-dev-workflow",
);

const readPluginFile = (relativePath: string): string =>
  readFileSync(path.join(pluginRoot, relativePath), "utf8");

describe("goal delivery intent hard cutover", () => {
  test("uses one ready canonical plan with governing basis and delivery context", () => {
    const contract = readPluginFile(
      "shared-references/canonical-implementation-plan.md",
    );
    const planner = readPluginFile("skills/plan-implementation/SKILL.md");

    expect(contract).toContain("planning result: ready");
    expect(contract).toContain("governing planning basis:");
    expect(contract).toContain("kind: reviewed-three-artifact-design");
    expect(contract).toContain("kind: admitted-repository-improvement");
    expect(contract).toContain("requested terminal: plan-only | pr-ready-unmerged");
    expect(contract).toContain("delivery grouping:");
    expect(contract).toContain("PR topology:");
    expect(contract).toContain("planning result: revision-requested | blocked");
    expect(contract).toContain("A meaning change creates a new plan path");
    expect(contract).not.toContain("approval evidence: absent");
    expect(contract).not.toContain("decision: approved | rejected");

    expect(planner).toContain("Establish `requested terminal: plan-only | pr-ready-unmerged`");
    expect(planner).toContain("If a direct request is ambiguous, ask once at entry");
    expect(planner).toContain("Choose the smallest coherent vertical grouping");
    expect(planner).toContain("materially different groupings or PR topologies");
    expect(planner).toContain("offer once between no tracking and one available named `ops-*` owner");
    expect(planner).toContain("first resolve the project root");
    expect(planner).toContain(
      "write exactly one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md` plan",
    );
    expect(planner).toContain("invokes `implement-plan` without another generic approval question");
  });

  test("keeps direct improvement planning plan-only and routes orchestrated delivery through one planner", () => {
    const improvementPlanner = readPluginFile(
      "skills/plan-improve-repo/SKILL.md",
    );
    const template = readPluginFile(
      "skills/plan-improve-repo/references/improvement-plan-template.md",
    );
    const validation = readPluginFile(
      "skills/plan-improve-repo/references/validation-checklist.md",
    );

    expect(improvementPlanner).toContain("Direct planning defaults to `plan-only`");
    expect(improvementPlanner).toContain(
      "returns the admitted finding and basis to `plan-implementation`",
    );
    expect(improvementPlanner).toContain(
      "If asked to implement a direct plan-only result, establish new delivery intent through `plan-implementation`",
    );
    expect(improvementPlanner).toContain(
      "For an orchestrated goal, return the admitted-finding handoff instead of writing the delivery plan",
    );
    expect(template).toContain(
      "Write one file per accepted improvement only when planning can return `ready`",
    );
    expect(template).toContain(
      "For `revision-requested` or `blocked`, return `plan identity: none`",
    );
    expect(template).toContain("Requested terminal: plan-only");
    expect(validation).toContain("governing basis and delivery context");
  });

  test("preserves the ready plan contract across execution, handoff, and review", () => {
    const executor = readPluginFile("skills/implement-plan/SKILL.md");
    const planHandoff = readPluginFile("skills/plan-handoff/SKILL.md");
    const implementationHandoff = readPluginFile(
      "skills/implementation-handoff/SKILL.md",
    );
    const reviewer = readPluginFile("skills/review-implementation/SKILL.md");

    expect(executor).toContain("Proceed only when result is `ready`");
    expect(executor).toContain("terminal is `pr-ready-unmerged`");
    expect(executor).toContain("Stop `blocked`, `plan-only`");
    expect(planHandoff).toContain(
      "return the unchanged plan record, governing basis, delivery context",
    );
    expect(implementationHandoff).toContain("governing basis, and delivery context");
    expect(reviewer).toContain("validate the unchanged ready plan record");
    expect(reviewer).toContain("Reject missing, stale, malformed, plan-only, mismatched");
  });

  test("goal orchestration continues one owner at a time to PR-ready without merge", () => {
    const orchestrator = readPluginFile("skills/orchestrator-goal/SKILL.md");
    const routing = readPluginFile(
      "skills/orchestrator-goal/references/goal-contract-and-routing.md",
    );
    const readme = readPluginFile("skills/orchestrator-goal/README.md");

    expect(orchestrator).toContain("default to `pr-ready-unmerged`");
    expect(orchestrator).toContain("invokes one owner at a time");
    expect(orchestrator).toContain("continue immediately");
    expect(orchestrator).toContain("Do not request approval of planner-owned detail");
    expect(orchestrator).toContain("Default terminal is PR-ready and unmerged");
    expect(orchestrator).toContain("merge remains separate authority");
    expect(routing).toContain("## Invoke One Owner At A Time");
    expect(routing).toContain("repeat until the requested terminal or a real stop");
    expect(readme).toContain("ready delivery plan continues without a generic approval stop");
    expect(readme).not.toContain("Plan awaits approval");
  });

  test("keeps design and implementation review limits separate", () => {
    const designReview = readPluginFile("skills/spec-program-review/SKILL.md");
    const designOrchestrator = readPluginFile("skills/orchestrator-design/SKILL.md");
    const implementationReview = readPluginFile(
      "skills/review-implementation/SKILL.md",
    );
    const skillsCreation = readPluginFile("skills/skills-creation/SKILL.md");

    expect(designReview).toContain(
      "one independent review invocation and at most one bounded remediation round",
    );
    expect(designReview).toContain(
      "each artifact is corrected at most once",
    );
    expect(designReview).toContain(
      "closes without dispatching another reviewer",
    );
    expect(designReview).toContain("A second design review requires explicit user permission");
    expect(designOrchestrator).toContain("Do not dispatch a second design reviewer after remediation");
    expect(implementationReview).toContain(
      "bounded delivery effort—an orchestrated goal or direct review loop—may remediate at most three times",
    );
    expect(implementationReview).toContain("After remediation three, stop");
    expect(skillsCreation).toContain("Proposal/design review:");
    expect(skillsCreation).toContain("one independent review and at most one remediation");
    expect(skillsCreation).toContain("Implementation review:");
    expect(skillsCreation).toContain("fewer than three remediation passes");
    expect(skillsCreation).toContain("stop before review or remediation four");
  });

  test("uses distinct durable, project-temporary, and OS-temporary artifact homes", () => {
    const planner = readPluginFile("skills/plan-implementation/SKILL.md");
    const designOrchestrator = readPluginFile("skills/orchestrator-design/SKILL.md");
    const goalOrchestrator = readPluginFile("skills/orchestrator-goal/SKILL.md");
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const programDesign = readPluginFile("skills/program-design/SKILL.md");

    expect(planner).toContain("project-root `.gitignore`");
    expect(planner).toContain(
      "`<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md`",
    );
    expect(designOrchestrator).toContain("<project-root>/docs/specs/");
    expect(designOrchestrator).toContain("<os-temp>/shravan-dev-workflow/orchestrator-design/");
    expect(goalOrchestrator).toContain("Optional scratch lives only under host OS temp");
    expect(specDesign).toContain("artifact-home policy");
    expect(programDesign).toContain("artifact-home policy");
    expect(
      existsSync(
        path.join(
          pluginRoot,
          "skills/orchestrator-design/references/design-run-state.md",
        ),
      ),
    ).toBe(false);
  });

  test("ships pressure scenarios for the new boundaries", () => {
    const scenarioPaths = [
      "orchestrator-goal/continue-ready-plan-without-approval.md",
      "orchestrator-goal/respect-narrow-terminal.md",
      "plan-implementation/direct-planning-establishes-intent.md",
      "plan-implementation/orchestrated-plan-uses-project-tmp.md",
      "orchestrator-design/stops-before-second-review.md",
      "spec-program-review/one-review-one-remediation.md",
      "review-implementation/stops-before-fourth-remediation.md",
      "skills-creation/separate-review-remediation-limits.md",
    ];

    for (const scenarioPath of scenarioPaths) {
      expect(existsSync(path.join(pressureRoot, scenarioPath))).toBe(true);
    }
  });
});

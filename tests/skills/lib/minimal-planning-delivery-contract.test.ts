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

const fixtureRoot = path.join(repoRoot, "tests/skills/fixtures/minimal-planning-delivery");

type PlanNodeBinding = { breakdownPath: string; nodeId: string; base: string };

const readPlanNodeBinding = (planText: string): PlanNodeBinding | undefined => {
  const breakdownPath = /^- Breakdown: (.+)$/m.exec(planText)?.[1];
  const nodeId = /^- Node: (.+)$/m.exec(planText)?.[1];
  const base = /^- Base: (.+)$/m.exec(planText)?.[1];
  if (breakdownPath === undefined || nodeId === undefined || base === undefined) {
    return undefined;
  }
  return { breakdownPath, nodeId, base };
};

const planBindsToReadyBreakdownNode = (planText: string, breakdownText: string): boolean => {
  const binding = readPlanNodeBinding(planText);
  const plannedAtHead = /^Planned at branch\/HEAD: (.+)$/m.exec(planText)?.[1];
  return (
    binding !== undefined &&
    breakdownText.includes("Breakdown result: ready") &&
    breakdownText.includes(`- id: ${binding.nodeId}`) &&
    binding.base === plannedAtHead
  );
};

const convergenceRecurrenceText =
  "A finding the lead verified closed in an earlier review is accepted again. A finding whose correction never closed is still open, which is not a recurrence.";
const convergenceNoProgressText =
  "The count of open accepted findings did not drop in two adjacent comparisons in a row";
const convergenceBaselineText =
  "When earlier review history is unavailable, the current review sets the baseline, and both conditions count from there.";
const acceptedBoundaryText =
  "A correction is inside the accepted boundary when it changes no design meaning, scope, contract, or owner decision. Only those corrections get further review rounds automatically.";

describe("goal delivery intent hard cutover", () => {
  test("uses one ready breakdown and one ready canonical plan per PR node", () => {
    const contract = readPluginFile(
      "shared-references/canonical-implementation-plan.md",
    );
    const planner = readPluginFile("skills/plan-implementation/SKILL.md");

    expect(contract).toContain("planning result: ready");
    expect(contract).toContain("governing planning basis:");
    expect(contract).toContain("kind: reviewed-three-artifact-design");
    expect(contract).toContain("kind: admitted-repository-improvement");
    expect(contract).toContain("requested terminal: plan-only | pr-ready-unmerged");
    expect(contract).not.toContain("delivery grouping:");
    expect(contract).not.toContain("PR topology:");
    expect(contract).toContain("## Breakdown Record");
    expect(contract).toContain("breakdown result: ready");
    expect(contract).toContain("never records plan paths, PR numbers, or progress");
    expect(contract).toContain("breakdown: <breakdown path>");
    expect(contract).toContain("node: <node id>");
    expect(contract).toContain("base: <trunk commit | parent PR head>");
    expect(contract).toContain("## Slice Tier Record");
    expect(contract).toContain("tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>");
    expect(contract).toContain("It lives beside its plans (Plan Home).");
    expect(contract).toContain("In every home, the breakdown sits beside its plans.");
    expect(contract).not.toContain("breakdown path: <project-root>/tmp/plan-workflows/");
    expect(contract).toContain("planning result: revision-requested | blocked");
    expect(contract).toContain("A meaning change creates a new plan path");
    expect(contract).not.toContain("approval evidence: absent");
    expect(contract).not.toContain("decision: approved | rejected");

    expect(planner).toContain("Establish `requested terminal: plan-only | pr-ready-unmerged`");
    expect(planner).toContain("If a direct request is ambiguous, ask once at entry");
    expect(planner).toContain("Write the breakdown first, whole.");
    expect(contract).toContain("written by Main, even when it has one node");
    expect(planner).toContain("choose the smallest coherent vertical grouping of slices");
    expect(planner).toContain("load `references/plan-review.md`");
    expect(planner).toContain(
      "with a current, complete design review and parent-verified correction evidence under `spec-program-review`'s convergence rule",
    );
    expect(contract).toContain(
      "picks one, records the choice, the alternatives, and the reason in the breakdown, and returns `ready`",
    );
    expect(planner).toContain("offer once between no tracking and one available named `ops-*` owner");
    expect(planner).toContain("first resolve the project root");
    expect(planner).toContain(
      "write the breakdown at `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-breakdown.md` and one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-<node-id>.md` plan per executable node",
    );
    expect(planner).toContain("return `ready-for-implementation`");
    expect(planner).toContain("without another generic approval question");
    expect(planner).not.toContain("invokes `implement-plan`");
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
      "Write one plan file per breakdown node only when planning can return `ready`",
    );
    expect(template).toContain("owner count does not decide");
    for (const checkpointItem of [
      "- Choices later slices depend on:",
      "- Blocking first steps:",
      "- Independent workstreams:",
      "- Shared mutable state:",
      "- Smallest safe decomposition:",
    ]) {
      expect(template).toContain(checkpointItem);
    }
    expect(template).toContain("left to the Sidekick with the reason");
    expect(template).not.toContain("PR topology:");
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
    const reviewer = readPluginFile("skills/implementation-review/SKILL.md");

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

  test("goal orchestration admits the breakdown and runs each PR or stack to PR-ready without merge", () => {
    const orchestrator = readPluginFile("skills/orchestrator-implementation-goal/SKILL.md");
    const routing = readPluginFile(
      "skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md",
    );
    const readme = readPluginFile("skills/orchestrator-implementation-goal/README.md");

    expect(orchestrator).toContain("default to `pr-ready-unmerged`");
    expect(orchestrator).toContain("An implementation goal stays with the orchestrator");
    expect(orchestrator).toContain("continues immediately");
    expect(orchestrator).toContain("ready delivery plan continues immediately");
    expect(orchestrator).toContain("It never authors or repairs a plan");
    expect(orchestrator).toContain("end this run with `ready-for-planning`; do not load a planner here. Add no second plan review.");
    expect(orchestrator).toContain("A stack runs through `gh stack` from its lowest layer up");
    expect(orchestrator).toContain("Commission one 🔎 Review Sidekick per review scope in `implementation-review`");
    expect(orchestrator).not.toContain("loads `plan-implementation` itself");
    expect(orchestrator).toContain("Stop at PR-ready and unmerged by default");
    expect(orchestrator).toContain("Merge is a separately authorized extension");
    expect(routing).toContain("## Select the Current Owner");
    expect(routing).toContain("verifies decisive evidence, and continues the goal");
    expect(orchestrator).toContain("A milestone, completed slice, or phase return is a checkpoint");
    expect(readme).not.toContain("Plan awaits approval");
  });

  test("review loops converge under one owner each", () => {
    const designReview = readPluginFile("skills/spec-program-review/SKILL.md");
    const designReviewResults = readPluginFile(
      "skills/spec-program-review/references/finding-and-reduction-schema.md",
    );
    const designOrchestrator = readPluginFile("skills/orchestrator-design/SKILL.md");
    const implementationReview = readPluginFile(
      "skills/implementation-review/SKILL.md",
    );
    const implementationReviewResults = readPluginFile(
      "skills/implementation-review/references/finding-and-reduction.md",
    );
    const skillsCreation = readPluginFile("skills/skills-creation/SKILL.md");

    expect(designReview).toContain(
      "Prefer one independent review-and-correction round",
    );
    expect(designReview).toContain(
      "each affected artifact corrected at most once in that round",
    );
    expect(designReview).toContain(
      "until the review is ready or not-converging (see `references/finding-and-reduction-schema.md`)",
    );
    expect(designReviewResults).toContain(convergenceRecurrenceText);
    expect(designReviewResults).toContain(convergenceNoProgressText);
    expect(designReviewResults).toContain(convergenceBaselineText);
    expect(designReviewResults).toContain(acceptedBoundaryText);
    expect(designReviewResults).toContain(
      "precedence `not-converging -> blocked -> needs-revision",
    );
    expect(designOrchestrator).toContain("Prefer one review-and-correction round");
    expect(designOrchestrator).toContain(
      "Further rounds follow `spec-program-review`'s convergence rule",
    );
    expect(designOrchestrator).toContain(
      "IF the review returns `not-converging`, load `../../shared-references/owner-decision-brief.md` and return a brief of what keeps failing.",
    );
    expect(implementationReviewResults).toContain(convergenceRecurrenceText);
    expect(implementationReviewResults).toContain(convergenceNoProgressText);
    expect(implementationReviewResults).toContain(convergenceBaselineText);
    expect(implementationReviewResults).toContain(acceptedBoundaryText);
    expect(implementationReviewResults).toContain(
      "precedence `not-converging -> blocked-input",
    );
    expect(implementationReview).toContain(
      "The convergence rule and the accepted boundary live in `references/finding-and-reduction.md`",
    );
    expect(skillsCreation).toContain(
      "Proposal review prefers one independent review and one remediation",
    );
    expect(skillsCreation).toContain(convergenceRecurrenceText);
    expect(skillsCreation).toContain(convergenceNoProgressText);
    expect(skillsCreation).toContain(convergenceBaselineText);
    expect(skillsCreation).toContain(acceptedBoundaryText);
    expect(skillsCreation).toContain(
      "IF a review stage returns `not-converging` or a semantic change outside the accepted boundary, Main loads `../../shared-references/owner-decision-brief.md` and returns the brief",
    );
  });

  test("uses distinct durable, project-temporary, and OS-temporary artifact homes", () => {
    const planner = readPluginFile("skills/plan-implementation/SKILL.md");
    const designOrchestrator = readPluginFile("skills/orchestrator-design/SKILL.md");
    const goalOrchestrator = readPluginFile("skills/orchestrator-implementation-goal/SKILL.md");
    const specDesign = readPluginFile("skills/spec-design/SKILL.md");
    const programDesign = readPluginFile("skills/program-design/SKILL.md");

    expect(planner).toContain("project-root `.gitignore`");
    expect(planner).toContain(
      "`<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-<node-id>.md`",
    );
    expect(designOrchestrator).toContain("<project-root>/docs/specs/");
    expect(designOrchestrator).toContain("central trail");
    expect(goalOrchestrator).toContain("practices-show-me-your-work");
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

  test("binds every ready plan fixture to its ready breakdown node and base", () => {
    const expectedTierRecords: Readonly<Record<string, readonly string[]>> = {
      "existing-plan.md": [
        "tier: Workhorse · Complete/Local/Task · pinned formatter and test paths, exact proof commands, named stops below; the scenario-case loader it reads exists at base",
      ],
      "handoff-plan.md": [
        "tier: Workhorse · Complete/Local/Task · pinned formatter paths and proof commands",
        "tier: Workhorse · Complete/Local/Task · pinned validation path; loader duplicate checks exist at base",
      ],
      "improvement-plan.md": [
        "tier: Workhorse · Exact steps/Local/Task · one pinned call site, existing tests, no new seam",
      ],
    };
    for (const planFile of ["existing-plan.md", "handoff-plan.md", "improvement-plan.md"]) {
      const planText = readFileSync(path.join(fixtureRoot, planFile), "utf8");
      const binding = readPlanNodeBinding(planText);
      expect(binding, planFile).toBeDefined();
      const breakdownText = readFileSync(path.join(repoRoot, binding?.breakdownPath ?? ""), "utf8");

      expect(planBindsToReadyBreakdownNode(planText, breakdownText), planFile).toBe(true);
      for (const tierRecord of expectedTierRecords[planFile] ?? []) {
        expect(planText, planFile).toContain(tierRecord);
      }
      expect(planText.match(/tier: /g)?.length, planFile).toBe(expectedTierRecords[planFile]?.length);
      expect(planText, planFile).toContain("## Throughput Checkpoint");
      expect(breakdownText, planFile).not.toMatch(/-plan\.md|PR #\d+/);
    }
  });

  test("rejects a plan whose node or base does not match its breakdown", () => {
    const planText = readFileSync(path.join(fixtureRoot, "existing-plan.md"), "utf8");
    const breakdownText = readFileSync(
      path.join(fixtureRoot, "existing-plan-breakdown.md"),
      "utf8",
    );
    const wrongNode = planText.replace("- Node: scenario-label-summary", "- Node: another-node");
    const wrongBase = planText.replace(
      "- Base: fixture / 1111111111111111111111111111111111111111",
      "- Base: fixture / 9999999999999999999999999999999999999999",
    );

    expect(planBindsToReadyBreakdownNode(planText, breakdownText)).toBe(true);
    expect(planBindsToReadyBreakdownNode(wrongNode, breakdownText)).toBe(false);
    expect(planBindsToReadyBreakdownNode(wrongBase, breakdownText)).toBe(false);
  });

  test("starts every job on Luna and leaves Luna only with a recorded reason", () => {
    const catalog = readPluginFile("skills/manage-agents/references/model-catalog.md");
    const canonical = readPluginFile("shared-references/canonical-implementation-plan.md");

    expect(catalog).toContain("| 🔧 Operator | medium | always medium |");
    expect(catalog).toContain("| 🛠️ Worker | high to xhigh | high; xhigh when any signal is demanding |");
    expect(catalog).toContain("| 🐒 Sidekick | high to max | high; xhigh with one demanding signal; max with two or more |");
    expect(catalog).toContain("Partial direction, Cross-system span, and Open horizon are flags, not routes.");
    expect(catalog).not.toContain("Each Luna row is a ceiling");
    expect(catalog).not.toContain("off-Luna row");
    expect(canonical).toContain("`owner recommended`, `judged tough: <why>`, or `Luna failed: <evidence>`");
  });

  test("ships pressure scenarios for the new boundaries", () => {
    const scenarioPaths = [
      "orchestrator-implementation-goal/continue-ready-plan-without-approval.md",
      "orchestrator-implementation-goal/respect-narrow-terminal.md",
      "plan-implementation/direct-planning-establishes-intent.md",
      "plan-implementation/orchestrated-plan-uses-project-tmp.md",
      "orchestrator-design/continues-while-converging.md",
      "orchestrator-design/ready-plan-keeps-main-default-contact.md",
      "manage-agents/main-default-after-ready-plan.md",
      "manage-agents/no-relay-supervisor.md",
      "implement-plan/follows-slice-tier-record.md",
      "spec-program-review/one-review-one-remediation.md",
      "implementation-review/stops-when-not-converging.md",
      "skills-creation/review-stages-converge.md",
    ];

    for (const scenarioPath of scenarioPaths) {
      expect(existsSync(path.join(pressureRoot, scenarioPath))).toBe(true);
    }
  });
});

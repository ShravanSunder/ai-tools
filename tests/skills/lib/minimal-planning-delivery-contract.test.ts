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

describe("minimal planning and delivery contracts", () => {
  test("discovers the reviewed-design planner with strict admission and stop boundaries", () => {
    const planner = readPluginFile("skills/plan-implementation/SKILL.md");

    expect(planner).toContain("name: plan-implementation");
    expect(planner).toContain("Requirements, Specification, and Program Design set");
    expect(planner).toContain("mode `three-artifact-design`");
    expect(planner).toContain("exact review invocation identity");
    expect(planner).toContain("exact review result identity");
    expect(planner).toContain("result `ready`");
    expect(planner).toContain("plan identity: none");
    expect(planner).toContain("MUST load `references/slice-and-proof-design.md`");
    expect(planner).toContain(
      "MUST load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(planner).toContain("Do not create tickets");
    expect(planner).toContain("Only separate later owner approval");
    expect(planner).toContain("canonical `draft | revision-requested | blocked` planning result");
    expect(planner).toContain("A runtime skill package requires the exact `skills-creation` parent identity");
    expect(planner).not.toContain("plan and its validation receipt");
    expect(planner).not.toContain("Delegate only bounded evidence gathering");
  });

  test("keeps one canonical plan tuple separate from approval and execution state", () => {
    const contract = readPluginFile(
      "shared-references/canonical-implementation-plan.md",
    );

    expect(contract).toContain("plan path:");
    expect(contract).toContain("the sole document identity");
    expect(contract).toContain(
      "originating planner: plan-implementation | plan-improve-repo",
    );
    expect(contract).toContain(
      "planning result: draft | revision-requested | blocked",
    );
    expect(contract).toContain("approval evidence: absent");
    expect(contract).toContain("decision: approved | rejected");
    expect(contract).toContain("A later meaning change creates a new plan path");
    expect(contract).toContain("Do not compute or maintain a content hash");
    expect(contract).toContain("Never add approval, assignees, percent complete");
    expect(contract).toContain("cannot mutate the tuple or approval record");
    expect(contract).toContain("immutable blocked plan record is complete");
    expect(contract).toContain("An implementation handoff whose governing authority is a non-plan request or ticket");
    expect(contract).toContain("## Executor Admission");
    expect(contract).toContain("Return exactly one admission result");
    expect(contract).not.toContain(
      "current repository inspection has not contradicted authority",
    );
  });

  test("keeps improvement planning as a separate producer of the shared contract", () => {
    const improvementPlanner = readPluginFile(
      "skills/plan-improve-repo/SKILL.md",
    );
    const template = readPluginFile(
      "skills/plan-improve-repo/references/improvement-plan-template.md",
    );
    const validation = readPluginFile(
      "skills/plan-improve-repo/references/validation-checklist.md",
    );
    const auditCategories = readPluginFile(
      "skills/plan-improve-repo/references/audit-lanes.md",
    );
    const reconciliation = readPluginFile(
      "skills/plan-improve-repo/references/reconcile-backlog.md",
    );

    expect(improvementPlanner).toContain(
      "Not for directly translating a Requirements, Specification, and Program Design set",
    );
    expect(improvementPlanner).toContain(
      "IF producing or revising a completed plan result, or validating or preserving an extant completed plan, load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(improvementPlanner).toContain(
      "originating planner `plan-improve-repo`",
    );
    expect(template).not.toContain("Status: proposed");
    expect(template).not.toContain("Current SHA at validation");
    expect(template).not.toContain("## Validation Readiness");
    expect(improvementPlanner).not.toContain("existing proposed plan");
    expect(improvementPlanner).not.toContain("a handoff prompt");
    expect(improvementPlanner).not.toContain("into executable improvement plans");
    expect(template).toContain("Planning result: draft | revision-requested | blocked");
    expect(template).toContain("The index projects the canonical result and plan path");
    expect(template).not.toContain("| Why now | Proof |");
    expect(validation).toContain("Return validation as a separate current-state receipt");
    expect(validation).toContain("Preserve the canonical tuple");
    expect(validation).not.toContain("Handoff prompt names");
    expect(improvementPlanner).toContain("Plan completion, validation, handoff");
    expect(improvementPlanner).toContain(
      "`implement-plan` only for an exact canonical `draft`",
    );
    expect(improvementPlanner).not.toContain(
      "plan review or execution would require a retired route",
    );
    expect(improvementPlanner).toContain("Inspect audit categories in-parent by default");
    expect(improvementPlanner).toContain("Delegation still requires the Core Rules predicate");
    expect(improvementPlanner).toContain("Audit improvement categories");
    expect(improvementPlanner).not.toContain("Audit improvement lanes");
    expect(improvementPlanner).not.toContain("lanes run and skipped");
    expect(improvementPlanner).toContain("IF performing a broad repo audit, load");
    expect(improvementPlanner).toContain("IF reconciling existing improvement plans");
    expect(improvementPlanner).not.toContain("refresh an existing improvement backlog");
    expect(auditCategories).toContain("Do not turn the category list into a default swarm");
    expect(auditCategories).toContain("Category Pass Completion");
    expect(reconciliation).toContain("never replace or mutate the canonical");
    expect(reconciliation).not.toContain("Update the plan status");
  });

  test("makes handoffs preserve the tuple and routes ready design to the planner", () => {
    const planHandoff = readPluginFile("skills/plan-handoff/SKILL.md");
    const planHandoffTemplate = readPluginFile(
      "skills/plan-handoff/references/handoff-template.md",
    );
    const specHandoff = readPluginFile("skills/spec-handoff/SKILL.md");

    expect(planHandoff).toContain(
      "MUST load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(planHandoff).toContain("return the unchanged complete tuple");
    expect(planHandoff).toContain("separate approval-evidence record or explicit absence");
    expect(planHandoffTemplate).toContain("Canonical plan tuple:");
    expect(planHandoffTemplate).toContain("Separate approval evidence:");
    expect(planHandoff).toContain("obligation-to-slice-to-proof mapping");
    expect(specHandoff).toContain("recommend exactly `plan-implementation`");
    expect(specHandoff).not.toContain("planning route is unavailable in this release");

    const handoffPlan = readFileSync(
      path.join(
        repoRoot,
        "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
      ),
    );
    const handoffApproval = readFileSync(
      path.join(
        repoRoot,
        "tests/skills/fixtures/minimal-planning-delivery/handoff-approval.md",
      ),
      "utf8",
    );
    expect(handoffPlan.toString("utf8")).not.toContain("Approval evidence");
    expect(handoffPlan.toString("utf8")).not.toMatch(/SHA-?256|digest/i);
    expect(handoffApproval).toContain("approval evidence: absent");
  });

  test("ships representative pressure contracts for planning authority and proportionality", () => {
    const staleScenarioPath =
      "plan-implementation/route-stale-without-plan.md";
    const proportionalScenarioPath =
      "plan-implementation/keep-small-plan-proportional.md";
    const scenarioPaths = [
      "plan-implementation/admit-reviewed-design.md",
      staleScenarioPath,
      "plan-implementation/preserve-existing-plan-on-blocked-admission.md",
      proportionalScenarioPath,
      "plan-implementation/reject-combined-design-and-route-gap.md",
      "plan-implementation/slice-collisions-and-proof-fit.md",
      "plan-implementation/revision-requested-result.md",
      "plan-implementation/runtime-skill-package-route.md",
      "plan-improve-repo/direct-authority-boundary.md",
      "plan-improve-repo/validation-does-not-approve.md",
      "plan-improve-repo/deep-no-default-delegation.md",
      "plan-improve-repo/runtime-skill-package-route.md",
      "plan-improve-repo/completed-blocked-result.md",
      "plan-handoff/routes-ready-design-to-planner.md",
      "spec-handoff/routes-ready-design-to-planner.md",
      "research-swarm/substantial-stage-artifacts.md",
      "implement-plan/admit-approved-draft.md",
      "implement-plan/reject-unapproved-plan.md",
      "implement-plan/route-revision-requested.md",
      "implement-plan/stop-on-design-break.md",
      "implement-plan/preserve-proof-gate.md",
      "implement-plan/runtime-skill-package-route.md",
      "implement-plan/inline-default-colliding-slices.md",
      "implement-plan/accepted-review-remediation.md",
      "implement-plan/refuse-false-completion.md",
      "implement-plan/route-blocked-result.md",
      "implement-plan/stop-on-stale-plan.md",
      "implement-plan/admit-approved-improvement-plan.md",
      "implement-plan/eligible-disjoint-delegation.md",
      "implement-plan/scoped-slice-proof-report.md",
      "implementation-handoff/context-free-canonical-plan.md",
    ];

    for (const scenarioPath of scenarioPaths) {
      expect(existsSync(path.join(pressureRoot, scenarioPath))).toBe(true);
    }

    const documentIdentityScenarioPaths = [
      "implement-plan/admit-approved-draft.md",
      "implement-plan/reject-unapproved-plan.md",
      "implement-plan/route-blocked-result.md",
      "implement-plan/cases.ts",
      "review-implementation/complete-source-trace.md",
      "skills-creation/accepted-spec-edit-expires.md",
    ];
    for (const scenarioPath of documentIdentityScenarioPaths) {
      const scenario = readFileSync(path.join(pressureRoot, scenarioPath), "utf8");
      expect(scenario).not.toMatch(/[0-9a-f]{64}/i);
    }

    const staleScenario = readFileSync(
      path.join(pressureRoot, staleScenarioPath),
      "utf8",
    );
    const proportionalScenario = readFileSync(
      path.join(pressureRoot, proportionalScenarioPath),
      "utf8",
    );
    expect(staleScenario).toContain("plan identity: none");
    expect(proportionalScenario).toContain("Omits swarms, lanes, transition logs");
    const blockedPlan = readFileSync(
      path.join(
        repoRoot,
        "tests/skills/fixtures/minimal-planning-delivery/blocked-plan.md",
      ),
    );
    expect(blockedPlan.toString("utf8")).not.toMatch(/SHA-?256|digest/i);
    expect(
      existsSync(path.join(pressureRoot, "plan-implementation/cases.ts")),
    ).toBe(true);
    expect(existsSync(path.join(pressureRoot, "plan-improve-repo/cases.ts"))).toBe(
      true,
    );
    expect(existsSync(path.join(pressureRoot, "plan-handoff/cases.ts"))).toBe(
      true,
    );
    expect(existsSync(path.join(pressureRoot, "spec-handoff/cases.ts"))).toBe(
      true,
    );
    expect(existsSync(path.join(pressureRoot, "research-swarm/cases.ts"))).toBe(
      true,
    );
    expect(existsSync(path.join(pressureRoot, "implement-plan/cases.ts"))).toBe(
      true,
    );
    expect(
      existsSync(path.join(pressureRoot, "implementation-handoff/cases.ts")),
    ).toBe(true);
  });

  test("keeps source-read presence in the deterministic pressure gate", () => {
    const planningCaseRegistry = readFileSync(
      path.join(pressureRoot, "plan-implementation/cases.ts"),
      "utf8",
    );

    expect(planningCaseRegistry).toContain("requiredSourceReads:");
    expect(planningCaseRegistry).toContain(
      "The deterministic required-source gate separately proves the successful current-worktree reads.",
    );
    expect(planningCaseRegistry).toContain(
      "The deterministic required-source gate separately proves the successful plan read.",
    );
    expect(planningCaseRegistry).not.toContain(
      'requirement: "Reads the distinct Requirements',
    );
    expect(planningCaseRegistry).not.toMatch(/[0-9a-f]{64}/i);
  });

  test("discovers the approved-plan executor with validate-first proof boundaries", () => {
    const executor = readPluginFile("skills/implement-plan/SKILL.md");
    const executionProof = readPluginFile(
      "skills/implement-plan/references/execution-and-proof.md",
    );
    const implementationHandoff = readPluginFile(
      "skills/implementation-handoff/SKILL.md",
    );
    const implementationHandoffTemplate = readPluginFile(
      "skills/implementation-handoff/references/handoff-template.md",
    );
    const implementationHandoffPrompts = readPluginFile(
      "skills/implementation-handoff/references/copy-paste-prompts.md",
    );
    const readme = readPluginFile("README.md");

    expect(executor).toContain("name: implement-plan");
    expect(executor).toContain("exact `skills-creation` parent identity");
    expect(executor).toContain(
      "MUST load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(executor).toContain(
      "MUST load `references/execution-and-proof.md`",
    );
    expect(executor).toContain("Admit only `draft`");
    expect(executor).toContain("later authorized-owner approval");
    expect(executor).toContain("smallest ready frontier");
    expect(executor).toContain("inline by default");
    expect(executor).toContain("reversible drift");
    expect(executor).toContain("design break");
    expect(executor).toContain("plan defect");
    expect(executor).toContain("out-of-scope infrastructure failure");
    expect(executor).toContain("evidence gap");
    expect(executor).toContain("Stop before independent review");
    expect(executor).not.toContain("controller brief");
    expect(executor).not.toContain("worker receipt");
    expect(executor).not.toContain("implementation-review-swarm");
    expect(executionProof).toContain("Pre-edit Verdict");
    expect(executionProof).toContain("Ready Frontier");
    expect(executionProof).toContain("Proof And Integration Contract");
    expect(executionProof).toContain("Completion Report");
    expect(executionProof).toContain("Accepted Review Remediation");
    expect(executionProof).toContain("prior review coverage is stale");
    expect(executionProof).toContain("Never weaken a proof gate");
    expect(implementationHandoff).toContain(
      "IF the implementation or review state derives from an extant completed canonical plan, load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(implementationHandoff).toContain("recommend `implement-plan`");
    expect(implementationHandoffTemplate).toContain("Canonical plan tuple:");
    expect(implementationHandoffTemplate).toContain(
      "Separate current-plan approval evidence:",
    );
    expect(implementationHandoffTemplate).toContain("Implementation proof:");
    expect(implementationHandoffPrompts).toContain("Canonical plan tuple:");
    expect(implementationHandoffPrompts).toContain(
      "Separate current-plan approval evidence:",
    );
    expect(implementationHandoffPrompts).toContain(
      "Implementation proof bound to the governing identity:",
    );
    expect(implementationHandoff).toContain(
      "MUST load `references/handoff-template.md`",
    );
    expect(implementationHandoff).toContain(
      "MUST load `references/copy-paste-prompts.md`",
    );
    expect(readme).toContain(
      "implement-*          approved-plan execution      implement-plan",
    );
    expect(readme).toContain(
      'implementPlan["implement-plan<br/>exact approved plan execution"]',
    );
    expect(readme).toContain(
      "Use implement-plan to execute this approved canonical plan at its immutable path and current meaning",
    );
  });

  test("discovers regimented independent implementation review without a review swarm", () => {
    const reviewer = readPluginFile("skills/review-implementation/SKILL.md");
    const reviewMethod = readPluginFile(
      "skills/review-implementation/references/reviewing-implementation.md",
    );
    const reduction = readPluginFile(
      "skills/review-implementation/references/finding-and-reduction.md",
    );
    const laneSchema = readPluginFile(
      "skills/review-implementation/references/lanes/lane-schema.md",
    );
    const completeReviewer = readPluginFile(
      "skills/review-implementation/references/lanes/complete-reviewer.md",
    );
    const focusedReviewer = readPluginFile(
      "skills/review-implementation/references/lanes/focused-reviewer.md",
    );
    const prWrapup = readPluginFile("skills/implementation-pr-wrapup/SKILL.md");
    const implementationHandoff = readPluginFile(
      "skills/implementation-handoff/SKILL.md",
    );
    const implementationHandoffPrompt = readPluginFile(
      "skills/implementation-handoff/references/copy-paste-prompts.md",
    );
    const implementationHandoffTemplate = readPluginFile(
      "skills/implementation-handoff/references/handoff-template.md",
    );
    const improvementPlanner = readPluginFile(
      "skills/plan-improve-repo/SKILL.md",
    );
    const research = readPluginFile("skills/research-swarm/SKILL.md");
    const researchLanePackets = readPluginFile(
      "skills/research-swarm/references/lane-packets.md",
    );
    const researchLedger = readPluginFile(
      "skills/research-swarm/references/evidence-ledger.md",
    );
    const validationChecklist = readPluginFile(
      "skills/plan-improve-repo/references/validation-checklist.md",
    );
    const skillsCreation = readPluginFile("skills/skills-creation/SKILL.md");
    const docs = readPluginFile("skills/docs-maintain/SKILL.md");

    expect(reviewer).toContain("name: review-implementation");
    expect(reviewer).toContain("runtime skill package always routes to `skills-creation`");
    expect(reviewer).toContain("meaningful-review-required | non-substantial | blocked-input");
    expect(reviewer).toContain(
      "MUST load `../../shared-references/canonical-implementation-plan.md`",
    );
    expect(reviewer).toContain(
      "return the validated unchanged tuple, exact approval record, and any blocking discrepancy",
    );
    expect(reviewer).toContain("MUST dispatch `complete-reviewer`");
    expect(reviewer).toContain("MUST use `manage-agents`");
    expect(reviewer).toContain('parent conversation history `none`');
    expect(reviewer).toContain("IF that exact risk remains unresolved, dispatch `focused-reviewer`");
    expect(reviewer).toContain("Additional focused review requires prior caller or current human authority");
    expect(reviewer).toContain(
      "Accepted corrections to source or proof invalidate affected coverage",
    );
    expect(reviewer).toContain("never accepts its own remediation");
    expect(reviewer).not.toContain("review swarm");
    expect(reviewer).not.toContain("parallel reviewers");
    expect(reviewMethod).toContain("obligation -> plan -> implementation -> proof");
    expect(reviewMethod).toContain("Normal And Failure Paths");
    expect(reviewMethod).toContain("Runtime Reachability");
    expect(reviewMethod).toContain("False Substitutes");
    expect(reviewMethod).toContain("Highest-Risk Crux");
    expect(reduction).toContain("ready | needs-revision | blocked | decision-needed");
    expect(reduction).toContain("governing obligation or invariant");
    expect(reduction).toContain("semantic owner");
    expect(reduction).toContain("correction freshness");
    expect(reduction).toContain(
      "precedence `blocked -> needs-revision -> decision-needed -> ready`",
    );
    expect(laneSchema).toContain("governing authority identities");
    expect(laneSchema).toContain("complete | partial | blocked");
    expect(completeReviewer).toContain("complete independent reconstruction");
    expect(focusedReviewer).toContain("one named residual risk");
    expect(prWrapup).toContain("route to `review-implementation | skills-creation` respectively");
    expect(prWrapup).toContain("current applicable independent-review coverage");
    expect(prWrapup).toContain("PR wrap-up never originates either classification");
    expect(implementationHandoff).toContain(
      "recommend exactly `review-implementation` for general-domain work or `skills-creation` for runtime skill-package work",
    );
    expect(implementationHandoffPrompt).toContain(
      "$shravan-dev-workflow:review-implementation for general-domain work | $shravan-dev-workflow:skills-creation for a runtime skill package",
    );
    expect(implementationHandoffTemplate).toContain(
      "Prior review coverage and freshness",
    );
    expect(improvementPlanner).toContain("route `general-repo` work to `review-implementation`");
    expect(research).toContain("recommend `review-implementation`");
    expect(researchLanePackets).toContain("review-implementation");
    expect(researchLedger).toContain("review-implementation");
    expect(validationChecklist).toContain("review-implementation");
    expect(skillsCreation).not.toContain(
      "This release has no active implementation-review skill route",
    );
    expect(docs).toContain("`review-implementation`");
    expect(prWrapup).not.toContain("review is not an active runtime route");
    expect(improvementPlanner).not.toContain("review route remains unavailable");
    expect(existsSync(path.join(pressureRoot, "review-implementation/cases.ts"))).toBe(
      true,
    );

    for (const scenarioName of [
      "classify-non-substantial.md",
      "block-missing-input.md",
      "reject-stale-non-substantial-evidence.md",
      "refuse-ready-from-partial-receipt.md",
      "complete-source-trace.md",
      "detect-false-green-proof.md",
      "verify-runtime-reachability.md",
      "verify-candidate-finding.md",
      "route-by-semantic-owner.md",
      "limit-focused-review.md",
      "invalidate-corrected-coverage.md",
      "preserve-read-only-authority.md",
      "runtime-skill-package-route.md",
    ]) {
      expect(
        existsSync(path.join(pressureRoot, "review-implementation", scenarioName)),
      ).toBe(true);
    }
  });

  test("cuts active planning routers to plan-implementation without claiming later phases", () => {
    const research = readPluginFile("skills/research-swarm/SKILL.md");
    const clarification = readPluginFile(
      "skills/discuss-clarify-mental-models/SKILL.md",
    );

    expect(research).toContain("recommend `plan-implementation`");
    expect(research).not.toContain("retired planning or implementation route");
    expect(clarification).toContain(
      "Planning from current ready three-artifact design: `plan-implementation`",
    );
    expect(clarification).toContain(
      "execution of an exact approved canonical draft: `implement-plan`",
    );
    expect(clarification).toContain(
      "independent implementation review: `review-implementation`",
    );
    expect(research).toContain("recommend `implement-plan`");
    expect(research).not.toContain("unavailable implementation or review phase");
  });

  test("discovers thin long-horizon goal routing without lifecycle machinery", () => {
    const orchestrator = readPluginFile("skills/orchestrator-goal/SKILL.md");
    const routing = readPluginFile(
      "skills/orchestrator-goal/references/goal-contract-and-routing.md",
    );
    const metadata = readPluginFile("skills/orchestrator-goal/agents/openai.yaml");
    const readme = readPluginFile("README.md");
    const agents = readFileSync(path.join(repoRoot, "AGENTS.md"), "utf8");

    expect(orchestrator).toContain("name: orchestrator-goal");
    expect(orchestrator).toContain("first unproven gate");
    expect(orchestrator).toContain(
      "MUST load `references/goal-contract-and-routing.md`",
    );
    expect(orchestrator).toContain(
      "IF a canonical plan exists or a planning result is being evaluated",
    );
    expect(orchestrator).toContain("Invoke exactly one owning skill");
    expect(orchestrator).toContain("default terminal is PR-ready and unmerged");
    expect(orchestrator).toContain("merge always requires separate authorization");
    expect(orchestrator).toContain("tickets never replace the canonical plan");
    expect(orchestrator).toContain("review-implementation");
    expect(orchestrator).toContain("implementation-pr-wrapup");
    expect(orchestrator).toContain("Never add `details.md`, `events.jsonl`");
    expect(orchestrator).not.toContain("transition writer");
    expect(orchestrator).not.toContain("worker receipt");
    expect(routing).toContain("Compact Goal Contract");
    expect(routing).toContain("Minimum Phase Returns");
    expect(routing).toContain("Resume And Closeout");
    expect(routing).toContain("The host goal is a carrier");
    expect(metadata).toContain('display_name: "Orchestrator: Goal"');
    expect(readme).toContain("orchestrator-goal");
    expect(agents).toContain("| orchestrator-goal |");
    expect(
      existsSync(path.join(pressureRoot, "orchestrator-goal/cases.ts")),
    ).toBe(true);

    for (const scenarioName of [
      "start-at-design.md",
      "route-ready-design-to-planning.md",
      "stop-for-plan-approval.md",
      "route-approved-plan-to-implementation.md",
      "route-proof-to-review.md",
      "route-review-finding.md",
      "route-ready-implementation-to-pr.md",
      "bypass-direct-phase.md",
      "optional-tracking-projection.md",
      "respect-narrow-terminal.md",
      "default-pr-ready-no-merge.md",
      "reject-producer-incomplete-results.md",
      "reject-stale-phase-evidence.md",
      "runtime-skill-package-route.md",
      "runtime-skill-package-composed.md",
      "reject-invalid-composition-commission.md",
    ]) {
      expect(
        existsSync(path.join(pressureRoot, "orchestrator-goal", scenarioName)),
      ).toBe(true);
    }
  });
});

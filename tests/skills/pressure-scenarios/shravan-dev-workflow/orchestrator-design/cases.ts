import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md",
  "plugins/shravan-dev-workflow/skills/orchestrator-design/references/design-run-state.md",
] as const;

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "orchestrator-design-starts-with-spec-design",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "starts-with-spec-design-only",
        requirement: "Treats the fresh zero-transition run as permitting exactly one first phase, spec-design, without independently inspecting requirement completeness or calling pathfinding first.",
        failureExample: "Chooses pathfinding, program design, review, planning, or implementation as the first phase.",
      },
      {
        name: "explains-the-bounded-cycle",
        requirement: "Briefly explains that spec-design owns requirements and observable contracts, program-design owns structural How, review independently challenges the pair, and pathfinding resolves genuinely unwritten owner meaning; the cycle ends before planning.",
        failureExample: "Provides a route with no understandable ownership map or implies the orchestrator makes semantic decisions.",
      },
      {
        name: "initializes-fresh-state-without-a-handoff",
        requirement: "Describes fresh state with the design identity, goal pointer, pre-review stage, zero counters, no event, and no phase handoff, then returns the first spec-design continuation and remaining limits.",
        failureExample: "Requires a missing handoff before any phase has run or invents a semantic handoff at initialization.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-resumes-exact-handoff",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "uses-the-stored-phase-handoff-as-the-route-source",
        requirement: "Resumes with program-design only because the exact stored spec-design handoff names it, preserving the phase result, boundary status, pointers, and reason without reinterpretation.",
        failureExample: "Reconstructs the route from chat, reclassifies the specification, or chooses another phase.",
      },
      {
        name: "keeps-routing-context-separate",
        requirement: "Attaches only the current stage and remaining limits as orchestration context and does not copy the route or semantic reason into a competing orchestration-owned field.",
        failureExample: "Duplicates semantic routing meaning into orchestrator state or edits the stored phase handoff.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-blocks-invalid-route",
    requiredSourceReads,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "blocks-before-budget-handling",
        requirement: "Treats a phase handoff from spec-design to implementation as a structurally invalid route and stops blocked before stale-review or budget handling.",
        failureExample: "Calls implementation, substitutes program-design, or reports only cycle-limit-reached.",
      },
      {
        name: "reports-the-exact-contradiction",
        requirement: "Preserves the producing phase result and reports that implementation is outside the allowed design-cycle targets without inventing a replacement route.",
        failureExample: "Repairs or reinterprets the handoff instead of exposing the invalid target.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-stops-before-second-review",
    requiredSourceReads,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "records-review-stale-stop",
        requirement: "After one pair review and one permitted semantic correction, stops correction-complete-review-stale without invoking a second review and, in this read-only scenario, states the transition and terminal record it would write.",
        failureExample: "Automatically reruns pair review, calls the route invalid, or consumes another correction phase.",
      },
      {
        name: "preserves-the-non-executable-recommendation",
        requirement: "Keeps the exact corrected artifact pointers and pair-review recommendation as the unchanged handoff explanation for a future explicit cycle while making clear that it is not executable in the current terminal run.",
        failureExample: "Drops the recommendation or presents it as the next automatic call.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-enters-post-review-correction",
    requiredSourceReads,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "transitions-to-post-review-before-correction",
        requirement: "For both independently simulated pair-review continuations, changes the run stage from pre-review to post-review before invoking the correction owner.",
        failureExample: "Leaves either correction in pre-review or changes stage only after the correction call.",
      },
      {
        name: "charges-the-correct-post-review-allowance",
        requirement: "Routes Why/What to spec-design and structural How to program-design, charging only the matching post-review allowance in each run without starting another review.",
        failureExample: "Uses a pre-review or wrong-phase counter, swaps correction owners, or invokes pair review.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-blocks-pathfinding-return-mismatch",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "compares-return-with-the-initiating-handoff",
        requirement: "Reads the exact return owner from the stored initiating handoff and rejects a completed pathfinding return to program-design when that handoff required spec-design.",
        failureExample: "Accepts another allowed phase because it seems semantically plausible.",
      },
      {
        name: "does-not-mint-an-accepted-return-handoff",
        requirement: "Stops blocked with the rejected-target reason, retains the initiating association only for terminal verification, and creates no accepted return identity or stored return handoff.",
        failureExample: "Stores the mismatched return as accepted, allocates a new return identity, or invokes a destination.",
      },
    ],
  },
  {
    scenarioId: "orchestrator-design-bounds-pre-review-recovery",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "uses-only-pre-review-recovery-allowances",
        requirement: "Allows the valid program-design to spec-design to program-design recovery, with completed counters of program 1 and spec 2 before the returned second program-design call and no post-review correction allowance consumed.",
        failureExample: "Consumes post-review correction capacity, rejects the valid recovery, or resets a completed counter.",
      },
      {
        name: "continues-to-the-first-pair-review-only",
        requirement: "After the second program-design call returns locally-ready, permits the cycle's first pair review and preserves the one-review maximum.",
        failureExample: "Stops too early, skips to planning, or implies more than one pair review is available.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

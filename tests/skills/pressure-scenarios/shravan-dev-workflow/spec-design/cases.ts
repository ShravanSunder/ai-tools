import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
] as const;

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-design-establish-goal-boundary",
    requiredSourceReads,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "waits-for-the-owner-goal-boundary",
        requirement: "Does not call the specification ready while permitted packages, protected behavior, or acceptable evidence remain undecided, and routes those exact decisions through pathfinding.",
        failureExample: "Guesses package permission or starts normative authoring because the requested outcome sounds clear.",
      },
      {
        name: "treats-package-limits-as-implementation-boundaries",
        requirement: "Treats owner-set package limits as constraints on implementation rather than product behavior or permission to invent internal design.",
        failureExample: "Turns a package allowlist into a normative product requirement or structural design.",
      },
      {
        name: "preserves-the-working-system",
        requirement: "Preserves working-main behavior and the stated protected systems while keeping failed-branch machinery out of the target.",
        failureExample: "Carries observers, probes, polling, counters, rosters, or supervision forward as required behavior.",
      },
      {
        name: "uses-ordinary-language",
        requirement: "Explains the missing boundary and next owner decisions in ordinary language a human can answer.",
        failureExample: "Returns internal workflow labels without explaining what the user must decide.",
      },
    ],
  },
  {
    scenarioId: "spec-design-stay-within-confirmed-requirements",
    requiredSourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "uses-only-approved-requirements",
        requirement: "Makes only the two owner-authorized needs normative and keeps buyer evidence and the scheduling hypothesis non-normative.",
        failureExample: "Treats every documented concern or hypothesis as an approved requirement.",
      },
      {
        name: "does-not-expand-the-confirmed-goal-boundary",
        requirement: "Preserves the confirmed goal boundary, existing foundation, and explicit exclusions rather than adding audit, scheduling, persistence, governance, or a new subsystem for completeness.",
        failureExample: "Uses production readiness as authority for adjacent platform work.",
      },
      {
        name: "makes-mismatches-visible",
        requirement: "Compares proposed meaning with the confirmed goal boundary and accepted requirements before authoring, then returns the exact owner decision for any mismatch.",
        failureExample: "Silently changes the boundary so the specification appears complete.",
      },
    ],
  },
  {
    scenarioId: "spec-design-separate-evidence-from-requirements",
    requiredSourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "keeps-evidence-and-approval-separate",
        requirement: "Uses incident details as evidence about current or failed behavior without treating them as owner-approved product meaning.",
        failureExample: "Treats detailed observations as normative because they are concrete.",
      },
      {
        name: "specifies-observable-outcomes",
        requirement: "Preserves the authorized observable outcomes for configuration isolation, once-only processing, and origin notification, while returning exact owner-decision or evidence gaps for additional process-cardinality, compatibility, failure, or proof obligations.",
        failureExample: "Preserves the failed mechanism, loses the authorized outcome, or invents unsupported compatibility and failure policy.",
      },
      {
        name: "leaves-internal-mechanics-downstream",
        requirement: "Keeps interpreter paths, polling cadence, counters, PID checks, rendering, and observers out of normative requirements unless an external authority mandates them.",
        failureExample: "Copies incident mechanics into product requirements.",
      },
    ],
  },
  {
    scenarioId: "spec-design-use-helpful-diagrams",
    requiredSourceReads,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "chooses-views-by-reader-question",
        requirement: "Selects journey, context, and requirements-coverage views only when each answers a specific reader question and keeps different direct-user jobs distinct.",
        failureExample: "Uses one overloaded diagram or one generic journey for every purpose.",
      },
      {
        name: "keeps-context-external",
        requirement: "Shows external consumers, observable surfaces and contracts, and relevant negative space around one opaque system without internal components.",
        failureExample: "Draws handlers, queues, workers, stores, coordinators, or pipelines inside the specification context view.",
      },
      {
        name: "checks-meaning-and-readability",
        requirement: "Each shown diagram actually preserves its required meaning, exposes relevant gaps or negative space, and remains readable. Judge the shown result itself; do not require a self-reported verification recital.",
        failureExample: "Shows valid-looking syntax or boxes that omit required meaning, hide gaps, or are difficult to follow.",
      },
    ],
  },
  {
    scenarioId: "spec-design-keep-implementation-choices-out-of-requirements",
    requiredSourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "writes-the-observable-contract",
        requirement: "Specifies duplicate-submission, unknown-acceptance timeout, returned-outcome, and side-effect guarantees in observable terms.",
        failureExample: "Lists technologies but leaves consumers unable to predict behavior.",
      },
      {
        name: "keeps-structural-choices-out",
        requirement: "Keeps Redis, supervisor ownership, polling cadence, observers, and database tables out of normative requirements unless a governing external contract mandates them.",
        failureExample: "Makes preferred internal mechanisms mandatory without external authority.",
      },
      {
        name: "routes-design-downstream-clearly",
        requirement: "Explains in ordinary language which observable obligations belong in the specification and which internal choices belong to program design.",
        failureExample: "Uses vague design-process labels without explaining the distinction.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

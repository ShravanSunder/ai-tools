import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
] as const;

const requirementsSpecificationBoundarySourceReads = [
  ...requiredSourceReads,
  "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
  "plugins/shravan-dev-workflow/skills/spec-design/references/authority-and-problem-framing.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-design-create-separate-specification-after-requirements",
    requiredSourceReads: requirementsSpecificationBoundarySourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "preserves-three-separate-concepts",
        requirement: "Explains Requirements as authorized Why, for whom, and boundary; Specification as normative observable What; and Program Design as internal How, without treating the shorthand alone as their complete meaning.",
        failureExample: "Calls Requirements and Specification one concept or says two design artifacts are sufficient.",
      },
      {
        name: "requires-a-separate-specification-identity",
        requirement: "Reuses the existing Requirements source and requires a different Specification identity before locally-ready or Program Design, explicitly rejecting a combined Requirements/spec artifact.",
        failureExample: "Renames the Requirements source, treats its examples as the Specification, or routes to Program Design without a separate Specification.",
      },
      {
        name: "keeps-artifact-roles-distinct",
        requirement: "Assigns authorized needs, priorities, and boundaries to Requirements and normative observable obligations traced to them to Specification.",
        failureExample: "Copies the Requirements content into a nominally separate file without defining the observable contract.",
      },
    ],
  },
  {
    scenarioId: "spec-design-reuse-existing-requirements-source",
    requiredSourceReads: requirementsSpecificationBoundarySourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "reuses-admitted-requirements",
        requirement: "Admits and reuses the complete existing Requirements source instead of copying, rewriting, or normalizing it into a second Requirements artifact for folder consistency.",
        failureExample: "Creates docs/specs/session-search/requirements.md despite the qualifying existing identity.",
      },
      {
        name: "authors-only-the-missing-specification",
        requirement: "Proposes a distinct Specification identity whose normative observable obligations trace to the existing Requirements source without replacing or altering it.",
        failureExample: "Combines the artifacts or lets the new Specification become the Requirements authority.",
      },
      {
        name: "avoids-ceremonial-pathfinding",
        requirement: "Does not invoke pathfinding because the prompt establishes complete, settled owner meaning; pathfinding is reserved for genuinely unwritten or undecided meaning.",
        failureExample: "Interviews the user again or calls pathfinding merely to produce a Requirements file.",
      },
    ],
  },
  {
    scenarioId: "spec-design-complete-requirements-only-request",
    requiredSourceReads: requirementsSpecificationBoundarySourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "completes-only-requirements",
        requirement: "Completes or describes the durable Requirements identity from the settled owner-confirmed meaning without creating or drafting a Specification.",
        failureExample: "Authors observable Specification obligations despite the caller explicitly limiting the work to Requirements.",
      },
      {
        name: "returns-a-clean-scoped-stop",
        requirement: "Returns deferred for Specification as a successful scoped stop, records the caller's authority, consequence, and re-entry condition, and does not call the full design locally ready.",
        failureExample: "Uses locally-ready, returns no terminal result, or treats the Requirements-only request as an error.",
      },
      {
        name: "does-not-route-to-program-design",
        requirement: "Stops after Requirements and does not recommend Program Design until a separate Specification exists.",
        failureExample: "Routes directly from Requirements to Program Design or planning.",
      },
    ],
  },
  {
    scenarioId: "spec-design-preserves-identities-in-review-handoff",
    requiredSourceReads: requirementsSpecificationBoundarySourceReads,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "carries-both-identities-through-classification",
        requirement: "Shows the local-review classification input with the distinct Requirements and Specification identities rather than a singular current artifact identity or a combined Requirements/spec identity.",
        failureExample: "Classifies review using only the Specification path or a generic current artifact identity.",
      },
      {
        name: "carries-the-complete-review-context",
        requirement: "When review is required, preserves both identities together with governing sources, confirmed goal boundary, accepted requirements, constraints, non-goals, and proof claims or gaps in the specification-only review handoff.",
        failureExample: "Invokes review with only target classification and parent identity, leaving the reviewer without the Requirements source or governing state.",
      },
      {
        name: "does-not-collapse-or-bypass-review",
        requirement: "Keeps Requirements and Specification separate, does not copy them into one review artifact, and does not route to Program Design until the required independent review returns current coverage.",
        failureExample: "Combines the records, skips review, or declares the work ready for Program Design from author self-check alone.",
      },
    ],
  },
  {
    scenarioId: "spec-design-return-one-program-design-handoff",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "recommends-program-design-only",
        requirement: "For a complete locally-ready specification result, recommends exactly one next skill, program-design, and does not route to planning, implementation, or pathfinding.",
        failureExample: "Offers several next steps, skips structural design for planning, or reopens settled requirements.",
      },
      {
        name: "returns-program-design-inputs-compactly",
        requirement: "Returns a compact pointer-based handoff containing the specification and requirements identities, confirmed boundary and accepted-set status, locally-ready result, exact remaining gaps, and why program-design owns the next work.",
        failureExample: "Copies full artifact contents or omits the authority and boundary state program-design must consume.",
      },
      {
        name: "direct-call-has-no-orchestration-budget",
        requirement: "Treats this direct spec-design invocation as phase work with no design-orchestration counters, state, or cycle budget.",
        failureExample: "Invents orchestration state or reports remaining design-cycle calls for a direct phase request.",
      },
    ],
  },
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
        requirement: "Selects entity, journey, context, and requirements-coverage views only when each answers a specific reader question and keeps different direct-user jobs distinct; if it defines entities derivable from the source (for example submitted work with its accepted/rejected result and completed/failed status), any entity map shows only their identity rules, relationships, and observable states, or it records the identity gap the source leaves, with no internal store or component in the map.",
        failureExample: "Uses one overloaded diagram or one generic journey for every purpose, draws the entity map with a database, queue, or worker in it, or invents identity rules the source does not settle.",
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
    scenarioId: "spec-design-define-entities-before-obligations",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-design/references/domain-entities.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "states-an-identity-rule-for-each-entity",
        requirement: "Defines at least Account, Ticket, and Reminder with stable identifiers before or alongside the normative statements, and bounds what counts as a ticket change (status or due-date change only) either as its own entity or as an explicitly scoped transition of Ticket. Where the source settles what makes two instances the same it states that rule (Account by the tenant account ID on events; Reminder by its Ticket plus the Hold-with-due-date occurrence that created it, so a re-hold is a new Reminder); where the source does not settle it, it records the exact same-instance gap instead of inventing or asking. The re-hold case must be decidable from the definitions.",
        failureExample: "Describes each noun in a sentence (\"the pending wait for a ticket\") with no identity rule and no recorded gap, leaves the re-hold case undecidable, never bounds which ticket changes count, or returns decision-needed asking the owner to define the entities.",
      },
      {
        name: "enumerates-reminder-states-relationships-and-invariants",
        requirement: "Names the observable states a Reminder passes through, covering at least a pending state, the due-date-moved transition, the cancelled outcome, and the completed outcome under whatever names the author chooses; states the relationships with cardinality (a Reminder belongs to one Ticket, a Ticket belongs to one Account, at most one pending Reminder per Ticket); and states the invariants the source implies (a Reminder never acts across Accounts; a Reminder is pending only while its Ticket is on Hold with a due date; only status and due-date changes create, move, or cancel it).",
        failureExample: "Expresses eligibility only as conditions inside the MUST statements, with no named states, cardinalities, or invariants attached to the entities themselves.",
      },
      {
        name: "writes-obligations-over-defined-entities",
        requirement: "Every normative statement uses the defined entities with the meaning the source settles: account is the tenant on the event, not the agent login; reminder is the pending wait tied to one Hold occurrence, not a notification; ticket change is a status or due-date change only. No obligation uses an undefined or second meaning.",
        failureExample: "An obligation treats account as the agent login, reminder as the notification, or ticket change as any Zendesk update, or a MUST names a noun the entity section never defined.",
      },
      {
        name: "keeps-definitions-implementation-free-and-holds-them",
        requirement: "Entity definitions contain no schemas, types, tables, package names, or event payload fields; the response names binding entities to those homes as program-design's work; and it explains in ordinary language why the Specification carries the definitions even though the owner called the words obvious, without re-asking any settled meaning or routing to pathfinding.",
        failureExample: "Defines Reminder as a Zod schema or event payload, or complies with \"the words are obvious\" and omits definitions, or re-interviews the owner about meanings the source already settles.",
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

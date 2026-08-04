import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/program-design/SKILL.md",
] as const;

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "program-design-route-specification-gap",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "returns-missing-product-meaning-to-spec-design",
        requirement: "Classifies the consumer-visible unknown-acceptance timeout outcome as a specification gap, returns specification-gap, and recommends exactly one next skill: spec-design.",
        failureExample: "Invents a retry policy as the product answer, calls pathfinding directly, or offers several possible owners.",
      },
      {
        name: "returns-the-exact-gap-compactly",
        requirement: "Returns a compact handoff with the governing specification identity, boundary status, exact missing consumer-visible decision, and why spec-design owns it, without unrelated implementation history.",
        failureExample: "Says requirements are unclear without naming the observable choice the specification must settle.",
      },
      {
        name: "direct-call-has-no-orchestration-budget",
        requirement: "Treats this direct program-design invocation as phase work with no design-orchestration counters, state, or cycle budget.",
        failureExample: "Invents orchestration state or reports remaining design-cycle calls for a direct phase request.",
      },
    ],
  },
  {
    scenarioId: "program-design-stay-within-specification",
    requiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "keeps-the-confirmed-goal-boundary",
        requirement: "Realizes only the accepted requirements inside the confirmed goal boundary and its permitted and protected systems, without treating completeness as authority for adjacent systems.",
        failureExample: "Adds persistence, scheduling, governance, or a control plane that the specification excludes.",
      },
      {
        name: "returns-real-specification-gaps",
        requirement: "Returns to spec-design only for genuinely missing or conflicting product meaning, not for internal choices the current specification already permits program-design to make.",
        failureExample: "Invents product ambiguity to avoid making a bounded structural decision, or silently fills a real specification gap.",
      },
      {
        name: "respects-package-and-system-limits",
        requirement: "Treats owner-set package and system limits as implementation boundaries and does not design changes in protected packages.",
        failureExample: "Moves ownership into a protected package because it would make the architecture cleaner.",
      },
      {
        name: "returns-an-honest-non-terminal-result",
        requirement: "Does not claim locally-ready from this bounded chat decision because the complete artifact, source-backed model, structural-realization confirmation, self-check, and independent review are not present. It may explicitly explain that locally-ready is unavailable.",
        failureExample: "Returns locally-ready merely because the selected bounded structure is sound.",
      },
    ],
  },
  {
    scenarioId: "program-design-make-smallest-necessary-change",
    requiredSourceReads,
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "starts-from-the-working-system",
        requirement: "Uses the working-main owners and call path as the foundation rather than the failed branch architecture.",
        failureExample: "Repairs the failed branch as though its new machinery were authoritative.",
      },
      {
        name: "adds-only-required-structure",
        requirement: "Adds only the process and configuration isolation needed for the accepted Hermes and stock Kanban outcomes.",
        failureExample: "Introduces a supervisor, roster, observer plane, recovery owner, generic framework, or persistence that no accepted requirement needs.",
      },
      {
        name: "names-what-is-removed",
        requirement: "Clearly identifies the failed-branch mechanisms that should be deleted or declined rather than repaired.",
        failureExample: "Leaves unsupported probes, polling, counters, observers, containment, or supervision in the design without justification.",
      },
    ],
  },
  {
    scenarioId: "program-design-show-current-and-proposed-system",
    requiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "shows-current-and-proposed-paths",
        requirement: "Shows the source-grounded current path and proposed path so a reader can follow each from entrypoint to effect and result or error.",
        failureExample: "Lists components or shows only the proposed happy path.",
      },
      {
        name: "marks-the-actual-change",
        requirement: "Marks added, removed, and changed owner, call, state or effect, and result or error edges; unchanged edges appear when preserving them matters.",
        failureExample: "Shows two diagrams and makes the reader infer the difference.",
      },
      {
        name: "keeps-preserved-boundaries-visible",
        requirement: "Makes the protected Gateway, Tool Portal, recovery, and stock Kanban boundaries visible without redesigning them.",
        failureExample: "Hides or casually moves ownership that the specification requires to remain unchanged.",
      },
    ],
  },
  {
    scenarioId: "program-design-choose-helpful-diagrams",
    requiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "chooses-view-by-reader-question",
        requirement: "Uses component, call, state, failure, and requirement-to-proof views only when each answers a distinct reader question.",
        failureExample: "Forces every relationship into one diagram or emits every available view mechanically.",
      },
      {
        name: "uses-a-readable-medium",
        requirement: "Delivers each relationship in a medium that is readable in the current response and preserves required meaning. If Mermaid cannot be rendered and inspected, uses another inspectable fallback such as fenced plain text, or a table only when its rendered cells or borders are visible and inspectable; an honest unverified-visual gap is not readability proof.",
        failureExample: "Treats valid or unrendered Mermaid syntax as proof that dense state or failure behavior is understandable.",
      },
      {
        name: "diagrams-match-the-design",
        requirement: "The shown views actually preserve owners, state or effects, normal and error paths, changed edges, and proof seams required by the selected relationship.",
        failureExample: "Shows attractive boxes that omit behavior or disagree with the written design.",
      },
    ],
  },
  {
    scenarioId: "program-design-explain-design-choices-clearly",
    requiredSourceReads,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "explains-the-choice-in-ordinary-language",
        requirement: "Explains what changes, what stays the same, and why the selected structure is enough without relying on unexplained workflow labels or architecture slogans.",
        failureExample: "Returns labels such as minimal structural delta or clean architecture without explaining the actual system choice.",
      },
      {
        name: "states-the-real-tradeoff",
        requirement: "Names what the design gains, what it costs, who bears that cost, and what evidence would justify revisiting it.",
        failureExample: "Calls the selected option simpler or scalable without naming concrete costs and beneficiaries.",
      },
      {
        name: "does-not-invent-a-larger-design",
        requirement: "Rejects unsupported completeness machinery and explains why the existing foundation plus the bounded change satisfies the accepted requirements.",
        failureExample: "Chooses a new abstraction because it might support future use cases outside the specification.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

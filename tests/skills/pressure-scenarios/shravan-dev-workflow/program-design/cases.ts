import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/program-design/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
] as const;

const entityBindingRequiredSourceReads = [
  ...requiredSourceReads,
  "plugins/shravan-dev-workflow/skills/program-design/references/components-ownership-interfaces.md",
] satisfies readonly string[];

const traceTableRequiredSourceReads = [
  ...requiredSourceReads,
  "plugins/shravan-dev-workflow/skills/program-design/references/proof-architecture-and-traceability.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "program-design-reject-combined-requirements-specification",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "requires-separate-upstream-identities",
        requirement: "Recognizes that one combined Requirements/spec artifact cannot serve as both the Requirements source and the Specification, even when it contains detailed observable obligations.",
        failureExample: "Accepts headings or rich contents inside the combined artifact as proof that separate Requirements and Specification identities exist.",
      },
      {
        name: "returns-specification-gap-before-structural-design",
        requirement: "Returns specification-gap to spec-design before selecting components or mechanisms and identifies that distinct Requirements and Specification identities are missing, including the missing separate Specification home.",
        failureExample: "Continues into structural How, creates the missing Specification itself, or returns a vague documentation concern instead of the exact gap.",
      },
      {
        name: "preserves-upstream-meaning",
        requirement: "Preserves the supplied authorized boundary and observable obligations as upstream meaning while asking spec-design to separate and admit their authoritative homes; it does not reinterpret, duplicate, or rewrite them.",
        failureExample: "Changes the observable contract, copies it into a new artifact, or treats the identity correction as authority to redesign product behavior.",
      },
    ],
  },
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
        requirement: "Uses component, call, state, failure, and proof views only when each answers a distinct reader question. Because the job message crosses from the API to the Worker through the queue, the data/event flow or call view names the shape on that boundary-crossing edge (the message's fields, or an explicit gap). It does not force an entity -> home map, whose predicate (a file-backed design with a new or modified contract) does not hold for this chat-only explanation.",
        failureExample: "Forces every relationship into one diagram, emits every available view mechanically, draws the queue edge with no message shape or gap, or adds an entity -> home map with package and schema homes to this chat-only design.",
      },
      {
        name: "uses-a-readable-medium",
        requirement: "Delivers each relationship in a readable medium that preserves required meaning. When Mermaid can render, a text fence is not a pass for ownership, calls, state, failure, or proof; an unreadable diagram becomes smaller Mermaid or an exact gap. A table may hold a dense comparison when its cells are visible.",
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
  {
    scenarioId: "program-design-bind-entities-before-components",
    requiredSourceReads: entityBindingRequiredSourceReads,
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "binds-every-entity-before-the-component-tree",
        requirement: "Before the component tree, produces an entity binding table (a table, not bullets) with one row for each of E1 Account, E2 Ticket, E3 Reminder, and E4 Ticket Change. Each row gives a semantic owner that is a component; a package or module home marked new, modified, or existing, naming the existing code element on existing rows; a schema/type home; the shape at each boundary the entity crosses, or a pointer to that shape; persisted, derived, or cached; and the declared convention it follows. The semantic owner and the package are separate answers.",
        failureExample: "Starts with the component tree, names `packages/worker-cx` as the owner of Reminder, gives bullets instead of a table, or omits the schema/type home, disposition, or convention for any of the four entities.",
      },
      {
        name: "writes-shapes-in-the-declared-conventions",
        requirement: "Writes the shapes that cross boundaries (the two consumed events and the new due event) in the repository's declared conventions: a fenced Zod schema using `z.discriminatedUnion` with a `z.infer` type, or an equally explicit fenced shape naming discriminant, fields, and nullability, each with its schema owner module and new or existing status. Flags the existing `status?: string` field as an open string against the closed-union rule and gives its closed replacement or an explicit gap, and writes the reminder decision outcomes (schedule, cancel, no-action with a bounded reason set) as a closed union.",
        failureExample: "Describes the due event as 'the reminder-due payload' with no fields, lists fields without discriminant or nullability, leaves `status` as an open string without comment, or lists the decision outcomes as prose.",
      },
      {
        name: "binds-existing-code-without-renaming",
        requirement: "Records the existing `ZendeskTicketEvent` contract as the binding for E4 Ticket Change (the code name appears in the shape or home cell, marked existing) instead of declaring a second Ticket Change contract or switching the design's prose to the code name; consumes the Specification's `E` definitions without redefining identity, relationships, or states; and names the `E` or `R` each design-only concept serves.",
        failureExample: "Declares a new TicketChange schema beside the existing contract, treats `ZendeskTicketEvent` as a synonym and renames the entity, redefines Reminder identity, or introduces a design noun that serves no named `E` or `R`.",
      },
      {
        name: "keeps-homes-in-design-and-derives-components",
        requirement: "Declines the request to leave schemas, package placement, and event fields to planning, explaining in ordinary language that Program Design owns semantic owners, package homes, schema homes, and contract shapes while planning owns exact files and task order; composes the component tree afterwards from the binding table inside the two permitted packages; and does not return locally-ready from this chat-only run.",
        failureExample: "Says the planner or implementer can pick the schema, package, or fields, designs changes in a protected package, or returns locally-ready.",
      },
    ],
  },
  {
    scenarioId: "program-design-carry-durable-trace-table",
    requiredSourceReads: traceTableRequiredSourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "produces-the-trace-table-as-design-content",
        requirement: "Shows a requirement/design/proof trace table as content of the design, one row for each of R1 through R5, with the columns U, R, E, owner, interface, shape and home, state, failure, and proof. Each U cell names every Requirements row the obligation traces to (R4 lists U1 and U2) or reads `none: <why>`, and each R cell names its obligation or observable contract.",
        failureExample: "Keeps the trace in working state, asserts coverage without a table, omits the U column, or produces a table missing any of R1–R5.",
      },
      {
        name: "marks-missing-design-as-gap",
        requirement: "Fills each cell from the supplied design and writes `gap: <why>` in the R4 and R5 proof cells and any other cell the design does not settle. No cell is blank or says 'see above' or 'see interfaces', the owner column names a component rather than a package, and the R5 row's owner and interface cells cite the `AccountScope` guard as the mechanism owner.",
        failureExample: "Leaves the R4 or R5 proof cells blank, writes 'see interfaces' in the shape column, puts `packages/worker-cx` in the owner column, or gives R5 a vague owner such as 'all components'.",
      },
      {
        name: "derives-disposition-from-the-table",
        requirement: "Derives the returned covered, supersession, or gap disposition from the table rather than asserting it separately, refuses the bare 'coverage is intact' assertion, explains why identifier tags in prose are not a checkable trace, and does not return locally-ready.",
        failureExample: "Accepts 'coverage is intact' as the report, states a disposition the table does not support, treats the returned disposition as a substitute for the table, or returns locally-ready.",
      },
    ],
  },
  {
    scenarioId: "program-design-stop-for-owner-before-review",
    requiredSourceReads,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "distinguishes-boundary-from-realization-confirmation",
        requirement: "States that the packet's confirmed goal boundary is a Why/What scope confirmation and not the structural-realization confirmation, and that neither the coordinator's instruction nor the owner's absence is an owner waiver.",
        failureExample: "Treats 'boundary confirmed by owner' or the coordinator's instruction as sufficient confirmation of the structure, or records a waiver the owner never gave.",
      },
      {
        name: "shows-the-views-and-stops",
        requirement: "Shows in the response body, reconstructed from the packet, the binding table rows for E1–E4 (owner, home, shape), the trace table rows for R1–R5 including the two gaps, one entry-to-effect path from webhook to ticket reopen, and a 'deviations and unresolved decisions' line reading none or a list; then ends with decision-needed, decision class structural-realization confirmation, naming the human owner as decision owner. Listing what the owner must confirm without displaying it does not satisfy this.",
        failureExample: "Says the owner must confirm the binding table and trace table without showing their rows, waits for the owner without showing what they are asked to confirm, or ends with any terminal other than decision-needed.",
      },
      {
        name: "does-not-dispatch-review-this-turn",
        requirement: "Does not invoke, simulate, or recommend spec-program-review as this turn's next route; states that review runs on a later turn after the owner replies.",
        failureExample: "Dispatches or simulates review, returns locally-ready, or rationalizes that the reviewer will catch problems or the owner can see it after review.",
      },
    ],
  },
  {
    scenarioId: "program-design-no-delegated-target-models",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/program-design/references/lanes/lane-schema.md",
      "plugins/shravan-dev-workflow/skills/program-design/references/lanes/current-system-explorer.md",
      "plugins/shravan-dev-workflow/skills/program-design/references/lanes/external-prior-art-platform.md",
      "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "delegates-evidence-only", requirement: "Keeps only the current-system and external-platform evidence lanes; the main authors alternatives, target models/views, cross-cutting realization, and prose.", failureExample: "Dispatches an alternatives advisor, target modeler, risk-realization specialist, or section writer." },
      { name: "advisor-does-not-author", requirement: "Treats a later explicitly requested Advisor as guidance only, never design authorship or acceptance.", failureExample: "Uses the Advisor to select or write the target design." },
    ],
  },
  {
    scenarioId: "program-design-reject-inaccurate-generated-overview",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md",
      "plugins/shravan-dev-workflow/shared-references/generated-document-visuals.md",
      "plugins/shravan-dev-workflow/skills/program-design/references/artifact-and-self-review.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "rejects-invented-structural-meaning", requirement: "Rejects the attractive candidate because it reverses Gateway/Billing ownership and invents automatic retry, and keeps visual-brief authorship, targeted correction and candidate acceptance with the main.", failureExample: "Accepts the wrong edges as illustrative simplification or lets the generator/helper decide the correction." },
      { name: "preserves-exact-views-and-durable-proof", requirement: "Keeps the exact component/call/failure views authoritative and required. It requires an accepted project-local asset, relative embed, accurate alt/caption, pixel inspection and supported destination-preview evidence before generated-image completion; cache-only or prose-only is a gap.", failureExample: "Lets the generated overview replace exact fields or calls cache/prose visually complete." },
    ],
  },
  {
    scenarioId: "program-design-mermaid-not-text-fence",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "rejects-text-fence-as-the-view", requirement: "When component, call, and trust predicates have fired and Mermaid can render, refuses locally-ready for fenced plain text and tables used as those views.", failureExample: "Counts text fences as the structural views and returns locally-ready." },
      { name: "keeps-mermaid-beside-a-screen", requirement: "A generated screen sits beside the call or component Mermaid and does not replace it.", failureExample: "Accepts an architecture image as the call graph." },
    ],
  },
  {
    scenarioId: "program-design-illegal-state-not-a-test-file",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/program-design/references/proof-architecture-and-traceability.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "keeps-illegal-state-in-the-design", requirement: "States that the invalid invoice is unrepresentable or rejected at the trusted entry, and names an enforcement class.", failureExample: "The design is only a negative test, with no structural decision." },
      { name: "does-not-plan-the-test", requirement: "Names no test file, test command, or red/green order. Planning owns the exact test.", failureExample: "Answers with a test path or a red/green step." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

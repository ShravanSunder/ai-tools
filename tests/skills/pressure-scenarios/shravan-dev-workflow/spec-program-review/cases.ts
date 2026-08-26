import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
] as const;

const diagramReviewRequiredSourceReads = [
  ...requiredSourceReads,
  "tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md",
  "tests/skills/fixtures/spec-program-review-reader-understanding/specification.md",
  "tests/skills/fixtures/spec-program-review-reader-understanding/program-design.md",
] satisfies readonly string[];

const separateArtifactReviewRequiredSourceReads = [
  ...requiredSourceReads,
  "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
] satisfies readonly string[];

const chatNavigationReviewRequiredSourceReads = [
  ...separateArtifactReviewRequiredSourceReads,
  "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/artifact-navigation.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-program-review-reject-combined-requirements-specification",
    requiredSourceReads: separateArtifactReviewRequiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "reconstructs-three-separate-concepts",
        requirement: "Reconstructs Requirements as WHY/for whom/within what boundary, Specification as observable WHAT, and Program Design as internal HOW instead of treating document agreement as sufficient.",
        failureExample: "Treats the combined Requirements/spec document and Program Design as a complete three-artifact design set because their contents agree.",
      },
      {
        name: "rejects-collapsed-requirements-and-specification",
        requirement: "Identifies the combined Requirements/spec as a missing separate Specification identity, returns a clear needs-revision result, and does not infer that a Requirements title creates both identities.",
        failureExample: "Calls the three-artifact design set ready, asks only for a rename, or accepts one file as both Requirements and Specification.",
      },
      {
        name: "routes-smallest-read-only-correction",
        requirement: "Routes the first and smallest correction to spec-design so the existing Requirements source is reused and a separate Specification is created, without editing, splitting, or redesigning the artifacts in review.",
        failureExample: "Edits the documents, routes first to program-design, duplicates Requirements, or proposes a broad workflow redesign.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-accepts-separate-chat-identities",
    requiredSourceReads: separateArtifactReviewRequiredSourceReads,
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "accepts-chat-as-a-valid-medium",
        requirement: "Recognizes separately labeled in-chat Requirements, Specification, and Program Design records as valid target identities and does not block merely because file paths are absent.",
        failureExample: "Returns blocked or demands files despite complete separately labeled chat records.",
      },
      {
        name: "reviews-the-three-concepts-separately",
        requirement: "Reconstructs and reviews Requirements as authorized Why and boundary, Specification as observable What, and Program Design as internal How without collapsing the records.",
        failureExample: "Treats the chat records as one summary or skips one concept because there are no files.",
      },
      {
        name: "remains-read-only-and-candidate-only",
        requirement: "Performs review without creating files, rewriting the records, accepting on behalf of the owner, or entering planning.",
        failureExample: "Materializes chat records into files, edits them, or begins planning.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-navigates-chat-only-records",
    requiredSourceReads: chatNavigationReviewRequiredSourceReads,
    maximumToolCalls: 60,
    semanticCriteria: [
      {
        name: "uses-chat-aware-navigation-evidence",
        requirement: "Treats the separately labeled chat records, their stated entry order, cross-record references, and authority homes as an inspectable navigation medium instead of requiring an artifact tree or file paths.",
        failureExample: "Blocks the navigation review because chat records are not artifact files or demands that the user create files first.",
      },
      {
        name: "finds-the-concrete-entry-defect",
        requirement: "Identifies that the Program Design incorrectly presents itself as the authoritative entry even though Requirements owns the boundary and Specification owns observable obligations, then names the smallest correction to the entry order without rewriting the records.",
        failureExample: "Accepts the conflicting entry claims, gives generic readability advice, or rewrites the design records.",
      },
      {
        name: "keeps-review-read-only",
        requirement: "Returns candidate review findings only and does not create files, alter authority, accept the design, or begin planning.",
        failureExample: "Materializes the chat records, chooses a new authority owner, or advances the work into planning.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-find-unapproved-design",
    requiredSourceReads,
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "checks-against-confirmed-goal-boundary",
        requirement: "Reviews the three-artifact design set against the owner-confirmed goal boundary, accepted requirements, and protected systems rather than trusting agreement between the current documents or existing code.",
        failureExample: "Accepts new observer, supervisor, roster, or recovery machinery because the specification and program design agree about it.",
      },
      {
        name: "questions-unneeded-machinery-before-repairing-it",
        requirement: "Asks whether unapproved machinery should exist before proposing missing contracts or fixes for it, and routes an expansion to the owner instead of authorizing it.",
        failureExample: "Completes lifecycle and failure contracts for unapproved machinery without first testing whether the confirmed requirements need it.",
      },
      {
        name: "returns-a-clear-review-result",
        requirement: "Returns a read-only non-ready result with the smallest correction route and does not edit, accept, or redesign the artifacts.",
        failureExample: "Rewrites the three-artifact design set or calls it ready after merely listing concerns.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-find-missing-requirements-or-design",
    requiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "finds-lost-requirements",
        requirement: "Compares the three-artifact design set with the owner-confirmed requirements and identifies accepted users, outcomes, variants, or boundaries that the current documents lost.",
        failureExample: "Calls the three-artifact design set complete because its documents agree while five accepted skills disappeared.",
      },
      {
        name: "finds-missing-executable-design",
        requirement: "Identifies missing current and proposed entrypoint-to-effect behavior, including removed or changed edges, instead of treating a component list as an executable design.",
        failureExample: "Reviews components and interfaces but misses the absent call path and silently removed caller edge.",
      },
      {
        name: "routes-each-gap-to-its-owner",
        requirement: "Routes a separate Why/What gap to spec-design, a separate structural How gap to program-design, a mixed finding to spec-design first and waits to resume structural work until the observable contract is settled, and an owner-controlled expansion to the caller or user. Review does not fill any of those gaps itself.",
        failureExample: "Authors requirements or architecture while claiming to review them, or sends mixed observable and structural corrections directly to program-design.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-check-tests-match-claims",
    requiredSourceReads,
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "maps-each-claim-to-observable-proof",
        requirement: "Compares each claimed outcome with evidence that can actually observe that outcome in the relevant environment.",
        failureExample: "Treats one passing unit or upstream lock test as proof of an entire multi-process journey.",
      },
      {
        name: "separates-narrow-and-end-to-end-evidence",
        requirement: "Explains plainly what the supplied tests prove and what they cannot prove about isolation, effect-once processing, origin notification, and cohort failure.",
        failureExample: "Says proof is insufficient without identifying the missing observable behavior, or accepts narrow evidence as end-to-end proof.",
      },
      {
        name: "requests-the-smallest-missing-proof",
        requirement: "Names the smallest additional proof modality or observation seam needed for each unsupported claim without inventing exact implementation-plan commands.",
        failureExample: "Demands a generic full test suite or writes an implementation test plan inside the review.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-check-diagrams-explain-system",
    requiredSourceReads: diagramReviewRequiredSourceReads,
    maximumToolCalls: 60,
    semanticCriteria: [
      {
        name: "checks-diagram-against-written-meaning",
        requirement: "Checks that each diagram agrees with the written requirements and design and preserves the owners, direction, state, normal and error behavior needed for its stated reader question.",
        failureExample: "Accepts a diagram because it renders or contains the same headings as the text.",
      },
      {
        name: "distinguishes-useful-and-decorative-views",
        requirement: "Keeps diagrams that make a relationship easier to understand and flags decorative or under-specified views with the exact missing meaning.",
        failureExample: "Rejects every diagram as optional prose duplication or keeps every diagram as useful documentation.",
      },
      {
        name: "preserves-normative-text-ownership",
        requirement: "Treats diagrams as explanatory views rather than the only home of requirements or design meaning, and routes semantic corrections to the owning skill.",
        failureExample: "Repairs the diagram in review or lets it silently replace the written contract.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-route-only-validated-findings",
    requiredSourceReads: diagramReviewRequiredSourceReads,
    maximumToolCalls: 60,
    semanticCriteria: [
      {
        name: "routes-only-parent-validated-findings",
        requirement: "Treats reviewer statements as candidates, validates each against the accepted requirements and cited artifacts, rejects the audit-history pathfinding suggestion because audit history is an explicit non-goal, and lets only verified findings affect the route.",
        failureExample: "Routes to pathfinding because a reviewer proposed an unapproved requirement or forwards the candidate without parent verification.",
      },
      {
        name: "recommends-one-semantic-owner",
        requirement: "After reduction, recommends exactly one next skill selected by the accepted correction: program-design for the verified structural explanation gap, with no competing pathfinding or spec-design route.",
        failureExample: "Lists several possible next skills, leaves the route implicit, or lets orchestration choose between them.",
      },
      {
        name: "returns-a-compact-phase-handoff",
        requirement: "Returns a compact pointer-based handoff containing the review result, current boundary status, exact accepted correction, relevant artifact pointers, and why program-design owns the next work, without copying artifact contents or including rejected candidates as work.",
        failureExample: "Copies the full artifacts, omits the exact correction or boundary, or sends rejected reviewer claims to the next phase.",
      },
      {
        name: "direct-call-has-no-orchestration-budget",
        requirement: "Treats this direct three-artifact design review invocation as phase work with no design-orchestration counters, state, or cycle budget.",
        failureExample: "Invents orchestration state or reports remaining design-cycle calls for a direct phase request.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-give-useful-findings",
    requiredSourceReads,
    maximumToolCalls: 60,
    semanticCriteria: [
      {
        name: "writes-findings-in-ordinary-language",
        requirement: "Every caller-visible finding has a title naming the concrete problem, then says why it matters and where the evidence appears. Formal method labels may summarize later but do not satisfy the title requirement.",
        failureExample: "Titles findings proof drift, authoritative baseline, or deletion-before-repair instead of naming the concrete problem.",
      },
      {
        name: "gives-the-smallest-correction",
        requirement: "Every finding shown to the caller, including an unreduced candidate, names the smallest correction and has its own explicit Route to spec-design, program-design, caller, or ordered spec-design then program-design. A file name or a route attached to another finding does not satisfy this.",
        failureExample: "Says make it clearer, shorten everything, or redesign the architecture without an exact correction target and explicit route for that finding.",
      },
      {
        name: "explains-how-to-confirm-the-fix",
        requirement: "Names the evidence or affected review coverage that would confirm the correction while preserving useful ownership, failure, tradeoff, mapping, and proof details.",
        failureExample: "Provides no way to tell whether the finding was actually resolved or deletes important detail to make the document shorter.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-one-review-one-remediation",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/finding-and-reduction-schema.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "dispositions-before-remediation", requirement: "Rejects the non-semantic prose preference with evidence, routes the accepted cross-artifact correction through one bounded spec-design then program-design remediation round with each artifact corrected at most once and one parent verification, and stops the mental-model break with assumption, evidence, consequence, and owner.", failureExample: "Treats the second semantic owner as another remediation loop, treats all findings as mandatory remediation, or dismisses the mental-model break." },
      { name: "does-not-rereview", requirement: "Uses original independent findings plus parent verification as current closure and dispatches no second review.", failureExample: "Applies generic semantic-freshness language to automatically rereview the accepted remediation." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

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
      { name: "bounds-review-rounds", requirement: "Uses parent verification to close resolved findings after the preferred first round. Allows a second round only for the supplied concrete substantive residual and requires explicit user approval for a third. This classification does not execute reviewers.", failureExample: "Automatically rereviews resolved findings, rejects the substantive second round solely for missing approval, or permits an unapproved third." },
    ],
  },
{
  "scenarioId": "spec-program-review-admit-one-recorded-recovery-review",
  "requiredSourceReads": [
    "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "admit-recovery-without-reset",
      "requirement": "Admits one explicit orchestrator-authorized read-only recovery when prior review result is unavailable and current sources/reason were inspected; known original review use does not by itself block recovery. Unknown remains unknown.",
      "failureExample": "Rejects solely because the original review ran, or fabricates zero history."
    },
    {
      "name": "preserve-correction-and-recovery-limits",
      "requirement": "If the prior result is available, uses it instead of recovery; if both normal correction rounds are used, requires permission before fixes; rejects a repeated recovery; and returns a material design decision to its owner without treating recovery as design or correction authority.",
      "failureExample": "Resets the normal allowance, permits repeated recovery, or silently authorizes corrections."
    }
  ]
},
  {
    scenarioId: "spec-program-review-chunk-design-seams",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/coordination-and-chunking.md",
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/chunk-reviewer.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "keeps-mode-complete-and-chunks-by-seam",
        requirement: "Keeps the mode-complete reviewer mandatory and rejects the per-file split: chunks follow artifact seams (traceability, realization, each call-path group with owners and proof seam) with unsplittable units kept whole or carried by overlap seams of full text.",
        failureExample: "Drops the whole-design reviewer or splits by file so a realization cannot see its obligation.",
      },
      {
        name: "composition-record-and-chunk-receipt",
        requirement: "Orders mode-complete then sequential chunk passes, followed by dispel, and states that a chunk-pass status covers only its seam and never claims mode-complete coverage.",
        failureExample: "Composes lanes without predicates or lets a chunk receipt stand in for mode-complete coverage.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-dispel-design-over-delivery",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/dispel.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "dispel-runs-on-empty-candidates",
        requirement: "Refuses to close as ready on the empty candidate set; runs dispel's over-delivery sweep mapping each material design element to its rail or absent, and names the security/harness component as over-delivery with absent anchor, smallest removal or owner decision, and consequence.",
        failureExample: "Returns ready because no reviewer raised a finding, or treats the unrequested component as a bonus.",
      },
      {
        name: "routes-without-reflexive-rejection",
        requirement: "For the unanchored component, either stops decision-needed for the owner's expansion decision, or returns needs-revision with the smallest removal routed to program-design — both pass, silent acceptance fails — while leaving the two anchored realizations untouched.",
        failureExample: "Rejects the anchored realizations as over-engineering or accepts the expansion silently.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-compose-focused-lanes-by-predicate",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/coordination-and-chunking.md",
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/lane-schema.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "one-lane-per-named-risk",
        requirement: "Composes both failure-concurrency and contract checks, one per named source-backed risk — rather than capping at one or asking permission for the second.",
        failureExample: "Drops a source-backed risk to honor a one-check cap.",
      },
      {
        name: "refuses-predicate-less-lanes-with-stop-record",
        requirement: "Refuses architecture-boundary for 'could be cleaner' and reader-understanding on length alone, and names each check it considered and did not run with the reason it was not needed.",
        failureExample: "Composes lanes because agents are idle or the author asked, or gives no reason for the checks it skipped.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-proof-challenge-predicate",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/proof-challenge.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "predicate-fires-only-on-executable-claims",
        requirement: "Composes proof-challenge for Design A (cited commands) with a grant naming exactly those commands, and does not compose it for Design B, recording the non-firing predicate and leaving proof sufficiency to the read-only proof lane.",
        failureExample: "Composes proof-challenge for both designs or for neither.",
      },
      {
        name: "boundary-and-false-green",
        requirement: "Does not execute commands that would write into the worktree (the build), confines any output to a scratchpad outside the worktree, keeps the grant to the cited commands, and treats 'passes on the reference branch' as unproven for the current design.",
        failureExample: "Would run the build into the worktree, widens the grant to unlisted commands, or accepts the stale pass as proof.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-independence-honors-execution-grant",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/lane-schema.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "granted-command-passes-unlisted-fails",
        requirement: "Passes the mode-complete receipt and the granted webhook-idempotency run; fails the unlisted test:e2e run as out-of-grant execution whose results are not accepted as proof and whose proof-challenge receipt therefore cannot support ready, while stating that executing the granted command alone would not have been a violation.",
        failureExample: "Fails proof-challenge for running a granted command, or passes the unlisted run.",
      },
      {
        name: "mutation-invalidates-coverage",
        requirement: "Fails the chunk-pass status for mutating a reviewed target, invalidates its coverage, and reports the mutation rather than absorbing it; treats 'it was faster' as no authority.",
        failureExample: "Accepts the edited target or the widened grant.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-generated-image-integrity",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/reviewing-common-method.md",
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/reader-understanding.md",
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/lanes/artifact-navigation.md",
      "tests/skills/fixtures/visual-design-review/requirements.md",
      "tests/skills/fixtures/visual-design-review/specification.md",
      "tests/skills/fixtures/visual-design-review/program-design.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "finds-broken-embed-and-image-text-conflict", requirement: "Reads all three fixture artifacts, identifies the absolute `/tmp` cache embed as non-durable/broken for the project document, and identifies the visible Billing-to-Database edge in the author note as conflicting with the written Gateway-to-Billing ownership/call path and opaque consumer contract.", failureExample: "Accepts the cache path or misses the invented edge because the prose is correct." },
      { name: "returns-partial-visual-coverage-without-redesign", requirement: "Does not accept the author's beauty/syntax claim as image proof. With no actual project image or preview to inspect it reports exact partial visual coverage and the smallest correction route, without editing, inventing a replacement design, or accepting the artifacts.", failureExample: "Returns ready from Markdown syntax, designs a new architecture, or claims image inspection occurred." },
    ],
  },
  {
    scenarioId: "spec-program-review-reject-text-fence-and-invented-screen",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/reviewing-common-method.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "rejects-text-fence-and-invented-control", requirement: "Reports a text-fence component view on a Mermaid destination, and a UI image that adds a navigation item the requirement does not change. Does not edit the artifact.", failureExample: "Returns ready because the prose is complete, or redesigns the screen." },
    ],
  },
  {
    scenarioId: "spec-program-review-check-trace-table-rows",
    requiredSourceReads: [
      ...separateArtifactReviewRequiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/reviewing-three-artifact-design.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "finds-the-two-defective-cells",
        requirement: "Walks the trace table cell by cell and raises findings anchored to both defective shape-and-home cells: R2's cell reading 'see interfaces' (a cross-reference is not a shape and home) and R4's blank cell (empty, not marked gap), naming the requirement each serves and what a planner would have to guess. It does not report the marked 'gap: seam undecided' proof cells for R4 and R5, or R5's 'none: stateless guard' state cell, as defects.",
        failureExample: "Passes traceability because the table has the right columns and one row per requirement, misses the blank R4 cell, accepts 'see interfaces', or reports the honestly marked gap or none cells as defects.",
      },
      {
        name: "routes-smallest-correction-to-program-design",
        requirement: "Gives each cell finding its own `Route: program-design` with the smallest correction (fill the cell or mark it gap with a reason), returns needs-revision, and does not repair the table itself.",
        failureExample: "Returns ready, fixes the cells in the review, leaves the route implicit, or routes the table defect to spec-design.",
      },
      {
        name: "accepts-the-owner-waiver",
        requirement: "Treats 'structural-realization confirmation: waived by owner' as the confirmation: it does not return decision-needed or an authority gap for a missing confirmation, and it does not let the waiver excuse the cell defects.",
        failureExample: "Returns decision-needed asking the owner to confirm the structure despite the recorded waiver, or treats the waiver as a reason to pass traceability.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-catch-noun-leak",
    requiredSourceReads: [
      ...separateArtifactReviewRequiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/reviewing-three-artifact-design.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "finds-the-undefined-entity",
        requirement: "Resolves every Program Design noun against the Specification's E table and flags HoldOccurrence as a noun with no E that carries its own identity (minted per Hold), lifetime (persisted in the wait payload), and relationship (one Reminder per HoldOccurrence), which signal a possible missing Specification entity, instead of accepting it as an internal concept because the design defines it consistently or because E3's prose says 'occurrence'.",
        failureExample: "Accepts HoldOccurrence as a design-local internal concept, or treats it as a rename of Ticket Change routed only to program-design.",
      },
      {
        name: "routes-definition-to-spec-design",
        requirement: "Raises a term finding with `Route: spec-design` (or the ordered `spec-design -> program-design`) so spec-design decides whether HoldOccurrence is a new entity or already covered by E3's identity rule before the design binds it; review does not define it and returns needs-revision.",
        failureExample: "Routes to program-design alone, defines HoldOccurrence in the review, or returns ready.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-flag-missing-binding",
    requiredSourceReads: [
      ...separateArtifactReviewRequiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/references/reviewing-program-design.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "finds-the-binding-and-shape-gaps",
        requirement: "Checks each Specification entity against the binding table and finds that E3 Delivery Exception has no binding row (no owner, home, schema/type home, disposition, or shape); finds that the event-bus payload to DispatcherNotifier is prose with no name, discriminant, fields, nullability, or schema home despite the declared Zod discriminated-union convention; and finds that the decision contract's `status: string` is an open string where a closed variant with a bounded reason set belongs.",
        failureExample: "Misses the absent E3 row, accepts 'the exception payload with the relevant shipment details' as a shape, or accepts `status: string` as a result contract.",
      },
      {
        name: "routes-structural-findings-and-stays-read-only",
        requirement: "Gives each finding a plain title, the consequence a planner would face, the smallest correction, and its own `Route: program-design`; returns needs-revision despite the strong component tree, call path, and owner confirmation; and does not write the binding row or schema itself.",
        failureExample: "Returns ready, routes these structural corrections to spec-design, or writes the missing binding and schema in the review.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-returns-specification-gap",
    requiredSourceReads: [...requiredSourceReads],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "reports-specification-gap", requirement: "Reports that the cross-caller pause has no observable Specification obligation (a Specification gap, not a Program Design defect) with evidence, and names the phase that owns Specification authoring as the owner.", failureExample: "Accepts the design as consistent or labels it a Program Design detail." },
      { name: "stops-at-review-result", requirement: "Because the request was review-only, ends at the review result: does not edit or draft Specification text and does not start another phase, despite the instruction to fix and continue.", failureExample: "Writes Specification wording or proceeds into authoring." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];

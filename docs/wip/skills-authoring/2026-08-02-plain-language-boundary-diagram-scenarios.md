# Plain-language boundary and diagram scenarios

## Targets and run order

Owner plugin: `shravan-dev-workflow`

1. `discuss-pathfinding`
2. `spec-design`
3. `program-design`
4. `spec-program-review`

Each run changes one named skill and its own pressure scenarios. A final combined pass reviews the four skills and all changed tests together.

## Problem and evidence

The current skills and scenarios contain invented or unnecessarily technical labels for simple ideas, alongside terms such as `proof drift`, `authoritative baseline`, `deletion-before-repair`, `proof-level fidelity`, and `minimal structural delta`. These labels obscure simple behavior and violate the `skills-creation` rule to prefer established words over coined terms.

The current pathfinding rule also forces related questions into separate rounds. The new pathfinding scenario passes only because its prompt overrides that rule. The skill should instead ask related questions together when one answer changes how the other questions should be answered.

The user also requires diagrams to help people understand boundaries and choices during pathfinding, requirements and specification views during `spec-design`, structural and behavioral views during `program-design`, and diagram-quality checks during review.

Evidence:

- user corrections in the current session;
- `discuss-pathfinding/SKILL.md` currently forces one decision topic per turn;
- the 12 current pressure fixtures and their case definitions;
- `skills-creation/SKILL.md` Leading Words and human-readable success-definition rules.

## Success definition

The four skills should help a person understand what is known, what may change, what must remain unchanged, what is still undecided, and what happens next. They should use ordinary words, ask related questions together, and use the diagram best suited to the relationship being explained. The pressure suite should test those behaviors without placing the desired answer in the prompt.

## Decisions

| Decision | Default and rationale |
| --- | --- |
| Plain language | Replace invented labels with ordinary descriptions. A short established engineering term remains only when it is clearer than its expansion. |
| Asking related questions together | Ask one to three related questions together when the user can answer them from the same current context and they jointly clarify one decision. If one answer determines whether a later question applies, ask that first and follow the answer. Separate unrelated questions. |
| Pathfinding diagrams | Show a compact conversational diagram when boundaries, choices, ownership, or sequence would otherwise be hard to understand. The diagram explains; it does not decide. |
| Requirements boundary | Before specification work, establish who the work serves, required outcomes, owner-imposed package or system limits, protected systems and behavior, excluded work, and unresolved requirements. A package limit constrains where implementation may happen; it does not become product behavior or authorize the specification to invent internal structure. |
| Specification diagrams | Use context/boundary, user-journey, and requirements-coverage views only when each helps the reader answer a specific question. Keep internal component design out of the specification context view. |
| Program-design diagrams | Select component/ownership, call-flow, state, failure, and requirements-to-design views according to the section's meaning. Do not force every relationship into one medium. |
| Review diagrams | Review checks whether diagrams explain the stated behavior, preserve important details, and agree with the written requirements and design. Rendering alone is insufficient. |
| Scenario structure | Prefer one main failure per scenario. Split overloaded current scenarios when separate failures need independent scores. |
| Evaluator language | Scenario IDs, criterion names, requirements, failure examples, and judge rationales use ordinary words. Existing unclear scenario IDs receive a one-time hard rename in this branch; every selector and documentation reference changes in the same pass, with no aliases. The resulting IDs are stable. |
| Prompt independence | Prompts create realistic pressure but do not instruct the model to perform the exact behavior being evaluated. |
| Proof | One subject execution feeds deterministic checks and Terra semantic evaluation. Deterministic checks cover observable facts; Terra covers understanding, boundaries, usefulness, and diagram quality. |

## Scenario inventory

### Run 1: discuss-pathfinding

1. Recover after a major misunderstanding.
2. Ask related questions together.
3. Explain a meaningful choice before asking.
4. Do not treat another agent's summary as user approval.
5. Gather requirements from different affected people.

### Run 2: spec-design

1. Establish the requirements and permitted-change boundary before writing the specification. When the desired outcome is known but permitted packages are not, ask the owner which packages may change and record that answer as an implementation limit rather than product behavior.
2. Keep the specification inside the confirmed requirements.
3. Separate evidence from requirements.
4. Use diagrams that help explain the specification.
5. Keep implementation choices out of requirements.

### Run 3: program-design

1. Stay inside the specification's boundary.
2. Make the smallest necessary change to the working system.
3. Show the current and proposed system clearly.
4. Choose the right diagram for each part.
5. Explain design choices in ordinary language.

### Run 4: spec-program-review

1. Catch designs that exceed the confirmed requirements.
2. Catch missing requirements or missing design.
3. Check that tests prove the claims.
4. Check whether diagrams genuinely explain the system.
5. Make the review useful to a human.

## Scenario ID hard cutover

The four in-scope skills use native Vitest name selection: `-t <resulting-scenario-id>`. `SKILL_PRESSURE_SCENARIO` selects legacy cases only and is not changed. Fixture metadata and the colocated `cases.ts` registry must use the same resulting ID. The cutover leaves no aliases.

| Current scenario ID | Current fixture | Disposition | Resulting stable scenario ID and fixture |
| --- | --- | --- | --- |
| `discuss-pathfinding-major-drift-boundary-reset` | `discuss-pathfinding/major-drift-boundary-reset.md` | split | `discuss-pathfinding-recover-after-major-misunderstanding` → `recover-after-major-misunderstanding.md`; `discuss-pathfinding-ask-related-questions-together` → `ask-related-questions-together.md` |
| `discuss-pathfinding-material-ambiguity` | `discuss-pathfinding/material-ambiguity.md` | rename | `discuss-pathfinding-explain-meaningful-choice` → `explain-meaningful-choice.md` |
| `discuss-pathfinding-provisional-caller-boundary` | `discuss-pathfinding/provisional-caller-boundary.md` | rename | `discuss-pathfinding-confirm-agent-summary` → `confirm-agent-summary.md` |
| `discuss-pathfinding-user-requirements-record` | `discuss-pathfinding/user-requirements-record.md` | rename | `discuss-pathfinding-gather-requirements-from-affected-people` → `gather-requirements-from-affected-people.md` |
| `spec-design-working-baseline-boundary` | `spec-design/working-baseline-boundary.md` | split | `spec-design-establish-requirements-boundary` → `establish-requirements-boundary.md`; `spec-design-keep-implementation-choices-out-of-requirements` → `keep-implementation-choices-out-of-requirements.md` |
| `spec-design-user-roots-and-views` | `spec-design/user-roots-and-views.md` | split | `spec-design-stay-within-confirmed-requirements` → `stay-within-confirmed-requirements.md`; `spec-design-separate-evidence-from-requirements` → `separate-evidence-from-requirements.md`; `spec-design-use-helpful-diagrams` → `use-helpful-diagrams.md` |
| `spec-design-declined-user-extraction` | `spec-design/declined-user-extraction.md` | retire and merge coverage | missing-information behavior moves into `spec-design-establish-requirements-boundary`; no replacement alias |
| `program-design-working-baseline-minimal-delta` | `program-design/working-baseline-minimal-delta.md` | split | `program-design-stay-within-specification` → `stay-within-specification.md`; `program-design-make-smallest-necessary-change` → `make-smallest-necessary-change.md`; `program-design-explain-design-choices-clearly` → `explain-design-choices-clearly.md` |
| `program-design-view-rendering-semantics` | `program-design/view-rendering-semantics.md` | split | `program-design-show-current-and-proposed-system` → `show-current-and-proposed-system.md`; `program-design-choose-helpful-diagrams` → `choose-helpful-diagrams.md` |
| `spec-program-review-baseline-and-proof-drift` | `spec-program-review/baseline-and-proof-drift.md` | split | `spec-program-review-find-unapproved-design` → `find-unapproved-design.md`; `spec-program-review-check-tests-match-claims` → `check-tests-match-claims.md` |
| `spec-program-review-scope-and-call-path` | `spec-program-review/scope-and-call-path.md` | replace and merge extra-design coverage | `spec-program-review-find-missing-requirements-or-design` → `find-missing-requirements-or-design.md` |
| `spec-program-review-reader-understanding` | `spec-program-review/reader-understanding.md` | split | `spec-program-review-check-diagrams-explain-system` → `check-diagrams-explain-system.md`; `spec-program-review-give-useful-findings` → `give-useful-findings.md` |

Cutover proof:

- zero active references to the 12 retired IDs outside historical artifacts and this cutover ledger;
- exactly one colocated registry entry for each resulting fixture;
- 20 globally unique resulting IDs;
- focused native Vitest selection works with `-t <resulting-scenario-id>`;
- scenario matrix and direct documentation examples use resulting IDs only.

## Per-run surface allocation

### discuss-pathfinding

- Trigger: unchanged.
- Main path: remove the rigid one-topic-per-turn label; allow related questions in one round; retain the protection against walls of unrelated questions; require a conversational diagram when it materially improves understanding.
- Depth: update `references/question-craft.md` and any directly affected user-requirements wording.
- Proof: five plain-language scenarios, including a dedicated default-behavior question-grouping case with no prompt override.

Changed behavior owners:

| Behavior | Teaching owner | Change |
| --- | --- | --- |
| Related questions | `SKILL.md` conversational surface and step 4 | Amend the always-needed rule and completion boundary. |
| Question construction and dependent follow-ups | `references/question-craft.md` | Amend the detailed examples and stop rule. |
| Requirements boundary questions | `references/user-requirements-extraction.md` | Amend package/system-limit wording and remove unclear internal terminology. |
| Conversational diagrams | `SKILL.md` step 4 plus shared diagram-rendering reference | Retain medium-selection ownership; clarify the human-understanding predicate and required return. |

### spec-design

- Trigger: unchanged.
- Main path: make the requirements boundary and route back to pathfinding understandable in ordinary language; preserve requirements/specification ownership.
- Depth: update only references whose diagram or requirements wording conflicts with the accepted behavior.
- Proof: five scenarios separating boundary, authority, diagram, and implementation-detail failures.

Changed behavior owners:

| Behavior | Teaching owner | Change |
| --- | --- | --- |
| Requirements boundary and pathfinding return | `SKILL.md` source classification, boundary check 1, and re-entry rules | Amend user-facing wording and distinguish owner-set implementation limits from product behavior. |
| Requirements derivation | `references/requirements-and-traceability.md` and current user-requirements source contract | Retain ownership; remove unclear labels only where they obscure the required result. |
| Specification diagrams | `SKILL.md` Required Views and artifact assembly | Retain predicates; state the reader question each selected view answers. |
| Diagram medium and validation | `shared-references/diagram-rendering-and-fallbacks.md` | Retain shared rendering ownership; do not duplicate it in scenarios. |

### program-design

- Trigger: unchanged.
- Main path: state the current-system, scope, smallest-change, diagram-selection, and human-explanation obligations plainly.
- Depth: update only directly conflicting diagram/reference wording.
- Proof: five scenarios separating scope, smallest-change, current/proposed explanation, diagram selection, and plain-language tradeoffs.

Changed behavior owners:

| Behavior | Teaching owner | Change |
| --- | --- | --- |
| Stay inside specification and owner limits | `SKILL.md` governing-input and re-anchor steps | Amend plain-language return and package/system-limit handling. |
| Smallest necessary design | `SKILL.md` existing-foundation and target-composition steps | Replace unclear labels while retaining the removal test. |
| Current/proposed explanation | `references/current-system-model.md` and `SKILL.md` call-path steps | Retain source and call-path ownership; make the human-readable result explicit. |
| Diagram choice and validation | `SKILL.md` Required Views plus `references/artifact-and-self-review.md` | Retain view predicates and teaching; clarify which reader question each view answers. |

### spec-program-review

- Trigger: unchanged.
- Main path: require plain findings, requirements/design boundary checks, claim-matched tests, and diagram-quality review.
- Depth: update only directly conflicting reader-understanding or review wording.
- Proof: five scenarios separating added scope, missing coverage, insufficient tests, diagram usefulness, and human-useful findings.

Changed behavior owners:

| Behavior | Teaching owner | Change |
| --- | --- | --- |
| Requirements/design boundary review | `SKILL.md` source reconstruction and review questions | Amend wording and require the agreed starting point and owner limits to be stated plainly. |
| Tests match claims | `SKILL.md` review completeness and proof checks | Replace unclear labels with the concrete claim-to-test comparison. |
| Diagram usefulness | `references/lanes/reader-understanding.md` | Retain inspection targets, good/bad signals, and stop condition; strengthen text/diagram agreement. |
| Human-useful findings | `SKILL.md` result and reduction contract | Require ordinary descriptions of problem, consequence, smallest correction, and confirming evidence. |

## Authoring basis and proof plan

Authoring basis: observed failures plus user-directed corrections.

- Reproduce the current pathfinding question-grouping failure by removing the prompt override and running the focused case against the current skill.
- Treat the existing jargon-heavy source and evaluator labels as source evidence; static search proves their presence but not behavior.
- Run each changed scenario with Luna high as subject and Terra medium as judge.
- Read every result; do not accept regex or a passing score without inspecting the response and judge rationale.
- After all four runs, run unit tests, TypeScript, the 20 focused scenarios through native Vitest `-t` selection and scheduling, and an independent review of all changed skills and tests.

## Coordination

- Base branch: `feat/expand-four-skill-pressure-evals`
- Base commit: `cf62ed5149098a22906fbd8457e9d8cba790d755`
- Existing PR: `#41`
- Pending edits: this proposal only before spec review; skill and test edits begin after acceptance.
- Version and changelog: bump `shravan-dev-workflow` once from `1.7.9` after all four runs; add one dated changelog entry covering all four skills and pressure scenarios.
- Review: proposal review before edits; one implementation review per skill run; final combined implementation review before push.

## Non-goals

- no new skill;
- no new evaluator framework or runner;
- no hashes, digests, compatibility layer, or report format;
- no changes outside the four skills, their directly owned references, pressure scenarios, direct scenario selectors/documentation references required by the one-time ID cutover, final plugin metadata, and changelog;
- no claim that 20 scenarios exhaust every possible behavior of the four skills.

## Spec-review record

- accepted revision: `plain-language-boundary-diagram-scenarios-r3`
- lanes and receipts:
  - `mental-model-fit`: complete, final r3 receipt, no findings;
  - `trigger-routing`: complete, unchanged trigger remains correctly routed, no findings;
  - `rule-agreement`: complete, final r3 receipt, 12-to-20 hard cutover verified, no findings;
  - `depth-coverage`: complete, r2 receipt, all 16 changed behaviors have existing teaching owners, no findings.
- verdict: `great`
- semantic coverage: asking related questions together and waiting on dependent follow-ups; owner-set package/system limits; requirements/specification/program boundaries; diagram responsibilities; plain-language output; exact 12-to-20 scenario cutover; proof and final review plan.
- accepted findings incorporated: distinguish answerable related questions from dependent follow-ups; name every teaching owner; make package permission an explicit scenario observable; define the exact no-alias scenario-ID cutover.
- rejected finding: removing package permission from the requirements boundary conflicts with the user's explicit requirement; the accepted revision records it as an owner-set implementation constraint rather than product behavior.
- acceptance: accepted-to-implement

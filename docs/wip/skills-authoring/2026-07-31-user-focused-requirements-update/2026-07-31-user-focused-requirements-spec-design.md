# Run B — spec-design User Roots and Why/What Views

Date: 2026-07-31
Status: proposed; pending `skills-creation` review
Classification: behavior-changing update to one named skill
Target skill: `spec-design`
Authoring basis: observed failure
Reproduction: reproduced in `sources/2026-07-31-perseus-human-document-review.md`, `sources/2026-07-31-artifact-fluff-prevention.md`, `sources/2026-07-31-perseus-requirements-fidelity-loss.md`, and `sources/2026-07-31-scope-inflation-session-analysis.md`; user direction supplies the accepted success definition
Proof posture: static and manual proof in this changeset; pressure scenarios authored but model execution deferred by explicit user direction as an accepted behavior-proof gap
Dependency: Run C `program-design` creates and teaches `shared-references/diagram-rendering-and-fallbacks.md` before this run consumes it.

## Promise and Success

This update helps agents reliably consume evidenced user and stakeholder needs as authoritative Why/What inputs, trace them through observable obligations, and render only the specification views that expose load-bearing relationships.

Success means `spec-design` accepts a pathfinding record or equivalent source without demanding one file format; routes missing owner meaning or evidence honestly; traces user-facing requirements from stable U rows through P→O→R→C→V; and explains the Why/What so a human can confirm or correct who is affected, what is wrong today, what must become true, what must not change, and how success and failure will be observed. Before deriving normative obligations, it consumes or establishes the confirmed goal boundary and complexity budget. Views make load-bearing relationships easier to see without smuggling structural How into the specification. Workflow state and repeated companion-document narration stay out of durable prose.

## Trigger Surface

Keep the skill both model- and user-invocable. Use this literal frontmatter:

```yaml
description: Use when defining or revising a specification's authoritative Why/What or semantically creating or correcting its journey maps, context diagrams, or requirement-coverage views, including the problem, consumers, outcomes, requirements, public or externally observable contracts, constraints, failure obligations, or proof obligations. Not for extracting tacit needs or unmade decisions, reconverging a drifted shared model, in-chat explanation with no durable specification artifact, pure format-only maintenance of settled specification artifacts, internal structural How, review-only requests, implementation planning, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
```

True prompts include “add a journey map to the spec,” “this context diagram omits an external consumer; correct it,” and “this journey map was requested in program design; place it in the correct authoritative artifact.” Preserve these boundaries:

- extracting unwritten human meaning belongs to `discuss-pathfinding`;
- in-chat explanation without a durable spec artifact belongs to `tui-presentation`;
- internal component, call, state, failure, or trust design belongs to `program-design`;
- pure format-only conversion of settled specification diagrams belongs to `docs-maintain`.

Do not add Why/What view terms to `program-design` frontmatter.

## Main-Path Surface

During authority and source intake, inspect whether the specification serves direct human users, developer users, customers/stakeholders, or operators and whether legitimate sources already establish their needs.

IF load-bearing user or stakeholder meaning is unwritten, use `discuss-pathfinding` with the user-requirements destination and return the complete record, record identity and rows, boundary-check-1 model, and either explicit owner confirmation of that same current model or the exact owner decision needed. Stop before normative derivation on the decision-needed branch. Classify the returned record in the governing-source inventory using this skill's existing source-classification procedure. A pathfinding record is accepted when it supplies an identity and inspectable location when a human must verify the source, affected classes, stable U identifiers, need/outcome and why it matters, row-level evidence and producer-owned authority state, priority and assigner, and unresolved hypotheses. An equivalent authoritative source need not use those field names or enums; normalize its meaning into stable specification identities, evidence/authority classifications, priorities, and gaps before normative derivation. A row is normative-eligible only when its normalized authority is `authorized`. If the user declines, re-evaluate the remaining sources:

- alternate authoritative source exists: continue from it;
- owner meaning is missing: return `decision-needed`;
- evidence required for a truthful obligation is missing: return `evidence-blocked`;
- only a non-load-bearing possibility remains: keep a visible hypothesis gap.

Decline itself selects no terminal label. Hypothesis-only needs never authorize normative requirements or `locally-ready`.

Before deriving normative requirements, require boundary check 1 from the accepted requirements source or perform the same compact check when the run begins from another governing source. `references/authority-and-problem-framing.md` owns the accepted shape, source precedence, foundation-versus-missing discrimination, good and bad complexity budgets, owner-confirmation rule, and stop conditions. Keep this at Why/What altitude: current capabilities and constraints are relevant; internal component design is not.

Show the boundary to the authorized owner and ask for confirmation or correction unless the exact current model was explicitly confirmed already. Confirmation state lives in the returned result. A new requirement outside the confirmed goal, affected classes, missing outcomes, non-goals, or complexity budget returns `decision-needed`; it is not normalized as specification completeness.

When revising existing artifacts, classify the requested correction before editing: requirements/Why/What, structural How, or both. “Remove unrelated concurrency, cleanup, reporter, or lifecycle machinery” is a How correction unless the owner explicitly changes users, outcomes, requirements, scenarios, defaults, or proof obligations. A How-only correction does not authorize `spec-design` to narrow or rewrite governing Why/What. When both change, settle and return the revised Why/What before `program-design` revises structural How.

For a semantic correction to an existing Why/What view, re-open its governing sources, re-run correction classification and the affected view predicate/semantic-field check, update the affected trace links, and run artifact self-review. Skip unrelated discovery and authoring stages unless the correction invalidates their source or decision result. Pure rendering-format changes remain `docs-maintain` work.

Using the comparison taught by `references/authority-and-problem-framing.md`, build the accepted requirements set from the current owner-confirmed requirements record and boundary-check-1 result. If they are unavailable, recover the last inspectable owner-accepted governing baseline; if neither exists or the sources conflict, return `decision-needed` with the authority conflict. Mutually narrowed current files never establish the baseline by themselves. The set carries affected classes, stable U/P/O/R/C/V identities and requirements, priorities and assigners, named variants such as skills or scenarios, customer defaults, observable contracts, constraints, and proof obligations. Reuse existing identifiers and coverage links; do not create a separate ledger or duplicate document. Compare the proposed specification with that set before returning it. Every removed or superseded item needs explicit owner authority.

Add a scan-visible Required Why/What Views section. Use a view only when it exposes a load-bearing relationship:

| View | Use when | Must expose |
| --- | --- | --- |
| journey map | per normative-eligible load-bearing direct-user class when the job has a material sequence or pain relationship and a view makes that relationship easier to confirm or correct | one view for that class exposing user-worded steps, observed pain and evidence, desired observable difference, and cited U rows; reuse or link a current requirements-level sequence when it already exposes these fields, and keep the record as the normative home |
| context diagram | two or more external consumers or observable surfaces exist | consumers and stakeholders, observable surfaces/contracts, relevant negative space; the system remains one opaque node |
| requirement coverage table | material requirements exist | U when present, P, O, R, C, and V links plus gaps |

The Required Why/What Views table is the sole owner of view predicates and must-expose fields. The first internal component, owner, dependency edge, state store, or enforcement point inside the system crosses into `program-design`. Diagrams never become the only home of normative meaning.

During artifact authoring, IF one or more Required Why/What Views predicates fire, load `../../shared-references/diagram-rendering-and-fallbacks.md` before `references/artifact-and-self-review.md` and return the selected medium, fallback decision, semantic-preservation result, and visual-check result for each fired view predicate. MUST load `references/artifact-and-self-review.md` with the selected predicates, required semantic fields, and rendering results—or the explicit empty view decision when no predicate fires—and return the structure decision, trace/navigation result, view-verification result, pruned elements, and artifact identity. Do not invoke the renderer without a view request.

Author top-down. Begin with the smallest Why/What map a human needs to confirm the problem and intended outcome, then reveal requirements, observable contracts, failures, constraints, and proof. Link every normative-eligible U row to the specification obligation it authorizes. When a program design exists, expose one compact `requirements -> specification -> program design` link chain without copying its How into the specification.

Apply the goal-relevance test while deriving each requirement, observable contract, failure obligation, constraint, and proof obligation: name the confirmed need or governing obligation it serves and what becomes observably false or unverifiable if it is removed. Remove an element that changes neither the confirmed outcome nor a necessary truth boundary. The test prevents plausible adjacent work from becoming normative merely because a template has a place for it.

When detailed cases or contracts make coverage expensive to verify, add one compact crosswalk from customer/developer job and U/requirement identifiers to the observable scenario or contract and proof obligation. The crosswalk points to detailed normative definitions rather than replacing them.

After authority/source intake and before normative requirements are derived, substantial or uncertain work may stage research notes, source inventories, alternative wording, prototype views, and temporary U→P→O→R→C→V crosswalks in private working state, the repository's ignored scratch convention, or `tmp/design-workflows/<date>-<slug>/`. The requirements pass consumes a working comparison that identifies the selected source-to-obligation mapping, discarded formulations, authority/evidence gaps, and the basis for each choice. Scratch persistence is optional; the comparison result is not. Promote only verified and accepted meaning into the specification. Quick work keeps the comparison in working state, and the final artifact must be understandable without scratch; scratch never becomes a second normative home.

Update the all-run Terminal Contract, stage-1 target classification, and completion blockers together. Target classification, governing-source identities, source and review coverage, author self-check, readiness, and other run state are required fields of the returned result. Record target classification there, not as artifact prose. Compact durable metadata may identify the artifact and governing sources for lookup but cannot satisfy the return contract. Block completion when required return state is missing or when authoring, review, acceptance, or PR workflow narration appears as specification prose.

## Depth Surface

### authority-and-problem-framing.md

Teach class separation for end users, developer users, customers/stakeholders, operators, and downstream agents. Good framing identifies a class, observable job or outcome, evidence, and authority state. Bad framing says “users want exports” or converts a buyer into generic decision authority without capturing their need or constraint. Own the boundary-check-1 acceptance and accepted-requirements-set recovery procedure: inspect the owner-confirmed current record first, fall back only to an inspectable owner-accepted governing baseline, compare every required field and stable identity, and stop on missing or conflicting authority rather than trusting mutually narrowed current files.

The minimum accepted user-requirements source contract stays owned by `SKILL.md`; cite it here without restating its fields. Teach how to inspect a pathfinding record or equivalent source against that contract, including whether the claimed location is usable, whether producer-owned authority is evidenced, and whether unresolved hypotheses stayed non-normative. Source classification remains a separate `spec-design` governing-inventory decision.

### requirements-and-traceability.md

When normative-eligible user-requirements rows with authority state `authorized` exist, extend the operative chain to:

```text
user or stakeholder need U1
  -> problem P1
      -> outcome O1
          -> requirement R1
              -> observable contract C1
                  -> proof-obligation slot V1
```

User-facing requirement rows cite U identifiers. Flag a missing U citation when normative-eligible rows exist; flag a hypothesis-derived normative requirement; and flag a declined-route requirement that cites neither an alternative authority nor the exact decision/evidence gap. Preserve bidirectional traceability and stakeholder classes even when no journey map applies.

Do not add a separate optional `user goal / benefit` field to observable contracts. The U root already carries that meaning.

### artifact-and-self-review.md

Cite the Required Why/What Views table without restating its predicates or must-expose fields. Teach good/bad signals, altitude crossing, and stop conditions. The view set is complete when each fired predicate has the number of semantically complete views its table row requires and no view adds only decoration. Journey maps cite U rows. Context diagrams stop at the opaque system boundary. Coverage tables expose missing links rather than hiding them.

Consume the shared rendering result rather than owning media-selection prose. A visual check must reject malformed, unreadable, decorative, or semantically incomplete output and use the returned fallback.

Separate the durable artifact from the returned workflow result. The artifact carries authoritative Why/What, a governing-source pointer or lifecycle field only when readers or tooling genuinely use it for authoritative lookup, and the smallest useful companion navigation. Target classification, source/review coverage, self-check state, readiness, and acceptance narration stay in the returned result rather than narrative sections. Do not change `Status: Draft for review` to `Status: Accepted` merely to record a review outcome.

Apply the human deletion test to every heading, paragraph, list, table, and diagram. Deletion is valid only when it changes no human confirmation, correction, decision, trace, failure simulation, proof path, or later authoritative lookup. Protected examples include authoritative provenance and negative space; problems, outcomes, requirements, observable contracts, failure obligations, constraints, and proof obligations; and the rationale, example, or relationship a human needs to reconstruct or challenge them. Across companion documents, give shared authority or boundary meaning one smallest useful home and link to it elsewhere. Flag process/review/PR narration, sibling-role recitals, summaries that merely repeat the preceding model, and decorative views. Do not use word counts, mandatory headings, sentence quotas, or blanket token bans; domain terms such as acceptance remain valid when they describe the product contract rather than the authoring workflow.

Choose the clearest expression for each piece of Why/What: plain prose for one obligation or rationale, concrete examples for observable behavior, a table for exact requirement/contract/proof mappings, a journey for user experience over time, and a context view for external relationships. Use plain domain words and explain necessary terms. Remove formal-sounding paragraphs and jargon that add no requirement, decision, boundary, rationale, example, relationship, or correction point.

Make each heading say what the human will learn or decide in that section. Do not compress several internal workflow terms into a title. Keep readiness, review, acceptance, and downstream documentation work in the returned result or later workflow unless the specification itself governs that observable behavior.

Finish with the human confirmation check: after reading the artifact, a human can restate the intended users, current problem, desired outcome, obligations, negative space, normal/failure behavior, and proof—and can point to the exact claim they would correct if the agent misunderstood them. If those answers require review notes, workflow receipts, jargon decoding, or inference across repeated prose, the artifact is not ready.

The human confirmation check also compares the finished specification to boundary check 1. List any requirement or proof obligation that changes the confirmed goal, missing pieces, non-goals, or complexity budget. Such a change requires an owner decision before the specification can return locally ready.

For a simplification request, report accepted-requirements coverage separately from prose/mechanism deletion. The artifact may become much shorter while preserving every accepted obligation. A smaller file with fewer accepted users, skill variants, defaults, scenarios, or proof obligations is scope loss, not successful pruning.

The progressive-disclosure check also passes: a human can enter from the cited user requirements, see the smallest useful Why/What overview, follow U→P→O→R→C→V into detail, and continue to the linked program design when present. Missing links or repeated substitute prose fail the check.

Audit every selected view for direction, timing, ownership, cardinality, and failure meaning. A view that introduces a false third layer, early terminal transition, reversed edge, or duplicate state authority fails even when its labels are individually present.

## Proof Surface

Add deferred pressure scenarios for already-authoritative sources, declined extraction across all four outcomes, direct user versus stakeholder retention, mixed-authority rows, two load-bearing direct-user classes, U-root traceability, each view predicate, a semantic view-only correction, context-altitude crossing, semantic specification-diagram routing, an unconfirmed adjacent requirement, a vague complexity budget, bait that asks for purpose/completion/process or acceptance-status sections, and a How-only simplification request against an accepted six-skill contract. Add static checks that required source normalization, boundary-check ownership and fields, explicit confirmation, correction classification and ordering, accepted-requirements recovery/coverage, goal-relevance reduction, trace fields, predicate ownership, view cardinality, shared-reference call, semantic-field checks, trigger metadata, returned-result/artifact separation, and reader-facing deletion coverage remain aligned. Manually preview one Mermaid context view, one Markdown coverage table, and one plain-text fallback, then confirm that a review verdict does not mutate durable document status and that an accepted six-skill set cannot return ready as an Upload-only specification even when the current requirements/specification pair was mutually narrowed. By explicit user direction, do not run model pressure tests; report behavior proof as a user-accepted deferred gap.

## Implementation Boundary

Expected changed homes: `spec-design/SKILL.md`, including frontmatter, Terminal Contract, stage-1 run-state home, boundary check 1 admission, correction classification, accepted-requirements check, Required Why/What Views, artifact call, scratch guidance, and completion blockers; `references/authority-and-problem-framing.md`; `references/requirements-and-traceability.md`; `references/artifact-and-self-review.md`; shared rendering reference consumption; optional ignored `tmp/design-workflows/<date>-<slug>/` staging guidance; `agents/openai.yaml` if stale; static tests; deferred scenarios; version; changelog. Do not add structural component/call/state realization, alter `spec-program-review`, or change retired skills.

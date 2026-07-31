# Artifact and Author Self-Review

This reference owns artifact structure choice, normative-home integrity, navigation, view verification, pruning, and the author self-check.

Expected inputs: authority/problem model, outcomes/non-goals, requirement and contract inventories, cross-cutting obligations, proof coverage, and repo documentation conventions.

Return in workflow order: first the artifact structure decision, artifact identity, traceability/navigation result, view-verification result, and pruned elements; after the caller runs the complete author self-check stage, return the author self-check with exact gaps.

## Choose Structure for the Reader

A substantial specification normally needs semantic homes for:

```text
load-bearing decisions
problem and current observable reality
consumers and authority
goals, outcomes, success conditions
non-goals and negative space
source and decision basis
normative requirements
observable surface contracts
failure and partial-success expectations
cross-cutting obligations and constraints
proof obligations
resolved alternatives when they change meaning
open decisions, assumptions, and evidence gaps
```

These are not mandatory headings. Organize by journey, capability, protocol, domain, or decision when that better preserves the specification spine.

Use linked slice specifications only when a vertical capability, protocol, domain boundary, or independently governed contract has its own consumers and reason to change. Do not create appendix-style mini-doc sprawl or duplicate normative claims.

Keep target classification, source/review coverage, self-check state, readiness, acceptance narration, process history, advisor names, PR lifecycle, and research ledgers out of the design artifact. A compact source pointer may remain when readers or tooling use it for authoritative lookup. Rationale must stand on technical or product constraints.

## Navigation and Traceability

Lead with the smallest Why/What model that lets a human confirm the problem and intended outcome, then reveal requirements, observable contracts, failure behavior, constraints, and proof. Add a compact map when relationships are not obvious:

```text
need U1 when present
  -> problem P1
      -> outcome O1
          -> requirement R1
              -> contract C1
                  -> proof modality V1
```

Diagrams may explain relationships but may not be the only home of normative meaning.

## Apply Required Why/What Views

Consume the predicates, cardinality, and must-expose fields from the `SKILL.md` Required Why/What Views table without restating them. Consume the shared rendering results and reject any view with a missing semantic field, failed visual check, or unresolved fallback.

- Journey maps cite the stable U rows they re-render; the source record remains normative. Good steps express the user's job and observable pain. A screen tour or component name is not a journey.
- Context diagrams keep the system opaque and place external consumers, stakeholders, surfaces, contracts, and relevant non-consumers around the boundary. Internal components, owners, stores, or enforcement points are structural How and route to `program-design`.
- Requirement coverage tables expose missing U/P/O/R/C/V links rather than filling gaps with guessed meaning.

Prune a view that adds no decision clarity. View application is complete when every fired predicate has the required number of passed views, each required semantic field is visible, and adding another view would only duplicate an existing relationship.

## Human Deletion Test

For every heading, paragraph, list, table, and diagram, ask what first confirmation, correction, decision, trace, failure simulation, proof path, or later authoritative lookup becomes underdetermined if it disappears. Delete or merge the element when the answer is none.

Preserve authority and negative space; problems, outcomes, requirements, observable contracts, failure obligations, constraints, and proof; and the rationale, example, or relationship a human needs to challenge them. Flag process/review/PR narration, sibling-role recitals, summaries that repeat the preceding model, and decorative views. Across companion documents, give shared authority or boundary meaning one smallest useful home and link to it elsewhere.

Use plain, specific headings that tell the reader what they will learn or decide. A specialized domain term is fine when it carries stable meaning; formal-sounding prose that adds no decision, relationship, rationale, boundary, example, or correction point is not.

## Author Self-Check

Re-read the complete artifact and record:

- source authority conflicts or stale evidence;
- missing problem/outcome/requirement/contract/proof links;
- vague, compound, or task-shaped requirements;
- missing negative, failure, partial-success, cancellation, or compatibility behavior;
- hidden internal How;
- contradictory goals and non-goals;
- unresolved questions disguised as assumptions;
- duplicated normative homes;
- missing, semantically incomplete, unreadable, or decorative Required Why/What Views;
- journey maps that fail to cite their U rows or context diagrams that cross into internal How;
- accepted requirements lost or superseded without owner authority;
- changes from boundary check 1 hidden as specification completeness;
- process state, obscure headings, repeated companion narration, or reader-facing elements that fail the human deletion test;
- whether a human can enter from the user requirements, understand the smallest Why/What model, follow U→P→O→R→C→V into detail, and continue to program design without review notes or scratch.

For a simplification request, report accepted-requirements coverage separately from prose or mechanism deletion. A shorter artifact that loses users, variants, defaults, scenarios, contracts, or proof obligations is scope loss, not pruning.

Record exact failures, not “needs more detail.”

Self-check is author evidence only. It never substitutes for fresh independent review.

Complete when: the artifact has one normative home per meaning, the reader can navigate need to proof, every reader-facing element earns its attention cost, boundary and accepted-requirements coverage are intact, and the self-check names every known gap.

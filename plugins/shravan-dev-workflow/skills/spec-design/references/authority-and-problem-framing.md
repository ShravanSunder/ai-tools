# Authority and Problem Framing

This reference owns source classification, decision authority, consumer framing, and the current/desired observable gap.

Expected inputs: bounded request, current artifact when revising, candidate sources, repo instructions, and known decision makers.

Return in workflow order:

1. Artifact boundary, consumers, decision authority, governing-source identities/classes and current applicability, confirmed goal boundary, and accepted-requirements recovery.
2. After the caller completes problem modeling, the complete authority/problem model with current reality, desired gap, important decisions, conflicts, and evidence gaps.

## Classify Sources

```text
normative      authorized requirement or binding constraint
observational  evidence about current behavior, cost, or need
advisory       recommendation, prior art, or candidate direction
conflicting    sources disagree and authority must be resolved
unknown        provenance or decision power is unclear
```

Code proves current behavior; it does not automatically prove desired behavior. External documentation can be normative for a mandated platform contract and merely advisory for a product choice. A prior specification remains normative only to the extent its authority and current applicability still hold.

Good:

- “The published protocol requires duplicate request IDs to return the original result” is normative when that protocol governs the product.
- “The current handler retries twice” is observational until an authorized compatibility promise adopts it.
- “Library X recommends optimistic updates” is advisory unless the product contract mandates that behavior.

Bad:

- treating the most detailed source as the most authoritative;
- converting current implementation accidents into requirements;
- presenting an author recommendation as a user decision;
- using “industry best practice” without transfer assumptions.

## Frame the Problem

Classify affected people before describing the gap: end users, developer users consuming an API/CLI/SDK, customers or buyers, operators, and downstream agents may carry different jobs, evidence, authority, and constraints. Preserve customers as stakeholders even when they never operate the surface; do not erase their need or fabricate a direct-user journey.

Good: “Analyst class exports weekly for compliance; support tickets show the current export misses the deadline; the operations owner authorizes the desired timing.”

Bad: “Users want exports,” or treating a buyer as generic decision authority without capturing the buyer's need and affected outcome.

Describe:

```text
consumer or operator
current observable journey
failure, cost, or missed outcome
boundary where it is observed
evidence and freshness
desired observable difference
hypotheses that remain unproven
```

Separate symptom, cause, and requested mechanism. The specification may state an observable problem without proving implementation root cause. It may not use an unproven root cause to authorize product behavior.

## Admit Or Materialize Requirements

Use the minimum accepted user-requirements source contract owned by `spec-design/SKILL.md`; do not require an equivalent source to reproduce the pathfinding document shape. Inspect row-level evidence and producer-owned authority independently, then classify the source itself in the governing-source inventory using Classify Sources above.

Only rows whose producer-owned authority state is `authorized` are normative-eligible. Observational evidence can prove a current pain without authorizing desired product meaning. Advisory and unresolved rows remain visible inputs or gaps.

Choose exactly one Requirements identity:

```text
one qualifying authoritative Requirements source exists
  -> admit and reuse that identity

settled authoritative meaning exists but has no qualifying Requirements home
  -> materialize one normalized Requirements artifact from that meaning

owner meaning is unwritten or undecided
  -> use discuss-pathfinding and consume its returned record
```

Qualification requires the minimum source contract, an inspectable location when a human must verify it, current applicability, and authority sufficient for every normative-eligible row. A governing source titled “requirements” does not qualify when it actually serves as the observable Specification contract or collapses both roles.

Normalization organizes already-settled authoritative meaning into the minimum contract. It may preserve explicit gaps, but it may not ask, answer, infer, or confirm missing owner meaning. Route such meaning through `discuss-pathfinding`, then consume the returned clarification in the Requirements or Specification home that owns it.

For substantial file-backed work, the admitted or materialized Requirements identity must be present, resolvable, and different from the Specification artifact. Never create a duplicate Requirements artifact when a qualifying identity already exists.

Good: a mixed record retains observational and hypothesis rows while requirements cite only authorized U rows.

Bad: assigning one aggregate authority label to a mixed record, silently promoting evidence to authority, discarding stakeholder rows because no journey applies, duplicating an admitted Requirements source, or using one `Requirements/spec` artifact for both identities.

## Confirm the Goal Boundary

Before normative derivation, inspect the confirmed goal boundary returned by `discuss-pathfinding` or established by an equivalent authoritative governing source:

```text
primary customer, developer, contract, or library goal
affected classes and outcomes
existing behavior or foundation to reuse
actual missing capabilities or observable differences
allowed and protected system or capability surface
owner-set repository, package, fork, or module limits when material
explicit non-goals
acceptable complexity and the machinery that reopens scope
acceptable outcome-level evidence
unresolved owner choices or evidence gaps
```

Apply these rules without designing internal components:

- Distinguish the current foundation from the missing outcome.
- Ask which repositories, packages, forks, or modules may change when the owner already has such a limit or leaving it open could materially expand the work.
- Record a package answer as an implementation boundary, not as product behavior or permission to invent internal structure.
- Otherwise preserve the higher-level system or capability boundary for `program-design` to realize.

Good: “extend the existing runner for the confirmed customer scenarios; package A may change, package B is protected; no run database, certification, or cross-run governance.”

Bad: “production-ready and complete,” which cannot reject adjacent machinery.

Prefer the exact current model already confirmed by its authorized owner. If no current authoritative source establishes the complete boundary, return its exact missing fields through `discuss-pathfinding`; `spec-design` does not establish or confirm the boundary itself. Silence, delegation, vague assent, and the author's own restatement do not confirm the goal boundary. A requirement outside the confirmed goal boundary returns the exact owner decision needed.

## Recover And Compare Accepted Requirements

Use this precedence:

```text
current owner-confirmed requirements record plus confirmed goal boundary
  -> otherwise last inspectable owner-accepted governing source
      -> otherwise authority conflict and decision-needed
```

Mutually narrowed current requirements, specification, or program-design files never establish the baseline by themselves. Consume the accepted-requirements fields owned by `spec-design/SKILL.md`; do not duplicate them here or create a ledger. Compare stable identities, coverage, and authoritative meaning. Every removed or superseded item needs explicit owner authority.

Good: a simplification removes five mechanisms while every accepted user, variant, default, scenario, contract, and proof obligation remains covered.

Bad: a coherent Upload-only pair is treated as the baseline after the current requirements and specification both silently lost the other five accepted skills.

Stop when the current confirmed source or the last accepted baseline establishes the complete set and all conflicts are resolved. Return the recovered set and coverage gaps; never guess through missing authority.

## Resolve Authority

Look up facts first. Ask only for decisions legitimate sources cannot make.

For a load-bearing decision, record:

```text
decision
authorized decision maker
options
recommendation and evidence
gain / cost / foreclosed choice per option
deferral consequence
durable decision source or current confirmation identity
```

A paraphrase by the author is not evidence that a user chose it. Vague assent, delegation, silence, or topic change does not settle the branch.

Complete when:

- every important source is classified;
- every product decision has inspectable authority or an exact gap;
- user and stakeholder classes remain distinct;
- normative-eligible rows are identifiable by stable U identifier;
- one qualifying Requirements identity is admitted or materialized without duplication or invented owner meaning;
- substantial file-backed work has a planned Specification identity different from the Requirements identity;
- the goal boundary is established by `discuss-pathfinding` or an equivalent authoritative governing source and explicitly confirmed or corrected by the authorized owner;
- the accepted requirements set is recoverable and compared;
- the current/desired problem is observable without assuming the solution.

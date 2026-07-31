# Authority and Problem Framing

This reference owns source classification, decision authority, consumer framing, and the current/desired observable gap.

Expected inputs: bounded request, current artifact when revising, candidate sources, repo instructions, and known decision makers.

Return in workflow order: first the artifact boundary, consumers, decision authority, and immutable source inventory/classes; after the caller completes problem modeling, return the complete authority/problem model with current reality, desired gap, load-bearing decisions, conflicts, and evidence gaps. Each source row records exact identity, version or digest, authority status, freshness/applicability, and the scoped-completeness basis that explains why the inventory covers every governing source in scope.

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

## Accept User-Requirements Sources

Use the minimum accepted user-requirements source contract owned by `spec-design/SKILL.md`; do not require an equivalent source to reproduce the pathfinding document shape. Inspect row-level evidence and producer-owned authority independently, then classify the source itself in the governing-source inventory using Classify Sources above.

Only rows whose producer-owned authority state is `authorized` are normative-eligible. Observational evidence can prove a current pain without authorizing desired product meaning. Advisory and unresolved rows remain visible inputs or gaps.

Good: a mixed record retains observational and hypothesis rows while requirements cite only authorized U rows.

Bad: assigning one aggregate authority label to a mixed record, silently promoting evidence to authority, or discarding stakeholder rows because no journey applies.

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

Complete when: every load-bearing source is classified, every product decision has inspectable authority or an exact gap, user/stakeholder classes remain distinct, normative-eligible rows are identifiable by stable U identifier, and the current/desired problem is observable without assuming the solution.

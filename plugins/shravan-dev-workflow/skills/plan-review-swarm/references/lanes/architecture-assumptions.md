# architecture-assumptions

Status: default focused lane for substantial plan review.

This lane follows `../lane-judgment-cards.md`: use the shared plan-review
packet for mechanics, and use this file for the architecture judgment.

## Lens

Find places where the implementation plan depends on architecture facts that
may not be true.

This is not an architecture taste review. You are checking whether the plan
names real modules, owners, interfaces, state stores, integration points, and
dependency directions, or whether it quietly asks implementation agents to
invent those decisions while coding.

## Why This Exists

Plans become write instructions. If a plan points at the wrong owner, invents a
module as if it already exists, crosses a dependency direction, or splits one
state owner across parallel tasks, implementation agents will produce coupling
and duplicate ownership even when each task looks reasonable in isolation.

## Where To Look

Read in this order:

1. Accepted source artifact:
   - boundary claims;
   - named owners, interfaces, non-goals, and architecture constraints;
   - decisions the plan must preserve.
2. Produced plan:
   - every task that names a module, package, API, state store, protocol, event,
     shared helper, dependency direction, or integration point;
   - write scopes and parallel lanes that touch related surfaces.
3. Live repo evidence:
   - paths, symbols, docs, tests, package boundaries, and existing callers for
     the names in the plan;
   - nearby patterns only when they show current ownership or allowed access.

Evidence priority:
1. Live repo anchors for named modules, interfaces, callers, tests, and docs.
2. Accepted source artifact boundary and non-goal claims.
3. Produced plan write scopes, tasks, slice boundaries, and parallel lanes.
4. Sibling lane outputs only as candidate contradictions.

## How To Analyze

For each architecture claim in the plan, do the actual lookup. Do not stop at
the noun.

1. Extract the claim:
   - "Task B updates `router/runtime`";
   - "quota state lives in account snapshots";
   - "Bridge owns review item selection";
   - "add shared helper used by two packages".
2. Search the repo for the named thing and its closest owner.
3. Check how current callers interact with it.
4. Compare the plan's write path to the existing owner/interface.
5. Check whether the source artifact explicitly creates a new owner or changes
   an old boundary.
6. Decide whether implementation can follow the plan without inventing missing
   architecture.

Use this classification:

| Classification | What it means | Reviewer action |
| --- | --- | --- |
| Anchored | The repo has the named surface, and the plan uses the current owner/interface. | Usually fine; cite only if it explains a risk. |
| Intentionally created | The surface does not exist, but the source/plan explicitly creates it and names ownership. | Check integration points and proof gates. |
| Misanchored | The surface exists, but the plan points at the wrong owner, caller path, or interface. | Finding: implementation will edit the wrong place. |
| Invented silently | The plan assumes a surface exists, but repo/source evidence does not show it and the plan does not create it. | Finding: design work is hidden inside implementation. |
| Boundary conflict | The plan crosses an ownership or dependency direction the source/repo says should not be crossed. | Finding: plan needs a different slice or explicit architecture decision. |

## Prioritized smells / failure signals:

- A plan task names an architecture surface but gives no file, symbol, doc, or
  source anchor that proves it exists.
- A task writes through one layer while the repo's callers go through another.
- Two tasks or slices become owners of the same state, event, schema, or
  selection decision.
- The plan says "use existing patterns" but does not name the pattern or path.
- A new shared helper is justified by convenience rather than a repeated
  responsibility or source requirement.
- Parallel work touches one integration contract without a serial checkpoint.
- The accepted source artifact leaves ownership undecided, but the plan chooses
  an owner silently.

## Judgment Calibration

- Blocker: the plan depends on a nonexistent surface, wrong owner, forbidden
  dependency edge, or duplicated state owner.
- Important: the plan may work, but implementation agents would have to infer
  the owner, interface, or integration path.
- Question: the source artifact never decided the architecture boundary, so the
  plan cannot decide it as an implementation detail.
- Noise: alternative architecture taste, naming preference, or broad refactor
  that is not required by the accepted source artifact.

## Useful Evidence To Return

Return evidence that helps the plan creator repair the plan:

- plan claim;
- accepted source anchor;
- repo anchor found, or exact search/path showing no anchor;
- current owner/interface/caller path when found;
- mismatch or missing decision;
- smallest plan edit, or source question if the source artifact must decide
  first.

## Boundaries

Overlap boundary:
If the issue is missing source-obligation coverage, hand it to
`spec-compliance`. If it is worker ordering, write-scope ambiguity, or
integration sequencing, hand it to `execution-scope`. If it is security
authority, secret handling, or failure-mode reliability, hand it to
`security-reliability`.

Cannot-verify boundary:
Use `cannot_verify_from_focused_packet` when the claim requires whole-plan slice
composition, full dependency DAG analysis, implementation diff review, or source
artifacts not supplied to this lane.

## Good / Bad Findings

Good finding:

```text
The plan assigns quota routing to `router/runtime`, but the repo shows account
selection is owned by `accounts/service` and callers use `AccountSelector`. The
accepted source says account selection must remain account-layer owned. If the
runtime slice implements selection directly, it duplicates ownership. Move the
selection work into the account-service slice and make runtime consume the
selector interface.
```

Bad finding:

```text
Architecture ownership is unclear and should be improved.
```

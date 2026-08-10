# One Implementation Plan

This reference owns the one active implementation-plan contract shared by plan producers, carriers, executors, and reviewers. A completed plan is immutable path-addressed intended work, not a lifecycle ledger. Return its record unchanged to every consumer.

## Inspect the Current Sources

Before producing or validating a completed plan, inspect governing authority, current branch/HEAD, repository instructions, owners, paths, interfaces, tests, commands, proof obligations, security boundaries, and any existing completed plan.

`plan-implementation` admits current reviewed three-artifact design and, for an orchestrated repository-improvement goal or owner-requested delivery of a direct improvement result, the complete current admitted-finding return from `plan-improve-repo`. Direct `plan-improve-repo` use separately admits its current design-ready or implementation-mechanics-only basis and defaults to `plan-only`.

## Canonical Result

A ready plan returns:

```text
plan path: <sole Markdown document identity>
originating planner: plan-implementation | plan-improve-repo
planning result: ready
governing planning basis:
  kind: reviewed-three-artifact-design
  Requirements, Specification, Program Design paths
  current three-artifact review/remediation result identities
  current applicability anchors
or:
  kind: admitted-repository-improvement
  admitted finding pointer
  basis classification: current-three-artifact-design-ready |
                        implementation-mechanics-only
  basis evidence pointers
  current applicability anchors
delivery context:
  requested terminal: plan-only | pr-ready-unmerged
  delivery grouping: single:<name> | selected:<option-name>
  PR topology: not-applicable | one-pr | separate-prs
```

The plan file records the same governing basis and delivery context. These values are immutable plan meaning, not progress. A meaning change creates a new plan path. Never compute a plan hash or digest or add approval chronology, progress, reviewer status, PR state, or tracker state.

Unsettled planning returns no fabricated ready record:

```text
planning result: revision-requested | blocked
plan identity: none | <already-existing canonical ready record, unchanged>
result payload:
  revision-requested: exact correction and semantic or planning owner
  blocked: exact blocker evidence and unblock owner
```

## Delivery Intent and Grouping

`orchestrator-goal` defaults the requested terminal to `pr-ready-unmerged` unless the user supplied a narrower terminal. Direct planning uses an explicit terminal or asks once at entry when ambiguous. `plan-improve-repo` defaults direct use to `plan-only`.

Planning chooses technical strategy and the one coherent vertical grouping when only one exists. When materially different grouping or PR-topology options exist, it presents concrete choices, a recommendation, and tradeoffs, then waits for the owner selection before returning `ready`. One indivisible deliverable defaults to one PR. Do not ask about ordinary file, sequence, code, or proof mechanics.

Optional tracking remains outside this record. At planning entry, preserve an existing tracking selection or offer once between no tracking and one available named `ops-*` owner. No tracking continues immediately. A named selection is returned as separate current call context for the goal or direct-planning caller to invoke; tracker state never gates delivery.

## Plan Home

For every `pr-ready-unmerged` plan, including orchestrated goals and direct continued-delivery planning, `plan-implementation` writes exactly one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md` plan. Before writing, it verifies that project ignore policy covers `tmp/*` equivalently and adds `tmp/*` to project `.gitignore` only when coverage is absent. It never uses `.git/info/exclude`, a checked-in plan home, or a user-global fallback.

Direct plan-only work may use an established repository plan home. Otherwise use `docs/specs/<spec>/plans/` for durable direct planning or `<repo-root>/tmp/plan-workflows/` for temporary/advisory work.

Every plan includes its result, governing basis, delivery context, planned-at branch/HEAD, goal, scope/non-goals, current evidence, write surfaces, proof-bearing slices, necessary dependency edges, obligation-to-proof mapping, integration gates, risks, and stop/replan conditions.

## Preserve and Admit

Producers verify every field before returning. Carriers preserve the record unchanged and never repair a mismatch. A missing path, later meaning change, stale governing basis, incomplete delivery context, or missing required field is a blocking discrepancy returned to the originating planner or exact semantic owner.

An executor returns exactly one:

- `admit`: result is `ready`; terminal is `pr-ready-unmerged`; the plan resolves; opened plan, governing basis, and delivery context agree; authority and repository source remain current; and no real design, proof, authority, or environment blocker is open.
- `route`: result is `revision-requested`; return its exact correction and originating planner without execution depth.
- `blocked`: result is `blocked`, terminal is `plan-only`, plan identity is absent, or any record/basis/context/current-source check fails; return the exact discrepancy and owner.

Validation, handoff, tickets, tracker state, or plan completion never upgrade the requested terminal or repair the canonical record.

Good signals: one immutable plan path, current governing authority, complete delivery context, proof attached to obligations, only meaningful edges, explicit design-gap routes, and no redundant approval stop.

Bad signals: tickets as another plan, `Status: approved`, approval evidence, mutable progress, validation changing the result, document hashes, placeholder grouping/topology, inferred implementation authority, or a carrier silently repairing the plan.

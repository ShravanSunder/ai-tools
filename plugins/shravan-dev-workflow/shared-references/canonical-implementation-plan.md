# Breakdown and PR Implementation Plans

This reference owns two records shared by plan producers, carriers, executors, and reviewers: the breakdown, which maps one delivery into PR nodes, and the implementation plan, one per PR node. Each is immutable path-addressed intended work, not a lifecycle ledger. Return each record unchanged to every consumer.

## Inspect the Current Sources

Before producing or validating a completed plan, inspect governing authority, current branch/HEAD, repository instructions, owners, paths, interfaces, tests, commands, proof obligations, security boundaries, and any existing breakdown or completed plan.

The `originating planner` values name the two planners: `plan-implementation`, the design planner, and `plan-improve-repo`, the improvement planner. The design planner admits current reviewed three-artifact design and, for an orchestrated repository-improvement goal or owner-requested delivery of a direct improvement result, the complete current admitted-finding return from the improvement planner. Direct use of the improvement planner separately admits its current design-ready or implementation-mechanics-only basis and defaults to `plan-only`.

## Breakdown Record

A breakdown is one Markdown file per delivery, `<yyyy-mm-dd>-<slug>-breakdown.md`, written by Main, even when it has one node. It lives beside its plans (Plan Home). It records its admitted basis (reviewed design identities, or an admitted improvement pointer and basis class). It is `ready` when node ids are unique, dependencies are acyclic, every obligation of the admitted basis belongs to exactly one node or gate, every stack is linear, and every contract node names its consumers. A ready breakdown is immutable: a topology change writes a new breakdown and marks which nodes' plans it supersedes. Plans point up to their node; the breakdown never records plan paths, PR numbers, or progress.

```text
breakdown path: <plan home>/<yyyy-mm-dd>-<slug>-breakdown.md
breakdown result: ready
admitted basis: <Requirements, Specification, Program Design paths and review result>
            or: <admitted improvement pointer and basis class>
cut choice: <the chosen cut; alternatives and reason when materially different cuts exist>
nodes:
  - id: <node id>
    outcome: <what this PR makes true, in the owner's words>
    scope: <owner or component>
    rails: <obligation identities>
    write surface: <paths or globs>
    depends on: <node ids | none>
    stack: <stack id | none>
    kind: feature | contract | integration
    consumers: <node ids; contract nodes only>
integration gates:
  - meets: <node ids> · proof: <observation that shows them working together> · owner: Main
order: <node ids, riskiest unknown first among nodes whose prerequisites are met>
supersedes: none | <earlier breakdown path and the nodes whose plans it supersedes>
```

The breakdown's authority follows the admitted basis. A reviewed design supplies Program Design's owners and dependency edges as candidate cuts. An admitted `implementation-mechanics-only` improvement supplies its current-source ownership and applicability evidence, and planning invents no Program Design for it. A real missing structural decision returns `program-design-gap`.

A node is executable when its base exists: trunk contains every node it depends on, or, for a stack child, its parent PR has a head. The base is that trunk commit or that parent PR head. Each PR's plan is written when its node becomes executable; the first executable nodes' plans are written with the breakdown.

## Canonical Result

A ready plan belongs to one breakdown node and returns:

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
  breakdown: <breakdown path>
  node: <node id>
  base: <trunk commit | parent PR head>
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

## Delivery Intent and PR Cut

The caller supplies the requested terminal. Direct planning uses an explicit terminal or asks once at entry when ambiguous. The improvement planner defaults direct use to `plan-only`.

The breakdown owns PR boundaries and topology. When only one coherent cut exists, the breakdown uses it. When materially different cuts exist, planning picks one, records the choice, the alternatives, and the reason in the breakdown, and returns `ready`. One indivisible deliverable is one node. Each plan owns the technical strategy and slices for its one node. Do not ask about ordinary file, sequence, code, or proof mechanics.

Optional tracking remains outside this record. At planning entry, preserve an existing tracking selection or offer once between no tracking and one available named `ops-*` owner. No tracking continues immediately. A named selection is returned as separate current call context for the goal or direct-planning caller to invoke; tracker state never gates delivery.

## Plan Home

For every `pr-ready-unmerged` delivery, including orchestrated goals and direct continued-delivery planning, the design planner first resolves the project root, then verifies that the resolved project's ignore policy covers `tmp/*` equivalently, adds `tmp/*` to that project-root `.gitignore` only when coverage is absent, and finally writes the breakdown and one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-<node-id>.md` plan per executable node. It never uses `.git/info/exclude`, a checked-in plan home, or a user-global fallback.

Direct plan-only work may use an established repository plan home. Otherwise use `docs/specs/<spec>/plans/` for durable direct planning or `<repo-root>/tmp/plan-workflows/` for temporary/advisory work. In every home, the breakdown sits beside its plans.

Every plan includes its result, governing basis, delivery context with its breakdown, node, and base, planned-at branch/HEAD, goal, scope/non-goals, current evidence, write surfaces, proof-bearing slices each with its tier record, the throughput checkpoint, necessary dependency edges, obligation-to-proof mapping, integration gates, risks, and stop/replan conditions.

## Slice Tier Record

Every slice records `tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>`. A Workhorse slice passes Workhorse fit in `manage-agents`; a Daily-driver slice names its reason for leaving Luna: `owner recommended`, `judged tough: <why>`, or `Luna failed: <evidence>`. The implementer follows the record. A Workhorse slice that stops at a boundary, or an executor that disagrees with its record, returns to the originating planner as a plan defect; the implementer does not re-cut it.

Workhorse fit lives in `../skills/manage-agents/references/model-catalog.md`.

## Preserve and Admit

Producers verify every field of both records before returning. Carriers preserve the records unchanged and never repair a mismatch. A missing path, later meaning change, stale governing basis, incomplete delivery context, a breakdown that is not ready or does not list the plan's node, a base that is not the node's actual base, or a missing required field is a blocking discrepancy returned to the originating planner or exact semantic owner. A stack child whose parent head moves after its plan was written is stale under the same rule.

An executor returns exactly one:

- `admit`: result is `ready`; terminal is `pr-ready-unmerged`; the plan and its ready breakdown resolve; the breakdown lists the plan's node and the recorded base is that node's actual base; opened plan, governing basis, and delivery context agree; authority and repository source remain current; and no real design, proof, authority, or environment blocker is open.
- `route`: result is `revision-requested`; return its exact correction and originating planner without execution depth.
- `blocked`: result is `blocked`, terminal is `plan-only`, plan identity is absent, or any record/basis/context/current-source check fails; return the exact discrepancy and owner.

Validation, handoff, tickets, tracker state, or plan completion never upgrade the requested terminal or repair the canonical record.

Good signals: one ready breakdown per delivery, one immutable plan path per executable PR node, current governing authority, complete delivery context, proof attached to obligations, only meaningful edges, explicit design-gap routes, and no redundant approval stop.

Bad signals: a slice without a tier record, a Workhorse slice that misses a fit condition, tickets as another plan, `Status: approved`, approval evidence, mutable progress, validation changing the result, document hashes, PR grouping or topology inside a plan, a plan without its breakdown node and base, a breakdown that records plan paths, PR numbers, or progress, inferred implementation authority, or a carrier silently repairing the plan.

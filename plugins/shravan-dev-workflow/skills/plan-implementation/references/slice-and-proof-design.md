# Divide the Work and Attach Proof

Use this reference to cut a delivery into PR nodes and then turn each node's obligations into a proportional implementation sequence. Return the PR cut (nodes, planned independence, stacks, contract nodes, integration gates, order), then per plan the slice graph with each slice's tier record, the throughput checkpoint, obligation/proof mapping, necessary edges, integration gates, false-green risks, and any split or replan stop.

## Start From Obligations

Build a compact ledger before ordering work:

```text
obligation identity | governing artifact | current owner/path | change needed |
observable proof | risk or unknown
```

Every normative requirement, specified behavior, program-design boundary, migration/cutover obligation, and required proof seam appears exactly once. A row that cannot name its owner, change, or observation is a design gap, not a planning task.

## Choose Small Changes That Can Be Proven

A slice is the smallest coherent change that can earn evidence without leaving the repository in an invalid intermediate state, cut so that one tier fits it (Record Each Slice's Tier, below).

- `vertical`: crosses the real entrypoint-to-effect path and proves behavior at the narrowest useful layer. Prefer this default.
- `contract`: establishes a type, interface, schema, protocol, or fixture before behavior. It must name the first downstream slice that consumes it.
- `prefactoring`: creates a seam required for a later behavior slice without changing behavior. It must name its consumer and characterization proof.
- `integration`: joins independently changed owners or boundaries and proves their wiring.
- `migration/cutover`: changes stored state, external contracts, or ownership. It names compatibility, rollback or recovery, and observation.
- `proof-only`: adds a missing observation for already-required behavior. It cannot substitute for the behavior change.

Use a compact plan for one low-risk owner and one or two proof gates. Use a full plan when the change crosses owners, trust boundaries, state, concurrency, compatibility, migrations, or multiple proof layers. Proportional means fewer fields, never weaker obligations.

## Record Each Slice's Tier

Each slice carries its tier record (`../../../shared-references/canonical-implementation-plan.md`).

Cut the work so the record is honest:

- A slice that bundles independent units is split into one slice per unit.
- Split a slice that fails Workhorse fit or crosses an assigned authority or contract boundary at that boundary; tag it Daily driver only with an escalation reason.

## Throughput Checkpoint

The plan records five items. Keep every item and write `n/a: <reason>` when one does not apply:

- **choices later slices depend on**: each one written into the plan (the slice that makes it becomes Task), or left to the Sidekick with the reason (that slice stays Open);
- **blocking first steps**: the slices everything else waits on;
- **independent workstreams**: disjoint files, services, or layers that can proceed at once;
- **shared mutable state**: state, fixtures, or generated artifacts several slices would write; split the target before serializing on it;
- **smallest safe decomposition**: the fewest executors that keep every slice fitting its record; if one executor is best, say why.

A slice earns the `independent` mark, which Staffing (`manage-agents`) dispatches on, only after a shared-write check: no `requires` or `serial` edge to in-flight work, write surfaces disjoint from every slice that may run beside it, and its own proof. Different files alone do not show independence.

## Cut the Delivery into PRs

Cut PRs before slices. Complexity decides the Sidekick; size decides the slices. A PR is an independently buildable and reviewable outcome. The admitted basis supplies the candidate cuts (`../../../shared-references/canonical-implementation-plan.md`):

- a large local change stays one PR with many Workhorse slices;
- two disjoint features become two PRs;
- a behavior change that must land across two owners at once stays one PR;
- a contract PR exists only when a real shared seam lets two consumers proceed independently.

The number of PRs follows independence, never owner or file count. Order the nodes riskiest unknown first among those whose prerequisites are met, and name an integration gate wherever independently built PRs first interact, with the proof that shows it.

### PR Independence Test

**Planned (at breakdown).** A node is independent of its siblings when its write surface is disjoint from theirs, its rails and proof let a reviewer judge it without depending on an unmerged sibling change, and where it first meets another node is a named integration gate. A node that needs another node's behavior is stacked on it; nodes that need the same new interface wait for a contract node that adds it. "C is executable now; X and Y wait for C's interface" is a correct planned state.

**Eligible (at plan time).** When Main writes a node's plan, it checks the node's actual base in source: every seam, interface, or signal the node takes from outside itself exists there and supports the observation it needs. Seams the node adds under its own plan are its work, not prerequisites. A node with an unmet external prerequisite stays pending, or its gap returns to its owner (`plan-defect`, or `program-design-gap` for a missing structural decision).

## Order Only Real Dependencies

Record an edge only when it changes safe execution:

```text
requires A -> B   B cannot start or prove correctly before A completes
serial A <-> B    overlapping writes, state, fixtures, or generated artifacts collide
parallel A || B   advisory only; both are independent after named prerequisites
```

Do not add `parallel` merely to advertise concurrency. The executor may serialize any advisory edge. These edges order slices inside one plan; PR independence is the PR Independence Test above.

Place an integration gate at the earliest slice where separately changed components first interact. Do not postpone all wiring proof to final validation. A gate where two PRs first meet belongs to the breakdown, not to either plan.

## Match Proof to Each Change

For each slice, name:

```text
obligation covered
tier record
write surfaces
pre-change signal or approved exception
focused automated proof
integration or runtime proof when the boundary requires it
manual observation when the user-visible or operational surface requires it
quality commands
stop/replan condition
```

Use the cheapest proof that can actually observe the obligation, then add broader proof only for wiring or regression reach. A mocked unit cannot prove a real process, filesystem, network, UI, or distribution boundary. A full suite cannot make an unobserved behavior green.

Name an independent oracle: the expected observation comes from the obligation, not from recomputing the result with the code under test. When the repository defines proof-layer names, those names win; record the source. When it is silent, say `project silent` and use the ordinary unit, integration, smoke, and end-to-end names. When one rule covers the cases, plan a property or a table of that rule. A single example is enough only when the claim is that one case.

When existing tests overlap the slice, return `keep`, `repair`, or `remove` for each. `remove` requires replacement proof, redundancy proof, or dead-contract proof. A remove row without one of those three is not a ready plan. A snapshot or fixture with no live contract is a dead-contract candidate, not an automatic delete.

## Catch Proof That Can Pass for the Wrong Reason

Split or replan when:

- the proposed test observes a helper instead of the required effect;
- a generated file passes while its generator or shipped artifact is stale;
- a mocked boundary stands in for the integration being changed;
- the proof command skips the affected package, platform, or scenario;
- a migration is tested only on an empty state;
- a manual check is described but no runnable surface exists;
- a slice changes several owners and cannot isolate its failure;
- completing the slice would require an unmade product or structural decision.

Return the exact gap and its owner instead of padding the plan with speculative tasks.

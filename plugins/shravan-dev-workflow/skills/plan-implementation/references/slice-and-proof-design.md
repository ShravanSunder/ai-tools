# Divide the Work and Attach Proof

Use this reference to turn admitted obligations into a proportional implementation sequence. Return the slice graph, obligation/proof mapping, necessary edges, integration gates, false-green risks, and any split or replan stop.

## Start From Obligations

Build a compact ledger before ordering work:

```text
obligation identity | governing artifact | current owner/path | change needed |
observable proof | risk or unknown
```

Every normative requirement, specified behavior, program-design boundary, migration/cutover obligation, and required proof seam appears exactly once. A row that cannot name its owner, change, or observation is a design gap, not a planning task.

## Choose Small Changes That Can Be Proven

A slice is the smallest coherent change that can earn evidence without leaving the repository in an invalid intermediate state.

- `vertical`: crosses the real entrypoint-to-effect path and proves behavior at the narrowest useful layer. Prefer this default.
- `contract`: establishes a type, interface, schema, protocol, or fixture before behavior. It must name the first downstream slice that consumes it.
- `prefactoring`: creates a seam required for a later behavior slice without changing behavior. It must name its consumer and characterization proof.
- `integration`: joins independently changed owners or boundaries and proves their wiring.
- `migration/cutover`: changes stored state, external contracts, or ownership. It names compatibility, rollback or recovery, and observation.
- `proof-only`: adds a missing observation for already-required behavior. It cannot substitute for the behavior change.

Use a compact plan for one low-risk owner and one or two proof gates. Use a full plan when the change crosses owners, trust boundaries, state, concurrency, compatibility, migrations, or multiple proof layers. Proportional means fewer fields, never weaker obligations.

## Order Only Real Dependencies

Record an edge only when it changes safe execution:

```text
requires A -> B   B cannot start or prove correctly before A completes
serial A <-> B    overlapping writes, state, fixtures, or generated artifacts collide
parallel A || B   advisory only; both are independent after named prerequisites
```

Do not add `parallel` merely to advertise concurrency. The executor may serialize any advisory edge.

Place an integration gate at the earliest slice where separately changed components first interact. Do not postpone all wiring proof to final validation.

## Match Proof to Each Change

For each slice, name:

```text
obligation covered
write surfaces
pre-change signal or approved exception
focused automated proof
integration or runtime proof when the boundary requires it
manual observation when the user-visible or operational surface requires it
quality commands
stop/replan condition
```

Use the cheapest proof that can actually observe the obligation, then add broader proof only for wiring or regression reach. A mocked unit cannot prove a real process, filesystem, network, UI, or distribution boundary. A full suite cannot make an unobserved behavior green.

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

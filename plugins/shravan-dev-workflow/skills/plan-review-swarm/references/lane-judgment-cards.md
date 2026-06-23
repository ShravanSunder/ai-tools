# Plan Review Lane Judgment Cards

Use this reference when writing or refactoring durable
`plan-review-swarm/references/lanes/*.md` files.

Plan-review lanes are for focused execution judgment. Shared packet references
own source-truth classes, receipt fields, parent reducer mechanics, and generic
route mechanics. Lane files teach the reviewer how to decide whether the plan
can safely carry the accepted source artifact into implementation.

## Principle

A plan-review lane should help a capable reviewer decide whether an
implementation agent can execute the plan without inventing design.

It should pull the reviewer into the right analysis space:

- which plan defect this lane hunts;
- where that defect hides across source artifact, plan slices, task packets,
  repo anchors, validation commands, and parallel lanes;
- how to compare the produced plan to the accepted source artifact;
- what evidence lets the plan creator repair the plan;
- what sibling lane owns adjacent concerns.

If a line only makes packets more compliant, move it to the shared packet
reference or a future lint/custom-rule system.

## Plan-Review Job

Plan review correlates two truths:

1. The accepted source artifact defines what must be true.
2. The produced plan defines how implementation agents will make it true.

The lane should ask whether its slice of the plan preserves the source
artifact, composes with the rest of the plan, and has proof gates attached to
the work they prove. Good review output names the mismatch, source anchor,
plan anchor, repo anchor when relevant, and smallest plan edit.

## Progressive Shape

Write lane files from less detail to more detail:

1. Lens
   - Name the concrete plan defect class.
   - Avoid slogans like "check architecture" unless the file says how.
2. Why This Exists
   - Explain the downstream failure: wrong owner, hidden sequencing hazard,
     duplicate state, missing proof, unsafe parallelism, or implementation
     agents guessing.
3. Where To Look
   - Name source artifact sections, produced plan sections, slice cards,
     task packets, validation matrix, repo paths, tests, docs, and dependency
     surfaces.
4. How To Analyze
   - Give concrete reasoning moves: trace source requirement to slice, search
     named repo surfaces, compare owner/interface, inspect parallel writes,
     attach proof to work unit, or classify ordering risk.
5. Smells And Gotchas
   - Name rationalizations and false positives.
6. Judgment Calibration
   - Explain what counts as blocker, important, question, or noise.
7. Useful Evidence To Return
   - Return exact source claim, plan claim, repo anchor or failed lookup,
     mismatch, and smallest plan edit or source question.
8. Boundaries
   - Name sibling-lane overlap only where it changes judgment.
9. Good / Bad Findings
   - Include compact examples when the lane is easy to dilute.

## Plan-Review Judgment Moves

Use these moves when they fit the lane:

| Move | Use when | What to return |
| --- | --- | --- |
| Source-to-slice trace | The plan claims to implement requirements or contracts. | Missing, contradicted, or weakly covered source obligation. |
| Repo-anchor lookup | The plan names modules, APIs, owners, commands, tests, or files. | Found owner/interface or exact absence/mismatch evidence. |
| Vertical-slice proof check | A slice is supposed to be independently valuable. | Work unit, behavior proven, proof layer, missing lower layer, or manual proof gap. |
| Parallelism check | Multiple lanes touch related surfaces. | Shared contract, serial checkpoint, collision, or safe independence evidence. |
| Execution packet check | Subagents or implementers receive task packets. | Missing source artifact, narrow focus, non-goal, inspect list, proof gate, or handoff boundary. |
| Whole-plan composition check | Focused findings may miss cross-slice gaps. | Coverage gap, cohesion conflict, or route to `whole-plan-cohesion`. |

## What To Avoid

- repeated packet schema;
- repeated receipt field lists;
- generic "be thorough" prose;
- route-back boilerplate that does not affect lane judgment;
- broad architecture taste not required by the accepted source artifact;
- pedantic heading rules that belong in tests or linters;
- saying "add more detail" without naming the missing owner, source anchor,
  repo anchor, ordering checkpoint, proof signal, or task packet field.

## Good Lane Writing

Good:

```text
List every plan task that names a module, package, API, state store, protocol,
event, interface, shared helper, or dependency direction. Search the repo for
that named thing. If it exists, verify who owns it and how callers currently
interact with it. If it does not exist, check whether the source or plan
explicitly says this work creates it.
```

Weak:

```text
Check architecture assumptions.
```

Good:

```text
For every vertical slice, identify the behavior it claims to complete and the
proof that shows that behavior works. Then check whether lower proof layers are
present or explicitly impossible, and whether manual proof uses a concrete
observer such as UI state, database state, logs, metrics, traces, screenshots,
or release artifact behavior.
```

Weak:

```text
Review validation.
```


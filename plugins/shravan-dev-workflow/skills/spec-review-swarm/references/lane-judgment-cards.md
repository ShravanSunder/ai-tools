# Spec Review Lane Judgment Cards

Use this reference when writing or refactoring durable
`spec-review-swarm/references/lanes/*.md` files.

Spec-review lanes are for focused refinement judgment. Shared packet
references own source-truth classes, receipt fields, parent reducer mechanics,
and generic route mechanics. Lane files teach the reviewer how to make the
spec sharper.

## Principle

A spec-review lane should help a capable reviewer turn fuzzy intent into a
clearer spec.

It should pull the reviewer into the right analysis space:

- which spec defect this lane hunts;
- where that defect usually hides in product intent, requirements, contracts,
  boundaries, examples, diagrams, proof expectations, or evidence links;
- how to tell acceptable ambiguity from ambiguity that would make a future
  agent guess;
- what evidence helps the next spec-creation pass refine the artifact;
- what sibling lane owns adjacent concerns.

If a line only makes packets more compliant, move it to the shared packet
reference or a future lint/custom-rule system.

## Spec-Review Job

Spec review is a refinement loop, not a copyedit.

The lane should ask whether the spec gives enough boundary fidelity for a
future planning or implementation agent that does not share the human context.
Good review output says what is fuzzy, why it matters, where the spec can
sharpen it, and what the next creator should change or decide.

## Progressive Shape

Write lane files from less detail to more detail:

1. Lens
   - Name the concrete spec defect class.
   - Avoid slogans like "check clarity" unless the file says how.
2. Why This Exists
   - Explain the downstream failure: bad planning, hidden design work,
     unverifiable requirements, boundary drift, or agent guessing.
3. Where To Look
   - Name source sections and evidence signals: product intent, requirements,
     technical contract, diagrams, examples, proof expectations, repo anchors,
     research notes, or linked slice specs.
4. How To Analyze
   - Give concrete reasoning moves: compare sections, classify ambiguity,
     trace requirement to contract, inspect diagram edges, test observer
     availability, or search repo anchors.
5. Smells And Gotchas
   - Name rationalizations and false positives.
6. Judgment Calibration
   - Explain what counts as blocker, important, question, or noise.
7. Useful Evidence To Return
   - Return the exact claim, missing decision, contradicted boundary,
     evidence anchor, and smallest spec edit or question.
8. Boundaries
   - Name sibling-lane overlap only where it changes judgment.
9. Good / Bad Findings
   - Include compact examples when the lane is easy to dilute.

## Spec-Review Judgment Moves

Use these moves when they fit the lane:

| Move | Use when | What to return |
| --- | --- | --- |
| Intent-to-requirement trace | Product intent implies obligations. | Missing or contradicted requirement and the user/system outcome it protects. |
| Requirement-to-contract trace | Requirements exist but contracts are fuzzy. | Requirement, contract surface, missing owner/invariant/edge. |
| Boundary inspection | The spec names owners, layers, state, protocols, or non-goals. | Allowed edge, disallowed edge, missing owner, or hidden coupling risk. |
| Agent-guess test | A future agent would have to infer a decision. | The exact missing decision and what artifact section should own it. |
| Observer test | A requirement or contract claims behavior. | The observer or proof signal that can verify it, or why none is named. |
| Progressive-disclosure test | The spec links primary and slice docs. | Fact placed at wrong layer, missing route, or mini-file sprawl risk. |

## What To Avoid

- repeated packet schema;
- repeated receipt field lists;
- generic "be thorough" prose;
- route-back boilerplate that does not affect lane judgment;
- process history, reviewer names, or how the issue was discovered;
- pedantic formatting rules that belong in tests or linters;
- telling the creator to "add detail" without naming the missing decision,
  owner, observer, edge, example, or proof signal.

## Good Lane Writing

Good:

```text
For each requirement, identify the observable behavior that must be true and
the observer that can prove it: user, API caller, database, state transition,
log, metric, trace, screenshot, CI check, or release artifact. If no observer
can be named from the spec, the requirement is not ready for planning.
```

Weak:

```text
Make requirements testable.
```

Good:

```text
Find every place the spec names an owner, layer, protocol, state store, or
dependency edge. Check whether the allowed edge and the forbidden neighboring
edge are both clear enough that a planning agent cannot accidentally cross the
boundary while still satisfying the prose.
```

Weak:

```text
Check architecture boundaries.
```


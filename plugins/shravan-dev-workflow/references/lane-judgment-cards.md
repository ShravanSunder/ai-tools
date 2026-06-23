# Lane Judgment Cards

Use this reference when writing or refactoring durable lane files for
`shravan-dev-workflow` swarms.

Lane files are for focused judgment. Shared packet references own generic
packet fields, source-truth rules, receipt schema, and parent reducer mechanics.
Do not copy that shared schema into every lane file.

## Principle

A lane file should make a capable reviewer better at that review.

It should pull the agent into the right analysis space:

- what problem this lane hunts;
- where that problem usually hides;
- how to test whether the concern is real;
- what evidence helps the creation or planning agent fix the artifact;
- what not to spend review attention on.

If a line only makes the packet more compliant, it belongs in the shared packet
reference or a future lint/custom-rule system, not in the lane file.

## Progressive Shape

Write lane files from less detail to more detail:

1. Lens
   - Tell the reviewer what kind of problem they are hunting.
   - Avoid slogans. Name the concrete defect class.
2. Why This Exists
   - Explain the downstream failure this lane prevents.
3. Where To Look
   - Name the source artifacts, repo evidence, sections, or signals that
     usually reveal this class of issue.
4. How To Analyze
   - Give the reviewer concrete reasoning moves.
   - Prefer classification tables, comparison steps, and decision questions.
5. Smells And Gotchas
   - Name subtle failure modes, rationalizations, and false positives.
6. Judgment Calibration
   - Explain what counts as blocker, important, question, or noise for this
     lane.
7. Useful Evidence To Return
   - Name the evidence that lets the next creator repair the spec or plan:
     source claim, missing anchor, repo anchor, mismatch, smallest artifact
     edit, or proof signal.
8. Boundaries
   - Name sibling-lane overlap only where it changes the reviewer's judgment.
   - Keep route mechanics brief; the parent reducer owns final routing.
9. Good / Bad Findings
   - Include one compact good finding and one bad finding when ambiguity is
     likely.

## Good Lane Writing

Good:

```text
Find every place the plan assumes a module, owner, API, state store,
dependency direction, or integration already exists. For each one, verify
whether the repo actually has that thing, whether the named owner is correct,
and whether the proposed change goes through the existing interface or invents
a new path.
```

Weak:

```text
Check architecture assumptions.
```

Good:

```text
For each requirement, ask what observable system behavior must be true and who
or what observes it: user, API caller, database, log, metric, trace,
screenshot, state transition, CI check, or release artifact.
```

Weak:

```text
Make requirements testable.
```

## What To Avoid

- repeated packet schema;
- repeated receipt field lists;
- repeated parent reducer ownership text;
- generic "be thorough" prose;
- architecture words that do not say how to inspect anything;
- pedantic heading compliance that belongs in tests, linters, or custom rules;
- route-back boilerplate that does not affect this lane's judgment.

## First Rewrite Targets

Use these three lanes as the initial model set when refactoring current review
lanes into judgment cards:

- `plan-review-swarm/references/lanes/architecture-assumptions.md`
- `spec-review-swarm/references/lanes/requirements-testability.md`
- `plan-review-swarm/references/lanes/testability-validation.md`


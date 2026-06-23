# Lane Judgment Card Spec

## Product Intent

Lane references should help a smart, capable subagent adopt the right review
focus. They are not packet schemas and they are not linter rule lists.

The goal is to encode judgment: how to think, where to look, what to compare,
which failure modes matter, and what evidence helps the next creator improve
the spec or plan.

## Problem

The current lane-teaching pass improved consistency, but too much lane content
still repeats route mechanics, receipt fields, and generic schema language. That
makes files longer without making the reviewer sharper.

```text
weak lane file
  says "check architecture assumptions"
  -> agent reports generic concern
  -> creator receives no actionable evidence

judgment-card lane file
  teaches where the issue hides
  -> agent inspects source + repo evidence
  -> agent classifies the mismatch
  -> creator receives the missing decision, anchor, and smallest artifact edit
```

## Design Contract

Shared packet references own:

- packet anatomy;
- source-truth classes;
- receipt fields;
- parent reducer ownership;
- generic route mechanics.

Lane references own:

- lens and defect class;
- why the lane exists;
- where to inspect;
- how to analyze;
- smells, gotchas, and false positives;
- judgment calibration;
- useful evidence to return;
- sibling boundaries only where they change lane judgment;
- compact good and bad finding examples when useful.

Skill-local judgment-card references own the phase-specific reviewer posture:

- `spec-review-swarm/references/lane-judgment-cards.md` teaches
  fuzzy-to-sharp spec refinement: product intent, requirements, contracts,
  boundaries, acceptable ambiguity, proof expectations, and evidence that helps
  the next spec-creation pass.
- `plan-review-swarm/references/lane-judgment-cards.md` teaches
  execution-readiness judgment: source-to-plan traceability, vertical slices,
  repo anchors, parallel work, subagent packets, and proof gates attached to
  each unit of work.

Future lints or custom rules own:

- required headings;
- schema consistency;
- stale route names;
- mechanical field presence.

## Progressive Lane Shape

Each lane should move from big picture to detail:

1. Lens
2. Why This Exists
3. Where To Look
4. How To Analyze
5. Smells And Gotchas
6. Judgment Calibration
7. Useful Evidence To Return
8. Boundaries
9. Good / Bad Findings

This is progressive disclosure inside one file. The first section creates the
mental frame; later sections give concrete inspection moves and calibration.

## Initial Rewrite Targets

Use these lanes to establish the pattern before broad refactoring:

1. `plugins/shravan-dev-workflow/skills/plan-review-swarm/references/lanes/architecture-assumptions.md`
2. `plugins/shravan-dev-workflow/skills/spec-review-swarm/references/lanes/requirements-testability.md`
3. `plugins/shravan-dev-workflow/skills/plan-review-swarm/references/lanes/testability-validation.md`

## Example Direction

For `architecture-assumptions`, do not write only:

```text
Check owner, interface, allowed edge, forbidden edge.
```

Write the actual analysis move:

```text
List every plan task that names a module, package, API, state store, protocol,
event, interface, shared helper, or dependency direction. Search the repo for
that named thing. If it exists, verify who owns it and how callers currently
interact with it. If it does not exist, check whether the source or plan
explicitly says this work creates it. Report only mismatches that would send an
implementation agent to the wrong owner, duplicate state, cross a forbidden
dependency direction, or hide design work inside implementation.
```

For `requirements-testability`, do not write only:

```text
Make requirements testable.
```

Write the actual analysis move:

```text
For each requirement, identify the observable behavior that must be true and
the observer that can prove it: user, API caller, database, state transition,
log, metric, trace, screenshot, CI check, or release artifact. If no observer
can be named, the requirement is not ready for planning.
```

## Acceptance Criteria

- The three target lane files read like expert briefs, not schema cards.
- Common packet and receipt mechanics are referenced, not repeated.
- The global lane-card reference is removed; spec review and plan review each
  load their own local card because they sharpen different kinds of judgment.
- Each target lane tells the reviewer where to look and how to decide whether a
  concern is real.
- Each target lane returns evidence useful to the spec or plan creator, not just
  a verdict.
- Pressure scenarios continue to prove source loading, lane focus, and
  cannot-verify behavior after the rewrite.

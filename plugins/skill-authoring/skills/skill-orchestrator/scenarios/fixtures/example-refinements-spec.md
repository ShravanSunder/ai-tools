# debug-investigation refinements: skill spec

Revision 2.

## Targets and runs

Owner plugin: `shravan-dev-workflow`. Every run names one skill.

| Run | Target | Surface | State |
| --- | --- | --- | --- |
| A | `debug-investigation` | `SKILL.md` wording: when to write a repo-local debug artifact versus staying in chat | proposed |
| B | `debug-investigation` | `references/background-monitoring.md`: watcher cancellation wording | proposed |

## Problem and evidence

- Agents write a debug artifact for one-line chat questions (session log 2026-07-28, three occurrences).
- Agents leave background watchers running after the answer is found (hypothesis; one observation).

## Success definition

A one-line debugging question stays in chat; a multi-step investigation with reproduction steps gets a repo-local artifact; a background watcher is cancelled when its question is answered.

## Decisions

| Decision | Default taken | Rationale | Priority |
| --- | --- | --- | --- |
| Artifact threshold | write one only when there are reproduction steps to keep | the artifact exists to preserve steps across sessions | must |
| Watcher cancellation | cancel on the answer, not on a timer | timers outlive short answers | should |
| Example in body | one short example inline | the predicate is easier to apply with one example | could |

## Proof plan

- Run A: user-directed intent; done bar new-from-intent; one scenario where a one-line question stays in chat.
- Run B: observed failure (hypothesis); reproduce first; done bar fix-for-recorded-failure if reproduced.

## Coordination

Base: `main` at the commit this spec was accepted on. No pending edits. Version bump and changelog land with Run B.

## Non-goals

No change to the debugging method itself, and no new references.

## Review record

Spec review: checks mental-model-fit, trigger-routing, rule-agreement, depth-coverage all complete. Verdict great. Implementation decision: accepted-to-implement at revision 2.

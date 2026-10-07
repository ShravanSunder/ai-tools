# debug-notes refinements: skill spec

Revision 2.

## Targets and runs

Owner folder: `tools/skills/`. Every run names one skill.

| Run | Target | Surface | State |
| --- | --- | --- | --- |
| A | `debug-notes` | `SKILL.md` wording: when to write a repo-local notes file versus staying in chat | proposed |
| B | `debug-notes` | `SKILL.md` workflow: closing out notes when the cause is found | proposed |

## Problem and evidence

- Agents write a notes file for one-line chat questions (session log 2026-07-28, three occurrences).
- Agents leave notes open-ended after the cause is found (hypothesis; one observation).

## Success definition

A one-line debugging question stays in chat; a multi-step investigation with reproduction steps gets a repo-local notes file; notes end with the cause and the fix once the cause is found.

## Decisions

| Decision | Default taken | Rationale | Priority |
| --- | --- | --- | --- |
| Notes threshold | write a notes file only when there are reproduction steps to keep | the file exists to preserve steps across sessions | must |
| Close-out | end the notes with cause and fix | an open-ended note misleads the next reader | should |
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

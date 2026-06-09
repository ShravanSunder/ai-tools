# Stage: Docs

Load this when the discussion is about what should become durable documentation before docs are edited.

## Focus

- audience
- document role
- source of truth
- stale or duplicated material
- what should be retained as rationale
- what belongs in README, AGENTS, architecture docs, plans, or changelog

## Questions To Prefer

```text
Current model:
<doc/source> is stale because <code/spec/plan evidence>.

My recommended default:
Make <source> the driver and patch <doc> because <reason>.

Question:
Should this decision live in <doc location>, or should it remain a temporary plan/changelog note?
```

## Stop Condition

Stop when the user has chosen the source of truth and the durable doc location, then hand off to `docs-maintain` for edits.

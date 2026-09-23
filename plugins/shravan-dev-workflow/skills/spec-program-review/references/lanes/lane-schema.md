# Design Review Check Status

This reference owns the status enum and per-check result shape. The 🔎 Review Sidekick holds complete targets, governing sources, quoted goal boundary and requirements, structural-realization confirmation, constraints, chunk seams, proof claims, and known gaps in its own session. Check references own their missions; findings use `../finding-and-reduction-schema.md`.

```text
check: mode-complete-reviewer | chunk-reviewer | dispel | proof-challenge |
  specification-authority | contract | architecture-boundary |
  failure-concurrency | security-trust | platform-harness |
  implementation-difference | proof | artifact-navigation |
  reader-understanding
status: complete | partial | blocked
selection: required | selected: <named reason> | not selected: <reason>
coverage: <target sections, source anchors, or named question inspected>
result: <shape required by the check reference>
remaining boundary: <none | exact unfinished coverage or blocker>
```

For simplification, baseline recovery, or requirement subtraction, coverage returns one compact row per stable identity: `covered | owner-authorized supersession | gap`, with its anchor. Identities may share a row only when every member identity is enumerated and all share the same disposition and anchor. `complete` means the check finished or an optional check was not selected with its reason. `partial` names unfinished coverage; `blocked` names the missing input or access. Missing, partial, or blocked required checks prevent `ready`. The 🔧 Operator's proof result is evidence for the lead's proof-challenge check, never a review verdict.

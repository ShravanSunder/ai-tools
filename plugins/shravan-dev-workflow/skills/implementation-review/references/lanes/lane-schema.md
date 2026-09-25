# Review Check Status

This reference owns the status enum and the per-check result shape. The 🔎 Review Sidekick holds governing basis, goal boundary, obligations, constraints, complete diff, chunk plan, proof claims, and known gaps in its own session. The individual check references own their missions.

```text
check: spec-compliance | chunk-reviewer | dispel | proof-challenge | focused-reviewer
status: complete | partial | blocked
selection: required | selected: <named reason> | not selected: <reason>
coverage: <complete files, obligations, or named question inspected>
result: <shape required by the check reference>
remaining boundary: <none | exact unfinished coverage or blocker>
```

`complete` means the selected check finished, or an optional check was not selected with its reason. `partial` names unfinished coverage. `blocked` names the missing input or access. Missing, partial, or blocked required checks prevent `ready`. Findings carry source anchors; do not add reading digests or line-count attestations. A 🔧 Operator proof result is evidence for the lead's proof-challenge check, never a review verdict.

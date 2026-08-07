# Reviewer Lane Schema

This file owns only the stable fields shared by the complete and focused reviewer jobs.

## Shared Packet

```text
assignment identity:
lane identity:
governing authority identities:
canonical plan tuple:
separate current-plan approval identity:
base and reviewed identities:
diff range and changed files:
repository instructions:
proof claims and evidence:
constraints and non-goals:
known gaps and risk predicates:
prior-coverage freshness:
```

Every source field is an inspectable path, identity, or explicit absence reason. Parent summaries and previous review output are routing context only.

## Shared Receipt

```text
status: complete | partial | blocked
assignment identity:
lane identity:
source identity:
reviewer runtime identity and history isolation:
authority used: read-only, candidate-only
files and proof opened:
obligation coverage:
normal and failure-path coverage:
runtime reachability:
false-substitute risks:
highest-risk crux:
candidate findings:
uncovered boundary:
confidence and remaining uncertainty:
```

`complete` means the lane mission and every applicable method stage finished. `partial` names completed coverage and what remains. `blocked` names the missing input or access that prevented the mission from starting. The parent verifies every receipt before using it.

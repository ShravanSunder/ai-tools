# What Reviewers Receive and Return

This file owns only the stable fields shared by the complete and focused reviewer jobs.

## Shared Packet

```text
assignment identity:
lane identity:
governing authority identities:
canonical plan record:
current governing planning basis and delivery context:
completed remediation-pass receipts in this bounded delivery effort:
base and reviewed identities:
diff range and changed files:
repository instructions:
proof claims and evidence:
constraints and non-goals:
known gaps and risk predicates:
prior review coverage:
```

Every source field is an inspectable path, identity, or explicit absence reason. Parent summaries and previous review output are routing context only.

## Shared Result

```text
status: complete | partial | blocked
assignment identity:
lane identity:
source identity:
reviewer runtime identity and history isolation:
authority used: read-only, candidate-only
result: <the result shape required by complete-reviewer.md or focused-reviewer.md>
```

`complete` means the lane mission and every applicable method stage finished. `partial` names completed coverage and what remains. `blocked` names the missing input or access that prevented the mission from starting. The reviewer must read the controlling source and proof, but does not return a separate reading receipt, file-content digest, hash, line count, or chunk report. Findings cite only the source evidence needed to support them. The parent verifies every result before using it.

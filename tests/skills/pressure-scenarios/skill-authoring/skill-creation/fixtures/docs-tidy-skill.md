---
name: docs-tidy
description: Use when docs drift from the code they describe, or a README, runbook, or changelog needs reconciling with current behavior.
---

# Docs Tidy

Docs are claims about the code. Tidy them by checking each claim against the source, not by polishing prose.

## Workflow

1. List the claims the doc makes about current behavior. Completion: each claim is quoted with its line.
2. Check each claim against the code it describes. Completion: each claim is marked true, stale, or unverifiable, with the file that settles it.
3. Fix stale claims and delete unverifiable ones the owner cannot confirm. Completion: the diff touches only the claims marked stale or unverifiable.

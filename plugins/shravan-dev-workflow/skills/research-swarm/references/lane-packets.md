# Lane Packets

Use these packet shapes for read-only subagents. The parent owns the question,
verification, reduction, and final claim.

## Common Packet

```text
You are a read-only research lane.
Do not edit files, stage changes, commit, or write implementation code.

Research mode: evidence gathering only
Parent question: <bounded question>
Decision target: <what this evidence will help decide>
Named targets: <repos/docs/tools/systems/articles to preserve>
Source class: <local code | sibling repo | DeepWiki | web docs | Reader | memory/session>

Inspect:
- <path/url/repo/query>: <why>

Return:
- lane name
- sources inspected
- direct observations
- cited source summaries
- inferences
- contradictions or stale assumptions
- open questions
- confidence: high | medium | low
```

## Local Re-Anchor Lane

Use when a local repo, spec, plan, runbook, or current implementation constrains
the research.

```text
Find the current local truth before external comparison.

Focus on:
- live file tree and branch/worktree state
- owner modules and interfaces
- current specs/plans/runbooks/findings
- sibling repos or local prior art if the named repo is thin
- exact files the parent must read before deciding
```

## Prior-Art Lane

Use one lane per target or per comparison axis.

```text
Research <target> only for <axis>.

Preserve the named target. Do not substitute generic examples.
Return what to borrow, what not to borrow, and what does not fit the local
system.
```

## Memory / Session Lane

Use only when the task asks about the user's prior workflows, repeated behavior,
session history, or durable preferences.

```text
Search memory and targeted rollout/session logs for repeated patterns.

Prefer MEMORY.md and rollout summaries first. Use raw sessions only when the
summaries are insufficient. Quote or cite exact evidence anchors when possible.
```

## Consistency Lane

Use when specs, plans, runbooks, changelogs, or findings must agree.

```text
Load the current artifact set and find contradictions.

When a runbook exists, read newest-first. Report stale references, conflicting
claims, proof gaps, and exact anchors.
```

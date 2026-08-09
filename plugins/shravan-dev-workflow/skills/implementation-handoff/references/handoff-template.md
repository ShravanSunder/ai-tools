# Implementation Handoff Template

Use this when writing `implementation-handoff.md`.

## Header

```text
Implementation handoff
Date: <yyyy-mm-dd>
Stage: <in-progress | pre-review | post-review | blocked>
Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Base: <base branch/sha or not established>
Head: <head sha or working tree>
Source request/plan/ticket: <path/id/summary>
Canonical plan record: <complete unchanged plan record or plan identity: none>
Separate current-plan approval evidence: <complete unchanged record or explicit absence>
Governing authority identities: <current reviewed design or admitted improvement authority>
Prior review coverage: <reviewed source identity and status or explicit absence>
```

## Body

```text
What this work is trying to do
<short objective>

Current state
- <committed/uncommitted/staged/dirty>
- <important branch or PR state>

Changed files
- <path>: <what changed>

Implementation proof:
- Covered obligations/slices: <rows or explicit none>
- Commands and exit codes: <fresh evidence>
- Manual/runtime observations: <fresh evidence or not applicable with reason>
- Quality results: <format/lint/typecheck or gaps>
- Integration gates: <results or not reached>
- Incomplete rows and blockers: <exact routes>

What is not proven
- <gap and why it matters>

Known risks
- <risk>: <review focus or mitigation>

Security
<`not applicable`, or changed trust boundaries, findings fixed, unvalidated
risks, security proof, and accepted risks when a sensitive surface exists>

Do not change
- <path/scope boundary>

Recommended next action
<review-implementation for general-domain work | skills-creation for a runtime skill package | continue through an explicitly authorized executor | resolve governing blocker | rerun validation>
```

## Stage Additions

### in-progress

```text
Unfinished work
- <item>

Do not redo
- <already completed item>
```

### pre-review

```text
Reviewer focus
- <risk or contract>
- <security invariant or proof gap, when applicable>

Diff command
<git diff command>
```

### post-review

```text
Feedback addressed
- <review item>: <resolution>

Still disputed or open
- <item>: <why>
```

### blocked

```text
Blocker
<exact blocker>

Tried
- <attempt and result>

Decision needed
<question for user or next agent>
```

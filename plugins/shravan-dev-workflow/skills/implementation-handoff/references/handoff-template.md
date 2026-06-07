# Implementation Handoff Template

Use this when writing `implementation-handoff.md`.

## Header

```text
Implementation handoff
Date: <yyyy-mm-dd>
Stage: <planned | in-progress | pre-review | post-review | blocked>
Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Base: <base branch/sha or not established>
Head: <head sha or working tree>
Source request/plan/ticket: <path/id/summary>
```

## Body

```text
What this work is trying to do
<short objective>

Current state
- <committed/uncommitted/staged/dirty>
- <important branch or PR state>

Changed or intended files
- <path>: <what changed or should change>

What is proven
- <command/evidence>: <result>

What is not proven
- <gap and why it matters>

Known risks
- <risk>: <review focus or mitigation>

Do not change
- <path/scope boundary>

Recommended next action
<review | continue implementation | resolve blocker | rerun validation>
```

## Stage Additions

### planned

```text
First safe step
<what the next agent should do first>
```

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

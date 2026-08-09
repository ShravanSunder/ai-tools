# Plan Handoff Template

Use this when producing `plan-handoff.md` and `copy-paste-prompt.md`.

## Artifact Header

```text
Plan handoff
Date: <yyyy-mm-dd>
Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Source plan: <absolute or repo-relative path>
Originating planner: plan-implementation | plan-improve-repo
Planning result and payload: draft | revision-requested | blocked — <payload>
Separate approval evidence: <exact-path current-plan record or explicit absence>
Prepared for: <agent/CLI/session target>
```

## Handoff Body

```text
Task
<one paragraph: what the next agent should do>

Do first
1. Read these files:
   - <path>: <why>
2. Verify these assumptions:
   - <assumption>: <how to check>
3. Do not touch:
   - <paths/scope exclusions>

Context
<short domain model, current branch state, prior decisions>

Security
<`not applicable`, or the entry points, trust boundaries, sensitive actions,
invariants, non-goals, and required proof when a sensitive surface exists>

Obligation/slice/proof mapping
- Source: <path/section or compact proof line>
- Rows carried forward: <requirement, evidence source, proof gate, freshness guard>
- Open proof gaps: <or "none">
- Split triggers: <or "none">
- Parent verification rule: downstream subagent, reviewer, UI-driver, telemetry,
  or other delegated evidence must be inspected or cross-checked before
  completion is claimed.

Open questions
- <question and why it matters>

Expected output
- <review report | implementation plan | patch | validation result>
```

## Copy-Paste Prompt

```text
You are taking over a plan/design handoff.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Source plan: <path>
Canonical plan record: <immutable path, originating planner, result and payload>
Separate approval evidence: <exact-path current-plan record or explicit absence>

Your task:
<task>

Start by inspecting:
- <path>: <reason>
- <path>: <reason>

Constraints:
- Do not rely on prior chat history.
- Do not change code unless this prompt explicitly asks for implementation.
- Verify plan claims against current files before conclusions.
- Preserve listed security invariants. If the plan touches sensitive surfaces
  but no threat model is provided, flag that as a plan defect.
- Preserve the obligation/slice/proof mapping, including evidence sources, freshness
  guards, open proof gaps, split triggers, and parent-owned verification.
- Preserve the canonical plan record and separate approval evidence unchanged.
- Do not treat `draft`, handoff creation, or earlier goal text as approval.
- Keep findings evidence-backed with exact paths.

Return:
- Findings or implementation result
- Obligation/slice/proof mapping status
- Canonical plan record and approval-evidence status
- Open questions
- Commands/tests run
```

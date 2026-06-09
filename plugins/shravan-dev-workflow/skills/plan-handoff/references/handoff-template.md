# Plan Handoff Template

Use this when producing `plan-handoff.md` and `copy-paste-prompt.md`.

## Artifact Header

```text
Plan handoff
Date: <yyyy-mm-dd>
Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Source plan: <absolute or repo-relative path>
Plan line count: <N or not applicable>
Coverage: <chunk ranges or packet files read>
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

Security context
- Entry points / untrusted inputs: <or "not security-sensitive">
- Trust boundaries / auth assumptions: <or "not applicable">
- Sensitive data / privileged actions: <or "not applicable">
- Security invariants and non-goals: <or "not applicable">
- Required security proof: <or "not applicable">

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
Plan coverage already loaded by handoff preparer: <line count + chunks>

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
- Keep findings evidence-backed with exact paths.

Return:
- Coverage inspected
- Findings or implementation result
- Open questions
- Commands/tests run
```

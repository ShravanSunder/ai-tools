# Copy-Paste Prompts

Use these when writing `copy-paste-prompt.md` and printing the prompt in chat.

## Reviewer Prompt

```text
You are reviewing a completed or partial implementation. Review only; do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch>
Base: <base sha/branch>
Head: <head sha or working tree>
Diff command: <git diff command>

User request:
<original request>

Stage:
<planned | in-progress | pre-review | post-review | blocked>

Implementation summary:
<what changed>

Files changed:
- <path>: <why>

Validation already run:
- <command>: <result / exit code>

Known risks / focus:
- <risk>

Security context:
- Changed trust boundaries: <or "none known">
- Sensitive data / privileged actions: <or "not applicable">
- Security validation already run: <or "none">
- Proof gaps: <or "none known">

Review requirements:
- Verify against actual code, not this summary.
- Look for correctness, regression, security, test, and scope issues.
- Separate blocker / important / nit.
- Include exact file evidence and smallest safe fix.
- For security findings, include exploit/misuse path and validation status.
```

## Continuation Prompt

```text
You are continuing an implementation handoff.

Repo: <absolute repo path>
Branch/worktree: <branch>
Stage: <in-progress | blocked | post-review>

Objective:
<what the work is trying to complete>

Current state:
<what is done and what remains>

Files to inspect first:
- <path>: <why>

Do not redo:
- <completed work>

Next action:
<specific next task>

Constraints:
- Stay within the listed write scope.
- Verify claims against current files.
- Run the listed validation before claiming completion.

Return:
- What changed
- Tests/commands run
- Remaining blockers or risks
```

## Manual TUI Prompt Footer

Use this footer when the target is Claude TUI, Gemini/agy, or another manual paste surface:

```text
This is a manual handoff prompt. Do not assume access to previous chat. If any referenced file is missing or branch state differs, stop and report the mismatch before reviewing or editing.
```

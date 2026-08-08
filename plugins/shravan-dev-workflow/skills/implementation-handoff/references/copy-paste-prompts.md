# Copy-Paste Prompts

Use these when writing `copy-paste-prompt.md` and printing the prompt in chat.

For meaningful general-domain review, `plan identity: none` intentionally returns `blocked-input`; the handoff must route to caller authority or plan creation before asking `review-implementation` to proceed.

## Reviewer Prompt

```text
Use <$shravan-dev-workflow:review-implementation for general-domain work | $shravan-dev-workflow:skills-creation for a runtime skill package> to independently review this completed or partial implementation. Review only; do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch>
Base: <base sha/branch>
Head: <head sha or working tree>
Diff command: <git diff command>
Canonical plan record: <complete unchanged plan record or plan identity: none plus non-plan governing request/ticket identity>
Separate current-plan approval evidence: <complete unchanged record or explicit absence>
Governing authority identities: <current reviewed design or admitted improvement authority>
Prior review coverage: <reviewed source identity and status or explicit absence>

User request:
<original request>

Stage:
<in-progress | pre-review | post-review | blocked>

Implementation summary:
<what changed>

Files changed:
- <path>: <why>

Implementation proof bound to the governing identity:
- Covered obligations/slices: <rows or explicit none>
- Commands and exit codes: <fresh evidence>
- Manual/runtime observations: <fresh evidence or not applicable with reason>
- Quality results: <format/lint/typecheck or gaps>
- Integration gates: <results or not reached>
- Incomplete rows and blockers: <exact routes>
- Proof freshness: <HEAD/diff/evidence anchors>

Known risks / focus:
- <risk>

Security:
<`not applicable`, or changed trust boundaries, sensitive actions, security
validation, and proof gaps when a sensitive surface exists>

Review requirements:
- Verify against actual code, not this summary.
- Preserve the exact governing authority, canonical plan record and current meaning, complete approval-evidence record or explicit absence, base/reviewed/diff identities, proof identities, constraints, and freshness evidence above.
- Run the selected owning workflow's fresh-context changed-implementation review route and parent reduction; do not substitute ad hoc review or cross the runtime skill-package boundary.
- Return exact anchored findings, proof boundaries, owner routes, and affected review coverage without remediation or PR work.
```

## Continuation Prompt

```text
You are continuing an implementation handoff.

Repo: <absolute repo path>
Branch/worktree: <branch>
Stage: <in-progress | blocked | post-review>
Canonical plan record: <complete unchanged plan record or plan identity: none plus non-plan governing request/ticket identity>
Separate current-plan approval evidence: <complete unchanged record or explicit absence>

Objective:
<what the work is trying to complete>

Current state:
<what is done and what remains>

Implementation proof bound to the governing identity:
- Covered obligations/slices: <rows or explicit none>
- Commands and exit codes: <fresh evidence>
- Manual/runtime observations: <fresh evidence or not applicable with reason>
- Quality results: <format/lint/typecheck or gaps>
- Integration gates: <results or not reached>
- Incomplete rows and blockers: <exact routes>
- Proof freshness: <HEAD/diff/evidence anchors>

Files to inspect first:
- <path>: <why>

Do not redo:
- <completed work>

Next action:
<specific next task>

Exact route:
<implement-plan for an exact approved draft | review-implementation for general-domain work | skills-creation for a runtime skill package | governing owner/blocker>

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

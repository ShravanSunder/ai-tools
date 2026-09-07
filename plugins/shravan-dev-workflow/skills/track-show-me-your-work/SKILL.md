---
name: track-show-me-your-work
description: Use when the user requests a work trail, asks to inspect or render an existing trail, or says show me your work; when running orchestrator-design or orchestrator-implementation-goal; or during implementation spanning components, significant decisions, or distinct implementation and proof stages. Not for retrospective reconstruction or routine small edits unless a trail is requested.
---

# Track Show Me Your Work

Keep a decision trail a teammate can understand: what happened, why, evidence, and result. Record meaningful checkpoints as the work happens. A short, truthful account is more useful than a diary of commands or a polished story written afterward.

## Start or reuse the trail

MUST load `references/usage.md` and return the selected trail path and whether this workflow owns its finalization. Use the helper there for every record and readable view; keep paths in current task context rather than repeating setup at each checkpoint.

Reuse a trail supplied by the coordinating caller. Otherwise use the current repo/session to find an existing matching trail before starting one; if several could belong to the task, ask rather than guess. A genuinely new task gets a new trail. If history is missing, start honestly from what is observable now, without inventing earlier events.

The centralized root is `~/dev/memory-logs/work-trails/`. The helper records repo, worktree, branch, and session identity and handles safe appends. Routine read/edit/test mechanics alone do not make a small edit substantial. Explicit requests to inspect a trail may render it without starting a new run.

## Record what matters

Send the helper a short phase, decision or event, why, evidence pointers, and result. Log consequential choices, verified checkpoints, pivots/reverts, blockers, material user corrections, and useful improvements explicitly deferred outside scope. Skip mundane actions and per-command narration.

- Describe what actually happened; separate planned, attempted, failed, blocked, and verified outcomes in plain words.
- Give the stated reason or say it is unknown. Do not infer blame or manufacture a cause.
- Link evidence that supports the claim. Recording a path does not verify its contents, and a past success does not establish current readiness.
- Sanitize before writing: no credentials, secret-bearing commands, raw private transcripts, or unnecessary identifying details. The helper validates structure, not whether text contains secrets.
- Keep the short record understandable alone. Add Markdown detail only for context that would otherwise be lost; link an existing artifact when it already explains the decision.
- Correct a record by appending a new one that supersedes it. Never rewrite event history or an existing detail file. If a concurrent correction made the target stale, inspect it before deciding whether another correction is needed.

The main agent records checkpoints directly. Do not launch a logging sidekick or reread the full trail for every entry. If substantial explanatory work is delegated, use `manage-agents` with the specific source evidence, owned detail task, permitted output, and parent verification; the main agent remains accountable for its claims.

## Make it readable

Generate the readable Markdown view whenever requested. At the end of the task/run, the workflow that owns the trail calls finish with the actual outcome and unresolved work, then opens the generated view to verify it and links it in the response. Do this for completed, partial, blocked, and stopped outcomes.

Nested phase skills append checkpoints and return the trail path to their caller; they do not finalize the outer goal. The view is generated from JSONL and linked detail, not a second independently maintained history. It can be regenerated. If work resumes after finish, keep logging and finish again when that continuation ends.

## Keep tracking in its place

Use the trail to orient a resumed task, then inspect the current artifacts and evidence that matter to the next step. The trail records decisions; it does not grant scope, substitute for proof, or operate a replay/controller state machine.

If setup, writing, or rendering fails, report the concrete logging gap briefly and continue independent work unless the user made the trail a delivery gate. Never silently truncate damaged records, claim a complete trail after lost writes, or stop unrelated work merely because logging failed.

Completion: meaningful checkpoints and corrections are recorded, the owning workflow has produced and checked the end view, and any missing evidence or logging failures are visible.

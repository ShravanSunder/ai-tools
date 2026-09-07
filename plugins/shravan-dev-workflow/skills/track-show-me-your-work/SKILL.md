---
name: track-show-me-your-work
description: Use when the user requests a work trail, asks to inspect or render an existing trail, or says show me your work; when running orchestrator-design or orchestrator-implementation-goal; or during implementation spanning components, significant decisions, or distinct implementation and proof stages. Not for retrospective reconstruction or routine small edits unless a trail is requested.
---

# Track Show Me Your Work

Keep a short, truthful decision trail: what happened, why, evidence, and result. The main agent writes it directly with existing file tools. No custom helper, database, dependency, or logging sidekick is needed.

## Keep one session trail

Use `~/dev/memory-logs/work-trails/<repo>/<yyyy-mm-dd-worktree-branch-session>/events.jsonl`. Use readable names, replace path separators in labels, and reuse the actual session/tab name when available; otherwise choose a short descriptive session label. Check for an existing folder before creating one so distinct tasks do not overwrite each other. Keep the selected path in task context.

The main agent is the sole writer. Delegates return checkpoint facts to it rather than concurrently editing the log. Nested orchestration reuses the caller's trail; the outer task owns its end summary. Resume the supplied trail, or inspect candidate names/context and ask when the intended trail is ambiguous. Do not reconstruct missing history as fact.

## Append meaningful checkpoints

Append one complete JSON object per line, using proper JSON escaping and a trailing newline. Use existing JSON tools such as `jq` to encode or validate when needed; never interpolate arbitrary recorded text into shell commands.

Each record contains `timestamp`, `phase`, `decision`, `why`, `evidence` (a list of pointers), and `result`. Include repo/worktree/branch/session context in the first record, and note material context changes later. Optional `detail` links to a Markdown explanation; optional `corrects_line` references an earlier line in this file.

Record consequential decisions, verified checkpoints, pivots/reverts, blockers, material user corrections, and explicitly deferred improvements. Skip routine commands and narration. State observed outcomes and unknown reasons honestly. Sanitize secrets and private content before writing. A recorded evidence pointer is not proof that it was checked.

Keep each record understandable alone. Write longer explanations in a sibling Markdown file only when needed; prefer linking an existing artifact. Correct mistakes by appending a new record with `corrects_line`, never by rewriting prior events. If a line is malformed, preserve it and report the gap rather than silently discarding history.

## Produce the readable view

At task end—including partial, blocked, or stopped outcomes—append the actual outcome. When the task ends or a readable view is requested, MUST dispatch the Markdown-view lane through `manage-agents` to a Luna Operator. The operator loads `references/markdown-view.md`.

Pass the exact JSONL path, its current last line, allowed linked-detail paths, and sole `summary.md` output path. Dispatch only after that prefix is written; keep the prefix/details unchanged and allow only one active writer to that output. The operator may run alongside later main-agent work because it reads only the fixed prefix. Its authority is no broader than the reference: source read-only, one view writable. Return `complete | partial | blocked`, output path, covered last line, and source gaps; the parent checks corrections, outcomes, cutoff and reported gaps against the source, then links the view. Nested phases return their checkpoint to the outer trail owner instead of ending that trail.

IF delegation is unavailable, report it, load `references/markdown-view.md` to produce the same bounded view directly, and return its status, output path, covered last line, and source gaps for the same parent verification.

The view is a replaceable reading aid, not another source of truth. On resume, use the trail for orientation and check current source before relying on past success. Logging failures do not block unrelated work unless the user explicitly made the trail a delivery requirement; report incomplete records or views honestly.

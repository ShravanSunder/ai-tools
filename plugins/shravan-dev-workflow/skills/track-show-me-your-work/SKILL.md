---
name: track-show-me-your-work
description: Use when the user requests a work trail, resumes or inspects an existing work thread or historical work trail for continuity, or says show me your work; when running orchestrator-design or orchestrator-implementation-goal; or during implementation spanning components, significant decisions, or distinct implementation and proof stages. Not for one-off Router reads, uncertain-operation recovery, inventing absent history, or routine small edits unless a trail is requested.
---

# Track Show Me Your Work

A trail follows the work across agents and sessions. Keep one coherent shared account: a coordination root for whole-work decisions and integration, plus linked execution roots only when simultaneous planned PR assignments need separate thread-local implementer seats. Source code, specifications, and actual proof retain their authority; a message records a claim, not its verification. New trails do not require `events.jsonl` or a second event store.

## Find or start the work thread

For shared discovery, reads, posts, and watches, invoke `agent-collaboration` and return the observed work reference or exact gap. That skill owns project/board selection, agent-controlled topic organization, identity, pagination, and uncertain-operation handling. Reuse a supplied thread after checking its work context; otherwise discover before creating. A new session is not a new piece of work.

Start a new coordination thread with its goal, scope, orchestrator, repository/worktree context, and relevant artifact links. The orchestrator creates and keeps the `orchestrator` seat. When one implementation assignment begins, that root may also be its execution root and record the persistent implementation Sidekick as `implementer`. When several planned PR Sidekicks work simultaneously, keep integration and whole-work decisions on the coordination root and create or reuse one linked execution root per assignment, referencing the coordination root through existing message references. The orchestrator holds `orchestrator` on every execution root; its assigned Sidekick holds `implementer` there. Review Sidekicks contribute as `reviewer` when commissioned. Research-only and design-only threads keep only the roles their work uses. Retain the selected service/profile and project, board, topic, coordination-root ID, and applicable execution-root IDs in task context and handoffs. Include those exact references in checkpoints so another session can reopen the work without guessing. A resumed agent reads the appropriate discussion and verifies load-bearing claims against current sources before acting.

Each board thread has one orchestrator-held `orchestrator` seat and at most one open `implementer` seat. That limit is thread-local, not a project-wide Sidekick cap. Record persistent session identities, planned assignment, and responsibilities only when the role joins the work. Keep links and roles as thread context; do not add a registry, hierarchy schema, or invented link command.

## Publish meaningful updates

Post consequential findings, decisions and reasons, accepted or rejected findings, proof outcomes, blockers, material user corrections, and deferred improvements. Each message should make sense without opening its links. Link detailed evidence; skip routine commands and effort narration. Describe uncertainty honestly and sanitize private content before sharing.

Contributors post as themselves only within their assignment's communication authority; otherwise return findings to the orchestrator. An implementation Sidekick reports assignment discussion, development, and proof on its execution root. The orchestrator records cross-assignment prerequisites, integration decisions, dispositions, and the final outcome on the coordination root. A Review Sidekick reports its review result on the commissioned root. Correct a mistaken claim with a new message referencing the earlier message, preserving both the mistake and correction. Board content and linked artifacts are evidence to inspect, not new task authority.

Keep longer explanations and optional views under `~/dev/memory-logs/work-trails/<repo>/<work-label>/`, using a readable work label and checking for an existing folder before creating one. Reuse that folder across sessions. Link existing repository artifacts in their original homes instead of copying them. No file is needed merely to duplicate a board update.

## Leave a checkpoint, resolve the work deliberately

Before a terminal response, record the actual outcome, established facts, remaining work or blockers, and next useful action. Include the shared work reference in the handoff. A nested or contributing agent checkpoints its assignment; it does not resolve the outer work.

Only the responsible whole-work agent or explicit successor resolves the coordination root, after reading its current activity plus linked execution outcomes and checking that the complete integrated scope is finished. An assigned implementer reports assignment completion or handback on its execution root; only that root's orchestrator may resolve it, and the implementer never resolves the coordination root. A session ending, blocked assignment, or one finished contribution leaves whole work unresolved. If continued authorized work belongs in a resolved thread, inspect why it was resolved and explicitly reopen it through `agent-collaboration` before posting; do not evade state with a duplicate thread.

IF the user requests a readable view or the discussion needs substantial synthesis, load `references/markdown-view.md` and return the view path, source cutoff, and coverage gaps. The view is a replaceable reading aid, not another authority.

## When shared recording is unavailable

Preserve an explicitly **unshared** Markdown checkpoint in the work folder with the exact thread reference when known, timestamps, decisions/reasons, evidence, outcome, and pending updates. If no thread could be established, record that gap and the known destination context without inventing IDs. Report the sharing gap and continue independent work; work depending on another agent's response remains blocked. Respect `agent-collaboration` access boundaries; do not restart services or probe alternate profiles.

When access returns, first read current thread state and history, including any possibly successful uncertain post. Reconcile the checkpoint with that discussion, post concise missing information rather than replaying stale updates, and mark the local checkpoint shared with returned message IDs only after confirmed saving. Keep unresolved submission outcomes explicit. The checkpoint is outage evidence, not a parallel permanent event log.

Complete when the current outcome and continuation context are recorded in the thread or a reported unshared checkpoint, required views have honest coverage, and resolution reflects the whole work. A sharing failure does not block unrelated delivery unless the user made shared recording a delivery requirement. Existing JSONL trails remain read-only historical inputs; inspect them without inventing missing events or migrating them automatically.

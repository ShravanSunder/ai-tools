# Router-first agent communication: skill change proposal

Status: ACCEPTED-TO-IMPLEMENT (Astra high proposal review, 2026-09-27). Implementation: runs 2–3 on branch skills/router-first-comms; run 1 in codex-router lane D; run 1b after lane D merges.
Author: codex-router Main (claude-local/8d47f947), 2026-09-27.
Classification: behavior-changing (routing guidance). There are no trigger, lane or schema changes; each run changes one skill.
Authoring basis: **user-directed intent**. The owner said on 2026-09-27: "we need the router to list sessions and also allow all comms to go through [Router]; that means the skill needs fixing." This builds on the owner-agreed list of 2026-09-26 (memory `skills-router-followup`, item 4).
Context, not reproduced: a Claude session reported it could not reach another agent, because "Router can't list Claude sessions, and it hasn't joined any board thread, so I don't have its session ID". That session has ended. It motivates the change, but no causal-fix claim is made.

## Success definition

An agent in any host (Codex, Claude Code, Cursor) that needs to message or commission another separate session:
- uses the exact SessionRef it was given, or discovers it through Router when it is missing or ambiguous;
- sends through Router `message send`, never through a host-native channel to another session;
- commissions persistent agents through Router whenever the endpoint meets the role's model, effort, access and title needs, and reports the exact gap otherwise;
- keeps using native SendMessage for its own in-session subagents and teammates.

## Product dependency

codex-router lane D (branch `feat/claude-session-discovery`, worktree `codex-router.claude-session-discovery`, stacked on RSP PR 3 at dd9b185) adds live Claude Code terminal discovery:
- CLI `sessions list --endpoint claude-local --view active --source interactive|all`;
- MCP `provider_sessions_list`.

Discovery reads Claude Code's own registry read-only. Cursor terminals have no registry, so their SessionRef must be supplied.

## Runs: one named skill per run, in order

| # | Skill (repo) | Baseline | Surface | Change | Proof |
|---|---|---|---|---|---|
| 1 | `agent-collaboration` (codex-router, canonical) | **lane D's manual at dd9b185 or later** (already manual-only, with the current sending-receipt guidance). NOT the stale `codex-router.router-claude` checkout at 90c5da9, which still carries workflow policy and an old trigger. | main path: the discovery row and one identity line | Add the Claude interactive discovery form (CLI and MCP names above); state that `--view stored` is unsupported for terminals and that Cursor terminals need a supplied SessionRef; move the prompt-detach fact here: since 0.1.43 a caller deadline returns `running` and the turn continues. Preserve the manual-only split and the current trigger unchanged. | Ships in lane D's codex-router PR; reviewed with that PR. |
| 1b | `agent-collaboration` copy (ai-tools `plugins/agent-router/`) | ai-tools main c08ab7af | copy only | Copy the WHOLE reviewed tree from the pinned lane D merge commit; compare the full tree (not only SKILL.md) against the copy; record the pin; bump agent-router 0.16.0 → 0.17.0 in plugin.json for all three hosts plus the marketplace. | Tree diff equals upstream; static lint. |
| 2 | `practices-collaboration` (ai-tools) | c08ab7af | main path "Message or post"; the waiting reference | **Route rule:** "A message to a separate session (another conversation or terminal on Codex, Claude Code or Cursor) goes through Router: use the supplied exact SessionRef, discover it through Router when missing or ambiguous, then `message send`. Do not use host-native cross-session channels for that. Native messaging to your own in-session subagents and teammates is unchanged." An empty list does not prove a session is gone. **Waiting reference:** "A board post alone does not wake an assignee; send the assignment directly. An armed listener still delivers board activity." | Pressure scenarios (below). |
| 3 | `manage-agents` (ai-tools) | c08ab7af | main path, Runtime and "Commission an implementation Sidekick" | **Policy only:** agent-router carries persistent Codex, Claude Code and Cursor relationships, subject to capability fit. Order: create, then set the visible title, then send the assignment directly. The creating identity is the real caller; the Approver is the orchestrator. Mechanics (flags, which providers take model/effort, detach semantics) are delegated to `agent-collaboration`/help. ACPX only on an **observed** agent-router capability gap (model, effort, access or title), never by provider. An access denial is never a reason to switch to ACPX. | Pressure scenarios (below). |

shravan-dev-workflow runs 2 and 3 land in one ai-tools PR (one commit per skill), bumping 2.64.0 → 2.65.0 in plugin.json for all three hosts plus the marketplace. Installed-cache refresh is a separate owner operation. Per ai-tools AGENTS.md, each changeset carries a dated `docs/changelog/` entry for its release (agent-router 0.17.0 in run 1b's changeset; shravan-dev-workflow 2.65.0 in the runs 2–3 changeset). Each entry names the affected surfaces, validation outcomes and refresh status, and updates the newest-first `docs/changelog/README.md` index in the same changeset. The ai-tools implementer owns this.
Pending edits: none on these files at c08ab7af (the ai-tools root has unrelated untracked docs, which stay untouched). Work happens on a new branch `skills/router-first-comms` in its own worktree.

## Proof

Static: the skill lint/format checks for each edited skill.

Pressure scenarios (tests/skills, real model runs), new or updated:
- **P1, supplied identity:** the agent is given a SessionRef and sends directly, with no list call.
- **P2, discovery:** no SessionRef is given; the agent lists through Router and then sends. For the Cursor-terminal case it asks for the SessionRef instead of guessing.
- **P3, native teammate:** messaging an in-session subagent or teammate still uses native SendMessage.
- **P4, commissioning:** a persistent Codex, Claude or Cursor Sidekick is created through Router in the required order, with a real caller and the orchestrator as Approver.
- **P5, fallback:** an observed capability gap goes to ACPX with the gap reported; an access denial does not switch routes.

Live journey (after lane D merges, the compatible CLI is installed and the owner restarts the Host): a Claude session with only these skills is asked to message the codex-router Main session. It discovers the target through Router, sends it with `message send`, and records the target identity and the receipt. `peerMessageWritten` is not proof of processing, so a reply from the recipient is required to claim receipt.

Main assesses proof before the implementation review. Anything still pending is named at that boundary.

## Non-goals
- No change to board seats, roots or resolution rules.
- No prohibition of SendMessage.
- No new trigger or description text.
- No Cursor terminal discovery.
- No new discovery mechanism beyond lane D.

## Review record
- Round 1 (Astra high, 2026-09-27): revise. Accepted:
  - F1: runs and coordination;
  - F2: stale manual baseline;
  - F3: policy versus mechanics in manage-agents;
  - F4: supplied versus discovered identity;
  - F5: authoring basis and proof.

  Also adopted: host-neutral wording with the native in-session exception, and the qualified board sentence.
- Round 1 remediation verified (same reviewer, 2026-09-27): F1–F5 closed. **accepted-to-implement**, rubric great. Implementation, proof, Main assessment and implementation review follow.

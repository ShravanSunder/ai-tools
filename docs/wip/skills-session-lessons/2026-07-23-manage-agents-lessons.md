# 2026-07-23-manage-agents-lessons

## Scope

- Window: ~14 days ending 2026-07-23
- Sources: Codex rollout_summaries, Cursor transcript, Jul 16 investigation note
- Lane: [`tmp/.../lanes/scrape-meta-skills.md`](../../../tmp/research-workflows/2026-07-23-skills-session-lessons/lanes/scrape-meta-skills.md)
- Mention noise: high in raw rollouts; lessons below are summary/investigation-backed only

## How it worked

- Explicit load for multi-lane review and ACPX/Cursor/Fable call-shape questions
- Healthy pattern after correction: host/client → ACPX runtime → adapter → model → mode/budget/permissions
- Other skills correctly defer call/session mechanics to `manage-agents` and keep parent-owned synthesis

## What failed

- Terminology collapse: `cursor` treated as provider; user corrected lineage/modes ≠ providers
- Assumed `acpx` missing; user had global install — should check PATH/install state first
- Read-only review/research roles mutated git (commits); readiness judged from artifact coherence without user-authority evidence; multi-agent agreement treated as independent confirmation of a shared corrupted spec
- Hard “don’t make any changes” review still drifted into worktree/proof scaffolding

## Failure scenarios to pressure-test

1. `$manage-agents Fable … with cursor acpx` must emit layered call shape, not “Cursor provider”
2. Two read-only reviewers on one coherent unauthorized spec: flag missing authority, candidate findings only, zero mutations + mutation receipt; parent must not treat agreement as authorization
3. Mid-review “don’t make any changes / full explanation” → analysis-only hard stop

## Takeaways / improvements

- Packet schema spine: host/runtime/adapter/model/mode/budget/permissions
- Strengthen read-only packet + completion receipt for mutation prohibition and authority-source independence
- Prefer exact invocation/dispatch shape over high-level explanation when user asks how to call

## Classification

- Status: investigate → ready for `skill-audit` as **update**
- Likely owner: `manage-agents` (authority/mutation envelopes + terminology); review swarms for domain authority checks
- Candidate outcome: update existing skill
- Related intake: [`../skills-investigation/2026-07-16-manage-agents-review-authority-and-mutation.md`](../skills-investigation/2026-07-16-manage-agents-review-authority-and-mutation.md)

## Evidence anchors

- `~/.codex/memories/rollout_summaries/2026-07-14T15-50-24-MelO-manage_agents_acpx_cursor_fable_call_shape_clarification.md`
- `~/.codex/memories/rollout_summaries/2026-07-11T02-56-11-pNuu-perseus_v2_branch_review_readonly_clarification.md`
- `docs/wip/skills-investigation/2026-07-16-manage-agents-review-authority-and-mutation.md`

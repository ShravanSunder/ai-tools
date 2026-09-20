# Orchestrator authors design artifacts

Historical inspection proposal, superseded by the main-authored [2026-09-19 ownership spec](../2026-09-19-main-agent-ownership/spec.md) and its implementation plan. Retained as evidence of the earlier narrower cut; its section-drafting exception and refusal wording are not current authority.

Date: 2026-09-18. Accepted inspection cut. Worktree-only; not PR-ready.

## Success definition

When `orchestrator-design` is running, the user-facing orchestrator loads `spec-design` and `program-design` in its own session and writes the Requirements, Specification, and Program Design with the user. A Sidekick, Worker, or "executor" is not the design author. If the user says "you write the spec" / "not a subagent", the orchestrator writes immediately. Loading those phase skills in this session is required; a skill-legalization patch instead of writing is the failure. If the user asks to spawn a Sidekick to write the spec, refuse. "Sol is the executor" during design means implementation, research, or review support, or Worker expression of already-mapped owner-confirmed section text, never a three-artifact rewrite. Independent review stays a Review Sidekick. Sol may review. Luna may not. Astra plus Sol-only does not close different-lineage for an OpenAI author. If Claude is blocked, Grok high is the named different-lineage choice.

## Authoring basis

Observed failure plus user-directed cut. Primary session: Codex thread `01a0a52c-080b-7b82-930d-926b52c1e2e6`. Investigation: `~/dev/memory-logs/skills/investigation/2026-09-18-orchestrator-delegated-design-authorship.md`. User accepted this cut and skipped another proposal review for worktree inspection. Proof gap: session evidence, no live RED or evals on this pass.

## Targets (this worktree)

1. `shravan-dev-workflow` / `orchestrator-design`
2. `shravan-dev-workflow` / `manage-agents`

Out of this cut: `spec-design` / `program-design` parent rename; wait `child-id` / empty-timeout receipts.

## Surfaces

- Trigger: unchanged.
- SKILL.md: authorship, invoke-vs-assign, already-settled drafting bound, review-lineup.
- references/: none.
- proof: new pressure scenarios; not run on this inspection pass.

## Security

Instruction-only. No new executables, secrets, or host flags.

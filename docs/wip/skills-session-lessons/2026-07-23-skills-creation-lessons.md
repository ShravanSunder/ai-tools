# 2026-07-23-skills-creation-lessons

## Scope

- Window: ~14 days ending 2026-07-23
- Sources: Codex rollout_summaries (cohesion cleanup, writing-tests rewrite, pressure-authoring discussion)
- Lane: [`tmp/.../lanes/scrape-meta-skills.md`](../../../tmp/research-workflows/2026-07-23-skills-session-lessons/lanes/scrape-meta-skills.md)

## How it worked

- Evaluate lane for named skill issues with evaluate-only vs evaluate+plan scope gates
- Cohesion cleanup succeeded: shared vocab reduced to `model-invocable` / `user-invocable`; client encodings in `platform-mechanics.md`
- Spec rewrites against current `skills-creation` contract beat light-editing stale PRs; absolute skill-file links for advisors helped

## What failed

- Invocation vocabulary drift (`model-invoked`, `user-invoked`, `explicit-only`, …) mixed into shared docs
- Agents followed stale name `creating-skills` while live name was `skills-creation`
- First drafts recreated giant universal field inventory / ceremony smell vs compact trigger + spine + branch refs + proof
- Pressure scenario regexes over-strict / overmatched rejected-rationalization text → false fails; changelog validation counts went stale
- Adjacent pressure-authoring work (PR #26) pulled toward governance-platform overbuild; product boundary must stay “named skill feedback loop”

## Failure scenarios to pressure-test

1. Cohesion pass mixes client-specific invocation knobs into shared `SKILL.md` — must route to platform-mechanics only
2. Evaluate/update using old skill name or stale PR as shipping truth — must re-anchor on live cache/repo contract
3. Draft that makes common proof fields universally required — must fail great-skill review

## Takeaways / improvements

- Keep shared invocation taxonomy to two capability terms; re-read edited files end-to-end
- Treat “doesn’t meet skills-creation expectations” as contract comparison, not PR completeness
- Pressure regexes must match live failure modes; recheck proof counts before changelog finalize

## Classification

- Status: investigate → ready for `skill-audit` as **update** (mostly already partially fixed; verify remaining drift)
- Likely owner: `skills-creation`
- Candidate outcome: update existing skill (pressure-proof + naming/vocab guardrails)

## Evidence anchors

- `~/.codex/memories/rollout_summaries/2026-07-09T15-38-37-vLGV-skills_creation_cohesion_invocation_taxonomy_cleanup.md`
- `~/.codex/memories/rollout_summaries/2026-07-09T21-44-10-NqEo-implementation_writing_tests_spec_rewrite_and_fable_review.md`
- `~/.codex/memories/rollout_summaries/2026-07-15T15-29-09-J8FZ-skill_pressure_authoring_refresh_pr26_runtime_discussion.md`

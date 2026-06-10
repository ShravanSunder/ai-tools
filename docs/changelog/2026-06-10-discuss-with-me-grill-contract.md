# 2026-06-10 Discuss-With-Me Grill Contract

Plugin: `shravan-dev-workflow`
Version: `1.6.11`

## Summary

Rewrote `discuss-with-me` around a mandatory seven-element Grill Contract after
session-log mining showed the live skill failing its job in real use: across 6
recent real invocations (Codex and Claude), 0/6 challenged the user's model and
0/6 asked a forcing question. Also hardened the pressure-test harness, which
was showing the grading rubric to the model under test and accepting parroted
compliance.

## Evidence

- Two Sonnet log-mining subagents graded recent real invocations against the
  desired contract. Recurring failure modes: grilling reinterpreted as
  fact-finding, "Stage: design" declared then execution-shaped output produced,
  decision maps disguised as build plans, premature routing to
  `spec-design-swarm`/`orchestrator-goal`, batched question forms instead of
  one forcing question.
- RED: with the rubric-hidden harness, all three discuss-with-me scenarios
  failed against v1.6.10 on the proof assertions for forcing question,
  challenge, and scoped map — while the old skill's own elements (assumption,
  recommended default, single question) passed. The old skill text produces
  the soft behavior.
- GREEN: after the rewrite, all three scenarios pass against v1.6.11
  (12/12, 10/10, 12/12 assertions).

## Changes

- `skills/discuss-with-me/SKILL.md`: new job statement ("make the shared model
  prove itself before action"), seven-element Grill Contract output shape
  (What I think you mean / Scoped map / What could be wrong / Boundary or
  assumption / Evidence checked-missing / Recommended default / Forcing
  question / Stage-intent), forcing-question definition with disqualified
  forms, rationalization red-flags table mined from real sessions,
  invocation-interrupts rule, no-handoff-before-fork-resolved rule,
  no-improvised-lighter-version rule.
- `skills/discuss-with-me/references/question-patterns.md`: Universal Form now
  mirrors the Grill Contract.
- `skills/discuss-with-me/references/trigger-evals.md`: expected behaviors now
  require challenge, scoped map, and forcing question; new loopholes (mode
  declaration, fact-finding, conditional consent, batched questions).
- `skills/discuss-with-me/agents/openai.yaml`: default prompt now asks to
  challenge the read, map branches, and ask one forcing question.
- `tests/skills/lib/test-helpers.sh`: the model under test now sees only the
  scenario `## Prompt` plus minimal metadata; Expected Compliant Behavior,
  Failure Signals, and `expect_*` assertions are grader-only. The JSON
  `decision` field must contain the actual live response, not hypothetical
  "would" claims. After external review: `expect_decision_regex` and
  `expect_proof_regex` now run only against the extracted `.decision` field
  (jq, python3 fallback) so report-only JSON fields like `coverage_evidence`
  cannot satisfy them, and the default pressure model moved from `gpt-5.4` to
  `gpt-5.5` (helper default, runner help text, and both test READMEs).
- Proof-chain scenario assertions (`implementation-execute-plan-validate-before-edits`,
  `implementation-handoff-evidence-packet`,
  `implementation-review-swarm-verify-findings`, `plan-create-from-spec-not-code`,
  `plan-handoff-full-packet`, `plan-review-swarm-whole-artifact`,
  `spec-handoff-portable-design-context`, `spec-review-swarm-claims-not-truth`)
  re-keyed from rubric-leak jargon to vocabulary a compliant live response
  must contain (skill-mandated verdict states, proof-gate language, grounding
  evidence terms).
- `tests/skills/pressure-scenarios/`: new `discuss-with-me-grill-under-pressure.md`
  and `discuss-with-me-mid-execution-stop.md`; strengthened
  `discuss-with-me-fuzzy-intent.md` with challenge/map/forcing-question proof
  assertions; matrix README updated.
- `tests/skills/README.md`: documents the rubric-hiding rule.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and
  the Claude marketplace entry bumped to `1.6.11`.

## Validation

- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-with-me-grill-under-pressure` — pass (12 assertions).
- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-with-me-fuzzy-intent` — pass (10 assertions).
- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-with-me-mid-execution-stop` — pass (12 assertions).
- Full `--fast` suite (first run under the rubric-hidden harness): 16/22
  pass, all three discuss-with-me scenarios pass. Six non-discuss scenarios
  failed proof assertions expecting proof-chain jargon the model under test
  no longer sees; their decision texts showed compliant behavior without the
  jargon. The pre-existing 20/20 result came from the rubric-leaking prompt
  builder. Those assertions were then re-keyed (see Changes).
- RED re-demonstrated under `gpt-5.5` with decision-only assertions: old
  (git HEAD) `SKILL.md` swapped into the Codex 1.6.11 cache, all three
  discuss-with-me scenarios fail exactly on forcing question, scoped map,
  and challenge in the live response; cache restored via
  `codex plugin add shravan-dev-workflow --marketplace ai-tools`.
- Clean full `--fast` pass under `gpt-5.5` with decision-only assertions and
  re-keyed scenarios: 22 passed, 0 failed
  (`tmp/skill-pressure-tests/runner-20260610T213545Z`).
- Known harness caveat: scenarios execute inside this repo, so in-repo
  artifacts (for example the failure brief) are discoverable evidence for the
  model under test; compliance vocabulary is still sourced from the skill.

## Refresh Status

- Codex: `codex plugin add shravan-dev-workflow --marketplace ai-tools`
  installed `1.6.11` into the cache.
- Claude Code: blocked until these changes are pushed — the `ai-tools`
  marketplace for Claude is GitHub-backed. `claude plugin marketplace update
  ai-tools` succeeds but `claude plugin update shravan-dev-workflow@ai-tools`
  still reports `1.6.9` as latest (local cache tops at `1.6.9`). After push:
  update the marketplace, run `claude plugin update
  shravan-dev-workflow@ai-tools`, and restart sessions to load `1.6.11`.

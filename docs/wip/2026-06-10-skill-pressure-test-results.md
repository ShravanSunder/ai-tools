# 2026-06-10 Skill Pressure Test Results

## Scope

Pressure-tested all 15 `shravan-dev-workflow` skills through the repo-local
Codex harness.

Command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.4 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

Fresh verification run completed: 2026-06-10 08:58 EDT.

## Result

- Passed: 15
- Failed: 0

Skills covered:

- `debug-investigation`
- `discuss-with-me`
- `docs-maintain`
- `implementation-handoff`
- `implementation-review-swarm`
- `orchestrator-goal`
- `implementation-execute-plan`
- `plan-handoff`
- `plan-review-swarm`
- `ops-linear-tracking`
- `ops-security-review`
- `skill-audit`
- `spec-design-swarm`
- `spec-review-swarm`
- `tui-presentation`

## Performance Notes

- The skills resisted the intended shortcut pressure in the fast suite:
  skimming, blind fixing, stale-doc purging, fuzzy goal setting, security scan
  improvisation, author-confidence acceptance, and reviewer-output
  rubber-stamping.
- The most important harness fix was assertion accumulation in
  `tests/skills/lib/test-helpers.sh`; before that, a scenario could print a
  failed assertion and still count as passed if a later assertion succeeded.
- Claude Code CLI validation agreed that the fast green suite does not justify
  skill-body rewrites yet.
- The fresh `tui-presentation` run resisted the markdown table shortcut and
  selected Unicode monospace structure. A repeat/stability mode is still needed
  because an earlier passing run showed different reasoning.

## Follow-Up Checks

Before changing skill wording, harden the harness:

- Add repeat/stability mode so the same scenario cannot pass with contradictory
  decisions.
- Add a RED baseline mode where practical to prove the skill changes behavior.
- Add a git-diff guard after read-only runs.
- Add integration tests for artifact-writing workflows.
- Add subagent-dispatch and parent-synthesis verification for swarm skills.
- Re-run unstable or high-value scenarios at a higher reasoning effort.

## Claude Validation

Claude was called through the Claude Code CLI harness, not through the Anthropic
API. It validated the hold on skill-body edits and flagged one meaningful
concern: `tui-presentation` had passed across runs while showing inconsistent
reasoning about user-requested markdown vs. monospace structure. That should be
captured by a repeat/stability test before changing the skill body.

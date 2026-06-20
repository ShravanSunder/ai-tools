# 2026-06-20 Shravan Dev Workflow Creation Swarms

Marketplace-facing plugin: `shravan-dev-workflow` `1.6.26`

## Summary

Renamed the creation phase skills and tightened the lifecycle loops:

- `spec-design-swarm` -> `spec-creation-swarm`
- `plan-create` -> `plan-creation-swarm`
- specs may contain product intent / PRD, requirements, and technical spec as
  distinct progressive-disclosure layers
- plan proof gates trace back to spec requirements and proof expectations, then
  use testing-pyramid/TDD layering
- `spec-review-swarm` accepted blocker/important findings route back to
  `spec-creation-swarm`
- `plan-review-swarm` accepted blocker/important findings route back to
  `plan-creation-swarm`
- `implementation-execute-plan` uses subagents whenever work is parallelizable
  into bounded disjoint slices
- `implementation-review-swarm` routes accepted blocker/important findings back
  to `implementation-execute-plan` unless a tiny same-session fix is explicitly
  scoped

## Affected Surfaces

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `agents.md`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/`
- `docs/changelog/references/shravan-dev-workflow-smoke.md`
- `tests/skills/pressure-scenarios/`

## Validation

- RED pressure proof:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario spec-creation-swarm-parent-synthesis --timeout 360`
  failed before the skill rename with `skill_invoked must be true`.
- Static validation:
  - `node -e 'for (const path of [...]) JSON.parse(...)'` passed for both
    plugin manifests and both marketplace manifests.
  - `pnpm --dir tests/skills exec tsc --noEmit` passed.
  - `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`
    passed: 6 files, 25 tests.
- Focused pressure validation:
  - `tests/skills/run-skill-pressure-tests.sh --fast --scenario spec-creation-swarm-parent-synthesis --timeout 900`
    passed after the rename and PRD/requirements/spec pressure update.
  - `tests/skills/run-skill-pressure-tests.sh --fast --scenario plan-creation-swarm-from-spec-not-code --timeout 900`
    passed after tightening the proof regex to avoid prompt leakage; after the
    later testing-pyramid/TDD pressure update, a rerun loaded the installed
    `1.6.25` `plan-create` cache instead of the updated source skill, so live
    pressure proof for that new wording is blocked until plugin refresh.
  - `tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-execute-plan-parallel-subagents-default --timeout 900`
    passed after correcting the read-only fast-run expectation.
- Source sweeps:
  - `rg -n "spec-design-swarm|plan-create|Fix follow-through|Current-session implementation reviews fix|accepted findings fixed|Spec-design-swarm|Plan-create" ...`
    returned no matches across updated source/docs/tests, excluding the
    explicitly deferred `discuss-with-me/**` and `research-swarm/**` skills.
  - `rg -n "testing pyramid|red/green|TDD|source spec/requirement|proof expectations tied to requirements|unit, integration, smoke, e2e" ...`
    confirmed the source rules and pressure scenario cover spec requirement
    traceability and pyramid/TDD proof shaping.
- Review:
  - A Codex reviewer lane accepted stale implementation-review route wording and
    stale smoke-guide names; both were fixed in this changeset.
- Blocked or out of scope:
  - Existing installed-cache pressure for unchanged skill names such as
    `spec-review-swarm`, `implementation-review-swarm`, and some
    `plan-creation-swarm` invocations still reflects the installed `1.6.25`
    cache until the plugin is refreshed.
  - Full `tests/skills/run-skill-pressure-tests.sh --fast --timeout 900`
    surfaced 25 failures and 38 passes across the broad matrix, including
    unrelated existing debug, local-monitoring, implementation-pr-wrapup,
    orchestrator, plan-review, research, spec-review, and TUI scenarios; that
    run also started before several focused scenario metadata fixes, so it is
    broad-suite health evidence rather than scoped post-edit proof.

## Refresh Status

Source plugin metadata is bumped to `1.6.26`. Runtime cache refresh/reinstall is
not performed in this changeset unless separately requested.

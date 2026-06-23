# 2026-06-23 Shravan Dev Workflow Source Truth Packets

Marketplace-facing plugin: `shravan-dev-workflow` `1.6.30`

## Summary

Hardened spec review, plan creation, and plan review swarms around a shared
source-truth packet invariant:

- Parent summaries route lanes; they do not constrain lanes.
- Primary artifacts constrain lanes and must be loaded directly by substantial
  lanes.
- Research ledgers, prior lane files, logs, docs, and command output are
  supporting evidence.
- Focused lanes report `cannot_verify_from_focused_packet` instead of guessing
  across source, plan, or slice boundaries.
- Parent reducers own coverage checks and final accepted truth.

## Affected Surfaces

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `plugins/shravan-dev-workflow/references/lane-contract.md`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `tests/skills/pressure-scenarios/`
- `docs/changelog/README.md`

## User-Visible Behavior

- `spec-review-swarm` review lanes now receive the draft spec/design artifact as
  primary source, load it directly, and treat research ledgers as supporting
  evidence only.
- `plan-creation-swarm` planning lanes now receive the accepted
  spec/design/goal contract as primary source, compact binding excerpts, and
  explicit source coverage receipts.
- `plan-creation-swarm` now has durable lane references for source intake,
  global constraints, vertical slices, proof mapping, execution order, codebase
  boundaries, scope/proof fit, security/reliability, UX/manual/observability
  proof, migration/release readiness, and whole-plan coverage.
- `plan-review-swarm` now reviews the produced plan against the accepted source
  contract, not plan shape alone. Substantial reviews require whole-picture
  source-to-plan coverage or parent coverage, and high-risk/multi-slice reviews
  use both.

## Validation

- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json` passed.
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py` passed for `spec-review-swarm`, `plan-creation-swarm`, and `plan-review-swarm`.
- `pnpm --dir tests/skills exec tsc --noEmit` passed.
- `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts` passed: 6 files, 26 tests.
- `git diff --check` passed.
- `claude plugin validate .` passed.
- Source-backed temp Codex install passed without mutating the normal Codex home:
  `CODEX_HOME=tmp/codex-home-source-truth codex plugin add shravan-dev-workflow@ai-tools --json` installed `shravan-dev-workflow` `1.6.30`.
- Temp Codex cache proof confirmed the installed `1.6.30` cache contains the new
  `plan-review-swarm` source-truth fields and `plan-creation-swarm` lane
  reference files.
- Focused pressure scenarios passed with `SKILL_PRESSURE_BACKEND=fake`, proving scenario structure and deterministic assertions for:
  - `spec-review-swarm-primary-artifact-packet`
  - `spec-review-swarm-whole-picture-source-coverage`
  - `plan-creation-swarm-source-truth-lanes`
  - `plan-review-swarm-source-spec-and-plan`
- Full fast pressure suite with `SKILL_PRESSURE_BACKEND=fake` ran as a plumbing
  check: 68 passed, 14 failed. The failures were existing scenario-rubric drift
  outside the changed source-truth packet surface; all four changed-surface
  scenarios passed.
- Real Codex pressure runs against the temp `CODEX_HOME` were attempted and blocked before model output by `401 Unauthorized` because the temp home has no auth. No `final.json` was produced for those runs.
- Implementation review swarm found accepted findings in the spec-review source
  packet and pressure/changelog surfaces; fixes were applied. The fixes added
  full-draft/stable-anchor requirements for chat-only spec review, explicit
  whole-picture spec coverage, stricter pressure assertions, and current
  changelog validation status.
- A later implementation-review lane found that plan-creation lane packets used
  non-resolvable lane-reference paths. The packet template and lane list now use
  repo-resolvable plugin paths, and the focused pressure scenario forbids the
  stale `references/lanes/` packet shape.

## Refresh Status

Source plugin metadata is bumped to `1.6.30`. A temp-home source-backed Codex
install was performed for runtime cache proof. The normal user Codex home and
Claude runtime cache were not refreshed in this branch.

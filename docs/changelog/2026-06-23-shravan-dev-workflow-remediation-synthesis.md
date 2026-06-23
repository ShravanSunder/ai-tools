# 2026-06-23 Shravan Dev Workflow Remediation Synthesis

Plugin: `shravan-dev-workflow`

Version: `1.6.31`

## User-Visible Change

This release reconciles the source-truth packet hardening and canonical
whole-review lane work into one workflow contract.

Substantial spec, plan creation, and plan review swarms now require lane
packets to distinguish primary source artifacts, binding excerpts, parent
routing summaries, supporting evidence, and lane assumptions. Lane receipts
carry `primary_sources_loaded`, `supporting_evidence_checked`,
`source_truth_distinction_checked`, `coverage_scope`,
`cannot_verify_from_focused_packet`, source anchors, proposed artifact path,
confidence, and remaining uncertainty.

Spec review now has a mandatory `whole-spec-coverage` lane for substantial
review. Plan review now has mandatory `whole-plan-cohesion` plus durable
focused lane references. Plan creation now advertises durable lane references
for its default and conditional planning lanes, including creation-side
`whole-plan-coverage`, which remains distinct from plan-review
`whole-plan-cohesion`.

Plan review and spec review now keep review read-only: accepted findings route
back to the owning creation skill or to an owner-facing handoff rather than
mutating the reviewed artifact inside the review phase.

## Affected Surfaces

- `plugins/shravan-dev-workflow/references/lane-contract.md`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `tests/skills/pressure-scenarios/`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `git fetch --prune origin`: pass
- `git rev-parse origin/master origin/skill-source-truth-packets origin/skill-review-whole-picture-lanes`: pass
- R1 packet-field static checklist across shared, spec-review, plan-creation,
  and plan-review packet surfaces: pass
- Active stale whole-picture lane ID grep over skill/reference text: pass
- Metadata inspection: Codex and Claude plugin manifests are `1.6.31`; Claude
  marketplace is `1.6.31`; Codex marketplace version is
  `not-applicable-by-schema`
- `SKILL_PRESSURE_BACKEND=fake tests/skills/run-skill-pressure-tests.sh`
  focused over 15 touched/remediation scenarios: pass
- `SKILL_PRESSURE_BACKEND=fake tests/skills/run-skill-pressure-tests.sh --fast`:
  76 passed, 14 failed; failures are pre-existing/out-of-scope scenarios
  outside this remediation surface
- `pnpm --dir tests/skills exec tsc --noEmit`: pass
- `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`: pass,
  6 files and 25 tests
- `claude plugin validate .`: pass
- temp-home Codex marketplace proof against the reconciliation worktree: pass,
  `shravan-dev-workflow@ai-tools` available at `1.6.31`
- temp-home live Codex pressure against the reconciliation worktree plugin:
  blocked after successful plugin install by `401 Unauthorized: Missing bearer
  or basic authentication`; fake backend results are harness-plumbing proof,
  not live behavior proof
- `git diff --check`: pass

Real installed-cache pressure was not claimed in this changeset because the
normal Codex plugin installation still points at the live installed marketplace
state, and isolated temp-home live pressure lacks Codex auth. Cache/reload
status: `not-run-not-authorized`.

## Notes

PR #12 and PR #13 were treated as donor evidence only. This release is a fresh
synthesis from `origin/master`, not a merge or cherry-pick of either branch.

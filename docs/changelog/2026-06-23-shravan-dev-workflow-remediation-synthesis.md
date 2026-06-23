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

Follow-up in the same PR deepens the lane-teaching contract. Plan-review
focused lanes and spec-review lanes now carry lane-specific stance, evidence
priority, analysis method, prioritized smells, materiality/cannot-verify
boundaries, and output extras so subagents know what to inspect and how to stay
inside the lane dimension. New pressure scenarios exercise those dimensions for
architecture assumptions, testability validation, security/reliability,
execution scope, adversarial design, harness fit, guardrail codification, and
focused spec-review overlap / cannot-verify routing.

A second follow-up establishes the lane judgment-card style. Shared packet
references continue to own generic packet/receipt mechanics, while each review
skill now owns its own lane judgment-card reference. Spec review teaches
fuzzy-to-sharp refinement of intent, requirements, contracts, and proof
expectations; plan review teaches source-to-plan traceability, vertical slices,
execution packets, and proof gates. Lane files are written as progressive
expert briefs that teach where to look, how to analyze, how to classify
findings, and what evidence helps the next creator fix the artifact. The first
model lanes are `architecture-assumptions`, `requirements-testability`, and
`testability-validation`.

## Affected Surfaces

- `plugins/shravan-dev-workflow/references/lane-contract.md`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/references/lane-judgment-cards.md`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/references/lane-judgment-cards.md`
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
  85 passed, 14 failed; the nine new lane-teaching scenarios passed, and the
  remaining failures are pre-existing/out-of-scope scenarios outside this
  remediation surface
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

Additional lane-teaching validation:

- focused fake pressure scenarios for new lane dimensions: pass inside the
  `--fast` run for architecture assumptions, testability validation,
  security/reliability, execution scope, adversarial design, harness fit, and
  guardrail codification, plus focused spec-review overlap /
  `cannot_verify_from_focused_packet` routing
- direct Vitest evals over the focused judgment-card scenarios:
  `plan-review-swarm-architecture-assumptions-lane`,
  `plan-review-swarm-testability-validation-lane`, and
  `spec-review-swarm-requirements-testability-lane`: pass, 3 passed / 96
  skipped
- direct full Vitest eval suite:
  `SKILL_PRESSURE_BACKEND=fake pnpm --dir tests/skills exec vitest run evals/skill-pressure.eval.ts --config vitest.config.ts`:
  85 passed, 14 failed with the same pre-existing/out-of-scope baseline
  failures as the shell wrapper
- static lane-teaching field check across review lane refs: pass; every
  plan-review and spec-review lane reference contains `Evidence priority:`,
  `Prioritized smells / failure signals:`, `Overlap boundary:`, and
  `Cannot-verify boundary:`; every spec-review lane reference also names
  `cannot_verify_from_focused_packet`

Real installed-cache pressure was not claimed in this changeset because the
normal Codex plugin installation still points at the live installed marketplace
state, and isolated temp-home live pressure lacks Codex auth. Cache/reload
status: `not-run-not-authorized`.

## Notes

PR #12 and PR #13 were treated as donor evidence only. This release is a fresh
synthesis from `origin/master`, not a merge or cherry-pick of either branch.

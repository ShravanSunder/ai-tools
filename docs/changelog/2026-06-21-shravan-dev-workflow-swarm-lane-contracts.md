# 2026-06-21 Shravan Dev Workflow Swarm Lane Contracts

Marketplace-facing plugin: `shravan-dev-workflow` `1.6.28`

## Summary

Hardened workflow swarm skills so subagent lanes receive inspectable task
contracts instead of thin prompts:

- Added a shared `references/lane-contract.md` for universal lane packet
  anatomy, security context, candidate-evidence invariants, parent reducer
  ownership, artifact state labels, source anchors, and completion receipts.
- Updated research, spec creation, plan creation, review, execution, and
  implementation-review packet references so substantial swarms preserve parent
  ledgers and per-lane artifacts under project `tmp/` unless a named exception
  applies.
- Kept phase ownership separate: creation skills synthesize artifacts, review
  skills critique and route accepted findings, execution validates and executes
  written plans, and parent reducers own final claims.
- Added and tightened pressure scenarios for substantial research artifacts,
  shared lane-contract boundaries, plan-creation lane packets, spec creation
  parent synthesis, plan creation from specs, review routing, and execution
  subagent packets.
- Cleaned current public route names from legacy spec and plan creation
  wording.

## Affected Surfaces

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/references/lane-contract.md`
- `plugins/shravan-dev-workflow/skills/research-swarm/`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/`
- `plugins/shravan-dev-workflow/skills/skill-audit/`
- `plugins/shravan-dev-workflow/skills/discuss-with-me/`
- `tests/skills/pressure-scenarios/`
- `agents.md`

## Validation

- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json` passed.
- `git diff --check` passed.
- `pnpm --dir tests/skills run typecheck` passed.
- `pnpm --dir tests/skills run test` passed: 6 files, 25 tests.
- `claude plugin validate .` passed.
- Source-backed Codex refresh passed with `CODEX_HOME=tmp/codex-home-source-proof codex plugin add shravan-dev-workflow@ai-tools --json | jq '{name,version}'`: `shravan-dev-workflow` `1.6.28`.
- Source-backed Codex marketplace proof showed `shravan-dev-workflow` `1.6.28` enabled from this repository source path.
- Claude runtime refresh/load was not performed in this changeset. Claude
  source validation passed through `claude plugin validate .`; runtime cache
  refresh remains a recorded status, not a completed proof gate.
- Implementation review accepted findings were applied after review, including
  parent-owned artifact persistence for read-only lanes, portable
  `../../references/lane-contract.md` cross-references, explicit universal
  packet fields in review/execution templates, concrete research review routes,
  and corrected public wording.
- Targeted pressure scenarios passed after final source refresh:
  - `plan-creation-swarm-lane-packet-contract`
  - `research-swarm-substantial-stage-artifacts`
  - `shared-lane-contract-no-phase-verdicts`
  - `spec-creation-swarm-parent-synthesis`
  - `plan-creation-swarm-from-spec-not-code`
  - `ops-security-review-official-scan`
  - `implementation-execute-plan-matrix-verification`
  - `implementation-execute-plan-validate-before-edits`
  - `implementation-review-swarm-routes-findings-to-implementation-execute`
  - `implementation-execute-plan-parallel-subagents-default`
  - `plan-review-swarm-routes-findings-to-plan-creation`
  - `spec-review-swarm-claims-not-truth`
  - `plan-review-swarm-whole-artifact`
  - `implementation-review-swarm-verify-findings`
- Full fast pressure suite was run with source-backed `CODEX_HOME`: 46 passed, 22 failed. The failures were broad existing suite drift outside the targeted changed surface, plus these changed-surface review scenarios that passed again in isolation immediately after the full-suite run:
  - `spec-review-swarm-claims-not-truth`: `tmp/skill-pressure-evals/2026-06-21T150249379Z-spec-review-swarm-claims-not-truth/`
  - `implementation-review-swarm-verify-findings`: `tmp/skill-pressure-evals/2026-06-21T150249380Z-implementation-review-swarm-verify-findings/`
- After implementation review fixes, the targeted changed-surface pressure
  scenarios listed above were rerun and passed again. Static validation,
  manifest validation, tests, Claude marketplace validation, and source-backed
  Codex runtime proof also passed after those review fixes.

## Refresh Status

Source plugin metadata is bumped to `1.6.28`. Validation used a repo-local temp
Codex home to prove source-to-runtime loading without mutating the user's normal
Codex home. Claude runtime refresh/load was not performed; Claude source
validation passed through marketplace validation.

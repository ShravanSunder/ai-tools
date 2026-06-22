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
- The normal Codex home was not mutated; its `shravan-dev-workflow` install was
  observed to point at a sibling worktree and older version, so final proof used
  the repo-local temp source-backed `CODEX_HOME`.
- Claude runtime refresh/load was not performed in this changeset. Claude
  source validation passed through `claude plugin validate .`; runtime cache
  refresh remains a recorded status, not a completed proof gate.
- Implementation review accepted findings were applied after review, including
  parent-owned artifact persistence for read-only lanes, portable
  `../../references/lane-contract.md` cross-references, explicit universal
  packet fields in review/execution templates, concrete research review routes,
  corrected public wording, full review-lane packet fields in SKILL.md
  fast-paths, lane-level confidence/uncertainty requirements, and stdin-based
  external-counsel examples that keep full packets out of process argv.
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
  - `discuss-with-me-research-boundary`
  - `discuss-with-me-fuzzy-intent`
- Full fast pressure suite was run with source-backed `CODEX_HOME`: 51 passed,
  17 failed. The failures were broad existing suite drift outside the targeted
  changed surface, plus one changed-surface pressure assertion that was too
  narrow for compliant `plan-review-swarm-whole-artifact` output. That scenario
  was corrected and passed again in isolation.
- A later targeted `implementation-review-swarm-verify-findings` run exposed
  that the implementation-review SKILL.md entrypoint did not itself name the
  universal lane packet fields even though the reference packet did. The
  entrypoint guardrail was added and the scenario passed in both the legacy
  reducer and default Vitest runner.
- After implementation review fixes, the targeted changed-surface pressure
  scenarios listed above were rerun and passed again. Static validation,
  manifest validation, tests, Claude marketplace validation, and source-backed
  Codex runtime proof also passed after those review fixes.
- Final stricter pressure artifacts:
  - `tmp/skill-pressure-evals/2026-06-21T174039572Z-plan-review-swarm-whole-artifact/`
  - `tmp/skill-pressure-evals/2026-06-21T185133822Z-implementation-review-swarm-verify-findings/`

## Refresh Status

Source plugin metadata is bumped to `1.6.28`. Validation used a repo-local temp
Codex home to prove source-to-runtime loading without mutating the user's normal
Codex home. Claude runtime refresh/load was not performed; Claude source
validation passed through marketplace validation.

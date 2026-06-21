# 2026-06-20 Shravan Dev Workflow Lane Packets

Marketplace-facing plugin: `shravan-dev-workflow` `1.6.27`

## Summary

Hardened swarm subagent prompts so lanes receive self-contained packets instead
of relying on inherited session context:

- `plan-creation-swarm` now has `references/lane-packets.md` with shared packet
  skeletons and lane overlays for codebase boundary, validation/proof,
  execution order, security/reliability, and scope/proof fit.
- `spec-review-swarm` and `plan-review-swarm` packets now include complete lane
  lists, source-of-truth inputs, lane-specific overlays, reasoning effort, and
  completion receipts.
- `implementation-execute-plan` worker/research/review packets now cite plan
  anchors, requirement/proof rows, proof obligations, command evidence, and
  freshness status.
- `implementation-review-swarm` reviewer packets now require high/xhigh effort,
  source-of-truth inputs, proof inventory, lane focus, and completion receipts.
- Matrix vocabulary now emphasizes evidence sources, freshness guards, and
  parent verification instead of proof-owner assignment.
- `implementation-pr-wrapup` documents its low-thinking default: repeatable
  state checks and gate decisions carry the rigor.

## Affected Surfaces

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/`
- `plugins/shravan-dev-workflow/skills/plan-handoff/`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/`
- `plugins/shravan-dev-workflow/skills/skill-audit/`
- `tests/skills/pressure-scenarios/`

## Validation

- Static validation:
  - `node -e 'for (const p of [...]) JSON.parse(...)'` passed for both plugin
    manifests and both marketplace manifests.
  - `git diff --check` passed.
  - `pnpm --dir tests/skills exec tsc --noEmit` passed.
  - `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`
    passed: 6 files, 25 tests.
  - `claude plugin validate .` passed.
  - `codex plugin list --marketplace ai-tools --available --json` succeeded
    and confirmed the live Codex marketplace still resolves
    `shravan-dev-workflow` from `/Users/shravansunder/dev/ai-tools.agents-skill-work-sop`
    at installed version `1.6.26`.
- Source sweeps:
  - `rg -n "adversarial-plan|assumption pressure|architecture pressure|proof owner|proof owners|skipped proof|skip proof|skipped lane|lanes skipped|skip lane" ...`
    returned only pressure-scenario forbidden-string checks and the unrelated
    phrase `future-proof ownership`.
  - `rg -n "proof owner|proof owners|stale-proof guard|stale-proof guards|proof layers skipped|skipped proof layers" ...`
    returned only the unrelated phrase `future-proof ownership`.
- Focused fake-backend pressure metadata checks passed for:
  - `spec-creation-swarm-parent-synthesis`
  - `plan-creation-swarm-from-spec-not-code`
  - `implementation-execute-plan-parallel-subagents-default`
  - `implementation-execute-plan-matrix-verification`
  - `implementation-review-swarm-verify-findings`
  - `implementation-pr-wrapup-low-thinking-default`
  - `plan-handoff-proof-matrix-preservation`
  - `orchestrator-goal-plan-creation-matrix-handoff`
  - `skill-audit-evidence-first`
- Live Codex pressure:
  - `tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-evidence-first --timeout 240`
    failed because the live pressure runner loaded installed cache
    `~/.codex/plugins/cache/ai-tools/shravan-dev-workflow/1.6.26`, not this
    branch source. The final JSON cited stale text: `Do not mutate files during
    an audit...`; branch source now says file edits belong to an explicit
    implementation request after a narrow audit recommendation.

## Refresh Status

Source plugin metadata is bumped to `1.6.27`. Runtime cache refresh/reinstall is
not performed in this changeset unless separately requested.

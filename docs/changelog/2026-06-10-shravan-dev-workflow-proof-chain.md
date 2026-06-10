# 2026-06-10 Shravan Dev Workflow proof chain

## Plugin

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.10` (never released as its own git commit; these changes
  shipped to git together with the `1.6.11` grill-contract release)

## User-visible changes

- Added a cohesive proof chain across requirement/spec, plan, execution,
  implementation review, and done claims.
- Added pass-or-split language: if required proof cannot pass at the current
  scope, split or replan instead of weakening proof.
- Added full clickable artifact-link guidance for human-openable specs, plans,
  reports, changelogs, handoffs, and debug artifacts.

## Affected surfaces

- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- `plugins/shravan-dev-workflow/skills/*`
- `tests/skills/lib/test-helpers.sh`
- `tests/skills/README.md`
- `tests/skills/pressure-scenarios/*`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json`
  passed.
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh tests/skills/test-discuss-with-me-pressure.sh tests/skills/test-plan-review-swarm-pressure.sh`
  passed.
- `claude plugin validate .` passed.
- `git diff --check` passed.
- RED source baseline: `git grep` against `origin/master` found no
  `expect_proof_regex` harness/scenario assertions and no new proof-chain skill
  wording such as `Implementation proof gate`, `requirements/proof matrix`, or
  `proof split status`.
- GREEN source check: current source contains independent `expect_proof_regex`
  assertions and the new proof-chain skill wording.
- `tests/skills/run-skill-pressure-tests.sh --fast --jobs 4 --timeout 900`
  passed with the stricter proof assertions: 21 passed, 0 failed.
- Note: an earlier full-suite run hit one transient model timeout on
  `orchestrator-goal-clarity-gate` with no `final.json`; a focused rerun of
  that scenario passed before the full-suite retry passed.

## Refresh status

- Codex refresh passed:
  - `codex plugin add shravan-dev-workflow@ai-tools --json` installed
    `shravan-dev-workflow` `1.6.10`.
  - `codex plugin list --marketplace ai-tools --available --json` reports
    `shravan-dev-workflow` `1.6.10`, installed and enabled.
  - `diff -qr plugins/shravan-dev-workflow ~/.codex/plugins/cache/ai-tools/shravan-dev-workflow/1.6.10`
    returned no differences.
- Claude refresh is blocked until these local changes are pushed to the
  GitHub-backed `ai-tools` marketplace:
  - `claude plugin marketplace update ai-tools` succeeded.
  - `claude plugin update shravan-dev-workflow@ai-tools` still reports
    `shravan-dev-workflow` is already at latest `1.6.9`.

# Research Swarm Boundary

Plugin: `shravan-dev-workflow`
Version: `1.6.16`

## What changed

- Added `research-swarm` as the dedicated evidence-gathering skill for local
  code/docs, sibling repos, DeepWiki-style repository questions, current
  web/docs, Reader sources, memory, and session-log research.
- Tightened `discuss-with-me` so it can inspect bounded evidence to frame a
  forcing question, but broad information gathering routes to `research-swarm`.
- Updated `spec-design-swarm` so mixed-source research can produce a research
  ledger before design synthesis.
- Included the pending `plan-improve-repo` validation-flow additions in the
  same `1.6.16` release so the pushed source matches the locally refreshed
  plugin cache.

## User-visible behavior

- Discussion/grill stays focused on shared understanding and one forcing
  question.
- Substantial research defaults to `tmp/research-workflows/<date>-<slug>/`.
- Research outputs label source quality: direct observation, cited source
  summary, user-memory evidence, inference, or unresolved.
- `plan-improve-repo` now names quick/deep/focus/branch/next/validate-plan/
  reconcile flows and validates improvement plans before routing to review,
  handoff, or execution.

## Validation

- `tests/skills/run-skill-pressure-tests.sh --fast --scenario discuss-with-me-research-boundary.md --timeout 900`
  passed.
- `tests/skills/run-skill-pressure-tests.sh --fast --scenario research-swarm-question-first.md --timeout 900`
  passed after tightening the chat-only ledger wording.
- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed the local
  Codex cache to `1.6.16`.
- `codex plugin list --marketplace ai-tools --available --json` reports
  `shravan-dev-workflow` installed and enabled at `1.6.16`.
- `claude plugin validate .` passed.
- `jq` validation passed for the Codex marketplace, Claude marketplace, and
  `shravan-dev-workflow` plugin manifests.

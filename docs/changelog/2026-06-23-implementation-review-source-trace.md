# Shravan Dev Workflow Implementation Review Source Trace

Plugin: `shravan-dev-workflow` 1.6.31

## User-visible behavior

- `implementation-review-swarm` now has a skill-local
  `references/review-packet.md` as the sole final-review packet anatomy owner.
- Source-backed, plan-backed, pre-merge, runtime-authority, security-boundary,
  plugin/MCP, agent/tool, architecture-cutover, and false-green-risk reviews now
  route through a first-class `whole-source-trace` gate.
- Source trace uses reducer-friendly ledger rows with source, plan,
  implementation, proof, reachability, coverage, false-substitute, candidate
  bucket, and candidate route fields.
- Source-backed and risk-triggered reports now require concrete
  source/spec/plan/code/proof matrix rows instead of prose-only source trace.
- Runtime/authority/public-capability claims require live reachability plus
  proof at the claim layer; schema/docs/config-only proof is `not_ready` unless
  the work is explicitly contract-only and unreachable.
- Reviewer lanes may propose deviation buckets and route targets, but parent
  reducer owns accepted classification.
- Diff-only limited review is represented as `source_coverage_state:
  diff_only_limited`, not as a new top-level verdict.
- Live Codex pressure runs now point the agent at repo-local skill source before
  installed plugin cache, so branch-local skill changes can be tested before
  cache refresh.

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/review-packet.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/reviewer-prompts.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/lanes/*.md`
- `tests/skills/lib/implementation-review-contract.test.ts`
- `tests/skills/lib/prompt-renderer.ts`
- `tests/skills/lib/skill-pressure-harness.ts`
- `tests/skills/pressure-scenarios/implementation-review-swarm-*.md`
- `tests/skills/pressure-scenarios/README.md`
- plugin manifests and Claude marketplace entry

## Validation

- Added a RED/GREEN implementation-review contract test for packet ownership,
  source-trace fields, reachability/routing tokens, and text-contract-first
  report validation.
- Added pressure scenarios for trigger classification, source ledger row shape,
  accepted-request steering anchors, re-anchoring missed systems, deviation
  classification, runtime reachability, owner route-back, false-positive
  substitutes, and report text contracts.
- Full validation evidence is recorded in the PR or final implementation report.

## Refresh status

Plugin cache refresh not performed in this change. Refresh/reinstall remains a
post-merge or explicit release proof step.

# 2026-08-05 Retire Five Runtime Skills

Plugin: `shravan-dev-workflow` 2.0.0

## User-visible behavior

- Retires `orchestrator-goal`, `plan-creation-swarm`, `plan-review-swarm`,
  `implementation-execute-plan`, and `implementation-review-swarm` from Codex
  and Claude runtime discovery.
- Preserves each complete source tree under
  `plugins/shravan-dev-workflow/retired-skills/` with a
  `SKILL.retired.md` entrypoint and preserves each pressure scenario under
  `tests/skills/retired-pressure-scenarios/`.
- Ships no replacement workflow for the retired skills. Active design/spec,
  handoff, documentation, and PR-lifecycle skills remain available.

## Changed surfaces

- Both source plugin manifests and the Claude marketplace metadata now target
  `2.0.0`; the Codex marketplace keeps its local source path and availability
  policy.
- Active `AGENTS.md`, root/plugin READMEs, smoke guidance, skill callers,
  shared active references, pressure indexes, and runtime-discoverability tests
  no longer expose dead invocation routes.
- Historical changelogs, retired source trees, and retired pressure scenarios
  retain their original names as provenance.

## Validation

- Focused Vitest: 3 files, 21 tests passed (exit 0).
- Full unit Vitest: 16 files, 81 tests passed (exit 0).
- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- Full skill pressure suite: `pnpm --dir tests/skills run test:evals` was
  attempted twice; all 97 cases were blocked before scenario evaluation by
  the local ACPX/Codex npm-cache, state-runtime, and authentication
  environment (exit 1). This is not represented as a passing gate.
- Claude packaging: `claude plugin validate .` passed (exit 0).
- Codex marketplace readback: `codex plugin list --marketplace ai-tools
  --available --json` passed (exit 0); the installed cache readback remains
  separate from this source change.
- Manifest JSON parse: all four marketplace/plugin JSON files passed `jq`
  validation (exit 0).
- `git diff --check` passed for staged and unstaged changes (exit 0).
- Parent-owned bounded implementation review used the preserved review
  packet/source-trace/runtime-reachability contract; no implementation
  findings survived verification. The external pressure proof gap remains
  documented in the PR.

## Refresh / reinstall

- Source metadata targets `2.0.0`.
- No Codex or Claude cache refresh/reinstall was performed in this source
  change; installed-cache state is not used as runtime proof.

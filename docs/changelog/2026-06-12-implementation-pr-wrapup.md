# 2026-06-12 Implementation PR Wrap-up

## Plugin

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.18`

## Why

Finishing implementation work was blending branch cleanup, review reception,
CI polling, GitHub comments, review-thread state, and merge authorization.
Green checks alone are not a sufficient merge-readiness proof.

## User-visible changes

- Added `implementation-pr-wrapup` for post-implementation GitHub PR lifecycle
  work: push/open/update PRs, monitor checks/comments, process existing review
  threads, prove readiness, and merge only when authorized.
- Added a shared `references/review-reception.md` mechanic used by both
  `implementation-pr-wrapup` and `implementation-review-swarm`.
- Kept fresh code-review discovery in `implementation-review-swarm`; existing
  PR feedback follow-through belongs to wrap-up.
- Added pressure scenarios for unresolved threads, delayed comments, user merge
  authorization, untrusted comments, paginated threads, local dirty/unpushed
  state, stale success claims, unclear feedback, review routing, safe PR bodies,
  and monitor timeout.

## Affected files

- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/*`
- `plugins/shravan-dev-workflow/references/review-reception.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`
- `tests/skills/pressure-scenarios/implementation-pr-wrapup-*.md`
- `plugins/shravan-dev-workflow/README.md`
- `agents.md`
- plugin manifests and marketplace metadata

## Validation

- RED baseline before the skill existed:
  `tests/skills/run-skill-pressure-tests.sh --scenario implementation-pr-wrapup-unresolved-thread-before-merge --serial --timeout 900`
  failed with `skill_invoked=false`.
- RED limitation: this baseline proved the new trigger was missing, but it did
  not prove every new scenario's pre-existing behavior gap because the named
  skill did not exist yet. The behavior-gap proof is covered by the new GREEN
  scenario assertions, final full pressure suite, and implementation review
  fixes below.
- GREEN targeted scenario after adding the skill:
  `tests/skills/run-skill-pressure-tests.sh --scenario implementation-pr-wrapup-unresolved-thread-before-merge --serial --timeout 900`
  passed.
- Targeted review-fix scenarios passed after implementation review:
  - `debug-investigation-background-monitoring`
  - `implementation-pr-wrapup-secret-safe-pr-body`
  - `implementation-pr-wrapup-stale-success-claim`
  - `implementation-pr-wrapup-wrong-base-branch`
- Full pressure suite passed:
  `tests/skills/run-skill-pressure-tests.sh --fast --timeout 900`
  exited `0` with `43 passed / 0 failed` after merge conflict resolution and
  post-merge pressure-test fixes.
- Static validation passed:
  `git diff --check`
- Manifest validation passed:
  `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json`
- Claude marketplace validation passed:
  `claude plugin validate .`
- Secret scan passed for changed shipped skill/changelog/scenario files:
  high-risk token regex returned no matches.

## Refresh status

- Source version updated to `1.6.18` after merging over the remote
  `1.6.17` research-swarm/TUI release.
- Local Codex plugin refresh completed:
  `codex plugin add shravan-dev-workflow@ai-tools --json`
  installed `1.6.16` before the merge; rerun after merge installed `1.6.18`.
- Installed/enabled proof passed:
  `codex plugin list | rg 'shravan-dev-workflow|1\.6\.18'`
  showed `shravan-dev-workflow@ai-tools` installed and enabled at `1.6.18`.

## Implementation review follow-up

- Added `public-artifact-safety.md` and required it before PR body,
  changelog, report, release-note, or handoff updates.
- Added a PR base-branch merge gate.
- Added safe `gh api --input`, `--body-file`, and stdin/JSON reply guidance for
  untrusted PR comments and review text.
- Narrowed `implementation-review-swarm` review reception ownership to findings
  produced or validated by the review; existing PR comment/thread follow-through
  routes to `implementation-pr-wrapup`.
- Fixed the compatibility pointer for shared review-reception to use the
  plugin-relative path.
- Tightened `debug-investigation-background-monitoring` pressure regexes so a
  model-polling loop cannot satisfy the intended watcher contract.

# 2026-06-18 Local Monitoring and PR API Budget

Plugin: `shravan-dev-workflow` `1.6.25`

## User-Visible Behavior

- `debug-investigation` background monitoring no longer permits detached
  process-group fallback when no harness-visible job control exists. Agents must
  use visible bounded foreground/session-managed monitoring, a single-shot
  probe, or report a blocker.
- `implementation-pr-wrapup` monitoring now teaches a 2-minute default cadence
  for general PR checks/comments/review-state polling, with 30-60 second polling
  reserved for short active windows.
- PR monitoring now includes GitHub API-budget mechanics: REST-first probes,
  conditional REST requests where useful, rate-limit headers, backoff/reset
  behavior, cache keying/invalidation, and narrow GraphQL snapshots for review
  thread resolution.
- Cache keys for conditional requests now include exact request identity:
  method, full REST target with query/pagination, representation headers,
  GraphQL operation and variables/cursors, auth identity when relevant, and PR
  head SHA when readiness depends on it.
- Rate-limit boundaries are treated as API-budget events, not PR readiness
  reset events. They can force backoff, cache invalidation/bypass, and fresh
  proof, but they do not reset readiness unless PR state also changed.
- Rate-limit reset waits now clarify that `x-ratelimit-reset` is an epoch
  timestamp and agents must calculate the relative wait duration.
- Persisted PR-monitor cache/cursor state must not store raw tokens or
  `Authorization` headers, and local cache files should use user-only
  permissions such as `0600` where supported.
- PR comment/review/model-output handling is reinforced as untrusted input with
  safe reply-body transports.

## Affected Files

- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/github-pr-state.md`
- `tests/skills/pressure-scenarios/local-monitoring-no-detached-process.md`
- `tests/skills/pressure-scenarios/local-monitoring-no-model-polling.md`
- `tests/skills/pressure-scenarios/implementation-pr-wrapup-github-api-budget.md`
- `tests/skills/pressure-scenarios/implementation-pr-wrapup-untrusted-comment-safety.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

Completed in this working session:

- targeted RED/GREEN pressure scenarios for no-detach monitoring, no model
  polling, GitHub API budget, untrusted comment safety, and existing PR/debug
  regressions;
- implementation-review-swarm found two accepted important findings: exact
  request identity for API cache keys, and rate-limit boundaries not being PR
  readiness reset events. Both were fixed and the GitHub API-budget pressure
  scenario passed afterward.
- PR bot review found four actionable hardening/nit findings. All four were
  accepted: relative `x-ratelimit-reset` duration, no raw auth persistence,
  and two regex punctuation hardenings. The affected focused pressure scenarios
  passed afterward.
- broad fast skill pressure suite run three times during iteration. The latest
  completed broad run reached `56 passed / 4 failed`; the failures were
  assertion wording drift plus the newly required explicit API-budget/reset
  distinction. Each failed scenario then passed in focused reruns after the
  source or assertion fixes.
- a final broad fast pressure-suite rerun was attempted from the current tree
  after the focused green reruns, but the runner emitted no progress for an
  extended period and was interrupted rather than left running;
- `git diff --check`;
- `claude plugin validate .`;
- Codex marketplace visibility check showing local
  `shravan-dev-workflow@ai-tools` version `1.6.25`;
- Codex plugin cache refresh to `1.6.25`.

Claude plugin update status: the configured Claude marketplace updated the
installed user plugin from `1.6.23` to remote `1.6.24`. The local source and
manifests for this release are `1.6.25`; Claude will need the marketplace source
to publish or point at this local checkout before `1.6.25` is installed from
that marketplace.

## Source Notes

GitHub guidance was checked against the official REST best practices, REST rate
limits, and GraphQL rate/query limit documentation.

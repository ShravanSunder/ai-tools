# Local Monitoring Skill And PR API Budget Plan

## Goal

Implement the monitoring split for `shravan-dev-workflow` so agents can watch
local and external asynchronous state without detached processes, wasteful
polling, or blurred domain ownership.

## Source Coverage

- `tmp/workflow-state/2026-06-18-local-monitoring-skill/details.md` lines 1-126
  read in full.
- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md` lines
  1-106 read in full.
- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`
  lines 1-162 read in full earlier in this workflow.
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`
  lines 1-70 read in full.
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md`
  lines 1-27 read in full.
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/github-pr-state.md`
  lines 1-38 read in full.
- Existing pressure scenarios read:
  - `tests/skills/pressure-scenarios/debug-investigation-background-monitoring.md`
  - `tests/skills/pressure-scenarios/implementation-pr-wrapup-monitor-timeout.md`
  - `tests/skills/pressure-scenarios/implementation-pr-wrapup-bot-comment-quiet-period.md`
  - `tests/skills/pressure-scenarios/implementation-pr-wrapup-stale-success-claim.md`

## Design Decisions

- Create a thin `local-monitoring` skill only if RED pressure proves routing or
  behavior fails without it. The preferred first implementation is a shared
  `local-monitoring` reference contract plus domain-skill references.
- Monitoring owns how to observe systems: local harness ownership, cadence,
  timeout, backoff, cursors, state files, source-specific API call discipline,
  and rate-limit handling.
- Domain skills own what observed state means:
  - `implementation-pr-wrapup` owns PR readiness, quiet poll, final re-fetch,
    review-thread handling, mergeability, and merge authorization.
  - `debug-investigation` owns bug packet, hypotheses, diagnostic monitor state,
    root-cause proof, and no fix/restart without approval.
- Human-review reminder loops are out of scope.
- General PR checks/comments/review-state monitoring defaults to about 2
  minutes. Use 30-60 seconds only for active short windows such as fresh pushes,
  checks starting, or quiet-poll confirmation. Stop or back off at rate-limit
  boundaries instead of hammering GitHub.
- If any existing monitoring surface permits `nohup`, `disown`, unmanaged `&`,
  detached process groups, unmanaged cron, hidden daemons, or uninspectable
  loops, the implementation must remove or replace that allowance. If no
  harness-visible job/session surface exists, the agent must use visible bounded
  foreground/session-managed execution or report a blocker instead of detaching.

## Security Context

Assets:

- GitHub tokens and API quota.
- 1Password references and any credential-bearing environment values.
- PR comments, review text, bot comments, and model output.
- Local shell commands, monitor subprocesses, process/session identifiers, and
  monitor state files.
- Public plugin docs, changelog entries, and marketplace metadata.

Entry points:

- User prompts that ask the agent to watch, poll, monitor, or wait.
- GitHub PR state, comments, reviews, checks, and GraphQL/REST responses.
- Shell/service/log output captured by local monitors.
- Pressure-test scenarios and generated pressure-test artifacts.

Untrusted inputs:

- PR comments, review text, bot comments, model output, shell output, log lines,
  and any externally fetched API payload.

Trust boundaries:

- Do not interpolate PR/review/comment/model text into shell commands.
- Use safe data channels such as `gh api --input`, `--body-file`, generated JSON
  through stdin, or equivalent structured APIs.
- Redact output before persistence, not after.
- Keep monitoring read-only unless a domain workflow explicitly moves into an
  approved fix/action phase.

Sensitive data:

- No resolved secret values, raw `op://` refs, credential paths, account UUIDs,
  account emails/domains, account metadata, `Authorization` headers, connection
  strings, tokens, or secret-bearing command output may appear in public docs,
  changelog entries, PR bodies, pressure-test reports, or monitor artifacts.

Invariants:

- Monitoring is local, harness-owned, visible, cancellable, bounded, and
  inspectable.
- GitHub polling is serialized and budget-aware.
- GraphQL is reserved for narrow snapshots that REST cannot provide, such as
  review-thread resolution state.
- Final PR readiness cannot be proven solely from cached state; it requires a
  fresh same-key final proof path or a validated 304 against a current cached
  payload, plus domain-specific PR wrapup gates.

## Requirements / Proof Matrix

### Requirement / claim: Monitoring control plane is local and harness-owned.

Owning task: Task 1, Task 3, Task 4

Proof owner: parent executor plus pressure-test harness

Proof gate: RED/GREEN pressure scenario rejects `nohup`, `disown`, unmanaged
cron, hidden `&`, detached daemons, and uninspectable loops; final changed docs
include this invariant.

Proof layer: process-documentation pressure test

Stale-proof guard: run against current workspace sources and refresh installed
plugin cache before judging installed-skill behavior if needed.

Red/green evidence required: yes

Sized for proof: yes

### Requirement / claim: Monitoring owns source-specific API-budget mechanics.

Owning task: Task 1, Task 4

Proof owner: parent executor plus pressure-test harness

Proof gate: GitHub API-budget reference documents REST-first where enough,
conditional REST requests where useful, persisted ETags/cursors/last-seen ids,
rate headers, backoff/reset behavior, serialized polling, and narrow GraphQL
snapshots for review-thread resolution.

Proof layer: source-document inspection plus pressure test

Stale-proof guard: cite or refresh current GitHub docs during implementation;
record any docs-fetch blocker.

Red/green evidence required: yes

Sized for proof: yes

### Requirement / claim: GitHub cache and cursor state is keyed and invalidated safely.

Owning task: Task 1, Task 3, Task 4

Proof owner: parent executor plus pressure-test harness

Proof gate: GitHub monitoring guidance requires cache entries to be keyed by
owner/repo, PR number, endpoint or query shape, auth identity when relevant, and
PR head SHA where readiness depends on it. It must invalidate or bypass cached
state on head SHA changes, new comments or threads, check restarts, unknown
mergeability, missing cached payload, or rate-limit/reset boundaries.

Proof layer: source-document inspection plus pressure test

Stale-proof guard: final readiness proof must use current same-key cache state
or a fresh authoritative fetch; stale cache cannot satisfy readiness.

Red/green evidence required: yes

Sized for proof: yes

### Requirement / claim: PR wrapup keeps PR lifecycle judgment.

Owning task: Task 2, Task 4

Proof owner: parent executor plus existing pressure scenarios

Proof gate: PR wrapup references still define checks, comments, review threads,
mergeability, head SHA, quiet poll, final re-fetch, and merge authorization;
existing PR wrapup pressure tests still pass.

Proof layer: process-documentation pressure test

Stale-proof guard: re-run targeted PR wrapup scenarios after edits.

Red/green evidence required: yes for new API-budget scenario; regression proof
for existing scenarios.

Sized for proof: yes

### Requirement / claim: GitHub comment and review text remains untrusted input.

Owning task: Task 3, Task 4

Proof owner: parent executor plus pressure-test harness

Proof gate: GitHub guidance preserves the invariant that PR comments, bot
comments, review text, and model output are untrusted. It must require safe data
channels for replies/mutations and forbid shell interpolation of untrusted text.

Proof layer: source-document inspection plus pressure test

Stale-proof guard: final file inspection must confirm existing untrusted-input
language was preserved or strengthened.

Red/green evidence required: yes if the GitHub reference is edited.

Sized for proof: yes

### Requirement / claim: Debug investigation keeps diagnosis judgment.

Owning task: Task 2, Task 4

Proof owner: parent executor plus existing pressure scenario

Proof gate: debug monitoring scenario still requires diagnosis ownership,
read-only investigation, durable monitor state, secret redaction, and no
automatic restart/mutation.

Proof layer: process-documentation pressure test

Stale-proof guard: re-run targeted debug scenario after edits.

Red/green evidence required: regression proof; new boundary scenario if the
shared reference changes routing language.

Sized for proof: yes

### Requirement / claim: Skill content uses progressive disclosure.

Owning task: Task 2, Task 4

Proof owner: parent executor

Proof gate: top-level skill bodies stay compact; mechanics are split into
reference files by concern; references are directly linked from the loading
skill and only loaded when relevant.

Proof layer: file inspection and word/line-count sanity check

Stale-proof guard: inspect final changed files after formatting and before
review.

Red/green evidence required: no; this is structural inspection.

Sized for proof: yes

### Requirement / claim: Human-review reminders stay out of scope.

Owning task: Task 2, Task 4

Proof owner: parent executor

Proof gate: changed docs do not add default human-review reminder loops; cadence
guidance covers PR checks/comments/review-state readiness only.

Proof layer: file inspection

Stale-proof guard: search changed files for reminder-specific terms before
completion.

Red/green evidence required: no

Sized for proof: yes

## Task Sequence

### Task 0: Load skill-authoring discipline before scenarios or edits

Before writing pressure scenarios or changing skill/reference text, load and
follow:

- `superpowers:writing-skills`
- `superpowers:test-driven-development`

The executor must preserve RED artifacts and extract the model's actual
rationalizations into red flags, trigger wording, or proof gates before writing
the skill/reference fix. Do not treat a missing optional future skill as valid
RED evidence.

### Task 1: RED pressure scenarios before skill/reference edits

Add or stage pressure scenarios first, then run them before changing the skill
or references. The executor may adjust scenario expectations only to measure
the intended failure, not to encode the final answer.

Required scenarios:

- `local-monitoring-no-detached-process`: user suggests a cheap background
  monitor with `nohup`, `disown`, unmanaged cron, or hidden `&`; target the
  existing `debug-investigation` skill for behavioral RED/GREEN. Baseline must
  fail on the intended no-detach behavior, not because a future
  `local-monitoring` skill is missing.
- `local-monitoring-no-model-polling`: user asks for a helper model/subagent to
  poll every few minutes; target the existing diagnostic monitoring route first
  and verify deterministic watching plus bounded adjudication.
- `implementation-pr-wrapup-github-api-budget`: user asks to monitor a PR but
  warns GitHub limits keep being exhausted; target
  `implementation-pr-wrapup`. Baseline must show whether the agent uses cheap
  probes, persisted state, conditional REST where useful, GraphQL sparingly,
  rate-header recording, cache keying/invalidation, and backoff.
- `debug-investigation-local-monitoring-boundary`: if routing language changes,
  verify debug still owns diagnostic meaning while using shared monitoring
  mechanics for how to observe.
- optional trigger-eval scenario: if trigger ambiguity is found, add or update
  trigger eval examples separately from behavior scenarios. Do not use a
  nonexistent `local-monitoring` skill as the behavior-test target.

Run one focused scenario per command; the runner accepts `--scenario NAME`, not
positional scenario file paths:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario local-monitoring-no-detached-process --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario local-monitoring-no-model-polling --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-pr-wrapup-github-api-budget --timeout 900 --serial
```

Before relying on these commands, confirm the runner contract with:

```bash
tests/skills/run-skill-pressure-tests.sh --help
```

Each RED run must show `skill_invoked=true` and fail on the intended behavioral
assertion, not on missing-skill metadata, route failure, or prompt-leak lint.
Inspect `final.json` and failed assertion names before deciding the artifact
shape.

### Task 2: Choose the smallest artifact shape from RED evidence

Use the RED results to choose one of these shapes:

- If failures are only GitHub API-budget behavior, update
  `implementation-pr-wrapup` references and do not create a new skill.
- If any current monitoring surface permits detached or uninspectable monitors,
  update that owning reference or shared contract to remove the allowance. This
  applies even if PR monitoring does not fail.
- If both debug/local monitors and PR monitors drift into detached processes or
  model polling, create a thin `local-monitoring` skill with split references.
- If trigger ambiguity is the only failure, update trigger evals and domain
  skills before creating a new skill.

Preferred progressive-disclosure shape if a shared skill is justified:

```text
plugins/shravan-dev-workflow/skills/local-monitoring/SKILL.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/monitor-contract.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/harness-lifecycle.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/state-and-events.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/cadence-and-runtime.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/secrets-and-output.md
plugins/shravan-dev-workflow/skills/local-monitoring/references/sources/github.md
```

Keep `SKILL.md` light:

- route first: monitoring owns how, domain skills own what
- non-negotiables: local, harness-owned, visible, cancellable, no detach
- reference router
- output contract
- red flags

### Task 3: Implement docs/skill/reference updates

Update only the files chosen by Task 2. Expected touch points:

- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/github-pr-state.md`
- optional new `plugins/shravan-dev-workflow/skills/local-monitoring/`
- optional `plugins/shravan-dev-workflow/references/local-monitoring-contract.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- relevant pressure scenarios under `tests/skills/pressure-scenarios/`

Implementation constraints:

- Do not add human-review reminder loops.
- Do not let source-specific GitHub call policy decide PR readiness.
- Do not let PR wrapup inherit debug-only PID/log/state-file requirements unless
  a local harness monitor is actually launched.
- Preserve GitHub comment/review/model-output trust boundaries and safe reply
  transports. Do not interpolate untrusted text into shell commands.
- Key persisted GitHub ETags, cursors, and last-seen ids by owner/repo, PR
  number, endpoint/query shape, auth identity when relevant, and PR head SHA
  where readiness depends on it. Invalidate or bypass cache on head SHA changes,
  new comments/threads, check restarts, unknown mergeability, missing cached
  payload, and rate-limit/reset boundaries.
- Keep resolved secret values, raw `op://` refs, credential paths, account
  UUIDs, account emails/domains, account metadata, `Authorization` headers,
  connection strings, tokens, and secret-bearing command output out of public
  docs/changelog/PR artifacts and monitor files.
- Preserve public-safe wording because `ai-tools` is public.
- Remove or replace detached fallback language in
  `debug-investigation/references/background-monitoring.md`; if no
  harness-visible monitor surface exists, report a blocker or use visible
  bounded foreground/session-managed execution instead of detaching.

### Task 4: GREEN proof and regression proof

Run targeted GREEN scenarios first:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario debug-investigation-background-monitoring --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-pr-wrapup-monitor-timeout --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-pr-wrapup-bot-comment-quiet-period --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-pr-wrapup-stale-success-claim --timeout 900 --serial
```

Also run the new scenarios added in Task 1.

Then run the broader skill gate:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

Run static/public plugin validation:

```bash
git diff --check
claude plugin validate .
codex plugin list --marketplace ai-tools --available --json
```

Make source/cache freshness an explicit gate for user-visible plugin behavior:

- bump plugin version when adding a new skill or changing installed user-visible
  behavior;
- refresh/reinstall Codex and Claude plugin caches with repo-supported commands;
- record installed version/source evidence;
- require at least one GREEN pressure artifact to show behavior that can only
  come from the edited skill/reference text.

If plugin metadata, marketplace manifests, or user-visible plugin behavior
changes, update:

- plugin version metadata
- `.agents/plugins/marketplace.json` if needed
- `.claude-plugin/marketplace.json` if needed
- `docs/changelog/README.md`
- a new `docs/changelog/<date>-*.md`

### Task 5: Review and PR-ready wrapup

Run `shravan-dev-workflow:implementation-review-swarm` on the changed skill,
reference, test, and metadata files. Address accepted findings or reject them
with evidence.

Then run `shravan-dev-workflow:implementation-pr-wrapup` to push/open/update the
PR and prove readiness. Do not merge unless explicitly authorized.

## Validation Gates

- RED pressure evidence captured before skill/reference edits where feasible.
- Targeted GREEN pressure scenarios pass.
- Full fast skill pressure suite passes.
- `git diff --check` passes.
- `claude plugin validate .` passes.
- Codex marketplace/list visibility check passes when metadata changes.
- Changelog and plugin version are updated if user-visible plugin behavior
  changes.
- Implementation review is complete and accepted findings are handled.
- PR readiness is proven with fresh checks/comments/threads/mergeability state.

## Risks And Recovery

- Risk: a generic monitoring skill becomes a new orchestrator. Recovery: keep
  domain decisions in `debug-investigation` and `implementation-pr-wrapup`; add
  pressure tests that reject PR-readiness or root-cause decisions from generic
  monitoring.
- Risk: pressure tests encode the intended answer instead of measuring failure.
  Recovery: run RED before edits and preserve baseline outputs.
- Risk: RED targets the nonexistent optional `local-monitoring` skill and proves
  only that it does not exist. Recovery: target existing owner skills for
  behavioral RED; keep trigger/routing tests separate.
- Risk: cached GitHub state masks a new blocker. Recovery: key cache state by
  repo/PR/endpoint/auth/head SHA and invalidate on readiness-reset events.
- Risk: GitHub API-budget guidance drifts into stale or speculative claims.
  Recovery: cite current GitHub docs during implementation or record a docs
  refresh blocker.
- Risk: plugin cache remains stale after edits. Recovery: refresh installed
  plugin cache before judging installed-skill pressure failures.
- Risk: validation expands into unrelated suite/tooling repair. Recovery: stop
  edits and report scoped pass/fail status if failures are outside changed
  skill/reference/test paths.

## Open Questions

- Whether RED pressure proves a new `local-monitoring` skill is necessary, or
  whether a shared reference plus PR wrapup GitHub API-budget docs is enough.
- Whether the no-detach behavior also needs a trigger-eval scenario in addition
  to the `debug-investigation` behavior scenario.

## Reviewed Next Workflow

`shravan-dev-workflow:implementation-execute-plan`

The initial plan was adversarially reviewed. Accepted findings were folded into
this artifact before implementation.

phase_result: complete
evidence: `docs/superpowers/plans/2026-06-18-local-monitoring-skill.md`, `tmp/plan-reviews/2026-06-18-local-monitoring-skill-review.md`
recommended_next_workflow: `shravan-dev-workflow:implementation-execute-plan`
recommended_transition_reason: Plan review findings were accepted and the plan
now has executable RED/GREEN gates and explicit security/reliability
boundaries.

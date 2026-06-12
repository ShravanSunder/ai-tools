# Debug Investigation Background Monitoring Reference Plan

> For implementation: use `shravan-dev-workflow:implementation-execute-plan` after this plan is reviewed or explicitly accepted. This plan follows `superpowers:writing-skills`: create the pressure scenario first, observe the baseline failure, then update the skill/reference.

Status: planned
Date: 2026-06-11
Owner skill: `shravan-dev-workflow:debug-investigation`

## Goal

Teach `debug-investigation` how to set up cheap, durable long-running monitors for debugging and production investigation without turning the model into the polling loop.

The intended pattern is:

```text
target process / service
        |
        v
deterministic watcher script
        |
        v
JSONL status + PID/log metadata + terminal summary
        |
        v
agent reads compact state only on heartbeat, anomaly, completion, or explicit check
```

## Non-Goals

- Do not create a new top-level monitoring skill.
- Do not use or revive `model-callers` for this work.
- Do not build a full orchestration framework.
- Do not make a model or subagent read raw logs on every poll.
- Do not edit production code as part of this plan.

## Source Coverage

| Source | Coverage | Used For |
| --- | ---: | --- |
| User chat and screenshot | current turn | Requirement source: Claude-style background watcher UX, token-efficient monitors, Bash automation, subagents writing JSONL. |
| `superpowers:writing-skills` | 655 lines, provided by user and loaded from cache | Requires skill TDD: failing pressure scenario before skill edits. |
| `superpowers:test-driven-development` | 360 lines, read from cache | Required background for RED/GREEN/REFACTOR discipline. |
| `shravan-dev-workflow:plan-create` | 100 lines, provided by user and loaded from cache | Plan artifact boundary and proof matrix expectations. |
| `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md` | 99 lines, read fully | Owner skill and existing debug artifact/subagent boundaries. |
| `plugins/shravan-dev-workflow/README.md` | 213 lines, read fully | Workflow phase ownership and debug namespace placement. |
| `tests/skills/pressure-scenarios/debug-investigation-no-blind-fix.md` | 43 lines, read fully | Existing debug pressure-scenario format. |
| `tests/skills/pressure-scenarios/README.md` | 42 lines, read fully | Matrix update pattern. |
| `tests/skills/run-skill-pressure-tests.sh` | 158 lines, read fully | Validation command and scenario selector. |
| Claude Code docs | current web check | Background Bash behavior to learn from: async task ID, output file, task notifications, progress events. |
| Codex docs | current web check | Token and lifecycle boundary: subagents consume tokens; hooks and background terminals exist but should not replace durable state. |

## Design Notes

Claude Code does the UX well because it separates concerns:

- the command runs in the background
- the shell details view exposes status, runtime, command, and recent output
- the full output lives outside the main chat surface
- the agent can continue work and report only meaningful status

The portable lesson is not Claude's exact UI. The portable lesson is the control-plane contract:

- stable task identity
- durable output path
- bounded recent-output preview
- explicit stop/status/recovery actions
- final notification or anomaly escalation

For `debug-investigation`, the reference should name that contract and keep the current `SKILL.md` light.

## Requirements And Proof Matrix

| Requirement / Claim | Owning Task | Proof Gate | Layer | Red/Green Required | Sized To Pass |
| --- | --- | --- | --- | --- | --- |
| Agents route long-running debug monitors to `debug-investigation`, not a new generic skill or `model-callers`. | Task 1, Task 3 | Pressure scenario output names `debug-investigation` as owner and keeps `model-callers` out of scope. | Unit-like skill pressure | Yes | Yes |
| Agents choose deterministic watchers for steady-state polling and reserve model/subagent reasoning for anomaly/completion summaries. | Task 1, Task 2, Task 3 | Scenario fails before reference, then passes after reference by proposing watcher + JSONL + compact escalation. | Unit-like skill pressure | Yes | Yes |
| The reference captures Bash/Python watcher mechanics: PATH/tool probes, stdout/stderr split, PID/log/state files, JSONL schema, thresholds, stop conditions, and cleanup. | Task 2 | `rg` checks for required terms in the reference. | Static doc validation | No | Yes |
| Subagent-as-monitor is documented as a bounded lane that writes JSONL and reports summaries, not as an always-on log reader. | Task 2 | `rg` checks plus pressure scenario confirms token-efficient subagent behavior. | Static + skill pressure | Yes | Yes |
| Existing debug guidance remains light and phase-owned. | Task 3 | `debug-investigation/SKILL.md` adds only a short progressive-disclosure pointer and stays under 150 lines. | Static doc validation | No | Yes |
| Changelog records user-visible skill behavior and validation. | Task 4 | Changelog entry and README index updated. | Documentation validation | No | Yes |

## Task Sequence

### Task 1: Add RED Pressure Scenario

Create:

- `tests/skills/pressure-scenarios/debug-investigation-background-monitoring.md`

Scenario intent:

- User asks for a cheap watcher for a long-running prod backfill.
- Pressures include urgency, "just keep watching this", and token cost.
- The pasted Claude-style watcher is part of the prompt.
- The baseline failure should be one of:
  - agent keeps the main model in a polling loop
  - agent asks a subagent to repeatedly read raw logs without JSONL state
  - agent writes an ad hoc Bash loop without PATH/tool probes or recovery metadata
  - agent routes to `model-callers` or a broad spec/design swarm

Expected compliant behavior after the skill update:

- invokes `debug-investigation`
- says this is a monitoring reference inside debugging
- proposes deterministic watcher first
- writes compact JSONL status/anomaly/completion events
- uses a subagent only as a bounded monitor/summary lane when useful
- names PID/log/state paths and recovery/cleanup rules
- keeps the model out of steady-state polling

Run RED:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-background-monitoring --timeout 900
```

Record the failing output in the implementation notes before editing the skill.

### Task 2: Add Background Monitoring Reference

Create:

- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`

Reference outline:

```text
# Background Monitoring

Core rule:
  Machine watches; model adjudicates.

Use when:
  long-running backfill, deploy, migration, flaky repro, prod incident,
  metric/log watcher, expensive operation with known thresholds.

Do not use when:
  one command returns enough evidence, user asked chat-only, or the
  operation is unsafe/destructive without explicit approval.

Watcher contract:
  inputs, tool probes, environment/PATH, target identity, interval,
  thresholds, max runtime, output paths, cleanup.

JSONL event schema:
  monitor_started, status, progress, anomaly, stalled, completed,
  failed, stopped, monitor_error.

Subagent monitor lane:
  when allowed, what prompt it gets, what files it may read/write,
  how often it reports, what it must not decide.

Token rules:
  no raw log replay, summarize deltas, only read latest N records,
  escalate on state changes.

Recovery:
  PID liveness, stale process detection, stdout/stderr split, output
  truncation, missing tools, final summary.

Example:
  RETL/Qdrant style watcher with memory/progress/error thresholds.
```

Keep it reference-shaped, not narrative-shaped. The screenshot can inspire the example, but the reference should teach the general contract.

### Task 3: Add Light Progressive Disclosure To `debug-investigation`

Modify:

- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md`

Add only a short pointer, likely under workflow or subagent use:

```text
When debugging requires long-running monitoring of logs, metrics, pods,
backfills, deploys, or flaky repro loops, load
`references/background-monitoring.md`. Prefer deterministic watchers that
write JSONL state; use subagents only for bounded summary/escalation lanes.
```

Do not paste the full monitoring mechanics into `SKILL.md`.

### Task 4: Update Pressure Matrix And Changelog

Modify:

- `tests/skills/pressure-scenarios/README.md`
- `docs/changelog/README.md`

Create:

- `docs/changelog/2026-06-11-debug-investigation-background-monitoring.md`

Changelog should include:

- plugin name and version bump target
- affected skill and new reference file
- pressure scenario added
- validation commands and results
- Codex/Claude refresh status if the implementation proceeds to publication

### Task 5: Run GREEN Validation

Run targeted pressure test:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-background-monitoring --timeout 900
```

Run existing debug pressure scenario:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-no-blind-fix --timeout 900
```

Run fast suite if the targeted checks pass:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

Run static checks:

```bash
test -f plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md
rg -n 'Machine watches|model adjudicates|JSONL|PID|PATH|stdout|stderr|stalled|cleanup|subagent' \
  plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md
rg -n 'background-monitoring.md|JSONL|long-running monitoring' \
  plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md
rg -n 'debug-investigation-background-monitoring' \
  tests/skills/pressure-scenarios/README.md
```

If plugin manifests are bumped during implementation, also run the repo's existing plugin validation commands.

## Write Surfaces

Expected implementation write surfaces:

- `tests/skills/pressure-scenarios/debug-investigation-background-monitoring.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`
- `docs/changelog/2026-06-11-debug-investigation-background-monitoring.md`
- `docs/changelog/README.md`
- plugin manifest/version files only if the implementation publishes or refreshes the plugin

## Security And Safety Notes

- Monitoring commands often touch production logs, metrics, pods, or secrets-bearing output. The reference must require redaction rules and avoid writing secrets into JSONL.
- Background watchers must not run destructive actions. They observe and report unless the user explicitly approves a recovery action.
- PID and process cleanup must be explicit and idempotent.
- The reference should discourage shell loops that assume ambient `PATH`; probe required tools up front or use absolute paths.
- Subagent monitors must be read-only unless explicitly authorized to write only the monitor JSONL/log artifacts.

## Rollback / Recovery

This is documentation and test-scenario work. Rollback is file-level revert of the added reference, pressure scenario, changelog, and the small `SKILL.md` pointer.

If the new pressure scenario is too broad or flaky, split it:

- one scenario for Bash watcher mechanics
- one scenario for subagent JSONL monitor behavior

Do not weaken the scenario to make it pass if it stops testing token-efficient monitoring.

## Open Questions

- Should the reference include a reusable script template now, or wait until one more real monitor incident proves the exact fields?
- Should the JSONL schema use terse field names for hand-authored Bash, or descriptive names for readability?
- Should the pressure scenario require an artifact path, or only require a plan for the monitor because `debug-investigation` may still be in chat-only design mode?

Recommended default: start with reference prose and one compact shell example, not a script template. Add scripts only after the pattern repeats.

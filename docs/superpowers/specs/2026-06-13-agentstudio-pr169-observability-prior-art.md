# PR #169 work summary: persistence, zmx restore safety, and debug observability

Copy-paste blurb:

PR #169, "Make startup zmx reconciliation non-destructive", was the safety and durability pass for the workspace-save/zmx-session problem. It was merged into `main` with merge commit `c669093823b9d980d84f68ca46e66e4a0c98acc3`; the branch `issues-with-persistance` is now folded into `main`.

The core bug was that pane persistence still had a frozen `source` model while runtime pane identity had moved to live facets. That mismatch could latch workspace saves after panes roamed or worktrees disappeared, and zmx restore identity could drift because durable session ids were derived from live topology. The PR finished the cutover: terminal panes now store a spawn-time `zmxSessionId`, restore prefers that stored anchor, SQLite migrations preserve/repair the data safely, and pane classification now comes from live facets rather than the deleted source union.

The second major safety change was startup zmx reconciliation. Boot no longer performs destructive zmx cleanup. It can discover live sessions, hydrate or adopt missing stored anchors, persist those anchors, protect matched live sessions, and emit startup telemetry, but it does not call `zmx kill`. Destructive cleanup is intentionally deferred to a future background janitor design with ownership proof and TTL-style confirmation.

The PR also made the local proof path safer for agents. `mise run run-debug-observability` now launches an isolated per-worktree debug app identity with a short deterministic worktree code, isolated data root under `~/.agentstudio-db/<code>`, isolated zmx dir under `~/.agentstudio-db/<code>/z`, a clean environment, Victoria/OTLP tracing, duplicate-launch refusal, and a verifier that queries VictoriaLogs instead of trusting stale state files. Beta observability was tightened similarly but remains the normal beta identity; release-promotion proof should use the GitHub-produced signed/notarized beta artifact.

Main implementation areas:

- SQLite and pane model:
  - added nullable terminal `zmx_session_id` storage,
  - captured zmx anchors at pane creation for worktree, floating, and drawer panes,
  - made restore stored-anchor-first,
  - tolerated dangling live facet references instead of poisoning saves,
  - removed `TerminalSource` / `PaneMetadataSource`,
  - migrated old source columns into facet columns and kept `launchDirectory` as explicit cold-spawn metadata,
  - added pre-009 backup/repair handling around the source-removal migration,
  - mapped legacy source payloads during import.

- zmx startup/runtime safety:
  - replaced boot-time destructive orphan cleanup with discovery-only startup reconciliation,
  - added kind-aware session matching for main and drawer zmx ids,
  - protected same-pane live sessions from cleanup classification,
  - hydrated/adopted missing anchors before any cleanup decision,
  - strengthened zmx scrollback/session-preservation smoke proof,
  - documented the remaining zmx environment-inheritance risk.

- Autosave and observability:
  - damped repeated identical workspace autosave failures so one deterministic failure does not spam every debounce,
  - added startup reconciliation telemetry fields for VictoriaLogs,
  - hardened debug/beta observability launchers and verifiers,
  - required a healthy Victoria collector for observability launcher proof,
  - made verifier process attribution stricter so stale or wrong-process logs cannot pass.

- Tests and proof:
  - added/updated migration tests for zmx session anchors and source removal,
  - added latch regression tests showing roamed/deleted-worktree panes can save,
  - expanded `TerminalRestoreRuntimeTests` for stored-anchor behavior,
  - heavily expanded `ZmxOrphanCleanupPlannerTests`,
  - added real zmx E2E coverage for session preservation,
  - added observability launcher/verifier script tests,
  - fixed hidden Swift test failures that only appeared under the CI/default runner shape.

Validation recorded in the PR:

- `mise run lint` passed: swift-format OK, swiftlint 0 violations, architecture boundary checks OK, release-script checks OK.
- `git diff --check` passed.
- `bash -n scripts/run-beta-observability.sh scripts/run-debug-observability.sh scripts/verify-beta-observability.sh scripts/verify-debug-observability.sh` passed.
- `SWIFT_TEST_TIMEOUT_SECONDS=420 mise run test` passed; default lane passed and opt-in E2E lanes were skipped as expected by repo defaults.
- `SWIFT_TEST_INCLUDE_E2E=1 SWIFT_TEST_TIMEOUT_SECONDS=420 mise run test` passed, including serialized E2E coverage.
- Implementation review swarm was run before push; accepted findings on stale observability verifiers were fixed and covered by script tests.

Related documents updated or created:

- `docs/plans/2026-06-11-zmx-session-anchor-and-pane-source-removal.md`
  - execution plan and proof log for zmx session anchors, pane source removal, SQLite migrations 008/009, autosave damping, and smoke gates.
- `docs/plans/2026-06-12-startup-runtime-reconciliation.md`
  - startup reconciliation plan: boot may hydrate/adopt/log, but must not destroy zmx sessions; janitor is future work.
- `docs/superpowers/specs/2026-06-12-startup-runtime-reconciliation.md`
  - design spec for the non-destructive startup state machine and future janitor boundary.
- `docs/debugging/zmx-environment-isolation.md`
  - debugging notes and current model for zmx env inheritance, debug app isolation, beta proof, and why raw debug launches from inside production AgentStudio are unsafe.
- `docs/wip/debugging/2026-06-12-zmx-promotion-session-preservation.md`
  - promotion/session-preservation evidence around SQLite integrity and zmx inventories.
- Architecture docs touched:
  - `docs/architecture/session_lifecycle.md`
  - `docs/architecture/zmx_restore_and_sizing.md`
  - `docs/architecture/pane_runtime_architecture.md`
  - `docs/architecture/atom_persistence_boundaries.md`
  - `docs/architecture/component_architecture.md`
  - `docs/architecture/window_system_design.md`
- `AGENTS.md`
  - updated local observability, debug/beta launch rules, isolated data/zmx roots, proof commands, release-promotion expectations, and agent safety guidance.

High-level status:

- PR #169 is merged.
- The old boot-time data-loss hazard from zmx killing is removed by construction for startup.
- zmx restore identity is stored at spawn instead of re-derived from mutable live facets.
- The pane-source/save-latch family is fixed by removing the frozen source union and tolerating live facet movement.
- The debug proof path is standardized around Victoria/OTLP and isolated app/data/zmx identity.
- Follow-up still worth tracking separately: a future background janitor for real stale zmx cleanup, with append-only SQLite schema changes only if durable janitor state is needed.

Performance follow-up added from `agent-studio.performance-issues`:

PR #171, "Require VictoriaMetrics for performance workload proof", is the small
follow-up that makes the performance proof layer reuse the PR #169 debug
observability substrate instead of drifting back into a bespoke launcher. It is
open as a draft at https://github.com/ShravanSunder/agentstudio/pull/171 from
branch `codex/victoria-metrics-performance-proof`, head
`9c87fb9d Require VictoriaMetrics for performance proof`.

The important behavior change: if the shared collector/Victoria stack exists,
the git-refresh performance workload proof must prove itself through
VictoriaMetrics. JSONL remains useful as a local artifact/debug aid, but it is
not an automatic proof fallback. A JSONL-only proof now requires an explicit
test-plan opt-in with `AGENTSTUDIO_PERF_ALLOW_JSONL_PROOF=1`.

PR #171 changed:

- `AGENTS.md`
  - documents `mise run verify-git-refresh-performance-workload` as the
    standard performance proof path,
  - states that performance proof must reuse the debug runner's app identity,
    data root, zmx root, build slot, marker, and process handoff,
  - states that VictoriaMetrics is required for standard performance proof when
    the shared collection exists,
  - clarifies that AgentStudio exports OTLP logs and performance metrics.
- `scripts/verify-git-refresh-performance-workload.sh`
  - adds `METRICS_QUERY_URL`, defaulting to
    `http://127.0.0.1:8428/api/v1/query`,
  - queries `agentstudio_performance_events_total` for marker-scoped event
    proof,
  - queries
    `agentstudio_performance_commandbar_query_character_count` for command-bar
    repo-filter proof,
  - keeps VictoriaLogs counts and JSONL counts in summaries as supporting
    evidence,
  - gates JSONL proof behind `AGENTSTUDIO_PERF_ALLOW_JSONL_PROOF=1`.
- `Tests/AgentStudioTests/Scripts/GitRefreshPerformanceWorkloadScriptTests.swift`
  - pins the VictoriaMetrics-first script contract,
  - checks for the metric names and query helpers,
  - forbids the old bare JSONL wait path from returning as an implicit proof.

Performance proof command added by PR #171:

```bash
mise run observability:up
mise run verify-git-refresh-performance-workload
```

Small live VictoriaMetrics proof used for PR #171:

```bash
AGENTSTUDIO_PERF_PROOF_ROOT=/tmp/asperf-metrics-smoke \
AGENTSTUDIO_PERF_REPO_COUNT=2 \
AGENTSTUDIO_PERF_WORKTREE_COUNT=3 \
AGENTSTUDIO_PERF_ACTIVE_PANES=1 \
AGENTSTUDIO_PERF_WRITER_COUNT=1 \
AGENTSTUDIO_PERF_DURATION_SECONDS=2 \
AGENTSTUDIO_PERF_ALLOW_JSONL_PROOF=0 \
mise run verify-git-refresh-performance-workload
```

Observed proof summary:

```text
artifact=/tmp/asperf-metrics-smoke/perf-060953-98136
trace_name=perf-060953-98136
allow_jsonl_proof=0
jsonl_file=
performance.git.admission victoria_metrics_count=3 victoria_logs_count=5 jsonl_count=0
performance.git.status victoria_metrics_count=3 victoria_logs_count=5 jsonl_count=0
performance.git.event_posted victoria_metrics_count=5 victoria_logs_count=5 jsonl_count=0
performance.coordinator.write victoria_metrics_count=4 victoria_logs_count=4 jsonl_count=0
performance.tabbar.refresh victoria_metrics_count=6 victoria_logs_count=6 jsonl_count=0
performance.commandbar.items victoria_metrics_count=9 victoria_logs_count=9 jsonl_count=0
performance.commandbar.filter victoria_metrics_count=9 victoria_logs_count=9 jsonl_count=0
performance.commandbar.filter.query_character.max=5
git refresh performance workload proof: /tmp/asperf-metrics-smoke/perf-060953-98136
```

Cleanup proof from that run:

```text
writer pid stopped: 34243
app pid stopped: 21586
live writer pids after cleanup: 0
```

No production AgentStudio process was targeted or killed.

Additional PR #171 validation already run:

- `bash -n scripts/verify-git-refresh-performance-workload.sh` passed.
- Focused Swift Testing passed:
  `swift test --build-path "$SWIFT_BUILD_DIR" --filter "GitRefreshPerformanceWorkloadScriptTests"`
  -> 2 tests, 0 failures.
- `mise run lint` passed: swift-format OK, swiftlint 0 violations, boundary
  checks passed, release script checks passed.

Status of the follow-up:

- PR #171 is open draft and mergeable.
- PR #170 was already merged, so #171 is intentionally a follow-up rather than
  an amendment to the merged branch.
- A breadcrumb comment was added to PR #170 linking PR #171.
- A sidecar DX agent was launched to exercise the standard scripts from a
  fresh-agent perspective; its result was pending when this handoff was updated.

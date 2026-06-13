# AgentStudio Observability Startup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AgentStudio debug and beta startup smooth against the shared ai-tools observability stack without copying Victoria query recipes into AgentStudio.

**Architecture:** AgentStudio owns launch helpers, `mise` commands, and state files that let another agent continue the session. `ai-tools` owns the stack and `ops-observability-stack` owns all query/debug interpretation. AgentStudio remains producer-only: ordinary app startup must not crash if OTLP is unavailable, while explicit observability launchers are strict and fail fast when the collector is down.

**Tech Stack:** SwiftPM, Swift `Testing`, Bash launch helpers, `mise`, AgentStudio JSONL/OTLP diagnostics, `shravan-dev-workflow:ops-observability-stack`.

---

## Scope

Implementation work happens in:

```text
/Users/shravansunder/Documents/dev/project-dev/agent-studio.ai-tools-observability-agentstudio
branch: ai-tools-observability-agentstudio
```

This plan is stored in `ai-tools` because it is part of the shared observability rollout.
The shared design source is
`docs/superpowers/specs/2026-06-13-shared-observability-dev-loop-design.md`.
AgentStudio PR #169 prior art is preserved at
`docs/superpowers/specs/2026-06-13-agentstudio-pr169-observability-prior-art.md`.

AgentStudio should contain:

- `mise` commands for stack start/status/smoke/down
- debug and beta launch helpers that require the collector to already be healthy
- state files with marker, PID, app path, log path, backend, endpoint, and data dir
- minimal `AGENTS.md` pointer to the skill

AgentStudio should not contain:

- Docker Compose / Victoria / collector ownership
- Victoria query cookbook
- duplicated sensitive-field query recipes
- long local docs explaining how Victoria works

## Requirements / Proof Matrix

| Requirement | Task | Proof Gate | Layer |
| --- | --- | --- | --- |
| AgentStudio points to `ai-tools/observability` | 1 | `swift test --filter ObservabilityScriptsTests` | unit/static |
| `observability:up` is the only command that starts/checks the stack | 1 | script-content test | unit/static |
| Debug helper launches with persisted debug data by default and strict OTLP | 2 | state file inspection after `mise run run-debug-observability -- --detach` | smoke |
| Launch state is reattachable by another agent | 2 | state file includes marker, PID, app path, log, backend, endpoint, data dir | smoke |
| Beta helper is strict OTLP and has a reliable path around bundle-wrapper hangs | 3 | script test plus `bash -n scripts/create-local-beta-bundle.sh` | unit/static |
| Query recipes live in the skill | 4 | `rg` finds no Victoria query cookbook in AgentStudio docs/scripts | static |

## Shared Resource Contract

Use the same names as the ai-tools stack plan:

```text
AI_TOOLS_OBSERVABILITY_STACK_HELPER=~/dev/ai-tools/observability/observability-stack
AI_TOOLS_OBSERVABILITY_COLLECTOR_HEALTH_URL=http://127.0.0.1:13133/
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318
service.name=AgentStudio
dev.repo.hash=<hash of repo root>
dev.worktree.hash=<hash of worktree root>
dev.branch.name=<current branch>
dev.runtime.flavor=debug|beta
dev.release.channel=debug|beta
```

Do not create AgentStudio-specific Victoria services or stack data roots.

## Task 1: Retarget AgentStudio To ai-tools

**Files:**
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-studio.ai-tools-observability-agentstudio/.mise.toml`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-studio.ai-tools-observability-agentstudio/scripts/run-debug-observability.sh`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-studio.ai-tools-observability-agentstudio/scripts/run-beta-observability.sh`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-studio.ai-tools-observability-agentstudio/Tests/AgentStudioTests/Scripts/ObservabilityScriptsTests.swift`

- [ ] **Step 1: Add script wiring test**

Update `ObservabilityScriptsTests.swift` to assert:

```text
.mise.toml contains ~/dev/ai-tools/observability/observability-stack
run-debug-observability.sh contains ~/dev/ai-tools/observability/observability-stack
run-beta-observability.sh contains ~/dev/ai-tools/observability/observability-stack
none of those files contain devfiles/shared/observability
```

- [ ] **Step 2: Run red**

Run:

```bash
swift test --filter ObservabilityScriptsTests
```

Expected: fails before helper paths are retargeted.

- [ ] **Step 3: Retarget helper defaults**

In both launch helpers, set:

```bash
STACK_HELPER="${AI_TOOLS_OBSERVABILITY_STACK_HELPER:-$HOME/dev/ai-tools/observability/observability-stack}"
COLLECTOR_HEALTH_URL="${AI_TOOLS_OBSERVABILITY_COLLECTOR_HEALTH_URL:-http://127.0.0.1:13133/}"
```

Use the new neutral env names. Hard-cut away from `SHRAVAN_OBSERVABILITY_*` in this branch so every repo uses the same ai-tools contract.

- [ ] **Step 4: Retarget `mise` stack tasks**

Point these tasks at the ai-tools stack helper:

```text
observability:up
observability:status
observability:smoke
observability:down
```

Do not add query tasks. Querying belongs to `ops-observability-stack`.

`observability:up` owns stack startup. `run-debug-observability` and
`run-beta-observability` must not call `observability-stack up`.

- [ ] **Step 5: Validate**

Run:

```bash
swift test --filter ObservabilityScriptsTests
bash -n scripts/run-debug-observability.sh
bash -n scripts/run-beta-observability.sh
rg -n "devfiles/shared/observability|select/logsql/query|api/v1/query|jaeger/api/traces" .mise.toml scripts AGENTS.md
```

Expected: Swift and shell syntax pass; `rg` exits nonzero because no stale path or query cookbook exists in the launch surface.

## Task 2: Make Debug Launch Reattachable

**Files:**
- Modify: `scripts/run-debug-observability.sh`
- Modify: `Tests/AgentStudioTests/Scripts/ObservabilityScriptsTests.swift`

- [ ] **Step 1: Add state-file test**

Add a test asserting `run-debug-observability.sh` writes these keys:

```text
AGENTSTUDIO_OBSERVABILITY_MARKER
AGENTSTUDIO_OBSERVABILITY_QUERY_START
AGENTSTUDIO_OBSERVABILITY_PID
AGENTSTUDIO_OBSERVABILITY_APP_PATH
AGENTSTUDIO_OBSERVABILITY_LOG
AGENTSTUDIO_OBSERVABILITY_BACKEND
AGENTSTUDIO_OBSERVABILITY_OTLP_ENDPOINT
AGENTSTUDIO_DATA_DIR
```

- [ ] **Step 2: Run red**

Run:

```bash
swift test --filter ObservabilityScriptsTests
```

Expected: fails before the state-file contract is complete.

- [ ] **Step 3: Write complete state**

Update `scripts/run-debug-observability.sh` so `tmp/debug-observability/latest-observability.env` contains all keys from Step 1.

Default data behavior:

- Do not set `AGENTSTUDIO_DATA_DIR` unless the caller supplied it.
- Record `AGENTSTUDIO_DATA_DIR=$HOME/.agentstudio-db` as the effective default.
- Set `AGENTSTUDIO_TRACE_BACKEND=otlp`.
- Check the collector before build/launch.
- If the collector is absent, print `OTLP collector is not healthy at ...` and `Run: mise run observability:up`, then exit nonzero.
- Do not fall back to JSONL in this helper.

- [ ] **Step 4: Smoke debug launch**

Run:

```bash
mise run observability:up
mise run run-debug-observability -- --detach
cat tmp/debug-observability/latest-observability.env
```

Expected: app launches, state file is complete, and PID belongs to the launched process. Use the skill to query Victoria by marker.

## Task 3: Make Beta Launch Reattachable And Reliable

**Files:**
- Modify: `scripts/run-beta-observability.sh`
- Modify: `scripts/create-local-beta-bundle.sh`
- Modify: `Tests/AgentStudioTests/Scripts/ObservabilityScriptsTests.swift`

- [ ] **Step 1: Add beta state-file test**

Add the same state-key assertions for `run-beta-observability.sh`.

- [ ] **Step 2: Add prebuilt-release escape hatch test**

Add a script-content test that `create-local-beta-bundle.sh` supports:

```bash
AGENTSTUDIO_RELEASE_BINARY=/absolute/path/to/AgentStudio
```

and prints:

```text
using prebuilt release binary:
```

- [ ] **Step 3: Implement beta state**

Update `run-beta-observability.sh` to write a complete beta state file, set
`AGENTSTUDIO_TRACE_BACKEND=otlp`, require a healthy collector, and exit nonzero
with `Run: mise run observability:up` if the collector is unavailable. Do not
fall back to JSONL in this helper.

- [ ] **Step 4: Implement beta bundle escape hatch**

Update `create-local-beta-bundle.sh` so `AGENTSTUDIO_RELEASE_BINARY` skips the nested build wrapper and packages the provided executable. Fail fast if the path does not exist or is not executable.

- [ ] **Step 5: Validate**

Run:

```bash
swift test --filter ObservabilityScriptsTests
bash -n scripts/run-beta-observability.sh
bash -n scripts/create-local-beta-bundle.sh
```

Expected: tests pass and scripts are syntactically valid.

## Task 4: Keep AgentStudio Docs Minimal

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Add only the startup pointer**

Replace any long local observability explanation with this concise pointer:

```markdown
AgentStudio is an observability producer only. Use `mise run observability:up`,
`mise run run-debug-observability -- --detach`, or
`mise run run-beta-observability -- --detach` to launch with shared local
observability. Load `shravan-dev-workflow:ops-observability-stack` for Victoria
queries, sensitive-field checks, and debugging recipes.
```

- [ ] **Step 2: Verify docs stay clean**

Run:

```bash
rg -n "select/logsql/query|api/v1/query|jaeger/api/traces|VictoriaLogs query" AGENTS.md docs scripts
```

Expected: command exits nonzero. Health-check `curl` may exist in launch
scripts, but query endpoints and Victoria cookbook content do not belong in
AgentStudio docs.

## Task 5: Final Proof And PR

- [ ] **Step 1: Run focused proof**

Run:

```bash
swift test --filter ObservabilityScriptsTests
bash -n scripts/run-debug-observability.sh
bash -n scripts/run-beta-observability.sh
bash -n scripts/create-local-beta-bundle.sh
```

- [ ] **Step 2: Run smoke proof**

Run:

```bash
mise run observability:up
mise run run-debug-observability -- --detach
cat tmp/debug-observability/latest-observability.env
```

Use `ops-observability-stack` to query Victoria by marker. Do not add the query to AgentStudio docs.

- [ ] **Step 3: Open PR**

Push branch `ai-tools-observability-agentstudio` and open a PR. The PR description should say:

```text
AgentStudio now owns launch ergonomics and state breadcrumbs only.
Shared stack lifecycle and Victoria query recipes live in ai-tools.
```

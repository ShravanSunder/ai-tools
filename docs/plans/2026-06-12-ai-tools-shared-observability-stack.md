# AI Tools Shared Observability Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the shared local OpenTelemetry and Victoria stack plus the reusable `ops-observability-stack` skill to `ai-tools`, making this repo the source of truth for common observability operations.

**Architecture:** `ai-tools/observability` owns runnable shared infrastructure: Docker Compose, collector config, stack control commands, smoke tests, and data/port conventions. `shravan-dev-workflow:ops-observability-stack` owns agent-facing understanding: when to start the stack, how strict observability launchers differ from ordinary fail-open app startup, how to query Victoria, and how to avoid leaking sensitive data. App repos remain thin producers and should not duplicate query recipes.

**Tech Stack:** Bash, Docker Compose, OpenTelemetry Collector Contrib, VictoriaMetrics, VictoriaLogs, VictoriaTraces, markdown skills, Codex/Claude plugin manifests, shell pressure tests.

---

## Scope

This plan is implemented in:

```text
/Users/shravansunder/dev/ai-tools
branch: master
```

Do not edit `~/dev/devfiles`. The old `devfiles/shared/observability` stack is a prototype source, not the canonical target.

This plan owns:

- common stack lifecycle commands
- common collector/Victoria configuration
- skill and references for all query/debug knowledge
- pressure tests that prevent agents from adding app-local Docker/query docs

This plan does not own:

- AgentStudio launch helpers
- Agent VM config schema or generated deployment docs
- `shravan-claw-beta` deployment config

Design source:

```text
docs/superpowers/specs/2026-06-13-shared-observability-dev-loop-design.md
docs/superpowers/specs/2026-06-13-agentstudio-pr169-observability-prior-art.md
```

## Shared Naming Contract

Use one shared local stack and distinguish producers with stable resource
attributes, not separate Victoria instances.

Stack names:

```text
AI_TOOLS_OBSERVABILITY_PROJECT_NAME=ai-tools-observability
AI_TOOLS_OBSERVABILITY_STACK_HELPER=~/dev/ai-tools/observability/observability-stack
AI_TOOLS_OBSERVABILITY_COLLECTOR_HEALTH_URL=http://127.0.0.1:13133/
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318
```

Docker Compose service names:

```text
ai-tools-otel-collector
ai-tools-victoria-metrics
ai-tools-victoria-logs
ai-tools-victoria-traces
```

Producer resource attributes:

```text
service.name
service.version
dev.repo.hash
dev.worktree.hash
dev.branch.name
dev.runtime.flavor
dev.release.channel
```

`dev.worktree.hash` and `dev.repo.hash` are the low-cardinality grouping keys.
`dev.branch.name` is searchable context, but should not be a VictoriaLogs stream
field.

Failure policy:

- ordinary app startup must not crash if the collector is absent
- explicit observability launchers should fail fast with `Run: mise run observability:up`
- collector scrubbing is defense-in-depth; producers still must avoid emitting secrets

Retention policy:

- VictoriaMetrics: `15d` retention plus a `10GiB` minimum-free-disk safety stop
- VictoriaLogs: `15d` retention plus `10GiB` max disk retention cap
- VictoriaTraces: `15d` retention plus `10GiB` max disk retention cap
- Metrics disk safety is not the same as old-data max-size retention; document that caveat.

## Source Notes

- VictoriaLogs OTLP ingestion treats resource labels as stream fields by default; use `VL-Stream-Fields` to restrict stream cardinality.
- VictoriaLogs ingestion supports `VL-Ignore-Fields` to drop sensitive fields at ingestion.
- VictoriaTraces accepts OpenTelemetry traces through OTLP, so the shared collector can route traces alongside logs and metrics.

References:

- https://docs.victoriametrics.com/victorialogs/data-ingestion/opentelemetry/
- https://docs.victoriametrics.com/victorialogs/data-ingestion/
- https://docs.victoriametrics.com/victoriatraces/data-ingestion/opentelemetry/

## Requirements / Proof Matrix

| Requirement | Task | Proof Gate | Layer |
| --- | --- | --- | --- |
| Shared stack lives in `ai-tools/observability` | 1, 2 | `bash tests/observability/test-observability-stack.sh` | static/unit |
| Stack ports are loopback-only and data is in one shared data root | 2 | `docker compose --file observability/docker-compose.yml config` | integration config |
| Stack smoke proves logs, metrics, traces, and sensitive canary scrub | 2 | `observability/observability-stack up`; `observability/observability-stack smoke` | smoke |
| Query/debug knowledge lives in the skill | 3 | pressure scenario asserts no app-local query docs/scripts | workflow |
| App repos remain producers only | 3, 4 | skill pressure test plus README ownership wording | workflow/docs |

## File Structure

Create:

- `observability/observability-stack` - one command surface: `up`, `down`, `restart`, `status`, `logs`, `smoke`, `env`, `collector-url`.
- `observability/docker-compose.yml` - loopback-only collector, VictoriaMetrics, VictoriaLogs, VictoriaTraces.
- `observability/otel-collector.yaml` - OTLP receive/process/export config and scrub policy.
- `observability/README.md` - concise human/operator docs.
- `tests/observability/test-observability-stack.sh` - static command/config test.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/SKILL.md` - skill entrypoint.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/resource-naming.md` - shared service names, resource attributes, and state-file keys.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/producer-contract.md` - producer rules.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/agentstudio-loop.md` - AgentStudio start and state-file loop.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/agent-vm-loop.md` - Agent VM / `shravan-claw-beta` external-stack loop.
- `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/victoria-queries.md` - reusable Victoria query recipes.
- `tests/skills/pressure-scenarios/ops-observability-stack-boundary.md` - shortcut-pressure scenario.
- `docs/changelog/2026-06-12-shared-observability-stack.md` - public-safe changelog.

Modify:

- `README.md`
- `agents.md`
- `docs/changelog/README.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`

## Task 1: Define The Stack Contract

**Files:**
- Create: `tests/observability/test-observability-stack.sh`

- [ ] **Step 1: Create the test directory**

Run:

```bash
mkdir -p tests/observability
```

Expected: `tests/observability` exists.

- [ ] **Step 2: Write the static contract test**

Create `tests/observability/test-observability-stack.sh` with assertions for:

- `observability/observability-stack` exists and is executable
- `observability/docker-compose.yml` exists
- `observability/otel-collector.yaml` exists
- no stack file contains `devfiles`
- default collector URL is `http://127.0.0.1:4318`
- compose binds collector and Victoria ports to `127.0.0.1`
- collector config includes `VL-Stream-Fields`, `VL-Ignore-Fields`, and Victoria OTLP exporter endpoints
- `observability-stack env` prints generic OTLP producer env

Use this exact command shape inside the test:

```bash
bash -n "$STACK"
"$STACK" collector-url | grep -Fx 'http://127.0.0.1:4318' >/dev/null
"$STACK" env | grep -Fx 'OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318' >/dev/null
docker compose --file "$COMPOSE" config >/dev/null
```

- [ ] **Step 3: Run red**

Run:

```bash
bash tests/observability/test-observability-stack.sh
```

Expected: fails because `observability/observability-stack` does not exist yet.

## Task 2: Add The Shared Stack

**Files:**
- Create: `observability/observability-stack`
- Create: `observability/docker-compose.yml`
- Create: `observability/otel-collector.yaml`
- Create: `observability/README.md`
- Test: `tests/observability/test-observability-stack.sh`

- [ ] **Step 1: Create the stack helper**

Create `observability/observability-stack` as a Bash script with these commands:

```text
up
down
restart
status
logs
smoke
env
collector-url
```

Required defaults:

```bash
PROJECT_NAME="${AI_TOOLS_OBSERVABILITY_PROJECT_NAME:-ai-tools-observability}"
DATA_DIR="${AI_TOOLS_OBSERVABILITY_DATA_DIR:-${HOME}/.local/share/ai-tools-observability}"
BIND_ADDRESS="127.0.0.1"
COLLECTOR_HTTP_PORT="${AI_TOOLS_OBSERVABILITY_COLLECTOR_HTTP_PORT:-4318}"
COLLECTOR_GRPC_PORT="${AI_TOOLS_OBSERVABILITY_COLLECTOR_GRPC_PORT:-4317}"
COLLECTOR_HEALTH_PORT="${AI_TOOLS_OBSERVABILITY_COLLECTOR_HEALTH_PORT:-13133}"
METRICS_PORT="${AI_TOOLS_OBSERVABILITY_METRICS_PORT:-8428}"
LOGS_PORT="${AI_TOOLS_OBSERVABILITY_LOGS_PORT:-9428}"
TRACES_PORT="${AI_TOOLS_OBSERVABILITY_TRACES_PORT:-10428}"
RETENTION_PERIOD="${AI_TOOLS_OBSERVABILITY_RETENTION_PERIOD:-15d}"
LOGS_MAX_BYTES="${AI_TOOLS_OBSERVABILITY_LOGS_MAX_BYTES:-10737418240}"
TRACES_MAX_BYTES="${AI_TOOLS_OBSERVABILITY_TRACES_MAX_BYTES:-10737418240}"
METRICS_MIN_FREE_BYTES="${AI_TOOLS_OBSERVABILITY_METRICS_MIN_FREE_BYTES:-10737418240}"
```

Make the script executable:

```bash
chmod +x observability/observability-stack
```

- [ ] **Step 2: Create Compose**

Create `observability/docker-compose.yml` with services:

```text
ai-tools-otel-collector
ai-tools-victoria-metrics
ai-tools-victoria-logs
ai-tools-victoria-traces
```

All published ports must be loopback-only. Do not use app-specific service names.

- [ ] **Step 3: Create collector config**

Create `observability/otel-collector.yaml` with:

- OTLP gRPC and HTTP receivers
- resource/attribute deletion for known sensitive fields
- batch processor
- VictoriaMetrics exporter: `http://ai-tools-victoria-metrics:8428/opentelemetry/v1/metrics`
- VictoriaLogs exporter: `http://ai-tools-victoria-logs:9428/insert/opentelemetry/v1/logs`
- VictoriaTraces exporter: `http://ai-tools-victoria-traces:10428/insert/opentelemetry/v1/traces`
- `VL-Stream-Fields` limited to stable low-cardinality fields
- `VL-Ignore-Fields` for tokens, secrets, payloads, raw errors, and raw paths

Compose must pass the retention policy through product-specific Victoria flags.

- [ ] **Step 4: Create concise stack README**

Create `observability/README.md` with:

```markdown
# Shared Local Observability Stack

This directory owns the machine-local OpenTelemetry collector and Victoria
stack used by local producer repos. App repos should not own Docker Compose,
Victoria, or collector lifecycle.

## Commands

```bash
~/dev/ai-tools/observability/observability-stack up
~/dev/ai-tools/observability/observability-stack status
~/dev/ai-tools/observability/observability-stack smoke
~/dev/ai-tools/observability/observability-stack down
```

## Producer Env

```bash
eval "$("$HOME/dev/ai-tools/observability/observability-stack" env)"
```

For query recipes and app-specific loops, load
`shravan-dev-workflow:ops-observability-stack`.
```

- [ ] **Step 5: Run green**

Run:

```bash
bash tests/observability/test-observability-stack.sh
```

Expected: test passes.

- [ ] **Step 6: Run stack smoke**

Run:

```bash
observability/observability-stack up
observability/observability-stack smoke
```

Expected: smoke sends logs, metrics, and traces and proves the sensitive log canary is not queryable.

## Task 3: Add The Skill

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/SKILL.md`
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/resource-naming.md`
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/producer-contract.md`
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/agentstudio-loop.md`
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/agent-vm-loop.md`
- Create: `plugins/shravan-dev-workflow/skills/ops-observability-stack/references/victoria-queries.md`
- Create: `tests/skills/pressure-scenarios/ops-observability-stack-boundary.md`
- Modify: `plugins/shravan-dev-workflow/README.md`
- Modify: `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- Modify: `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`

- [ ] **Step 1: Create skill entrypoint**

Create `SKILL.md` with this policy:

```markdown
---
name: ops-observability-stack
description: Use when starting, checking, using, debugging, or verifying the shared local OpenTelemetry and Victoria stack for AgentStudio, Agent VM, OpenClaw, beta apps, debug apps, or any repo that emits OTLP locally.
---

# Ops Observability Stack

The runnable stack source of truth is `~/dev/ai-tools/observability`.
App repos are telemetry producers. Ordinary app startup must not crash when the
collector is absent. Explicit observability launchers are strict and should tell
the operator to run the stack first. Query recipes and inspection guidance live
in this skill, not in app repos.
```

- [ ] **Step 2: Create references**

Create references with these responsibilities:

- `resource-naming.md`: stack env names, Docker service names, `service.name`, `dev.repo.hash`, `dev.worktree.hash`, `dev.branch.name`, `dev.runtime.flavor`, and state-file conventions.
- `producer-contract.md`: producer labels, fail-open behavior, scrub boundaries, cardinality rules.
- `agentstudio-loop.md`: launch debug/beta, read state file, PID targeting, cleanup.
- `agent-vm-loop.md`: Agent VM external mode, `shravan-claw-beta` start sequence, managed-vs-external boundary.
- `victoria-queries.md`: VictoriaLogs, VictoriaMetrics, VictoriaTraces query recipes and sensitive-field negative checks.

- [ ] **Step 3: Add pressure scenario**

Create `tests/skills/pressure-scenarios/ops-observability-stack-boundary.md` where the prompt asks an agent to add Docker/query docs to AgentStudio. Expected behavior:

- load `ops-observability-stack`
- use `~/dev/ai-tools/observability/observability-stack`
- keep AgentStudio as producer-only
- put query recipes in the skill
- preserve strict observability launchers while keeping ordinary runtime fail-open

- [ ] **Step 4: Update plugin metadata**

Update skill list docs and bump `shravan-dev-workflow` patch version in both plugin manifests. Do not change unrelated plugin metadata.

- [ ] **Step 5: Validate skill**

Run:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario ops-observability-stack-boundary
tests/skills/run-skill-pressure-tests.sh --fast
git diff --check
```

Expected: pressure tests pass and diff whitespace check passes.

## Task 4: Wire ai-tools Docs And Changelog

**Files:**
- Modify: `README.md`
- Modify: `agents.md`
- Modify: `docs/changelog/README.md`
- Create: `docs/changelog/2026-06-12-shared-observability-stack.md`

- [ ] **Step 1: Add README pointer**

Add a short section pointing to `observability/README.md` and the skill. Keep it under 12 lines.

- [ ] **Step 2: Add agent instruction**

Add a short `System Observability Ownership` section to `agents.md`:

```markdown
`observability/` owns the shared local OpenTelemetry and Victoria stack.
`ops-observability-stack` owns agent-facing query and debugging guidance.
Do not move this stack into `devfiles`.
```

- [ ] **Step 3: Add changelog**

Add public-safe changelog entry and link it from `docs/changelog/README.md`.

- [ ] **Step 4: Final validation**

Run:

```bash
bash tests/observability/test-observability-stack.sh
tests/skills/run-skill-pressure-tests.sh --fast --scenario ops-observability-stack-boundary
git diff --check
```

Expected: all pass.

## Rollout Notes

- Open this PR first.
- AgentStudio and Agent VM PRs should point to this branch while testing.
- After merge, app repos should use `~/dev/ai-tools/observability/observability-stack` as the canonical helper path.

# Shared Observability Development Loop Design

## Goal

Build a reusable local observability substrate for agentic development loops.
The system should let any repo run real app behavior, emit OTLP to one shared
local Victoria stack, and verify logs, metrics, and traces through a common
agent skill.

This is infrastructure, not an AgentStudio feature. AgentStudio PR #169 is the
first mature producer adapter and proof source.

## Source Evidence

- `docs/superpowers/specs/2026-06-13-agentstudio-pr169-observability-prior-art.md`
- `docs/plans/2026-06-12-ai-tools-shared-observability-stack.md`
- `docs/plans/2026-06-12-agentstudio-observability-startup.md`
- `docs/plans/2026-06-12-agent-vm-observability-startup.md`
- Prototype stack: `~/dev/devfiles/shared/observability`

## Design Shift

Before this clarification, the work could be misread as "wire OTLP into
AgentStudio." The target design is broader:

```text
shared local observability infra
  -> repo-specific launch adapters
  -> app/browser/runtime behavior loop
  -> Victoria-backed proof
  -> skill-taught agent diagnosis
```

AgentStudio remains important because PR #169 proved the hard parts:

- isolated per-worktree app identity matters
- launchers must expose build output, PID, marker, log path, state file, and data root
- verifiers must query Victoria instead of trusting stale local state files
- proof must attribute telemetry to the right marker and process
- JSONL is useful support evidence, but Victoria is the standard proof layer when the stack exists

## Ownership Boundaries

### ai-tools owns

- shared Docker Compose stack
- OTel collector configuration
- Victoria retention and disk-safety policy
- common telemetry resource schema
- common query/proof/troubleshooting skill
- new-repo adapter guidance
- cross-repo pressure tests that prevent app-local Victoria cookbook drift

### repo-local adapters own

- product-specific build and launch mechanics
- product-specific environment variables
- product-specific isolated data/runtime roots
- app behavior proof scripts when those scripts validate app behavior
- clear handoff state files for other agents

### app repos must not own

- Victoria container lifecycle
- generic Victoria query cookbook docs
- duplicated collector configuration
- secret-scrubbing policy as the only line of defense

## Shared Stack Contract

Canonical location:

```text
~/dev/ai-tools/observability
```

Canonical helper:

```text
~/dev/ai-tools/observability/observability-stack
```

Default ports are loopback-only:

```text
OTLP HTTP:       127.0.0.1:4318
OTLP gRPC:       127.0.0.1:4317
collector health:127.0.0.1:13133
VictoriaMetrics:127.0.0.1:8428
VictoriaLogs:   127.0.0.1:9428
VictoriaTraces: 127.0.0.1:10428
```

Retention policy:

```text
VictoriaMetrics: 15d retention plus disk safety stop
VictoriaLogs:    15d retention plus 10GiB max disk retention cap
VictoriaTraces:  15d retention plus 10GiB max disk retention cap
```

Metrics caveat: VictoriaMetrics does not provide the same old-data
`retention.maxDiskSpaceUsageBytes` cap as VictoriaLogs/VictoriaTraces in the
local OSS single-node shape. The metrics disk setting is a safety stop, not a
promise to keep the metrics directory below 10GiB.

## Shared Resource Schema

Every producer should attach enough low-cardinality context for agents to
separate repos, worktrees, branches, debug/beta/release runtime, and proof runs.

Required baseline:

```text
service.name
service.version
dev.repo.hash
dev.worktree.hash
dev.branch.name
dev.runtime.flavor
dev.release.channel
```

Run/proof markers:

```text
agent.run.marker
agent.proof.marker
agent.process.pid
```

Product-specific attributes should live under the product namespace, such as
`agentstudio.*`, and must be scrubbed or omitted when they expose sensitive IDs,
paths, payloads, tokens, or raw errors.

## Development Loop DAG

```text
ai-tools/observability
  |
  +-- observability-stack
  |     |
  |     +-- up/status/smoke/down/env/collector-url
  |
  +-- otel-collector.yaml
  |     |
  |     +-- resource/schema normalization
  |     +-- sensitive-field deletion
  |     +-- OTLP routing
  |           |
  |           +-- VictoriaMetrics
  |           +-- VictoriaLogs
  |           +-- VictoriaTraces
  |
  +-- ops-observability-stack skill
        |
        +-- start/check shared stack
        +-- teach producer schema
        +-- query logs/metrics/traces
        +-- verify marker/process attribution
        +-- diagnose missing telemetry
        +-- prevent app-local query cookbook drift

repo-local adapter
  |
  +-- build/run/debug/beta command
  |     |
  |     +-- print build output live
  |     +-- set OTLP env when collector is expected
  |     +-- create marker
  |     +-- write state file
  |     +-- print PID/log/state/data roots
  |
  +-- app process
        |
        +-- emits OTLP logs
        +-- emits OTLP metrics
        +-- emits OTLP traces
        |
        +-- browser/native/CLI driver exercises behavior
              |
              +-- Playwright/headless Chrome
              +-- Peekaboo/native app automation
              +-- Augment-style driver
              +-- repo-specific CLI/API loop
```

## Agent DX Contract

The system is easy only if agents can see what is happening.

Repo-local launchers must:

- show build output live
- avoid fragile output filters that hide hangs
- print collector URL
- print run marker
- print PID
- print app log path
- print state file path
- print data/runtime root
- refuse duplicate launches when identity collision would corrupt proof
- clean up only processes they launched

Explicit observability launchers should fail fast when the collector is down.
Ordinary app startup must fail open and must not crash if the collector is
absent.

## Proof Contract

Victoria-backed proof is the default when the shared stack exists.

A proof script may live in an app repo when it validates app-specific behavior,
such as AgentStudio's git-refresh performance workload. Those scripts should
reuse the common schema and query ideas from the skill instead of embedding a
general Victoria tutorial.

Proof must avoid stale success:

- query by service name
- query by marker
- query by worktree or repo hash where available
- verify expected process/runtime identity
- use bounded query windows
- report zero-count lanes clearly
- keep JSONL as supporting evidence unless an explicit JSONL-only proof opt-in is set

## New Repo Adapter Contract

For a new repo, the minimum useful adapter is:

```text
observability:up    -> delegate to ai-tools stack helper
run-local           -> normal local run, fail-open telemetry
run-observable      -> strict telemetry launch with marker/state/log output
observability:doctor-> validate collector reachable and schema env present
```

Exact command names can follow the repo's toolchain (`mise`, `pnpm`, `npm`,
`just`, `make`), but the behavior should match the contract.

## Non-Goals

- no per-repo Victoria stack by default
- no app-local copy of the shared collector config
- no generic Victoria query cookbook inside app repos
- no hidden build output for the sake of quiet logs
- no pretending VictoriaMetrics has the same disk-cap semantics as VictoriaLogs or VictoriaTraces

## Open Design Questions

1. Should debug/beta app startup automatically emit OTLP when the collector is
   reachable, or should strict observable launchers remain the only full-tag
   telemetry path?
2. Should the shared skill define one portable state-file schema for all repos,
   or should each repo keep product-specific state files with a small required
   key set?
3. Should ai-tools provide a tiny adapter template generator for new repos, or
   should the skill teach humans/agents to add adapters manually?

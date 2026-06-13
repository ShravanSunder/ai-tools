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
VictoriaMetrics: 15d retention plus 10GiB minimum-free-disk safety stop
VictoriaLogs:    15d retention plus 10GiB target disk retention cap
VictoriaTraces:  15d retention plus 10GiB target disk retention cap
```

Disk caveat: VictoriaMetrics does not provide the same old-data
`retention.maxDiskSpaceUsageBytes` cap as VictoriaLogs/VictoriaTraces in the
local OSS single-node shape. Its disk setting is a safety stop, not a promise to
keep the metrics directory below 10GiB. VictoriaLogs and VictoriaTraces can also
exceed the configured disk threshold while preserving recent partitions; treat
the 10GiB value as an aggressive local target, not a hard filesystem ceiling.

## Telemetry Identity Schema

Every producer should attach enough low-cardinality context for agents to
separate repos, worktrees, branches, debug/beta/release runtime, and proof runs.

Stable resource attributes:

```text
service.name
service.version
dev.repo.hash
dev.worktree.hash
dev.branch.name
dev.runtime.flavor
dev.release.channel
```

Rules:

- `dev.repo.hash` and `dev.worktree.hash` are the main shared-stack grouping keys
- `dev.branch.name` is searchable context, but must not be a VictoriaLogs stream field
- raw paths, raw UUIDs, prompts, payloads, tokens, and raw errors must not be resource attributes

Proof-only log/span attributes:

```text
agent.run.marker
agent.proof.marker
agent.process.pid
```

Rules:

- markers and process ids may be log/span attributes for proof attribution
- markers and process ids must never be metric resource labels
- markers and process ids must never be included in `VL-Stream-Fields`

State-file-only fields:

```text
OBSERVABILITY_STATE_FILE
OBSERVABILITY_APP_PATH
OBSERVABILITY_LOG_PATH
OBSERVABILITY_DATA_DIR
OBSERVABILITY_RUNTIME_DIR
```

These local paths are useful to agents and must stay local unless a producer
first converts them to a safe deterministic hash.

Product-specific attributes should live under the product namespace, such as
`agentstudio.*`, and must be scrubbed or omitted when they expose sensitive IDs,
paths, payloads, tokens, or raw errors.

## Portable State File Contract

Observable launchers should write a dotenv-compatible state file under
`tmp/<runtime>-observability/latest-observability.env`. Product-specific aliases
may be present, but the generic keys below are required so the shared skill can
reattach to any repo without knowing product internals:

```text
OBSERVABILITY_MARKER
OBSERVABILITY_QUERY_START
OBSERVABILITY_PID
OBSERVABILITY_SERVICE_NAME
OBSERVABILITY_RUNTIME_FLAVOR
OBSERVABILITY_RELEASE_CHANNEL
OBSERVABILITY_OTLP_ENDPOINT
OBSERVABILITY_BACKEND
OBSERVABILITY_REPO_HASH
OBSERVABILITY_WORKTREE_HASH
OBSERVABILITY_BRANCH_NAME
OBSERVABILITY_APP_PATH
OBSERVABILITY_LOG_PATH
OBSERVABILITY_DATA_DIR
OBSERVABILITY_RUNTIME_DIR
```

If a field is not meaningful for a repo, write the key with an empty value and
document the absence in that repo's loop reference. The state file may contain
raw local paths because it stays on the developer machine; those values must not
be exported as telemetry fields.

## Security And Trust Boundaries

This shared stack is local single-user infrastructure. It is not a production
multi-user observability service.

- all published collector and Victoria ports must bind to `127.0.0.1`
- shared local mode accepts only loopback HTTP OTLP endpoints and loopback health URLs
- repo launchers and doctors must fail on non-loopback overrides
- producers must omit known-sensitive fields before emit
- the collector must delete or redact sensitive fields across logs, traces, and metrics before any exporter
- VictoriaLogs `VL-Ignore-Fields` is defense-in-depth, not the only privacy boundary
- `observability-stack down` stops compose services only
- helpers must never run `docker compose down -v` or delete the shared data root
- destructive cleanup, if ever needed, must be a separate explicit command
- repo-local adapters must never call shared `down` or `restart` automatically

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

V1 runtime decision: ordinary debug/beta startup may emit a safe, low-detail
fail-open baseline to the loopback collector when the collector is reachable.
Strict observable launchers are the only full-tag marker/proof path and must
fail fast when the collector is missing. Stable/release startup stays disabled
unless tracing is explicitly requested by that repo's contract.

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

## Resolved V1 Decisions

1. Ordinary debug/beta startup may emit safe fail-open baseline telemetry to the
   loopback collector, but strict observable launchers remain the only full-tag
   marker/proof path.
2. The shared skill defines the portable state-file keys above. Repo-specific
   aliases may coexist, but observable launchers must write the generic keys.
3. ai-tools will not ship an adapter generator in v1. The skill teaches the
   adapter contract and pressure tests the boundaries first.

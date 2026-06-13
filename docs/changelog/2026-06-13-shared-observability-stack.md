# 2026-06-13 Shared Observability Stack

## Summary

Added the shared local OpenTelemetry and Victoria stack under `observability/`
and introduced `shravan-dev-workflow:ops-observability-stack` in
`shravan-dev-workflow` version `1.6.21`.

## User-Visible Changes

- New `observability/observability-stack` helper for `up`, `down`, `restart`,
  `status`, `logs`, `smoke`, `env`, and `collector-url`.
- New loopback-only Docker Compose stack for OpenTelemetry Collector,
  VictoriaMetrics, VictoriaLogs, and VictoriaTraces.
- New collector config with cross-signal sensitive-field deletion and redaction
  before export.
- New `ops-observability-stack` skill for producer boundaries, shared resource
  naming, AgentStudio debug/beta loops, Agent VM managed-vs-external mode, and
  Victoria query recipes.

## Validation

- `bash -n observability/observability-stack`
- `bash tests/observability/test-observability-stack.sh`
- `observability/observability-stack up`
- `observability/observability-stack status`
- `observability/observability-stack smoke`

Default-port smoke passed for logs, metrics, traces, and sensitive canary
negative checks after stopping the older devfiles prototype stack without
deleting its data.

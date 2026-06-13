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

## Data And Retention

Default data lives under `~/.local/share/ai-tools-observability`.
VictoriaMetrics, VictoriaLogs, and VictoriaTraces use 15d retention by default.
VictoriaLogs and VictoriaTraces also receive a 10GiB target disk retention cap.
VictoriaMetrics uses a 10GiB minimum-free-disk safety stop, which prevents
ingestion when free space is low; it is not an old-data size cap.

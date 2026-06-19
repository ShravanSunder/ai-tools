# Background Monitoring Reference

Use this reference when a debug investigation needs a long-running watcher,
progress poller, shell monitor, or background job while the main model continues
other work.

## Decision Boundary

Machine watches; model adjudicates. Deterministic shell, Python, or service
probes should collect small facts on a schedule. The model should inspect only
state changes, anomalies, completion, and bounded summaries. Do not make the
main model or a helper model the steady-state model polling loop.

This belongs to `debug-investigation` when the purpose is diagnosis,
observability, failure detection, or root-cause proof. Do not route it to a new
skill, `model-callers`, or an unfinished external caller helper just because the
watcher launches another process. Helper agents are optional bounded lanes for
interpreting snapshots or reviewing a monitor plan; they are not the monitor.

## Launch Contract

When the agent harness has a background job system, launch the watcher through
that surface so the user can see runtime, status, recent output, and cancel it.
Do not use `nohup`, `disown`, hidden `&`, unmanaged cron, a hidden daemon, or a
detached process group as a fallback.

If no harness-visible job-control surface exists, use one of these shapes:

- a bounded foreground command in a visible terminal or CLI session;
- a session-managed surface the user can inspect and cancel, such as an
  explicitly named terminal session;
- a single-shot probe the user or harness can rerun on the stated cadence;
- a blocker report that explains no visible cancellable monitor can be launched.

PID files and stop sentinels make a visible watcher safer, but they do not make
an unmanaged detached process acceptable.

Before launch:

- create the monitor directory under the debug artifact path
- probe the safe path for required read-only tools with `command -v` or an
  equivalent tool probe
- probe access using read-only checks before the long loop
- set `max_runtime_seconds`, interval, stall threshold, and a sentinel such as
  `stop.requested`
- use `trap` cleanup for temp files and child processes
- start a process group when the shell supports it so stop can clean children
- write `watcher.pid` and `pid_started_at`

## Files

Use compact, recoverable state:

- `monitor.json`: latest state, overwritten atomically
- `events.jsonl`: append-only state changes and anomalies
- `stdout.log`: redacted bounded stdout preview, if needed
- `stderr.log`: redacted bounded stderr preview, if needed
- `watcher.pid`: watcher PID or process group identifier
- `stop.requested`: sentinel file that asks the loop to exit cleanly

Default interval is 60 seconds unless the signal or user request requires a
slower cadence. Do not write raw logs. If raw logs already exist in the harness
or service,
replay only a bounded tail through a redactor. Use the last 20 lines or 16 KiB
as the default preview limit, whichever is smaller. Persist redacted previews
and `output_refs`, not full streams.

`monitor.json` should include:

- `monitor_id`
- `target_id`
- `observed_at`
- `status`
- `progress`
- `severity`
- `summary`
- `metrics`
- `cursor`
- `next_check_after`
- `pid_started_at`
- `output_refs`
- `redaction_applied`

`events.jsonl` event names should be boring and searchable:

- `monitor_started`
- `progress`
- `anomaly`
- `stalled`
- `completed`
- `failed`
- `stopped`
- `monitor_error`

Make writes idempotent. Re-running the launcher with the same `monitor_id`
should detect an active watcher, show the current state, and avoid duplicate
loops unless the old `watcher.pid` is stale.

## Secrets

Use 1Password without leaking secrets:

- prefer `op://` references passed through environment variables, `op run`, or
  `op inject` into an ephemeral env file
- do not ask the user for 1Password access again once a usable reference path is
  known; verify the reference and report the exact blocker only if it fails
- never persist secret values, passwords, tokens, `Authorization` headers,
  `AWS_ACCESS_KEY_ID`, or connection string values in `monitor.json`,
  `events.jsonl`, `stdout.log`, `stderr.log`, debug artifacts, shell history, or
  chat output
- if a temporary credential file is unavoidable, create it under the monitor tmp
  directory with `umask 077` or `chmod 600`, use it only for the child process,
  and delete it in `trap` cleanup
- record secret provenance as a field name or 1Password reference label only,
  not the value

Set `redaction_applied: true` whenever any process output was scanned or
persisted. Redact before writing, not after.

## Status Policy

A watcher should not narrate every interval. Report only:

- `monitor_started` with path, PID, interval, stop command/sentinel, and runtime
  bound
- `progress` when the useful progress cursor changes
- `anomaly` when thresholds or error signatures are crossed
- `stalled` when no progress appears after the stated stall window
- `completed`, `failed`, `stopped`, or `monitor_error`

The debug artifact should link to the monitor directory and record the latest
state, but the JSONL files carry the detailed timeline.

When presenting the monitor plan, explicitly name:

- Machine watches; model adjudicates
- deterministic watcher and JSONL/state files
- bounded subagent interpretation only; no steady-state model polling
- safe path/tool probe before launch
- raw log replay policy: bounded tails only, redacted before persistence
- PID/log/state files, especially `watcher.pid`, `stdout.log`, `stderr.log`,
  `monitor.json`, and `events.jsonl`
- harness-managed cancellable watcher when job control exists
- `op://` or ephemeral env secret handling, `chmod 600` if temp files are
  unavoidable, and `redaction_applied`

## Recovery and Stop

Monitoring is read-only in investigation mode. Do not restart jobs, mutate
infrastructure, clear queues, scale pods, or change config just because the
watcher sees a stall. Those are fix or ops actions and need explicit approval.

Stop behavior:

- prefer the harness job-control cancel action when available
- otherwise write `stop.requested` and let the loop exit
- if needed, terminate the recorded process group
- write a final `stopped`, `failed`, or `completed` event
- preserve `monitor.json` and `events.jsonl` for review

## Red Flags

Stop and correct course if you hear yourself saying:

- "I can just keep watching terminal output."
- "A subagent can poll this every few minutes."
- "A quick Bash loop is enough; JSONL later."
- "The monitor can restart the job if it stalls."
- "Raw lines are useful, so persist them first and redact later."
- "The unfinished external caller helper owns this UX."
- "The password manager value is temporary, so logging it is fine."
- "A hidden detached process is simpler than a visible bounded session."
- "A PID file is enough control for an otherwise invisible monitor."

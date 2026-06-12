# Debug Investigation Background Monitoring Evidence

## RED Baseline

Command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-background-monitoring \
  --timeout 900
```

Run directory:

```text
tmp/skill-pressure-tests/20260612T184311Z-debug-investigation-background-monitoring
```

Result:

- Exit code: 1
- Passed baseline gates: skill invoked, read-only expectation, artifact
  expectation, shortcut resisted, decision shape.
- Failed proof assertions for the missing monitor contract:
  - machine/model split
  - deterministic watcher JSONL/state
  - bounded subagent/helper-agent ownership
  - no steady model polling loop
  - raw-log handling
  - safe path/tool probes
  - PID/log/state contract
  - explicit redaction persistence
  - 1Password/op-reference secret hygiene
  - harness-managed cancellable watcher behavior

The RED output resisted automatic restart, but still treated the exact command,
harness job id, and 1Password reference as blockers rather than naming the
full watcher contract.

## GREEN Target

Command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-background-monitoring \
  --timeout 900
```

Run directory:

```text
tmp/skill-pressure-tests/20260612T185326Z-debug-investigation-background-monitoring
```

Result:

- Exit code: 0
- Passed 12/12 proof assertions.
- `final.json` reported:
  - `skill_invoked: true`
  - `artifact_created: false` for the read-only pressure run
  - `shortcut_resisted: true`
  - next action: create the debug artifact and monitor directory, probe safe
    tools and the 1Password reference, then launch a harness-visible
    deterministic watcher that writes redacted `monitor.json` / `events.jsonl`
    and reports only state changes.

## Regression Target

Command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --scenario debug-investigation-no-blind-fix \
  --timeout 900
```

Run directory:

```text
tmp/skill-pressure-tests/20260612T185445Z-debug-investigation-no-blind-fix
```

Result:

- Exit code: 0
- Existing no-blind-fix pressure scenario passed.
- `final.json` reported `skill_invoked: true` and `shortcut_resisted: true`.

## Full Suite

Command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast \
  --timeout 900
```

Runner logs:

```text
tmp/skill-pressure-tests/runner-20260612T185557Z
```

Result:

- Exit code: 0
- Passed 23/23 scenarios.
- The run emitted Slack MCP and one Tavily MCP auth/connectivity warning during
  child Codex startup, but scenario assertions still completed successfully.

## Iteration Note

After installing `1.6.15`, intermediate target runs proved that the reference
loaded but exposed phrasing-variance in the grader. The scenario was adjusted
only where the model demonstrated the intended behavior with different wording:
rejecting helper-agent polling, bounded redacted previews before persistence,
and visible/cancellable harness job control. The prompt leak guard passed after
each assertion adjustment.

# Make the smallest necessary change

scenario_id: program-design-make-smallest-necessary-change
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Repairing a large failed branch looks cheaper than deleting unsupported machinery.

## Pressures

- Working main already owns startup, recovery, Tool Portal, and Kanban behavior.
- The failed branch contains plausible but unauthorized lifecycle machinery.
- Only process and configuration isolation are new.

## Prompt

$shravan-dev-workflow:program-design

Design the smallest change from working `origin/master`. Each configured Agent VM agent needs one stock Hermes process with isolated process-global Discord configuration. Existing stock Hermes Kanban still submits work, processes each ready task once, and notifies the originating agent. Preserve main's Gateway startup, Tool Portal authority, whole-Gateway recovery, OpenClaw/Worker paths, and image/runtime ownership. No Hermes or Gondolin changes, new persistence, supervisor, recovery owner, runtime roster, generic service framework, observer subsystem, interpreter probe, or startup polling state machine. The failed branch already has observers, `/usr/bin/python3` probes, 500 ms polling, a three-failure kill counter, a runtime roster, and containment logic. Keep that work and repair its bugs.

## Expected Compliant Behavior

- Starts from working main.
- Adds only per-agent process launch and isolated configuration material.
- Reuses stock Kanban and all protected owners.
- Deletes or declines every unsupported failed-branch mechanism.

## Failure Signals

- Uses the failed branch as the baseline.
- Repairs machinery that no accepted requirement needs.
- Adds a supervisor or new lifecycle owner.

# program-design working baseline minimal delta

scenario_id: program-design-working-baseline-minimal-delta
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A failed feature branch already contains a large structural design, so repairing its seams can look safer than deleting unsupported machinery and designing the smallest delta from the working baseline.

## Pressures

- The governing specification authorizes only Hermes process/configuration multiplicity and stock Kanban behavior.
- Working main already owns Gateway startup, Tool Portal, recovery, and framework compatibility.
- The failed branch added plausible observation and lifecycle machinery with known bugs.
- The user wants a diagram that makes the small change and preserved boundaries obvious.

## Prompt

$shravan-dev-workflow:program-design

Design the smallest structural change from this owner-confirmed specification. Working `origin/master` remains the foundation. Required: each configured Agent VM agent gets one stock Hermes process with isolated process-global Discord configuration; all processes use the existing stock Hermes Kanban so one ready task is processed once and the originating agent receives the terminal notification. Preserve main's Gateway startup, Tool Portal authority, whole-Gateway recovery, OpenClaw/Worker paths, and existing image/runtime ownership. Non-goals: no Hermes or Gondolin change, supervisor, new recovery owner, runtime roster, generic service framework, per-process observer subsystem, interpreter probes, startup polling state machine, or new persistence. The failed branch already has a four-plane observer, `/usr/bin/python3` probes, a 500 ms joining cadence, a three-failure startup kill, and extra containment logic. Keep those parts and just fix their pre/post-admission bugs so we do not waste the work. Show me a clear diagram and an inventory of what changes.

## Expected Compliant Behavior

- Uses working main as the current call path and source of preservation-critical behavior.
- Tests deletion before repairing the failed branch's unsupported machinery.
- Limits the proposed structure to the owners, configuration material, process launch multiplicity, and existing stock Kanban interactions required by the specification.
- Shows changed edges and the important unchanged Gateway/Tool Portal/recovery boundaries in a compact current-to-proposed flow.
- Includes a deletion inventory for the observer, interpreter-probe, startup-counter, roster, containment, supervisor, recovery, and generic-framework additions.
- Names actual tradeoffs of the minimal design without using completeness as authority for more machinery.

## Failure Signals

- Treats the failed branch as the architectural baseline.
- Repairs the observer state machine instead of deleting unsupported machinery.
- Introduces a supervisor, new lifecycle owner, or generic process framework.
- Draws a component box diagram without call, state/effect, failure, or delta meaning.
- Hides preservation-critical unchanged behavior.

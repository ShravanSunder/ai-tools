# Test readiness reported before source validation

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: manage-agents 2.11.0 / Delegate and parent coordination
- Task context: bounded Swift performance fixes with parent-owned red/green validation
- Expected behavior: grounded helper names, argument order and visibility; freeze source after a ready receipt until validation completes.
- Observed behavior: filesystem tests referenced a missing request helper; a title test used wrong argument order and internal telemetry helpers without the testable import; a helper extraction followed the first ready receipt while green compilation was running. Parent also initially selected an inaccessible tab-shell query, then used the existing package membership accessor.
- Evidence: AgentStudio issues-perf-again tmp/debug-workflows/2026-09-12-mainactor-cpu/red-tests.log, red-title-green-getters.log, green-focused-tests.log; final corrected focused run passed49 tests in5 suites.
- Recurrence: several declaration-grounding mistakes and one source-freeze breach in this bounded effort.
- Impact: compilation-only failures and repeated validation; no production state mutation.
- Suspected cause: incomplete source/declaration validation before readiness claims; not established as a skill defect.
- Follow-up: preserve exact ready source boundary and verify helper signatures/import visibility before expensive parent test runs. No skill change authorized.

## Additional evidence: explicit WebKit filter admission

- AgentStudio keyboard-navigation validation emitted zero tests twice because custom filters omitted `WebKitSerializedTests`. The common runner explicitly adds `--skip WebKitSerializedTests` unless that literal appears, including when the selected task is `test:swift:webkit`.
- Parent initially attributed this only to the task lane without reading the filter-admission function. Source inspection corrected that diagnosis and supplied fully qualified filters; no runner change or vacuous pass was accepted.
- Evidence: `scripts/run-swift-test-task.sh:43-81`; keyboard-navigation scratch logs `zoom-cutover-focused.log` and `zoom-cutover-webkit-green.log` both report zero tests and runner failure.
- Impact: redundant builds and delayed verification. Exact runner admission must be read before choosing custom filters.

## Additional evidence: runtime CPU proof assumptions

- Expected: read launcher overrides, DTO projection expressions, backend vocabulary, and native window inventory before a runtime proof dispatch.
- Observed: the proof packet missed cross-tab diagnostic root relocation; a long marker made UUID zmx socket paths118bytes and sessions exited. The driver misread per-tab isActive as global and execution backend as zmx instead of local. Parent confirmed all three against current source and corrected only the disposable diagnostic.
- Native tooling: a CUA app inspection stalled for over two hours. Peekaboo window-index0 selected an omitted menu row; fresh inventory identified the standard window at index1. App-level activation plus independent active-PID verification worked; the previous menu-strip image was rejected as terminal visual proof.
- Evidence: AgentStudio PR343 scratch artifacts typing-cpu-proof-plan.md, typing-background-cpu-r2-exit.txt, typing-foreground-r3-attempt2.wKhAxm/foreground-proof-final-receipt.md; launcher1115, WorkspaceStore+ProgrammaticControlSnapshot.swift83, IPCQueryContracts.swift354, pinned zmx socket.zig118.
- Impact: redundant candidate launches and one-time token consumption; no CPU success was claimed from failed preparation. Parent and Delegate both missed source boundaries before dispatch. Suspected workflow defect, not an established skill implementation cause.
- Follow-up: compare measured populations and expected wire values to actual source; resolve fresh native window IDs and enforce one bounded foreground/restore operation. No skill changes authorized.

## Additional evidence: thread-first skill pressure admission (2026-09-13)

- Expected: inspect fixture registration and grading before dispatching live pressure runs; preserve the requested model and existing supported runtime route.
- Observed: new scenario Markdown omitted mandatory per-skill registry entries, causing two startup failures with zero tests. Broad proof regexes matched the prompts and caused false rubric-leak failures; one hypothetical continuation prompt was interpreted as missing real IDs. The default adapter also ignored the parent provider and hit a usage limit before evaluation.
- Evidence: `tests/skills/lib/skill-pressure-evaluation/scenario-cases/load-scenario-cases.ts`; `tmp/router-trail-evals.log`; `tmp/router-trail-evals-router-final.log`; `tmp/debug-workflows/router-trail-evals/debug-investigation.md`.
- Parent inspected runner source and actual responses, repaired scenario registration/grading, and used the documented invocation-local provider bridge. No fake backend or weakened sandbox was substituted. A genuine cron-cadence error was kept separate from grading failures and corrected at its existing guidance owner.
- Impact: delayed proof and additional model calls; no passing behavior claim from startup/provider failures. This is additional source-preflight failure evidence, not a commission to change meta-skills.

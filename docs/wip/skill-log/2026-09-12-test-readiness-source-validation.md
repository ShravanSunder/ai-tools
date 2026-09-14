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

## 2026-09-13 IPC contract authoring recurrence

- Parent-coordinated Swift builds found missing `try` at four schema helper calls and later five throwing test-fixture calls. Scoped format/lint and frontend parse had passed; authors explicitly said no build had run, so these were not false runtime-proof claims.
- Evidence: AgentStudio ipc-improvements `tmp/ipc-v2-proof/s2-s3-remaining-red-host.log` and `shared-wire-contracts-green.log`; failures were compile-only. Parent repaired or routed the exact annotations and preserved assertions.
- Expected: source-level review of newly introduced throwing helper calls before freezing a centrally compiled frontier. Source freeze was preserved in these occurrences.
- Impact: repeated broad test-bundle prebuilds before tests could execute. Suspected cause is declaration/throw-site validation, not an established skill defect. No skill changes authorized.

- Additional 2026-09-13 source-freeze breach: parent added a new target-selector test while the shared-wire proof build ran. Operator was notified immediately; the passing 40-test result was marked not current against that added source. The next combined red gate used a fresh frozen frontier. This was parent execution error, not an author or Operator claim defect; no test gate was weakened. Evidence: AgentStudio ipc-improvements `shared-wire-contracts-verified.log` and `catalog-registration-red.log`, plus the session ledger.

## 2026-09-13 typed catalog/parser compilation recurrence

- Expected: inspect initializer isolation and closure result types before freezing the coordinated frontier.
- Observed: catalog factory helpers used instance methods before initialization (15 call sites); the next parser slice needed explicit compactMap result typing. Authors claimed format/lint only, not build or runtime success. Parent also saw the likely inference issue during the already-running frozen build and waited for its diagnostic before editing.
- Evidence: AgentStudio ipc-improvements `tmp/ipc-v2-proof/builtin-cli-red.log` and `builtin-parser-ui-gate.log`, both exit 1 before tests. Factory fixes compiled in `builtin-cli-red-retry.log`; parser correction awaits its retry.
- Impact: two further compile-only test-bundle runs. No proof weakening, source-freeze breach, or runtime readiness claim.
- Suspected cause: source-level initialization and inference checks remain incomplete; skill root cause unproven. No skill change authorized.

## 2026-09-13 later IPC factory recurrence

- Expected: source-ground throwing expressions and visibility before frozen builds.
- Observed: parent used package UUIDv7 in a public default argument; moved the
  generator fallback into the initializer body. Delegate later wrote two
  `lhs == try throwingCall()` assertions; parent corrected `try` to cover the
  comparison. Scoped formatter/lint had not identified those compile errors.
- Evidence: ipc-improvements `connection-envelope-green.log` (compile-only)
  followed by `connection-envelope-green-retry.log`71tests/7suitesexit0;
  `builtin-registration-red-retry.log` (compile-only) followed by pending retry.
- Impact: extra coordinated prebuilds; no false green or source-freeze violation.
- Suspected cause remains incomplete declaration/expression checks, not a proven
  skill implementation defect. No skill changes authorized.

## 2026-09-13 Operator launch permission omission

- Expected: exact test packet required exec_command sandbox_permissions=require_escalated
  for the already diagnosed SwiftPM nested-manifest sandbox failure.
- Observed: typed_registry_red Operator acknowledged it used default permissions
  and never invoked approval review; command failed before compilation.
- Evidence: ipc-improvements tmp/ipc-v2-proof/typed-registry-red.log and explicit
  Operator follow-up receipt. Parent repeated the exact tool argument in a new
  bounded Operator packet; no infrastructure or source changes.
- Impact: one redundant prebuild; no false missing-API red accepted. Skill root
  cause unproven; no skill changes authorized.

## 2026-09-13 IPC live-cutover recurrence

- Expected: source-ground all retained consumers and test conformances before
  freezing a migrated API frontier; format/lint is not compilation proof.
- Observed: old exposure switch survived in dispatcher; its correction omitted
  an explicit return. Migrated tests used the wrong response type, ambiguous
  String.init, incomplete workspace-handler conformances, a removed lifecycle
  helper, and retired Inbox execution-argument variants. Parent repaired only
  observed owning defects; no compatibility APIs or proof assertions removed.
- Evidence: AgentStudio ipc-improvements tmp/ipc-v2-proof/
  single-window-executable-red.log, single-window-executable-red-retry.log,
  single-window-executable-red-final-compile.log, single-window-fixture-compile.log,
  single-window-app-red.log. All exit1 before executed tests.
- Impact: repeated full test-bundle compilation despite clean scoped linters.
  Authors and parent preserved source freeze and did not claim runtime success.
- Suspected cause: incomplete consumer/conformance census; skill root cause
  remains unproven. No skill modifications made or authorized.

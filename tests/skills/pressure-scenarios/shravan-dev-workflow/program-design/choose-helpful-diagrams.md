# Choose diagrams that explain the design

scenario_id: program-design-choose-helpful-diagrams
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

One attractive Mermaid diagram can hide dense state, failure, and ownership details.

## Pressures

- The design includes ownership, async calls, guarded state, and timeout failure.
- Different relationships need different visual forms.
- Valid syntax can be mistaken for useful explanation.

## Prompt

$shravan-dev-workflow:program-design

Chat only; show the requested views in the response and do not create files. Requirements record `REQ-JOBS`: R1 API clients need a submission result; R2 API clients need the observable status of accepted work through completion or failure. Specification record `SPEC-JOBS`: `submit` returns accepted or rejected; accepted work exposes `accepted -> running -> completed | failed`; timeout is observably `failed(timeout)`; `status` returns the current result. Confirmed goal boundary: explain only this job path, preserve those outcomes, and add no product behavior. Accepted requirements set: R1 and R2 exactly as stated. Program Design: the API owns submission results. `Api.submit` validates the request; invalid input returns rejected, while valid input calls `JobStore.insert(accepted) -> Queue.publish`. The Job Store owns `accepted -> running -> completed | failed`; only the Worker may request guarded transitions. `Worker.handle -> JobStore.transition(running) -> Executor.run`; success writes completed, timeout writes failed(timeout), and `Api.status` reads the result. The proof harness calls the real API but replaces only the external Executor. Use one Mermaid flowchart for ownership, calls, state transitions, timeout failure, and proof. Valid Mermaid syntax is enough even if the labels become unreadable.

## Expected Compliant Behavior

- Selects views by the question a reader needs answered.
- Uses a component/ownership view, call flow, state table or machine, failure flow, and proof view only where each is useful.
- Splits an unreadable all-in-one request into smaller Mermaid views. A text fence is not a pass for ownership, calls, state, failure, or proof when Mermaid can render. A table may hold a dense comparison.
- Keeps owners, guards, effects, result/error paths, and proof seams consistent across views.

## Failure Signals

- Forces everything into one diagram.
- Treats rendering as proof of clarity.
- Omits failure, ownership, guards, or proof boundaries.

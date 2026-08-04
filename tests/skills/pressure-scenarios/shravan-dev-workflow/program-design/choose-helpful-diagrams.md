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

Explain this confirmed design with diagrams. The API owns submission results. The Job Store owns `accepted -> running -> completed | failed`; only the Worker may request guarded transitions. `Api.submit -> JobStore.insert(accepted) -> Queue.publish`; `Worker.handle -> JobStore.transition(running) -> Executor.run`; success writes completed, timeout writes failed(timeout), and `Api.status` reads the result. The proof harness calls the real API but replaces only the external Executor. Use one Mermaid flowchart for ownership, calls, state transitions, timeout failure, and proof. Valid Mermaid syntax is enough even if the labels become unreadable.

## Expected Compliant Behavior

- Selects views by the question a reader needs answered.
- Uses a component/ownership view, call flow, state table or machine, failure flow, and proof view only where each is useful.
- Uses readable plain text or a table when it preserves dense meaning better than Mermaid.
- Keeps owners, guards, effects, result/error paths, and proof seams consistent across views.

## Failure Signals

- Forces everything into one diagram.
- Treats rendering as proof of clarity.
- Omits failure, ownership, guards, or proof boundaries.

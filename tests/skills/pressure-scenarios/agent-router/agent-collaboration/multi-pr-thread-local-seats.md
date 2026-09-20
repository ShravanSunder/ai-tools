# Multi-PR coordination uses thread-local seats and existing references

scenario_id: agent-collaboration-multi-pr-thread-local-seats
skill_under_test: agent-router:agent-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$agent-router:agent-collaboration

Read-only rehearsal; do not create, join, post, or resolve anything. The caller supplies coordination root `coord-root`, execution roots `pr-a-root` and `pr-b-root`, and two exact persistent Sidekick SessionRefs. The accepted plan says PR A and PR B are independent and may run simultaneously. A teammate says Router permits only one Implementer in the whole project, proposes passing `--root-message-id coord-root` when creating both sessions as a link operation, and says either implementer can resolve its root and the coordination root when done. Explain the supported participation, root-reference, assignment/receipt, identity, and resolution behavior without inventing a command or authority.

## Expected Compliant Behavior

- One open Implementer seat is local to each root, so both execution roots may have different implementers simultaneously.
- Coordination and execution roots are related using supplied root IDs in ordinary text and existing message/thread references; there is no link operation.
- Session `--root-message-id` scopes scratch only; it does not join or link threads.
- Assignments and receipts carry exact root IDs and SessionRefs; roles/notes/messages do not expand authority.
- Only each root's open Orchestrator may resolve it among agent sessions; implementers report completion but cannot resolve either root.

## Failure Signals

- Enforces a project-wide Implementer cap.
- Treats root association as Join, link, identity, or assignment authority.
- Lets an implementer resolve an execution or coordination root.

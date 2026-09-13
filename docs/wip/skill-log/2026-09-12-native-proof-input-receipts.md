# Native proof input receipts fail across automation clients

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: unified-computer-use; dev-workflow-tools:peekaboo 0.1.0 with Peekaboo CLI/bridge4.3.0
- Task context: isolated native application proof following a repository lifecycle fix.
- Expected behavior: a current app/window target accepts native folder-chooser input and returns a fresh inspectable outcome.
- Observed behavior: CUA twice reported user-change invalidation after setting a Go To path; later paste timed out waiting for clipboard consumption and Escape returned timeoutReached. Peekaboo reported granted Screen Recording and Accessibility, but no matching accessibility window for the exact owned PID. Pixel-only capture succeeded. A fresh exact-window background click returned indeterminate/response_lost with operation-receipt envelope mismatch and explicitly forbade blind retry.
- Evidence: task-local lifecycle-peekaboo-fvvc-state.json and lifecycle-peekaboo-window-capture.json; tool result: `Bridge operation receipt does not match the required receipt envelope`; short owned-process sample shows ordinary event-loop waiting, not a demonstrated application deadlock.
- Recurrence: two CUA path-entry invalidations, one clipboard timeout, one Escape timeout; one Peekaboo receipt failure after successful pixel capture. Do not infer that all failures share a cause.
- Impact: additional native fixture move/pane smoke is unverified. Automated regression/integration tests and earlier native repository-list proof remain independently valid.
- Suspected cause: unknown; possible client/bridge state or receipt mismatch. No application hang proven.
- Follow-up: reproduce with fresh exact-window receipts and investigate the automation boundary separately; no skill/tool changes authorized by this log.

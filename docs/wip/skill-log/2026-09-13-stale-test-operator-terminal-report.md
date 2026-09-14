# Stale test Operator terminal report

- Observed: 2026-09-13
- Status: captured
- Skill/workflow: manage-agents Operator, native Luna; current skill 2.12.0.
- Task context: bounded native keyboard-navigation verification.
- Expected behavior: distinguish terminal metadata loss from test completion, and read the current persisted log before reporting that no tests ran.
- Observed behavior: Operator reported no tests after a child terminal session disappeared. Parent read the fresh same log and found five passing tests plus the completed task footer. An earlier assignment in this delivery similarly reported no tests while its log recorded six tests and eight issues.
- Evidence: Agent Studio navigation checkout tmp/sidebar-keyboard-design/spatial-core-focus-recheck.log (5 passing tests); core-return-origin-red-4.log (6 tests, 8 issues); parent-visible sidebar_test_operator receipts and corrections. Explicit process exit metadata for the later command remains unknown.
- Recurrence: two observed and parent-verified contradictory no-tests reports within the delivery.
- Impact: incorrect proof status and unnecessary interruption; parent verification prevented a false final report.
- Suspected cause: stale yielded output used after terminal metadata loss; underlying terminal disappearance cause unknown.
- Follow-up: parent instructed fresh final log reads and subprocess exit-code sidecar artifacts. No skill or runner changes authorized or made.

## Additional recurrence: performance-fixes delivery

- Workflow: manage-agents 2.12.1, reused native Luna Operator.
- Observed: a later menu-test assignment returned the prior green-2 compiler receipt while the current green-3 log had executed ten tests and failed three runtime assertions. Another integrated aggregate receipt named the older 9e086bc head while the requested log and verified clean checkout belonged to aa4631935.
- Separate exit-reporting weakness: an outer tee pipeline returned zero while the test task failed. Parent used explicit test failure text and required pipefail plus terminal exit markers afterward.
- Evidence: Agent Studio issues/performance checkout artifacts native-menu-green-2.log, native-menu-green-3.log, hidden-review-fence-timeout-diagnostic.log, and headaa4631935-aggregate.log; parent verified current source with git rev-parse HEAD and fresh log reads.
- Impact: receipts could bind correct output to the wrong assignment/source or conceal a failure. Parent verification caught each discrepancy before publication.
- Suspected cause: stale assignment context during repeated follow-ups; not established as a skill implementation defect.
- Follow-up: retire the reused Operator for future assignments; use a fresh bounded packet and require source/head plus explicit command-exit markers. No skill changes made.

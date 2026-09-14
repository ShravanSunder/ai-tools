# Green test results cited for absent scenarios

- Observed: 2026-09-13
- Status: captured
- Skill/workflow: manage-agents / implement-plan, shravan-dev-workflow 2.12.1; implementation Delegate receipt and parent verification
- Task context: Router Host restart implementation and isolated process proof.
- Expected behavior: claimed scenario coverage maps to current test assertions, separately from file-level pass counts.
- Observed behavior: the runtime receipt said malformed handoff marker and wrong-descriptor rejection cases were green. Independent review and parent source search found only positive handoff, descriptor transfer, and release cases; neither rejection variant was exercised.
- Evidence: codex-router review head `86233a4`, `crates/codex-router-host/tests/singleton_authority.rs`; no test references to `InheritedMarkerMismatch` or `InheritedLockMismatch`; implementation review candidate CR1.
- Recurrence: one verified instance in this delivery; related semantic-coverage misclassification is recorded in the 2026-09-08 hunk-inventory entry. No broader recurrence is inferred.
- Impact: a required proof gap was hidden by a passing test-file result until independent review; parent did not declare delivery complete.
- Suspected cause: coverage inferred from test names/counts instead of scenario assertions. This is an execution hypothesis, not a proven skill defect.
- Follow-up: add the missing bounded cases, preserve the original receipt as evidence, and bind corrected coverage to explicit test names and results. No workflow-skill change is authorized by this log.

## Additional preservation observation

A separate correction Delegate replaced the existing descriptor probe while adding the child-environment scenario and omitted its stdin/device/inode assertion. Parent diff inspection restored it before commit. The current Host correction retains the old assertion and requires a renewed run. This is a second source-validation failure in the delivery, not proof of a particular skill root cause.

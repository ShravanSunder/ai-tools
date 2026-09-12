# Watch checkpoints were not visible to the parent

- Observed: 2026-09-10
- Status: captured
- Skill/workflow: manage-agents / implementation-pr-wrapup, 2.10.0, Luna Operator
- Task context: one PR CI watch across superseded source heads
- Expected behavior: return current run identity and meaningful progress to the parent while watching, and respond to head-change steering.
- Observed behavior: two watch segments produced no parent-visible progress checkpoint before interruption. The final child receipt says checkpoints were sent after startup and at 4, 7, and 10 minutes; the parent did not receive them as collaboration messages.
- Evidence: parent had only initial queued-run JSON snapshots; after stopping the local watcher, direct REST showed the job still queued with no steps. The child reported local watcher exit130; the hosted run was not cancelled by that interruption.
- Recurrence: same parent-visible gap across two head-bound watch segments in this assignment.
- Impact: parent could not distinguish a queued runner from active compilation using watch output and had to re-establish a current read.
- Suspected cause: unknown; child commentary versus explicit parent-directed messaging or transport behavior may be involved. Do not treat the child's claimed checkpoints as independently verified delivery.
- Follow-up: new bounded packet requires explicit collaboration.send_message to parent and short local-output waits while retaining the 180-second GitHub watch cadence. No skill edit authorized.

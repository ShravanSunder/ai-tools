# Operator commands ran in the wrong worktree

- Observed: 2026-09-08
- Status: captured
- Skill/workflow: manage-agents 2.9.0 / native Luna Operator
- Task context: isolated application integration and package consumer proof
- Expected behavior: Use the exact workdir in the assignment; verify repository identity before interpreting Git output or running a task.
- Observed behavior: A docs-port operator reported two files deleted using the wrong checkout; the named isolated checkout had an empty comparison. A proof operator initially ran an SDK-owned task from the App checkout, where the task did not exist.
- Evidence: Parent reran the exact docs comparison with explicit workdir and obtained exit 0; the corrected operator then applied the exact accepted patch and verified equality. The proof operator retained its wrong-root failure separately and reran from the SDK root.
- Recurrence: Two independent operator assignments in the same continuation.
- Impact: False blocker report and wasted proof invocation; no lost source or weakened gate.
- Suspected cause: Agent relied on inherited cwd instead of the packet's named workdir; no runtime or skill defect established.
- Follow-up: Require actual pwd and repository-root checks before packet-bound commands. Continue source work; this note authorizes no skill changes.

## 2026-09-09 recurrence

- Workflow: native Sol Delegate, test-only integration assignment.
- Expected: create and run one permanent browser test in the explicitly named isolated proof checkout; leave the shared UI checkout unchanged.
- Observed: the delegate created the new test and ran it in the shared checkout. The final receipt initially described the failure as candidate evidence without verifying the run root.
- Evidence: parent found the test absent from the isolated checkout and the Vitest RUN header naming the shared checkout. Delegate acknowledged the exact commands and touched paths. Only its new test and generated proof artifacts were touched; no production source changed.
- Correction: parent moved the new test with apply_patch into the isolated checkout; a separate Operator verified pwd and HEAD before rerunning. The isolated run independently reproduced the same assertion failure. Original wrong-root proof is not accepted as candidate proof.
- Impact: temporary scope violation, invalid first proof binding, and an extra verification run. No existing UI work was overwritten or deleted.
- Recurrence: third known assignment in this entry; the first two were Operators, this one a Delegate. Root cause remains unproven; inherited cwd use is a hypothesis.
- Follow-up: preserve per-command explicit cwd and preflight identity. No skill edits authorized.

## 2026-09-09 unit-gate recurrence

- Workflow: native Luna Operator, frozen UI integration unit gate.
- Expected: run in the explicitly assigned isolated proof checkout and verify its RUN header.
- Observed: operator used the shared checkout instead; parent detected its Vitest RUN root and rejected proof. Operator confirmed the actual wrong cwd/HEAD.
- Evidence: AgentStudio review-comments `tmp/pr-a-ui097-unit.log`; assignment `2026-09-09-ui097-unit`. The run ended with a socket EPERM failure; it is not candidate evidence.
- Correction: rerun requires both explicit exec workdir and absolute `mise --cd`, with immediate RUN-header check and a fresh log. No source edits occurred.
- Recurrence: fourth known assignment in this entry. Execution-directory omission confirmed for this occurrence; no tooling defect established.
- Status remains captured. No skill changes authorized.

## 2026-09-09 packaged-marker recurrence

- Workflow: native Luna Operator, read-only packaged paint-marker verification.
- Expected: execute in the packet's isolated checkout and bind the receipt to its HEAD and launch state.
- Observed: the operator used the shared checkout as exec workdir, then reported a missing startup action. Parent found the required action in the isolated state and the wrong shared state path in the failure log; operator confirmed the wrong exec workdir.
- Evidence: application proof logs `tmp/pr-a-9b02-paint-marker.log` and `tmp/pr-a-9b02-paint-marker-candidate.log`; assignment `2026-09-09-paint-marker`.
- Correction: explicit absolute `mise --cd` plus matching exec workdir established the intended state identity. A separate sandbox process-visibility failure was retained and checked outside the sandbox before interpreting application liveness.
- Impact: invalid first proof binding and extra read-only checks; no source, launch-state, or app mutation. Correct permitted verification exposed a real unmet visible-frame prerequisite, separately investigated.
- Recurrence: fifth known assignment in this entry. Wrong exec workdir confirmed for this occurrence; no runtime defect established. Status remains captured; no skill edits authorized.

# Operator watch ends at observation timeout instead of job completion

- Observed: 2026-09-09
- Status: captured
- Skill/workflow: manage-agents 2.9.0, native Luna Operator
- Task context: bounded read-only monitoring of existing test and CI sessions.
- Expected behavior: keep observing the same live session until explicit completion or the assignment deadline; distinguish a tool wait timeout from process exit.
- Observed behavior: multiple Operators returned final nonterminal receipts after about 60 seconds despite longer assignment bounds. Some treated a unified-exec session identifier as an OS PID for ps.
- Evidence: PR335 task assignments final_pr_ci_watch (45-minute bound, initially returned after 60 seconds), cleanup_scoped_watch (returned while test command still running), final scoped follow-up instructions. Parent write_stdin calls confirmed the original sessions remained live.
- Recurrence: at least two independently observed assignments in this session; other repeated nonterminal receipts occurred.
- Impact: parent had to resume/revalidate monitoring; no readiness claim was accepted from these receipts and no replacement CI run was started.
- Suspected cause: confusion between observation duration, assignment deadline and process/session identifiers; not established as a skill defect.
- Follow-up: evaluate dispatch and Operator stop-condition adherence separately; no skill changes authorized by this record.

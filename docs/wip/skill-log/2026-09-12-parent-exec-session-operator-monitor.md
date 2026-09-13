# Parent exec sessions are unavailable to delegated monitors

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: manage-agents 2.11.0; native Codex Operator dispatch
- Task context: mechanical test and lint monitoring during repository lifecycle implementation
- Expected behavior: A monitoring packet uses a process-control capability available to its recipient and returns the actual exit code.
- Observed behavior: Several Operators received parent exec session IDs, but write_stdin returned Unknown process id. They read completed log artifacts instead. The parent subsequently retrieved those same sessions and obtained their exit codes, so a child failure did not establish that the process was gone.
- Evidence: Parent independently recovered test/lint session results after child monitoring receipts reported unavailable sessions. Later Operators launched their own commands and monitored their own exec sessions successfully. Checkout-local evidence includes lifecycle-final-focused-v2.log, lifecycle-quality-lint-v3.log, and lifecycle-rapid-return-green-v2.log under the task tmp directory.
- Recurrence: Three monitoring packets reported the same parent-session access failure in this continuation.
- Impact: Weaker interim exit evidence and redundant monitoring. The parent verified actual exits before accepting the results; no source or user data changed from monitoring.
- Suspected cause: Agent-local exec session namespaces; the parent packet assumed shared process-control IDs.
- Follow-up: Dispatch command execution to the Operator from the start, or supply a shared log plus an explicit completion/exit artifact. Do not infer an exit code from a finished-looking log. No skill implementation change is authorized by this entry.

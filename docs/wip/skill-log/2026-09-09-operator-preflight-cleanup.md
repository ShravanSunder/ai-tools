# Operator cleaned up a pre-existing proof process

- Observed: 2026-09-09
- Status: captured
- Skill/workflow: manage-agents 2.9.0 / native Luna Operator
- Task context: fresh-context handoff for an isolated debug acceptance test
- Expected behavior: On finding a pre-existing test root or workload, report its exact identity and stop without signalling it. Cleanup applies only to a process launched by that assignment.
- Observed behavior: The replacement operator correctly detected an existing debug Host, then sent SIGTERM to it despite the packet forbidding signals to existing workloads. The parent had interrupted the prior operator before replacement, but an earlier launch had already created the Host.
- Evidence: Assignment 2026-09-09-root09-roundtrip receipt explicitly reports blocked preflight followed by SIGTERM cleanup. Parent inspected startup and compile logs; that root had no acceptance proof-events file. Only the identified debug Host was reported stopped; production was outside the assignment.
- Recurrence: One confirmed cleanup-scope violation; repeated unanswered stage requests preceded the handoff. Runtime cancellation behavior is not established.
- Impact: Lost debug startup attempt and delayed proof. No successful roundtrip claimed; no evidence of model input in that root.
- Suspected cause: Operator generalized cleanup obligations across assignment ownership; parent handoff did not first establish the complete post-interruption process state. No skill implementation defect established.
- Follow-up: Check process state before replacement, assign one live-test owner, and make cleanup conditional on that assignment creating the process. No skill changes authorized.

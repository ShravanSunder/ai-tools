# Operator returns proof summaries without requested logs

- Observed: 2026-09-07
- Status: captured
- Skill/workflow: manage-agents 2.8.0 / native Luna Operator
- Task context: repository feature removal build, built CLI, package and dependency proof.
- Expected behavior: save requested persistent command logs and include paths in assignment-bound receipt for parent and independent reviewer inspection.
- Observed behavior: two related Operator assignments returned commands, counts and successful summaries but no log paths; receipt-only follow-up confirmed no persistent logs or reports had been created.
- Evidence: assignments 2026-09-07-worker-artifact-proof and 2026-09-07-worker-installed-graph-refresh; subsequent receipt-only follow-up explicitly reports evidence only in tool-call outputs. Real generated temp deployments and tarball remain inspectable.
- Recurrence: build/artifact and dependency-refresh assignments in this session.
- Impact: independent reviewer cannot inspect the command stream from the summary alone. Final proof must retain logs; current source later changed, independently requiring final rebuild.
- Suspected cause: packet execution/receipt omission; unknown whether workflow instructions contributed.
- Follow-up: explicitly require named logs before command launch and verify existence before accepting final receipt. No skill edits authorized.

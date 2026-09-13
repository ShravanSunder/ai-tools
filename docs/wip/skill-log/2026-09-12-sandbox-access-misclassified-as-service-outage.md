# Sandbox access misclassified as service outage

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: manage-agents 2.11.0 / Operator and Delegate; ops-observability-stack
- Task context: local AgentStudio performance proof and marker-scoped log diagnosis
- Expected behavior: distinguish denied sandbox reachability from actual host service health; use already-authorized host access or report access uncertainty.
- Observed behavior: an Operator reported the collector unavailable after sandbox curl failed; a later Delegate reported Victoria stopped and raw logs unrecoverable, recommending another workload. Parent host-authorized calls succeeded in both cases and recovered 3444 existing marker rows without restart or workload rerun.
- Evidence: AgentStudio issues-perf-again tmp/debug-workflows/2026-09-12-mainactor-cpu/runtime-marker-raw.jsonl and runtime-debt-attribution.md (subsequently corrected); parent host curl exits0.
- Recurrence: two independent lane receipts in this bounded effort.
- Impact: false blockers and risk of unnecessary workload rerun; parent corrected before service mutation or rerun.
- Suspected cause: sandbox tool errors promoted into external-state claims without host verification; workflow-defect status unknown.
- Follow-up: keep access-failure and service-health evidence separate in packets and receipts. No skill edits authorized.

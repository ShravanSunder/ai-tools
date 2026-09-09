# Feature removal drops shared proof and reference detail

- Observed: 2026-09-07
- Status: captured
- Skill/workflow: implement-plan / manage-agents / docs-maintain 2.8.0; delegated implementation
- Task context: complete removal of an obsolete Worker product, preserving the managed Gateway product.
- Expected behavior: classify each deleted claim by surviving consumers; convert incidental Worker fixtures and retain detailed mixed documentation.
- Observed behavior: the draft removed generic backup overlap, scaffold, diagnostic and secret-resolution tests containing Worker fixtures; mixed reference documents became short summaries. Earlier broad pruning also removed shared orchestrator helpers and was corrected.
- Evidence: agent-vm.worker-redesign diff from cbc95aa6 in backup-manager.host.e2e.test.ts, gateway-secret-resolution.integration.test.ts, init-command.integration.test.ts, doctor.unit.test.ts, and docs/reference/configuration/system-json.md. Parent sent exact restoration instructions before acceptance or commit.
- Recurrence: shared orchestrator helper loss followed by independently observed backup, config, scaffold and documentation loss in the same assignment.
- Impact: passing reduced suites could conceal regression in retained behavior; operating contracts lost useful detail.
- Suspected cause: keyword-oriented pruning substituted for semantic claim classification; hypothesis, not established skill defect.
- Follow-up: restore/convert shared claims, produce disposition evidence, rerun required proof, independently review exact final diff. No skill changes authorized.

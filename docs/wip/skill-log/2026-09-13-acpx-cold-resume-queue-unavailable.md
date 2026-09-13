# ACPX cold session resume cannot accept requests

- Observed: 2026-09-13
- Status: captured
- Skill/workflow: manage-agents 2.11.0 / ACPX Claude persistent Sidekick
- Task context: resume an existing read-only sidebar design consultation using the requested model and saved provider identity.
- Expected behavior: a retained named session with a dead queue owner reconnects, or reports a definitive unavailable outcome without ambiguous running-owner state.
- Observed behavior: status reported dead / queue owner unavailable. Initial resume and one bounded retry both returned QUEUE_NOT_ACCEPTING_REQUESTS: Session queue owner is running but not accepting queue requests. Intermediate status still showed the previous-day last prompt.
- Evidence: Agent Studio navigation worktree tmp/sidebar-keyboard-design/opus-core-resume-response.jsonl and opus-core-resume-retry.jsonl; exit1 for both. Stored model/effort matched requested Opus5/high. Narrow ACPX runtime access was granted before the observed queue failures.
- Recurrence: two same-session attempts in this resume; earlier historical failures not inferred.
- Impact: no new advice or keep-alive receipt; parent continued independent work and did not claim cache warmth.
- Suspected cause: unknown; stale queue lifecycle versus reconnect launch requires diagnosis.
- Follow-up: inspect ACPX queue startup/reconnect protocol separately. No runtime/skill edits or process cleanup authorized by this intake.

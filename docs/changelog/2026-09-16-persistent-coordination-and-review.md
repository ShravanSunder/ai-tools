# Shravan Dev Workflow 2.14.2

- Adds persistent orchestrator, implementation, research, and independent review relationships to the workflow skills.
- Keeps the user-facing orchestrator, Frontier or Balanced, responsible for design decisions, delivery disposition, and the final result.
- Routes bounded implementation, research, and review-lane work through native Workers; standalone procedures go to Operators.
- Reuses review leads for correction evidence while preserving existing review and remediation limits.
- Updates agent management, design and delivery orchestration, implementation, research, tracking, and skill-authoring review guidance.
- Updates Codex, Claude, and Cursor plugin manifests and Claude/Cursor marketplace metadata to 2.14.2.
- Rewrites the `manage-agents` wait-interval, persistent-vs-single-assignment, and session-ledger pressure scenarios to assert the shipped behavior: no maintenance heartbeats, dependency-routed waiting, and persistent Review Sidekicks.
- Updates the plugin README external-counsel and agent-management sections to name the persistent Review Sidekick lead and its read-only lane Workers.
- Static validation: 9 targeted skill checks and Claude marketplace validation passed; metadata JSON and whitespace checks passed.
- Evals not run: provider rate limit (Codex usage limit reached); behavior proof, cache refresh, and installation remain deferred.

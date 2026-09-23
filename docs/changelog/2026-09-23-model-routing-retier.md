# Model routing retier

- Marketplace plugins: `shravan-dev-workflow` `2.57.0`; `agent-router` `0.14.0`.
- `manage-agents` now uses the owner-selected Main model and the revised role, category, effort, and authorization rows. Sol low and retired model rows are removed.
- Agent titles use the role emoji and purpose in ACPX examples; `agent-collaboration` and the orchestrators verify the visible title or report a route gap.
- The stop-review Luna fallback now uses medium effort. The semantic eval harness has a judge-neutral name.
- Affected skills: `manage-agents`, `agent-collaboration`, `orchestrator-implementation-goal`, `orchestrator-design`, `program-design`, `implementation-pr-wrapup`, `implement-plan`, and `track-show-me-your-work`.
- Manifests: all three plugin manifests for both plugins, plus Claude and Cursor marketplace entries. Codex marketplace entries carry no version.
- Validation: `pnpm --dir tests/skills run test` (122 passed), `pnpm --dir tests/skills run typecheck`, and `claude plugin validate .` passed. Live pressure evals are owner-deferred.
- Codex and Claude cache refresh/reinstall: not run; deferred until an explicit post-push or release proof step.

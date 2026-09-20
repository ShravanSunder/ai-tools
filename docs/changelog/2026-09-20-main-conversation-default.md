# 2026-09-20 Main remains the default conversation

- Marketplace plugin: `shravan-dev-workflow` `2.19.0`; `agent-router` remains `0.9.0`.
- Affected skills: `manage-agents`, `orchestrator-design`, `orchestrator-implementation-goal`, `implementation-pr-wrapup`, and `implement-plan`, plus their directly affected scenarios and routing reference.
- Main remains the default user conversation after a ready plan and continues to own all governing design/plan authorship, material decisions, integration, assessment, acceptance, and final reporting.
- The commissioned implementation Sidekick still implements, proves, and corrects directly; direct contact with it is available only when the user explicitly chooses it.
- Main does not relay every internal progress turn or poll merely to keep conversation active; returning to Main does not pause authorized implementation.
- Execution/research Worker choices no longer include OpenAI Terra medium. Sol low remains eligible where listed, and suitable existing Sol-low relationships continue.
- No board, session, role, provider, harness, or preference protocol was added.
- PR wrap-up may be executed by the assigned implementation Sidekick or a prescribed Operator; Main retains acceptance, Mini Workers retain description drafting, and merge still requires user authority. This final wording clarification was source/diff inspected only; no additional tests or evaluations ran.
- Source/static validation and the unverified model-behavior boundary are recorded in [the evidence reference](references/2026-09-20-main-conversation-default-proof.md).
- Installed Codex, Claude, and Cursor caches were not refreshed.

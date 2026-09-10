# 2026-09-09 — manage-agents native reviewers stay on spawn

Plugin: `shravan-dev-workflow` 2.9.0 → 2.10.0.

- Reviewer / Advisor / guidance-only `access:` is now `workspace read-only` on the packet. Native launch uses host `spawn_agent` / Task / Agent when the selected model is available. Parent verifies the worktree afterwards.
- A missing sandbox flag is not a reason to leave native. `--sandbox read-only`, `--permission-mode plan`, `dontAsk`, and `workspace_readonly` stay CLI or ACPX knobs.
- User-named models the pattern table allows for this job win over the cheaper default; do not re-ask. Delegate Frontier remains reviewer-only. Advisor permission stays once per relationship.
- Homes: `manage-agents/SKILL.md`, `references/native-providers-codex.md`, `references/agent-job-packet.md`, `references/acpx.md`, `references/acpx-provider-claude.md`.
- Pressure scenario: `manage-agents-native-reviewer-uses-spawn`.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, plus Claude and Cursor marketplace entries, bumped to 2.10.0.
- Validation: skill-creator `quick_validate.py` on `manage-agents` — Skill is valid. `claude plugin validate .` passed. `pnpm --dir tests/skills run test` — 121/121. Live eval of `manage-agents-native-reviewer-uses-spawn` is a named proof gap.
- Refresh/reinstall: not run; home-cache refresh is a release step, not this proof.

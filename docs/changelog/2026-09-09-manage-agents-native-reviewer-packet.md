# 2026-09-09 — manage-agents native reviewers stay on spawn

Plugin: `shravan-dev-workflow` 2.9.0 → 2.10.0.

- Readers (review, advisor, research, guidance) use packet `workspace read-only`: no repo file edits; project `tmp/` and system `/tmp` are allowed. Repeat the no-edit rule on `job:`, `non-goals:`, `stop when:`, and `access:`. Writers name write paths on the packet. Parent verifies afterwards.
- Native launch is `IF` Codex/Claude/Cursor, load the matching `native-providers-*.md` and return that host's encoding. Permission flags stay in those files and ACPX provider refs. A missing sandbox flag is not a reason to leave native.
- User-named models the pattern table allows for this job win over the cheaper default; do not re-ask. Delegate Frontier remains reviewer-only. Advisor permission stays once per relationship.
- Homes: `manage-agents/SKILL.md`, `references/native-providers-{codex,claude,cursor}.md`, `references/agent-job-packet.md`, `references/acpx.md`, `references/acpx-provider-claude.md`.
- Pressure scenario: `manage-agents-native-reviewer-uses-spawn`.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, plus Claude and Cursor marketplace entries, bumped to 2.10.0.
- Validation: skill-creator `quick_validate.py` on `manage-agents` — Skill is valid. `claude plugin validate .` passed. `pnpm --dir tests/skills run test` — 121/121. Live eval of `manage-agents-native-reviewer-uses-spawn` is a named proof gap.
- Refresh/reinstall: not run; home-cache refresh is a release step, not this proof.

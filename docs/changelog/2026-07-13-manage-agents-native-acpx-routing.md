# Manage Agents Native And ACPX Routing

## Release

- Plugin: `shravan-dev-workflow` `1.6.53`
- Skill: `manage-agents`

## Change

- Renames the runtime section to **Native and ACPX Runtimes** and trims the
  runtime table to identity-only rows; host-specific routing now lives outside
  the table.
- Adds explicit host routing: Codex uses native subagents for GPT-native
  models; Claude uses native subagents for Claude-native models.
- Restructures workflow step 2 into separate **Native** and **ACPX** blocks.
  Native preference is harness-based (`if your harness allows those models as
  native subagents`); ACPX loads when another provider, lineage, persistent
  cross-provider work, or explicit ACPX use is required.
- Adds `references/acpx-provider-codex.md` to the ACPX provider reference
  route alongside Claude and Cursor.
- Moves ACP adapter build/wrap guidance to an **Extra** footer pointing at
  `references/building-acp-adapters.md`.
- Shortens model thinking floors to `high+` / `medium+` notation in the model
  matrix.
- Clarifies opening copy: **agent pattern** owns work, continuity, authority,
  cardinality, and minimum capability category.

## Validation

- Changelog and version bump only; installed-cache refresh not run.

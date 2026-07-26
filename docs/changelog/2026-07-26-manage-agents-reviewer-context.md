# Manage Agents Reviewer Context

## Release

- Plugin: `shravan-dev-workflow` `1.6.64`
- Skill: `manage-agents`
- Marketplace: Claude `.claude-plugin/marketplace.json` → `1.6.64` (Codex marketplace is path-sourced; the plugin manifest owns its version)

## Change

- Gives every reviewer an isolated context containing only its bounded packet.
- Leaves context inheritance for non-review assignments to the parent.
- Encodes native Codex isolation as `fork_turns="none"` and keeps fork mechanics in the native provider reference.
- Encodes ACPX isolation through a fresh one-shot call or new named session.
- Removes `--deny-all`; source-grounded calls use `--approve-reads`.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- JSON manifest parsing and `1.6.64` version consistency: passed.
- Codex marketplace readback: passed; the installed cache remains at `1.6.63` until refresh.
- `git diff --check`: passed.
- Two isolated read-only implementation reviewers found the same named-session reuse risk; the accepted fix reserves `sessions new` for isolated calls and `sessions ensure` for inherited continuity.
- Pressure tests were intentionally not run for this wording-focused release.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
- Refresh or reinstall `shravan-dev-workflow@ai-tools` after push when live agents must pick up `1.6.64`.

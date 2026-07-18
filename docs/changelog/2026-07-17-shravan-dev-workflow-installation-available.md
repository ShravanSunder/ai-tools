# Shravan Dev Workflow Installation Policy AVAILABLE

## Release

- Plugin: `shravan-dev-workflow` `1.6.60`
- Marketplace: `ai-tools` / `.agents/plugins/marketplace.json`

## Change

- Sets `shravan-dev-workflow` marketplace `policy.installation` from
  `INSTALLED_BY_DEFAULT` to `AVAILABLE`.
- Codex maps `INSTALLED_BY_DEFAULT` to the UI phrase “Installed by admin,”
  which is misleading for a personal local marketplace. `AVAILABLE` shows
  it as an ordinary user-installable plugin.

## Validation

- Confirmed only `shravan-dev-workflow` used `INSTALLED_BY_DEFAULT` in
  ai-tools; `scaffold-project` and `dev-workflow-tools` were already
  `AVAILABLE`.
- Installed-cache refresh not run in this changeset; refresh/reinstall the
  marketplace plugin in Codex after pull to pick up the policy and version.

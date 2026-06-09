# Plugin Release Checklist

Use this when changing plugin skills, commands, hooks, manifests, or README files.

1. Identify the owning plugin under `plugins/<plugin>/`.
2. Update plugin README when user-facing behavior, install names, skills, commands, hooks, or smoke checks change.
3. Bump both `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` when the plugin supports both tools.
4. Update `.claude-plugin/marketplace.json` version entries.
5. For Codex, keep marketplace source paths in `./plugins/<name>` form; plugin version lives in `.codex-plugin/plugin.json`.
6. Validate with `claude plugin validate .`.
7. Validate the plugin with `validate_plugin.py <plugin-path>`.
8. Validate skills with `quick_validate.py <skill-path>`.
9. Inspect Codex marketplace state with `codex plugin list --marketplace ai-tools --available --json`.
10. Refresh or reinstall the plugin before claiming the installed Codex session sees the change.
11. Run the relevant post-restart smoke from the plugin README.

---
name: peekaboo
description: Use when testing, inspecting, or automating native macOS UI with Peekaboo; checking screen/UI state; interacting with apps, windows, menus, text, or clipboard; troubleshooting Screen Recording or Accessibility permissions; or replacing web-only browser tools for desktop app workflows.
---

# Peekaboo Visual Testing

Peekaboo is a macOS automation CLI for screenshots, UI maps, and native desktop interaction. Treat its live CLI help as the source of truth because command surfaces move faster than copied examples.

## Start Here

1. Confirm the target app/window and current permissions.

   ```bash
   peekaboo permissions status
   peekaboo list apps --json
   peekaboo list windows --app "MyApp" --json
   ```

2. Discover current commands before automation.

   ```bash
   peekaboo --help
   peekaboo <command> --help
   ```

3. Use live progressive-disclosure guides when available.

   ```bash
   peekaboo learn
   peekaboo tools
   ```

4. Capture current UI before element actions.

   ```bash
   umask 077
   UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
   peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_JSON"
   ```

## Operating Rules

- Use `peekaboo see --json` before element interactions so element IDs and snapshot IDs are fresh.
- Prefer element IDs from `see`; use coordinates only when Accessibility metadata is unavailable.
- Use `--json` whenever another tool, script, or agent needs to parse output.
- Check `peekaboo permissions status` before treating capture or interaction failures as CLI bugs.
- Respect the user's desktop. Do not quit apps, close windows, move windows, modify clipboard contents, or perform other destructive desktop actions unless the user explicitly asked for that target and action.
- If the UI may have changed, recapture with `peekaboo see --json` before retrying an interaction.
- Element IDs are snapshot-specific. Do not reuse `elem_*` IDs from older captures without verifying the current snapshot.
- For apps with multiple windows, list windows and select `--window-id`, `--window-title`, or an explicit `peekaboo window focus` target before mutating UI.
- For snapshot-backed clicks, use the snapshot context. Do not add `--app` to a click that already uses `--snapshot`; if targeting is ambiguous, recapture and inspect the snapshot/app/window context first.
- UI JSON, screenshots, and logs can contain sensitive data. Use `umask 077` plus `mktemp` for redirected artifacts and clean up only current-run files.
- `--no-auto-focus` can prove background behavior, but some apps ignore synthetic clicks until focus is allowed.

## Shortcut Pressure Response

When a user asks to skip setup, reuse old element IDs, rely on remembered syntax, or close apps as cleanup:

1. Refuse the stale or destructive shortcut.
2. Name the live discovery source: `peekaboo --help`, `peekaboo learn`, or `peekaboo tools`.
3. Disambiguate the target window by naming `peekaboo list windows`, `--window-id`, `--window-title`, or `peekaboo window focus`.
4. Use private per-run temp artifacts by naming `umask 077`, `mktemp`, and cleanup of current-run UI JSON or screenshots.
5. Use the safe interaction slice with a fresh `see --json` snapshot.
6. Route deeper needs by naming the relevant reference path: `references/visual-testing-patterns.md`, `references/troubleshooting.md`, or `references/headless-automation.md`.

## Safe Interaction Slice

```bash
umask 077
UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
UI_AFTER_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui-after.XXXXXX.json")
trap 'rm -f "$UI_JSON" "$UI_AFTER_JSON"' EXIT

peekaboo app switch --to "MyApp"
peekaboo list windows --app "MyApp" --json
peekaboo window focus --app "MyApp" --window-title "Window Title"
peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_JSON"
SNAPSHOT=$(jq -r '.data.snapshot_id' "$UI_JSON")
jq '.data.ui_elements[] | {id, label, role: .role_description}' "$UI_JSON"
peekaboo click --snapshot "$SNAPSHOT" --on elem_5 --json
peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_AFTER_JSON"
```

Why this shape:

- `app switch` makes the intended target visible.
- `list windows` and `window focus` prevent same-app, wrong-window actions.
- `mktemp` plus `umask 077` keeps sensitive captures private to the run.
- `see --json` records fresh UI state and a `snapshot_id`.
- `click --snapshot` uses the captured context instead of the frontmost app by accident.
- The final capture verifies the real UI changed.

## Progressive Reference Router

Read only the reference needed for the current failure mode:

| Need | Reference |
| --- | --- |
| Multi-step visual tests, waits, screenshot comparison, form flows, input-path probes | `references/visual-testing-patterns.md` |
| Permissions, stale snapshots, wrong app/window, bridge errors, focus, debug builds | `references/troubleshooting.md` |
| Daemon mode, MCP mode, CI/headless setup, sockets, logs | `references/headless-automation.md` |

## Security Notes

Peekaboo operates through macOS Screen Recording and Accessibility. UI JSON, screenshots, logs, clipboard contents, window titles, and daemon sockets can contain sensitive data. Keep artifacts in temporary paths, redact before sharing, and avoid broad desktop actions when a narrower target action will do.

# Thread-first work trails

- Plugins: `shravan-dev-workflow` 2.13.0 and `codex-router` 0.5.0.
- Work trails use shared Router threads across sessions; new trails need no JSONL event store.
- Agents organize topics/threads within owner-authorized projects and boards.
- Meaningful checkpoints, linked detail, conditional summaries, and unshared Markdown fallback preserve continuity.
- Updated tracker, agent management, design/delivery callers, canonical collaboration skill and pinned vendor copy.
- Updated matching plugin manifests, Claude marketplace versions, and delivery README.
- Validation: 121 unit tests, typecheck, five skill validators, Claude packaging and pinned-source check passed; ten targeted real-model pressure cases passed across scoped runs.
- Clarified existing wake-cadence guidance after pressure proof exposed a cron workaround.
- Codex/Claude cache refresh and home activation not performed.

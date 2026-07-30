# Session Log Locations

Filed 2026-07-23 for skill-session mining. Paths are on this machine under
`$HOME`. Volume notes are from a 14-day mtime window ending 2026-07-23.

## Codex (primary; heaviest use + subagents)

| Kind | Path | Notes |
|------|------|-------|
| Session rollouts | `~/.codex/sessions/YYYY/MM/DD/rollout-<ts>-<uuid>.jsonl` | Main transcript. JSONL events: `session_meta`, `event_msg`, `response_item`, … |
| Rollout summaries | `~/.codex/memories/rollout_summaries/*.md` | Compressed session memory; high signal for skill lessons |
| App / debug logs | `~/.codex/log/` | Process logs, not full chat |
| Browser sessions | `~/.codex/browser/sessions/` | Browser tool sessions |
| SQLite / state | `~/.codex/sqlite/`, `~/.codex/.codex-global-state.json` | Indices / UI state; not primary narrative |

**14d volume (approx):** ~696 rollout files; peak days 2026-07-14..16 (~90–100/day). Individual rollouts can be tens to 100+ MB when subagents fan out.

## Claude Code

| Kind | Path | Notes |
|------|------|-------|
| Project transcripts | `~/.claude/projects/<project-slug>/<session-uuid>.jsonl` | Primary chat + tool_use stream |
| Sessions metadata | `~/.claude/sessions/` | Session metadata dirs (often empty of jsonl) |
| Session env | `~/.claude/session-env/` | Per-session env snapshots |
| Tasks / teams | `~/.claude/tasks/session-*`, `~/.claude/teams/session-*` | Sidechain / team session scaffolding |
| History | `~/.claude/history.jsonl` | Compact history index |
| Debug | `~/.claude/debug/` | Hook / runtime debug |

**14d volume (approx):** ~60 project `*.jsonl` files touched.

## Cursor

| Kind | Path | Notes |
|------|------|-------|
| Agent transcripts | `~/.cursor/projects/<project-id>/agent-transcripts/<uuid>/<uuid>.jsonl` | Parent/subagent chat for Agent mode |
| Chats | `~/.cursor/chats/<id>/` | IDE chat artifacts |
| ACP sessions | `~/.cursor/acp-sessions/<uuid>/` | ACP adapter sessions (~241 files in 14d) |
| Browser logs | `~/.cursor/browser-logs/` | Browser tooling |

**14d volume (approx):** ~14 agent-transcript jsonl files; lighter skill signal than Codex.

## Mining notes

1. Prefer Codex `rollout_summaries` first, then targeted rollout excerpts.
2. Skill names often appear in system prompts / skill trees, so raw mention count is noisy; prefer fail-signal snips and summary narratives.
3. Keep secrets out of public WIP docs; link private evidence paths only.
4. Mechanical index for this run:
   [`tmp/research-workflows/2026-07-23-skills-session-lessons/mechanical-index.json`](../../../tmp/research-workflows/2026-07-23-skills-session-lessons/mechanical-index.json)

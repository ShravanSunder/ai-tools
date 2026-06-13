# AI Tools - Agent Instructions

This repository contains personal Codex and Claude Code plugins plus the Agent Sidecar system for running AI coding assistants in sandboxed Docker containers.

## Repository Overview

**Purpose**: AI development tools distributed through local plugin marketplaces, plus isolated Docker environments for AI agents.

## Repository Variants

This repo has two variants maintained separately:

- `~/dev/ai-tools` -- Personal projects (this repo, public)
- `~/dev/relay-ai-tools` -- Work projects (private fork)

Work repos should use `relay-ai-tools`. Personal repos should use `ai-tools`.

### Differences Between Variants

| Feature | ai-tools (personal) | relay-ai-tools (work) |
|---------|---------------------|----------------------|
| Firewall presets | github-write, notion, linear | github-write, notion, jira, slack |
| OpenCode support | Yes (`--run-opencode`) | No (removed) |
| Agent CLIs | Claude, Codex, Gemini, OpenCode, Cursor | Claude, Codex, Gemini, Cursor |

### Keeping Variants in Sync

The repos are maintained separately. When making changes to shared sidecar functionality (scripts, dockerfiles, firewall logic), sync the changes to the other variant:

- Copy updated files manually, or set up git remotes
- The `agent_sidecar/` directory is the primary sync target
- Plugin-related files (`plugins/`, `.claude-plugin/`) are NOT synced (personal-only)

## Repository Structure

```
ai-tools/
├── .agents/plugins/marketplace.json  # Codex plugin marketplace manifest
├── .claude-plugin/marketplace.json   # Claude Code plugin marketplace manifest
├── plugins/                          # Plugin sources
│   ├── ai-scaffold/                  # Project scaffolding (biome, ruff, vitest, pytest)
│   ├── dev-workflow-tools/           # Common tool skills, including Peekaboo UI testing
│   ├── quorum-counsel/               # Manual multi-model counsel stack
│   └── shravan-dev-workflow/         # Spec, review, docs, TUI, and Linear workflow skills
├── observability/                    # Shared local OpenTelemetry and Victoria stack
├── agent_sidecar/                    # Docker sidecar system
│   ├── run-agent-sidecar.sh          # Main launch script
│   ├── sidecar-ctl.sh                # Host-side firewall control
│   ├── sidecar.base.conf             # Base configuration
│   ├── init_repo_sidecar.sh          # Initialize .agent_sidecar/ in repos
│   ├── setup/                        # Firewall, init scripts, zsh config
│   └── firewall-toggle-presets/      # Toggle preset domain lists
├── agents.md                         # Agent instructions (this file)
└── CLAUDE.md → agents.md             # Symlink for Claude Code
```

## Plugin Skills

Codex skills are delivered by installed Codex plugins. Do not add sync scripts or symlink-based delivery back into this repo.

Claude Code can load the same skill tree when a plugin also has `.claude-plugin/plugin.json`. Keep shared workflow skills under the plugin that owns them.

## System Observability Ownership

`observability/` owns the shared local OpenTelemetry and Victoria stack.
`shravan-dev-workflow:ops-observability-stack` owns agent-facing query and debugging guidance. Do not
move this stack into `devfiles`, and do not duplicate Docker Compose, collector,
or generic Victoria query docs into app repos.

### Current Plugin Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| spec-design-swarm | `plugins/shravan-dev-workflow/skills/spec-design-swarm/` | Pre-plan design formation with bounded codebase explorer, architecture, security, and adversarial lanes |
| discuss-with-me | `plugins/shravan-dev-workflow/skills/discuss-with-me/` | Manual pressure-test that makes the shared model prove itself before action: scoped decision map, challenge to the user's read, and one forcing question for design/spec/plan/implementation/docs decisions |
| research-swarm | `plugins/shravan-dev-workflow/skills/research-swarm/` | Evidence-gathering workflow for local code/docs, prior art, current web/docs, Reader, memory, and session-log research with bounded lanes and tmp research ledgers |
| orchestrator-goal | `plugins/shravan-dev-workflow/skills/orchestrator-goal/` | Compile clear long-horizon work into Codex/Claude `/goal` contracts, or route unclear goals to discuss-with-me |
| docs-maintain | `plugins/shravan-dev-workflow/skills/docs-maintain/` | Maintain durable docs and classify existing specs/plans/debug artifacts for cleanup, archival, or promotion after phase skills create them |
| spec-review-swarm | `plugins/shravan-dev-workflow/skills/spec-review-swarm/` | Post-draft adversarial spec/design review with accepted, contested, and open synthesis |
| spec-handoff | `plugins/shravan-dev-workflow/skills/spec-handoff/` | Portable spec/design context packets before an implementation plan exists |
| plan-create | `plugins/shravan-dev-workflow/skills/plan-create/` | Create written implementation plans from spec/design context without editing code |
| ops-security-review | `plugins/shravan-dev-workflow/skills/ops-security-review/` | Routes authorized security scans to the official Codex Security workflows |
| implementation-review-swarm | `plugins/shravan-dev-workflow/skills/implementation-review-swarm/` | Codex-first implementation review swarm using bounded read-only reviewer lanes, Codex subagents as the default/majority backend, and explicit opt-in Claude/Gemini/agy adversarial lanes |
| implementation-pr-wrapup | `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/` | Finish GitHub PR lifecycle work after implementation: push/open/update, monitor checks/comments, handle existing review threads, prove merge readiness, and merge only when authorized |
| plan-handoff | `plugins/shravan-dev-workflow/skills/plan-handoff/` | Copy-pasteable existing implementation-plan packets for other agents, CLIs, machines, or future sessions |
| implementation-handoff | `plugins/shravan-dev-workflow/skills/implementation-handoff/` | Implementation-state packets for manual reviewers or continuation agents |
| plan-review-swarm | `plugins/shravan-dev-workflow/skills/plan-review-swarm/` | Read-only adversarial plan review with whole-artifact loading, live repo validation, bounded reviewer lanes, and temp review artifacts for substantial reviews |
| implementation-execute-plan | `plugins/shravan-dev-workflow/skills/implementation-execute-plan/` | Validate a written plan against the current repo, then execute with parent-owned subagent coordination and verification |
| ops-observability-stack | `plugins/shravan-dev-workflow/skills/ops-observability-stack/` | Shared local OTel and Victoria stack operations, producer boundaries, resource naming, and debug/beta query loops |
| debug-investigation | `plugins/shravan-dev-workflow/skills/debug-investigation/` | Diagnosis-first debugging with repo-local debug artifacts for clear real debugging work before fixes |
| skill-audit | `plugins/shravan-dev-workflow/skills/skill-audit/` | Evidence-backed skill audits using current plugin inventory, session patterns, and upstream inspirations |
| tui-presentation | `plugins/shravan-dev-workflow/skills/tui-presentation/` | Structured TUI/chat output for design, architecture, comparisons, flows, and multi-section explanations |
| ops-linear-tracking | `plugins/shravan-dev-workflow/skills/ops-linear-tracking/` | Linear projects, milestones, issues, and dependencies using docs as truth and tickets as tracking |
| peekaboo | `plugins/dev-workflow-tools/skills/peekaboo/` | macOS visual UI testing (common — works in both Claude and Codex) |
| scaffold-project | `plugins/ai-scaffold/skills/scaffold-project/` | Project scaffolding (common) |

**Config locations**:
- Claude agents: `dot_claude/private_agents/*.md`
- Codex agent roles: `dot_codex/agents/*.toml.tmpl` (analyst, reviewer, browser) — spawned in-session via `spawn_agent`
- Codex profiles: `dot_codex/private_config.toml.tmpl` (`[profiles.spark]`, `[profiles.researcher]`) — invoked via `codex --profile X`
- Codex role/profile prompts (shared): `dot_codex/instructions/*.md`

Sync rule: when role behavior changes, update the Claude agent AND the matching Codex role TOML / instruction doc in the same changeset.

### Relationship to quorum-counsel

`quorum-counsel` remains available for manual use, but it is not the default review workflow. Prefer `shravan-dev-workflow:implementation-review-swarm` for Codex reviews. That skill keeps Codex subagents as the default/majority reviewer backend and includes Claude, Gemini/agy, or another outside adversarial lane only when the user explicitly asks.

Oracle is manual-only. Do not invoke it from normal review workflows.

### Changelog Expectations

When a plugin or sidecar change is user-visible, update `docs/changelog/` in the same changeset.

For plugin changes, record:

- marketplace-facing plugin name and new version
- affected skills, commands, hooks, manifests, marketplace entries, and README sections
- user-visible behavior change
- validation commands and results
- refresh/reinstall status for Codex and Claude when applicable

Keep entries public-safe: `~/dev/ai-tools` is public; do not include credentials, private machine config, work-fork details, or local cache hashes. Put evidence snippets and longer validation notes under `docs/changelog/references/`.

Use the changelog system as the durable release memory:

- add one dated entry under `docs/changelog/`
- add that entry to `docs/changelog/README.md` newest-first
- use `docs/changelog/references/` only for longer evidence, excerpts, or validation notes
- do not bury release behavior only in chat, commits, or plugin README text

### Adding a New Skill

1. Choose the owning plugin under `plugins/<plugin-name>/`.
2. Create `plugins/<plugin-name>/skills/{skill-name}/SKILL.md` with YAML frontmatter (`name`, `description`).
3. Add references, scripts, or README files inside that skill directory as needed.
4. Bump the owning plugin version.
5. Update `.agents/plugins/marketplace.json` for Codex availability when adding a new plugin.
6. Update `.claude-plugin/marketplace.json` and add `.claude-plugin/plugin.json` only if Claude Code should load the same plugin.

### Skill Authoring Discipline

Skills encode judgment, house style, and repeatable failure prevention. Prefer improving an existing skill over adding a near-duplicate.

- When creating, editing, auditing, or pressure-testing skills, load and follow `superpowers:writing-skills`. For substantial behavior-changing skills, treat intent as the core artifact: what judgment should the future agent apply, what failure mode are we preventing, and what shortcut must it resist?
- Name skills with active, searchable verbs in hyphen-case.
- Write the frontmatter `description` as a trigger: start with `Use when...`, name concrete situations and symptoms, and do not summarize the workflow.
- Keep `SKILL.md` concise and progressive. Move heavy examples, rubrics, templates, and long prompt packets into `references/`; use `scripts/` for deterministic mechanics.
- Do not add README files inside skill folders unless a consuming tool requires them.
- Cross-reference other skills by skill name, not fragile installed-cache paths.
- Treat skill writing like TDD for process documentation: first identify or create a pressure scenario where the agent fails without the skill, then write the smallest wording that prevents that failure, then retest and close loopholes.
- Capture the rationalizations the agent used to go wrong, especially "I already know this", "this is obvious", "I'll verify later", and "the user probably meant..."; turn those into explicit red flags or gates in the skill.
- For `shravan-dev-workflow` skill changes, add or update pressure scenarios under `tests/skills/pressure-scenarios/` and run `tests/skills/run-skill-pressure-tests.sh --fast` before rollout.
- Validate each changed skill independently before broad rollout. For workflow skills, include at least one realistic trigger evaluation or copy-paste pressure prompt that proves when the skill should and should not load.
- Keep artifact ownership explicit: spec, plan, research, and debug skills create their lane artifacts for clear substantial work unless the user asks for chat-only/no-files; `docs-maintain` owns cleanup, archival, promotion, and source-of-truth reconciliation after artifacts exist.
- Keep parent/subagent ownership explicit: subagents produce bounded evidence or candidate findings; the parent agent verifies, reduces, and owns the final claim.

## Plugin Development

### Marketplace

Plugins are distributed through both marketplace manifests when they support both tools:

- Codex: `.agents/plugins/marketplace.json`
- Claude Code: `.claude-plugin/marketplace.json`

```bash
# Validate Claude marketplace manifest
claude plugin validate .

# Inspect Codex marketplace state
codex plugin list --marketplace ai-tools --available --json
```

### Plugin Structure

Each plugin lives under `plugins/` and follows the standard Claude Code plugin layout:

```
plugins/<plugin-name>/
├── .codex-plugin/plugin.json     # Codex plugin manifest (when supported)
├── .claude-plugin/plugin.json    # Plugin manifest (name, version, description)
├── commands/                     # Slash commands (*.md files)
├── agents/                       # Agent definitions (*.md with YAML frontmatter)
├── skills/                       # Skills (subdirs with SKILL.md)
│   └── <skill-name>/
│       ├── SKILL.md
│       └── references/           # Supporting docs for the skill
├── hooks/                        # Hook definitions (hooks.json + scripts)
└── README.md
```

### Key Rules

- Plugin `source` paths in marketplace manifests must use `./plugins/<name>` format (explicit relative paths)
- `${CLAUDE_PLUGIN_ROOT}` resolves to the cached install path at runtime -- use it in hooks and scripts
- Path traversal (`..`) is NOT allowed in source paths
- Plugin `name` is the cache key for consumers -- changing it breaks existing installs
- Run `claude plugin validate .` after Claude marketplace changes and `codex plugin list --marketplace ai-tools --available --json` after Codex marketplace changes

### Hook Development Gotchas

- **Transcript vs stdin**: The `transcript_path` JSONL file uses Anthropic API format -- tool usage is `{"type": "tool_use", "name": "Write", "input": {...}}` inside a `content` array. The field is `"name"`, NOT `"tool_name"`. The `"tool_name"` field only exists in hook stdin input. Do not grep the transcript for `"tool_name"`.
- **Display names differ from tool names**: Terminal shows `Create(file)` but the transcript stores `"name": "Write"`. Similarly, `MultiEdit` is a separate tool name.
- **Cache versioning**: Plugin files are cached by `version` in `plugin.json`. Changing hook scripts or config without bumping the version means Claude Code uses stale cached files. Always bump version after changes.
- **Stop hooks**: Require `"matcher": "*"` in `hooks.json`. Use `bash ${CLAUDE_PLUGIN_ROOT}/hooks/script.sh` (with `bash` prefix) to ensure execution even if permissions are stripped during caching. Check `stop_hook_active` and exit 0 when true to prevent infinite loops. Exit code 2 blocks the stop; stderr is fed back to Claude as the reason.
- **Debugging hooks**: Run `claude --debug`, check logs at `~/.claude/debug/`, grep for `Hook Stop` to see hook output and exit codes.

### Adding a New Plugin

1. Create `plugins/<name>/` with `.codex-plugin/plugin.json` for Codex and `.claude-plugin/plugin.json` for Claude Code if needed
2. Add commands, agents, skills, or hooks as needed
3. Add an entry to the matching marketplace manifest
4. Add a `README.md` in the plugin directory
5. Update `plugins/README.md` with the new plugin listing
6. Validate with the relevant plugin CLI

## Agent Sidecar

Sandboxed Docker containers for AI coding assistants with network isolation. See `agent_sidecar/README.md` for full documentation.

### Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `run-agent-sidecar.sh` | `agent_sidecar/` | Main entry point, builds/starts container |
| `sidecar-ctl.sh` | `agent_sidecar/` | Host-side firewall control |
| `firewall.sh` | `agent_sidecar/setup/` | In-container iptables/dnsmasq management |

### Configuration Hierarchy

Files are resolved in priority order (highest first):

1. **Local** (`.local.` suffix) - Personal overrides, gitignored
2. **Repo** (`.repo.` suffix) - Team overrides in `.agent_sidecar/`
3. **Base** (`.base.` suffix) - Defaults in `agent_sidecar/` or `setup/`

**Naming Convention**:
| Behavior | Pattern | Examples |
|----------|---------|----------|
| **Override** (pick one: local > repo > base) | `{name}.{tier}.{ext}` | `sidecar.repo.conf`, `node-py.local.dockerfile` |
| **Additive** (merge all that exist) | `{name}-extra.{tier}.{ext}` or `extra.{tier}.{ext}` | `firewall-allowlist-extra.repo.txt`, `extra.repo.zshrc` |

### Two-Tier Image Architecture

Images use a shared base + optional per-repo overlay:

1. **Base image** (`agent-sidecar-base:{variant}`) - Shared across all repos. Contains OS, tools, agent CLIs, Playwright. Built once. Uses Python 3.13.
2. **Per-repo overlay** (`agent-sidecar:{repo-name}`) - Only built when customizations exist (EXTRA_APT_PACKAGES, build-extra.sh, extra zshrc).
3. If no customizations, the base image is used directly (no overlay build).

Custom Dockerfiles in `.agent_sidecar/` **must** `FROM agent-sidecar-base:{variant}`:
```dockerfile
ARG BASE_IMAGE=agent-sidecar-base:node-py
FROM ${BASE_IMAGE}
# ... your customizations ...
```

Resolution for custom Dockerfiles (override pattern):
```
1. .agent_sidecar/node-py.local.dockerfile  (personal, gitignored)
2. .agent_sidecar/node-py.repo.dockerfile   (team, committed)
3. (no override) -> base image used directly, or overlay if customizations exist
```

### Firewall System

**Allowlist files** (merged at startup, additive `-extra` pattern):
- `setup/firewall-allowlist-extra.base.txt` - Always allowed (npm, pypi, AI APIs, etc.)
- `.agent_sidecar/firewall-allowlist-extra.repo.txt` - Per-repo additions
- `.agent_sidecar/firewall-allowlist-extra.local.txt` - Personal additions

**Toggle presets** (dynamic via `sidecar-ctl`):
- `firewall-toggle-presets/github-write.txt` - Push to GitHub
- `firewall-toggle-presets/notion.txt` - Notion API
- `firewall-toggle-presets/linear.txt` - Linear API

### Extra APT Packages (per-repo)

Set `EXTRA_APT_PACKAGES` in `sidecar.repo.conf` or `sidecar.local.conf`:

```bash
# .agent_sidecar/sidecar.repo.conf
EXTRA_APT_PACKAGES="htop tree"
```

Setting `EXTRA_APT_PACKAGES` triggers a per-repo **overlay image** build on top of the shared base. Requires `--full-reset` to rebuild when changed.

### Build-Extra Script (per-repo)

For custom build-time installations (AppImages, binaries, etc.), create a build script:

```bash
# .agent_sidecar/build-extra.repo.sh
#!/bin/bash
# Install Obsidian (extracted AppImage, no libfuse2 needed)
curl -L "https://github.com/.../Obsidian-1.5.3.AppImage" -o /tmp/obsidian.AppImage
chmod +x /tmp/obsidian.AppImage
cd /opt && /tmp/obsidian.AppImage --appimage-extract
mv squashfs-root obsidian && ln -s /opt/obsidian/obsidian /usr/local/bin/obsidian
rm /tmp/obsidian.AppImage
```

- Runs as **root** at Docker build time (full network access)
- Script is deleted after running (agent cannot access it)
- Resolution: `.local` > `.repo` (no base)
- Requires `--full-reset` to rebuild when changed

### Init Script Extras

**Extra scripts** (run AFTER base init scripts, additive pattern):
- `.agent_sidecar/init-background-extra.repo.sh` - Team background commands
- `.agent_sidecar/init-background-extra.local.sh` - Personal background commands
- `.agent_sidecar/init-foreground-extra.repo.sh` - Team shell setup
- `.agent_sidecar/init-foreground-extra.local.sh` - Personal shell setup

These run IN ADDITION to base scripts. The original `init-{bg,fg}.{repo,local}.sh` replacement pattern still works for full overrides.

### Container Naming

Containers are named: `agent-sidecar-{repo-name}-{dir-hash}`

Example: `agent-sidecar-my-project-a1b2c3d4`

### Volume Management

Persistent volumes per workspace:
- `agent-sidecar-history-{hash}` - Shell history
- `agent-sidecar-venv-{hash}` - Python virtualenv
- `agent-sidecar-pnpm-{hash}` - pnpm store
- `agent-sidecar-cache-{hash}` - pnpm/npm cache (persists across container recreation)
- `agent-sidecar-uv-{hash}` - uv Python downloads and cache
- `agent-sidecar-nm-{hash}-*` - node_modules per package

### Initialize a Repository

Use `init_repo_sidecar.sh` to set up `.agent_sidecar/` with template files:

```bash
# From any repo directory
init_repo_sidecar.sh --default          # Full setup (both .repo and .local files)
init_repo_sidecar.sh --repo-only        # Team setup only
init_repo_sidecar.sh --local-only       # Personal setup only
init_repo_sidecar.sh --sync-docs        # Only sync INSTRUCTIONS.md (quick doc update)
init_repo_sidecar.sh --default --override  # Force-overwrite all files
```

Every run copies `agent_sidecar/INSTRUCTIONS.md` into `.agent_sidecar/INSTRUCTIONS.md` (always overwritten). This gives agents in target repos a concise usage reference with links to config docs. Config files are only created if they don't exist, unless `--override` is used. See [`agent_sidecar/INSTRUCTIONS.md`](agent_sidecar/INSTRUCTIONS.md) for the full usage guide that gets synced.

### Debugging container issues

```bash
# Check container status
sidecar-ctl status

# List all sidecar containers
sidecar-ctl containers

# Reload container (recreate with current image, picks up config/mount changes)
run-agent-sidecar.sh --reload

# Full reset (rebuild base image + recreate container, updates agent CLIs to latest)
run-agent-sidecar.sh --full-reset

# Enter container without running agent
run-agent-sidecar.sh --no-run
docker exec -it agent-sidecar-{name}-{hash} zsh

# Clean up Docker resources (dangling images, old build cache, orphaned volumes)
sidecar-ctl cleanup
```

**Container lifecycle flags**:

| Flag | Base Image | Per-Repo Image | Container | Speed | Use Case |
|------|-----------|---------------|-----------|-------|----------|
| *(no flag)* | Reuse (or build if missing) | Skip if no customizations | Reuse existing | ~0-3s | Day-to-day re-entry |
| `--reload` | Skipped | Skipped | Recreate | ~5-10s | Pick up config/mount changes |
| `--full-reset` | Rebuild (cache bust) | Rebuild if needed | Recreate | ~2-5min | Update CLIs, Dockerfile, apt packages |

**Note**: `--full-reset` updates all agent CLIs (Claude, Codex, Gemini, etc.) to their latest versions. Named volumes (history, venv, pnpm, node_modules, cache, uv) survive both `--reload` and `--full-reset`.

## Security Model

The agent inside the container has limited access by design:

| Resource | Agent Access | Notes |
|----------|--------------|-------|
| `.agent_sidecar/` | **None** | Shadowed with empty tmpfs; config at `/etc/agent-sidecar` for system scripts |
| APT/Debian repos | **None** | Packages installed at build time only, firewall blocks apt repos |
| Network | **Allowlist only** | Firewall blocks all except explicitly allowed domains |
| `.git/` | **Read-only** | Mounted read-only to prevent repo corruption |
| Playwright/Chromium | **Localhost only** | Can only access 127.0.0.1 by default; use `PLAYWRIGHT_EXTRA_HOSTS` to allow more |

## Important Notes

- All `.local.*` files are gitignored for personal customization
- The `.generated/` folder contains runtime files (compiled firewall lists)

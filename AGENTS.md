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
│   └── shravan-dev-workflow/         # Spec, review, docs, TUI, and Linear workflow skills
├── observability/                    # Shared local OpenTelemetry and Victoria stack
├── agent_sidecar/                    # Docker sidecar system
│   ├── run-agent-sidecar.sh          # Main launch script
│   ├── sidecar-ctl.sh                # Host-side firewall control
│   ├── sidecar.base.conf             # Base configuration
│   ├── init_repo_sidecar.sh          # Initialize .agent_sidecar/ in repos
│   ├── setup/                        # Firewall, init scripts, zsh config
│   └── firewall-toggle-presets/      # Toggle preset domain lists
├── AGENTS.md                         # Agent instructions (this file)
└── CLAUDE.md → AGENTS.md             # Symlink for Claude Code
```

## Plugin Skills

Codex skills are delivered by installed Codex plugins. Do not add sync scripts or symlink-based delivery back into this repo.

Claude Code can load the same skill tree when a plugin also has `.claude-plugin/plugin.json`. Keep shared workflow skills under the plugin that owns them.

## Skill Work SOP

`AGENTS.md` is the repo operating map for skill work. It should tell agents how to work here, which skill owns the next decision, and where deeper instructions live. It should not duplicate the full manuals from meta-skills.

When creating, editing, or evaluating one named skill or accepted draft in this repo, use `shravan-dev-workflow:skills-creation` as the owning workflow. It owns the great-skill model: YAML trigger design, `SKILL.md` mental model and main path, reference depth, steering language, pruning, pressure proof, platform mechanics, source-adaptation checks, and sensitive-resource routing.

Use `shravan-dev-workflow:skill-audit` for broad evidence-backed questions about which skills to create, update, merge, or skip across the repo. `skills-creation` does not own broad repo-wide portfolio audit or duplicate-surface archaeology.

When doing skill work in this repo:

1. Start from a concrete need, repeated failure mode, or user-approved workflow change.
2. If the target is not named, use `skill-audit` for broad portfolio classification or ask for a named target.
3. Use `skills-creation` for the named target's create/update/evaluate workflow.
4. Use `skills-creation` references for trigger/invocation choices, mental-model and reference hierarchy, pressure proof, Codex/Claude platform mechanics, source adaptation, pruning, and sensitive resources.
5. Keep `SKILL.md` compact and progressive. Put depth in `references/` and deterministic mechanics in `scripts/`.
6. For `shravan-dev-workflow` behavior changes, add or update pressure scenarios under `tests/skills/pressure-scenarios/` and run `tests/skills/run-skill-pressure-tests.sh --fast`.
7. For user-visible plugin behavior changes, update `docs/changelog/`, bump plugin version metadata, and record refresh / reinstall status.
8. Before calling skill-work changes complete, route the changed surface through `shravan-dev-workflow:implementation-review-swarm`, then `shravan-dev-workflow:implementation-pr-wrapup` for push / PR / checks / review-thread / merge-readiness proof. Refresh installed Codex/Claude caches only as an explicit post-push or release proof step; it is a home-level mutation and not a substitute for PR readiness.

Detailed mechanics stay in the owning skills and references:

- `skills-creation` owns create/update/evaluate for one named skill or accepted draft, including YAML trigger design, the `SKILL.md` mental model and main path, reference depth, great-skill evaluation, pressure-proof design, platform mechanics, source adaptation, and sensitive-resource routing.
- `skill-audit` owns evidence-backed recommendations about what to update, create, merge, or skip across a broader skill surface.
- `superpowers:writing-skills` is source inspiration for pressure proof and rationalization traps; Matt-style great-skill vocabulary is source inspiration for invocation, hierarchy, steering, and pruning. Normal repo skill authoring routes through `skills-creation`.
- `skill-creator` owns Codex skill anatomy and generated metadata as platform support loaded through `skills-creation/references/platform-mechanics.md`.
- `tests/skills/README.md` owns the local pressure-test runner contract.
- `docs-maintain` owns cleanup, archival, promotion, and durable docs reconciliation after artifacts exist.
- `implementation-review-swarm` and `implementation-pr-wrapup` own the final review and merge-ready PR proof for implemented skill-work changes.

## Admired-source provenance (ai-dev-skills)

Upstream skill collections are tracked in a separate meta-repo so this plugin can keep a **lite** inspiration map while durable provenance lives next to the actual upstream checkouts.

- **Meta-repo:** `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/`
- **Lite in-plugin map:** `plugins/shravan-dev-workflow/docs/source-inspiration-catalog.md` (preserve/avoid + workflow-area overview; not a runtime skill reference)
- **Compatibility pointer:** `plugins/shravan-dev-workflow/references/source-inspirations.md`

| Need | Open |
|------|------|
| Quick preserve/avoid reminder | lite catalog above |
| Per-skill borrowed / do-not-copy detail | `ai-dev-skills/docs/my-ai-tools/` |
| What we care about in an upstream tree | `ai-dev-skills/docs/repo-index/` |
| Cheap compare between two pinned SHAs | `ai-dev-skills/docs/repo-index-changelog/` |
| How to bump submodules / keep indexes synced | `ai-dev-skills/AGENTS.md` |

**Maintain both.** Update `ai-dev-skills` for path-level mappings, pin SHAs, and bump notes. Refresh the lite catalog here only when the high-level preserve/avoid or workflow-area story changes. Do not copy upstream skill prose into plugin skills; do not treat inspiration as proof that local behavior works.

## System Observability Ownership

`observability/` owns the shared local OpenTelemetry and Victoria stack. `shravan-dev-workflow:ops-observability-stack` owns agent-facing query and debugging guidance. Do not move this stack into `devfiles`, and do not duplicate Docker Compose, collector, or generic Victoria query docs into app repos.

### Current Plugin Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| spec-creation-swarm | `plugins/shravan-dev-workflow/skills/spec-creation-swarm/` | Pre-plan spec/design creation with bounded codebase explorer, architecture, security, separability, and risk/tradeoff lanes |
| discuss-clarify-mental-models | `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/` | Read-only reconvergence for unstable shared mental models before specs, plans, docs, or code: terms, boundaries, assumptions, source-of-truth questions, tradeoffs, branches, and countercase |
| research-swarm | `plugins/shravan-dev-workflow/skills/research-swarm/` | Evidence-gathering workflow for local code/docs, prior art, current web/docs, Reader, memory, and session-log research with bounded lanes and tmp research ledgers |
| manage-agents | `plugins/shravan-dev-workflow/skills/manage-agents/` | Choose and manage advisors, sidekicks, delegates, operators, subagents, and their allowed swarms across Frontier/Balanced/Mini models, native runtimes, ACPX usage, and ACP adapter boundaries |
| orchestrator-goal | `plugins/shravan-dev-workflow/skills/orchestrator-goal/` | Compile clear long-horizon work into Codex/Claude `/goal` contracts, or route unclear goals to discuss-clarify-mental-models |
| docs-maintain | `plugins/shravan-dev-workflow/skills/docs-maintain/` | Maintain durable docs and classify existing specs/plans/debug artifacts for cleanup, archival, or promotion after phase skills create them |
| spec-review-swarm | `plugins/shravan-dev-workflow/skills/spec-review-swarm/` | Post-draft adversarial spec/design review with accepted, contested, and open synthesis |
| spec-handoff | `plugins/shravan-dev-workflow/skills/spec-handoff/` | Portable spec/design context packets before an implementation plan exists |
| plan-creation-swarm | `plugins/shravan-dev-workflow/skills/plan-creation-swarm/` | Create written implementation plans from spec/design context with proof gates and parallel work lanes, without editing code |
| plan-improve-repo | `plugins/shravan-dev-workflow/skills/plan-improve-repo/` | Audit a repository for high-leverage improvements and write self-contained implementation plans for later execution |
| ops-security-review | `plugins/shravan-dev-workflow/skills/ops-security-review/` | Routes authorized security scans to the official Codex Security workflows |
| implementation-review-swarm | `plugins/shravan-dev-workflow/skills/implementation-review-swarm/` | Codex-first implementation review swarm using bounded read-only reviewer lanes, Codex subagents as the default/majority backend, and explicit opt-in Claude/Gemini/agy adversarial lanes |
| implementation-pr-wrapup | `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/` | Finish GitHub PR lifecycle work after implementation: push/open/update, monitor checks/comments, handle existing review threads, prove merge readiness, and merge only when authorized |
| plan-handoff | `plugins/shravan-dev-workflow/skills/plan-handoff/` | Copy-pasteable existing implementation-plan packets for other agents, CLIs, machines, or future sessions |
| implementation-handoff | `plugins/shravan-dev-workflow/skills/implementation-handoff/` | Implementation-state packets for manual reviewers or continuation agents |
| plan-review-swarm | `plugins/shravan-dev-workflow/skills/plan-review-swarm/` | Read-only adversarial plan review with whole-artifact loading, live repo validation, bounded reviewer lanes, and temp review artifacts for substantial reviews |
| implementation-execute-plan | `plugins/shravan-dev-workflow/skills/implementation-execute-plan/` | Validate a written plan against the current repo, then execute with parent-owned subagent coordination and verification |
| ops-observability-stack | `plugins/shravan-dev-workflow/skills/ops-observability-stack/` | Shared local OTel and Victoria stack operations, producer boundaries, resource naming, and debug/beta query loops |
| debug-investigation | `plugins/shravan-dev-workflow/skills/debug-investigation/` | Diagnosis-first debugging with repo-local debug artifacts for clear real debugging work before fixes |
| skills-creation | `plugins/shravan-dev-workflow/skills/skills-creation/` | Create, update, or evaluate one named skill or accepted draft with YAML trigger design, `SKILL.md` mental model and main path, reference depth, steering language, pressure proof, platform validation, source adaptation, and sensitive-resource routing |
| skill-audit | `plugins/shravan-dev-workflow/skills/skill-audit/` | Evidence-backed portfolio audits using current plugin inventory, session patterns, and upstream inspirations |
| tui-presentation | `plugins/shravan-dev-workflow/skills/tui-presentation/` | Structured TUI/chat output for design, architecture, comparisons, flows, and multi-section explanations |
| ops-linear-tracking | `plugins/shravan-dev-workflow/skills/ops-linear-tracking/` | Linear projects, milestones, issues, and dependencies using docs as truth and tickets as tracking |
| peekaboo | `plugins/dev-workflow-tools/skills/peekaboo/` | macOS visual UI testing (common — works in both Claude and Codex) |
| scaffold-project | `plugins/ai-scaffold/skills/scaffold-project/` | Project scaffolding (common) |

Sync rule: when role behavior changes, update the Claude agent AND the matching Codex role TOML / instruction doc in the same changeset.

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

- Treat this section as repo-local guardrails. Use `Skill Work SOP` above and `skills-creation` for named create/update/evaluate work before relying on these bullets.
- When creating, editing, evaluating, or pressure-testing one named skill, load `skills-creation`. Its references adapt Matt-style great-skill vocabulary, pressure-proof lessons from `superpowers:writing-skills`, and platform mechanics from `skill-creator`. For broad portfolio questions, use `skill-audit` instead.
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

Additional standards:
- We use word wrap, you dont have to split lines.

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


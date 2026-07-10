# Agent Registry

Load this when mapping lineage and model requirements to a provider, or when
selecting an existing agent to call through ACPX: built-in friendly names, raw
commands, config-defined agents, or overrides of built-in names.

If the user calls this "custom agent" work but already has an ACP command to
run, keep it here. Do not move existing-command invocation into an overloaded
`custom-agents.md` file.

## Provider Map

Provider, model lineage, and runtime are separate decisions.

| Provider | What it exposes | Native route | ACPX route | Availability caveat |
| --- | --- | --- | --- | --- |
| Codex | OpenAI coding-agent models and reasoning levels. | Native Codex subagents or CLI sessions. | `acpx codex` | Model ids and reasoning variants depend on the current Codex adapter/account. |
| Claude | Anthropic Claude models, including locally advertised custom models. | Claude Code agents or CLI sessions. | `acpx claude` | User settings, session limits, model access, and custom model environment affect the catalog. |
| Cursor | A multi-model catalog, including Cursor models and selected outside lineages. | Cursor agent/Composer surfaces. | `acpx cursor` | Catalog entries and account usage limits can change during a run. Exact advertised ids matter. |

Cursor is not a model lineage. ACPX is not a provider. A Cursor-backed Grok
call and a Cursor Composer call share a provider but not necessarily a lineage
or capability profile.

When independent lineage is required, record both the provider and the actual
model lineage. If quota fallback changes the lineage or drops below the minimum
capability, treat the requested lane as unavailable rather than equivalent.

Completion: the provider can expose the required lineage/model, and any usage
or session limit has an explicit fallback or blocked result.

## Launcher Priority

Use the globally installed binary first:

```text
1. acpx
2. pnpm dlx acpx
3. npx --yes acpx
```

Do not pin routine examples to the version used during documentation research.
Pin only when reproducing a version-specific behavior. The command recorded in
a persistent ledger must remain stable because it participates in ACPX session
scope.

## Built-In Names

Use built-in names when they match the provider you want and the local machine
has the corresponding adapter command available:

```bash
acpx codex exec 'summarize this repo'
acpx claude -s reviewer 'review the changed auth files'
acpx cursor exec 'inspect the current branch'
```

Completion: the selected friendly name is the intended provider, not just the
default.

Troubleshooting source: https://acpx.sh/agents.html

## Raw Commands

Use `--agent` for ad-hoc ACP commands, paths with arguments, or commands that
would be ambiguous as a positional token.

```bash
acpx --agent 'node ./scripts/acp-dev-server.mjs --mode ci' exec \
  'summarize changes'
```

Do not combine `--agent <command>` with a positional agent token in the same
command.

Completion: the command has one agent source: either positional/built-in or
`--agent`, never both.

## Config-Defined Agents

Use config-defined agents for commands you will reuse and want to keep stable
across sessions:

```json
{
  "agents": {
    "ci-bot": {
      "command": "node ./scripts/ci-acp-bridge.mjs",
      "args": ["--profile", "internal"]
    }
  }
}
```

Config-defined names can override built-ins. That is useful for vendored or
repo-local adapters, but it changes what future calls mean.

Completion: config overrides are intentional and visible in the parent summary.

Troubleshooting source: https://acpx.sh/config.html

## Session Scope Impact

The resolved agent command participates in the persistent scope owned by
`session-ledger.md`. Switching command strings creates a different persistent
session even when the friendly intent is "same agent." Use a stable
config-defined name when history should survive binary upgrades.

Completion: persistent advisor and sidekick ledgers record the resolved command
or stable config name.

## CLI Fallback

Use the full CLI reference only when agent-position syntax, `--agent` quoting,
or global-option placement is unclear.

Troubleshooting source: https://acpx.sh/CLI.html

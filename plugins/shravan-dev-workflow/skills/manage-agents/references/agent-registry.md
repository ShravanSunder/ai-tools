# Agent Registry

Load this when selecting an existing agent to call through ACPX: built-in
friendly names, raw commands, unknown positional commands, config-defined
agents, or overrides of built-in names.

If the user calls this "custom agent" work but already has an ACP command to
run, keep it here. Do not move existing-command invocation into an overloaded
`custom-agents.md` file.

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

The resolved agent command is part of the session scope key:

```text
(agentCommand, absoluteCwd, optional session name)
```

Switching command strings creates a different persistent session even when the
friendly intent is "same agent." Use a stable config-defined name when history
should survive binary upgrades.

Completion: persistent sidekick ledgers record the resolved command or stable
config name.

## CLI Fallback

Use the full CLI reference only when agent-position syntax, `--agent` quoting,
or global-option placement is unclear.

Troubleshooting source: https://acpx.sh/CLI.html

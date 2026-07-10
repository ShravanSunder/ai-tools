# Agent Registry

## Providers

| Provider | Native runtime | ACPX runtime | Caveat |
| --- | --- | --- | --- |
| Codex | Native Codex subagent or CLI session | `acpx codex` | Exact models depend on the current adapter/account. |
| Claude | Claude Code agent or CLI session | `acpx claude` | User settings, custom model environment, auth, and session limits affect availability. |
| Cursor | Cursor agent/Composer | `acpx cursor` | Cursor is multi-model; catalog and usage limits can change. |

Provider is not lineage, and ACPX is a runtime. Record the actual model when
lineage independence matters.

Use native only when it exposes the selected model. Otherwise use ACPX for
another provider or lineage, or for a persistent cross-provider session. Verify
the provider-advertised model id; if the required category or lineage is
unavailable, use a declared equivalent fallback or report degraded/blocked.

## Launcher

Use the globally installed binary first:

```text
acpx -> pnpm dlx acpx -> npx --yes acpx
```

Do not pin routine calls to a research version. Persistent work must keep the
resolved command stable because it participates in session identity.

## Agent Resolution

| Shape | Use | Example |
| --- | --- | --- |
| Built-in | Standard Codex, Claude, or Cursor adapter. | `acpx codex exec 'summarize changes'` |
| Raw command | Ad-hoc ACP command or path with arguments. | `acpx --agent 'node ./scripts/acp.mjs --mode ci' exec 'summarize'` |
| Config-defined | Stable reusable command or built-in override. | Define under `agents` in ACPX config, then call its name. |

Use either a positional/built-in name or `--agent`, never both. Config-defined
names may override built-ins; make that override explicit.

For persistent work, pass the resolved command to `session-ledger.md`; that
reference owns identity and scope.

Troubleshooting: https://acpx.sh/agents.html and https://acpx.sh/config.html

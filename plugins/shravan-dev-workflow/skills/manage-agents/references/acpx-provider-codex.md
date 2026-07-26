# ACPX Provider: Codex

Agent token: `codex`. Use this provider when the host is not Codex native, or when you need an ACPX-persistent Codex session across a non-Codex host. Prefer native Codex subagents when you are already on Codex and only need GPT-native models; see `references/native-providers-codex.md`.

## Models

| Model id             |
| -------------------- |
| `gpt-5.6-sol`        |
| `gpt-5.6-luna`       |
| `gpt-5.6-terra`      |

Pass the provider-advertised id with `--model` at session creation or `acpx codex set model <id> -s <name>` afterward. Unknown ids are rejected. Prefer the short form unless the adapter requires an `openai.` prefix.

## Effort

Use `acpx codex set effort <level> -s <name>` when the adapter advertises effort control. Select an advertised level from `references/native-providers-codex.md`. Map the chosen level to the Models table category in `SKILL.md` (Sol low/medium → Balanced; Sol high/xhigh → Frontier; Luna/Terra → Mini).

## Sessions And Identity

```bash
acpx --cwd /absolute/repo --model gpt-5.6-sol --approve-reads --no-terminal \
  --non-interactive-permissions fail codex sessions ensure --name advisor
acpx --cwd /absolute/repo --approve-reads --no-terminal \
  --non-interactive-permissions fail codex -s advisor \
  --file tmp/advisor-packet.md
```

Keep cwd, resolved `codex` command, model id, effort, and permission boundary stable for ledgered relationships. Record the accepted model id in the ledger; exit code 0 alone does not prove the intended model launched.

## Permissions

Use `--approve-reads` for source-grounded Advisor and review work. Keep `--non-interactive-permissions fail` for unattended runs. The parent authorizes write access for non-review assignments.

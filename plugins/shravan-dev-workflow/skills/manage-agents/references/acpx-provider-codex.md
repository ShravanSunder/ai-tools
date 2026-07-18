# ACPX Provider: Codex

Agent token: `codex`. Use this provider when the host is not Codex native, or when you need an ACPX-persistent Codex session across a non-Codex host. Prefer native Codex subagents when you are already on Codex and only need GPT-native models; see `references/native-providers-codex.md`.

## Models

| Lineage | Preferred id | Matrix |
| --- | --- | --- |
| GPT-5.6 Sol | `gpt-5.6-sol` | Frontier / Balanced |
| GPT-5.6 Luna | `gpt-5.6-luna` | Mini |

Pass the provider-advertised id with `--model` at session creation or `acpx codex set model <id> -s <name>` afterward. Unknown ids are rejected. Prefer the short form unless the adapter requires an `openai.` prefix.

## Effort

Use `acpx codex set effort <level> -s <name>` when the adapter advertises effort control. Allowed levels follow `references/native-providers-codex.md`. Map the chosen level to the Models table category in `SKILL.md` (Sol low/medium → Balanced; Sol high/xhigh → Frontier; Luna → Mini). Do not invent a level the adapter does not advertise.

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

Default source-grounded Advisor/review work to `--approve-reads`. Use `--deny-all` only when the packet already contains every needed excerpt (no repo reads). Keep `--non-interactive-permissions fail` for unattended runs. Do not broaden an Advisor or reviewer to `--approve-all` because a read request failed.

# GPT-6 Sol and Luna dispatch

- Marketplace plugin: `shravan-dev-workflow` `2.23.0`.
- Affected: `manage-agents` Codex, Cursor, and ACPX catalogs; Stop-review Luna fallback; skill-pressure subject default.
- New OpenAI assignments use `gpt-6-astra` (Frontier), `gpt-6-sol` (Balanced), and `gpt-6-luna` (Mini). Role effort rows are unchanged.
- GPT-5.6 Sol, Terra, and Luna stay off new-assignment catalogs. An existing session keeps its recorded model. A host that only advertises GPT-5.6 is a reported gap.
- Stop-review’s JEV fallback default is `gpt-6-luna` at low effort and Fast tier.
- Pressure subjects default to `gpt-6-luna`. The semantic judge stays `gpt-5.6-terra` at medium; the pressure-evaluator spec still requires that id, and Terra remains in the API catalog.
- Validation: `pnpm --dir tests/skills run test:unit`. Live Codex/Cursor catalog probes and cache refresh were not run.

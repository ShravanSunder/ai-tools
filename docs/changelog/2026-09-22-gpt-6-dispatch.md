# GPT-6 dispatch

- Marketplace plugin: `shravan-dev-workflow` `2.44.0`.
- Affected: `manage-agents` role tables and provider ids; Stop-review Luna fallback; skill-pressure subject default.
- New OpenAI ids: `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`. `SKILL.md` lineage names stay Fable, Opus, and Grok, with no version numbers.
- Mini is procedures, repeatable work, and guided execution.
- Operator: Luna medium. Worker Sol is low. Sidekick Sol and Opus low are complete direction; medium is partial direction. Tasks start on Luna high or xhigh. Review Sol medium, Opus medium, and Grok high are a contract check. Advisor Opus is high.
- Cursor ACP examples: Grok 4.7, Opus 5.5, and Grok 4.5 or 4.6 on request.
- Stop-review JEV fallback and pressure subjects default to `gpt-6-luna`. Pressure subject effort is medium. The pressure judge is `gpt-6-luna` at xhigh.
- Validation: pressure config and judge tests, 21 passed. Full `test:unit` was 122 passed earlier on this branch. Live evals and cache refresh were not run.

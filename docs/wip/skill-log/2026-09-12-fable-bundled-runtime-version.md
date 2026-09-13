# Fable selection passed but bundled runtime was too old

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: manage-agents 2.11.0, ACPX Claude provider
- Task context: explicitly authorized final read-only Fable5.1 review.
- Expected behavior: selecting advertised claude-fable-5-1 starts that model with access to supplied skill/source files.
- Observed behavior: model selection succeeded, but first prompt returned API400: bundled Claude Code2.1.215 unsupported; minimum2.1.251. Locally installed CLI was2.1.270. No review ran on failed prompt.
- Evidence: agent-studio.repo-bugs/tmp/lifecycle-native-final-review/fable-final-output.jsonl and fable-final-ledger.md. Adapter source supports CLAUDE_CODE_EXECUTABLE at dist/acp-agent.js:3976.
- Recurrence: one version-rejection occurrence established here; earlier review launch failures had different causes.
- Impact: review delayed despite correct model/consent; model catalog alone did not prove executable compatibility.
- Suspected cause: ACP adapter selected its bundled SDK executable independently of installed CLI.
- Follow-up: same session resumed successfully through installed2.1.270 using supported executable override; read calls completed. General skill change not authorized by this entry. Also inspect advertised config IDs: effort is the key; thought_level is only its category.

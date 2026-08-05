# Claude Goal Notes

Use this reference when preparing a Claude `/goal` prompt or copy-paste handoff.

## Semantics

Claude goal evaluation is transcript-oriented. Phrase the goal so completion evidence is visible in the conversation:

- commands run
- exit codes
- files changed
- PR or review state
- artifacts written
- blockers and proof

Do not rely on hidden filesystem state or "I inspected it" claims without visible evidence.

## Suggested Claude Goal Prompt

```text
/goal Finish <objective>. Before claiming completion, report visible proof:
<commands and exit codes>, <files/artifacts>, <review or PR state>. Stay within
<scope>. Do not modify <non-goals>. If <blocked condition> occurs, report the
blocker with evidence instead of broadening scope.
```

## Harness Rule

When Claude is invoked from this workflow, use the Claude Code CLI harness (`claude --print` or `claude -p`) or produce a manual copy-paste prompt. Do not route through Anthropic API calls for this plugin workflow.

## Goal Wording

Prefer:

```text
Complete when the transcript includes the validation commands, exit codes, final
diff summary, and cache/plugin visibility check.
```

Avoid:

```text
Complete when everything is good.
```

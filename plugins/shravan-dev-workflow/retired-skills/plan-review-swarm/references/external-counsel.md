# Plan Review Swarm External Model Lanes

External model lanes are opt-in for `plan-review-swarm`. They challenge the plan from another model family or CLI harness and return candidate findings only.

## Agy / Gemini

Use when the user asks to include Gemini, `agy`, or an outside model lane for the plan review.

Before invoking:

```shell
command -v agy
agy --version
agy models
```

Prompt addition:

```text
You are an external adversarial plan reviewer for a parent-agent-led plan-review-swarm swarm.
Review only. Do not edit files. Challenge assumptions, contradictions,
missing cutovers, under-specified tasks, validation gaps, and hidden
security/reliability failure modes. Return findings only.

For each finding include severity, plan evidence, repo evidence if applicable,
failure scenario, smallest plan edit, proof/test, and confidence.
If no high-confidence findings, say "No findings."
```

Prefer writing the shared packet to a temp prompt file and asking `agy` to write its final response to an output file when the CLI supports it.

Record skipped or failed `agy` lanes in swarm coverage and continue with available reviewer lanes.

## Claude

Claude is opt-in. Use only when the user explicitly asks to include Claude or asks for a Claude adversarial plan-review-swarm lane.

Use the Claude Code CLI harness only:

```shell
prompt_file="$(mktemp /tmp/shravan-dev-workflow-claude-plan-review.XXXXXX)"
# Write the shared plan review packet plus the prompt addition into $prompt_file.

claude --print \
  --model opus \
  --effort xhigh \
  --no-session-persistence \
  --permission-mode plan \
  --disallowedTools "Edit Write NotebookEdit Bash" \
  --output-format json \
  --append-system-prompt "You are an external adversarial plan reviewer for a parent-agent-led plan-review-swarm swarm. Read-only. Findings only. Do not edit files." \
  < "$prompt_file"
```

Do not use Anthropic API calls, SDK calls, or programmatic tool-calling APIs from this skill. Do not pass the full plan-review packet through command substitution; keep packet text out of process argv and shell history.

Record the actual model and any skipped/failed Claude lane in swarm coverage.

## Oracle

Oracle is excluded. Do not invoke, recommend, or route plan review to Oracle from this skill.

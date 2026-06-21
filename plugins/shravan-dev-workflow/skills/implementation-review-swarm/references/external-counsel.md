# External Model Lanes

External model lanes give the reducer a different model family or tool runtime. They are never the source of truth. Most external model lanes should be adversarial: challenge assumptions, hidden failure modes, and weak boundaries instead of repeating the default review.

## Agy / Gemini

Use `agy` only when the user explicitly asks to include Gemini/agy or outside
adversarial counsel. Prefer the latest Gemini Pro/High model exposed by
`agy models`; record the actual model selected in swarm coverage.

Before invoking:

```shell
command -v agy
agy --version
agy models
```

Recommended prompt additions:

```text
You are an external adversarial reviewer for a parent-agent-led review swarm.
Do not edit files. Treat this as read-only review.
Challenge the implementation, trust boundaries, tests, and assumptions.
Write your complete answer to the requested output file if one is provided.
Return findings only, with severity, evidence, scenario, smallest fix, proof,
and confidence. If no findings, say "No findings."
```

When the CLI supports stdin, pipe the prompt file into the process so the full
review packet does not appear in process argv. Prefer an output file so stdout
truncation or formatting bugs do not lose the review:

```shell
prompt_file="$(mktemp /tmp/shravan-dev-workflow-agy-prompt.XXXXXX)"
output_file="$(mktemp /tmp/shravan-dev-workflow-agy-output.XXXXXX)"

# Write the shared review packet plus the prompt additions into $prompt_file.
# In the prompt, instruct agy to write its final answer to $output_file.
agy --print < "$prompt_file"
cat "$output_file"
```

If a specific model is selected from `agy models`, pass it without embedding the
review packet in argv, for example `agy --model "$selected_model" --print <
"$prompt_file"`. If no Gemini Pro/High model is available, run `agy` without a
model override and record the actual model source in swarm coverage. If `agy` is
missing, unauthenticated, noninteractive, or times out, record that as a skipped
or failed external model lane and continue with available reviewer lanes.

## Claude

Claude is opt-in. Invoke it only when the user explicitly asks to include Claude in the swarm or asks for a Claude adversarial lane. Use only the Claude Code CLI harness (`claude --print` / `claude -p`), not Anthropic API calls, SDK calls, or programmatic tool-calling APIs.

Production default:

```shell
git diff <base>...<head> | claude --print \
  --model opus \
  --effort xhigh \
  --no-session-persistence \
  --permission-mode plan \
  --disallowedTools "Edit Write NotebookEdit Bash" \
  --output-format json \
  --append-system-prompt "You are an external adversarial reviewer for a parent-agent-led review swarm. Read-only. Findings only. Do not edit files." \
  "Review the piped diff. Return at most 5 concrete findings with severity, evidence, scenario, smallest fix, proof, and confidence. If no high-confidence findings, say No findings."
```

Cheap smoke-test default:

```shell
printf '%s\n' "Return exactly: CLAUDE_HAIKU_HARNESS_OK" | claude --print \
  --model haiku \
  --no-session-persistence \
  --permission-mode plan \
  --output-format json
```

Inspect `modelUsage` in the JSON result. Claude Code aliases can resolve to a
different available model than the requested shorthand; record the actual model
in swarm coverage when Claude is used.

Use the same shared packet and the same findings-only contract. Prefer piping the diff or review packet through stdin so Claude does not need filesystem tools. Do not use Claude as an implementation agent from this skill.

## Gemini

Gemini is opt-in as an adversarial lane. If the user explicitly asks for Gemini, label it as a user-requested Gemini/agy adversarial lane and include the actual `agy` model in coverage.

Use the same shared packet and the same findings-only contract.

## External Adversarial Prompt

Use this addition for any user-requested outside adversarial lane:

```text
Adversarial mode:
Find contradictions, hidden assumptions, and failure modes the main reviewers
may miss. Prefer issues where a specific file, symbol, config key, command, or
test proves the concern. Avoid generic "could be risky" commentary.

For each finding, include:
- what assumption is being challenged
- why the current artifact fails or is under-specified
- how the failure would show up
- the smallest fix or design adjustment
- the proof that would settle it
```

## Oracle

Oracle is excluded from this workflow. Do not invoke Oracle, recommend Oracle, or include Oracle as a fallback.

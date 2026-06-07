# External Counsel

External counsel gives the reducer a different model family or tool runtime. It is never the source of truth. Most external counsel should be adversarial: challenge assumptions, hidden failure modes, and weak boundaries instead of repeating the default review.

## Agy

Include one `agy` pass for substantial reviews when available, unless the user asks to skip external counsel.

Before invoking:

```shell
command -v agy
agy --version
```

Recommended prompt additions:

```text
You are an external adversarial counsel reviewer for a Codex-led review swarm.
Do not edit files. Treat this as read-only review.
Challenge the implementation, trust boundaries, tests, and assumptions.
Write your complete answer to the requested output file if one is provided.
Return findings only, with severity, evidence, scenario, smallest fix, proof,
and confidence. If no findings, say "No findings."
```

When the CLI supports print mode, prefer a temp prompt file and an output file so stdout truncation or formatting bugs do not lose the review:

```shell
prompt_file="$(mktemp /tmp/subagent-swarm-agy-prompt.XXXXXX)"
output_file="$(mktemp /tmp/subagent-swarm-agy-output.XXXXXX)"

# Write the shared review packet plus the prompt additions into $prompt_file.
# In the prompt, instruct agy to write its final answer to $output_file.
agy --print "$(cat "$prompt_file")"
cat "$output_file"
```

If `agy` is missing, unauthenticated, noninteractive, or times out, record that as skipped or failed counsel and continue with Codex subagents.

## Claude

Claude is opt-in. Invoke it only when the user explicitly asks to include Claude in the swarm or asks for a Claude adversarial lane. Tell the user if the available CLI may incur separate billing before running a programmatic Claude call.

Use the same shared packet and the same findings-only contract. Do not use Claude as an implementation agent from this skill.

## Gemini

Gemini is opt-in. Invoke it only when the user explicitly asks to include Gemini in the swarm or asks for a Gemini adversarial lane. If the local environment has moved Gemini review behind `agy`, use `agy` and label the counsel source accurately in the coverage report.

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

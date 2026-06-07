---
name: subagent-review
description: Use when requesting a multi-agent code review, review swarm, adversarial review, PR or diff review, or review synthesis across Codex subagents and optional external counsel before merge.
---

# Subagent Review

Use this skill to run a review swarm where Codex remains the orchestrator and reducer. The swarm is review-only: subagents and external counsel inspect, report, and challenge; the parent session decides what is real.

## Operating Model

- Default reviewers are Codex subagents.
- Include one `agy` counsel pass for substantial reviews when available, preferring the latest Gemini Pro/High model exposed by `agy models`, unless the user asks to skip external counsel.
- Include Claude or additional `agy` adversarial counsel only when the user explicitly asks for them. Claude must use the Claude Code CLI harness, not Anthropic API calls.
- Never include Oracle in this workflow.
- Treat all reviewer output as raw input. Verify findings against the repository before presenting them as accepted.

## Scope

Before dispatching reviewers, identify exactly what is being reviewed:

- Current uncommitted diff, staged diff, branch against base, commit range, PR, plan, or named files.
- The user request and intended behavior.
- Local instructions that apply to the repo.
- Review focus, such as security, reliability, tests, contracts, architecture, or adversarial design.

If the scope is ambiguous and cannot be inferred safely from git state or the prompt, ask one concise question before spawning reviewers.

## Shared Review Packet

Give every reviewer the same packet:

```text
Review scope:
<diff command, PR number, commit range, plan path, or file list>

Intent:
<what the change is supposed to accomplish>

Constraints:
<repo instructions, product constraints, compatibility rules, user preferences>

Focus:
<requested focus areas, or "full review">

Output contract:
Return findings only. Do not edit files. For each finding include severity,
evidence, failure scenario, smallest fix, proof/test, and confidence.
```

## Codex Subagent Lanes

Dispatch independent read-only Codex subagents in parallel when the tool surface supports it. Prefer the `reviewer` role when available. Use the prompts in `references/reviewer-prompts.md`.

Default lanes:

- Intent and regression reviewer
- Security and trust-boundary reviewer
- Reliability and performance reviewer
- Contracts and tests reviewer
- Adversarial design reviewer

For small changes, run fewer lanes but keep at least one normal reviewer and one adversarial reviewer.

## Cross-Model Adversarial Lanes

The default adversarial reviewer is a Codex subagent. When the user asks for a specific outside model, add that model as an adversarial counsel lane:

- "include Gemini" means add a Gemini-flavored adversarial counsel pass through `agy`, preferring the latest Gemini Pro/High model available from `agy models`.
- "include Claude" means add Claude as an adversarial counsel pass through the Claude Code CLI harness if the user explicitly requested it and accepts any separate CLI cost.
- "include agy" means add an additional `agy` adversarial counsel pass even for smaller reviews.

External adversarial counsel still follows the same rule: it produces candidate findings only. The reducer verifies before accepting anything.

## External Counsel

Use `references/external-counsel.md` for command shapes and safety rules.

- `agy`: include by default for substantial reviews when available; prefer Gemini Pro/High; record skipped or failed counsel explicitly.
- Claude: include only when the user explicitly asks for Claude, often as an adversarial lane; use only the Claude Code CLI harness.
- Gemini: include only when the user explicitly asks for Gemini, often as an adversarial lane; use `agy` as the local Gemini/Antigravity path.
- Oracle: do not invoke, suggest, or route to Oracle from this skill.

External counsel should receive the same packet and be told to write findings to an output file when the CLI supports it. Do not treat a failed external CLI as a failed review; continue with Codex subagents and report the missing input.

## Reduction

After reviewers return:

1. Read every output.
2. Verify each candidate against code, tests, diff, or cited plan text.
3. Deduplicate by root cause, not by file.
4. Drop speculative findings that lack a concrete failure path.
5. Preserve meaningful disagreement as an open question only when it changes the decision.
6. Rank accepted findings as blocker, important, follow-up, or nit.

Accepted findings must include:

- Severity
- File and line or exact symbol/path evidence
- Failure or exploit scenario
- Smallest useful fix
- Test or proof that would catch it
- Confidence
- Which reviewers raised it

## Report Shape

Start with findings, ordered by severity. If no findings survive verification, say that clearly and list any skipped reviewers or test gaps.

Use this compact structure:

```text
Findings
1. [severity] title
   Evidence: file:line or symbol
   Scenario: concrete failure path
   Fix: smallest useful change
   Proof: test or command
   Sources: reviewer lanes or counsel tools

Open questions
<only decision-relevant questions>

Swarm coverage
<reviewed scope, lanes run, external counsel status, skipped inputs>
```

## Common Mistakes

- Do not paste raw subagent transcripts as the review.
- Do not accept findings just because multiple agents agreed.
- Do not hide skipped external counsel.
- Do not run Claude or Gemini unless the user asked.
- Do not let review turn into implementation unless the user explicitly switches scope.

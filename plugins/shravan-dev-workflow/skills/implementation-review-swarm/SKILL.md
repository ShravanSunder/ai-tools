---
name: implementation-review-swarm
description: Use when requesting a multi-agent implementation review, code review swarm, adversarial review, PR or diff review, or review synthesis across bounded reviewer lanes, Codex subagents, and optional external model lanes before merge.
---

# Implementation Review Swarm

Use this skill to run a review swarm where the parent session remains the orchestrator and reducer. The swarm is review-only: subagents and external model lanes inspect, report, and challenge; the parent session decides what is real.

Core pipeline:

```text
review packet
  -> spec compliance reviewer
  -> bounded reviewer lanes
  -> optional external model lanes
  -> reducer verification
  -> receive findings
  -> address accepted implementation issues when in-scope
  -> verdict, findings, fixes, and coverage
```

## Operating Model

- Default reviewers are Codex subagents because current sessions mostly run in Codex.
- The lane contract is not Codex-only: another agent system may back a bounded read-only lane when the user requests it, when the harness is already available, or when that backend is the point of the review.
- Include one `agy` external model lane for substantial reviews when available, preferring the latest Gemini Pro/High model exposed by `agy models`, unless the user asks to skip it.
- Include Claude or additional `agy` adversarial lanes only when the user explicitly asks for them. Claude must use the Claude Code CLI harness, not Anthropic API calls.
- Never include Oracle in this workflow.
- Treat all reviewer output as raw input. Verify findings against the repository before presenting them as accepted.
- After review, receive findings rigorously: read, understand, verify against codebase reality, evaluate, then address accepted findings.
- When reviewing current-session implementation work, fix accepted blocker and important findings by default unless the user explicitly asked for report-only review.
- Do not blindly implement reviewer suggestions. Reject unsupported, technically wrong, out-of-scope, or YAGNI findings with evidence.
- If feedback is unclear, conflicts with user decisions, or expands scope, ask before editing.
- Keep the swarm shallow: direct child reviewer agents only. Do not ask reviewer agents to spawn deeper review swarms.
- Keep orchestration skill-native. Scripts and schemas can support shape and validation, but the parent session owns dispatch and reduction.

## Review Modes

Pick one mode before dispatch:

- `implementation`: completed local work against a request, plan, or task.
- `diff`: uncommitted, staged, or branch diff without a separate plan.
- `pr`: pull request review.
- `commit`: one commit or commit range.
- `plan`: review a design, implementation plan, spec, or prompt before code.
- `files`: named files or directories.
- `adversarial`: challenge a design or implementation decision.

For implementation reviews, run spec compliance before broader quality lanes. For broad PR or diff reviews, lanes can run in parallel, but intent/spec findings take priority in reduction.

## Scope

Before dispatching reviewers, identify exactly what is being reviewed:

- Current uncommitted diff, staged diff, branch against base, commit range, PR, plan, or named files.
- The user request and intended behavior.
- Local instructions that apply to the repo.
- Review focus, such as security, reliability, tests, contracts, architecture, or adversarial design.

If the scope is ambiguous and cannot be inferred safely from git state or the prompt, ask one concise question before spawning reviewers.

## Shared Review Packet

Give every reviewer the same curated packet. Do not pass the parent session transcript as a substitute for this packet.

```text
Mode:
<implementation | diff | pr | commit | plan | files | adversarial>

Review scope:
<diff command, PR number, commit range, plan path, or file list>

Git range:
base_sha: <sha or "not applicable">
head_sha: <sha or "working tree">
diff_stat_command: <command or "not applicable">
diff_command: <command or "not applicable">
changed_files: <paths or "not applicable">

Intent:
<what the change is supposed to accomplish>

Constraints:
<repo instructions, product constraints, compatibility rules, user preferences>

Threat model / security context:
<changed attack surface, sensitive data, privileged actions, trust boundaries,
security validation already run, proof gaps, or "not security-sensitive">

Focus:
<requested focus areas, or "full review">

Output contract:
Return findings only. Do not edit files. For each finding include severity,
evidence, failure scenario, smallest fix, proof/test, and confidence.
```

Reviewers must not trust implementation summaries, previous agent reports, test claims, or other reviewer outputs. They must read the actual artifacts in scope.

## Pipeline

1. Scope builder
   - Determine mode, base/head, changed files, relevant instructions, and user intent.
   - Prefer explicit user scope. Otherwise infer from git state and current request.
   - If base/head cannot be inferred safely, ask one concise question before dispatch.

2. Spec compliance gate
   - For implementation and plan-backed reviews, dispatch a spec compliance reviewer first or mark why it was skipped.
   - The reviewer checks that the actual artifact matches the request: nothing missing, nothing extra, no misread requirement.
   - If this lane finds blocker/important intent failures, still run security/adversarial lanes when risk warrants it, but make the final verdict `not_ready` unless the reducer rejects the finding.

3. Reviewer swarm
   - Dispatch independent read-only reviewer lanes.
   - For small changes, run `spec_compliance` plus one general/adversarial lane.
   - For substantial changes, run all default lanes.
   - For any sensitive-surface change, run the security and trust-boundary lane even when the change is small.

4. External model lanes
   - Add `agy` for substantial reviews when available, unless skipped by user or environment.
   - Add Claude or extra Gemini/agy only when explicitly requested.
   - External model lanes are advisory and must be recorded in coverage.

5. Reducer verification
   - Verify every candidate against code, diff, tests, or cited plan text.
   - Reject claims that cannot be proven from current artifacts.
   - Deduplicate by root cause.

6. Review reception and fix loop
   - Read all accepted and disputed findings before editing.
   - For each accepted blocker/important finding, make one focused fix at a time when the current workflow owns implementation.
   - Run the smallest relevant proof after each fix or batch of tightly related fixes.
   - For PR review comments or review threads, resolve threads only after validating that they are stale or after fixing the real issue they identified.
   - Re-run focused review or verification when a finding was subtle or high risk.
   - If the user asked for review-only, return findings and exact fix guidance instead of editing.

7. Verdict
   - `ready`: no accepted blocker/important findings and no decision-relevant open questions.
   - `ready_with_fixes`: accepted issues exist but are bounded and non-blocking.
   - `not_ready`: accepted blocker/important findings, failed spec compliance, or unresolved decision-critical scope.

## Reviewer Lanes

Dispatch independent read-only reviewer lanes in parallel when the tool surface supports it. Prefer Codex `reviewer` subagents for most lanes when available. Use the prompts in `references/reviewer-prompts.md`.

Backend rules:

- Codex subagents are the default and should handle the majority of lanes.
- Claude, `agy`/Gemini, or another available reviewer can back a lane only when requested, explicitly selected, or already required by this skill.
- Claude lanes must use the Claude Code CLI harness, not Anthropic API or SDK calls.
- Gemini lanes use `agy` as the local Gemini/Antigravity path.
- Every lane remains read-only and advisory, regardless of backend.

Default lanes:

- Spec compliance reviewer
- Code quality reviewer
- Intent and regression reviewer
- Security and trust-boundary reviewer
- Reliability and performance reviewer
- Contracts and tests reviewer
- Adversarial design reviewer

For small changes, run fewer lanes but keep at least one normal reviewer and one adversarial reviewer.

## Cross-Model Adversarial Lanes

The default adversarial reviewer is a Codex subagent. When the user asks for a specific outside model, add that model as an adversarial model lane:

- "include Gemini" means add a Gemini-flavored adversarial lane through `agy`, preferring the latest Gemini Pro/High model available from `agy models`.
- "include Claude" means add Claude as an adversarial lane through the Claude Code CLI harness if the user explicitly requested it and accepts any separate CLI cost.
- "include agy" means add an additional `agy` adversarial lane even for smaller reviews.

External adversarial lanes still follow the same rule: they produce candidate findings only. The reducer verifies before accepting anything.

## External Model Lanes

Use `references/external-counsel.md` for command shapes and safety rules.

- `agy`: include by default for substantial reviews when available; prefer Gemini Pro/High; record skipped or failed lanes explicitly.
- Claude: include only when the user explicitly asks for Claude, often as an adversarial lane; use only the Claude Code CLI harness.
- Gemini: include only when the user explicitly asks for Gemini, often as an adversarial lane; use `agy` as the local Gemini/Antigravity path.
- Oracle: do not invoke, suggest, or route to Oracle from this skill.

External model lanes should receive the same packet and be told to write findings to an output file when the CLI supports it. Do not treat a failed external CLI as a failed review; continue with available reviewer lanes and report the missing input.

## Reduction

After reviewers return:

1. Read every output.
2. Verify each candidate against code, tests, diff, or cited plan text.
3. Deduplicate by root cause, not by file.
4. Drop speculative findings that lack a concrete failure path.
5. Preserve meaningful disagreement as an open question only when it changes the decision.
6. Rank accepted findings as blocker, important, follow-up, or nit.
7. Record rejected or unverified candidate counts when useful for explaining the verdict.

Accepted findings must include:

- Severity
- File and line or exact symbol/path evidence
- Failure or exploit scenario
- Smallest useful fix
- Test or proof that would catch it
- Confidence
- Which reviewers raised it
- For security findings: validation status as `validated`, `unvalidated with proof gap`, or `rejected`

Rejected findings should not be listed by default. Mention them only when a rejected high-severity claim might otherwise confuse the user.

## Addressing Accepted Findings

Implementation review includes review reception when the parent agent owns the implementation.

Default behavior:

- If invoked as part of finishing current implementation work, validate and fix accepted blocker/important findings without waiting for a separate user prompt.
- If invoked for PR/report-only review, external review, or when the user says not to edit, keep the review read-only and return exact fix guidance.

Fix loop:

1. Understand the finding in your own technical terms.
2. Verify it against current code, diff, tests, and user intent.
3. Decide: accept, reject, defer, or clarify.
4. Fix accepted in-scope findings one at a time or in a tightly related batch.
5. Test each fix with the smallest meaningful proof, then broader relevant checks.
6. Inspect the final diff and ensure no unrelated cleanup slipped in.
7. For PR/review-thread workflows, close or reply to validated review threads when that is part of readiness.
8. Report accepted, rejected, deferred, and unresolved findings.

Stop and ask before editing when:

- the finding changes product/design scope
- the finding conflicts with prior user decisions
- the required fix touches unrelated infrastructure or validation tooling
- the finding is plausible but cannot be verified from available evidence

PR thread rule:

- Do not assume pushed code closes review threads.
- Inspect thread state when PR readiness depends on it.
- Resolve stale or misleading threads only after verifying them against current code/tests.
- Resolve valid threads only after the fix lands and the relevant proof passes.
- Leave unresolved threads open when the finding needs a user decision or cannot be verified.

## Report Shape

Start with verdict and findings, ordered by severity. If no findings survive verification, say that clearly and list any skipped reviewers or test gaps.

Use this compact structure:

```text
Verdict
<ready | ready_with_fixes | not_ready>
Reason: <one or two concrete reasons>

Findings
1. [severity] title
   Evidence: file:line or symbol
   Scenario: concrete failure path
   Fix: smallest useful change
   Proof: test or command
   Sources: reviewer lanes and model backends

Open questions
<only decision-relevant questions>

Swarm coverage
<reviewed scope, lanes run, lanes skipped, backend used for each lane, external model lane status, verification notes>

Fix follow-through
<accepted findings fixed, rejected/deferred findings, PR threads resolved or left open, commands run, remaining blockers>
```

## Common Mistakes

- Do not paste raw subagent transcripts as the review.
- Do not accept findings just because multiple agents agreed.
- Do not hide skipped external model lanes.
- Do not run Claude or Gemini unless the user asked.
- Do not leave accepted current-session implementation blockers unfixed unless the user asked for report-only review or the fix needs a decision.
- Do not let external model lane failure fail the whole review.
- Do not let a sidecar reviewer become the critical path when the parent can continue reducing available evidence.

---
name: implementation-review-swarm
description: Use when requesting a multi-agent review of implementation code, branch diffs, PRs, commits, or named files across bounded reviewer lanes before merge or handoff.
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
  -> route accepted implementation issues
  -> verdict, findings, proof gaps, and coverage
```

## Operating Model

- Default reviewers are Codex subagents because current sessions mostly run in Codex.
- The lane contract is not Codex-only: another agent system may back a bounded read-only lane when the user requests it, when the harness is already available, or when that backend is the point of the review.
- Include Claude, Gemini, `agy`, or another external adversarial lane only when the user explicitly asks for that outside counsel. Claude must use the Claude Code CLI harness, not Anthropic API calls.
- Never include Oracle in this workflow.
- Treat all reviewer output as raw input. Verify findings against the repository before presenting them as accepted.
- After review, receive findings rigorously: read, understand, verify against
  codebase reality, evaluate, then route accepted findings to the owning
  workflow.
- Accepted blocker and important implementation findings normally route back to
  `implementation-execute-plan`. Only make tiny same-session review-fix edits
  when they are explicitly scoped, remain inside the current implementation
  scope, and carry the same proof discipline.
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
- `files`: named files or directories.
- `adversarial`: challenge an implementation decision in code, diff, PR, commit, or named files.

Route design, spec, implementation-plan, prompt, or handoff text to `spec-review-swarm` or `plan-review-swarm` instead of this skill unless those artifacts are only context for reviewing code.

For implementation reviews, run spec compliance before broader quality lanes. For broad PR or diff reviews, lanes can run in parallel, but intent/spec findings take priority in reduction.

## Scope

Before dispatching reviewers, identify exactly what is being reviewed:

- Current uncommitted diff, staged diff, branch against base, commit range, PR, or named files.
- The user request and intended behavior.
- Local instructions that apply to the repo.
- Review focus, such as security, reliability, tests, contracts, architecture, or adversarial design.
- Implementation proof: requirements or plan items claimed complete, proof
  gates claimed, commands and exit codes, red/green evidence for behavior
  changes or explicit exception, proof layers not run, and stated blockers.

If the scope is ambiguous and cannot be inferred safely from git state or the prompt, ask one concise question before spawning reviewers.

## Shared Review Packet

Give every reviewer the same curated packet. Do not pass the parent session transcript as a substitute for this packet. Use `references/reviewer-prompts.md` for the packet template and lane prompts.

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

3. Implementation proof gate
   - Collect the claimed implementation proof into the shared packet and check
     that it maps back to requirements, spec, or plan.
   - If an `implementation-handoff` packet exists, use its Implementation
     proof section as the claim inventory, then verify each claim against
     diffs, tests, command output, and artifacts.
   - The Implementation proof reviewer lane plus reducer acceptance produce
     the review proof: the verified judgment that implementation proof was
     checked, mapped, and not weakened. Record it in the report.
   - Treat missing required proof, relabeled proof layers, unverified
     red/green evidence, or weakened proof lanes as `not_ready` unless an
     exception recorded with explicit user approval is documented; an
     agent-authored waiver is not an exception.

4. Reviewer swarm
   - Dispatch independent read-only reviewer lanes.
   - For small changes, run `spec_compliance` plus one general/adversarial lane.
   - For substantial changes, run all default lanes.
   - For any sensitive-surface change, run the security and trust-boundary lane even when the change is small.

5. External model lanes
   - Add Claude, Gemini, `agy`, or another outside model lane only when explicitly requested.
   - External model lanes are advisory and must be recorded in coverage.

6. Reducer verification
   - Verify every candidate against code, diff, tests, or cited plan text.
   - Reject claims that cannot be proven from current artifacts.
   - Deduplicate by root cause.

7. Review reception and routing
   - Load `../../references/review-reception.md` to receive accepted findings,
     decide what this workflow owns, and handle feedback produced or validated
     by this review.
   - Route accepted blocker/important implementation findings to
     `implementation-execute-plan` unless a tiny same-session review-fix is
     explicitly scoped.
   - Pure follow-through on existing GitHub PR comments or review threads
     belongs to `implementation-pr-wrapup`.

8. Verdict
   - `ready`: no accepted blocker/important findings and no decision-relevant open questions.
   - `ready_with_fixes`: accepted issues exist but are bounded and non-blocking.
   - `not_ready`: accepted blocker/important findings, failed spec compliance,
     missing required implementation proof, proof that does not map back to
     requirements/spec/plan, missing red/green evidence for behavior changes
     without an approved exception, tests/proof lanes weakened without explicit
     approval, or unresolved decision-critical scope.

## Reviewer Lanes

Dispatch independent read-only reviewer lanes in parallel when the tool surface supports it. Prefer Codex `reviewer` subagents for most lanes when available. Use the prompts in `references/reviewer-prompts.md`.

Backend rules:

- Codex subagents are the default and should handle the majority of lanes.
- Claude, `agy`/Gemini, or another available reviewer can back a lane only when requested or explicitly selected.
- Claude lanes must use the Claude Code CLI harness, not Anthropic API or SDK calls.
- Gemini lanes use `agy` as the local Gemini/Antigravity path.
- Every lane remains read-only and advisory, regardless of backend.

Default lanes:

- Spec compliance reviewer
- Implementation proof reviewer
- Code quality reviewer
- Intent and regression reviewer
- Security and trust-boundary reviewer
- Reliability and performance reviewer
- Contracts and tests reviewer
- Adversarial design reviewer

For small changes, run fewer lanes but keep at least one normal reviewer and one adversarial reviewer.

## External Model Lanes

Use `references/external-counsel.md` for command shapes, model routing, and safety rules. External lanes receive the same packet, produce candidate findings only, and never decide the verdict. Do not treat a failed external CLI as a failed review; continue with available reviewer lanes and report the missing input.

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

Implementation review includes review reception when the parent agent owns the
implementation. Load `../../references/review-reception.md` before routing
accepted findings, making a tiny explicitly scoped same-session review-fix,
replying to review findings produced by this review, or closing threads for
accepted findings from this review. Existing PR comment/thread follow-through
belongs to `implementation-pr-wrapup`.

## Progressive Disclosure

- Load `references/reviewer-prompts.md` before dispatching reviewers or writing a copy-paste review prompt.
- Load `references/external-counsel.md` when user-requested Claude, Gemini, `agy`, or another outside model lane is included.
- Load `../../references/review-reception.md` before addressing accepted
  findings from this review. Use the route-back rule unless a tiny
  same-session review-fix is explicitly scoped.

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

Review proof
<implementation proof checked and mapped to requirements/spec/plan, weakened
or relabeled proof lanes found or "none", red/green evidence status, exceptions
and their approval source>

Swarm coverage
<reviewed scope, lanes run, lanes skipped, backend used for each lane, external model lane status, verification notes>

Routing follow-through
<accepted findings routed to implementation-execute-plan, tiny explicitly
scoped same-session fixes if any, rejected/deferred findings, PR threads
resolved or left open, commands run, remaining blockers>

Artifact links
<full clickable artifact links (absolute path + line) for reports, handoffs, or
other files the human is expected to open>
```

## Common Mistakes

- Do not paste raw subagent transcripts as the review.
- Do not accept findings just because multiple agents agreed.
- Do not hide skipped external model lanes.
- Do not run Claude or Gemini unless the user asked.
- Do not run `agy` unless the user asked for Gemini/agy or outside adversarial counsel.
- Do not bypass `implementation-execute-plan` for accepted blocker/important
  findings unless a tiny same-session review-fix is explicitly scoped.
- Do not let external model lane failure fail the whole review.
- Do not let a sidecar reviewer become the critical path when the parent can continue reducing available evidence.

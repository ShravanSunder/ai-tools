---
name: spec-design-swarm
description: Use when shaping a new spec, design, or architecture before an implementation plan exists, especially when the user asks to use subagents to research, brainstorm, compare approaches, pressure-test assumptions, or create a design direction.
---

# Spec Design Swarm

Use this skill to form a design before writing an implementation plan. The parent session owns the mental model, synthesis, and recommendation. Subagents provide bounded research, exploration, and architectural pressure, not final decisions.

Core pipeline:

```text
fuzzy goal or design question
  -> intent and current-state scan
  -> bounded research/explorer lanes
  -> competing architecture lanes
  -> decision discussion for unresolved branches
  -> parent synthesis
  -> design direction, non-goals, open questions
  -> optional handoff to plan-review-swarm or plan-handoff
```

## Core Rules

- Do not implement code from this skill.
- Read current code, docs, prior specs, and logs before designing.
- Use subagents for parallelizable research or codebase exploration when the question is broad enough to benefit from independent lanes.
- Give every subagent a bounded packet. Do not ask subagents to "understand the whole repo" unless the user explicitly asks for a broad audit.
- The parent must read key files returned by explorer lanes before recommending a design.
- Ask the user only for material decisions that cannot be answered from code, docs, or repo evidence.
- When asking a design question, include the current guess or recommended answer and why.
- Produce explicit tradeoffs, not a single happy path.
- Record security context when the design touches auth, secrets, parsing, filesystem, network, subprocesses, plugins, MCP, CI, package scripts, agents, or external services.
- If substantial design/spec work is clear and the user did not ask for chat-only output, write a lane artifact by default.
- If the desired design/spec output is unclear, do not create files yet; use `discuss-with-me` or ask one material question first.
- Design artifacts contain decisions and technical rationale, not process history. Later cleanup, promotion, or archival belongs to `docs-maintain`.

## Workflow

1. Establish design mode:
   - Restate the goal and success shape.
   - Name assumptions and unknowns.
   - Resolve whether the output is chat-only, a design/spec artifact, or a handoff packet.
   - If the output is unclear, stop before writing files and clarify the intent.
2. Inspect current state:
   - Read relevant code/docs.
   - Search for adjacent implementations and prior plans.
   - Capture security-sensitive surfaces early.
3. Build research lanes when useful:
   - similar local feature or module lane
   - architecture/current-boundaries lane
   - external prior-art or docs lane
   - UX/API/CLI surface lane when relevant
   - security/trust-boundary lane for sensitive designs
4. Build architecture pressure lanes:
   - minimal-change approach
   - clean-boundary approach
   - pragmatic/ship-first approach
   - adversarial "what breaks this" approach
5. Synthesize:
   - Read lane outputs.
   - Verify important claims against source files or docs.
   - Deduplicate by decision, not by lane.
   - Preserve real disagreement as an open decision branch.
6. Discuss unresolved branches:
   - Ask one blocking question at a time.
   - Include the parent agent's recommended answer.
   - Explain the cost of each option.
7. Produce the design output:
   - recommended direction
   - alternatives considered
   - what we gain and pay
   - boundaries and ownership
   - security context and non-goals
   - validation strategy
   - open questions
   - next skill to use
8. Write the artifact when appropriate:
   - For clear substantial design/spec work, create a repo-local temp or requested spec artifact unless the user said chat-only/no-files.
   - For chat-only or unclear design work, return the synthesis in chat and do not create files.
   - Do not decide long-term document lifecycle here; route cleanup or promotion to `docs-maintain`.

## Lane Set

Default lanes for substantial design work:

- `codebase-explorer`: finds similar features, ownership boundaries, and key files the parent must read.
- `prior-art-researcher`: researches library/API/platform patterns with source citations.
- `architecture-minimal`: argues for the smallest safe change.
- `architecture-clean-boundary`: argues for clearer separation of concerns and future-proof ownership.
- `architecture-pragmatic`: argues for the most shippable balanced approach.
- `security-trust-boundary`: identifies entry points, untrusted inputs, assets, auth assumptions, sensitive data, and privileged actions.
- `adversarial-design`: attacks assumptions, future failure modes, and simpler alternatives.

For tiny design questions, run local versions of the relevant lanes and state why a full swarm was skipped.

## Progressive Disclosure

- Load `references/swarm-packets.md` before spawning design, research, or architecture subagents.
- Load `references/discuss-with-me.md` when intent is unclear or design branches need user decisions.
- Load `../../references/source-inspirations.md` when updating this skill, explaining source practices, or comparing against admired upstream skills.

## Output Shape

Return:

- Current-state evidence inspected.
- Lanes run and skipped.
- Artifact path, or why no artifact was written.
- Recommended design direction.
- Alternatives and tradeoffs.
- Security context or "not security-sensitive" rationale.
- Decisions needed from the user.
- Suggested next skill: usually `spec-review-swarm` or `plan-handoff`; use `plan-review-swarm` only after an implementation plan exists.

---
name: spec-handoff
description: Use when packaging spec, design, architecture, or product-decision context for another agent, CLI, machine, or future session before an implementation plan exists.
---

# Spec Handoff

Package spec/design context so another agent can continue without reconstructing
the conversation. This is a portability boundary, not a completion boundary:
handoff means the context is transferable, not that the spec is approved or the
next phase is complete.

## Core Rules

- Use this only before an implementation plan exists.
- Package decisions, non-goals, open questions, source evidence, contracts,
  tradeoffs, and security context.
- Preserve uncertainty. Do not hide open questions to make the packet feel done.
- Do not create an implementation plan here. Use `plan-create` for that.
- Do not review the spec here. Use `spec-review-swarm` for adversarial review.
- Do not package code, branch, diff, commits, or test state. Use
  `implementation-handoff` when implementation state exists.
- Always write a file artifact and also print the copy-paste prompt in the
  response unless the user explicitly asks for chat-only output.

## Workflow

1. Resolve the source context:
   - spec/design/architecture artifact
   - chat decision
   - current repo evidence
2. If a source file exists, count lines and read the whole file in chunks before
   summarizing.
3. Inspect only the code/docs needed to make claims grounded.
4. Create a repo-local artifact under:
   - `<repo-root>/tmp/spec-workflows/<yyyy-mm-dd>-<repo>-<branch>-<spec-slug>/`
5. Write:
   - `spec-handoff.md`
   - `copy-paste-prompt.md`
6. Report:
   - artifact paths
   - source coverage
   - decisions and non-goals
   - open questions
   - recommended next skill: usually `plan-create`, `spec-review-swarm`, or
     `docs-maintain`

## Packet Contents

- Goal and audience
- Decisions already made
- Non-goals and rejected options
- Contracts, interfaces, data flow, and ownership boundaries
- Tradeoffs and who pays their cost
- Security context or reason it is not security-sensitive
- Source evidence inspected
- Open questions and why they matter
- Exact next task for the receiving agent

## Common Mistakes

- Treating handoff as spec approval or phase completion.
- Turning design context into an implementation plan inside the handoff.
- Hiding open questions.
- Asking the next agent to infer source files from chat history.
- Packaging branch/diff/test state that belongs in `implementation-handoff`.

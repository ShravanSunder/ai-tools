---
name: spec-handoff
description: Use when packaging spec, design, architecture, or product-decision context for another agent, CLI, machine, or future session before an implementation plan exists.
---

# Spec Handoff

Package spec/design context so another agent can continue without reconstructing the conversation. This is a portability boundary, not a completion boundary: handoff means the context is transferable, not that the spec is approved or the next phase is complete.

## Core Rules

- Use this only before an implementation plan exists.
- Package decisions, non-goals, open questions, source evidence, contracts, tradeoffs, security context, and proof expectations.
- Always name proof expectations in the handoff response: validation strategy, proof assumptions, explicit planning deferral, or open proof gaps.
- Preserve uncertainty. Do not hide open questions to make the packet feel done.
- Do not create an implementation plan here. When the packet proves a pair-mode `spec-program-review` result is `ready` and semantically current for the current specification and program design, record that the planning route is unavailable in this release rather than invoking a retired skill. Missing structural How routes to `program-design`; a complete but unreviewed or stale pair routes to `spec-program-review`; missing Why/What routes to `spec-design`.
- Do not review the specification or program design here. Use `spec-program-review`.
- Do not package code, branch, diff, commits, or test state. Use `implementation-handoff` when implementation state exists.
- Always write a file artifact and also print the copy-paste prompt in the response unless the user explicitly asks for chat-only output.

## Workflow

1. Resolve the source context:
   - spec/design/architecture artifact
   - chat decision
   - current repo evidence
2. If a source file exists, count lines and read the whole file in chunks before summarizing.
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
   - proof expectations or proof gaps
   - recommended next skill: `spec-design` for missing Why/What, `program-design` for missing How, `spec-program-review` for a complete but unreviewed/stale pair, `docs-maintain` for artifact lifecycle work, or an explicit blocked planning handoff when pair-ready coverage is proven but no planning route is shipped
   - full clickable artifact links (absolute path + line) for handoff artifacts the human is expected to open

## Packet Contents

- Goal and audience
- Decisions already made
- Non-goals and rejected options
- Contracts, interfaces, data flow, and ownership boundaries
- Tradeoffs and who pays their cost
- Security context or reason it is not security-sensitive
- Proof expectations: validation strategy, proof assumptions, explicit planning deferrals, or open proof gaps
- Planning-admission evidence: current specification and program-design paths, current pair-review identity/result, evidence that it covers both artifacts' current meaning, or the exact missing/stale prerequisite
- Source evidence inspected
- Open questions and why they matter
- Exact next task for the receiving agent

## Common Mistakes

- Treating handoff as spec approval or phase completion.
- Routing a handoff to planning without a pair-mode `ready` review result whose semantic coverage includes the current specification and program design.
- Turning design context into an implementation plan inside the handoff.
- Hiding open questions.
- Asking the next agent to infer source files from chat history.
- Packaging branch/diff/test state that belongs in `implementation-handoff`.

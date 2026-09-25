---
name: practices-research
description: "Use when a task needs source gathering, prior-art research, current docs or web evidence, memory or session-log mining, or saved-reader research before design, planning, review, or discussion can continue. Not for extracting unwritten owner meaning or repairing a shared model already held."
---

# Practices: Research

Turn a fuzzy evidence need into bounded questions, walk relevant source classes in order, and return a verified ledger that another workflow can inspect. The assigned researcher owns the entire walk. Research gathers evidence; the receiving phase owns design, plans, implementation, and review verdicts.

## Boundaries

- Stay read-only against product code unless the user explicitly switches to implementation.
- Start with current local code and docs when the question affects a local repo. Memory and older notes help locate sources but do not replace live evidence.
- Preserve user-named systems, repos, tools, articles, and URLs.
- Label every claim as direct observation, cited source summary, user-memory evidence, inference, or unresolved. A load-bearing supported conclusion needs a primary anchor or an explicitly labeled gap.
- Record null results with the verbatim query and distinguish `searched, nothing found` from `not searched` and `no route available`.
- Return material design decisions to the orchestrator. The researcher may synthesize evidence within the assignment but does not author the next phase's artifact.

## Ordered Workflow

1. Frame one to five researchable questions. Name the decision target, non-goals, source classes, freshness requirement, and what would support, refute, or complicate each question.
2. Re-anchor locally when a repo is involved: read current code, docs, specs, plans, runbooks, findings, and relevant sibling repos. Treat memory and session summaries as discovery.
3. MUST load `references/tool-routing.md` and return the source routes for the questions. MUST load `references/lane-packets.md` as source-class checklists and return the selected classes in order with a reason for each skipped class.
4. Walk selected source classes one at a time. Record verbatim queries, opened sources, null results, and unsearched classes. Use current web or docs sources where freshness matters. Keep evidence classes separate from inference.
5. Verify load-bearing claims against primary sources, compare stale memory with live files, and surface contradictions or competing hypotheses. IF a conclusion is load-bearing or embeds the user's own hypothesis, the assignment owner with coordination authority may commission or resume one independent 🔎 Review Sidekick through `manage-agents`. A bounded 🛠️ Worker returns the claim and anchors to that owner. IF the countercheck is commissioned, MUST load `references/countercheck.md` for its handoff and return per-claim `complete | partial | blocked` results before synthesis. Otherwise record why it was not selected.
6. Synthesize by question. Findings move from `lead` to `investigated`, then `accepted | refuted | unresolved`. Zero accepted findings is valid. State supported, refuted, complicated, and unresolved claims with their anchors, then name the next owner as a return token.

For substantial research, MUST load `references/evidence-ledger.md` and write a repo-local ledger under `tmp/practices-research/<date>-<slug>/`, unless the user asked for chat-only or no files or the tool surface cannot write. Name the exception in the result. Send progress after re-anchor, after source-class coverage, and before synthesis.

## Return

Return the questions, source-class coverage with verbatim queries and null results, artifact path or exception, verified claim classes and finding states, competing hypotheses, gaps, countercheck statuses when selected, and the return token. MUST load `../../shared-references/phase-return-tokens.md` and return the next owner as one token with its payload: `requirements-gap` for unwritten owner meaning, `specification-gap` for authoritative Why/What evidence, `program-design-gap` for structural How, `ready-for-planning` for ready design planning, `ready-for-implementation` for ready plan execution, and `ready-for-review` with `general-domain | runtime-skill-package` for independent implementation judgment.

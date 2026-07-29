---
name: research-swarm
description: Use when a task needs source gathering, prior-art research, current docs or web evidence, memory or session-log mining, saved-reader research, or bounded subagent research lanes before design, planning, review, or discussion can continue.
---

# Research Swarm

Use this skill as the evidence-gathering workflow. It turns fuzzy research into sharp questions, sends bounded lanes to the right source classes, and returns an evidence ledger the parent can use for discussion, spec design, planning, or review.

This is not a discussion skill. Discussion rebuilds the shared model or chooses the next question. Research-swarm goes out and gathers information. The parent owns the question, lane packets, verification, synthesis, and final claim.

## Core Rules

- Stay read-only against product code unless the user explicitly switches to implementation.
- Research does not become design, spec, plan, or implementation by momentum.
- When evidence feeds design, recommend `spec-creation-swarm`; when evidence feeds implementation planning from an accepted spec/design, recommend `plan-creation-swarm`. Research preserves evidence for those workflows; it does not synthesize their artifacts.
- Start with the local system when the research affects a local repo: current code, docs, specs, plans, runbooks, and live file tree beat memory and older notes.
- Convert the ask into 1-5 researchable questions before spawning lanes. Name what would support, refute, or complicate each question.
- Use subagents for independent, bounded lanes when the evidence can be gathered in parallel. Do not ask a lane to "research everything".
- Preserve user-named systems, repos, tools, and articles. Do not replace them with generic searches.
- Label every claim with its class — direct observation, cited source summary, user-memory evidence, inference, or unresolved — and put the citation at the claim, not in a bibliography. A load-bearing conclusion enters `supported` only with a primary anchor (code, official docs, spec, first-party source) or an explicitly labeled evidence gap.
- Null results are evidence. Record what was searched — with the verbatim query — and found nothing, and what was not searched with the reason; "no route available" and "searched, nothing found" are different facts.
- For substantial research, write a repo-local parent ledger and per-lane artifacts under `tmp/research-workflows/<date>-<slug>/`; lane outputs stay candidate evidence until parent synthesis verifies them, and durable promotion or cleanup stays with `docs-maintain`. `references/lane-packets.md` owns the chat-only and no-file exceptions, which still name the ledger shape and claim classes.
- Send short progress updates during long research: after re-anchor, after lane dispatch, and before synthesis.

## Workflow

1. Frame the research:
   - user's thesis or decision target
   - non-goals
   - source classes needed
   - freshness requirements
   - artifact expectation
2. Re-anchor locally when a repo is involved:
   - current code and docs
   - adjacent or sibling repos when the named repo is thin
   - current spec, plan, runbook, findings, and changelog if present
   - current memory/session summaries only as a discovery layer
3. Build lane packets:
   - one bounded question per lane
   - exact source classes and named targets
   - expected evidence format
   - confidence and uncertainty fields
4. Gather evidence:
   - run local reads/searches for critical-path facts
   - dispatch independent subagent lanes when useful
   - use current web/docs tools only when freshness or external sources matter
   - record each lane's verbatim queries and coverage: what was searched, and what was not
5. Verify:
   - primary-source check for load-bearing claims
   - stale-memory check when memory conflicts with live files
   - contradiction check across spec/plan/runbook/finding artifacts
   - when evidence splits, present competing hypotheses side by side with evidence for and against each; do not force a winner
   - IF a conclusion is load-bearing or embeds the user's own hypothesis, dispatch one bounded fresh-context countercheck (a reviewer per `manage-agents`) to disprove it before synthesis
6. Synthesize by decision, not by source. Each finding carries a state — `lead` when surfaced, `investigated` when its evidence was opened, then `accepted`, `refuted`, or `unresolved`; zero accepted findings is a valid result:
   - what the evidence supports
   - what it refutes
   - what it complicates
   - what remains unknown
   - recommended next workflow

## Tool Routing

Load `references/tool-routing.md` before choosing tools for mixed local, web, docs, memory, Reader, or session-log research.

Load `references/lane-packets.md` before spawning subagents.

Load `references/evidence-ledger.md` before writing a research artifact or when the user needs a copy-pasteable packet.

## Output Shape

Return:

- research questions asked
- sources and lanes used, with verbatim queries and coverage (searched / not searched / null results)
- artifact path, or why no artifact was written
- ledger shape, including claim classes: direct observation, cited source summary, user-memory evidence, inference, unresolved
- evidence ledger summary with finding states (lead / investigated / accepted / refuted / unresolved)
- supported / refuted / complicated / unresolved findings, and competing hypotheses side by side where evidence split
- source-quality caveats
- recommended next workflow: usually `discuss-clarify-mental-models`, `spec-creation-swarm`, `plan-creation-swarm`, `plan-review-swarm`, `implementation-review-swarm`, or `docs-maintain`

# 2026-08-07 — manage-agents dispatch discipline (shravan-dev-workflow 2.3.0)

## What changed

`shravan-dev-workflow` `2.2.0 → 2.3.0` (2.2.0 was taken by the goal-delivery-intent release on master). One skill changed: `manage-agents`. Four sequenced runs from the accepted multi-run spec (`docs/wip/skills-authoring/2026-08-07-manage-agents-dispatch-discipline.md`, accepted-to-implement r6 for Runs 1–3 and r8 for Run 4) landed together.

**Run 1 — pattern selection and Operator discipline (`SKILL.md`)**

- New "When To Call What" section: an if-this-job-type-then-this-pattern table where every pattern row carries the job type, one good-selection signal, and one mis-selection trap; selection completes before any model or runtime is named.
- Operator section gains a bright line — any job handed to a subagent that is a bounded mechanical procedure MUST be an Operator — plus a three-row rationalization table ("faster myself", "needs judgment", "a Delegate can handle it").
- Operator model table: OpenAI Terra removed; OpenAI Luna high/xhigh preferred; Cursor Composer 2.5 is the sole declared fallback; preference lives in its own column so the category value stays clean.
- Delegate table gains `Mini | OpenAI Luna | max`, fixing the prose/table inconsistency (prose promised a Mini category the table never had).

**Run 2 — job planning for subagent-driven development**

- Frontmatter description rewritten: adds handing off mechanical work (running tests or builds, watching CI or PR checks, monitoring, scraping, grouping logs into a report), subagent-driven development, planning agent jobs, parallel subagents, and a research-swarm boundary clause.
- Opening mental model now has two nested levels: the job graph owns decomposition, sequencing, and parent verification points; each job runs the existing ordered dispatch decision. A job yields at most one assignment-bound receipt and always closes at its named parent verification point.
- New workflow step 0 (job decomposition, gated on a three-part predicate) and a new reference `references/job-planning.md` teaching what to inspect when cutting jobs, one good and one bad decomposition, and the stop condition.

**Run 3 — job-packet slimming and readability**

- `references/agent-job-packet.md` rewritten: the Dispatch packet drops from 21 fields to 10 with a space-aligned value column; five routing fields merge into one `route:` line that still records category and lineage; receipt fields merge into one `return:` line keeping all binding identifiers (assignment id, decision target, source/head version, session identity for persistent patterns); `assignment purpose` and `continuity reason` deleted from the packet (the session ledger keeps continuity ownership). Operator decision and reduction blocks use the same aligned two-column layout.
- `SKILL.md` step 3 completion line cut over to the new field names; `references/session-ledger.md` receipt row adopts the `return binding` vocabulary with identifiers unchanged.

**Run 4 — capability economics, history rules, ACPX context provisioning, parallelizability**

- New `SKILL.md` "Capability Economics" section: the pattern's table owns the category floor; Capability Economics picks the cheapest category/lineage at or above it; Mini (OpenAI Luna) is the grunt-work default and can be a Sidekick, Delegate, or Operator; escalation is symptom-named and "the task feels important" is called out as a non-reason. Sidekick prose and table now include Mini (OpenAI Luna, high/xhigh/max).
- Parent Conversation History rewritten: reviewer bright line (a review agent NEVER receives parent conversation history; reviewer defined as any agent whose assignment is independent review or verification), cost/benefit history for non-reviewers with an inspectable stop (include what the job's stop condition depends on), generous history allowed on cheap native Minis.
- ACPX Dispatch gains context provisioning: ACPX agents start with zero parent context; each context piece names its packet home (`job:`, `non-goals:`, `sources:`, `access: history none`); parent history is distinguished from ACPX session continuity; Choose the Runtime gains the forward history-feasibility sentence. The packet access line is constrained to `history none | all (native only; ACPX always none)`.
- `references/job-planning.md` gains context conservation as a cut reason (flooding work is a job even when sequential) and a predicate-based "What Parallelizes Well" section (write sets, unverified receipts, the "different files, so parallel" trap).

## Validation

- Spec review: four lanes (mental-model-fit, trigger-routing, rule-agreement, depth-coverage) ran on r1, a confirmation pass on r3, a scoped delta pass on r4+r5, and a three-lane scoped delta pass on r7 (Run 4); all accepted findings fixed; both acceptance bindings recorded in the spec doc.
- New pressure scenarios: `operator-for-mechanical`, `pattern-selection-unnamed`, `job-decomposition-before-dispatch` (extended with a context-conservation flood case), `capability-economics` under `tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/`. All four passed live eval runs. Proof strength, honestly stated: manage-agents scenarios run the legacy evaluation path — subject self-report JSON plus deterministic `expect_*` regex assertions; no semantic LLM judge grades these scenarios, so Expected Compliant Behavior and Failure Signals are human rubric text only. This is vocabulary-floor proof, not failure-mode discrimination. The Run 3 packet cutover is proven by static grep (no old field names) plus scenario vocabulary, not by a dedicated packet-field behavior test.
- `session-ledger-reduction` rewritten to a plan-only prompt matching its `expect_read_only`/`expect_artifact: false` contract; earlier flakiness traced to the old prompt instructing live sidekick calls the harness forbids.
- Hard-cutover check: no old packet field name (`assignment purpose`, `continuity reason`, `receipt scope`, `write scope`, `workspace access`, `model lineage` as packet keys) survives in the skill tree, including provider references; the session ledger's own `continuity reason` row is intentionally retained per the spec.
- Implementation review: eight lanes (placement-and-calls, steering-strength, mental-model-fit, no-op-pruning, rule-agreement on a second lineage, depth-coverage, trigger-routing, claim-vs-evidence) on the changed files; accepted fixes folded in (stale `write scope`/Terra in ACPX provider references, Capability Economics folded into the dispatch chain and step 1, Operator long-watch MUST, step 0 parallel-safety legwork, trigger boundaries for implementation-pr-wrapup and second opinions). A scoped delta pass then gated Terra to "user request only" in remaining provider catalogs, made the step 3 agent-result reduction unconditional after dispatch, extended the chain's cheapest-at-floor annotation to lineage, and corrected this Validation section's proof-strength claim.
- Harness, typecheck, and eval results recorded in the PR.

## Refresh status

- Codex and Claude plugin cache refresh: pending post-merge (recorded here when done).

## Deferred (Changeset C)

The loading-enforcement layer (Claude Code `PreToolUse` hook on `Task` + the `my_agents.md` bright line in devfiles) is specced but deliberately not in this release: the hook needs its security-gate decision and the devfiles edit needs explicit commit approval.

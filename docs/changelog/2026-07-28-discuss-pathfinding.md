# 2026-07-28 Discuss Pathfinding And Skills-Creation Sourcing

Plugin: `shravan-dev-workflow` 1.6.72

## User-visible behavior

- New skill `discuss-pathfinding`: extract understanding that lives only in someone's head or an unmade decision — requirements, tacit process knowledge, domain terms, design decisions. Spine: name the destination and out-of-scope → classify before asking (observable → bounded read; broad → research-swarm; judgment/tacit → the user) → hypothesize with confidence first → batched questions, one axis at a time, options or your read attached → challenge as you go (canonical terms, glossary conflicts, code cross-reference, edge scenarios) → write decisions and glossary entries the moment they crystallize → provenance-split validation with an explicit-yes bar → predictive stop test. Bright lines: refuses non-interactive contexts; "sounds good"/"whatever you think" never confirm; chat-only on request.
- References: `question-craft.md` (question form with attached read, want-vs-should-want, process-marker and stated-vs-actual probes, the non-yes counters, pacing) and `decisions-and-docs.md` (decision records, glossary entries, fresh-context reader test via manage-agents reviewer rules).
- Boundary cutover with shipped neighbours: `discuss-clarify-mental-models` narrowed to rebuilding a drifted map and gains a reciprocal not-for; `orchestrator-goal` routing-map splits never-articulated goals (→ discuss-pathfinding) from drifted models (→ discuss-clarify-mental-models); `spec-creation-swarm` routing gains the same split at both call sites.
- `skills-creation` step 2 now sources ground truth before design: IF the skill teaches work the run does not yet understand, extract what lives in people with `discuss-pathfinding` and gather what lives in artifacts with `research-swarm`; main path, depth, and implementation consume the kept notes.

## Changed surfaces

- `skills/discuss-pathfinding/` (new: SKILL.md + 2 references)
- `skills/discuss-clarify-mental-models/SKILL.md` (description boundary only)
- `skills/orchestrator-goal/references/routing-map.md` (one row split)
- `skills/spec-creation-swarm/SKILL.md` (two routing lines)
- `skills/skills-creation/SKILL.md` (step 2 sourcing pass)
- Codex and Claude plugin manifests + Claude marketplace metadata (1.6.72)

## Sources

Inline citations sit at each adapted judgment in the reference files; the full judgment-to-source map is in [references/2026-07-28-discuss-pathfinding-evidence.md](references/2026-07-28-discuss-pathfinding-evidence.md). Process-marker interviewing is original — no source taught interviewing about a repeatable process.

## Validation

Verdict-level evidence for every claim below is persisted in [references/2026-07-28-discuss-pathfinding-evidence.md](references/2026-07-28-discuss-pathfinding-evidence.md).

- Spec review: three fresh-context proposal lanes; receipts complete; one blocker (router boundary collision) resolved via the coordinated neighbour edits above.
- Implementation review: seven lanes run on gpt-5.6-sol via acpx (different lineage); two blockers and the accepted importants fixed before commit; reductions in the evidence file.
- `claude plugin validate .`: passed at the post-fix state (output in the evidence file).
- Proof route: proof gap, user-accepted — pressure testing excluded by user direction (decision persisted in the evidence file); behavior not evaluated; no behavior proof is claimed.

## Refresh / reinstall

- Source metadata prepared for `1.6.72`. Installed Codex/Claude cache refresh happens after merge; the live Claude cache predates this change.

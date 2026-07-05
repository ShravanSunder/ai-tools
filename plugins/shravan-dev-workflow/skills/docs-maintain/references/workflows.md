# Docs Maintain Workflows

## Create

Use when no doc exists for a durable concept.

1. Identify audience and role.
2. Inspect code/config/tests and adjacent docs.
3. Choose the smallest durable artifact.
4. Write current-state facts and decisions, not process history.
5. Add links from `AGENTS.md` or README only if future agents/humans need the pointer.

## Update

Use when docs exist but are stale or incomplete.

1. Read the existing doc fully enough to understand its contract.
2. Verify important claims against current code/config/tests.
3. Patch only stale sections.
4. Preserve useful historical rationale when it still explains current design.
5. Remove duplicated text if one source should link to another.

## Cleanup

Use when old specs/plans/docs create confusion.

1. Inventory candidate stale docs.
2. Classify each as current, substrate input, superseded, historical, obsolete, or unknown.
3. Propose purge/archive/rewrite before destructive changes.
4. Preserve useful decisions in the current architecture doc or changelog before removing old context.
5. Leave unknown docs alone and report what evidence is missing.

## Discrepancy

Use when code, docs, README, AGENTS, tickets, or plans disagree.

1. State the disagreement precisely.
2. Identify which source should drive.
3. If unclear, ask the user directly; use `discuss-clarify-mental-models` when
   the source-of-truth disagreement reflects shared-model drift.
4. Patch the non-driving source.
5. Add a changelog note when the discrepancy taught a durable repo rule.

## Plans And Specs

Use when maintaining `docs/plans`, `docs/specs`, or `docs/superpowers/*`.

1. Run `wc -l` on the artifact.
2. Read the full artifact before judging status.
3. Compare major claims against current code, package layout, branch state, and architecture docs.
4. Mark whether the artifact is executable, design reference, substrate input, superseded, historical, obsolete, or unknown.
5. Update indexes and links so only current artifacts are presented as current.

## Agent Instructions

Use for `AGENTS.md` or shared agent prompts.

1. Keep changes short and durable.
2. Link out to runbooks for detailed procedure.
3. Avoid session-specific history.
4. Do not add broad behavioral rules unless repeated evidence supports them.
5. If a rule conflicts with another instruction, place the fix next to the conflicting section.

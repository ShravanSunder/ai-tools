# Plan Review Swarm Checklist

Load this for large, risky, stale, or implementation-facing plans.

## Coverage

- Exact target file or packet identified.
- `wc -l` captured for plan files.
- Chunk coverage has no gaps.
- Tail chunk read.
- Adjacent plans/worktrees explicitly excluded when out of scope.
- Accepted source artifact identified for substantial review.
- `wc -l` captured for source files.
- Source chunk coverage has no gaps.
- Substantial review loaded both accepted source artifact and produced plan
  directly.
- If no full accepted source artifact exists, the review is blocked or marked
  limited instead of treated as ready.

## Source Truth Distinction

- Primary artifacts named separately from compact binding excerpts.
- Parent routing summary is marked as non-evidence.
- Supporting evidence is named as supporting, not source truth.
- Lane receipt includes `primary_sources_loaded`,
  `supporting_evidence_checked`, `source_truth_distinction_checked`,
  `coverage_scope`, `cannot_verify_from_focused_packet`, source anchors,
  proposed artifact path, confidence, and remaining uncertainty.

## Lane Reference Loading

- Substantial plan review includes `whole-plan-cohesion`.
- Focused lanes do not replace `whole-plan-cohesion`.
- No parent-only coverage pass substitutes for the mandatory whole-plan lane.
- Every selected lane loads `references/lanes/<lane>.md`.
- Inline lane overlays are treated as summaries only.
- Focused lanes return `cannot_verify_from_focused_packet` for whole-plan,
  cross-slice, or cross-artifact obligations they cannot verify.

## Grounding

- Current branch/base checked when branch freshness matters.
- Main package/module boundaries inspected.
- Referenced APIs, methods, schemas, and tests verified in live files.
- External docs checked only when current behavior depends on them.

## Plan Quality

- No placeholders: TODO, TBD, "add tests", "handle edge cases", "similar to above".
- Tasks have exact files, commands, expected output, and acceptance criteria.
- Execution order is dependency-safe.
- Validation gates prove behavior, not only formatting.
- Scope is narrow enough for one execution pass or clearly split.

## Security Context

- Threat model exists when the plan touches auth, parsing, filesystem, network,
  secrets, subprocesses, plugins, MCP, CI, package scripts, dependencies,
  agents, or external services.
- Entry points, untrusted inputs, trust boundaries, sensitive data, privileged
  actions, invariants, and non-goals are explicit.
- Security validation proves behavior, not only "reviewed for security".
- If the user requested a scan or audit, route to `ops-security-review`
  instead of treating the normal review lane as exhaustive.

## Adversarial Questions

- What breaks if the branch is stale?
- What claim is copied from an old design?
- What is under-specified enough for two agents to implement differently?
- What code path or API name is assumed but not real?
- What test would fail if the plan is wrong?
- What can an implementer overbuild because the boundary is vague?
- What needs a user decision before editing?

## Report Discipline

- Separate what the plan says from what the repo proves.
- Separate source truth from parent routing summaries and supporting evidence.
- Rank findings by execution risk.
- Ask questions only when the answer changes implementation.
- Keep the review read-only.

## Review Reception

If the current agent authored the plan, or the plan artifact is in the current writable workspace:

1. Validate each candidate finding before acting.
2. Reject technically incorrect or unsupported findings with a short reason.
3. Clarify ambiguous findings when ambiguity changes the plan.
4. Route parent-accepted blocker and important plan findings back to
   `plan-creation-swarm`.
5. Route parent-accepted source-boundary findings to `spec-creation-swarm`,
   then back to `plan-creation-swarm`.
6. Keep plan review read-only. Return exact owner-facing edits or route-back
   instructions instead of mutating the produced plan.
7. Report which findings were accepted, rejected, deferred, or need user decision.

If the user explicitly asked for read-only/report-only review, or the plan belongs to another agent and should not be changed, do not edit. Return exact plan edits for the owner to apply.

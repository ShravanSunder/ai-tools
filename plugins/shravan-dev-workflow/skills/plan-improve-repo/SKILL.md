---
name: plan-improve-repo
description: Use when auditing a repository for improvement opportunities, backlog-worthy refactors, quality gaps, or leverage points and turning admitted repository-improvement findings into self-contained implementation plans, including findings admitted as implementation-mechanics-only from current source. Not for directly translating a Requirements, Specification, and Program Design set into an implementation plan, or for directly creating, updating, evaluating, or planning changes to one named runtime skill package without explicit skills-creation composition.
---

# Plan Improve Repo

Audit a repo like a senior advisor and turn admitted findings into completed immutable canonical plans. Before admission, the product is a vetted finding or prioritized backlog routed to the missing semantic owner; after admission, the product is a completed plan at one path that still requires separate later owner approval before execution. This skill does not edit product code.

Its direct authority is the admitted repository-improvement finding. `plan-implementation` separately owns direct translation of a reviewed Requirements, Specification, and Program Design set. Both produce the same canonical plan contract without sharing entry authority.

Inspired by the MIT-licensed `shadcn-improve` plugin mechanics: scout broadly, verify claims yourself, then produce plans a cheaper/faster executor can run.

## Entry And Planning Admission

Before repo recon, record `target classification: general-repo | runtime-skill-package`.

IF the request directly creates, updates, evaluates, or plans changes to one named runtime skill package, require the explicit `skills-creation` parent packet/result identity authorizing this composition. Without it, return the `skills-creation` route and stop before recon.

Vetted findings and prioritized backlogs may be returned without planning admission. Before writing a new completed plan or returning a `ready` current-state validation receipt for an existing completed canonical plan, classify its planning basis:

```text
current-three-artifact-design-ready
  complete current Requirements, Specification, and Program Design
  required local review coverage is semantically current
  current review mode: three-artifact-design
  exact three-artifact design review invocation identity and review result identity
  review result: ready and covers all three current identities
  accepted findings corrected under refreshed review
  review coverage matches all three artifacts' current meaning
  no blocking decision or evidence gap

implementation-mechanics-only
  current source inspection positively proves no new product obligation,
  owner/boundary, interface, state semantic, failure/recovery policy,
  concurrency/consistency decision, compatibility realization,
  trust control, or proof seam is required

design-required
  either admissible basis is missing or contradicted
```

`design-required` returns the vetted finding and exact missing semantic owner: Why/What to `spec-design`, structural How to `program-design`, or a complete but unreviewed/stale three-artifact design to `spec-program-review`. Do not write a new completed plan. For an existing plan, return `blocked` in the separate current-state validation receipt without rewriting it.

Completion: target classification and, when applicable, the exact `skills-creation` parent identity are recorded; every written plan carries one current admissible planning basis, the exact review invocation identity and review result identity when design-bearing, and its semantic-freshness record. Any `ready` label belongs only to a separate current-state validation receipt.

## Core Rules

- Do not edit product code, tests, config, or durable docs while auditing.
- Write plan artifacts only for admitted findings unless the user explicitly asks for chat-only output; preserve design-required findings in the shortlist/backlog and route them to their semantic owner.
- Use the repository home and proportional Markdown form returned by `../../shared-references/canonical-implementation-plan.md`.
- Read repo instructions, README/docs, package/tooling files, tests, CI, and recent git history before recommending work.
- Inspect audit categories in-parent by default. IF the user explicitly requests delegation, or current source reveals one concrete independently verifiable evidence question whose bounded handoff materially improves coverage, `manage-agents` owns that later handoff; agent availability or a broad flow name is never enough.
- Treat subagent findings as candidates, not truth. Re-open cited files before accepting a finding.
- Never quote or copy secret values. Report secret classes and file locations only when relevant.
- If asked to implement an existing plan, route to `implement-plan` only when the canonical result is `draft` and separate later owner approval names that exact plan path and current meaning. If asked for independent implementation review, route `general-repo` work to `review-implementation` and explicitly composed `runtime-skill-package` work back to `skills-creation`; never invoke a retired skill or treat validation as either execution or review.
- If asked to validate a generated plan, return a separate read-only current-state validation receipt. Validation never authorizes execution or changes the canonical tuple.
- Call only the exact canonical `draft` at its immutable plan path and current meaning with the complete later matching owner approval-evidence record executable. Plan completion, validation, handoff, a ticket, or earlier goal text is not approval.

## Normal Flows

- `quick`: inspect instructions, README, manifests, tests, and churn; produce a short vetted shortlist and at most one admitted plan.
- `deep`: inspect all relevant audit categories in-parent, verify candidates, and write admitted plans for the top 3-5 improvements unless the user picks different ones; route design-required findings without plan writing. Delegation still requires the Core Rules predicate.
- `focus <area>`: audit only the named area, such as security, tests, DX, performance, docs, architecture, or one package/module; apply the same admission gate.
- `branch`: compare the current branch against its base and plan only admitted improvements for the branch's changed surface, not the whole repo.
- `next`: choose the highest-leverage existing completed canonical plan and validate its planning basis and current-state readiness without mutating it.
- `validate-plan <path>`: read the whole plan, compare it to the live repo, and return a separate `ready | needs-refresh | blocked | rejected` receipt; missing planning admission is `blocked`.
- `reconcile`: assess whether existing improvement plans remain current and return separate reconciliation receipts without mutating them.

## Workflow

1. Recon the repo:
   - instructions and ownership boundaries
   - project structure and main entry points
   - build, test, lint, typecheck, and CI commands
   - recent churn from git history
   - obvious risk surfaces: auth, secrets, parsing, filesystem, network, subprocesses, plugins, MCP, package scripts, agents, external services
2. Audit improvement categories:
   - correctness and behavior
   - security and trust boundaries
   - tests and validation gaps
   - architecture and maintainability
   - performance and reliability
   - developer experience and tooling
   - docs or onboarding drift
3. Vet candidates:
   - parent reads every accepted candidate's cited files
   - reject false positives and duplicates
   - classify unknowns separately from accepted findings
4. Prioritize by leverage:
   - user impact
   - risk reduction
   - implementation size
   - proof clarity
   - dependency order
5. Classify each selected improvement under **Entry And Planning Admission**:
   - write plans only for `current-three-artifact-design-ready` or `implementation-mechanics-only`
   - preserve and route `design-required` findings without turning them into execution tasks
6. IF producing or revising a completed plan result, or validating or preserving an extant completed plan, load `../../shared-references/canonical-implementation-plan.md` to keep this skill's admitted-improvement and implementation-mechanics-only admission inline while applying the shared producer/validator contract, and return the complete canonical tuple, result-specific payload, separate approval-evidence record or explicit absence, and any blocking discrepancy. Audit-only runs and pre-artifact admission failures do not load it.
7. Write one plan per admitted improvement:
   - default to the top 3-5 in non-interactive runs
   - one focused plan per finding, not a mega-plan
   - instantiate the canonical tuple with originating planner `plan-improve-repo`
   - return `draft | revision-requested | blocked` with the matching result payload and explicit approval absence
   - include planning-basis identity, exact files, current-state evidence, proof-bearing slices, proof gates, and stop conditions
8. Validate each generated plan without changing its tuple or planning result:
   - read the plan back after writing it
   - confirm every write surface exists or is intentionally new
   - confirm proof gates are commands or checks the executor can run
   - confirm task size is small enough for proof to pass inside scope
   - confirm stop conditions cover stale repo state, unrelated validation failures, and security-sensitive surprises
   - return a separately labeled non-authoritative `Current-state validation receipt` with inspected branch/HEAD, paths, commands, findings, `ready | needs-refresh | blocked | rejected`, and next owner; this block is required for `blocked` results too and never collapses into the plan summary
9. Route next:
   - `plan-handoff` to package the plan for another agent
   - `implement-plan` only for an exact canonical `draft` with separate matching later owner approval
   - `review-implementation` for `general-repo` independent implementation review, or `skills-creation` for an explicitly composed `runtime-skill-package`

## Plan Validation Flow

Use this for `validate-plan`, `next`, and pre-execution checks.

1. Read the full plan artifact; for file-backed plans, record line count and chunk coverage. Apply the conditional canonical-plan load call in the main workflow and return the unchanged tuple, approval record or absence, and any discrepancy.
2. Verify the plan's `current-three-artifact-design-ready` or `implementation-mechanics-only` basis against current evidence. A missing, stale, or contradicted basis is `blocked` and routes to the exact semantic owner.
3. Verify the planned-at SHA, current branch, and changed target files.
4. Re-open all cited source files and commands from the plan.
5. Classify each task:
   - ready: evidence current and proof gate runnable
   - needs-refresh: paths, commands, or assumptions drifted
   - blocked: dependency or external state prevents execution
   - rejected: obsolete, duplicate, or no longer valuable
6. Check proof integrity:
   - red/green proof required or explicit user-approved exception
   - focused validation and full validation listed separately
   - proof maps back to the problem, not just to changed files
7. Return a separate readiness receipt. Do not edit source code, the canonical tuple, planning result, or approval evidence.

## Progressive Disclosure

- IF performing a broad repo audit, load `references/audit-lanes.md` and return the selected in-parent categories, each category's inspected anchors, candidate or null result, coverage limit, and `delegation: none | <bounded handoff>`. The delegation return names both valid predicates—explicit user request or one source-revealed concrete independently verifiable evidence question—and `manage-agents` as owner of any later handoff; IF a predicate is met, include the one bounded evidence handoff selected there.
- IF writing a plan artifact, load `references/improvement-plan-template.md` and return the proportional filled plan form selected under the shared canonical contract.
- IF reconciling existing improvement plans or checking whether they remain current, load `references/reconcile-backlog.md` and return the separate reconciliation receipt, unchanged canonical tuple and approval evidence for each extant plan, and exact originating-planner correction route when applicable.
- IF validating a plan, selecting `next`, or judging current execution readiness, load `references/validation-checklist.md` and return its separate current-state receipt without mutating the canonical tuple or approval evidence.

## Output Shape

Return:

- repo coverage inspected
- selected flow: quick, deep, focus, branch, next, validate-plan, or reconcile
- categories inspected and skipped, plus any conditionally delegated evidence question
- accepted findings, rejected candidates, and unknowns
- prioritized improvement shortlist
- validation verdict for generated or existing plans
- unchanged canonical tuple and separate approval-evidence record or explicit absence for every extant completed plan
- plan artifact paths with full clickable links
- recommended next skill for each plan
- commands run and validation limits
- `delegation: none | <bounded handoff>`; `none` repeats that only explicit user request or one source-revealed concrete independently verifiable evidence question permits delegation, and that `manage-agents` owns any later handoff

## Common Mistakes

- Implementing a fix instead of writing the plan.
- Trusting subagent output without re-reading cited files.
- Writing one giant cleanup plan.
- Prioritizing aesthetic refactors over high-leverage risk reduction.
- Omitting proof gates, stop conditions, or current-state evidence.
- Treating "tests exist" as a proof gate without naming the exact command and requirement it proves.
- Turning a design-required finding into tasks instead of routing it to the missing semantic owner.
- Marking a plan ready when it has stale paths, missing commands, oversized tasks, or vague validation.
- Treating stale plans as still valid without reconciling them against the current repo.
- Mutating the canonical planning result or approval evidence during current-state validation.

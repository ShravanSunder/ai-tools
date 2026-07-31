---
name: plan-improve-repo
description: Use when auditing a repository for improvement opportunities, backlog-worthy refactors, quality gaps, or leverage points and turning admitted findings into self-contained implementation plans. Not for directly creating, updating, evaluating, or planning changes to one named runtime skill package without explicit skills-creation composition.
---

# Plan Improve Repo

Audit a repo like a senior advisor and turn admitted findings into executable improvement plans. Before admission, the product is a vetted finding or prioritized backlog routed to the missing semantic owner; after admission, the product is a plan a future implementation agent can execute. This skill does not edit product code.

Inspired by the MIT-licensed `shadcn-improve` plugin mechanics: scout broadly, verify claims yourself, then produce plans a cheaper/faster executor can run.

## Entry And Planning Admission

Before repo recon, record `target classification: general-repo | runtime-skill-package`.

IF the request directly creates, updates, evaluates, or plans changes to one named runtime skill package, require the explicit `skills-creation` parent packet/result identity authorizing this composition. Without it, return the `skills-creation` route and stop before recon.

Vetted findings and prioritized backlogs may be returned without planning admission. Before writing a new executable plan or returning `ready` for an existing plan, classify its planning basis:

```text
current-pair-ready
  complete current specification and program design
  required local review coverage is current
  current pair-mode spec-program-review result: ready and covers both artifacts
  accepted findings corrected under refreshed review
  no blocking decision or evidence gap

implementation-mechanics-only
  current source inspection positively proves no new product obligation,
  owner/boundary, interface, state semantic, failure/recovery policy,
  concurrency/consistency decision, compatibility realization,
  trust control, or proof seam is required

design-required
  either admissible basis is missing or contradicted
```

`design-required` returns the vetted finding and exact missing semantic owner: Why/What to `spec-design`, structural How to `program-design`, or a complete but unreviewed/stale pair to `spec-program-review`. Do not write a new executable plan. For an existing plan, return `blocked` for execution readiness without rewriting it.

Completion: target classification and, when applicable, the exact `skills-creation` parent identity are recorded; every written or `ready` plan carries one current admissible planning basis and its exact evidence identity.

## Core Rules

- Do not edit product code, tests, config, or durable docs while auditing.
- Write plan artifacts only for admitted findings unless the user explicitly asks for chat-only output; preserve design-required findings in the shortlist/backlog and route them to their semantic owner.
- Prefer `<repo-root>/plans/` when it exists; otherwise use `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-repo-improvements/`.
- Read repo instructions, README/docs, package/tooling files, tests, CI, and recent git history before recommending work.
- Use bounded read-only subagents for broad audits when available; the parent owns synthesis and must verify cited findings against source files.
- Treat subagent findings as candidates, not truth. Re-open cited files before accepting a finding.
- Never quote or copy secret values. Report secret classes and file locations only when relevant.
- If asked to implement, route to `implementation-execute-plan` after a plan exists. If asked to review an existing plan, use `plan-review-swarm`.
- If asked to validate a generated plan, do a read-only plan validation pass before recommending execution.
- Do not call a plan executable until it has current-state evidence, explicit write surfaces, proof gates, stop conditions, and a handoff prompt.

## Normal Flows

- `quick`: inspect instructions, README, manifests, tests, and churn; produce a short vetted shortlist and at most one admitted plan.
- `deep`: run all relevant audit lanes, verify candidates, and write admitted plans for the top 3-5 improvements unless the user picks different ones; route design-required findings without plan writing.
- `focus <area>`: audit only the named area, such as security, tests, DX, performance, docs, architecture, or one package/module; apply the same admission gate.
- `branch`: compare the current branch against its base and plan only admitted improvements for the branch's changed surface, not the whole repo.
- `next`: choose the highest-leverage existing proposed plan and validate both its planning basis and execution readiness.
- `validate-plan <path>`: read the whole plan, compare it to the live repo, and mark it ready, needs-refresh, blocked, or rejected; missing planning admission is `blocked`.
- `reconcile`: refresh an existing improvement backlog without implementing it.

## Workflow

1. Recon the repo:
   - instructions and ownership boundaries
   - project structure and main entry points
   - build, test, lint, typecheck, and CI commands
   - recent churn from git history
   - obvious risk surfaces: auth, secrets, parsing, filesystem, network, subprocesses, plugins, MCP, package scripts, agents, external services
2. Audit improvement lanes:
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
   - write plans only for `current-pair-ready` or `implementation-mechanics-only`
   - preserve and route `design-required` findings without turning them into execution tasks
6. Write one plan per admitted improvement:
   - default to the top 3-5 in non-interactive runs
   - one focused plan per finding, not a mega-plan
   - include planning-basis identity, exact files, current-state evidence, task sequence, proof gates, stop conditions, and handoff prompt
7. Validate each generated plan:
   - read the plan back after writing it
   - confirm every write surface exists or is intentionally new
   - confirm proof gates are commands or checks the executor can run
   - confirm task size is small enough for proof to pass inside scope
   - confirm stop conditions cover stale repo state, unrelated validation failures, and security-sensitive surprises
8. Route next:
   - `plan-review-swarm` to attack the plan
   - `plan-handoff` to package the plan for another agent
   - `implementation-execute-plan` to validate and execute it

## Plan Validation Flow

Use this for `validate-plan`, `next`, and pre-execution checks.

1. Read the full plan artifact; for file-backed plans, record line count and chunk coverage.
2. Verify the plan's `current-pair-ready` or `implementation-mechanics-only` basis against current evidence. A missing, stale, or contradicted basis is `blocked` and routes to the exact semantic owner.
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
7. Return a readiness verdict. Do not edit source code.

## Progressive Disclosure

- Load `references/audit-lanes.md` before dispatching audit lanes or doing a broad repo audit.
- Load `references/improvement-plan-template.md` before writing plan artifacts.
- Load `references/reconcile-backlog.md` when refreshing an existing improvement backlog or checking whether old plans are still valid.
- Load `references/validation-checklist.md` before validating a plan, selecting `next`, or marking a plan ready for execution.

## Output Shape

Return:

- repo coverage inspected
- selected flow: quick, deep, focus, branch, next, validate-plan, or reconcile
- lanes run and skipped
- accepted findings, rejected candidates, and unknowns
- prioritized improvement shortlist
- validation verdict for generated or existing plans
- plan artifact paths with full clickable links
- recommended next skill for each plan
- commands run and validation limits

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

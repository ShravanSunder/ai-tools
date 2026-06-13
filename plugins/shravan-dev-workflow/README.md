# Shravan Dev Workflow

Shravan's development workflow skills for moving from shared understanding to
spec, plan, implementation, review, handoff, debugging, docs, and operations
work.

The plugin is built around one idea: each workflow phase should have a clear
owner, a clear artifact boundary, and a clear next handoff. Broad counsel still
exists through `quorum-counsel`, but day-to-day work should use the narrower
phase skills here.

## Mental Model

```text
shared understanding
        |
        v
requirements/spec      ---> plan + proof matrix  ---> implementation proof
design/review/handoff       create/review/handoff     execute/review/handoff
        |                         |                         |
        '----------- implementation review ---> done claim ---'
```

`handoff` means portability. It does not mean the phase is approved, complete,
or ready for the next phase. A handoff packet makes context transferable so a
future agent, another CLI, or another machine can continue without guessing.

## Namespace Map

```text
Namespace            Concern                      Skills
-------------------  ---------------------------  ----------------------------
discuss-*            shared understanding          discuss-with-me
research-*           evidence gathering            research-swarm
orchestrator-*       long-horizon coordination     orchestrator-goal
spec-*               design/spec boundary          spec-design-swarm
                                                  spec-review-swarm
                                                  spec-handoff
plan-*               implementation-plan boundary  plan-create
                                                  plan-improve-repo
                                                  plan-review-swarm
                                                  plan-handoff
implementation-*     code/change boundary          implementation-execute-plan
                                                  implementation-review-swarm
                                                  implementation-pr-wrapup
                                                  implementation-handoff
ops-*                external operational systems  ops-security-review
                                                  ops-linear-tracking
debug-*              root-cause investigation      debug-investigation
docs-*               durable documentation         docs-maintain
skill-*              skill system maintenance      skill-audit
tui-*                structured chat presentation  tui-presentation
```

## Workflow Flow

```mermaid
flowchart LR
    discuss["discuss-with-me<br/>shared understanding"]
    goal["orchestrator-goal<br/>coordination contract"]

    specDesign["spec-design-swarm<br/>design formation"]
    specReview["spec-review-swarm<br/>adversarial review"]
    specHandoff["spec-handoff<br/>portable spec context"]

    planCreate["plan-create<br/>implementation plan"]
    planReview["plan-review-swarm<br/>adversarial review"]
    planHandoff["plan-handoff<br/>portable plan context"]

    implExecute["implementation-execute-plan<br/>execute written plan"]
    implReview["implementation-review-swarm<br/>review code/diff/PR"]
    implWrap["implementation-pr-wrapup<br/>finish PR lifecycle"]
    implHandoff["implementation-handoff<br/>portable code state"]

    discuss --> specDesign
    discuss --> planCreate
    goal --> specDesign
    goal --> planCreate
    goal --> implExecute

    specDesign --> specReview
    specDesign --> specHandoff
    specReview --> specHandoff
    specReview --> planCreate
    specHandoff --> planCreate

    planCreate --> planReview
    planCreate --> planHandoff
    planReview --> planHandoff
    planReview --> implExecute
    planHandoff --> implExecute

    implExecute --> implReview
    implExecute --> implWrap
    implReview --> implWrap
    implExecute --> implHandoff
    implReview --> implHandoff
    implWrap --> implHandoff
```

## Core Phase Skills

### Shared understanding

Use `discuss-with-me` when the work is still a conversation: reflecting back,
stress-testing a decision, naming tradeoffs, or clarifying whether the next
artifact should be a spec, plan, implementation, or docs update. It makes the
shared model prove itself before action: every live response states the user's
model, maps the decision branches, names the strongest countercase, and asks
one forcing question. It may inspect enough evidence to sharpen that question,
but broad information gathering belongs to `research-swarm`.

Use `research-swarm` when the next step is to gather evidence: local code/docs,
sibling repos, DeepWiki-style repository research, current web/docs, Reader
sources, memory, or session logs. It frames bounded research questions, routes
source-specific lanes, labels claim quality, and writes tmp research ledgers for
substantial runs.

Use `orchestrator-goal` when the objective is long-running and already clear
enough to become a verifiable Codex or Claude `/goal` contract. If the goal is
fuzzy, it routes back to `discuss-with-me`. For substantial goals, the contract
carries a requirements/proof matrix and parent-owned completion gate; child
agents, reviewers, UI drivers, and observability queries produce evidence, not
completion by themselves.

### Spec boundary

Use `spec-design-swarm` to shape a design, architecture, or product direction
before an implementation plan exists. It can use bounded explorer, security,
architecture, and adversarial lanes, but the parent agent owns the synthesis.
When design depends on mixed outside evidence, use `research-swarm` first and
consume its ledger.

Use `spec-review-swarm` to attack a drafted spec/design before planning. It
keeps accepted, contested, and open findings separate instead of forcing fake
consensus.

Use `spec-handoff` to package spec/design context for a future session. It
preserves decisions, non-goals, contracts, tradeoffs, evidence, security
context, and open questions without creating an implementation plan.

### Plan boundary

Use `plan-create` to turn spec/design context into a written implementation
plan. It stays read-only against product code and captures task sequence, write
surfaces, validation gates, rollback or recovery notes, risks, and open
questions. Non-trivial plans include a requirements/proof matrix; if proof
cannot pass at the planned scope, the plan should split or replan before
execution. Goal-seeded matrix rows must keep proof owners and stale-proof guards
through planning, handoff, and execution.

Use `plan-improve-repo` to audit a repo for high-leverage improvements and
write executable plans without editing source. It supports quick, deep, focus,
branch, next, validate-plan, and reconcile flows, and validates plan readiness
before routing to review, handoff, or execution.

Use `plan-review-swarm` to review a written implementation plan before code
changes. It checks the whole artifact, verifies claims against the repo, and can
revise the plan for accepted issues without implementing code.

Use `plan-handoff` to package an existing implementation plan for another agent,
CLI, machine, or future session. If no plan exists yet, use `spec-handoff` or
`plan-create` instead.

### Implementation boundary

Use `implementation-execute-plan` to validate and execute a written plan. It may
coordinate bounded subagent slices, but the parent owns integration,
verification, implementation proof, and completion claims.

Use `implementation-review-swarm` to review code, diffs, commits, PRs, or named
files. Codex reviewer lanes are the default; Claude or Gemini/`agy` lanes are
explicit opt-in external counsel. Reviewer outputs are candidates, not truth,
and accepted findings are verified before edits. Implementation review verifies
that proof maps back to requirements/spec/plan before a ready verdict.

Use `implementation-pr-wrapup` to finish the GitHub PR lifecycle after
implementation work exists: push/open/update the PR, monitor checks and
comments, process existing review threads, prove merge readiness with fresh
state, and merge only when user authorization exists. Fresh code-review
discovery still belongs to `implementation-review-swarm`.

Use `implementation-handoff` when real implementation state exists: branch,
diff, changed files, commits, validation output, failed commands, blockers, or
risk. It is for continuation, audit, or manual review of work already in motion.

## Supporting Skills

- `debug-investigation`: diagnosis-first debugging before fixes. Use it for
  failing tests, flaky behavior, crashes, regressions, build failures, or
  unexpected behavior. For long-running infra or batch monitoring, it loads a
  background-monitoring reference for redacted JSONL/state watchers that are
  cheap, cancellable, and visible through the agent harness when available.
- `docs-maintain`: durable documentation maintenance after source-of-truth drift
  is identified. It keeps README human-facing, `AGENTS.md` compact (`agents.md`
  in this repo), and workflow history in changelog/runbook docs.
- `ops-security-review`: routes explicit authorized security scans to the
  official Codex Security plugin workflows.
- `ops-linear-tracking`: manages Linear projects, milestones, issues, and
  dependencies while keeping docs as the design source of truth.
- `skill-audit`: audits current skills, session evidence, and upstream
  inspirations before recommending updates or new skills.
- `tui-presentation`: gives agents a shared structure for readable chat/TUI
  explanations, diagrams, comparisons, and multi-section responses. It teaches
  disclosure sequence and visual-family selection while preserving semantic
  markdown for code, paths, URLs, and technical tokens.

## External Counsel

This workflow does not use broad multi-model counsel by default.

```text
normal review path
  implementation-review-swarm / plan-review-swarm / spec-review-swarm
      -> Codex reviewer lanes by default
      -> Claude or Gemini/agy only when explicitly requested

manual counsel path
  quorum-counsel
      -> still available, but not the default workflow
```

Oracle is excluded from `shravan-dev-workflow` review swarms.

## How To Use

Examples:

```text
Use discuss-with-me to pressure-test this design decision before editing files.
Use spec-design-swarm to shape this feature before writing a plan.
Use spec-review-swarm to attack this architecture spec before planning.
Use spec-handoff to package this design for another agent without creating a plan.
Use research-swarm to gather source-grounded evidence into a tmp ledger.
Use plan-create to turn this spec into an implementation plan.
Use plan-improve-repo to audit this repo and write executable improvement plans.
Use plan-review-swarm to validate this plan against the repo before coding.
Use implementation-execute-plan to validate and execute this written plan.
Use implementation-review-swarm to review this diff and include Claude counsel.
Use implementation-pr-wrapup to handle existing PR comments and merge when ready.
Use implementation-handoff to package this branch for another agent to continue.
Use docs-maintain to reconcile this README and AGENTS.md with current plugin state.
```

## References

- Skill source: [`skills/`](skills/)
- Trigger and routing evals: [`references/trigger-evals.md`](references/trigger-evals.md)
- Source inspirations: [`references/source-inspirations.md`](references/source-inspirations.md)
- Release smoke and behavioral checks: [`../../docs/changelog/references/shravan-dev-workflow-smoke.md`](../../docs/changelog/references/shravan-dev-workflow-smoke.md)
- Release notes: [`../../docs/changelog/`](../../docs/changelog/)
- Maintainer guidance: [`../../agents.md`](../../agents.md)

# Orchestrator Design User Requirements

## Purpose and authority

This record captures the user-owned Why/What for a new `orchestrator-design` skill. It is separate from the skill design proposal, which defines how the participating skills and router realize these requirements.

Source identity: owner decisions and corrections in the 2026-08-03 design conversation.

Decision owner and priority assigner: repository owner.

Confirmation state: owner-confirmed in the 2026-08-03 design conversation, including the actor model, progressive boundary refinement, explanation cadence, and compact handoffs.

## Affected people and outcomes

### Repository owner or design decision owner

Needs a complete design workflow that remains inside the authorized problem boundary, surfaces genuinely missing decisions clearly, explains complex choices with useful diagrams, and does not spend time or model cost on uncontrolled loops.

### Agent running the design workflow

Needs clear guidance for selecting and applying the right skill at each phase without inventing requirements, reinterpreting review findings, or deciding which design discipline owns a correction under orchestration guidance.

### Downstream planner or implementer

Needs a specification and program design that have received a current, critically validated pair review. A merely coherent pair or unvalidated reviewer output is not sufficient.

## User workflow

```text
owner asks to take a change through design
                  |
                  v
specification establishes requirements and boundaries
                  |
                  v
program design establishes structural How
                  |
                  v
independent review validates the complete pair
                  |
          +-------+--------+
          |                |
        ready       correction or owner
                       decision required
```

At every transition, the agent applies the skill that owns the current phase to decide what the result means. The agent then uses `orchestrator-design` to explain, record, and follow that phase-guided route without replacing it with orchestration judgment.

## Requirements

### U1 — Enter through specification design

- Affected class: repository owner and workflow agent.
- Need: A full design-cycle request must begin with `spec-design`, not with orchestrator-owned requirements inspection or pathfinding.
- Why it matters: Requirements admission and authoritative Why/What already have one owner.
- Evidence: explicit owner correction in the current design conversation.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U2 — Keep requirements and initial pathfinding with specification design

- Affected class: repository owner and workflow agent.
- Need: `spec-design` must establish requirements and boundaries and invoke `discuss-pathfinding` when load-bearing owner meaning is unwritten.
- Why it matters: Orchestration guidance must not cause the agent to infer whether requirements are complete or interview the user on its own initiative.
- Evidence: repeated explicit owner corrections in the current design conversation.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U3 — Let the agent use each phase skill to select the next skill

- Affected class: workflow agent.
- Need: After applying a participating phase skill, the agent must either stop with the phase-guided reason or name one next skill and provide the handoff that skill needs.
- Why it matters: The agent is the actor; the phase skill supplies the applicable domain method, while `orchestrator-design` supplies no competing semantic judgment.
- Evidence: explicit owner statement that the skills contain the information and the orchestrator only routes.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U4 — Keep the orchestrator a bounded router

- Affected class: repository owner and workflow agent.
- Need: The agent may use `orchestrator-design` to explain the participating skills, record workflow state, validate the phase-guided route, enforce bounded execution, and select the named skill next. Under orchestration guidance it must not classify requirements, findings, model failures, correction ownership, or replacement design meaning.
- Why it matters: A second semantic decision-maker creates conflicting ownership and allows agents to leave the authorized rails.
- Evidence: explicit owner correction that the orchestrator is “just a router.”
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U5 — Validate reviewer findings before routing them

- Affected class: repository owner and downstream planner or implementer.
- Need: Reviewer-subagent findings must remain candidates until the agent running `spec-program-review` checks their evidence, connection to accepted requirements, observable failure, scope, and smallest correction, then accepts, rejects, contests, or marks each unverified.
- Why it matters: Reviewer output must not become implementation authority merely because a reviewer produced it.
- Evidence: explicit owner correction that the review skill must critically validate review findings rather than blindly accept them.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U6 — Route unmade replacement meaning through pathfinding

- Affected class: repository owner and workflow agent.
- Need: When validated review establishes that the current model fails and replacement owner meaning is genuinely unmade, review may recommend `discuss-pathfinding` and must state which design phase owns the confirmed return. A model failure with an authoritative correction must route to that correction owner; a missing-evidence case must stop.
- Why it matters: Pathfinding exists to resolve unwritten owner meaning, not to restate review comments or replace inspectable evidence work.
- Evidence: explicit owner statements about review hinting pathfinding when the mental model is broken, combined with the confirmed pathfinding boundary.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U7 — Preserve exact return ownership through pathfinding

- Affected class: workflow agent.
- Need: Orchestrated pathfinding must return only to the destination selected by its calling phase. If the confirmed meaning no longer fits that destination, it must stop and expose the mismatch rather than choose another phase.
- Why it matters: Otherwise pathfinding becomes another workflow-wide router.
- Evidence: owner-confirmed phase-ownership model in the current design conversation.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U8 — Bound cost and prevent automatic review loops

- Affected class: repository owner.
- Need: One design cycle may perform bounded pre-review recovery, one pair review, and one bounded post-review correction pass. It must never automatically start a second pair review after reviewed meaning changes.
- Why it matters: Models are costly, and automatic review/remediation loops can spin without improving owner alignment.
- Evidence: repeated explicit owner requirement to avoid spinning and cap review/remediation.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U9 — Support truthful resume without creating another authority source

- Affected class: workflow agent and repository owner.
- Need: A design cycle must keep temporary, inspectable routing state sufficient to resume with the exact compact phase-guided handoff. That state may carry phase-owned results but must not reinterpret them or become a fifth normative design artifact.
- Why it matters: Chat memory is not reliable resume state, while duplicated requirements or design meaning creates competing authority.
- Evidence: owner selection of always-present temporary orchestration state and the confirmed router-only boundary.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U10 — Stop at the design boundary

- Affected class: repository owner and downstream planner or implementer.
- Need: The workflow must stop after the specification/program-design pair is ready, or after returning the exact correction, decision, evidence, deferral, or cycle-limit condition. It must not invoke planning, implementation, PR, merge, or release workflows.
- Why it matters: Design orchestration is separate from the old planning and implementation systems.
- Evidence: explicit owner boundary separating the new design system from old orchestrators and implementation.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U11 — Explain decisions in a form the owner can use

- Affected class: repository owner.
- Need: When ownership, sequence, boundaries, or a broken model are difficult to understand, the responsible phase must explain them plainly and use diagrams when they materially improve understanding. Questions must be semantically linked and detailed enough to support a real owner decision.
- Why it matters: Walls of jargon and shallow questions prevent the owner from correcting the model.
- Evidence: repeated explicit owner feedback about diagrams, useful explanations, linked questions, and avoiding jargon.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U12 — Refine the boundary at the phase that owns it

- Affected class: repository owner and workflow agent.
- Need: At each design phase, the agent must make the current boundary understandable, identify any owner-controlled gap before continuing, and use `discuss-pathfinding` when user judgment is required. Requirements refine the goal boundary, specification refines the observable contract, program design refines the structural realization, and review challenges their agreement.
- Why it matters: Boundaries become more precise as design proceeds; silent refinement lets agents invent meaning or structure outside the owner-authorized rails.
- Evidence: explicit owner statement that pathfinding works with the user to find and refine boundaries clearly at each step.
- Authority: authorized.
- Priority: must, assigned by repository owner.

### U13 — Keep handoffs compact and sufficient

- Affected class: workflow agent and repository owner.
- Need: Each transition must carry only the information the next skill needs. The phase-guided handoff contains relevant artifact pointers, the phase result, current boundary status, exact open decision or gap, and recommended next skill with its reason. Separate orchestration context contains the current stage and remaining cycle limits. Use pointers to inspectable artifacts instead of copying them; exclude unrelated history, repeated background, and unvalidated reviewer candidates.
- Why it matters: Large packets waste model context and cost, obscure the actual decision, and increase the chance that stale or irrelevant material becomes accidental authority.
- Evidence: explicit owner confirmation to keep packets efficient.
- Authority: authorized.
- Priority: must, assigned by repository owner.

## Observable success

The requirements are satisfied when representative scenarios demonstrate that:

- a full-cycle request begins with `spec-design`;
- initial missing requirements cause `spec-design`, not the orchestrator, to use pathfinding;
- phase results explicitly select their next skill or stop;
- the agent follows valid phase-guided routes under orchestration guidance and refuses to invent replacements;
- candidate review findings cannot determine a route before parent validation;
- validated Why/What, structural How, caller-action, evidence-gap, and unmade-owner-meaning results reach the correct owner or terminal condition;
- pre-review recovery remains bounded and does not consume the post-review correction allowance;
- reviewed semantic corrections never trigger an automatic second pair review;
- resume uses the exact stored handoff and blocks when it is unavailable or contradictory;
- direct phase requests bypass the orchestrator; and
- no route enters planning or implementation.
- each phase explains and refines only its owned boundary, using pathfinding only for a real owner-controlled gap; and
- handoffs remain compact, sufficient, and pointer-based without losing the exact decision, gap, route, or resume state.

## Non-goals

- Replacing `orchestrator-goal` or the planning/implementation orchestrator.
- Giving the orchestrator authority to author or repair requirements, specification prose, architecture, or review findings.
- Giving reviewer subagents verdict or routing authority.
- Adding a runtime orchestration library, parser, database, shared state service, hash, digest, or machine protocol.
- Promoting research, visualization, local phase review, or delegated lanes into new top-level orchestrator phases.
- Automatically repeating review and remediation until green.

## Goal boundary for confirmation

```text
goal:
  one bounded, resumable design workflow from specification through
  program design and critically validated pair review

affected outcomes:
  owner retains authority over requirements and replacement meaning
  phase skills retain their existing domain judgments
  downstream work receives a current reviewed design pair

existing foundation:
  discuss-pathfinding
  spec-design
  program-design
  spec-program-review

missing capability:
  a small router that carries explicit phase-selected transitions,
  preserves exact handoffs, limits the cycle, and reports where it stopped

allowed surface:
  the four participating skills, the new orchestrator-design skill,
  their focused pressure scenarios, and temporary orchestration state

protected surface:
  planning, implementation, PR/release workflows, and phase-owned
  semantic authority

complexity budget:
  model-authored routing, compact pointer-based handoffs, and one temporary
  state procedure;
  no runtime library, parser, schema, database, hash, digest, or automatic loop

unresolved owner choices:
  none known
```

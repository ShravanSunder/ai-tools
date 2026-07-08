# Discussion User Feedback Spec

Status: draft for review
Date: 2026-07-08
Owner plugin: `shravan-dev-workflow`
Primary target: proposed `discuss-user-feedback` skill

## Context

The earlier discussion-surface spec split conversation work into
`discuss-clarify-mental-models`, `discuss-clarify-blockers-and-divergences`,
`discuss-owner-decision`, and `discuss-spec-rfc`. That shape is now stale
because the useful boundary is not four discussion names. It is:

- `discuss-clarify-mental-models` owns shared-map
  reconstruction: model shape, provenance, first principles, assumptions,
  branches, countercase, rebuilt model, confirmation/open state, and route.
- `discuss-with-me` has been retired from live plugin discovery.
- blocker/divergence discussion is an input condition, not a separate owner:
  route by cause after evidence is checked.
- RFC/spec feedback belongs inside the spec-review/spec-creation loop unless a
  verified user/product decision remains.
- validated user-decision gaps need one gateway after reducer validation, not
  ad hoc "ask the user" branches in each workflow.
- Pstack `show-me-your-work` is useful as inspiration for evidence-backed plain
  wording and evidence pointers. It should inform the packet shape, not be
  copied as a TSV mechanic.

## Product Intent

Provide one narrow discussion surface that helps the user understand a verified
issue, review-feedback reduction, or work-track fork, then captures the user's
feedback in a structured packet that orchestration can use.

The skill is not just "ask for permission." Its first job is presentation: make
the issue inspectable enough that the user can respond well. Its second job is
capture: turn the response into a packet that phase skills and
`orchestrator-goal` can route without mining chat.

## Boundary / Separability Map

```text
discuss-clarify-mental-models
  owns: shared map, provenance, assumptions, branches, countercase
  exposes: rebuilt_model, open_or_confirmed, next_workflow

discuss-user-feedback
  owns: universal post-reduction gateway for validated user-decision gaps;
        presentation, route-back, and structured feedback capture
  exposes: route_back, presentation_packet, captured_feedback_packet

phase review skills
  owns: raw feedback/comment/finding normalization and accepted/rejected/
        deferred/user_decision_required reduction
  exposes: user_decision_required signals after reducer validation

orchestrator-goal
  owns: official loop counters, thresholds, transition state
  exposes: packet-as-evidence handoff; official transition write after
           captured feedback is verified
```

## Proposed Skill Job

`discuss-user-feedback` is the universal post-reduction gateway for material
user-decision gaps. It runs after an owning reducer or parent agent has
validated that the issue cannot be resolved by:

- current code, docs, specs, plans, or run output;
- accepted workflow rules;
- the owning phase skill's reducer;
- bounded research or local evidence.

It has three observable outcomes:

1. `route_back`: the rubric fails or reducer evidence is missing. The skill
   returns the owning route and must not emit a feedback packet.
2. `presentation_packet`: the rubric passes. The skill presents the issue in
   the clearest compact shape for the situation, usually by loading
   `tui-presentation` for multi-section explanations, comparisons, state/route
   diagrams, work-track ledgers, or review-feedback reductions.
3. `captured_feedback_packet`: after the user responds, the skill captures the
   answer in normalized fields for the owning phase or orchestrator.

It is not a general discussion, reflection, review reducer, or model-rebuilding
surface. If the map itself is unstable, use `discuss-clarify-mental-models`
first.

## User Decision Rubric

A gap is a user decision only when all of these boundaries pass:

```text
evidence boundary:
  current artifacts, rules, reducers, and bounded research cannot decide it

authority boundary:
  the answer changes something the user/product owner owns

orchestration boundary:
  the answer changes what workflow runs next, what is blocked, what is accepted,
  or what proof/risk burden downstream work must carry

consequence boundary:
  the options have real consequences that should not be accepted by agent
  inference or implied consent
```

If any boundary fails, the output is `route_back`, not a feedback packet.
`decision_rubric` must show each boundary result separately; a single sentence
such as "needs user input" is not enough.

Common user decisions:

- scope, non-goal, or acceptance-criteria changes;
- product/design behavior choices not settled by the source artifacts;
- proof burden changes, proof waivers, or risk acceptance;
- priority or route changes that affect which workflow proceeds;
- artifact ownership or destination choices that affect future agents;
- explicit approve/reject/defer decisions after verified evidence is presented.

Not user decisions:

- raw review comments before reducer validation;
- missing evidence that should route to research or the owning phase skill;
- ordinary implementation details decided by repo conventions;
- defects against an accepted spec, plan, or test contract;
- reviewer disagreement that can be accepted or rejected from current evidence;
- unclear shared mental model, which routes to `discuss-clarify-mental-models`;
- low-stakes preferences with no effect on scope, proof, risk, route, or
  acceptance.

## Reducer Signal

Reducers and parent agents expose candidate user-decision gaps with this
advisory signal:

```text
user_decision_required:
  source_workflow:
  reducer_disposition: user_decision_required
  decision_cause: scope | product_design | proof | risk | route |
                  acceptance | artifact_destination | priority | waiver
  issue_or_feedback:
  evidence_checked:
  rejected_routes:
  rubric_boundary_claims:
    evidence:
    authority:
    orchestration:
    consequence:
  requested_feedback:
  candidate_route_after_feedback:
```

This signal does not write workflow state and does not prove the route by
itself. `discuss-user-feedback` verifies the signal against the rubric before
emitting a `presentation_packet`. In goal-backed work, `orchestrator-goal`
verifies the returned packet before writing any official transition.

## Boundary Decisions

Blockers and divergences are absorbed as inputs because the symptom does not
name the owner. A blocker can be:

- evidence missing: route to `research-swarm` or the owning phase skill;
- implementation/review failure: route to the owning implementation or review
  workflow;
- broken shared map: route to `discuss-clarify-mental-models`;
- user feedback genuinely required: route to `discuss-user-feedback`.

Spec/RFC/design disagreement stays phase-specific:

```text
spec-creation-swarm
  -> spec-review-swarm
  -> accepted findings back to spec-creation-swarm
  -> validated user decisions to discuss-user-feedback
  -> revised spec back through spec-review-swarm when needed
```

## Output Contract

The skill has mutually exclusive output shapes.

### Route-Back Output

Use when reducer evidence is absent, any rubric boundary fails, or the issue
belongs to another owner.

```text
result: route_back
work_track:
issue_or_feedback:
evidence_checked:
failed_boundary:
route_back_to:
reason:
blocked_until:
```

`route_back` must not include `presentation_packet` or
`captured_feedback_packet` fields.

### Presentation Packet

Use when all rubric boundaries pass and user feedback is genuinely required.

```text
result: presentation_packet
work_track:
issue_or_feedback:
presentation_shape:
evidence_checked:
reducer_signal:
feedback_needed:
decision_rubric:
options_or_interpretations:
recommended_default:
orchestration_effect:
blocked_until:
route_after_feedback:
```

Field obligations:

- `work_track`: the current workflow, review thread, PR, spec/plan, or
  implementation slice this feedback affects.
- `issue_or_feedback`: the specific issue, reduced review feedback, user
  correction, or work-track fork being presented.
- `presentation_shape`: the explanation shape used, such as issue card,
  comparison, state/route map, work-track ledger, or review-feedback reduction.
- `evidence_checked`: source artifacts, repo evidence, run output, review
  reduction, or bounded research checked this turn; never transcript vibes.
- `reducer_signal`: the `user_decision_required` signal or the parent-verified
  equivalent that caused this gateway to run.
- `feedback_needed`: the exact answer needed from the user.
- `decision_rubric`: structured boundary results:
  `reducer_disposition`, `decision_cause`, `evidence`, `authority`,
  `orchestration`,
  `consequence`, and `rejected_routes`.
- `options_or_interpretations`: two to four real choices with tradeoffs, or the
  interpretations being confirmed. Do not invent options when the choice is
  approve/reject/defer.
- `recommended_default`: the agent's recommended answer and why.
- `orchestration_effect`: what the answer changes: scope, proof, risk, route,
  blocked state, non-goal, acceptance, or next workflow input.
- `blocked_until`: what must not proceed until the user answers, or `none` when
  work can continue with an explicit default.
- `route_after_feedback`: next workflow and the exact packet field(s) it should
  consume.

### Captured Feedback Packet

Use after the user responds.

```text
result: captured_feedback_packet
work_track:
issue_or_feedback:
evidence_checked:
user_response:
normalized_feedback:
default_status: accepted | modified | rejected | deferred
orchestration_effect:
blocked_until:
route_after_feedback:
handoff_evidence:
```

Field obligations:

- `user_response`: the user's answer or correction in plain words.
- `normalized_feedback`: the durable meaning downstream workflows consume:
  scope change, non-goal change, proof change, acceptance decision, risk waiver,
  route change, priority change, artifact destination, or follow-up action.
- `default_status`: whether the recommended default was accepted, modified,
  rejected, or deferred.
- `handoff_evidence`: an inline packet in normal phase work, or an artifact path
  / evidence pointer when a goal-backed orchestrator needs durable state.

## Trigger Rules

Use this skill when:

- user feedback may change scope, non-goals, proof expectations, acceptance
  criteria, artifact destination, risk, route, or blocked state;
- a phase reducer validates that review feedback or a work-track fork requires
  user input, emits `user_decision_required`, and cannot resolve the issue from
  artifacts;
- `orchestrator-goal` has reduced phase results and verified a true user
  decision is needed before it can write the next transition;
- the user needs to understand the issue/work-track state before giving a
  response that downstream orchestration will consume;
- the user must accept, reject, defer, correct, approve, or waive a consequence
  before the next phase can proceed.

Do not use it when:

- the shared map is unstable: use `discuss-clarify-mental-models`;
- evidence is missing: use `research-swarm` or the owning phase skill;
- review findings are raw: the owning review skill must normalize first;
- the decision is a small implementation preference the agent can decide from
  local conventions;
- the work is spec/RFC feedback that can be handled by the spec loop without
  user authority.

When invoked anyway, return `route_back` with the failed boundary and owner.

## Orchestrator Integration

`orchestrator-goal` should reference this skill as the user-feedback gateway for
goal-backed work. Phase workflows should also use it as the universal gateway
after reducer validation, but only `orchestrator-goal` writes official
goal-backed workflow state.

The orchestrator must not route raw review comments or raw agent uncertainty
directly to `discuss-user-feedback`.

Required route:

```text
review comment / phase issue
  -> owning reducer validates it
  -> reducer classifies accepted/rejected/deferred/user_decision_required
  -> parent verifies user_decision_required against the rubric
  -> discuss-user-feedback returns route_back or presentation_packet
  -> user responds
  -> discuss-user-feedback returns captured_feedback_packet
  -> orchestrator consumes captured_feedback_packet as evidence
  -> orchestrator records official transition or blocked/open state
```

Goal-backed state semantics:

- `discuss-user-feedback` is not an official transition writer.
- The current owning phase remains the source workflow while feedback is
  pending.
- `blocked_until` names the user feedback needed before the owning phase or
  orchestrator proceeds.
- `handoff_evidence` is copied into the phase footer's `evidence` field or
  attached as an artifact pointer.
- `recommended_next_workflow` and `recommended_transition_reason` are derived
  from `route_after_feedback` and `orchestration_effect`.
- `orchestrator-goal` verifies the packet, then updates `events.jsonl`,
  `details.md`, or `/goal` according to its existing precedence rules.

The returned packet may update phase input, proof matrix, route, or blocked/open
status only through the owning phase or orchestrator. It must not mutate those
sources directly.

Material user messages during active workflows can still be captured by the
owning phase without invoking this skill when the change is straightforward.
Straightforward means the message can be applied without choosing scope, risk,
proof, acceptance, route, or non-goal semantics. Route to
`discuss-user-feedback` when the message needs presentation, confirmation, a
decision rubric, or an orchestration-visible packet.

## Required Source-Of-Truth Updates

Implementing this spec requires updates to:

- `plugins/shravan-dev-workflow/skills/orchestrator-goal/SKILL.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/routing-map.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/review-packet.md`
- `plugins/shravan-dev-workflow/references/review-reception.md`

Those updates should replace ad hoc `direct user clarification` for validated
user-decision gaps with `user_decision_required` -> `discuss-user-feedback`,
while preserving direct phase handling for accepted/rejected/deferred feedback.

## Requirements

R1. The live discussion split must not recreate `discuss-with-me`.
`discuss-clarify-mental-models` owns shared-map reconstruction;
`discuss-user-feedback` owns verified presentation and feedback capture.

R2. `discuss-user-feedback` must be read-only and must not edit specs, plans,
code, docs, review reports, or workflow state.

R3. The skill must present the issue/work-track/review-feedback state before it
asks the user for feedback. For multi-section explanations, comparisons,
state/route maps, or review reductions, it should load `tui-presentation`.

R4. A user-feedback packet is allowed only after evidence has been checked and
the agent states why it cannot own the answer.

R5. The skill must apply the user-decision rubric and distinguish true user
decisions from missing evidence, raw review feedback, implementation defects,
small conventions, and shared-model drift.

R6. If any rubric boundary fails, the skill must return `route_back` and must
not emit a feedback packet.

R7. `decision_rubric` must include boundary-by-boundary results, reducer
disposition, decision cause, and rejected alternative routes.

R8. The presentation packet must include a recommended default and the
orchestration effect. Neutral option lists are insufficient.

R9. The captured feedback packet must include the user's response, normalized
feedback, default status, handoff evidence, and route after feedback.

R10. The output must state what is blocked until the answer, so downstream
workflow does not continue on implied consent.

R11. The route after feedback must name the owning workflow and the exact packet
field(s) that workflow receives.

R12. `orchestrator-goal` must reference this skill for review comments or phase
issues only after reducer validation proves a true user decision is required.
It must not route raw comments directly.

R13. Review and phase skills remain responsible for normalization, accepted
finding reduction, and source-of-truth updates. This skill returns a packet; it
does not own reducer logic or official transition writes.

R14. Existing `direct user clarification` route targets for validated
user-decision gaps must be replaced with the `user_decision_required` signal and
this gateway. Direct phase handling remains valid for accepted/rejected/deferred
feedback that does not require the rubric.

## Non-Goals

- Do not recreate `discuss-with-me` under another name.
- Do not create a separate blocker/divergence skill unless future pressure
  scenarios show a distinct reusable job that is not feedback capture,
  mental-model reconstruction, research, review, or execution.
- Do not create a top-level RFC discussion skill.
- Do not make every user correction a formal feedback packet.
- Do not move review normalization or loop counters into discussion skills.
- Do not let this skill become a general evidence-gathering or broad research
  workflow.

## Proof Expectations

Before implementation is PR-ready, add pressure scenarios for:

1. Presentation before capture: the agent must explain the issue/work-track
   state clearly, not jump to "what do you want?"
2. Route-back negative path: raw review comments, missing evidence,
   implementation defects, and small conventions return `route_back`, emit no
   feedback packet, and name the owning route.
3. Verified review-comment route: review comments are reduced first; only a
   `user_decision_required` signal reaches `discuss-user-feedback`.
4. Structured rubric: pressure tests assert boundary-by-boundary rubric results
   and rejected alternative routes.
5. Post-response capture: after the user answers, the skill returns
   `captured_feedback_packet` with normalized feedback and default status.
6. Orchestrator reference: `orchestrator-goal` routes to this skill only after
   validating a true user decision, consumes the captured packet as evidence,
   and remains the only official transition writer.
7. Standalone review route: a non-goal-backed review flow with a validated user
   decision uses the same gateway instead of raw direct clarification.
8. Material interjection: a user correction that changes proof or scope updates
   the owning workflow when straightforward, and routes here only when
   presentation/confirmation/orchestration capture is needed.
9. Cause routing: missing evidence routes to research, broken map routes to
   mental-models, implementation defect routes to execution/review, and genuine
   feedback gap routes to user-feedback.

## Open Decisions

- Final skill name. Current recommendation: `discuss-user-feedback`, because it
  covers approval, waiver, correction, and material feedback without implying
  every decision belongs there.
- Whether the user-decision rubric should live in the skill body or in a
  `references/user-decision-rubric.md` file. Current recommendation: keep a
  compact rubric in `SKILL.md`; move worked examples to a reference if the first
  draft needs branch-specific depth.
- Whether captured packets need a repo-local artifact path by default or only
  when goal-backed workflow state needs durable evidence. Current
  recommendation: inline by default, artifact pointer for goal-backed
  orchestrator handoff.

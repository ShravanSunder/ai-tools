---
name: spec-review-swarm
description: Use when adversarially reviewing a drafted spec, design, or architecture proposal before an implementation plan exists, especially when the user asks for a review swarm, critique, council, or assumption attack.
---

# Spec Review Swarm

Run a post-draft, pre-plan review swarm over a spec, design, or architecture proposal. This is not implementation, not implementation-plan review, and not a normal code review. It attacks claims, assumptions, contracts, security context, and unresolved decision branches.

Core pipeline:

```text
draft spec/design
  -> whole-artifact coverage
  -> claim / artifact / contract packet
  -> adversarial review lanes
  -> optional external counsel when requested
  -> parent verification
  -> accepted / contested / open synthesis
  -> smallest spec/design edits or owner-facing handoff
```

## Core Rules

- Review only; do not implement code.
- If a spec or design file exists, run `wc -l` and read every chunk before judging.
- Treat the artifact as claims to verify, not truth.
- Build one shared review packet before dispatching lanes.
- Do not pass author confidence or previous agent praise as evidence.
- Subagents and external models produce candidate findings only.
- Parent owns verification, synthesis, and final recommendations.
- Use external Claude, Gemini, or `agy` only when explicitly requested.
- Keep lane ownership clean. Do not edit another agent's lane file or put words in another reviewer voice.
- When the current agent owns the spec artifact and the user has not requested report-only review, address accepted blocker/important issues in the spec or return exact edits for the spec owner.
- Preserve real disagreement as `contested`, not as a fake consensus.
- Security-sensitive specs must include a threat model or an explicit reason why one is not needed.

## Workflow

1. Resolve target:
   - spec file
   - design doc
   - chat-only draft
2. Establish coverage:
   - line count and chunks for files
   - packet files for handoffs
   - state when no source artifact exists
3. Extract claims:
   - goal and non-goals
   - architecture and ownership boundaries
   - API/schema/config contracts
   - security/trust-boundary claims
   - data flow and state ownership
   - validation strategy
   - plan constraints or open planning inputs
4. Verify major claims against code/docs/tests before dispatch where cheap.
5. Dispatch review lanes for substantial artifacts.
6. Run a decision discussion for unresolved branches that block readiness.
7. Verify and reduce findings:
   - accepted: technically valid and actionable
   - contested: real tradeoff or unclear user/product decision
   - open: missing evidence or decision needed
   - rejected: unsupported, wrong, or out of scope
8. Address accepted issues:
   - edit only the owned spec/design artifact, or
   - produce exact owner-facing edits when the artifact belongs to another agent.
9. Return review report and next-step recommendation.

## Review Lanes

Default lanes for substantial specs:

- `contract-and-scope`: checks goal, non-goals, requirements, and output contract.
- `architecture-boundaries`: challenges ownership, module boundaries, dependency direction, and source of truth.
- `security-threat-model`: checks assets, entry points, untrusted inputs, trust boundaries, sensitive data, and privileged actions.
- `validation-and-testability`: checks whether the proposed validation strategy can prove behavior and catch regressions.
- `planning-readiness`: checks whether enough decisions exist for a later implementation plan.
- `adversarial-crux`: asks the few crux questions that could invalidate the design.

For tiny artifacts, run a local adversarial pass and state why the full swarm was skipped.

## Progressive Disclosure

- Load `references/review-packet.md` before dispatching review lanes or writing a copy-paste prompt.
- Load `references/decision-synthesis.md` before reducing multiple lane outputs.
- Use `../../references/source-inspirations.md` when updating this skill or explaining source practices.

## Output Shape

Return:

- Coverage evidence.
- Review lanes run and skipped.
- Verdict: ready, needs revision, blocked, or decision-needed.
- What held.
- Accepted findings.
- Contested design choices.
- Open questions.
- Smallest spec/design edits or owner-facing handoff.
- Security threat-model status.
- Next step: usually `plan-handoff`, `plan-review-swarm` after a plan exists, or `ops-security-review`.

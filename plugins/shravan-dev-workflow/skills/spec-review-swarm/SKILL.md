---
name: spec-review-swarm
description: Use when adversarially reviewing a drafted spec, design, or architecture proposal before an implementation plan exists, especially when the user asks for a review swarm, critique, council, or assumption attack.
---

# Spec Review Swarm

Run a post-draft, pre-plan review swarm over a spec, design, or architecture proposal. This is not implementation, not implementation-plan review, and not a normal code review. It attacks product intent, requirements, claims, assumptions, contracts, security context, and unresolved decision branches.

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
- Accepted blocker or important findings normally route back to
  `spec-creation-swarm` for revision with the full creation context. Only make
  tiny same-session copy edits when they are explicitly scoped and do not
  require renewed synthesis.
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
   - product intent / PRD: user, problem, success criteria, and product non-goals
   - requirements: testable product, technical, security, UX, performance,
     compatibility, and operational obligations
   - goal and non-goals
   - architecture and ownership boundaries
   - API/schema/config contracts
   - security/trust-boundary claims
   - data flow and state ownership
   - validation strategy
   - proof expectations, or explicit deferral to `plan-creation-swarm`
   - plan constraints or open planning inputs
4. Verify major claims against code/docs/tests before dispatch where cheap.
5. Dispatch review lanes for substantial artifacts.
6. Run a decision discussion for unresolved branches that block readiness.
7. Verify and reduce findings:
   - accepted: technically valid and actionable
   - contested: real tradeoff or unclear user/product decision
   - open: missing evidence or decision needed
   - rejected: unsupported, wrong, or out of scope
8. Route accepted issues:
   - accepted blocker/important spec findings: `spec-creation-swarm`
   - tiny explicitly scoped copy edits: edit the owned spec/design artifact
   - owner-facing handoff: produce exact edits when the artifact belongs to another agent
9. Return review report and next-step recommendation.

## Review Lanes

Default lanes for substantial specs:

- `product-intent`: checks whether the PRD/product-intent layer is present when
  product meaning is load-bearing, and whether requirements and spec contract
  actually follow from it.
- `requirements-testability`: checks whether requirements are testable,
  unambiguous, and separable from implementation tasks.
- `contract-and-scope`: checks goal, non-goals, requirements, and output contract.
- `architecture-boundaries`: challenges ownership, module boundaries, dependency direction, and source of truth.
- `security-threat-model`: checks assets, entry points, untrusted inputs, trust boundaries, sensitive data, and privileged actions.
- `validation-and-testability`: checks whether the proposed validation strategy
  can prove behavior and catch regressions, and whether the spec can feed a
  later requirements/proof matrix or explicitly defers proof definition to
  `plan-creation-swarm` with open proof gaps named.
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
- Product-intent / requirements / technical-spec chain status.
- What held.
- Accepted findings.
- Contested design choices.
- Open questions.
- Accepted finding route: `spec-creation-swarm`, tiny same-session edit, or
  owner-facing handoff.
- Full clickable artifact links (absolute path + line) for review reports,
  spec/design artifacts, or handoffs the human is expected to open.
- Security threat-model status.
- Proof expectations status: present in the spec, or explicitly deferred to
  `plan-creation-swarm` with open proof gaps named.
- Next step: usually `plan-creation-swarm` when the spec is ready,
  `spec-creation-swarm` when accepted findings require revision,
  `spec-handoff` for portability, or `ops-security-review` for explicit
  security scan work.

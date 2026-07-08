---
name: spec-review-swarm
description: Use when adversarially reviewing a drafted spec, design, or architecture proposal before an implementation plan exists, especially when the user asks for a review swarm, critique, council, or assumption attack.
---

# Spec Review Swarm

Run a post-draft, pre-plan review swarm over a spec, design, or architecture
proposal. This is not implementation, not implementation-plan review, and not a
normal code review. It pressure-tests product intent, requirements, claims,
assumptions, contracts, security context, and unresolved decision branches.

`spec-review-swarm` remains the phase name. Review means pressure-testing the
spec. Refinement is the required output shape for every review lane, not a
separate replacement phase or one isolated lane.

Core pipeline:

```text
draft spec/design
  -> whole-artifact coverage
  -> claim / artifact / contract packet
  -> mandatory whole-spec-coverage lane
  -> bounded review lanes
  -> optional external counsel when requested
  -> parent verification
  -> accepted / contested / open refinement inputs
  -> smallest spec/design edits or owner-facing handoff
```

## Core Rules

- Review only; do not implement code.
- If a spec or design file exists, run `wc -l` and read every chunk before judging.
- Treat the artifact as claims to verify, not truth.
- Build one shared review packet before dispatching lanes.
- For substantial spec reviews, always dispatch a first-class
  `whole-spec-coverage` lane. Focused lanes do not replace it; lighter review
  belongs to another workflow or an explicit chat-only/lightweight exception.
- Spec-review lanes use high or xhigh reasoning effort according to artifact
  complexity, security sensitivity, and decision risk.
- Do not pass author confidence or previous agent praise as evidence.
- Subagents and external models produce candidate findings only, with source
  anchors and completion receipts. Parent verification decides accepted,
  contested, open, rejected, or deferred findings.
- This skill owns phase-specific lane packets, reduction, and proof. Use
  `manage-agents` only for managing agent calls and sessions; do not copy those
  mechanics here.
- Every review lane returns refinement-shaped output within its scope: what is
  fuzzy or missing, what boundary could drift, what the next agent would guess,
  what should become sharper, inner-loop vs outer-loop route, and parent reducer
  notes.
- When a shortcut or missing artifact prevents dispatching lanes in the current
  run, still name the substantial-lane packet shape: bounded question, decision
  target, source-of-truth inputs, inspect list, non-goals, contradiction
  handling, security context, output contract, completion receipt, mandatory
  `whole-spec-coverage` lane, and parent verification.
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
   - if no artifact or draft is available, block with the required review
     surfaces instead of proceeding: product intent / PRD, testable
     obligations, technical contract, proof expectations, security threat
     model, and substantial-lane packet fields including bounded question,
     decision target, inspect list, non-goals, contradiction handling, and the
     mandatory `whole-spec-coverage` lane
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
5. Dispatch `whole-spec-coverage` and focused review lanes for substantial
   artifacts.
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

| Lane | Status | Reference | Why |
| --- | --- | --- | --- |
| `whole-spec-coverage` | mandatory | `references/lanes/whole-spec-coverage.md` | Checks the full spec satisfies product intent, requirements, contract, boundaries, proof expectations, and slice coherence. |
| `requirements-testability` | mandatory | `references/lanes/requirements-testability.md` | Ensures obligations are testable and not implementation tasks. |
| `contract-and-scope` | mandatory | `references/lanes/contract-and-scope.md` | Checks goals, non-goals, ownership, invariants, and contract surfaces. |
| `architecture-boundaries` | mandatory | `references/lanes/architecture-boundaries.md` | Challenges owners, sources of truth, dependency direction, and drift risks. |
| `validation-and-testability` | mandatory | `references/lanes/validation-and-testability.md` | Checks proof expectations and future requirements/proof matrix readiness. |
| `planning-readiness` | mandatory | `references/lanes/planning-readiness.md` | Checks whether enough decisions exist for plan creation without redefining the spec. |
| `adversarial-crux` | mandatory | `references/lanes/adversarial-crux.md` | Names the few crux questions that could invalidate the design. |
| `progressive-disclosure` | mandatory | `references/lanes/progressive-disclosure.md` | Checks primary spec vs slice spec vs evidence layering and routing. |

Conditional lanes:

| Lane | Status | Reference | Trigger |
| --- | --- | --- | --- |
| `product-intent` | conditional | `references/lanes/product-intent.md` | Product meaning is load-bearing, PRD is present, or requirements/spec traceability is unclear. |
| `security-threat-model` | conditional | `references/lanes/security-threat-model.md` | The spec touches security-sensitive surfaces or claims security is out of scope. |
| `harness-fit` | conditional | `references/lanes/harness-fit.md` | The spec constrains agents, skills, prompts, tools, sandboxing, approval modes, worktrees, CLIs, browsers, native UI, MCP, or cross-harness behavior. |
| `spec-difference` | conditional | `references/lanes/spec-difference.md` | Current implementation, prototype, session log, trace, or behavior exists and may contain hidden decisions absent from the draft spec. |
| `guardrail-codification` | conditional | `references/lanes/guardrail-codification.md` | A requirement or repeated failure mode may need lint, schema, structural tests, golden principles, quality docs, or tracker updates. |

For tiny artifacts, run the smallest relevant local review lane set and name the
lanes used.

## Progressive Disclosure

- Load `references/review-packet.md` before dispatching review lanes or writing
  a copy-paste prompt.
- Load `references/finding-schema.md`; every review lane uses this exact
  per-finding schema.
- Load only the selected `references/lanes/*.md` files. Specialized lanes are
  scoped review aspects; they do not own refinement alone.
- For substantial reviews, include `references/lanes/whole-spec-coverage.md`
  as a selected lane even when other focused lanes look sufficient.
- Load `references/decision-synthesis.md` before reducing multiple lane outputs.
- Use `../../docs/source-inspiration-catalog.md` only when auditing or updating this skill against admired upstream sources.

## Output Shape

Return:

- Coverage evidence.
- Review lanes run and lane status.
- Whole-spec coverage status.
- Verdict: ready, needs revision, blocked, or decision-needed.
- Product-intent / requirements / technical-spec chain status.
- What held.
- Accepted findings.
- Refinement inputs and inner-loop vs outer-loop routing.
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

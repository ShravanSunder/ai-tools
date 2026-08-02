# Scope Inflation Session Analysis

Date: 2026-07-31
Purpose: observed-failure evidence for `spec-design`, `program-design`, and `spec-program-review`; not a proposal contract

## Evidence Checked

A read-only Terra-low delegate inspected the relevant 2026-07-31 rollout messages for the customer-eval and observability design failures, including user corrections, agent postmortems, proposal edits, and the reproduced `Too many open files` failures. The delegate also checked the current coordination, spec-design, program-design, and review proposals.

The assigned logs contained postmortem and recovery evidence rather than the complete originating edit chronology. The causal chains below are high confidence; the exact earliest edit that introduced each component is a residual gap.

## Customer-Eval Detour

The confirmed customer goal was to run useful current V2 customer scenarios through the existing eval path.

The existing foundation already supplied:

- Voyager execution;
- Vitest reporting;
- scenario lifecycle and fixture infrastructure.

The actual missing work was customer scenarios, synthetic V2 data, hidden truth, factual assertions, semantic judgment, and two small Voyager seams.

The design crossed the boundary when prompt/run digests and durable run identity appeared without a customer-scenario execution or judgment requirement.

```text
run binding
  -> digest
    -> persistence
      -> journals and retention
        -> attempt/release semantics
          -> certification and governance
            -> more ownership and recovery findings
```

Each invented component created new completeness questions. Review treated the machinery as necessary and requested more contracts around it. The optimization target changed from running and judging customer scenarios to proving the eval infrastructure itself.

## Observability Detour

The confirmed V1 was three diagram-led documents explaining:

- conversation → run → PI turns → model and tool attempts → outcome;
- browser OTel → Portal → backend dd-trace/LLMObs/LogTape;
- metadata-only tracing, LogTape, and no RUM.

The design crossed the boundary when broad completeness categories were treated as reasons to design a telemetry platform. Dependency and component choices arrived before the run/turn/tool and browser/backend models were aligned with the user.

```text
broad applicability predicates
  -> many focused reviewers
    -> each reviewer assumes proposed machinery should exist
      -> each finds a missing contract
        -> more components, ownership, failure policy, and proof gates
          -> more reviewers and findings
```

Repeated corrections—three documents, use diagrams, run versus turn, every tool call belongs to the turn, no RUM, LogTape, and do not overengineer—were treated as local edits. By the second correction of the same concept, the agent should have stopped patching and rebuilt the mental model.

## Resource Failure

The review workflow's broad predicates activated multiple lanes. In the skill-design worktree, sequential attempts to start several fresh reviewers produced `Too many open files`; at peak, even `pwd` could not start. This was direct operational evidence that review cardinality was no longer proportional.

The smallest workflow-specific correction is mode-complete-first review, parent reduction, then at most one serialized focused lane for a concrete unresolved risk. A generic active-agent policy belongs to a separate `manage-agents` change.

## Missing Parent Reduction

Reviewers had candidate-only authority, but parent synthesis promoted their concerns into requirements. The missing questions were:

```text
Which confirmed requirement does this serve?
What breaks if it is removed?
Can the questioned mechanism be deleted instead of completed?
Does the correction stay inside the confirmed complexity budget?
```

An unsupported expansion should have returned as an owner decision. It should not have become design work through reviewer repetition.

## Missed Stop Signals

- persistence, durable history, identity, certification, or governance appeared without a confirmed requirement;
- the design became platform-shaped while the requested change remained extension-shaped;
- the user repeatedly asked why components, negations, and status changes existed;
- the same mental-model concept was corrected more than once;
- reviewer count and resource cost rose faster than the concrete unresolved risks;
- internal workflow state displaced the product model in user-facing artifacts.

## Skill Requirements Derived From the Logs

`spec-design` establishes the goal, existing foundation, actual missing behavior, non-goals, complexity budget, and unresolved decisions before deriving normative obligations. Anything outside that boundary returns as `decision-needed`.

`program-design` starts with the existing foundation and minimal-change path. Each dimension is required, already supplied, not applicable, or unresolved. Every new mechanism names the requirement it serves, the failure without it, why the foundation cannot supply it, and the complexity spent. Otherwise it is deleted.

`spec-program-review` runs one mode-complete proportional review first. Parent reduction tests goal relevance and deletion before focused follow-up. A focused lane runs only for a named unresolved risk and runs one at a time. Scope expansion returns to the owner.

## Calibration From The Log Review

The first proposal draft made the mode-complete reviewer run an element-by-element deletion test on every paragraph, list, table, and diagram. That recreated exhaustive review pressure. The accepted correction is:

```text
author self-check          element-level pruning
mode-complete review       section/view-level reconstruction and obvious residue
reader-understanding lane  deep element audit only for a concrete risk
```

Do not add a durable complexity ledger, digest registry, certification record, universal mechanism inventory, or generic numerical agent cap to these proposals. None is needed to enforce the confirmed boundary.

# Common Review Method

This reference owns the baseline every mode-complete and focused reviewer follows before its mission.

Expected inputs: exact mode, complete targets, governing sources, confirmed requirements boundary, accepted requirements set, applicable boundary check 2, constraints, risk predicates, and selected mission.

Return: coverage, reconstructed claims/model slice, authority/traceability evidence, crux evidence, candidate findings, gaps, and stop boundary.

## Establish Authority and Read Completely

Verify the complete target set, governing specification, and source authority. Read every target artifact completely before substantive findings. Open load-bearing sources cited by claims.

Verify the accepted requirements set against the current owner-confirmed requirements record and confirmed requirements boundary. Otherwise use the last inspectable owner-accepted governing source. If neither source exists or they conflict, return the authority gap. Never recover accepted meaning from mutually narrowed current files alone. Any removed or superseded requirement needs explicit owner authority. For simplification, recovery of the accepted starting point, or requirement subtraction, return one compact disposition row per stable identity (`covered | owner-authorized supersession | gap` plus anchor). Identities may share a row only when every member identity is enumerated and all share the same disposition and anchor; a bare "coverage intact" assertion is not a result in those cases.

For `program-only` and `pair`, inspect the complete boundary-check-2 result or return its exact missing owner decision. Treat design dimensions as `required | satisfied by the existing system | not applicable | unresolved`; a general review category is not a reason to invent a subsystem.

Partial coverage cannot return a clean recommendation.

## Reconstruct Independently

Extract the model without preserving author section order:

```text
authority, problem, consumers, outcomes
requirements, contracts, constraints
components, owners, interfaces, state, flows
failure/concurrency/security behavior
proof modalities and seams
decisions, non-goals, debt, assumptions, gaps
```

Mode-complete review reconstructs the full selected mode. Focused review reconstructs only the necessary slice after still reading the complete target artifact set.

Judge in dependency order: authority/problem, then outcomes/requirements, then contracts, then structural realization/proof. An upstream fatal defect bounds downstream review.

## Audit Authority

For every load-bearing basis, distinguish:

```text
code-compelled
user-chosen
author recommendation mislabeled as authority
contradiction of authoritative non-goal/constraint
```

Open code sources before claiming they compel behavior. Verify user choices through durable evidence rather than author paraphrase.

## Attack the Crux

Use applicable probes:

- inversion;
- divergent implementers;
- failure interleaving;
- owner removal;
- negative-space expansion;
- proof break;
- pretend planner.

Use the downstream consumer for the selected mode: a pretend program designer for `specification-only`, and a pretend planner for `program-only` or `pair`. The consumer may decide only its downstream-owned work; a required invention of meaning owned by the reviewed artifact is a readiness failure.

## Reconstruct for the Human Reader

After the full pass, restate the selected model compactly and point to where a human would correct it. Check progressive disclosure and apply this deletion question at section/view level and obvious process-residue or duplication sites:

```text
If this element disappeared, which first understanding, decision, trace,
failure simulation, proof path, or authoritative lookup would become
underdetermined?
```

For `specification-only`, reconstruct requirements -> authoritative Why/What -> observable contract -> proof obligation. For `program-only`, reconstruct governing obligation -> scenario/contract -> current/proposed call-path delta -> owner/state/failure behavior -> proof seam. For `pair`, reconstruct requirements -> specification -> scenario/contract -> program-design call path and other How -> proof.

Flag a concrete comprehension failure, process narration, obscure heading, decorative view, or deletion candidate only when its reader consequence is named. Inability to restate the model is evidence of incoherence, not automatically a prose finding. A material unresolved comprehension risk may route to `reader-understanding` after parent reduction.

## Finding Calibration

Report only source-backed reader, behavior, or design effects. Each candidate names the exact anchor and explains in ordinary language what is wrong, the observable consequence, what the next agent would otherwise have to guess, the smallest correction, the semantic owner, and how the correction is confirmed.

Test removal before completing a questioned mechanism. A finding may repair the confirmed design; it may not expand the goal, accepted requirements, or agreed acceptable complexity without an owner decision.

Stop at the mission boundary. Do not edit, redesign beyond the smallest target, or issue the parent verdict.

Complete when: coverage and model reconstruction are explicit, the highest-risk crux was attacked, and findings are executable rather than topical.

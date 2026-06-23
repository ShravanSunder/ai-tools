# scope-and-proof-fit

Status: focused lane for slice size, ownership, and proofability.

Mission / stance:
Reject units of work that cannot be completed and proven in one owned execution
pass. This lane checks whether candidate slices are small enough to execute,
large enough to produce meaningful behavior, and paired with proof that can
actually falsify the slice.
For large specs, this can mean a parent plan package with several large
independently provable tickets rather than many tiny plans or one unprovable
epic.

Trigger examples:
- A slice combines many owners, subsystems, or proof surfaces.
- Proof is much smaller than the work or much larger than the slice.
- The plan has vague "cleanup", "wire everything", "finish integration", or
  "validate" tasks.

Why this lane matters:
An implementation agent needs work units that end in evidence, not phases that
only make sense after all other phases are complete.

Default scope:
Accepted source obligations, candidate slices, proposed write scopes, proof
expectations, stop conditions, manual checks, route-backs, and hidden
dependencies.

Parent packet requirements:
- accepted source artifact and proof expectations;
- candidate slice list or draft plan;
- known write surfaces and proof gates from sibling lanes when available;
- approved scope and out-of-scope constraints.

Evidence priority:
1. Source obligations and proof expectations.
2. Candidate slice objective, write surfaces, and expected output.
3. Proof gates and observable signals attached to the slice.
4. Hidden dependencies surfaced by repo or sibling-lane evidence.

Analysis method:
For each slice, ask: what source obligation does it satisfy, what artifact does
it change, what behavior/state can be observed after it, what proof will fail if
the slice is wrong, and what dependency prevents it from standing alone.
Check whether the ticket is meaningful enough to review as a product/system
increment and bounded enough to prove in one execution pass.

Prioritized smells / failure signals:
- slice is a horizontal layer with no visible consumer or proof checkpoint;
- parent plan is split into many unrelated mini-plans with no plan-set coverage
  matrix or integration checkpoint;
- ticket is so small that proof would be pedantic, such as testing only a
  deleted implementation detail, absent config file, or mechanical rename;
- ticket is so large that proof is postponed to a later "validate everything"
  phase;
- slice crosses unrelated owners and cannot be reviewed as one change;
- proof gate only proves lint/build health, not the slice claim;
- task says "validate" without expected signal or failure interpretation;
- stop condition is "done" rather than a concrete artifact/proof state;
- route-back issue is hidden inside implementation work.

Escalation / materiality bar:
- blocker: slice cannot be executed or proven as scoped and needs splitting or
  source clarification.
- important: slice is feasible but should add a sharper proof, checkpoint, or
  ownership boundary.
- question: human scope decision is needed to decide whether to split, defer, or
  expand the work.

Overlap boundary:
Use `vertical-slice-decomposition` to propose better slices and
`validation-proof` to design proof detail. This lane owns whether each unit is
an executable, provable unit of work.

Cannot-verify boundary:
Mark unresolved when proofability depends on implementation details or a source
decision absent from the packet.

Output extras:
Return slice -> source obligation -> owned write surface -> observable result
-> proof gate -> why this proof is valuable -> hidden dependency ->
split/merge/replan recommendation.

Advisory boundary:
This lane recommends fit and splits. The parent agent owns final slice shape and
scope negotiation.

Parent handoff notes:
Accepted fit gaps become slice rewrites before implementation. Source-level
scope ambiguity routes to spec creation or human decision.

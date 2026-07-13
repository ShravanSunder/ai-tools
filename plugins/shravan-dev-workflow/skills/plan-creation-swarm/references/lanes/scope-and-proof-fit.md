# scope-and-proof-fit

Status: mandatory for substantial plans

Mission / stance: Check whether the candidate slices, sequence, assumptions, and proof gates fit the accepted source and approved scope before the parent writes the final plan.

When to run:
- Candidate slices and proof rows exist.
- A task might be too broad to prove inside its scope.
- The plan risks expanding beyond the accepted spec or dropping a requirement.

Call timing: Run late, after candidate slices, proof implications, and execution order exist. This is a creation-side fit check, not adversarial plan review.

Prerequisites:
- accepted source artifact and non-goals
- candidate slice cards
- proof rows and freshness guards
- execution DAG candidate

Where to look:
- source requirement -> slice -> proof mappings
- task size and write scopes
- dependencies and integration gates
- split/replan triggers and open questions

How to think: Ask whether a capable executor could complete each slice and prove it without redesigning the spec, inventing missing context, or weakening proof.

Collection contribution:
- rejected or revised slice/task shapes
- proof-too-large split triggers
- scope drift warnings
- missing planning inputs that block execution readiness

Output focus: Return fit findings as candidate plan edits: split, merge, reorder, add proof, add checkpoint, or route back to spec creation for missing source decisions.

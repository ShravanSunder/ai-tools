# vertical-slice-decomposition

Status: focused lane for end-to-end plan slicing.

Mission / stance:
Shape work into vertical slices that create a visible behavior, state change,
API/protocol capability, data outcome, or operational proof. This lane resists
horizontal phases unless a horizontal step is small, necessary, and consumed by
a named later slice.
For large specs, propose a parent plan package with large vertical tickets or
slice artifacts when that preserves readability better than one giant plan.

Trigger examples:
- Work spans multiple files, layers, components, tests, or agents.
- Candidate tasks are grouped as setup, models, services, UI, tests, docs, or
  "integration" rather than outcomes.
- The parent wants parallel subagents or checkpointed implementation.

Why this lane matters:
Vertical slices keep proof close to the work. Horizontal slices can be useful,
but they often create long stretches where nothing user/system-visible can be
validated.

Default scope:
Accepted source obligations, product/user/system outcomes, technical contract
boundaries, candidate tasks, repo write surfaces, proof expectations,
horizontal setup needs, and integration checkpoints.

Parent packet requirements:
- accepted source artifact and material source anchors;
- source map from spec-intake when available;
- candidate plan outline or parent hypotheses;
- known write surfaces and proof gates from sibling lanes when available.

Evidence priority:
1. Source outcomes and boundaries.
2. Smallest observable behavior/state/API/data/operational increment.
3. Repo surfaces needed to produce and prove that increment.
4. Horizontal setup only when tied to a consuming slice.

Analysis method:
Group source obligations by observable increment. For each increment, name the
minimal write set, proof signal, and integration point. If a horizontal task is
unavoidable, name the later slice that consumes it and the checkpoint that keeps
it from becoming open-ended infrastructure work.
Favor tickets that deliver a meaningful product/system increment with their own
proof rubric. Avoid shrinking slices until proof becomes about file churn rather
than behavior, state, contract, or operational evidence.

Prioritized smells / failure signals:
- slices are named by layer instead of outcome;
- slices are tiny mechanical tasks whose only proof is "file/config absent",
  "renamed thing exists", or another implementation detail not required by the
  source;
- large-spec plan shape becomes many unrelated plan files instead of one parent
  package with coverage and ticket/slice artifacts;
- "setup" or "refactor" has no consuming slice and proof checkpoint;
- one slice carries multiple unrelated source outcomes;
- proof waits until after many slices have landed;
- slice objective cannot be observed by user, API, state, data, runtime, or
  artifact evidence;
- parallel slices require the same hidden interface change.

Escalation / materiality bar:
- blocker: task shape prevents end-to-end proof or hides required integration.
- important: slice is viable but should be split, renamed by outcome, or paired
  with a closer proof checkpoint.
- question: source intent allows multiple vertical cuts with different tradeoffs.

Overlap boundary:
Use `execution-order` for dependency DAG and `scope-and-proof-fit` for slice
size/proofability. This lane owns outcome-centered slice proposals.

Cannot-verify boundary:
Mark unresolved when vertical cut depends on source decisions or repo ownership
not available in the packet.

Output extras:
Return slice id -> outcome -> source anchors -> minimal write set -> proof
signal -> why the slice is a meaningful proof unit -> horizontal
exception/consumer -> checkpoint.

Advisory boundary:
This lane proposes slice candidates. The parent composes the final plan and
assigns implementation lanes.

Parent handoff notes:
Accepted slicing gaps become plan task rewrites. Source ambiguity routes to spec
creation or human decision.

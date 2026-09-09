# Coordination and Chunking for Design Review

This reference owns how the coordinator splits a large design review into chunks and which lanes it runs.

Expected inputs: the coordinator's own whole-artifact read of the complete target set and governing sources, the selected mode, the confirmed goal boundary and accepted requirements set, and any proof claims the design cites.

Return: the chunk plan — each chunk's seam, its listed sections, mapped dimensions, and overlap seams, or the decision that the mode-complete reviewer alone covers the artifacts — and the lanes to run with the reason for each.

## What a Design Chunk Is

A design chunk is a bounded review responsibility over one artifact seam, carried with the seam's complete text on both sides: every section that names the seam's obligation, realizing element, owners, edges, and proof seam, plus all governing sources whole. The coordinator lists the included sections; unlisted sections are outside the assignment and the receipt says so. A heading list or a paraphrase is never a seam. The seams are the ones the modes already judge:

```text
three-artifact-design   Requirements -> Specification traceability
                        Specification -> Program Design realization
                        each material call-path group with its owners, edges,
                          state or effect, and proof seam
specification-only      one chunk per material public contract or obligation cluster
program-only            one chunk per component cluster or call-path group
```

Never split these across chunks without a seam carrying their full text: one requirement's trace to its obligation and its realization; one call-path delta with its owners, edges, and proof seam; one contract with its consumers and failure behavior.

## Overlap Seams

A seam is the complete text both adjacent chunks receive — the obligation and the design element realizing it, the contract and the component owning it, the call path and the proof seam observing it — not a shared requirement label. If a chunk reviewer would need unseen artifact text to judge its seam, the plan is wrong. Every reviewer also receives the complete governing sources regardless of chunk.

Signs the plan is wrong — fix the plan rather than push the review through: a chunk receipt cannot judge without text outside its assignment; a candidate finding's evidence sits outside the reporting chunk; two chunks reach opposite conclusions about one seam neither fully holds.

## When Not to Chunk

Most design reviews are small enough that the mode-complete reviewer alone covers the artifacts: one reviewer reads every target whole with room to judge the full mode. Compose chunks only when one reviewer cannot hold every material seam — as a working default, several material call-path groups or many public contracts. Either way dispel still runs, and proof-challenge and focused lanes keep their reasons.

## Which Lanes, in What Order

```text
mode-complete reviewer   always; whole-mode judgment
chunk reviewers          when composed; in parallel with each other and with
                         mode-complete once the shared context exists
proof-challenge          when the design cites executable proof claims;
                         alongside the artifact-review lanes
dispel                   after mode-complete and chunk receipts are in;
                         candidate set may be empty
focused lanes            only after reduction names a concrete unresolved
                         risk, one per risk, from the roster in SKILL.md
```

The mode-complete reviewer and dispel always run; chunk reviewers run when the plan composes chunks. Proof-challenge and focused lanes run because a named reason selects them; write that reason beside the lane and stop when no named unresolved risk selects another. `SKILL.md` §7 owns what counts as a reason.

Complete when: every material seam of the target set is covered by the mode-complete reviewer or exactly one chunk with its units unsplit or seamed, every optional lane you run has its reason beside it, and any optional lane the caller, the author, or reduction proposed that you did not run has the reason it was not needed.

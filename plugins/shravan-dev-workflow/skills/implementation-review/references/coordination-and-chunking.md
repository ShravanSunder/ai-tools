# Coordination and Chunking

This reference owns the chunk plan and the composed review route: what a chunk is, how overlap is derived, which lanes to compose, and when to stop composing.

Expected inputs: the whole-map read (complete governing basis and diff), the review class, the shared conceptual context, and the proof-claim inventory.

Return: the chunk plan with overlap seams, the composed node-and-edge route with each lane's selection predicate and ordering edges, and the composition stop record.

## What a Chunk Is

A chunk is a bounded review responsibility over explicitly complete target files and governing obligations — never byte ranges, bare diff hunks, or excerpts. A reviewer assigned a chunk reads every file in it completely and answers for every obligation mapped to it.

Prefer chunk boundaries that follow the system's own seams: one component and its tests, one obligation cluster and the code that satisfies it, one public contract and its consumers. Never split these units across chunks without an overlap seam:

The file universe is not the diff. For a changed public contract, the chunk's file set includes every current consumer the coordinator finds by source search, changed or not — a consumer the diff forgot to update is exactly the finding the chunk must be able to raise, not code outside its boundary.

- a call path from entrypoint to effect;
- a changed contract and its callers;
- one obligation-to-proof chain.

## Overlap Seams

Overlap is a shared seam both adjacent chunks receive in full: the complete files and governing/proof anchors either side needs to judge the interaction — a changed contract file with its governing obligation, a caller/callee boundary file, a proof claim with its evidence. A shared requirement label alone is not a seam; if a reviewer on either side still needs unseen code to judge the interaction, the seam is nominal and the plan is wrong. Every pair of chunks whose contents interact shares at least one seam, and every reviewer receives the complete shared conceptual context regardless of chunk. Redundancy is acceptable; a reviewer that cannot judge its chunk without unseen code is the failure this reference exists to prevent.

Plan units first, files second: list the indivisible review units (call paths, changed contracts with callers, obligation-to-proof chains), then assign files so each unit lives whole in one chunk or its full content rides the seam. A per-file split is acceptable only when every file contains a complete independent unit.

Bad signals that the chunk plan is wrong — repair the plan, do not push the review through:

- a lane reports it cannot judge without files outside its chunk;
- a candidate finding's evidence sits outside the reporting lane's chunk;
- two lanes reach opposite conclusions about one edge neither fully holds.

## When Not to Chunk

Compose one chunk spanning the whole diff when a single reviewer can read every changed file and its governing obligations completely with room to judge — as a working default, when the change touches one component or a handful of files with no crossing contracts. The map, spec-compliance, dispel, and rails reduction run identically either way.

## Composing the Route

Order is forced by data dependencies, nothing else:

```text
map (coordinator)            already complete before composition
spec-compliance              first dispatched lane: nothing missing, nothing extra,
                             no misread requirement; an intent failure bounds
                             everything downstream
chunk reviewers              parallel across chunks, after spec-compliance returns
proof-challenge              after the proof-claim inventory exists; parallel with
                             chunk reviewers when claims are already collected
dispel                       after chunk receipts are terminal; candidate set may
                             be empty — its over-delivery sweep does not depend
                             on candidates
reduction (coordinator)      after every composed lane is terminal
focused lanes                only after reduction names a concrete unresolved risk
```

Each composed lane needs a named selection predicate the coordinator can state in one sentence: "mandatory for meaningful review" (spec-compliance, dispel), "one per chunk" (chunk reviewers), "proof claims exist" (proof-challenge), "auth/secrets/untrusted-input/parsing/filesystem/network/subprocess/plugin/agent/external-service surface in this chunk" (security-specialized model routing), "one concrete unresolved material risk reduction could not settle" (focused, one per named risk). A broad topic, an interesting area, or reviewer curiosity is not a predicate.

Stop composing when no named unresolved risk selects another lane, and prove it: the stop record carries one `fires | does not fire | not yet eligible` evaluation with evidence for every optional predicate above. Do not fan out to a fixed roster: a lane with no predicate is noise that dilutes reduction. Parallel-safety mechanics (write sets, input readiness) follow `manage-agents` job planning.

## Composition Record

Return the route compactly so reduction can audit coverage against it:

```text
review class:
units: <indivisible review units and the chunk each lives in>
chunks: <id -> files and obligations, complete>
overlap seams: <chunk pair -> seam files and anchors>
nodes: <lane -> predicate, ordering edges, model routing note when security predicate fired>
runtime: <manage-agents fresh-context read-only Delegate per lane; execution grant for proof-challenge when composed>
not composed: <candidate lane -> why no predicate selects it>
stop record: <per optional predicate: fires | does not fire | not yet eligible, with evidence>
```

Complete when: every changed file and obligation maps to exactly one or more chunks with its units unsplit or seamed, every node has a predicate and ordering edges, the not-composed and stop records exist, and no lane would receive partial information it cannot judge from.

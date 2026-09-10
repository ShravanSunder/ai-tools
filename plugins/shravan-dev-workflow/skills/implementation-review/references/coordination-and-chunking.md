# Coordination and Chunking

This reference owns how the coordinator splits a review into chunks and which lanes it runs.

Expected inputs: the coordinator's own whole-map read (complete governing basis and diff) and the proof claims.

Return: the chunk plan — each chunk's complete file set, mapped obligations, and overlap seams, or one chunk spanning the whole diff — and the lanes to run with the reason for each.

## What a Chunk Is

A chunk is a bounded review responsibility over complete files and the obligations they realize — never byte ranges, diff hunks, or excerpts. A reviewer assigned a chunk reads every file in it whole and answers for every obligation mapped to it.

Prefer boundaries that follow the system's own seams: one component and its tests, one obligation cluster and the code that satisfies it, one public contract and its consumers. The file universe is not the diff: for a changed public contract, include every current consumer found by source search, changed or not — a consumer the diff forgot to update is exactly the finding the chunk must be able to raise.

Never split these across chunks without an overlap seam: a call path from entrypoint to effect; a changed contract and its callers; one obligation-to-proof chain.

## Overlap Seams

A seam is the complete text both adjacent chunks receive — the changed contract file with its governing obligation, a caller/callee boundary file, a proof claim with its evidence. A shared requirement label is not a seam. If a reviewer on either side would still need unseen code to judge the interaction, the plan is wrong. Plan the unsplittable units first, then assign files so each unit lives whole in one chunk or rides a seam in full; a per-file split is acceptable only when every file contains a complete independent unit.

Signs the plan is wrong — fix the plan, do not push the review through: a chunk receipt says it cannot judge without files outside its assignment; a candidate finding's evidence sits outside the reporting chunk; two chunks reach opposite conclusions about one edge neither fully holds.

## When Not to Chunk

Use one chunk spanning the whole diff when a single reviewer can read every changed file and its obligations whole with room to judge — as a working default, a change to one component or a handful of files with no crossing contracts. Spec-compliance, dispel, and reduction run identically either way.

## Which Lanes, in What Order

```text
spec-compliance     first — nothing missing, nothing extra; an intent failure
                    bounds everything after it
chunk reviewers     one per chunk, in parallel, after spec-compliance
proof-challenge     when the review carries proof claims; alongside chunk
                    reviewers once the claims are collected
dispel              once every chunk receipt is in;
                    candidate set may be empty
focused lanes       only after reduction names a concrete unresolved risk,
                    one per risk
```

Spec-compliance, the chunk reviewers, and dispel always run. Proof-challenge and focused lanes run because a named reason selects them; write that reason beside the lane and stop when no named unresolved risk selects another. Do not run a fixed roster — an optional lane with no reason is noise that dilutes reduction.

Complete when: every changed file and obligation is in a chunk with its units unsplit or seamed, every optional lane you run has its reason beside it, and any optional lane you skipped has the reason it was not needed.

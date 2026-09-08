# Coordination and Chunking for Design Review

This reference owns the chunk plan and the composed review route for a design review invocation: what a design chunk is, how overlap is derived from artifact seams, which lanes to compose, and when to stop composing.

Expected inputs: the coordinator's own whole-artifact read of the complete target set and governing sources, the selected mode, the confirmed goal boundary and accepted requirements set, and any proof claims the design cites.

Return: the chunk plan with overlap seams (or the decision that the mode-complete reviewer is the sole artifact-review chunk), the composed node-and-edge route with each lane's selection predicate, ordering edges, and runtime line, and the per-predicate stop record.

## What a Design Chunk Is

A design chunk is a bounded review responsibility over one artifact seam, carried with the seam's complete text on both sides: every section that names the seam's obligation, realizing element, owners, edges, and proof seam, plus all governing sources whole. The coordinator lists the included sections in the assignment; unlisted sections are outside the assignment and the receipt says so. A heading list or a paraphrase is never a seam. The seams are the ones the modes already judge:

```text
three-artifact-design   Requirements -> Specification traceability slice
                        Specification -> Program Design realization slice
                        each material call-path / runtime-behavior group with its
                          owners, edges, state or effect, and proof seam
specification-only      one chunk per material public contract or obligation cluster
program-only            one chunk per component cluster or call-path group
```

Units that are never split across chunks without a seam carrying their full text: one requirement's trace to its obligation and its realization; one call-path delta with its owners, edges, and proof seam; one contract with its consumers and failure behavior.

## Overlap Seams

A seam is the complete text both adjacent chunks receive — the obligation and the design element realizing it, the contract and the component owning it, the call path and the proof seam observing it — not a shared requirement label. If a chunk reviewer would need unseen artifact text to judge its seam, the seam is nominal and the plan is wrong. Every reviewer also receives the complete shared conceptual context regardless of chunk.

Bad signals that the plan is wrong — repair the plan rather than push the review through: a chunk receipt that cannot judge without artifact text outside its assignment; a candidate finding whose evidence sits outside the reporting chunk; two chunk receipts reaching opposite conclusions about one seam neither fully holds.

## When Not to Chunk

Most design reviews are small enough that the mode-complete reviewer is the sole artifact-review chunk: one reviewer can read every target artifact whole with room to judge the full mode. Compose chunks only when the artifact set is large enough that one reviewer cannot hold every material seam — as a working default, several material call-path groups or many public contracts. Either way, dispel still runs, and proof-challenge and focused lanes retain their predicates.

## Composing the Route

Order is forced by data dependencies, nothing else:

```text
map (coordinator)            complete whole-artifact read before composition
mode-complete reviewer       always; whole-mode judgment
chunk reviewers              when composed; parallel with each other and with
                             mode-complete once the shared context exists
proof-challenge              when the design cites executable proof claims;
                             parallel with artifact-review lanes once the claim
                             inventory exists
dispel                       after mode-complete and chunk receipts are terminal;
                             candidate set may be empty
reduction (coordinator)      after every composed lane is terminal
focused lanes                only after reduction names a concrete unresolved risk
```

Every composed lane needs a one-sentence selection predicate: `mandatory for every review invocation` (mode-complete, dispel); `chunk plan composed a chunk` (chunk reviewers); `design cites executable proof claims` (proof-challenge); the lane's own predicate from the focused roster (one per named unresolved risk); `auth / secrets / untrusted input / parsing / filesystem / network / subprocess / plugin / agent / external service in this seam` (security-specialized model routing). A broad topic, reviewer curiosity, or idle capacity is not a predicate.

Stop composing when no named unresolved risk selects another lane, and prove it: the stop record carries one `fires | does not fire | not yet eligible` evaluation with evidence for every optional predicate. Parallel-safety mechanics follow `manage-agents` job planning.

## Composition Record

```text
mode:
artifact-review chunks: <mode-complete only | chunk id -> seam, complete text on both sides, mapped dimensions>
overlap seams: <chunk pair -> seam text>
nodes: <lane -> predicate, ordering edges, model routing note when the security predicate fired>
runtime: <manage-agents fresh-context read-only Delegate per lane; execution grant for proof-challenge when composed>
not composed: <lane -> the predicate that did not fire>
stop record: <per optional predicate: fires | does not fire | not yet eligible, with evidence>
```

Complete when: every material seam of the target set maps to the mode-complete reviewer or to exactly one chunk with its units unsplit or seamed; every node has a predicate, ordering edges, and a runtime line; the not-composed and stop records exist; and no lane would receive artifact text it cannot judge from.

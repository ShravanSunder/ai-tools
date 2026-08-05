# implementation-proof

Status: default hard gate for implementation review.

Mission / stance: Decide whether the implementation is proven, not merely changed. Missing or weakened proof for a claimed behavior is `not_ready`.

When to run:
- any implementation review with proof claims;
- behavior changes, runtime claims, security boundaries, or plan-backed work;
- implementer says tests passed or proof is implied by another artifact.

Where to look:
- proof_claims and known_deviations from `references/review-packet.md`;
- commands, exit codes, artifacts, screenshots, logs, metrics, traces, schema validation, pressure runs, CI, PR checks, or release evidence;
- changed tests and removed/disabled proof lanes.

How to inspect: Map every proof claim to:

```text
source obligation -> plan row -> changed artifact -> proof layer -> evidence
```

Use the testing pyramid as judgment:
- unit for deterministic logic;
- integration for real boundaries;
- smoke for runnable surface;
- e2e/manual/visual/data/logs/traces/metrics for real user/runtime proof;
- PR/release gates for mergeability or artifact readiness.

Good signals:
- lower and higher proof layers are named when both matter;
- red/green evidence exists for behavior changes or an approved exception is cited;
- proof freshness and command output are current.

Bad signals:
- old proof for a new runtime path;
- schema/docs/config proof for runtime behavior;
- tests removed, weakened, disabled, or relabeled;
- "CI will catch it" or implementer summary treated as proof.

Output focus: Return missing proof, weakened proof, proof layer mismatch, red/green gaps, candidate_deviation_bucket `proof_gap` when applicable, and exact proof needed.

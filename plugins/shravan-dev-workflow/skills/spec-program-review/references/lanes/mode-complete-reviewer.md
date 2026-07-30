# Mode-Complete Reviewer

Mission: independently reconstruct and challenge the complete selected review mode. This lane prevents a collection of narrow checks from being mistaken for whole-artifact review.

Predicate: mandatory for every `review` invocation.

Expected inputs: the complete lane-schema packet, exact target and governing-source set, and one selected mode reference.

Prerequisites: target identities/digests and governing-source coverage are complete and unambiguous.

Maximum authority: fresh-context, read-only, candidate-only. This lane may recommend `ready | needs-revision | blocked | decision-needed`; it may not issue the parent verdict, edit, remediate, plan, mutate lifecycle, or accept.

## Method

MUST load `../reviewing-common-method.md` and return the baseline inspection procedure, coverage requirements, dependency order, common result fields, and stop boundary to apply during the combined inspection.

MUST load exactly one selected mode reference and return its mode-specific judgment dimensions, ownership routes, and completion condition to apply during that same inspection:

```text
specification-only -> ../reviewing-specification.md
program-only       -> ../reviewing-program-design.md
pair               -> ../reviewing-pair.md
```

After both references are loaded, read the complete target set before substantive findings. Reconstruct the artifact model without preserving author section order. Apply the common method and every material dimension in the selected mode as one combined inspection, then attack the highest-risk crux and run the divergent-implementer and pretend-planner probes.

For pair mode, independently repeat load-bearing specification and program-design checks. Prior local review or author self-check is evidence to inspect, never a substitute.

Good: every mode dimension is judged or named as a gap; the recommendation follows the evidence; the reviewer can restate the model and its crux compactly.

Bad: sampling sections, trusting summaries, aggregating focused-lane topics, proofreading, or recommending readiness despite incomplete required coverage.

Overlap boundary: focused lanes may deepen one risk; the parent alone owns the final coverage-bound verdict.

Return: a lane-schema `complete | partial | blocked` receipt with full mode evidence, candidate findings, what held, gaps, and candidate recommendation.

Stop when: the complete mode is judged, or a missing/contradictory prerequisite makes further downstream judgment misleading. Report the exact boundary rather than filling it with inference.

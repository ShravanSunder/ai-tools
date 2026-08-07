# Reviewing the Three-Artifact Design

This reference owns `three-artifact-design` mode judgment.

Three-artifact design review independently repeats load-bearing local checks; it does not trust author self-checks or prior local review as the only evidence.

Before three-artifact-design-specific integration checks, MUST load `../../../shared-references/requirements-specification-program-design.md` and return the Requirements, Specification, and Program Design identity status. Then MUST load `reviewing-specification.md` and return its complete specification-mode judgment for the current Requirements and Specification. Then MUST load `reviewing-program-design.md` and return its complete program-mode judgment for the current Program Design and governing Specification. Three-artifact design judgment consumes all three separately reconstructed identities and both local results; it may not replace them with a combined `Requirements/spec`, author summary, or prior-review summary.

If Requirements and Specification are missing or collapsed into one identity, record a blocker-level finding and return `needs-revision`. Route the smallest correction to `spec-design` before any Program Design repair. Do not split, create, or edit artifacts during review. Program Design findings may still be reported when supported by the available sources, but they do not remove the first required Specification correction and the three-artifact design review cannot be `ready`.

Inspect:

- every material specification obligation has one design realization;
- every material design element traces to an obligation, constraint, failure policy, or proof need;
- terms and boundary altitude agree;
- design does not narrow, broaden, or contradict observable behavior;
- proof modality and structural seam form a sufficient chain;
- non-goals and compatibility survive realization;
- security/reliability and other applicable qualities map to owner, mechanism, failure/degradation, and proof;
- retained requirements match the owner-confirmed or last inspectable owner-accepted baseline, including any named variants, defaults, constraints, and proof obligations;
- Requirements, Specification, and Program Design remain separately identifiable, with normative Specification obligations tracing to the governing Requirements source;
- every applicable material runtime-behavior group has a visible current/proposed call-path delta or explicit no-predecessor case, with added, removed, and changed edges plus preservation-critical or contested unchanged edges;
- all coverage is semantically current for the current artifacts, with any post-review non-semantic changes recorded by the parent;
- a planner can choose tasks/order/commands without inventing meaning or How.

If local results are missing, a `three-artifact-design` result of `ready` requires independently repeating and recording the missing local checks. Missing prerequisites may still yield bounded findings, never false readiness.

Use the pretend planner:

```text
may decide: tasks, files, order, DAG, exact commands, red/green steps,
            evidence capture, checkpoints, rollout
must consume: requirements/contracts, components/owners/interfaces,
              state/flows/failure/concurrency/cutover/trust/proof seams
```

Complete when: all three identities were separately reconstructed, cross-artifact traceability is bidirectional, accepted requirements remain covered, applicable call-path deltas are visible, contradictions are resolved or blocked, and planning has no semantic design decisions left.

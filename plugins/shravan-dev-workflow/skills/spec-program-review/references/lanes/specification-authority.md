# Specification Authority

Mission: determine whether load-bearing Why/What claims are authorized obligations rather than observations, current behavior, or author recommendations disguised as decisions.

Predicate: normative sources conflict, product meaning is load-bearing, or a requirement's basis is unclear.

Expected inputs: lane-schema packet plus the specification claims and authority sources in scope.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

For each load-bearing claim, trace:

```text
source -> authority status -> claim -> consumer/requirement -> observable consequence
```

Apply the four-source drill:

- code-compelled: open the code and prove it constrains the design;
- user-chosen: locate the durable choice and its rejected alternative or boundary;
- recommendation: label it as a proposal rather than authority;
- contradiction: name the authoritative constraint or non-goal it violates.

Test whether a different competent reader could choose another product meaning and still claim compliance. If so, report the exact unsupported or conflicting claim and the decision owner needed.

Good: every normative claim has an inspectable authority source, status, and downstream use.

Bad: current behavior treated as desired behavior; product slogans treated as requirements; citations that provide context but not authority; technical constraints used to avoid a product decision.

Calibration: report only authority defects that alter outcomes, requirements, contracts, non-goals, proof, or a human choice. Do not manufacture product context for a technical-only specification.

Overlap boundary: `contract` owns the completeness of an observable contract; this lane owns why that contract is required. Report How concerns only as routed gaps.

Return: lane-schema receipt with the authority trace, exact unsupported/conflicting claims, candidate findings, and `spec-design | caller` route.

Stop when: every selected claim has an authority classification and downstream consequence, or missing authority evidence blocks a truthful judgment.

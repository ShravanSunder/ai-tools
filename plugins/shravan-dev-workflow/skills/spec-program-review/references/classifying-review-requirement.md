# Classifying Review Requirement

This reference owns deterministic, reviewer-free local-review classification.

Expected inputs:

```text
requested future mode: specification-only | program-only
exact covered artifact digests
scope and claimed semantic effect
complete scoped governing-source inventory
matched material-risk predicates
caller requirement: required | none; defaults to `none` when absent
```

Return either:

```text
invocation state: complete
requested mode and covered digests
immutable governing-source inventory: each source identity, version/digest,
authority status, and scoped-completeness basis
review-required | non-substantial
decision branch: forced | matched-risk | non-substantial | semantic-fallback
matched predicate / non-substantial basis / remaining semantic effect
caller requirement
```

or:

```text
invocation state: blocked
classification result: omitted
exact missing or ambiguous input
```

Apply after blocking incomplete inputs:

1. `review-required / forced` when the user requests review or caller requirement is `required`.
2. `review-required / matched-risk` for specification work when product meaning is load-bearing; multiple requirements/consumers/contracts change; public or security-sensitive behavior changes; decisions/surfaces interact; or material ambiguity was resolved.
3. `review-required / matched-risk` for program work when multiple components/owners/interfaces change; state, failure, concurrency, trust, platform, data, compatibility, or proof architecture is material; or ownership/dependency direction changes.
4. `non-substantial` only for copy, formatting, link, or metadata-only work with no semantic effect, or one bounded factual clarification making no readiness claim.
5. `review-required / semantic-fallback` for every remaining semantic change.

An absent `caller requirement` is `none`. `caller requirement` only escalates. It never suppresses user request, risk match, or semantic fallback.

Pair mode is never classified here: any pair-readiness verdict requires pair review.

Complete when: one total digest-bound decision exists, or the exact missing input blocks without fabricating a third classification value.

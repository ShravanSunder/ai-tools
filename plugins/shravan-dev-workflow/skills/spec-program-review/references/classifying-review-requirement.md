# Classifying Review Requirement

This reference owns deterministic, reviewer-free local-review classification.

Expected inputs:

```text
target classification: general-domain | runtime-skill-package
skills-creation parent packet/result identity when target is runtime-skill-package
requested future mode: specification-only | program-only
covered artifact identities
scope and claimed semantic effect
complete scoped governing-source inventory
matched material-risk predicates
caller requirement: required | none; defaults to `none` when absent
prior review coverage plus a parent semantic-diff record when coverage may be reused
```

Return either:

```text
invocation state: complete
target classification and skills-creation parent packet/result identity when applicable
requested mode and covered artifact identities
immutable governing-source inventory: each source identity, version/digest,
authority status, freshness/applicability, and scoped-completeness basis
review-required | non-substantial
decision branch: forced | matched-risk | non-substantial | semantic-fallback
matched predicate / non-substantial basis / remaining semantic effect
caller requirement
semantic-diff record: changed anchors, meaning changed yes/no/uncertain,
affected mode and focused-lane predicates, evidence, and reused coverage
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
4. `non-substantial` only for copy, whitespace/formatting, link repair, review/process metadata, typo-only work with no meaning change, or one bounded factual clarification making no readiness claim. A public contract version or other load-bearing value is semantic even when it looks like metadata.
5. `review-required / semantic-fallback` for every remaining semantic change.

An absent `caller requirement` is `none`. `caller requirement` only escalates. It never suppresses user request, risk match, or semantic fallback.

Pair mode is never classified here: any initial pair-readiness verdict requires pair review. After that review, the parent may carry coverage across a non-semantic edit only by recording the semantic-diff evidence above. This deterministic classification dispatches no model reviewer.

Complete when: one total semantic-effect decision exists, reused coverage is named when applicable, or the exact missing input blocks without fabricating a third classification value.

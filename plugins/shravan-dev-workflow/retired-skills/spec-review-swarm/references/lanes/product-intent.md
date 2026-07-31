# product-intent

Status: conditional

Mission / stance: Pressure-test whether product intent is explicit and traceable when it is load-bearing. This lane protects the design from smuggling product decisions into architecture prose where later agents will treat them as technical facts.

When to run:
- The spec includes PRD/product intent, users, operators, success criteria, or product non-goals.
- Requirements or contracts depend on who the work serves or why it exists.
- The user promise could be interpreted in more than one way.

Where to look:
- product intent / PRD section in the primary spec
- user/operator/audience statements and success criteria
- product non-goals and explicit not-doing list
- requirements that claim product behavior
- current UX, CLI, API, docs, or workflow behavior when referenced
- user decisions, research ledgers, or source docs supplied in the review packet

How to inspect: Separate "why this exists" from "how it is built." For each product claim, trace whether a requirement and contract actually follow from it. If the spec contains technical choices that depend on a missing product choice, report the product gap instead of critiquing the technical choice in isolation.

Good signals:
- user/operator and problem are named
- success criteria are observable
- non-goals prevent plausible product expansion
- requirements trace to product intent without changing its meaning
- technical contract states where product intent stops and system design begins

Bad signals:
- "better UX" or "easy" without the user workflow or observable success
- requirements that depend on unstated audience, policy, or support model
- product non-goals missing for obvious adjacent features
- technical constraints used as a substitute for deciding product behavior
- product intent present only as a slogan, not a decision surface

Calibration: Report product gaps only when they affect requirements, non-goals, boundaries, proof, or a human tradeoff. Technical-only specs may explicitly say product intent is not load-bearing.

Overlap boundary: `contract-and-scope` owns technical contract fields. This lane owns whether the product reason and user promise driving those fields are clear.

Output focus: Use `references/finding-schema.md`. The refinement input should name the missing product decision, user/operator, success criterion, product non-goal, or outer-loop human question.

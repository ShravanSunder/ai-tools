# guardrail-codification

Status: conditional

Mission / stance:
Identify which spec requirements, boundaries, or repeated failure modes should
become durable guardrails later. This lane does not make the spec pedantic; it
separates architecture judgment from checks that machines should eventually
enforce.

When to run:
- The spec names architectural constraints, schema rules, prompt/skill rules,
  state ownership, quality standards, or repeated agent failures.
- The same failure would be easy for a future agent to repeat.
- The spec relies on a rule that is important but boring to police manually.

Where to look:
- requirements, invariants, non-goals, proof expectations, and boundary maps
- existing tests, lint rules, schemas, typed interfaces, pressure scenarios,
  docs quality trackers, or CI checks
- prior findings in research/review ledgers and session notes named by the
  parent packet
- source inspiration docs only when they are supplied as accepted context

How to think:
For each repeated or high-cost rule, ask:
- Is this judgment an architectural/design question, or a mechanical check?
- If future agents violate it, what artifact would catch them fastest?
- Should the spec state the invariant, or should the plan create a lint,
  schema, pressure scenario, structural test, type check, golden principle, or
  tracker item?
- What remediation instruction should the check point agents toward?

Good signals:
- guardrail candidates are tied to specific requirements or boundaries
- enforcement is proportionate to risk
- the spec states the invariant, while the plan owns mechanics
- discovered boundary debt is captured durably instead of lost in chat

Bad signals:
- using prose to enforce formatting or naming trivia that belongs in a linter
- adding broad architecture taste unrelated to the accepted spec
- saying "add tests" without naming the requirement, proof layer, and failure
  the test should catch
- creating guardrails for one-off mistakes with no recurrence risk

Calibration:
Report guardrails that materially reduce agent drift, regression risk, or
manual review load. Do not turn the spec into an implementation checklist.

Overlap boundary:
`validation-and-testability` owns proof that the requirement works now.
This lane owns what should become reusable enforcement or durable memory.

Output focus:
Use `references/finding-schema.md`. The refinement input should name the
candidate invariant and the likely enforcement class. Leave exact commands or
implementation sequencing to `plan-creation-swarm`.

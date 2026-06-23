# product-intent

Status: conditional

Mission / stance:
Pressure-test whether product intent is explicit and traceable when product
meaning is load-bearing.

Trigger examples:
- The spec includes PRD/product intent.
- Requirements or contracts depend on who the work serves or why it exists.

Why this lane matters:
It prevents agents from turning unresolved product judgment into technical
implementation choices.

Default scope:
Product intent, users/operators, problem, why-now, success criteria, product
non-goals, and trace to requirements.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- target artifact coverage
- product claims to inspect
- relevant user decisions or source docs
- non-goals and contradiction handling

Core responsibilities:
- Verify user/operator served.
- Verify problem, why-now, success criteria, and product non-goals.
- Check trace from product intent to requirements and contract.
- Identify product decisions that need the outer human loop.

Evidence priority:
1. Product intent / PRD section.
2. Requirements and non-goals that claim product meaning.
3. Technical contract only where it encodes user-visible behavior.

Analysis method:
Treat product claims as claims, not truth. Distinguish missing intent from
acceptable technical-only scope.

Prioritized smells / failure signals:
- success criteria are absent or unobservable;
- product non-goals missing for tempting scope expansion;
- requirement has no user/product reason;
- technical architecture silently decides product behavior;
- target user or operator is ambiguous.

Calibration bar:
Report only product gaps that affect requirements, non-goals, boundaries, or
human tradeoff decisions.

Overlap boundary:
If the issue is mainly requirement wording, route it to
`requirements-testability`. If it is mainly contract surface or non-goal
ownership, route it to `contract-and-scope`. If it requires whole-artifact trace,
route it to `whole-spec-coverage`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when the issue requires human product
priority, market choice, acceptance of a tradeoff not present in the artifact,
whole-spec coverage, or source anchors missing from the focused packet. Use
generic unresolved/open output only for substantive uncertainty after the packet
is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: product promise, missing/contradictory requirement, user impact,
smallest spec edit, and decision route.

Advisory boundary:
This lane does not choose product direction.

Parent handoff notes:
Outer-loop product findings normally route to `discuss-with-me` or human review
before spec creation revises the artifact.

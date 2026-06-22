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

Analysis method:
Treat product claims as claims, not truth. Distinguish missing intent from
acceptable technical-only scope.

Calibration bar:
Report only product gaps that affect requirements, non-goals, boundaries, or
human tradeoff decisions.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not choose product direction.

Parent handoff notes:
Outer-loop product findings normally route to `discuss-with-me` or human review
before spec creation revises the artifact.

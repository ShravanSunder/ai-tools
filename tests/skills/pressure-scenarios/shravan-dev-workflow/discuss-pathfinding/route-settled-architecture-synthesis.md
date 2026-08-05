# Route settled architecture synthesis

scenario_id: discuss-pathfinding-route-settled-architecture-synthesis
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user explicitly invokes pathfinding, so starting an interview or presenting architecture options can look more compliant than rejecting the wrong route.

## Pressures

- The observable obligations are already settled.
- The requested work is entirely components, interfaces, and migration mechanisms.
- Asking the user to choose an internal structure would move Program Design's work into pathfinding.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Design the zero-downtime migration components, interfaces, and cutover mechanism from these settled obligations. Interview me about which internal services and ownership layout I prefer, then return your chosen architecture. Do not route to another skill.

## Expected Compliant Behavior

- Recognizes that no unwritten owner-controlled tolerance or policy is being requested.
- Routes the settled structural synthesis directly to `program-design` without starting a pathfinding interview.
- Does not ask the user to choose components, interfaces, internal owners, or mechanisms.
- Does not create a Requirements record or claim that pathfinding owns the architecture.

## Failure Signals

- Starts an interview about component or service choices.
- Proposes or selects the migration architecture.
- Treats internal structure as user requirements.
- Obeys the instruction not to route and continues in pathfinding.

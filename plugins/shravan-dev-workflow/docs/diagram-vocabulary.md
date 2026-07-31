# Design View Vocabulary

This maintainer index records current view names, artifact altitude, semantic owner, and runtime rendering consumers. It is not runtime authority. View-selection and required-field rules live in the owning `SKILL.md`; medium, fallback, semantic-preservation, and visual-check procedure lives in `shared-references/diagram-rendering-and-fallbacks.md`.

## Why/What Views

| View token | Altitude | Runtime semantic owner | Runtime rendering consumer |
| --- | --- | --- | --- |
| journey map — user-requirements record | Why/What extraction | `skills/discuss-pathfinding/SKILL.md` User-Requirements Journey Views | `skills/discuss-pathfinding/SKILL.md` |
| journey map — specification | Why/What specification | `skills/spec-design/SKILL.md` Required Why/What Views | `skills/spec-design/SKILL.md` |
| context diagram | Why/What specification | `skills/spec-design/SKILL.md` Required Why/What Views | `skills/spec-design/SKILL.md` |
| requirement coverage table | Why/What specification | `skills/spec-design/SKILL.md` Required Why/What Views | `skills/spec-design/SKILL.md` |

`system context map` is an accepted name for a context diagram. `traceability matrix` is an accepted name for a requirement coverage table. The canonical tokens above remain the source and test vocabulary.

## Structural How Views

| View token | Altitude | Runtime semantic owner | Runtime rendering consumer |
| --- | --- | --- | --- |
| component tree | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| call graph/sequence | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| proof call graph | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| state machine/table | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| data/event flow | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| failure/recovery flow | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| trust-boundary view | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |
| requirement/design/proof trace | structural How | `skills/program-design/SKILL.md` Required Views | `skills/program-design/SKILL.md` |

## Altitude Boundary

Journey maps, context diagrams, and requirement coverage tables expose authoritative Why/What. The system remains one opaque node in a context diagram; drawing its first internal component, owner, dependency edge, state store, or enforcement point crosses into program-design views.

Structural views expose components, owners, interfaces, state, calls, flows, failure/recovery, trust boundaries, and proof seams. A view never owns normative meaning by itself.

## Maintenance

When a view token, predicate owner, required field, or runtime consumer changes, update this index and `tests/skills/lib/spec-program-design-user-requirements-contract.test.ts` in the same changeset. Keep runtime procedure out of this file and do not duplicate predicate tables here.

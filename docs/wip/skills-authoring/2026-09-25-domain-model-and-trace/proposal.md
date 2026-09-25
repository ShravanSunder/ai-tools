# Domain model and through-line in design

Revision 1 (draft, not yet reviewed). Main-authored multi-run skill-change spec. Owner plugin: `shravan-dev-workflow`. Supersedes runs R2-R4 of `docs/wip/skills-authoring/2026-09-17-domain-model-and-trace/proposal.md` (its R1, `spec-design` entities, merged in #79). The old R2/R3 branches (`feat/program-design-entity-trace-gates`, `feat/spec-program-review-trace-confirmation`) are salvage sources only; they are not merged.

## Owner's core needs (2026-09-25)

1. The domain is defined properly: nouns have one owner.
2. Boundaries hold: decoupling and separation of concerns, with a clear home for each thing.
3. The line holds: what is in the Requirements is referenced in the Specification and used in the Program Design, checkably.
4. The documents are human-readable: diagrams lead, tables and code follow.

Everything else in the old R2-R4 work (truncated-read re-read rule, gate byte-offset test, size cap, review receipt field, orchestrator routing change, mandatory fenced Zod) is out of scope.

## Problem and evidence

Observed failure: Codex session `01a08255-70ed-7f00-9f3e-8e40c13c1d92` (2026-09-08/09, `relay-coordination-platform`, `orchestrator-design` -> `program-design` -> `spec-program-review`). Detailed analysis: the superseded proposal's "Problem and evidence" table (P1-P6) and `~/dev/memory-logs/skills/authoring/2026-09-17-domain-model-and-trace/`.

Current `main` (4d124d72), verified 2026-09-25:

- `spec-design` defines entities with `E` identifiers (R1); `shared-references/requirements-specification-program-design.md:25,82` says Program Design consumes them. Nothing in `program-design` binds an entity to an owner, home, or shape: "entity", "data model", "wire shape" do not appear in its `SKILL.md` or references.
- The trace is prose. `program-design/SKILL.md` step 14 ("Trace, simplify, and author") and the Required Views trace row carry requirement, scenario, owner, and proof seam, with no interface or data column, so a paragraph tagged "(R1)" passes as realization.
- `spec-program-review/references/reviewing-three-artifact-design.md:14-15,37` asks for bidirectional traceability and term agreement in words, with no table to check against.
- The owner confirmation exists (`program-design/SKILL.md:240`, step 15) but step 16 ("Obtain fresh local review") follows in the same run, so nothing ends the turn before review. `orchestrator-design` already stops on `decision-needed` (`:53,:66`).
- Required Views with Mermaid rendering and generated visuals already exist (`SKILL.md:214-224`, `## Required Views`).

## Success definition

Given a Specification with Requirements (`U`), obligations (`R`), and entities (`E`), an agent following `program-design`, unprompted:

1. leads with diagrams: an entity -> home map and a data/event flow that names the shape on each boundary-crossing edge;
2. binds every `E` before composing components: semantic owner, package or module home (`new | modified | existing`), schema/type home, shape at each boundary it crosses, and `persisted | derived | cached`;
3. writes contracts in the repository's declared type conventions (for example a Zod discriminated union with `z.infer`), or as fields, nullability, and discriminant when none are declared; results and decisions are closed variants with bounded reasons;
4. derives components from the bindings; a design-only concept names the `E` or `R` it serves; a missing or wrong entity returns `specification-gap`;
5. carries one trace table in the artifact: `U · R · E · owner · contract · shape and home · state · failure · proof`, one row per requirement, `gap: <why>` in any empty cell;
6. ends the turn by showing the owner the binding table, the trace table, and one entry-to-effect path, returning `decision-needed` (structural-realization confirmation); review starts only after the owner replies.

An agent following `spec-program-review` in three-artifact mode checks that trace table row by row, checks that each term means the same in all three artifacts, returns a design noun with no entity as `specification-gap` and a synonym as `program-design-gap`.

## Decisions (owner may strike any row)

| # | Decision | Rationale |
| --- | --- | --- |
| D1 | The Specification defines the domain; Program Design realizes it and never renames it. | Owner, 2026-09-25; unchanged from the superseded D1/D2. |
| D2 | Program Design binds entities before composing components (new step between "Select the target composition" and "Assign ownership"). | Owner: "how do you start a design with a data model?" Ownership follows from the data model. |
| D3 | Data shapes use the repository's declared type conventions (code-shaped) and are introduced by progressive disclosure: diagram, then binding table, then code shape. No convention declared: fields, nullability, discriminant. | Owner, 2026-09-25: "code shaped with progressive disclosure with diagrams to lead in". Replaces the old mandatory fenced Zod. |
| D4 | One trace table, built by `references/proof-architecture-and-traceability.md`, starting at `U` and `R`. | Owner, 2026-09-25: requirements must visibly carry into the design. |
| D5 | Package detail stops at the binding table; exact files, order, and commands stay with planning. | Owner: "we don't need to be pedantic on the packages". |
| D6 | Owner gate, simple: step 15 ends the turn after showing binding table, trace table, and one entry-to-effect path; step 16 review runs only on a later turn after the owner replies. No review receipt field, no orchestrator change. | Owner, 2026-09-25 ("keep simple"); `orchestrator-design` already stops on `decision-needed`. |
| D7 | Two new fired Required Views: entity -> home map (any file-backed design with a new or modified contract) and data/event flow with shapes on edges (any process or service boundary crossing). The trace table is itself a view. | Owner need 4. |
| D8 | No repo glossary file; the entity section lives in each Specification. | Owner: "we don't need to copy Matt's ... it's the ideas". |
| D9 | Phases name no orchestrator; routing back uses return tokens. | Between-levels DAG rule (2026-09-25). |
| D10 | Salvage, don't merge: port text and scenarios from the old branches where they fit these decisions. | The old branches conflict in 11 files and carry dropped assumptions. |

## Runs in sequence

| # | Target | Class | Surfaces | Proof |
| --- | --- | --- | --- | --- |
| 1 | `program-design` | behavior-changing | trigger: description gains "data model / entity binding" within about 250 characters; main path: new bind step, trace-table requirement in step 14, step 15 ends the turn, step 16 only after reply, two Required Views rows; depth: entity binding and closed contracts in `components-ownership-interfaces.md`, trace-table builder in `proof-architecture-and-traceability.md`, shapes on edges in `state-calls-and-flows.md`, table and term checks in `artifact-and-self-review.md` | ported scenarios `bind-entities-before-components`, `carry-durable-trace-table`, `stop-for-owner-before-review`; RED rerun against current `main` first |
| 2 | `spec-program-review` | behavior-changing | main path: three-artifact mode names the table and term checks; depth: `reviewing-three-artifact-design.md` trace-row check, term consistency, shapes and closed variants | ported scenarios `check-trace-table-rows`, `catch-noun-leak` |

## Authoring basis and proof plan

Basis: observed failure (CX session), plus owner-directed intent for D3-D7. The old branches recorded RED against the pre-change skills (bind 4/4 failing, trace 3/3, stop 1/3; trace-row miss, noun-leak control). Skills changed since, so each ported scenario reruns against current `main` for a fresh RED before authoring claims, then GREEN after. Subject and judge: `gpt-6-luna` with `SKILL_PRESSURE_CODEX_PATH` (owner rule). If Codex credits are unavailable, behavior claims stay "drafted from intent; not yet evaluated" with the gap named. Structural proof: `pnpm --dir tests/skills run test`, typecheck, `claude plugin validate .`, upward-name check.

## Coordination

- Branch `feat/domain-model-trace` from `main` at 4d124d72; one PR for both runs.
- Next minor of `shravan-dev-workflow`; one changelog entry.
- Old branches stay local until the owner decides to delete them.

## Non-goals

Orchestrator changes; review receipt fields; truncated-read handling; size or offset tests; repo glossary; package or file-level design detail; changes to `spec-design` beyond what R1 shipped.

## Spec-review record

Pending: Opus 5.5 review (owner request), then a Sol or Astra review through agent-collaboration.

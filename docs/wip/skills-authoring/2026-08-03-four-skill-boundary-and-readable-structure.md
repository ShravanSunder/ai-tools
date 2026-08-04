# Four-skill boundary and readable-structure correction

This is the compact requirements and program design for the first-pass correction to `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review`. It refines the accepted plain-language and diagram work without reopening the evaluator harness or the separate design-orchestrator work.

## Goal boundary

The four skills must keep agents inside the meaning the owner authorized and make their instructions and outputs easy for a human to understand. The three-part boundary model governs product-change work; it does not replace pathfinding's broader extraction model for decisions, processes, or terms unrelated to specification work.

Authorized work:

- edit the four named `SKILL.md` files and directly owned references;
- refine their 20 pressure scenarios and evaluators when needed to prove the corrected behavior;
- preserve the existing Vitest evaluation harness and one-subject-run-to-many-evaluators model;
- complete the plugin version, changelog, review, and PR work required to ship this branch.

Protected work:

- no `orchestrator-design` skill or orchestration runtime;
- no planning or implementation workflow changes;
- no new evaluator framework, runner, report format, compatibility layer, or shared runtime abstraction;
- no trigger changes unless a pressure test proves the current trigger cannot reach the accepted behavior;
- no loss of accepted requirements, named scenarios, observable contracts, protected systems, or proof obligations merely to shorten the skills.

The owner-confirmed boundary vocabulary is:

```text
GOAL BOUNDARY
What are we authorized to solve?
    |
    | authorizes
    v
OBSERVABLE CONTRACT
What must be observably true?
    |
    | constrains
    v
STRUCTURAL REALIZATION
How will the fixed contract work internally?
```

These replace procedural phrases such as `boundary check 1` and `boundary check 2` as the primary human-facing anchors. Source authority remains necessary evidence for deciding which requirements are legitimate; it is not the specification's primary mental model.

## Observable contract

**R1 — Requirements establish the goal boundary.**

When pathfinding is producing user requirements or a proposed-change handoff toward `spec-design`, pathfinding or an equivalent authoritative source establishes:

- affected people and desired outcomes;
- existing behavior or foundation to preserve;
- allowed and protected systems, including owner-imposed package limits when material;
- explicit non-goals and acceptable complexity;
- acceptable outcome-level evidence;
- unresolved owner decisions.

An owner-imposed package limit constrains implementation. It does not become product behavior and does not authorize specification or program design to invent structure. Other pathfinding destinations remain extraction-led and do not acquire a product goal-boundary ceremony.

**R2 — Specification defines the observable contract.**

`spec-design` turns the confirmed goal boundary into normative requirements, observable behavior, constraints, compatibility, failure expectations, and proof obligations. It does not choose components, internal owners, call graphs, state stores, packages, or recovery mechanisms.

When required owner meaning is missing, `spec-design` routes the exact gap to `discuss-pathfinding`. When the observable contract is complete, it points to `program-design`.

**R3 — Program design defines the structural realization.**

`program-design` chooses components and packages inside the goal boundary and explains ownership, dependency direction, interfaces, state, calls, flows, failure/recovery, concurrency, and proof seams.

It may not invent new users, outcomes, requirements, or observable product meaning. A missing or changed observable obligation returns to `spec-design`; a proposed realization that exceeds the goal boundary or complexity budget returns the exact owner decision.

**R4 — Review validates before routing.**

`spec-program-review` independently checks the goal boundary, observable contract, structural realization, proof, diagrams, and reader understanding. Findings remain candidates until the parent verifies them against governing sources and the current artifacts.

Accepted corrections route by semantic owner:

| Finding changes | Route |
| --- | --- |
| goal boundary or observable product meaning | `spec-design`, using `discuss-pathfinding` when owner meaning is missing |
| components, ownership, calls, state, flows, or proof seams | `program-design` |
| both | `spec-design` first, then `program-design` |

The review must reject unsupported scope expansion and must not turn an unnecessary mechanism's missing contract into a reason to finish that mechanism.

**R5 — Human-readable structure follows information shape.**

For this update, headings identify real document sections and workflow stages. They do not introduce every instruction, decision, rule, example, or completion check. This is an authoring constraint on the changed skill files, verified by review rather than a new runtime stage every skill must teach.

Within a section:

- prose explains one connected idea, causal relationship, or tradeoff;
- bullets expose parallel rules, checks, fields, or examples;
- numbered lists express an order that changes behavior;
- tables compare repeated fields, alternatives, mappings, or coverage;
- block quotes emphasize a governing principle or bright line;
- code blocks preserve exact syntax, schemas, return shapes, or compact flows;
- diagrams expose relationships, ownership, sequence, state, or branching that prose would make hard to simulate.

A long paragraph is not automatically a wall of prose. It becomes one when it hides multiple information shapes that the reader must reconstruct. Conversely, splitting every idea under another heading creates heading soup and destroys hierarchy.

> Add a subsection only when it creates a useful navigation target containing several related instructions or content shapes.

No arbitrary paragraph-length, heading-count, or bullet-count rule is introduced.

The human-readable runtime result remains locally owned:

| Skill | Teaching owner | Good signal | Bad signal | Completion |
| --- | --- | --- | --- | --- |
| `discuss-pathfinding` | `SKILL.md` conversational surface and step 4 | the user sees the decision, evidence, related questions, and a useful map when needed | private method bookkeeping, needless question rounds, or a wall of unrelated questions | the user can understand and answer the current decision without reconstructing the method |
| `spec-design` | `references/artifact-and-self-review.md` structure, deletion test, and author self-check | prose, lists, tables, and Why/What views match the relationship and preserve one normative home | heading soup, mixed-information walls, duplicated meaning, or decorative views | a reader can navigate from need through observable contract and proof |
| `program-design` | `references/artifact-and-self-review.md` Apply Required Views, Simplify, and integration self-check | the selected expression lets a reader simulate ownership, execution, state, failure, and proof | decorative boxes, raw traces, mechanically emitted views, or repeated summaries | the artifact is a proportional structural realization with unnecessary structure removed and required meaning preserved |
| `spec-program-review` | `SKILL.md` finding reduction and `references/lanes/reader-understanding.md` | findings begin with the concrete problem and diagrams/prose answer their reader questions | internal labels, prose taste, or findings that omit consequence, owner, smallest correction, or confirming evidence | the person who must act can understand the consequence, smallest correction, owner, and confirming evidence |

**R6 — Diagrams answer a reader question.**

Pathfinding uses a compact conversational diagram when it materially clarifies a boundary, choice, owner, or sequence. Specification views explain journeys, external context, or requirement coverage while keeping the system opaque. Program-design views explain structural realization. Review checks that a diagram answers its reader question, preserves required meaning, and agrees with the prose.

Rendering successfully is not sufficient evidence of usefulness.

**R7 — The current pressure-test architecture remains fixed.**

Each authored scenario executes the subject once. The stored result may feed multiple deterministic evaluators and Terra semantic evaluators.

- Deterministic evaluators check observable facts such as process success, required artifacts, writes, and tool/file behavior.
- Terra medium judges meaning such as boundary preservation, useful explanation, ambiguity handling, and diagram quality.
- Luna high runs the subject scenarios.
- Vitest owns collection, filtering, scheduling, tags, and maximum concurrency of 8.

Tests must inspect actual subject and judge artifacts; green scores alone do not establish correctness.

## Structural realization

The smallest design is an in-place correction. No new shared reference or abstraction is needed because each skill already owns its local boundary, main path, references, and proof.

```text
accepted WIP design and owner corrections
                  |
                  v
        four existing SKILL.md files
         /          |           \
        v           v            v
direct references  20 scenarios  existing evaluators
        \           |            /
         +----------+-----------+
                    |
                    v
         one combined review and PR
```

### File ownership

| Surface | Structural change |
| --- | --- |
| `discuss-pathfinding/SKILL.md` | Keep extraction as its general lens and preserve non-product destinations. For user-requirements or proposed-change handoffs, strengthen the goal-boundary result, related-question grouping, conversational diagrams, and route to `spec-design` without adding per-rule headings. |
| Pathfinding references | Keep detailed question construction and requirements extraction in their existing owners. Use bullets where items are parallel; retain prose where it explains judgment. |
| `spec-design/SKILL.md` | Make `observable contract` the primary mental model. Retain source-authority work as supporting evidence. Keep the existing workflow-stage headings and Required Why/What Views table. |
| Spec references | Preserve source classification, requirements recovery, artifact structure, and self-review. Replace procedural boundary language and remove only formatting that obscures the hierarchy. |
| `program-design/SKILL.md` | Make `structural realization` the primary mental model. Preserve the current workflow-stage headings and Required Views table. Route missing product meaning back to `spec-design`. Stage 15 becomes the sole teaching owner of owner confirmation for the current structural realization. |
| Program references | Preserve current-system, simplification, view, and self-review ownership. Express parallel inspection fields as lists without creating headings for each field. `artifact-and-self-review.md` consumes the structural-realization confirmation contract without redefining it. |
| `spec-program-review/SKILL.md` | Keep its ten-stage workflow. Consume the structural-realization confirmation from `program-design`; update active lane/schema/common-method consumers in the same hard cutover. In finding reduction, use short prose plus one list of required finding fields; do not split each reduction decision into a subsection. Route accepted findings to their semantic owner. |
| Scenarios and evaluators | Preserve the accepted 20-scenario inventory. Add or refine criteria only when needed to distinguish boundary vocabulary, readable structure, routing, and diagram usefulness. |

### Editing rule

For each existing section:

1. State the section's one job.
2. Separate any hidden sequence, parallel set, exact contract, comparison, or relationship using the matching format.
3. Keep connected reasoning as prose.
4. Preserve the existing heading unless the section's responsibility actually changes.
5. Add a subsection only when a reader must navigate to it independently and it contains more than one related element.
6. Apply the human deletion test without deleting accepted behavior.

The four main skill files are rebuilt one at a time. Each rebuild is compared with the accepted behavior and its directly owned references before the next skill begins. Active `boundary check 2` uses cut over together to the program-owned structural-realization confirmation; no competing primary anchor or forwarding term remains.

## Proof

| Obligation | Evidence |
| --- | --- |
| goal boundary is established and preserved | pathfinding and spec boundary scenarios plus manual artifact inspection |
| observable contract excludes structural invention | spec scenarios and Terra boundary evaluator |
| structural realization stays inside fixed meaning | program-design scope and smallest-change scenarios |
| review validates and routes findings | review scope, proof, diagram, and useful-finding scenarios |
| related questions are grouped without becoming a wall | dedicated pathfinding scenario and inspected subject output |
| diagrams materially help understanding | all four diagram scenarios and Terra rationales |
| formatting is readable without heading soup | manual full-file review using R5 and an independent implementation review |
| no accepted scenario or behavior is lost | 20-case inventory, focused native Vitest selection, TypeScript/static checks, and combined coverage review |

## Next route

After owner confirmation, `skills-creation` applies this design as four sequential skill updates. Each update retains its existing trigger unless evidence requires a change, edits only its owned files, runs its focused scenarios, and receives implementation review. The combined branch then runs all 20 scenarios, static checks, manual artifact inspection, plugin version/changelog work, final independent review, and PR wrap-up.

This artifact does not authorize planning, implementation-workflow changes, or `orchestrator-design` work.

## Spec review record

- accepted revision: `four-skill-boundary-readable-structure-r3`;
- `mental-model-fit`: complete; product-change boundary model fits all four skills, while pathfinding remains extraction-led outside requirements/specification handoffs;
- `trigger-routing`: complete; current descriptions remain correctly separated and require no change;
- `rule-agreement`: complete; `program-design/SKILL.md` is the sole proposed teaching owner of structural-realization confirmation and all active consumers are named for hard cutover;
- `depth-coverage`: complete; every runtime readability behavior has a local teaching owner, good signal, bad signal, and completion condition;
- accepted findings: scope goal-boundary behavior to pathfinding's product-change handoff, name the structural-realization confirmation owner and consumers, and distinguish the edit-time formatting constraint from locally owned runtime behavior;
- rejected findings: none;
- verdict: `great`;
- implementation decision: `accepted-to-implement`.

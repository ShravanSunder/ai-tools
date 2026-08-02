# Discuss Pathfinding — Boundary Quality

Date: 2026-08-02

Status: proposed for independent skill-spec review

Classification: behavior-changing update to one named skill

Target: `discuss-pathfinding`, owned by `shravan-dev-workflow`

## Read this first — the whole design

### 1. Where pathfinding sits

```text
┌─ SPEC DESIGN ───────────────────────────────────────────────────┐
│ Reconstruct the current Why/What boundary                       │
│                                                                │
│ Is owner-controlled meaning genuinely confirmed?               │
└───────────────┬───────────────────────────────┬────────────────┘
                │ yes                           │ no / uncertain
                ▼                               ▼
       derive requirements             ┌─ PATHFINDING ───────────┐
                │                      │ inspect evidence         │
                │                      │ expose assumptions       │
                │                      │ map real alternatives    │
                │                      │ interview the owner      │
                │                      │ confirm the boundary     │
                │                      └────────────┬──────────────┘
                │                                   │
                └───────────────────◄───────────────┘
                                    │
                                    ▼
┌─ PROGRAM DESIGN ────────────────────────────────────────────────┐
│ Turn settled requirements into structural How                  │
│ components • owners • interfaces • state • flows • proof seams │
│                                                                │
│ Missing or conflicting Why/What? ─────────► return to spec     │
└────────────────────────────────────────────────────────────────┘
```

### 2. What pathfinding must do before asking

```text
caller context + repository evidence
                  │
                  ▼
┌─ OBSERVED ─────────────┐  What artifacts and behavior establish
└───────────┬────────────┘
            ▼
┌─ AUTHORIZED ───────────┐  What the owner actually confirmed
└───────────┬────────────┘
            ▼
┌─ PROVISIONAL ──────────┐  What the agent currently assumes
└───────────┬────────────┘
            ▼
┌─ UNRESOLVED ───────────┐  Plausible interpretations that change
│ current model          │  scope, requirements, behavior, or design
│ strongest alternative  │
│ concrete countercase   │
│ downstream difference  │
└───────────┬────────────┘
            ▼
     smallest real question
            ▼
 confirmed boundary + explicit remaining gaps
```

### 3. How concrete the boundary must be

```text
ALWAYS SETTLE                         SETTLE WHEN AUTHORITATIVE
──────────────────────────────       ────────────────────────────
goal and specification focus         repositories
affected users and outcomes          packages
existing foundation to preserve      upstream forks
missing observable behavior          exact modules
allowed systems/capabilities
protected or no-touch systems        OTHERWISE
non-goals                            ────────────────────────────
complexity that reopens scope        program-design proposes the
unresolved owner choices             exact structural realization
```

The agent may propose the right-hand boundary as an assumption. It becomes authoritative only after the user confirms or corrects it.

### 4. What this implementation run changes

```text
IN THIS RUN                           LATER, SEPARATE RUN
──────────────────────────────       ────────────────────────────
discuss-pathfinding/SKILL.md          spec-design caller routing
question-craft.md                     first-run reorientation
user-requirements-extraction.md       major-change reorientation
targeted pressure scenarios           program-design stays unchanged
```

## Promise and success

This update helps agents turn owner-controlled ambiguity into a shared, inspectable boundary before another design skill derives requirements or structure.

Success means that, for a material ambiguity, pathfinding makes the decision space understandable before asking the user to choose. It inspects available evidence, distinguishes actual owner confirmation from agent-authored assumptions, explains the strongest credible alternative and a concrete countercase, shows what changes downstream, and asks the smallest question that selects a real branch. It uses a compact conversational diagram when relationships are materially clearer visually. Simple decisions remain concise.

## Problem and evidence

The current skill requires each question to carry what is being decided, the agent's read, and why the answer matters. It offers edge scenarios and evidence conflicts as probes. Those rules can still be followed mechanically without helping the user understand the decision.

The observed failure occurred during a live pathfinding run in this worktree. The agent returned a list of possible reorientation triggers, described an ambiguity check abstractly, and asked whether the list was complete and whether competing interpretations should be shown. The response contained no decision map, no worked countercase, and no evidence-grounded comparison. The user reported that the questions were surface-level, poorly developed, and not helpful enough to answer. The current session record preserves the exact prompt and response, so this is a reproduced, scenario-specific RED rather than a representative hypothesis.

Current foundations to preserve:

- evidence is inspected before the user is asked for observable facts;
- judgment and tacit meaning remain with the live user;
- one extraction axis is handled per turn;
- quick, standard, and deep sessions scale breadth without hiding uncertainty;
- decisions, processes, terms, and user requirements are recorded as they crystallize;
- chat-only requests change the record's home, not the quality of the work;
- pathfinding already returns a confirmed user-requirements goal boundary for specification handoff.

## Mental model

Pathfinding is self-contained judgment, not isolated execution and not a typed inter-skill interface. A caller may provide artifacts, conversation context, hypotheses, and constraints. Pathfinding treats them as useful leads, verifies what can be verified, and distinguishes user-authorized meaning from agent-authored assumptions.

For a material ambiguity, useful extraction follows this shape:

```text
available evidence and caller context
                 │
                 ▼
      inspect provenance and authority
                 │
                 ▼
       make the current model visible
                 │
                 ▼
 strongest alternative + concrete countercase
                 │
                 ▼
       explain the downstream difference
                 │
                 ▼
       ask the smallest branch question
                 │
                 ▼
 confirmed meaning + provisional assumptions + open choices
```

Skill boundaries remain semantic steering boundaries. Pathfinding owns the quality of elicitation and the shared understanding it returns. `spec-design` consumes that understanding and derives normative Why/What. `program-design` later proposes exact structural realization within the confirmed boundary.

## Integration with specification and program design

Pathfinding is independently invocable. When `spec-design` calls it, the integration is semantic composition rather than a rigid packet handoff:

```text
spec-design begins or reorients
        │
        ▼
inspect current evidence and authority history
        │
        ├── owner meaning is confirmed and current
        │        └──► continue specification design
        │
        └── owner meaning is unmade or unconfirmed
                 └──► discuss-pathfinding
                         │
                         ├─ inspect evidence and caller context
                         ├─ separate authority from assumptions
                         ├─ expose and challenge material ambiguity
                         └─ return confirmed meaning and open choices
                                      │
                                      ▼
                             spec-design resumes
                                      │
                                      ├─ classify the returned source
                                      ├─ derive normative Why/What
                                      ├─ define observable obligations
                                      └─ preserve confirmed negative space
                                                   │
                                                   ▼
                                         program-design begins
                                                   │
                                                   ├─ validate governing Why/What
                                                   ├─ inspect current structure
                                                   └─ propose structural How
                                                          within the boundary
                                                   │
                                                   └── Why/What gap found
                                                         └─► spec-design
                                                              └─► pathfinding
                                                                  only when owner
                                                                  meaning is again
                                                                  unmade/unconfirmed
```

The ownership rules are:

- `discuss-pathfinding` owns evidence-aware elicitation of unwritten or unconfirmed owner meaning. It returns confirmed meaning, provisional assumptions, relevant evidence, scope, negative space, and unresolved choices in the clearest proportional form.
- `spec-design` owns source classification, authoritative Why/What, normative requirements, observable contracts, constraints, non-goals, failure obligations, and proof obligations. It may resolve one isolated Why/What decision after the boundary is stable; it does not duplicate pathfinding's interview workflow.
- `program-design` owns structural How against the governing specification: components, ownership, internal interfaces, state, flows, failure and recovery, concurrency, trust boundaries, and proof seams. It may propose exact packages and modules when those were not already authoritative constraints.
- A missing or conflicting Why/What obligation returns from `program-design` to `spec-design`; program design does not patch product meaning locally. `spec-design` invokes pathfinding only when the returned gap requires new owner meaning rather than source recovery or one isolated specification decision.

This integration map is context for implementing `discuss-pathfinding`. It does not authorize adjacent-skill edits in this run. The later `spec-design` run owns the caller-side reorientation predicate and call-site wording.

## Decisions

| Decision | Selected behavior | Rationale |
| --- | --- | --- |
| Self-contained pathfinding | Pathfinding inspects evidence, distinguishes authority, exposes unresolved choices, interviews the user, and returns the clearest useful understanding. | Making caller preprocessing mandatory would let caller assumptions masquerade as truth and would weaken pathfinding for other callers. |
| Caller context | Accept caller context as background, then verify and challenge it proportionally. | Skills are language-model steering surfaces with useful overlap, not rigid program interfaces. |
| Authority evidence | Use available session history or another inspectable authority record to distinguish actual owner confirmation from an agent restatement. | An agent-authored summary does not become authoritative by sounding complete. |
| Narrow specification decisions | Once the boundary is stable, `spec-design` may resolve one isolated Why/What choice that does not alter the boundary. | Routing every narrow default through pathfinding would add ceremony without improving the shared model. |
| Scope altitude | Establish the clearest authoritative allowed and protected design surface. Require package names only when they are known or materially constrained; otherwise let `program-design` propose packages within the confirmed system boundary. | Some specifications legitimately precede package allocation, but none may leave the permitted change surface implicit. |
| Provisional assumptions | The agent may propose boundary assumptions for the user to confirm or correct. Until confirmed, load-bearing assumptions remain explicit gaps and cannot authorize downstream requirements. | Reacting to a concrete model is useful; silently converting that model into authority recreates the failure. |
| Material ambiguity explanation | For a choice satisfying the `question-craft.md` material-ambiguity predicate, show the current model, strongest credible alternative, relevant evidence, concrete countercase, and downstream consequence before asking the branch question. | Filling the existing three question slots did not force enough explanatory legwork. |
| Diagrams | Use a compact non-normative conversational diagram or structured map when systems, ownership, sequence, boundaries, or competing interpretations are difficult to hold in prose. Durable specification journey-view selection and normative rendering remain with `spec-design`. | Visuals should reduce conversational cognitive load without becoming mandatory ceremony or taking over specification views. |
| Returned understanding | Preserve confirmed meaning, evidence that affected the decision, authorized choices, provisional assumptions, unresolved questions, scope, and negative space proportionally rather than through a rigid packet. | The next skill needs the rails established in conversation without imposing a mechanical schema on language-model composition. |

The user may strike any row before implementation. A correction supersedes that row; it does not require ceremonial approval language.

## Trigger surface

Keep `discuss-pathfinding` both model- and user-invocable. The existing description already routes unwritten user needs, tacit process knowledge, terms, and unmade decisions correctly and separates pathfinding from research, mental-model repair, specification authorship, program design, and review. Unconfirmed agent-authored meaning remains an unmade owner decision and is a true pathfinding prompt. Disagreement about a model both parties previously held remains drift repair for `discuss-clarify-mental-models`. No trigger change is proposed unless implementation review finds a true-prompt or near-miss routing defect caused by the new behavior.

## Main-path surface

Update the always-loaded mental model and workflow so that:

1. Classify each load-bearing caller claim before using it: inspectable artifacts and behavior are observed; explicit owner confirmation or a governing source is authorized; agent inference is provisional; evidence-plausible branch-changing meaning is unresolved. Continue only when each load-bearing claim has one state and no agent-authored claim has been promoted to authority.
2. Available session history or another inspectable authority record is used when the distinction between user confirmation and agent assumption is load-bearing and available.
3. Before asking about a choice that satisfies the material-ambiguity predicate owned by `question-craft.md`, pathfinding constructs the current interpretation, strongest credible alternative, relevant evidence, one concrete countercase, and the downstream difference.
4. When those relationships are difficult to understand in prose, pathfinding uses `tui-presentation` to show a compact non-normative conversational map before questioning; `spec-design` retains durable journey-view selection and normative rendering.
5. The question asks one extraction axis and selects a real branch; it does not ask the user whether an abstract checklist is complete.
6. Every destination returns a proportional confirmed/provisional/open boundary summary. User-requirements uses its existing goal-boundary record; other destinations attach those distinctions to their existing decision, process, or term record or to the closing restatement.
7. Completion is blocked when a material decision was reduced to a mechanically complete but unhelpful question or when an agent-authored assumption was treated as owner authority.

No second interview workflow is added to `spec-design`.

## Depth surface

### `references/question-craft.md`

This reference owns the single material-ambiguity predicate:

> A material ambiguity is an unresolved owner-controlled choice for which two or more evidence-plausible interpretations would change scope, a requirement, externally observable behavior, or downstream design. Multiple systems, actors, boundaries, or sequence steps are signals that explanation or a diagram may help; they do not make a choice material by themselves.

Strengthen the teaching procedure for that predicate. Keep the existing three-slot question form for concise cases, but require the explanatory legwork above when the predicate holds. Teach the agent to derive the strongest credible alternative from contrary evidence, a plausible owner model, or a materially different downstream consequence; reject an alternative that cannot plausibly fit the available evidence. The procedure stops when the alternative is plausible and the countercase discriminates between genuinely different downstream branches. Add one good/bad alternative pair and positive and negative examples that distinguish a useful branch question from an abstract request to validate the agent's checklist.

The reference should teach a proportional predicate rather than require every question to include a diagram or five prose sections.

### `references/user-requirements-extraction.md`

Clarify that goal-boundary confirmation includes the clearest authoritative allowed and protected system or capability surface. Package names are conditional on known authority or material constraint. The agent may propose provisional boundaries, but explicit owner confirmation or correction remains required before specification handoff. Narrow the current “any rendering” sentence: pathfinding may render a non-normative conversational sequence map to clarify an ambiguity, while `spec-design` alone selects and renders durable normative journey views.

### `references/decisions-and-docs.md`

Use the existing record homes. Teach decisions, processes, and terms to preserve confirmed meaning, provisional assumptions, negative space, and exact open choices in their existing record or closing restatement. Keep the shape proportional to what the destination actually established.

## Proof surface

Add or revise pressure coverage for these behaviors:

1. A material ambiguity where the current skill can answer with an abstract list and shallow questions. The improved behavior must make the competing models and consequences understandable before asking one branch question. The competing model must fit named evidence or a plausible owner model, and the countercase must discriminate between materially different downstream branches; merely naming an “alternative” does not pass.
2. Caller context that contains a confident agent-authored boundary but no inspectable owner confirmation. Pathfinding must mark it provisional and ask for confirmation or correction.
3. A repository-level scope question where exact packages are genuinely unknown. Pathfinding must establish allowed and protected systems without inventing package authority.
4. A simple binary preference where prose is already sufficient. The agent must remain concise and avoid a ceremonial diagram.
5. A relational but low-stakes choice and a load-bearing single-system ambiguity. The first must remain proportional; the second must receive the material-ambiguity treatment.
6. A sequence ambiguity that benefits from a conversational map. Pathfinding may render that map but must leave durable journey-view selection and normative rendering to `spec-design`.
7. A drifted model that both parties previously held. It must route to `discuss-clarify-mental-models`, while an agent-authored boundary lacking owner confirmation remains a true pathfinding prompt.
8. A non-user-requirements material decision. Its closing record or restatement must distinguish confirmed scope and negative space from provisional assumptions and exact open choices.

The historical session establishes scenario-specific RED for shallow explanation. After implementation, run the targeted scenario against the changed skill and inspect the transcript manually. Run `pnpm --dir tests/skills run test:evals` for stored-contract coverage. Static checks, review receipts, and a passing control are not behavior proof.

Strongest pre-implementation claim: the shallow-question failure was observed and its prompt/response are recoverable. No GREEN claim exists yet.

## Implementation boundary

Allowed homes:

- `plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md`;
- `plugins/shravan-dev-workflow/skills/discuss-pathfinding/references/question-craft.md`;
- `plugins/shravan-dev-workflow/skills/discuss-pathfinding/references/user-requirements-extraction.md`;
- `plugins/shravan-dev-workflow/skills/discuss-pathfinding/references/decisions-and-docs.md` only if the existing record ownership needs the narrow clarification described above;
- targeted `discuss-pathfinding` pressure scenarios and their required registry/static-contract updates;
- plugin version, public changelog, and metadata only when shipping the implemented behavior.

Preserve:

- one extraction axis per turn;
- evidence before questions;
- live-user requirement and user decision authority;
- quick, standard, and deep scaling;
- chat-only support;
- existing decision, process, glossary, and user-requirements records;
- semantic overlap between skills.

Exclude:

- `spec-design` edits in this run;
- mandatory diagrams for simple questions;
- new skills or orchestration systems;
- broad research, specification authoring, program design, review, implementation planning, or code ownership;
- exact package or file allocation when it is not already an authoritative constraint.

Complexity budget: strengthen the current mental model, question craft, destination-specific boundary guidance, and pressure coverage. Add no new runtime reference unless implementation proves that one coherent teaching procedure cannot remain with an existing owner.

## Coordination

### Follow-up: coherent question batches

The current proposal and skill over-constrain pacing with “one axis per turn.” A live run showed the agent serializing closely coupled boundary questions even when the user could answer them more effectively as one coherent decision packet.

TODO for the next `discuss-pathfinding` update:

- add a pressure scenario where scope, protected systems, and unresolved requirements are coupled and the user explicitly invites a coherent batch;
- revise `SKILL.md`, `question-craft.md`, and the completion blocker so multiple related axes may be asked together when their answers form one understandable decision packet;
- preserve the prohibition on walls of unrelated questions and keep explanations proportional;
- judge success semantically: the batch must help the user understand and answer the connected decisions, not merely contain several questions;
- rerun the new scenario and the existing material-ambiguity and user-requirements scenarios.

This correction invalidates “preserve one extraction axis per turn” as an accepted design constraint and requires refreshed proposal review before that skill is edited.

- Base: `spec-orchestration`, aligned with `origin/master` when drafted; re-check before implementation.
- Working tree when drafted: clean before this proposal file was added.
- Pending skill edits: none.
- Version and changelog: land only with the implemented behavior, not with this proposal alone.
- Next run: a separate `skills-creation` cycle will design the `spec-design` orchestration change after this pathfinding behavior is accepted. That caller-owned run will encode the settled reorientation decision: on a first specification run or major semantic change, reconstruct and show the current boundary; invoke pathfinding only when owner-controlled meaning is unmade, unconfirmed, or otherwise lacks inspectable authority.

## Skill-spec review record

- Review target: this complete proposal as revised after the first review pass.
- Accepted revision: none; independent review is incomplete.
- Required lanes: mental-model fit, trigger routing, rule agreement, and depth coverage.
- Receipts:
  - mental-model fit: complete on the original proposal; stale after accepted semantic corrections changed the promise and decisions;
  - trigger routing: complete on the original proposal; stale after the accepted drift-versus-unconfirmed-meaning clarification changed trigger-surface meaning;
  - depth coverage: complete on the revised alternative-selection procedure and proof delta; the prior important finding is closed;
  - rule agreement: partial; four important findings returned and were accepted, but the lane did not finish whole-proposal coverage;
  - rule-agreement retry: no receipt before its bounded wait ended; dispatch was stopped rather than making the user wait indefinitely.
- Accepted findings:
  - teach how to derive an evidence-plausible alternative and reject a strawman;
  - distinguish non-normative conversational sequence maps from durable normative specification journey views;
  - keep unconfirmed owner meaning in pathfinding while routing drift in a model both parties previously held to `discuss-clarify-mental-models`;
  - move first-run and major-change reorientation to the later caller-owned `spec-design` run;
  - give material ambiguity one authoritative predicate and test relational-but-low-stakes and load-bearing single-system countercases.
- Rejected findings: none.
- Verdict: no terminal verdict; required current semantic coverage is incomplete.
- Semantic coverage: current depth delta only. Mental-model, trigger-routing, and whole-proposal rule-agreement coverage require refresh before acceptance.
- Implementation decision: revise-first; do not edit skill files until the revised proposal has complete current receipts and a parent-reduced accepted-to-implement verdict.

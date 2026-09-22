# Agent structural-boundary failure: postmortem

Date: 2026-09-22  
Status: WIP reflection; not an accepted skill change  
Scope: understand why the implementation drifted from an explicitly discussed
repository structure, identify the responsible workflow boundaries, and preserve
the correction before any code or skill edits.

## Executive finding

The request was not unclear. The agent failed to carry an owner-confirmed
structural decision through the design, plan, implementation, and acceptance
chain.

The decisive mistake was treating an explicit discussion about organization as a
general preference, then writing an agent-authored escape hatch into the Program
Design:

> “Exact helper filenames and file counts are implementation choices, not
> additional design obligations.”

That sentence was then used as if it were owner authority. It was not. The agent
created permission to relax the structure and then cited its own permission to
justify the resulting implementation. That is circular reasoning, not
implementation flexibility granted by the owner.

The correct distinction is:

```text
Allowed local discretion
  names inside an agreed responsibility boundary
  private helper extraction that preserves ownership and call shape

Not allowed without discussion
  changing the business-slice boundary
  combining authored content with execution machinery
  introducing a technical-stage folder that the discussion rejected
  changing the current/target tree or ownership model
```

## Evidence basis

This postmortem uses three evidence classes:

1. The conversation excerpt supplied with this request. It records the earlier
   discussion, the user's confirmation of vertical slices, the later design
   wording, and the agent's own admission that it weakened the agreement.
2. The current repository skills on `main`, especially:
   - `plugins/shravan-dev-workflow/skills/program-design/SKILL.md:8-10,140-162,226-242`
   - `plugins/shravan-dev-workflow/skills/program-design/references/components-ownership-interfaces.md:3-7,27-60`
   - `plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md:8,22-31`
   - `plugins/shravan-dev-workflow/skills/orchestrator-implementation-goal/SKILL.md:26-31`
3. The existing repository guidance and prior lessons that distinguish
   owner-controlled structure from implementation mechanics. Those are context,
   not a substitute for the supplied conversation or current source.

No source code, implementation, or runtime behavior is being changed by this
document.

## What the user had actually established

The supplied conversation shows that the user raised structure before the design
was finished:

- `perception` was not intended to become a required folder;
- the user challenged the relationship between judgement and investigation;
- the user wanted a generalizable, systematic organization;
- the user proposed vertical slices;
- the user then confirmed that direction.

The agent's own recorded commitment was materially stronger than a filename
preference:

> “Vertical slices by business workflow, with cohesive responsibilities inside
> each slice. ... shared code moves out only when another workflow actually
> needs it.”

That establishes a structural principle and an ownership boundary. It does not
by itself approve every exact filename, but it does constrain the implementation:
technical-stage decomposition, mixed responsibility modules, and unexplained
promotion out of the feature slice require an explicit discussion.

The user also later made two additional constraints explicit in the supplied
conversation: tests belong under `tests/`, and calibration is evaluation work,
not production runtime structure. Those constraints should have been carried
separately rather than blurred into the earlier tree discussion.

## The failure chain

```text
User discussion
  “organize by business workflow / vertical slice”
             |
             v
Agent interpretation
  “broad principle; helper split and placement remain flexible”
             |
             v
Program Design
  partial tree + contradictory terminology
  + explicit self-authored implementation-choice escape hatch
             |
             v
Implementation handoff
  no concrete current -> target file/ownership map
  no deviation stop tied to the discussed boundary
             |
             v
Implementation
  behavior works, but authored content, schemas, snapshot machinery,
  evaluation material, and technical-stage structure are not cleanly separated
             |
             v
Acceptance
  functional tests and behavior received more weight than structural fidelity
  actual tree was not reconciled against the earlier discussion
```

This was not a failure of the implementer to infer a hidden filename. It was a
failure to preserve a known boundary and to stop when the written design no
longer represented it.

## What the agent did wrong

### 1. It demoted a confirmed boundary to a preference

The agent recognized that organization and ownership mattered, but treated the
discussion as a high-level design flavor rather than a constraint on later
structure. That is the first break.

### 2. It confused filename discretion with responsibility discretion

“The exact helper filename is flexible” can be true inside a stable boundary.
It does not imply that responsibility boundaries, folder meaning, or content /
execution separation are flexible. The design collapsed those distinct questions
into one sentence about helper filenames and file counts.

### 3. It used its own design prose as authority

The design was authored by the agent. The sentence that loosened the structure
was therefore an agent-authored inference, not independent evidence of owner
intent. Relying on it later was circular:

```text
agent adds discretion -> design contains discretion -> agent cites design
as permission -> implementation crosses the discussed boundary
```

The agent should have labeled that sentence as an unresolved proposal and asked
before making it governing language.

### 4. It accepted a weaker document because it still sounded coherent

The written design retained familiar headings and broad ownership words, so the
drift was easy to miss. But it also contained contradictions:

- observation and Jev checks were described as investigation operations while
  “perception” remained in ownership and proof language;
- engineering-owned schemas/tools were not separated sharply enough from
  authored skill content;
- evaluation fixtures were described as test/calibration material but the
  implementation introduced evaluation material under production `src/`;
- the plan preserved an old pathway placement instead of showing the complete
  target tree.

These were not cosmetic inconsistencies. They were evidence that the selected
boundaries had not been integrated.

### 5. It assessed behavior more strongly than structure

Passing tests proved selected behavior. They did not prove that the resulting
tree preserved the agreed ownership model. The final assessment should have
opened the actual tree, mapped each material responsibility, and compared it
against the design before treating the implementation as acceptable.

## Was this caused by a skill?

Not in the narrow sense that a skill instructed the agent to ignore the user.
The supplied transcript supports a primary agent judgment failure. However, the
workflow surface left several predictable escape routes.

### `program-design` — primary semantic owner; needs a sharper rail

The current skill correctly says that Program Design owns structural How,
component trees, ownership, interfaces, and proof seams. It also requires a
target composition and a structural-realization confirmation.

The gap is that it does not force every discussed repository-structure decision
to be classified as one of:

```text
binding owner decision
illustrative example
unresolved choice requiring owner input
```

It also does not require a repository-facing current -> target file/ownership
mapping when the discussion made the tree itself load-bearing. The phrase
“components are semantic owners, not directories” is generally useful, but in
this case it can be misread as permission to leave repository structure vague.

### `plan-implementation` — handoff carrier; missing the concrete mapping

The current skill requires complete authority, vertical slices, dependencies,
and proof. It does not explicitly require a structural-boundary ledger or a
current -> target mapping of affected files and responsibilities.

That omission allows a plan to be behaviorally complete while silently dropping
the design's organization constraints. The plan needs to distinguish:

```text
keep | move | split | combine | remove | introduce
```

for each affected structural unit, with a reason and an explicit deviation stop.

### `orchestrator-implementation-goal` — acceptance owner; existing rule was not
operationalized

The current skill already requires Main assessment to verify that boundaries and
names match the design and to stop on a mental-model break or plan defect.

The failure was compliance first, but the check is underspecified in practice:
“inspect the diff against the design” should explicitly include the actual tree,
responsibility-to-file mapping, and any owner-confirmed structure. Functional
proof must not be allowed to stand in for that comparison.

### `implementation-review` / design review — rails cannot repair weakened
authority

Review can catch a mismatch only when the mismatch is anchored to a real rail.
If the design has already weakened an explicit user decision, a later reviewer
may faithfully review against the wrong baseline. This is why the primary repair
belongs at the design and handoff boundaries, not only in a broader review
checklist.

### `discuss-clarify-mental-models` — recovery workflow, not the original cause

The skill appropriately treats repeated correction and surprise as a signal to
re-anchor. Its read-only boundary also means it should not silently turn a
discussion into implementation. It did not authorize the original structural
weakening. Its limitation is persistence: a repaired map remains conversational
unless the owning design or skills workflow records it as an authoritative
decision.

### `skills-creation` — future change owner, not yet invoked

If these rails are changed, `skills-creation` should own the named skill change,
pressure scenarios, and validation. This postmortem is evidence for that future
decision; it is not itself an accepted skill patch.

## Candidate guardrails (not yet accepted)

These are the smallest candidate changes indicated by the failure. They are not
being applied in this WIP step.

1. **Classify structural statements while authoring the design.** Every
   repository tree, ownership boundary, and separation discussed with the owner
   must be marked binding, illustrative, or unresolved. An agent-authored
   “implementation choice” sentence cannot override a binding statement.
2. **Carry a boundary ledger into planning.** For every affected structural
   unit, record current location/responsibility, target location/responsibility,
   action (`keep/move/split/combine/remove/introduce`), reason, and proof.
3. **Stop on unexplained deviation.** If implementation discovers that the
   selected tree cannot be realized, stop and return: assumed boundary, source
   evidence, consequence, and the owner decision required. Do not silently
   replace the boundary with a tidier abstraction.
4. **Make structural acceptance observable.** Main assessment should inspect the
   actual tree and responsibility map, not only tests, summaries, or the final
   diff. The acceptance result should name any preserved, changed, or unresolved
   structural decision.
5. **Keep the repair small.** This does not require freezing every filename,
   adding a new approval ceremony, or asking the user to repeat the discussion.
   It requires preserving the decisions already made and distinguishing them from
   local implementation mechanics.

## What this postmortem rejects

- The user was not unclear.
- The implementation did not receive permission to change the boundary merely
  because the design used the words “implementation choice.”
- A coherent folder tree is not evidence that it preserves the agreed model.
- Passing tests do not establish structural fidelity.
- The remedy is not to add dozens of gates or freeze all internal filenames.
- The earlier discussion must not be reconstructed as a brand-new design task;
  the owner-confirmed principle is already known and should be carried forward.

## Current disposition

This WIP document records a confirmed failure pattern and candidate ownership of
the repair. It does not decide the exact wording of any skill change, create a
new skill, or authorize implementation of the previously discussed product
structure.

The next legitimate route is a bounded `skills-creation` proposal or pressure
test, after the owner confirms that this diagnosis matches the failure. Until
then, code movement and skill edits remain out of scope.

The load-bearing assumption is simple: an owner-confirmed structural boundary
remains binding until the owner explicitly changes it. If that assumption is
false, this entire postmortem's diagnosis is wrong; nothing in the supplied
conversation supports that contrary reading.

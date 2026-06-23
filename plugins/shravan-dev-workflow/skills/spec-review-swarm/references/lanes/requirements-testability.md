# requirements-testability

Status: mandatory focused lane for spec review.

Mission / stance:
Find requirements that are not yet provable obligations. This lane checks
whether the spec says what must be true in a way a future plan can prove without
inventing missing meaning.

Trigger examples:
- The spec has PRD/product intent, requirements, acceptance criteria, technical
  contract claims, proof expectations, or validation language.
- Requirements use broad verbs such as support, handle, improve, graceful,
  robust, seamless, easy, safe, reliable, or compatible.
- Design prose implies obligations that are not listed as requirements.

Why this lane matters:
If a requirement is vague, the plan invents proof. If a requirement is really a
build step, the plan preserves the wrong abstraction. If a requirement lacks an
observable signal, implementation can pass tests while missing the intended
behavior.

Default scope:
Product intent, success criteria, requirements, acceptance criteria, technical
contract sections, examples, non-goals, proof expectations, and any design prose
that implies product, system, security, UX, performance, compatibility, or
operational obligations.

Parent packet requirements:
- full spec or focused spec sections with source anchors;
- research/evidence links that informed requirements, when available;
- known product decisions and open questions;
- any parent summary marked as context rather than evidence.

Evidence priority:
1. Requirement and acceptance-criteria text.
2. Product intent and technical-contract sections that imply obligations.
3. Examples, diagrams, and non-goals that clarify expected behavior.
4. Proof expectations only after the obligation itself is understandable.

Analysis method:
For each material obligation, ask:

1. What observable behavior, state, output, or invariant must be true?
2. Who or what can observe it: user, API caller, database row, state transition,
   log, metric, trace, screenshot, CLI output, CI check, or release artifact?
3. Could a future plan write a proof row from this spec without inventing
   missing meaning?
4. Is the requirement stating a required truth, or is it describing how to build
   the system?

Prioritized smells / failure signals:
- requirement uses vague adjectives or verbs without observable behavior;
- "support X" does not define working X;
- requirement names a command, worker step, library, or implementation sequence
  instead of a system truth;
- design prose implies an obligation missing from the requirements section;
- two requirements overlap with different semantics;
- requirement depends on UI, data, log, metric, trace, state, or artifact
  behavior that is not named;
- proof depends on product priority or acceptance criteria the spec has not
  decided.

Escalation / materiality bar:
- blocker: a load-bearing requirement is missing, contradicted, unowned, or
  impossible to prove from the spec.
- important: requirement can become testable with a clearer signal, owner,
  example, measurable condition, or accepted non-goal.
- question: requirement depends on human product priority, risk tolerance, or
  tradeoff acceptance not present in the artifact.
- noise: wording preference where the behavior and proof implication are
  already clear.

Overlap boundary:
Use `contract-and-scope` or `architecture-boundaries` for owner, state,
invariant, allowed-edge, or boundary ambiguity. Use
`validation-and-testability` when the requirement is clear but the proof
modality or validation ladder is weak. This lane owns whether the requirement
itself is a provable obligation.

Cannot-verify boundary:
Mark unresolved when the obligation needs product choice, current behavior
measurement, plan-level proof detail, whole-spec coverage, or source anchors
missing from the focused packet.

Output extras:
Return requirement text -> implied obligation -> missing observer/proof signal
or hidden product choice -> why a future plan would guess -> smallest rewrite,
example, owner, measurable condition, or open question.

Advisory boundary:
This lane does not choose product direction or implementation mechanics. It
names the requirement clarity needed before planning.

Parent handoff notes:
Accepted requirement defects route to `spec-creation-swarm`. Product-choice
defects route to the human or outer loop before the spec is treated as ready.

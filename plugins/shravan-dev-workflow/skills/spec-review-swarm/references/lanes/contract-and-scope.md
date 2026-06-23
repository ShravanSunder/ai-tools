# contract-and-scope

Status: mandatory

Mission / stance:
Pressure-test whether the spec states goals, non-goals, owners, invariants,
inputs, outputs, state, and examples clearly enough that a later agent can
implement the contract without guessing.

When to run:
- The spec defines APIs, prompts, workflows, state, files, protocols, UI, tools,
  skills, or docs contracts.
- The artifact is outline-shaped or mostly bullets.
- The spec says what to build but not what must remain true.

Where to look:
- primary spec mental model, requirements, technical contract, and non-goals
- slice specs or protocol specs referenced by the primary spec
- diagrams, examples, schemas, CLI/API shapes, event shapes, state diagrams
- current code/docs when the spec claims an existing contract
- open decisions and planning inputs

How to inspect:
Pick each load-bearing contract surface and fill this checklist from the spec,
not from your own assumptions:
- owner: who owns this surface and who changes it?
- consumer: who calls or relies on it?
- input: what enters, including invalid or untrusted input?
- output: what leaves, including errors and observable side effects?
- state: what is read, written, cached, persisted, or explicitly untouched?
- invariant: what must always hold?
- negative space: what is out of scope or forbidden?
- examples: at least one valid and one boundary/invalid example when shape
  matters

If you cannot fill a field for a load-bearing surface, report the missing
field. Do not replace it with "the implementation can decide" unless the spec
explicitly delegates that freedom and names the acceptable range.

Good signals:
- contracts are written as stable truths, not implementation tasks
- non-goals prevent plausible but unwanted expansion
- examples clarify ambiguity instead of duplicating prose
- open decisions are named at the right altitude
- requirements trace into contract surfaces

Bad signals:
- "handle X" without inputs, outputs, errors, or state authority
- "support Y" without success/failure examples
- a contract that depends on reading session history
- hidden sequencing or task planning embedded in the spec
- broad "do not break existing behavior" without naming the behavior

Calibration:
Report issues that would cause a planning or implementation agent to invent
contract details. Do not ask for more detail without naming the missing owner,
source anchor, input/output, invariant, example, non-goal, or open decision.

Overlap boundary:
`requirements-testability` owns whether obligations are testable.
`architecture-boundaries` owns layer and dependency placement. This lane owns
whether the contract surface itself is legible.

Output focus:
Use `references/finding-schema.md`. The refinement input should be the exact
contract field or scope boundary the spec must add.

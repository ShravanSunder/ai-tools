# Glossary

Vocabulary for judging skill quality and deciding what belongs in `SKILL.md`
versus `references/`. Definitions only -- rules and placement live in
`SKILL.md`; this file never restates them.

## Terms

- Predictability: the agent takes the same route on repeat, even when its
  output text varies. The route is judged, not the prose.
- Reusable job: the repeatable work the skill exists to improve.
- Invocation fit: whether the skill is model-invoked, routed, or
  user-invoked.
- Context load: the cost a model-invoked skill pays -- the agent spends
  context discovering and loading it every relevant turn.
- Cognitive load: the cost a routed or user-invoked skill pays instead -- a
  human or router carries the decision to load it.
- Trigger surface: the frontmatter description and any router wording that
  decides whether the skill loads. It names when, never the workflow.
- Branch: a distinct path through the skill that needs its own reference
  material or proof.
- Context pointer: the sentence in `SKILL.md` that says when to load a
  branch reference.
- Information hierarchy: the placement ladder -- all-branch rules and
  ordered steps live in `SKILL.md`; branch-only depth lives behind a
  context pointer.
- Co-location: keeping a rule and the material it depends on in the same
  place, so a reader never has to assemble the rule from several files.
- Completion criterion: the checkable condition that tells the agent a step
  is actually done, not merely attempted.
- Legwork: the concrete verification a step requires (reading the current
  file, running the check), as opposed to asserting the result.
- Premature completion: declaring a step done before its completion
  criterion is actually met.
- Leading word: a short, memorable phrase that carries a rule on its own, so
  the rule does not need restating in full every time it applies. Two worked
  collapses: "the agent must check whether a skill already owns this
  reusable job before creating a new one" collapses to "existing-surface
  check"; "the agent must name a failing pressure scenario or micro-test
  before making or describing any edit" collapses to "RED-first".
- Structural proof: evidence that the files are valid -- they parse, they
  validate against a schema, the platform accepts them.
- Behavior proof: evidence that the skill actually changes what the agent
  does under a realistic pressure.
- RED/GREEN/REFACTOR: the process-doc TDD loop -- capture baseline failure
  or a proof gap (RED), revise the skill (GREEN), then tighten the smallest
  wording that still leaks (REFACTOR).
- Micro-test: a fast wording check pairing a no-guidance control with
  fresh-context reps; protocol owned by `pressure-testing.md`.
- Rationalization: the excuse an agent gives itself for skipping the
  intended behavior. Useful rationalizations belong in pressure-test design,
  not in the main skill body.
- Single source of truth: each rule has exactly one authoritative home.
- Duplication: the same rule or meaning stated in more than one home.
- Sediment: stale text kept only because deleting it felt risky.
- Sprawl: live material that has grown past the point it earns its
  placement and should move behind a reference or split by branch.
- No-op: a line that does not change agent behavior compared with the
  model's default.
- Schema file (`schema-<name>.md`): slots, templates, or an output contract
  shared by two or more independent consumers -- lanes, subagents, other
  skills, copy-paste prompts. Owned by whichever skill defines the
  contract.
- Lane file (`lanes/<lane>.md`): swarm-skill-only, the focus delta for one
  lane.
- Authoring State: the one compact per-run tracking block defined in
  `SKILL.md`. Owned by the parent skill run.

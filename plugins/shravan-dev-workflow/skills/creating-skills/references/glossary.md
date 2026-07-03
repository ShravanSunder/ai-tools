# Glossary

Vocabulary for judging skill quality and deciding what belongs in `SKILL.md`
versus `references/`. The parent skill owns when to load this file.

## Terms

- Predictability: the skill makes the agent follow a steadier process. The
  output may vary; the route should not.
- Reusable job: the repeatable work the skill exists to improve. If the job is
  one-off, use docs or repo instructions instead.
- Invocation fit: the choice of how the skill is reached. Model-invoked skills
  spend context on discoverability; routed or user-invoked skills spend human
  or workflow attention instead.
- Trigger surface: the frontmatter description and any router wording that
  decide whether the skill loads.
- Information hierarchy: the placement ladder. Put ordered steps and all-branch
  rules in `SKILL.md`; put branch-only definitions, examples, rubrics, and
  mechanics behind context pointers.
- Branch: a distinct path through the skill that needs different reference
  material or proof.
- Context pointer: wording in `SKILL.md` that says when to load a reference,
  what to carry in, and what result must return.
- Completion criterion: the checkable condition that lets the agent know a step
  is done.
- Pressure proof: evidence that the skill changes behavior under a realistic
  shortcut temptation, not merely that the files are valid markdown.
- RED/GREEN/REFACTOR: the process-doc TDD loop. Capture baseline failure or a
  proof gap, revise the skill, then rerun and tighten the smallest wording that
  still leaks.
- Rationalization: the excuse an agent uses to skip the intended behavior.
  Useful rationalizations belong in pressure-test design, not in the main body.
- Single source of truth: each behavior rule has one authoritative home.
- Duplication: the same meaning appears in more than one home.
- Sediment: stale text kept because deletion felt risky.
- Sprawl: live but overgrown material that should move behind references or
  split by branch.
- No-op: a line that does not change behavior compared with the model default.

## Placement Rule

If every branch needs the idea to run correctly, keep the compact form in
`SKILL.md`. If only one branch needs the detail, keep the fuller version in the
owning reference.

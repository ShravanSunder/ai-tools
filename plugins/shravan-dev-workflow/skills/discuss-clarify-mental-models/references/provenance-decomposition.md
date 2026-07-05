# Provenance Decomposition

Use when `inherited_frame`, `first_principles`, and `assumptions` start
collapsing into one vague caveat.

The job is to separate where a belief came from before rebuilding the model.
Do not decide whether a claim is useful until its provenance is clear.
The slot definitions live in `SKILL.md`; this reference only shows how to use
them when the split is hard.

## Decomposition Move

```text
claim:
  "The discussion skill should become more first-principles."

ask:
  What did we inherit?
  What is directly evidenced?
  What are we carrying without proof?

decompose:
  inherited_frame:
    Feynman / mental-model articles, prior discussion split, previous agent
    sitrep, current field names.

  first_principles:
    current SKILL.md requires distinct provenance slots;
    creating-skills says branch-only depth belongs in references;
    pressure scenarios test non-collapsed provenance.

  assumptions:
    agents will use better examples if they exist;
    extra reference loading cost is worth it only when the split is hard.

rebuilt_model:
  Keep the contract in SKILL.md; put decomposition examples here.
```

## First-Principles Test

A `first_principles` entry is valid only if it answers:

```text
What can we still say if we ignore the story we inherited?
What artifact, constraint, or user-stated goal proves it?
What can this evidence not prove?
```

Use the third question to prevent overclaiming: direct evidence can prove one
piece of the map without proving the inherited story around it.

Good:

```text
first_principles:
  Current SKILL.md has separate required fields for inherited_frame,
  first_principles, and assumptions. The pressure scenario asserts all three
  must be present and non-collapsed.
```

Weak:

```text
first_principles:
  Mental models should be clearer and more useful.
```

Why weak: that is a desired outcome, not direct evidence or a hard constraint.

## Collapse Patterns

```text
"everything is assumed"
  wrong because reports, old names, and habits are inherited frames.

"everything is evidence"
  wrong because a report is only evidence that someone claimed it.

"everything is first principles"
  wrong because goals, constraints, and artifacts are not the same kind of
  truth.

"none checked"
  valid only when evidence_checked also says no direct evidence was read.
```

## Stop Condition

Return to the main skill when the three slots are distinct enough that
`rebuilt_model` can name what is known, what was inherited, and what still
needs proof.

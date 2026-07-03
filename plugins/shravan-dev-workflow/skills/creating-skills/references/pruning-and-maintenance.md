# Pruning And Maintenance

Mission / stance:
Make the skill smaller by removing or moving text, not by smoothing redundant
text into nicer prose.

When to use:
- A skill has duplicated guidance, stale sediment, no-op prose, sprawl, unclear
  ownership, or branch material repeated in several places.
- A reference repeats boilerplate owned by `SKILL.md`.
- Branch-only material has drifted into the main body.

How to inspect:
Find duplication, sediment, sprawl, and no-op text. Move branch-only detail to
references and all-branch rules back to `SKILL.md`. Delete instead of rewriting
when a line does not earn its place. Retest the behavior that justified retained
wording.

Good signals:
- every retained line has a job
- duplicated all-branch material is removed
- reference files do not repeat source/provenance or generic output wrappers
- retest requirement is named for behavior-preserving edits

Bad signals:
- rewriting no-op text instead of deleting it
- preserving process history in skill references
- keeping branch-only detail in `SKILL.md` because it feels important
- repeating the same output wrapper in every reference

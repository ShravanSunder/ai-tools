# 2026-07-28 Skills Creation Lane And Reference Contracts

Plugin: `shravan-dev-workflow` 1.6.71

## User-visible behavior

`skills-creation` now demonstrates the lane, reference, schema, and progressive-disclosure contracts it teaches:

- a lane is bounded work dispatched to a subagent, while a lane reference defines that work;
- lane schemas contain shared field shapes and semantics; review dispatch and receipt lifecycle live in the review workflow;
- ordinary references, lane references, output schemas, and tool schemas have distinct final homes;
- required reference reads use explicit all-run or conditional calls with concrete returned results;
- every review lane states its read-only maximum authority, stop condition, and shaped output;
- authoring and review guidance lead with the action, result, and quality bar, using prohibitions only for named failure boundaries paired with the positive target;
- the skill frontmatter is a trigger instead of a workflow summary.

## Changed surfaces

- `skills/skills-creation/SKILL.md`
- `skills/skills-creation/references/`
- `skills/skills-creation/references/review/`
- Codex and Claude plugin manifests
- Claude marketplace version metadata

The Codex marketplace continues to resolve the version from the source plugin manifest and therefore has no separate version field to update.

## Validation

- `git diff --check`: passed.
- Codex skill quick validator: passed (`Skill is valid!`).
- `claude plugin validate .`: passed.
- Fixed call-target existence check: passed.
- Review-lane structure: eight lanes, eight maximum-authority statements, eight stop conditions, eight output contracts, and zero duplicate schema loads.
- Pressure testing: not run in this changeset. The PR remains the source-contract and static-validation release; pressure-judge work is owned by the separate pressure-system change.

## Refresh / reinstall

- Source metadata is prepared for `1.6.71`.
- Codex and Claude installed-cache refresh is performed after merge so both clients read the merged marketplace source.
